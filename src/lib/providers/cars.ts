import { gunzipSync } from 'node:zlib';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import type { CarListing, CarSearchResult, CarPricingBreakdown, RentalDurationTier, RentalCompany, VehicleCategory, Transmission, FuelType, LocationType, CompanyTier, CarImageAsset, CarSearchFilters } from '@/lib/cars/types';
import { computeCarPricing, type CarPricingOptions } from '@/lib/cars/pricing';
import { RENTAL_COMPANIES, RENTAL_COMPANIES_BY_ID } from '@/lib/cars/companies';
import { VEHICLES_BY_ID } from '@/lib/cars/vehicles';
import { LOCATIONS_BY_ID } from '@/lib/cars/locations';
import { generateCompanyReviews } from '@/lib/cars/generator';

// The car rental catalog lives in Postgres (CarCatalog table): searchable columns for
// list/filter pages plus the full CarListing payload gzipped per row. It used to be
// 17,165 JSON files read via readFileSync, which dragged ~360MB into every serverless
// bundle that imported this module and pushed Vercel past the Hobby-plan function cap.
// Seeded by scripts/seed-catalog-db.ts after scripts/generate-cars.ts.

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

// Companies are small curated TS data; their 20 reviews are deterministic, so they're
// generated on demand rather than stored — no DB or filesystem involved.
const companiesCache = new Map<string, RentalCompany>();
export function getCarCompanyById(id: string): RentalCompany | undefined {
  const cached = companiesCache.get(id);
  if (cached) return cached;
  const facts = RENTAL_COMPANIES_BY_ID[id];
  if (!facts) return undefined;
  const company: RentalCompany = { ...facts, reviews: generateCompanyReviews(facts) };
  companiesCache.set(id, company);
  return company;
}

export function loadCarCompanies(): RentalCompany[] {
  return RENTAL_COMPANIES.map((c) => getCarCompanyById(c.id)!)
}

export interface CarFacets {
  companies: string[];
  countries: string[];
  cities: string[];
  categories: string[];
  brands: string[];
}

let facetsCache: CarFacets | null = null;
export async function getCarFacets(): Promise<CarFacets> {
  if (!facetsCache) {
    const [companies, countries, cities, categories, brands] = await Promise.all([
      prisma.carCatalog.findMany({ distinct: ['companyName'], select: { companyName: true }, orderBy: { companyName: 'asc' } }),
      prisma.carCatalog.findMany({ distinct: ['country'], select: { country: true }, orderBy: { country: 'asc' } }),
      prisma.carCatalog.findMany({ distinct: ['city'], select: { city: true }, orderBy: { city: 'asc' } }),
      prisma.carCatalog.findMany({ distinct: ['category'], select: { category: true }, orderBy: { category: 'asc' } }),
      prisma.carCatalog.findMany({ distinct: ['brand'], select: { brand: true }, orderBy: { brand: 'asc' } }),
    ]);
    facetsCache = {
      companies: companies.map((r) => r.companyName),
      countries: countries.map((r) => r.country),
      cities: cities.map((r) => r.city),
      categories: categories.map((r) => r.category),
      brands: brands.map((r) => r.brand),
    };
  }
  return facetsCache;
}

// Small per-instance cache for decompressed detail payloads.
const detailCache = new Map<string, CarListing>();
const DETAIL_CACHE_MAX = 300;

export async function getCarBySlug(slug: string): Promise<CarListing | null> {
  const cached = detailCache.get(slug);
  if (cached) return cached;

  const row = await prisma.carCatalog.findUnique({ where: { slug }, select: { detail: true } });
  if (!row) return null;

  const listing = JSON.parse(gunzipSync(Buffer.from(row.detail)).toString('utf8')) as CarListing;
  if (detailCache.size >= DETAIL_CACHE_MAX) {
    const oldest = detailCache.keys().next().value;
    if (oldest) detailCache.delete(oldest);
  }
  detailCache.set(slug, listing);
  return listing;
}

export async function listAllCarSlugs(): Promise<string[]> {
  const rows = await prisma.carCatalog.findMany({ select: { slug: true }, orderBy: { slug: 'asc' } });
  return rows.map((r) => r.slug);
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
  const where: Prisma.CarCatalogWhereInput = {};

  const q = (params.q || '').trim().toLowerCase();
  if (q) where.searchText = { contains: q };
  if (params.companies?.length) where.companyName = { in: params.companies };
  if (params.countries?.length) where.country = { in: params.countries };
  if (params.cities?.length) where.city = { in: params.cities };
  if (params.categories?.length) where.category = { in: params.categories };
  if (params.brands?.length) where.brand = { in: params.brands };
  if (params.transmission) where.transmission = params.transmission;
  if (params.evOnly) where.ev = true;
  if (params.hybridOnly) where.hybrid = true;
  if (params.luxuryOnly) where.luxury = true;
  if (params.minSeats !== undefined) where.seats = { gte: params.minSeats };
  if (params.airportPickup) where.airportPickup = true;
  if (params.unlimitedMileage) where.unlimitedMileage = true;
  if (params.freeCancellation) where.freeCancellation = true;
  if (params.petFriendly) where.petFriendly = true;
  if (params.oneWay) where.oneWayAvailable = true;
  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.fromPricePerDayUSD = {
      ...(params.minPrice !== undefined ? { gte: Math.floor(params.minPrice) } : {}),
      ...(params.maxPrice !== undefined ? { lte: Math.ceil(params.maxPrice) } : {}),
    };
  }

  const limit = params.limit && params.limit > 0 ? params.limit : 24;
  const total = await prisma.carCatalog.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(Math.max(1, params.page ?? 1), totalPages);

  const rows = await prisma.carCatalog.findMany({
    where,
    orderBy: { slug: 'asc' },
    skip: (page - 1) * limit,
    take: limit,
    omit: { detail: true, searchText: true },
  });

  const results: CarSearchResult[] = rows.map((r) => ({
    id: `CAR-${r.slug.toUpperCase()}`,
    slug: r.slug,
    title: r.title,
    companyName: r.companyName,
    companyTier: r.companyTier as CompanyTier,
    brand: r.brand,
    model: r.model,
    year: r.year,
    category: r.category as VehicleCategory,
    transmission: r.transmission as Transmission,
    fuelType: r.fuelType as FuelType,
    seats: r.seats,
    doors: r.doors,
    luggage: r.luggage,
    locationName: r.locationName,
    locationType: r.locationType as LocationType,
    city: r.city,
    country: r.country,
    countryCode: r.countryCode,
    fromPricePerDayUSD: r.fromPricePerDayUSD,
    ratingOverall: r.ratingOverall,
    reviewCount: r.reviewCount,
    heroImage: r.heroImage as unknown as CarImageAsset,
    aiSearchTags: [],
    filters: r.filters as Partial<CarSearchFilters>,
  }));

  return { results, total, page, limit, totalPages };
}
