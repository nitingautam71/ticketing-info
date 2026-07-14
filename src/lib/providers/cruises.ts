import { gunzipSync } from 'node:zlib';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import type { CruisePackage, CruiseSearchResult, CruisePricingBreakdown, CruiseTravelerType, CruisePricingTier, CruiseLine, Ship, CruisePort, CruiseImageAsset, CruiseSearchFilters, CruiseCategory } from '@/lib/cruises/types';
import { computeCruisePricing } from '@/lib/cruises/pricing';
import { CRUISE_LINES, CRUISE_LINES_BY_ID } from '@/lib/cruises/cruise-lines';
import { SHIPS, SHIPS_BY_ID } from '@/lib/cruises/ships';
import { PORTS, PORTS_BY_ID } from '@/lib/cruises/ports';

// The cruise catalog lives in Postgres (CruiseCatalog table): searchable columns for
// list/filter pages plus the full CruisePackage payload gzipped per row. It used to be
// 10,641 JSON files read via readFileSync, which dragged ~490MB into every serverless
// bundle that imported this module and pushed Vercel past the Hobby-plan function cap.
// Seeded by scripts/seed-catalog-db.ts after scripts/generate-cruises.ts.

// Known-good Unsplash photo URLs, bucketed by cruise type — a stand-in for card/hero
// thumbnails until a real image search/DAM integration resolves each package's
// CruiseImageAsset.unsplashQuery to an actual photo. Assignment is deterministic per
// package slug (same photo every render), mirroring src/lib/providers/packages.ts.
const IMAGE_POOLS = {
  river: [
    'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&auto=format&fit=crop&q=60',
  ],
  expedition: [
    'https://images.unsplash.com/photo-1478827387698-1527781a4887?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&auto=format&fit=crop&q=60',
  ],
  tropical: [
    'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&auto=format&fit=crop&q=60',
  ],
  ocean: [
    'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=60',
  ],
} as const;

const TROPICAL_DESTINATIONS = new Set(['Caribbean', 'Bahamas', 'Hawaii', 'South Pacific', 'Mexican Riviera']);

function imageHashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h || 1;
}

export function getDisplayImageUrl(slug: string, destination: string, categories: string[] = []): string {
  let bucket: keyof typeof IMAGE_POOLS = 'ocean';
  if (destination.toLowerCase().includes('river')) bucket = 'river';
  else if (destination === 'Antarctica' || destination === 'Arctic' || categories.includes('Expedition Cruises')) bucket = 'expedition';
  else if (TROPICAL_DESTINATIONS.has(destination)) bucket = 'tropical';

  const pool = IMAGE_POOLS[bucket];
  return pool[imageHashSeed(slug) % pool.length];
}

const CRUISE_LINE_LOGO_BY_NAME: Record<string, string> = Object.fromEntries(
  CRUISE_LINES.filter((l) => l.logoUrl).map((l) => [l.name, l.logoUrl as string])
);

/** CruiseSearchResult (the search-index shape) only carries the line's display name, not its id. */
export function getCruiseLineLogoUrl(cruiseLineName: string): string | undefined {
  return CRUISE_LINE_LOGO_BY_NAME[cruiseLineName];
}

// Entity lists are small curated TS data — served straight from the modules.
export function loadCruiseLines(): CruiseLine[] {
  return CRUISE_LINES;
}

export function loadShips(): Ship[] {
  return SHIPS;
}

export function loadPorts(): CruisePort[] {
  return PORTS;
}

export interface CruiseFacets {
  destinations: string[];
  cruiseLines: string[];
  departurePorts: string[];
}

let facetsCache: CruiseFacets | null = null;
export async function getCruiseFacets(): Promise<CruiseFacets> {
  if (!facetsCache) {
    const [destinations, cruiseLines, departurePorts] = await Promise.all([
      prisma.cruiseCatalog.findMany({ distinct: ['destination'], select: { destination: true }, orderBy: { destination: 'asc' } }),
      prisma.cruiseCatalog.findMany({ distinct: ['cruiseLineName'], select: { cruiseLineName: true }, orderBy: { cruiseLineName: 'asc' } }),
      prisma.cruiseCatalog.findMany({ distinct: ['departurePortName'], select: { departurePortName: true }, orderBy: { departurePortName: 'asc' } }),
    ]);
    facetsCache = {
      destinations: destinations.map((r) => r.destination),
      cruiseLines: cruiseLines.map((r) => r.cruiseLineName),
      departurePorts: departurePorts.map((r) => r.departurePortName),
    };
  }
  return facetsCache;
}

// Small per-instance cache for decompressed detail payloads.
const detailCache = new Map<string, CruisePackage>();
const DETAIL_CACHE_MAX = 300;

export async function getCruiseBySlug(slug: string): Promise<CruisePackage | null> {
  const cached = detailCache.get(slug);
  if (cached) return cached;

  const row = await prisma.cruiseCatalog.findUnique({ where: { slug }, select: { detail: true } });
  if (!row) return null;

  const pkg = JSON.parse(gunzipSync(Buffer.from(row.detail)).toString('utf8')) as CruisePackage;
  if (detailCache.size >= DETAIL_CACHE_MAX) {
    const oldest = detailCache.keys().next().value;
    if (oldest) detailCache.delete(oldest);
  }
  detailCache.set(slug, pkg);
  return pkg;
}

export async function listAllCruiseSlugs(): Promise<string[]> {
  const rows = await prisma.cruiseCatalog.findMany({ select: { slug: true }, orderBy: { slug: 'asc' } });
  return rows.map((r) => r.slug);
}

export function getCruisePricing(
  pkg: CruisePackage,
  originMarketCode: string,
  travelerType: CruiseTravelerType,
  tier: CruisePricingTier
): CruisePricingBreakdown {
  const line = CRUISE_LINES_BY_ID[pkg.cruiseLineId];
  const ship = SHIPS_BY_ID[pkg.shipId];
  const departurePort = PORTS_BY_ID[pkg.departurePortId] || { lat: 25.7781, lon: -80.1774 };

  if (!line || !ship) {
    throw new Error('Cruise line or ship metadata missing for pricing calculation.');
  }

  return computeCruisePricing(
    line,
    ship,
    pkg.destination,
    pkg.durationNights,
    departurePort.lat,
    departurePort.lon,
    originMarketCode,
    travelerType,
    tier
  );
}

export function getAllCruisePricingTiers(
  pkg: CruisePackage,
  originMarketCode: string,
  travelerType: CruiseTravelerType
): Record<CruisePricingTier, CruisePricingBreakdown> {
  const tiers: CruisePricingTier[] = ['budget', 'midRange', 'premium', 'luxury'];
  return Object.fromEntries(
    tiers.map((tier) => [tier, getCruisePricing(pkg, originMarketCode, travelerType, tier)])
  ) as Record<CruisePricingTier, CruisePricingBreakdown>;
}

// Search/filter matching against the catalog table, with real pagination.
export interface CruiseSearchParams {
  q?: string;
  destinations?: string[];
  cruiseLines?: string[];
  departurePorts?: string[];
  durations?: string[];
  minPrice?: number;
  maxPrice?: number;
  riverCruise?: boolean;
  oceanCruise?: boolean;
  adultsOnly?: boolean;
  page?: number; // 1-indexed
  limit?: number;
}

export interface CruiseSearchResponse {
  results: CruiseSearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function searchCruises(params: CruiseSearchParams = {}): Promise<CruiseSearchResponse> {
  const where: Prisma.CruiseCatalogWhereInput = {};

  const q = (params.q || '').trim().toLowerCase();
  if (q) where.searchText = { contains: q };
  if (params.destinations?.length) where.destination = { in: params.destinations };
  if (params.cruiseLines?.length) where.cruiseLineName = { in: params.cruiseLines };
  if (params.departurePorts?.length) where.departurePortName = { in: params.departurePorts };
  if (params.durations?.length) where.durationCats = { hasSome: params.durations };
  if (params.riverCruise !== undefined) where.riverCruise = params.riverCruise;
  if (params.oceanCruise !== undefined) where.oceanCruise = params.oceanCruise;
  if (params.adultsOnly) where.adultsOnly = true;
  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.fromPriceUSD = {
      ...(params.minPrice !== undefined ? { gte: Math.floor(params.minPrice) } : {}),
      ...(params.maxPrice !== undefined ? { lte: Math.ceil(params.maxPrice) } : {}),
    };
  }

  const limit = params.limit && params.limit > 0 ? params.limit : 24;
  const total = await prisma.cruiseCatalog.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(Math.max(1, params.page ?? 1), totalPages);

  const rows = await prisma.cruiseCatalog.findMany({
    where,
    orderBy: { slug: 'asc' },
    skip: (page - 1) * limit,
    take: limit,
    omit: { detail: true, searchText: true },
  });

  const results: CruiseSearchResult[] = rows.map((r) => ({
    id: `PKG-CRUISE-${r.slug.toUpperCase()}`,
    slug: r.slug,
    title: r.title,
    cruiseLineName: r.cruiseLineName,
    shipName: r.shipName,
    destination: r.destination,
    departurePortName: r.departurePortName,
    arrivalPortName: r.arrivalPortName,
    durationNights: r.durationNights,
    categories: r.categories as CruiseCategory[],
    fromPriceUSD: r.fromPriceUSD,
    ratingOverall: r.ratingOverall,
    reviewCount: r.reviewCount,
    heroImage: r.heroImage as unknown as CruiseImageAsset,
    aiSearchTags: [],
    filters: r.filters as Partial<CruiseSearchFilters>,
  }));

  return { results, total, page, limit, totalPages };
}
