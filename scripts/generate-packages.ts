// Generates the full 900-package dataset (150 destinations x 6 durations) from
// curated destination facts. Deterministic — re-running produces identical
// output unless a destination fact or generator rule changed.
//
// Usage: npm run generate:packages
//
// Output:
//   src/data/generated/destinations.json       - the 150 curated destination fact records
//   src/data/generated/packages/<slug>.json     - one file per package (900 total), full detail
//   src/data/generated/packages-index.json      - lightweight list for search/filter pages

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DESTINATIONS_A } from '../src/lib/packages/destinations-a';
import { DESTINATIONS_B } from '../src/lib/packages/destinations-b';
import { DESTINATIONS_C } from '../src/lib/packages/destinations-c';
import { DESTINATIONS_D } from '../src/lib/packages/destinations-d';
import { DESTINATIONS_E } from '../src/lib/packages/destinations-e';
import { DESTINATIONS_F } from '../src/lib/packages/destinations-f';
import { generatePackage } from '../src/lib/packages/generator';
import type { DestinationFacts, TravelPackage } from '../src/lib/packages/types';

const DURATIONS = [2, 3, 5, 7, 10, 14];
const ALL_DESTINATIONS: DestinationFacts[] = [...DESTINATIONS_A, ...DESTINATIONS_B, ...DESTINATIONS_C, ...DESTINATIONS_D, ...DESTINATIONS_E, ...DESTINATIONS_F];
const EXPECTED_DESTINATION_COUNT = 150;
const EXPECTED_PACKAGE_COUNT = EXPECTED_DESTINATION_COUNT * DURATIONS.length;

const OUT_ROOT = join(process.cwd(), 'src', 'data', 'generated');
const PACKAGES_DIR = join(OUT_ROOT, 'packages');

function assertUnique<T>(items: T[], keyFn: (t: T) => string, label: string) {
  const seen = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  const dupes = [...seen.entries()].filter(([, count]) => count > 1);
  if (dupes.length > 0) {
    throw new Error(`Duplicate ${label}: ${dupes.map(([k, c]) => `${k} (x${c})`).join(', ')}`);
  }
}

function main() {
  if (ALL_DESTINATIONS.length !== EXPECTED_DESTINATION_COUNT) {
    throw new Error(`Expected ${EXPECTED_DESTINATION_COUNT} destinations, got ${ALL_DESTINATIONS.length}`);
  }
  assertUnique(ALL_DESTINATIONS, (d) => d.slug, 'destination slugs');

  mkdirSync(PACKAGES_DIR, { recursive: true });

  writeFileSync(join(OUT_ROOT, 'destinations.json'), JSON.stringify(ALL_DESTINATIONS, null, 2));

  const allPackages: TravelPackage[] = [];
  for (const destination of ALL_DESTINATIONS) {
    for (const durationDays of DURATIONS) {
      allPackages.push(generatePackage(destination, durationDays));
    }
  }

  if (allPackages.length !== EXPECTED_PACKAGE_COUNT) {
    throw new Error(`Expected ${EXPECTED_PACKAGE_COUNT} packages, got ${allPackages.length}`);
  }
  assertUnique(allPackages, (p) => p.slug, 'package slugs');

  // Internal linking needs sibling awareness (other durations of the same destination,
  // other destinations sharing categories) that a single generatePackage() call doesn't
  // have — done here as a post-process pass once the full package set exists.
  for (const pkg of allPackages) {
    const sameDestination = allPackages
      .filter((p) => p.destinationSlug === pkg.destinationSlug && p.slug !== pkg.slug)
      .sort((a, b) => Math.abs(a.durationDays - pkg.durationDays) - Math.abs(b.durationDays - pkg.durationDays))
      .slice(0, 2);

    const related = allPackages
      .filter((p) => p.destinationSlug !== pkg.destinationSlug && p.durationDays === pkg.durationDays)
      .map((p) => ({ pkg: p, shared: p.categories.filter((c) => pkg.categories.includes(c)).length }))
      .filter((x) => x.shared >= 2)
      .sort((a, b) => b.shared - a.shared)
      .slice(0, 3)
      .map((x) => x.pkg);

    pkg.seo.internalLinks = [
      ...sameDestination.map((p) => ({ title: `${p.durationDays}-Day ${p.destinationName} Package`, url: `/packages/${p.slug}` })),
      ...related.map((p) => ({ title: p.title, url: `/packages/${p.slug}` })),
    ];
  }

  for (const pkg of allPackages) {
    writeFileSync(join(PACKAGES_DIR, `${pkg.slug}.json`), JSON.stringify(pkg, null, 2));
  }

  const index = allPackages.map((p) => ({
    id: p.id,
    slug: p.slug,
    destinationSlug: p.destinationSlug,
    destinationName: p.destinationName,
    country: p.country,
    region: p.region,
    durationDays: p.durationDays,
    durationNights: p.durationNights,
    title: p.title,
    heroImage: p.images.find((i) => i.role === 'hero'),
    thumbnail: p.images.find((i) => i.role === 'thumbnail'),
    categories: p.categories,
    fromPriceUSD: p.fromPriceUSD,
    ratingOverall: p.ratings.overall,
    reviewCount: p.ratings.reviewCount,
    highlights: p.highlights,
  }));
  writeFileSync(join(OUT_ROOT, 'packages-index.json'), JSON.stringify(index, null, 2));

  console.log(`Generated ${ALL_DESTINATIONS.length} destinations and ${allPackages.length} packages.`);
  console.log(`Destinations: ${join(OUT_ROOT, 'destinations.json')}`);
  console.log(`Packages:     ${PACKAGES_DIR} (${allPackages.length} files)`);
  console.log(`Index:        ${join(OUT_ROOT, 'packages-index.json')}`);
}

main();
