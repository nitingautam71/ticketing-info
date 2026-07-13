import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CRUISE_LINES, CRUISE_LINES_BY_ID } from '../src/lib/cruises/cruise-lines';
import { SHIPS } from '../src/lib/cruises/ships';
import { PORTS } from '../src/lib/cruises/ports';
import { ITINERARY_TEMPLATES } from '../src/lib/cruises/itineraries';
import { generateCruisePackage } from '../src/lib/cruises/generator';
import type { CruisePackage, CruiseSearchResult } from '../src/lib/cruises/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUT_ROOT = join(__dirname, '..', 'src', 'data', 'generated', 'cruises');
const PACKAGES_DIR = join(OUT_ROOT, 'packages');

const RIVER_LINE_IDS = ['viking-river', 'amawaterways', 'avalon', 'scenic', 'emerald', 'uniworld'];

// Regions with a restricted realistic duration range, as [minNights, maxNights].
// Regions not listed fall back to [5, 14] for river itineraries or [2, 30] for ocean itineraries.
const REGION_DURATION_RANGE: Record<string, [number, number]> = {
  Alaska: [7, 30],
  Bahamas: [2, 7],
  Antarctica: [10, 21],
  Arctic: [7, 21],
  'Panama Canal': [10, 21],
  'World Cruises': [60, 60]
};

// Regions only realistic for cruise lines flagged as expedition operators (small ice-class ships).
const EXPEDITION_ONLY_REGIONS = new Set(['Antarctica', 'Arctic']);

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
  console.log('Starting Cruise package generator...');

  mkdirSync(PACKAGES_DIR, { recursive: true });

  // 1. Save static entities
  writeFileSync(join(OUT_ROOT, 'cruise-lines.json'), JSON.stringify(CRUISE_LINES, null, 2));
  writeFileSync(join(OUT_ROOT, 'ships.json'), JSON.stringify(SHIPS, null, 2));
  writeFileSync(join(OUT_ROOT, 'ports.json'), JSON.stringify(PORTS, null, 2));

  const allPackages: CruisePackage[] = [];
  const durations = [2, 3, 4, 5, 7, 10, 12, 14, 21, 30, 60];

  // Generate combinations: every ship x every itinerary template compatible with its
  // river/ocean type and cruise line eligibility x every realistic duration for that region.
  // Every combination here is a genuine, distinct itinerary - no synthetic duplicate padding.
  for (const ship of SHIPS) {
    const lineId = ship.cruiseLineId;
    const line = CRUISE_LINES_BY_ID[lineId];
    if (!line) continue;
    const isRiver = RIVER_LINE_IDS.includes(lineId);

    const matchingTemplates = ITINERARY_TEMPLATES.filter((itinerary) => {
      const itineraryIsRiver = itinerary.region.toLowerCase().includes('river');
      if (isRiver !== itineraryIsRiver) return false;
      if (EXPEDITION_ONLY_REGIONS.has(itinerary.region) && !line.expeditionCruise) return false;
      if (itinerary.region === 'World Cruises' && !line.category.includes('World Cruises')) return false;
      return true;
    });

    for (const itinerary of matchingTemplates) {
      const [minNights, maxNights] = REGION_DURATION_RANGE[itinerary.region] ?? (isRiver ? [5, 14] : [2, 30]);

      for (const dur of durations) {
        if (dur < minNights || dur > maxNights) continue;

        try {
          const pkg = generateCruisePackage(lineId, ship.id, itinerary, dur);
          allPackages.push(pkg);
        } catch (err: any) {
          console.error(`Error generating package for ship ${ship.id} and itinerary ${itinerary.id}:`, err.message);
        }
      }
    }
  }

  console.log(`Generated ${allPackages.length} unique cruise packages from real itineraries.`);
  assertUnique(allPackages, (p) => p.slug, 'cruise package slugs');

  // 2. Write individual detailed packages
  console.log('Writing detailed package files...');
  for (const pkg of allPackages) {
    writeFileSync(join(PACKAGES_DIR, `${pkg.slug}.json`), JSON.stringify(pkg, null, 2));
  }

  // 3. Write lightweight packages-index.json for listing page
  console.log('Writing packages index...');
  const indexList: CruiseSearchResult[] = allPackages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    cruiseLineName: p.cruiseLineName,
    shipName: p.shipName,
    destination: p.destination,
    departurePortName: p.departurePortName,
    arrivalPortName: p.arrivalPortName,
    durationNights: p.durationNights,
    categories: p.categories,
    fromPriceUSD: p.fromPriceUSD,
    ratingOverall: p.ratings.overall,
    reviewCount: p.ratings.reviewCount,
    heroImage: p.images.find((i) => i.role === 'hero')!,
    aiSearchTags: p.aiSearchTags,
    filters: {
      cruiseLine: p.filters.cruiseLine,
      ship: p.filters.ship,
      destination: p.filters.destination,
      departurePort: p.filters.departurePort,
      cabinType: p.filters.cabinType,
      duration: p.filters.duration,
      budget: p.filters.budget,
      luxury: p.filters.luxury,
      family: p.filters.family,
      adultsOnly: p.filters.adultsOnly,
      riverCruise: p.filters.riverCruise,
      oceanCruise: p.filters.oceanCruise,
      expedition: p.filters.expedition
    }
  }));

  writeFileSync(join(OUT_ROOT, 'packages-index.json'), JSON.stringify(indexList, null, 2));

  console.log(`Successfully generated ${allPackages.length} cruise packages.`);
  console.log(`Cruise entities:  ${OUT_ROOT}`);
  console.log(`Detailed files:   ${PACKAGES_DIR}`);
  console.log(`Lightweight index: ${join(OUT_ROOT, 'packages-index.json')}`);
}

main();
