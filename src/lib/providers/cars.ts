import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { CarListing, CarSearchResult, CarPricingBreakdown, RentalDurationTier, RentalCompany, VehicleCategory } from '@/lib/cars/types';
import { computeCarPricing, type CarPricingOptions } from '@/lib/cars/pricing';
import { RENTAL_COMPANIES, RENTAL_COMPANIES_BY_ID } from '@/lib/cars/companies';
import { VEHICLES_BY_ID } from '@/lib/cars/vehicles';
import { LOCATIONS_BY_ID } from '@/lib/cars/locations';

const DATA_DIR = join(process.cwd(), 'src', 'data', 'generated', 'cars');

// Known-good Unsplash photo URLs, bucketed by vehicle category — a stand-in for
// card/hero thumbnails until a real image DAM resolves each listing's unsplashQuery to
// an actual photo. Every photo ID below was verified to resolve (HTTP 200) before being
// committed. Assignment is deterministic per listing slug, mirroring the cruises pattern.
const IMAGE_POOLS = {
  sedan: [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop&q=60',
  ],
  suv: [
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800&auto=format&fit=crop&q=60',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=60',
  ],
  sports: [
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=60',
  ],
  ev: [
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=60',
  ],
  van: [
    'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=60',
  ],
  pickup: [
    'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&auto=format&fit=crop&q=60',
  ],
} as const;

function imageHashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h || 1;
}

export function getDisplayImageUrl(slug: string, category: VehicleCategory): string {
  let bucket: keyof typeof IMAGE_POOLS = 'sedan';
  if (category === 'Electric Vehicle') bucket = 'ev';
  else if (category.includes('SUV')) bucket = 'suv';
  else if (category === 'Sports Car' || category === 'Convertible') bucket = 'sports';
  else if (category === 'Luxury' || category === 'Executive' || category === 'Limousine' || category === 'Premium') bucket = 'luxury';
  else if (category.includes('Van') || category === 'Minivan' || category === 'Motorhome / RV') bucket = 'van';
  else if (category === 'Pickup Truck') bucket = 'pickup';

  const pool = IMAGE_POOLS[bucket];
  return pool[imageHashSeed(slug) % pool.length];
}

const COMPANY_LOGO_BY_NAME: Record<string, string> = Object.fromEntries(
  RENTAL_COMPANIES.filter((c) => c.logoUrl).map((c) => [c.name, c.logoUrl as string])
);

/** CarSearchResult (index shape) carries the company's display name, not its id. */
export function getCarCompanyLogoUrl(companyName: string): string | undefined {
  return COMPANY_LOGO_BY_NAME[companyName];
}

// ---------- Cached loaders ----------

let companiesCache: RentalCompany[] | null = null;
export function loadCarCompanies(): RentalCompany[] {
  if (!companiesCache) {
    try {
      companiesCache = JSON.parse(readFileSync(join(DATA_DIR, 'companies.json'), 'utf8')) as RentalCompany[];
    } catch {
      companiesCache = [];
    }
  }
  return companiesCache;
}

export function getCarCompanyById(id: string): RentalCompany | undefined {
  return loadCarCompanies().find((c) => c.id === id);
}

let indexCache: CarSearchResult[] | null = null;
export function loadCarsIndex(): CarSearchResult[] {
  if (!indexCache) {
    try {
      indexCache = JSON.parse(readFileSync(join(DATA_DIR, 'listings-index.json'), 'utf8')) as CarSearchResult[];
    } catch {
      indexCache = [];
    }
  }
  return indexCache;
}

export interface CarFacets {
  companies: string[];
  countries: string[];
  cities: string[];
  categories: string[];
  brands: string[];
}

let facetsCache: CarFacets | null = null;
export function getCarFacets(): CarFacets {
  if (!facetsCache) {
    const index = loadCarsIndex();
    facetsCache = {
      companies: Array.from(new Set(index.map((c) => c.companyName))).filter(Boolean).sort(),
      countries: Array.from(new Set(index.map((c) => c.country))).filter(Boolean).sort(),
      cities: Array.from(new Set(index.map((c) => c.city))).filter(Boolean).sort(),
      categories: Array.from(new Set(index.map((c) => c.category))).filter(Boolean).sort(),
      brands: Array.from(new Set(index.map((c) => c.brand))).filter(Boolean).sort(),
    };
  }
  return facetsCache;
}

const detailCache = new Map<string, CarListing>();
export function getCarBySlug(slug: string): CarListing | null {
  const cached = detailCache.get(slug);
  if (cached) return cached;
  try {
    const listing = JSON.parse(readFileSync(join(DATA_DIR, 'listings', `${slug}.json`), 'utf8')) as CarListing;
    detailCache.set(slug, listing);
    return listing;
  } catch {
    return null;
  }
}

export function listAllCarSlugs(): string[] {
  try {
    return readdirSync(join(DATA_DIR, 'listings'))
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}

// ---------- Live pricing ----------

export function getCarPricing(
  listing: CarListing,
  originMarketCode: string,
  durationTier: RentalDurationTier,
  options: CarPricingOptions = {}
): CarPricingBreakdown {
  const company = RENTAL_COMPANIES_BY_ID[listing.companyId];
  const vehicle = VEHICLES_BY_ID[listing.vehicleId];
  const location = LOCATIONS_BY_ID[listing.locationId];
  if (!company || !vehicle || !location) {
    throw new Error('Company, vehicle, or location metadata missing for pricing calculation.');
  }
  return computeCarPricing(company, vehicle, location, originMarketCode, durationTier, options);
}

// ---------- Paginated search ----------

export interface CarSearchParams {
  q?: string;
  companies?: string[];
  countries?: string[];
  cities?: string[];
  categories?: string[];
  brands?: string[];
  transmission?: 'Automatic' | 'Manual';
  evOnly?: boolean;
  hybridOnly?: boolean;
  luxuryOnly?: boolean;
  minSeats?: number;
  minPrice?: number;
  maxPrice?: number;
  airportPickup?: boolean;
  unlimitedMileage?: boolean;
  freeCancellation?: boolean;
  petFriendly?: boolean;
  oneWay?: boolean;
  page?: number; // 1-indexed
  limit?: number;
}

export interface CarSearchResponse {
  results: CarSearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function searchCars(params: CarSearchParams = {}): Promise<CarSearchResponse> {
  const index = loadCarsIndex();
  let filtered = index;

  const q = (params.q || '').trim().toLowerCase();
  if (q) {
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.companyName.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.locationName.toLowerCase().includes(q) ||
        c.aiSearchTags.some((tag) => tag.includes(q))
    );
  }

  if (params.companies?.length) {
    const set = new Set(params.companies);
    filtered = filtered.filter((c) => set.has(c.companyName));
  }
  if (params.countries?.length) {
    const set = new Set(params.countries);
    filtered = filtered.filter((c) => set.has(c.country));
  }
  if (params.cities?.length) {
    const set = new Set(params.cities);
    filtered = filtered.filter((c) => set.has(c.city));
  }
  if (params.categories?.length) {
    const set = new Set(params.categories);
    filtered = filtered.filter((c) => set.has(c.category));
  }
  if (params.brands?.length) {
    const set = new Set(params.brands);
    filtered = filtered.filter((c) => set.has(c.brand));
  }
  if (params.transmission) {
    filtered = filtered.filter((c) => c.transmission === params.transmission);
  }
  if (params.evOnly) {
    filtered = filtered.filter((c) => c.filters?.ev === true);
  }
  if (params.hybridOnly) {
    filtered = filtered.filter((c) => c.filters?.hybrid === true);
  }
  if (params.luxuryOnly) {
    filtered = filtered.filter((c) => c.filters?.luxury === true);
  }
  if (params.minSeats !== undefined) {
    filtered = filtered.filter((c) => c.seats >= params.minSeats!);
  }
  if (params.minPrice !== undefined) {
    filtered = filtered.filter((c) => c.fromPricePerDayUSD >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((c) => c.fromPricePerDayUSD <= params.maxPrice!);
  }
  if (params.airportPickup) {
    filtered = filtered.filter((c) => c.filters?.airportPickup === true);
  }
  if (params.unlimitedMileage) {
    filtered = filtered.filter((c) => c.filters?.unlimitedMileage === true);
  }
  if (params.freeCancellation) {
    filtered = filtered.filter((c) => c.filters?.freeCancellation === true);
  }
  if (params.petFriendly) {
    filtered = filtered.filter((c) => c.filters?.petFriendly === true);
  }
  if (params.oneWay) {
    filtered = filtered.filter((c) => c.filters?.oneWayAvailable === true);
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
