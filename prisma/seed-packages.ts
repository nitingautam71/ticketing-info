// Loads the generated package dataset (run `npm run generate:packages` first)
// into Postgres via Prisma Client. Idempotent — upserts by slug, safe to re-run
// after editing a destination fact and regenerating.
//
// Usage: npm run db:seed:packages

import { PrismaClient } from '@prisma/client';
import destinations from '../src/data/generated/destinations.json';
import packagesIndex from '../src/data/generated/packages-index.json';
import type { DestinationFacts, TravelPackage } from '../src/lib/packages/types';

const prisma = new PrismaClient();

async function main() {
  const destinationList = destinations as DestinationFacts[];
  const destinationIdBySlug = new Map<string, string>();

  for (const d of destinationList) {
    const record = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        country: d.country,
        countryCode: d.countryCode,
        region: d.region,
        continent: d.continent,
        lat: d.lat,
        lon: d.lon,
        airportCode: d.airportCode,
        airportName: d.airportName,
        currency: d.currency,
        categories: d.categories,
        facts: d as object,
      },
      create: {
        slug: d.slug,
        name: d.name,
        country: d.country,
        countryCode: d.countryCode,
        region: d.region,
        continent: d.continent,
        lat: d.lat,
        lon: d.lon,
        airportCode: d.airportCode,
        airportName: d.airportName,
        currency: d.currency,
        categories: d.categories,
        facts: d as object,
      },
    });
    destinationIdBySlug.set(d.slug, record.id);
  }
  console.log(`Upserted ${destinationList.length} destinations.`);

  let count = 0;
  for (const summary of packagesIndex as Array<{ slug: string; destinationSlug: string }>) {
    const pkg = (await import(`../src/data/generated/packages/${summary.slug}.json`)).default as TravelPackage;
    const destinationId = destinationIdBySlug.get(pkg.destinationSlug);
    if (!destinationId) throw new Error(`No destination row for slug ${pkg.destinationSlug}`);

    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        destinationId,
        destinationSlug: pkg.destinationSlug,
        durationDays: pkg.durationDays,
        durationNights: pkg.durationNights,
        title: pkg.title,
        metaTitle: pkg.metaTitle,
        metaDescription: pkg.metaDescription,
        overview: pkg.overview,
        categories: pkg.categories,
        aiTags: pkg.aiTags,
        fromPriceUSD: pkg.fromPriceUSD,
        ratingOverall: pkg.ratings.overall,
        reviewCount: pkg.ratings.reviewCount,
        content: pkg as unknown as object,
      },
      create: {
        slug: pkg.slug,
        destinationId,
        destinationSlug: pkg.destinationSlug,
        durationDays: pkg.durationDays,
        durationNights: pkg.durationNights,
        title: pkg.title,
        metaTitle: pkg.metaTitle,
        metaDescription: pkg.metaDescription,
        overview: pkg.overview,
        categories: pkg.categories,
        aiTags: pkg.aiTags,
        fromPriceUSD: pkg.fromPriceUSD,
        ratingOverall: pkg.ratings.overall,
        reviewCount: pkg.ratings.reviewCount,
        content: pkg as unknown as object,
      },
    });
    count++;
  }
  console.log(`Upserted ${count} packages.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
