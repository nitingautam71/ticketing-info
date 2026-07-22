import type { Flight } from './providers/flights';

export type DepartureBucket = 'night' | 'morning' | 'afternoon' | 'evening';

export const DEPARTURE_BUCKET_LABELS: Record<DepartureBucket, string> = {
  night: '12am – 6am',
  morning: '6am – 12pm',
  afternoon: '12pm – 6pm',
  evening: '6pm – 12am',
};

export function parseDurationMinutes(duration: string): number {
  const m = duration.match(/(\d+)h\s*(\d+)m/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

export function getDepartureBucket(departureTime: string): DepartureBucket {
  const m = departureTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return 'morning';
  let hour = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === 'PM') hour += 12;
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export type SortMode = 'best' | 'cheapest' | 'fastest';

/** Client-side ranking so re-sorting never costs another API call. */
export function sortFlights(flights: Flight[], mode: SortMode): Flight[] {
  const arr = [...flights];
  if (mode === 'cheapest') return arr.sort((a, b) => a.price - b.price);
  if (mode === 'fastest') return arr.sort((a, b) => parseDurationMinutes(a.duration) - parseDurationMinutes(b.duration));

  const hasScore = arr.some((f) => f.qualityScore != null);
  if (hasScore) return arr.sort((a, b) => (b.qualityScore ?? 0) - (a.qualityScore ?? 0));

  const maxPrice = Math.max(...arr.map((f) => f.price), 1);
  const maxDuration = Math.max(...arr.map((f) => parseDurationMinutes(f.duration)), 1);
  return arr.sort((a, b) => {
    const scoreA = a.price / maxPrice + parseDurationMinutes(a.duration) / maxDuration;
    const scoreB = b.price / maxPrice + parseDurationMinutes(b.duration) / maxDuration;
    return scoreA - scoreB;
  });
}

export function toggleSetValue<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

/**
 * Client-computed ranking badges keyed by flight id. Only applied when the
 * provider didn't supply its own `tags` (i.e. the mock path, or a supplier that
 * omits them) — otherwise we defer to the provider's Cheapest/Fastest/Recommended.
 */
export function computeBadges(flights: Flight[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  if (flights.length === 0 || flights.some((f) => f.tags && f.tags.length > 0)) return map;

  const add = (id: string, tag: string) => {
    const cur = map.get(id) ?? [];
    if (!cur.includes(tag)) cur.push(tag);
    map.set(id, cur);
  };

  const cheapest = flights.reduce((a, b) => (b.price < a.price ? b : a));
  const fastest = flights.reduce((a, b) => (parseDurationMinutes(b.duration) < parseDurationMinutes(a.duration) ? b : a));
  add(cheapest.id, 'Cheapest');
  add(fastest.id, 'Fastest');

  const maxPrice = Math.max(...flights.map((f) => f.price), 1);
  const maxDuration = Math.max(...flights.map((f) => parseDurationMinutes(f.duration)), 1);
  const bestValue = flights.reduce((a, b) => {
    const sa = a.price / maxPrice + parseDurationMinutes(a.duration) / maxDuration;
    const sb = b.price / maxPrice + parseDurationMinutes(b.duration) / maxDuration;
    return sb < sa ? b : a;
  });
  add(bestValue.id, 'Best value');
  return map;
}

/**
 * Layover/trip-risk read-out from an itinerary's own segment timings — the sort
 * of thing OTAs bury. Flags a tight (missable) connection or an unusually long
 * layover so travellers see the real quality of a stop, not just "1 stop".
 */
export function connectionWarning(flight: Flight): { label: string; tone: 'warn' | 'muted' } | null {
  if (!flight.segments || flight.segments.length < 2) return null;
  const layovers = flight.segments.map((s) => s.layoverMinutes).filter((m): m is number => m != null);
  if (layovers.length === 0) return null;
  const min = Math.min(...layovers);
  const max = Math.max(...layovers);
  if (min < 75) return { label: `Tight ${Math.floor(min / 60)}h ${min % 60}m connection`, tone: 'warn' };
  if (max >= 300) return { label: `Long ${Math.floor(max / 60)}h layover`, tone: 'muted' };
  return null;
}
