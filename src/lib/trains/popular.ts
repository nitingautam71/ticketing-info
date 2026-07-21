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

export const FEATURED_CORRIDORS_US: FeaturedCorridor[] = [
  { from: 'new-york', to: 'washington-dc', label: 'New York → Washington DC' },
  { from: 'new-york', to: 'boston', label: 'New York → Boston' },
  { from: 'miami', to: 'orlando', label: 'Miami → Orlando' },
  { from: 'los-angeles', to: 'san-diego', label: 'Los Angeles → San Diego' },
  { from: 'seattle', to: 'portland', label: 'Seattle → Portland' },
  { from: 'chicago', to: 'milwaukee', label: 'Chicago → Milwaukee' },
  { from: 'new-york', to: 'chicago', label: 'New York → Chicago' },
  { from: 'anchorage', to: 'fairbanks', label: 'Anchorage → Fairbanks' },
];

export const FEATURED_CORRIDORS_IN: FeaturedCorridor[] = [
  { from: 'mumbai', to: 'delhi', label: 'Mumbai → Delhi' },
  { from: 'delhi', to: 'varanasi', label: 'Delhi → Varanasi' },
  { from: 'delhi', to: 'agra', label: 'Delhi → Agra' },
  { from: 'delhi', to: 'jaipur', label: 'Delhi → Jaipur' },
  { from: 'chennai', to: 'bengaluru', label: 'Chennai → Bengaluru' },
  { from: 'mumbai', to: 'goa', label: 'Mumbai → Goa' },
  { from: 'kolkata', to: 'delhi', label: 'Kolkata → Delhi' },
  { from: 'delhi', to: 'katra', label: 'Delhi → Katra (Vaishno Devi)' },
];

export const FEATURED_CORRIDORS = [...FEATURED_CORRIDORS_US, ...FEATURED_CORRIDORS_IN];

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

/** Train slugs highlighted on the hub page. */
export const FEATURED_TRAINS = [
  'acela',
  'brightline-florida',
  'california-zephyr',
  'coast-starlight',
  'denali-star',
  'vande-bharat-new-delhi-varanasi',
  'mumbai-rajdhani',
  'gatimaan-express',
];
