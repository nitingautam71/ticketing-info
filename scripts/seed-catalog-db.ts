// Seeds the cruise and car rental catalogs from the generated JSON files into
// Postgres (CruiseCatalog / CarCatalog tables). Full detail payloads are gzipped —
// they're only ever read whole by slug, and compression keeps ~850MB of JSON inside
// Neon's storage tier. Idempotent: wipes and reloads both tables.
//
// Usage: DATABASE_URL=... npx tsx scripts/seed-catalog-db.ts

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { PrismaClient } from '@prisma/client';
import type { CruisePackage, CruiseSearchResult } from '../src/lib/cruises/types';
import type { CarListing, CarSearchResult } from '../src/lib/cars/types';

const prisma = new PrismaClient();
const GEN = join(process.cwd(), 'src', 'data', 'generated');
const CHUNK = 100;

function gz(obj: unknown): Uint8Array<ArrayBuffer> {
  // Copy into a fresh ArrayBuffer-backed Uint8Array — Prisma's Bytes input type
  // rejects Node Buffers, which are typed over ArrayBufferLike under strict TS.
  const buf = gzipSync(JSON.stringify(obj));
  const out = new Uint8Array(new ArrayBuffer(buf.byteLength));
  out.set(buf);
  return out;
}

async function seedCruises() {
  const index = JSON.parse(readFileSync(join(GEN, 'cruises', 'packages-index.json'), 'utf8')) as CruiseSearchResult[];
  console.log(`Cruises: ${index.length} index entries. Clearing table...`);
  await prisma.cruiseCatalog.deleteMany();

  let done = 0;
  for (let i = 0; i < index.length; i += CHUNK) {
    const slice = index.slice(i, i + CHUNK);
    const rows = slice.map((entry) => {
      const detail = JSON.parse(readFileSync(join(GEN, 'cruises', 'packages', `${entry.slug}.json`), 'utf8')) as CruisePackage;
      const searchText = [
        entry.title,
        entry.cruiseLineName,
        entry.shipName,
        entry.destination,
        entry.departurePortName,
        entry.arrivalPortName,
        ...entry.aiSearchTags,
      ]
        .join(' ')
        .toLowerCase();
      return {
        slug: entry.slug,
        title: entry.title,
        cruiseLineName: entry.cruiseLineName,
        shipName: entry.shipName,
        destination: entry.destination,
        departurePortName: entry.departurePortName,
        arrivalPortName: entry.arrivalPortName,
        durationNights: entry.durationNights,
        categories: entry.categories,
        durationCats: entry.filters?.duration ?? [],
        fromPriceUSD: Math.round(entry.fromPriceUSD),
        ratingOverall: entry.ratingOverall,
        reviewCount: entry.reviewCount,
        riverCruise: entry.filters?.riverCruise === true,
        oceanCruise: entry.filters?.oceanCruise === true,
        adultsOnly: entry.filters?.adultsOnly === true,
        expedition: entry.filters?.expedition === true,
        heroImage: entry.heroImage as object,
        filters: (entry.filters ?? {}) as object,
        searchText,
        detail: gz(detail),
      };
    });
    await prisma.cruiseCatalog.createMany({ data: rows });
    done += rows.length;
    if (done % 1000 < CHUNK) console.log(`  cruises seeded: ${done}/${index.length}`);
  }
  console.log(`Cruises done: ${done}`);
}

async function seedCars() {
  const index = JSON.parse(readFileSync(join(GEN, 'cars', 'listings-index.json'), 'utf8')) as CarSearchResult[];
  console.log(`Cars: ${index.length} index entries. Clearing table...`);
  await prisma.carCatalog.deleteMany();

  // companyId isn't in the index shape — derive from the detail payload.
  let done = 0;
  for (let i = 0; i < index.length; i += CHUNK) {
    const slice = index.slice(i, i + CHUNK);
    const rows = slice.map((entry) => {
      const detail = JSON.parse(readFileSync(join(GEN, 'cars', 'listings', `${entry.slug}.json`), 'utf8')) as CarListing;
      const searchText = [
        entry.title,
        entry.brand,
        entry.model,
        entry.companyName,
        entry.locationName,
        entry.city,
        entry.country,
        ...entry.aiSearchTags,
      ]
        .join(' ')
        .toLowerCase();
      return {
        slug: entry.slug,
        title: entry.title,
        companyId: detail.companyId,
        companyName: entry.companyName,
        companyTier: entry.companyTier,
        brand: entry.brand,
        model: entry.model,
        year: entry.year,
        category: entry.category,
        transmission: entry.transmission,
        fuelType: entry.fuelType,
        seats: entry.seats,
        doors: entry.doors,
        luggage: entry.luggage,
        locationName: entry.locationName,
        locationType: entry.locationType,
        city: entry.city,
        country: entry.country,
        countryCode: entry.countryCode,
        fromPricePerDayUSD: Math.round(entry.fromPricePerDayUSD),
        ratingOverall: entry.ratingOverall,
        reviewCount: entry.reviewCount,
        ev: entry.filters?.ev === true,
        hybrid: entry.filters?.hybrid === true,
        luxury: entry.filters?.luxury === true,
        budget: entry.filters?.budget === true,
        airportPickup: entry.filters?.airportPickup === true,
        unlimitedMileage: entry.filters?.unlimitedMileage === true,
        freeCancellation: entry.filters?.freeCancellation === true,
        petFriendly: entry.filters?.petFriendly === true,
        oneWayAvailable: entry.filters?.oneWayAvailable === true,
        familyTravel: entry.filters?.familyTravel === true,
        businessTravel: entry.filters?.businessTravel === true,
        adventureTravel: entry.filters?.adventureTravel === true,
        heroImage: entry.heroImage as object,
        filters: (entry.filters ?? {}) as object,
        searchText,
        detail: gz(detail),
      };
    });
    await prisma.carCatalog.createMany({ data: rows });
    done += rows.length;
    if (done % 1000 < CHUNK) console.log(`  cars seeded: ${done}/${index.length}`);
  }
  console.log(`Cars done: ${done}`);
}

async function main() {
  const started = Date.now();
  await seedCruises();
  await seedCars();
  const cruiseCount = await prisma.cruiseCatalog.count();
  const carCount = await prisma.carCatalog.count();
  console.log(`\nSeed complete in ${Math.round((Date.now() - started) / 1000)}s`);
  console.log(`CruiseCatalog rows: ${cruiseCount}`);
  console.log(`CarCatalog rows:    ${carCount}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
