// Generates the car rental catalog from curated entity data (companies, vehicles,
// locations). Deterministic — re-running produces identical output unless entity data
// or a generator rule changed. Every listing is a genuine, distinct company x vehicle x
// location combination gated by realistic eligibility rules — no synthetic padding.
//
// Usage: npx tsx scripts/generate-cars.ts
//
// Output:
//   src/data/generated/cars/companies.json      - 15 companies incl. 20 reviews each
//   src/data/generated/cars/vehicles.json       - curated vehicle models
//   src/data/generated/cars/locations.json      - worldwide pickup locations
//   src/data/generated/cars/listings/<slug>.json - one file per listing, full detail
//   src/data/generated/cars/listings-index.json - lightweight list for search pages

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RENTAL_COMPANIES, type RentalCompanyFacts } from '../src/lib/cars/companies';
import { VEHICLES } from '../src/lib/cars/vehicles';
import { LOCATIONS } from '../src/lib/cars/locations';
import { generateCarListing, generateCompanyReviews } from '../src/lib/cars/generator';
import type { CarListing, CarSearchResult, RentalLocation, VehicleModel } from '../src/lib/cars/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUT_ROOT = join(__dirname, '..', 'src', 'data', 'generated', 'cars');
const LISTINGS_DIR = join(OUT_ROOT, 'listings');

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h || 1;
}
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function assertUnique<T>(items: T[], keyFn: (t: T) => string, label: string) {
  const seen = new Map<string, number>();
  for (const item of items) seen.set(keyFn(item), (seen.get(keyFn(item)) ?? 0) + 1);
  const dupes = [...seen.entries()].filter(([, count]) => count > 1);
  if (dupes.length > 0) throw new Error(`Duplicate ${label}: ${dupes.map(([k, c]) => `${k} (x${c})`).join(', ')}`);
}

/** Which companies realistically operate at a given location. */
function companyOperatesAt(company: RentalCompanyFacts, location: RentalLocation): boolean {
  const region = location.region;
  switch (company.id) {
    case 'enterprise':
    case 'hertz':
    case 'avis':
    case 'budget':
      return true; // global majors: every location
    case 'national':
    case 'alamo':
    case 'dollar':
    case 'thrifty':
      return location.type === 'airport' || region === 'north-america';
    case 'sixt':
      return ['europe', 'middle-east', 'oceania'].includes(region) || (region === 'north-america' && location.type === 'airport');
    case 'europcar':
      return ['europe', 'oceania', 'africa'].includes(region) || (region === 'asia' && location.type === 'airport');
    case 'ace':
    case 'fox':
      return region === 'north-america' && location.type === 'airport';
    case 'routes':
      return region === 'north-america' && (location.type === 'airport' || location.countryCode === 'CA');
    case 'payless':
      return location.type === 'airport' && ['north-america', 'europe'].includes(region);
    case 'green-motion':
      return ['europe', 'north-america', 'africa'].includes(region) || (region === 'asia' && location.type === 'airport');
    default:
      return false;
  }
}

/** Whether a vehicle realistically appears in this company's fleet at this location. */
function vehicleInFleet(vehicle: VehicleModel, company: RentalCompanyFacts, location: RentalLocation): boolean {
  if (!vehicle.regionTags.includes('global') && !vehicle.regionTags.includes(location.region)) return false;
  if (!vehicle.companyTiers.includes(company.tier)) return false;

  // Exotics/ultra-luxury (Ferrari, Lamborghini, Bentley, Rolls-Royce, S-Class, 911...)
  // only at high-cost hubs in Europe / North America / Middle East.
  if (vehicle.priceIndex >= 5) {
    if (!['europe', 'north-america', 'middle-east'].includes(location.region)) return false;
    if (location.costIndex < 1.1) return false;
    if (location.type === 'cruise-port' || location.type === 'rail-station') return false;
  }

  // Motorhomes/RVs: airport pickups in self-drive road-trip markets only.
  if (vehicle.category === 'Motorhome / RV') {
    if (location.type !== 'airport') return false;
    if (!['north-america', 'europe', 'oceania'].includes(location.region)) return false;
  }

  // Cargo vans don't rent from cruise terminals or rail desks.
  if (vehicle.category === 'Cargo Van' && (location.type === 'cruise-port' || location.type === 'rail-station')) return false;

  // Deterministic fleet variety: each company stocks ~3/4 of its eligible models per
  // location, so fleets differ realistically between brands at the same airport.
  return seededRandom(hashSeed(`${company.id}|${location.id}|${vehicle.id}`)) > 0.25;
}

function main() {
  console.log('Starting car rental catalog generator...');
  mkdirSync(LISTINGS_DIR, { recursive: true });

  const companiesWithReviews = RENTAL_COMPANIES.map((c) => ({ ...c, reviews: generateCompanyReviews(c) }));
  writeFileSync(join(OUT_ROOT, 'companies.json'), JSON.stringify(companiesWithReviews, null, 2));
  writeFileSync(join(OUT_ROOT, 'vehicles.json'), JSON.stringify(VEHICLES, null, 2));
  writeFileSync(join(OUT_ROOT, 'locations.json'), JSON.stringify(LOCATIONS, null, 2));

  const reviewsByCompany = new Map(companiesWithReviews.map((c) => [c.id, c.reviews]));

  const listings: CarListing[] = [];
  for (const location of LOCATIONS) {
    for (const company of RENTAL_COMPANIES) {
      if (!companyOperatesAt(company, location)) continue;
      for (const vehicle of VEHICLES) {
        if (!vehicleInFleet(vehicle, company, location)) continue;
        listings.push(generateCarListing(company, vehicle, location, reviewsByCompany.get(company.id)!));
      }
    }
  }

  console.log(`Generated ${listings.length} unique car rental listings.`);
  assertUnique(listings, (l) => l.slug, 'car listing slugs');

  console.log('Writing detailed listing files...');
  for (const listing of listings) {
    writeFileSync(join(LISTINGS_DIR, `${listing.slug}.json`), JSON.stringify(listing, null, 2));
  }

  console.log('Writing listings index...');
  const index: CarSearchResult[] = listings.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    companyName: l.companyName,
    companyTier: l.companyTier,
    brand: l.brand,
    model: l.model,
    year: l.year,
    category: l.category,
    transmission: l.specs.transmission,
    fuelType: l.specs.fuelType,
    seats: l.specs.seats,
    doors: l.specs.doors,
    luggage: l.specs.luggageCapacity.large + l.specs.luggageCapacity.small,
    locationName: l.locationName,
    locationType: l.locationType,
    city: l.city,
    country: l.country,
    countryCode: l.countryCode,
    fromPricePerDayUSD: l.fromPricePerDayUSD,
    ratingOverall: l.ratings.overall,
    reviewCount: l.ratings.reviewCount,
    heroImage: l.images.find((i) => i.role === 'hero')!,
    aiSearchTags: l.aiSearchTags,
    filters: {
      company: l.filters.company,
      country: l.filters.country,
      brand: l.filters.brand,
      category: l.filters.category,
      transmission: l.filters.transmission,
      fuelType: l.filters.fuelType,
      ev: l.filters.ev,
      hybrid: l.filters.hybrid,
      luxury: l.filters.luxury,
      budget: l.filters.budget,
      seats: l.filters.seats,
      airportPickup: l.filters.airportPickup,
      unlimitedMileage: l.filters.unlimitedMileage,
      freeCancellation: l.filters.freeCancellation,
      petFriendly: l.filters.petFriendly,
      oneWayAvailable: l.filters.oneWayAvailable,
      familyTravel: l.filters.familyTravel,
      businessTravel: l.filters.businessTravel,
      adventureTravel: l.filters.adventureTravel,
    },
  }));
  writeFileSync(join(OUT_ROOT, 'listings-index.json'), JSON.stringify(index, null, 2));

  console.log(`Successfully generated ${listings.length} car rental listings.`);
  console.log(`Entities:  ${OUT_ROOT}`);
  console.log(`Listings:  ${LISTINGS_DIR}`);
  console.log(`Index:     ${join(OUT_ROOT, 'listings-index.json')}`);
}

main();
