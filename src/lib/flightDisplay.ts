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
