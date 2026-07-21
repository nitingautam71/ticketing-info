import { railProvider } from '@/lib/providers/trains';
import { stationByCode } from './data/stations';

// Featured corridors drive the hub page, internal linking and the sitemap.
// `from`/`to` are city slugs (see stations.ts) — the canonical corridor URL is
// /trains/route/[from]/[to].

export interface FeaturedCorridor {
  from: string;
  to: string;
  label: string;
}

// Amtrak corridors featured on the hub, split into the fast Northeast/state
// corridors and the iconic long-distance overnight routes.
export const FEATURED_CORRIDORS_NEC: FeaturedCorridor[] = [
  { from: 'new-york', to: 'washington-dc', label: 'New York → Washington DC' },
  { from: 'new-york', to: 'boston', label: 'New York → Boston' },
  { from: 'philadelphia', to: 'harrisburg', label: 'Philadelphia → Harrisburg' },
  { from: 'los-angeles', to: 'san-diego', label: 'Los Angeles → San Diego' },
  { from: 'seattle', to: 'portland', label: 'Seattle → Portland' },
  { from: 'chicago', to: 'milwaukee', label: 'Chicago → Milwaukee' },
  { from: 'oakland', to: 'bakersfield', label: 'Oakland → Bakersfield' },
  { from: 'raleigh', to: 'charlotte', label: 'Raleigh → Charlotte' },
];

export const FEATURED_CORRIDORS_LONG_DISTANCE: FeaturedCorridor[] = [
  { from: 'chicago', to: 'san-francisco-bay-area', label: 'Chicago → SF Bay (Zephyr)' },
  { from: 'chicago', to: 'seattle', label: 'Chicago → Seattle (Empire Builder)' },
  { from: 'seattle', to: 'los-angeles', label: 'Seattle → LA (Coast Starlight)' },
  { from: 'new-york', to: 'miami', label: 'New York → Miami (Silver Star)' },
  { from: 'chicago', to: 'new-orleans', label: 'Chicago → New Orleans' },
  { from: 'new-york', to: 'chicago', label: 'New York → Chicago' },
  { from: 'lorton', to: 'sanford', label: 'Lorton → Sanford (Auto Train)' },
  { from: 'washington-dc', to: 'st-albans', label: 'Washington DC → Vermont' },
];

export const FEATURED_CORRIDORS = [...FEATURED_CORRIDORS_NEC, ...FEATURED_CORRIDORS_LONG_DISTANCE];

/**
 * Every city-pair corridor that at least one bundled service actually covers,
 * in both travel directions, as `{from}/{to}` city slugs. Derived purely from
 * bundled data (no DB), so the sitemap can enumerate it at build or request
 * time — the corridor pages themselves materialise on demand via ISR.
 */
export function allCorridorPairs(): { from: string; to: string }[] {
  const pairs = new Set<string>();
  for (const service of railProvider.services()) {
    const cities = service.stops.map((s) => stationByCode(s.station)?.citySlug).filter((c): c is string => Boolean(c));
    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        if (cities[i] === cities[j]) continue;
        pairs.add(`${cities[i]}|${cities[j]}`);
        // The reverse direction exists whenever the service runs both ways.
        if (service.departures.return) pairs.add(`${cities[j]}|${cities[i]}`);
      }
    }
  }
  return [...pairs].map((p) => {
    const [from, to] = p.split('|');
    return { from, to };
  });
}

/** Amtrak train slugs highlighted on the hub page. */
export const FEATURED_TRAINS = [
  'acela',
  'california-zephyr',
  'coast-starlight',
  'empire-builder',
  'auto-train',
  'silver-star',
  'southwest-chief',
  'vermonter',
];
