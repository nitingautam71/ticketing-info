import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { computePricing } from '@/lib/packages/pricing';
import type { DestinationFacts, PricingBreakdown, PricingTier, TravelerType, TravelPackage } from '@/lib/packages/types';

// Serves the generated package dataset (run `npm run generate:packages` to build it —
// see src/lib/packages/generator.ts) from src/data/generated/. Read from disk with an
// in-memory cache rather than bundled via static import, so a 300-file dataset doesn't
// get pulled into every route's JS bundle.

export interface VacationPackage {
  id: string;
  name: string;
  destination: string;
  durationDays: number;
  price: number;
  image: string;
  rating: number;
  includes: string[];
  highlights: string[];
}

export interface PackageSearchParams {
  destination?: string;
  category?: string;
  minDuration?: number;
  maxDuration?: number;
}

interface PackageIndexEntry {
  id: string;
  slug: string;
  destinationSlug: string;
  destinationName: string;
  country: string;
  region: string;
  durationDays: number;
  durationNights: number;
  title: string;
  categories: string[];
  fromPriceUSD: number;
  ratingOverall: number;
  reviewCount: number;
  highlights: string[];
}

const DATA_DIR = join(process.cwd(), 'src', 'data', 'generated');

// Known-good Unsplash photo URLs already used elsewhere in this app (hotels.ts,
// the original package mocks) — a stand-in for card thumbnails until a real image
// search/DAM integration resolves each package's ImageAsset.unsplashQuery to an
// actual photo. Assignment is deterministic per package slug.
const DISPLAY_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=60',
];

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h || 1;
}

export function getDisplayImageUrl(slug: string): string {
  return DISPLAY_IMAGE_POOL[hashSeed(slug) % DISPLAY_IMAGE_POOL.length];
}

let indexCache: PackageIndexEntry[] | null = null;
function loadIndex(): PackageIndexEntry[] {
  if (!indexCache) {
    indexCache = JSON.parse(readFileSync(join(DATA_DIR, 'packages-index.json'), 'utf8')) as PackageIndexEntry[];
  }
  return indexCache;
}

const detailCache = new Map<string, TravelPackage>();
export function getPackageBySlug(slug: string): TravelPackage | null {
  const cached = detailCache.get(slug);
  if (cached) return cached;
  try {
    const pkg = JSON.parse(readFileSync(join(DATA_DIR, 'packages', `${slug}.json`), 'utf8')) as TravelPackage;
    detailCache.set(slug, pkg);
    return pkg;
  } catch {
    return null;
  }
}

export function listAllPackageSlugs(): string[] {
  return readdirSync(join(DATA_DIR, 'packages'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

let destinationsCache: DestinationFacts[] | null = null;
const destinationBySlug = new Map<string, DestinationFacts>();
function getDestination(slug: string): DestinationFacts {
  if (!destinationsCache) {
    destinationsCache = JSON.parse(readFileSync(join(DATA_DIR, 'destinations.json'), 'utf8')) as DestinationFacts[];
    for (const d of destinationsCache) destinationBySlug.set(d.slug, d);
  }
  const d = destinationBySlug.get(slug);
  if (!d) throw new Error(`Unknown destination slug: ${slug}`);
  return d;
}

export function getPackagePricing(pkg: TravelPackage, originMarketCode: string, travelerType: TravelerType, tier: PricingTier): PricingBreakdown {
  return computePricing(getDestination(pkg.destinationSlug), pkg.durationDays, originMarketCode, travelerType, tier);
}

export function getAllPricingTiers(pkg: TravelPackage, originMarketCode: string, travelerType: TravelerType): Record<PricingTier, PricingBreakdown> {
  const tiers: PricingTier[] = ['budget', 'midRange', 'premium', 'luxury'];
  return Object.fromEntries(tiers.map((tier) => [tier, getPackagePricing(pkg, originMarketCode, travelerType, tier)])) as Record<PricingTier, PricingBreakdown>;
}

export async function searchPackages(params: PackageSearchParams): Promise<VacationPackage[]> {
  const index = loadIndex();
  const q = (params.destination || '').trim().toLowerCase();

  let filtered: PackageIndexEntry[];
  if (!q && !params.category) {
    // Browse-all view: one representative (7-day) card per destination, best-rated first.
    const bySlug = new Map<string, PackageIndexEntry>();
    for (const p of index) {
      if (p.durationDays === 7) bySlug.set(p.destinationSlug, p);
    }
    filtered = [...bySlug.values()].sort((a, b) => b.ratingOverall - a.ratingOverall);
  } else {
    filtered = index.filter(
      (p) => !q || p.destinationName.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.region.toLowerCase().includes(q) || p.title.toLowerCase().includes(q),
    );
  }

  if (params.category) filtered = filtered.filter((p) => p.categories.includes(params.category!));
  if (params.minDuration != null) filtered = filtered.filter((p) => p.durationDays >= params.minDuration!);
  if (params.maxDuration != null) filtered = filtered.filter((p) => p.durationDays <= params.maxDuration!);

  return filtered.slice(0, 60).map(
    (p): VacationPackage => ({
      id: p.id,
      name: p.title,
      destination: `${p.destinationName}, ${p.country}`,
      durationDays: p.durationDays,
      price: p.fromPriceUSD,
      image: getDisplayImageUrl(p.slug),
      rating: p.ratingOverall,
      includes: ['Round-trip flights', 'Hotel accommodation', 'Airport transfers', 'Daily breakfast', 'Guided tours'],
      highlights: p.highlights,
    }),
  );
}
