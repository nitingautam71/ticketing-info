import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { CruisePackage, CruiseSearchResult, CruisePricingBreakdown, CruiseTravelerType, CruisePricingTier, CruiseLine, Ship, CruisePort } from '@/lib/cruises/types';
import { computeCruisePricing } from '@/lib/cruises/pricing';
import { CRUISE_LINES_BY_ID } from '@/lib/cruises/cruise-lines';
import { SHIPS_BY_ID } from '@/lib/cruises/ships';
import { PORTS_BY_ID } from '@/lib/cruises/ports';

const DATA_DIR = join(process.cwd(), 'src', 'data', 'generated', 'cruises');

// Known-good Unsplash photo URLs, bucketed by cruise type — a stand-in for card/hero
// thumbnails until a real image search/DAM integration resolves each package's
// CruiseImageAsset.unsplashQuery to an actual photo. Assignment is deterministic per
// package slug (same photo every render), mirroring src/lib/providers/packages.ts.
const IMAGE_POOLS = {
  river: [
    'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1592850252902-63e5f13cd3ce?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1541411032641-cd3d3bf6c94a?w=800&auto=format&fit=crop&q=60',
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
    'https://images.unsplash.com/photo-1580541631971-c8f5241f5e1b?w=800&auto=format&fit=crop&q=60',
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

// Static lists cache
let cruiseLinesCache: CruiseLine[] | null = null;
let shipsCache: Ship[] | null = null;
let portsCache: CruisePort[] | null = null;

export function loadCruiseLines(): CruiseLine[] {
  if (!cruiseLinesCache) {
    try {
      cruiseLinesCache = JSON.parse(readFileSync(join(DATA_DIR, 'cruise-lines.json'), 'utf8')) as CruiseLine[];
    } catch {
      cruiseLinesCache = [];
    }
  }
  return cruiseLinesCache;
}

export function loadShips(): Ship[] {
  if (!shipsCache) {
    try {
      shipsCache = JSON.parse(readFileSync(join(DATA_DIR, 'ships.json'), 'utf8')) as Ship[];
    } catch {
      shipsCache = [];
    }
  }
  return shipsCache;
}

export function loadPorts(): CruisePort[] {
  if (!portsCache) {
    try {
      portsCache = JSON.parse(readFileSync(join(DATA_DIR, 'ports.json'), 'utf8')) as CruisePort[];
    } catch {
      portsCache = [];
    }
  }
  return portsCache;
}

let indexCache: CruiseSearchResult[] | null = null;
export function loadCruisesIndex(): CruiseSearchResult[] {
  if (!indexCache) {
    try {
      indexCache = JSON.parse(readFileSync(join(DATA_DIR, 'packages-index.json'), 'utf8')) as CruiseSearchResult[];
    } catch {
      indexCache = [];
    }
  }
  return indexCache;
}

export interface CruiseFacets {
  destinations: string[];
  cruiseLines: string[];
  departurePorts: string[];
}

let facetsCache: CruiseFacets | null = null;
export function getCruiseFacets(): CruiseFacets {
  if (!facetsCache) {
    const index = loadCruisesIndex();
    facetsCache = {
      destinations: Array.from(new Set(index.map((c) => c.destination))).filter(Boolean).sort(),
      cruiseLines: Array.from(new Set(index.map((c) => c.cruiseLineName))).filter(Boolean).sort(),
      departurePorts: Array.from(new Set(index.map((c) => c.departurePortName))).filter(Boolean).sort(),
    };
  }
  return facetsCache;
}

const detailCache = new Map<string, CruisePackage>();
export function getCruiseBySlug(slug: string): CruisePackage | null {
  const cached = detailCache.get(slug);
  if (cached) return cached;
  try {
    const pkg = JSON.parse(readFileSync(join(DATA_DIR, 'packages', `${slug}.json`), 'utf8')) as CruisePackage;
    detailCache.set(slug, pkg);
    return pkg;
  } catch {
    return null;
  }
}

export function listAllCruiseSlugs(): string[] {
  try {
    return readdirSync(join(DATA_DIR, 'packages'))
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''));
  } catch {
    return [];
  }
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

// Search/filter matching against the full in-memory index, with real pagination.
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
  const index = loadCruisesIndex();
  let filtered = index;

  const q = (params.q || '').trim().toLowerCase();
  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.cruiseLineName.toLowerCase().includes(q) ||
        p.shipName.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        p.departurePortName.toLowerCase().includes(q) ||
        p.aiSearchTags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (params.destinations?.length) {
    const set = new Set(params.destinations);
    filtered = filtered.filter((p) => set.has(p.destination));
  }

  if (params.durations?.length) {
    const set = new Set(params.durations);
    filtered = filtered.filter((p) => p.filters?.duration?.some((d) => set.has(d)));
  }

  if (params.cruiseLines?.length) {
    const set = new Set(params.cruiseLines);
    filtered = filtered.filter((p) => set.has(p.cruiseLineName));
  }

  if (params.departurePorts?.length) {
    const set = new Set(params.departurePorts);
    filtered = filtered.filter((p) => set.has(p.departurePortName));
  }

  if (params.riverCruise !== undefined) {
    filtered = filtered.filter((p) => p.filters?.riverCruise === params.riverCruise);
  }

  if (params.oceanCruise !== undefined) {
    filtered = filtered.filter((p) => p.filters?.oceanCruise === params.oceanCruise);
  }

  if (params.adultsOnly) {
    filtered = filtered.filter((p) => p.filters?.adultsOnly === true);
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.fromPriceUSD >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.fromPriceUSD <= params.maxPrice!);
  }

  const total = filtered.length;
  const limit = params.limit && params.limit > 0 ? params.limit : 24;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(Math.max(1, params.page ?? 1), totalPages);
  const start = (page - 1) * limit;

  return {
    results: filtered.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  };
}
