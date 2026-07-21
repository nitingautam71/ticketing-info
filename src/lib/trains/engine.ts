import { prisma } from '@/lib/db';
import { railProvider } from '@/lib/providers/trains';
import { operatorById } from './data/operators';
import { resolveStations, stationByCode } from './data/stations';
import type {
  CorridorResult,
  ServiceOverrideInfo,
  ServiceStatus,
  TrainClassFare,
  TrainJourney,
  TrainService,
  TrainStation,
} from './types';

export const TRAIN_DISCLAIMER =
  'Schedules and fares shown are indicative, compiled from official operator timetables. Rail operators adjust timings, fares and running days without notice — our rail desk confirms live availability and exact pricing before any booking is ticketed.';

// ---- Admin overrides (Postgres, 60s in-memory cache — same pattern as the
// visa engine: a DB outage degrades to bundled data, never a failed search) ----

const OVERRIDE_TTL_MS = 60_000;
let overrideCache: { at: number; rules: Map<string, ServiceOverrideInfo> } | null = null;

async function loadOverrides(): Promise<Map<string, ServiceOverrideInfo>> {
  const now = Date.now();
  if (overrideCache && now - overrideCache.at < OVERRIDE_TTL_MS) return overrideCache.rules;
  try {
    const rows = await prisma.trainServiceOverride.findMany();
    const rules = new Map<string, ServiceOverrideInfo>(
      rows.map((r) => [
        r.trainSlug,
        { status: r.status as ServiceStatus, notes: r.notes ?? undefined, updatedAt: r.updatedAt.toISOString() },
      ]),
    );
    overrideCache = { at: now, rules };
    return rules;
  } catch (err) {
    console.error('Train override lookup failed, using bundled data:', err);
    return overrideCache?.rules ?? new Map();
  }
}

/** Test hook / admin mutation hook: drop the cached overrides. */
export function invalidateTrainOverrideCache() {
  overrideCache = null;
}

export async function serviceOverride(slug: string): Promise<ServiceOverrideInfo | undefined> {
  return (await loadOverrides()).get(slug);
}

// ---- Clock helpers ----

function parseClock(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function formatClock(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

// ---- Directional timetable expansion ----

interface DirectionalStop {
  station: string;
  /** Minutes after departure from this direction's origin (arrival time). */
  arriveMin: number;
  haltMin: number;
}

function directionalStops(service: TrainService, direction: 'outbound' | 'return'): DirectionalStop[] {
  if (direction === 'outbound') {
    return service.stops.map((s) => ({ station: s.station, arriveMin: s.minutesFromStart, haltMin: s.haltMin ?? 0 }));
  }
  const total = service.durationMin;
  return [...service.stops].reverse().map((s) => ({ station: s.station, arriveMin: total - s.minutesFromStart, haltMin: s.haltMin ?? 0 }));
}

export interface SegmentTiming {
  departureTime: string;
  arrivalTime: string;
  arrivalDayOffset: number;
  durationMin: number;
  intermediateStops: number;
}

function segmentTiming(service: TrainService, direction: 'outbound' | 'return', fromIdx: number, toIdx: number): SegmentTiming | null {
  const depClock = direction === 'outbound' ? service.departures.outbound : service.departures.return;
  if (!depClock) return null;
  const stops = directionalStops(service, direction);
  const base = parseClock(depClock);
  const departsAt = base + stops[fromIdx].arriveMin + stops[fromIdx].haltMin;
  const arrivesAt = base + stops[toIdx].arriveMin;
  return {
    departureTime: formatClock(departsAt),
    arrivalTime: formatClock(arrivesAt),
    arrivalDayOffset: Math.floor(arrivesAt / 1440) - Math.floor(departsAt / 1440),
    durationMin: arrivesAt - departsAt,
    intermediateStops: toIdx - fromIdx - 1,
  };
}

/** Indicative segment fares: end-to-end fares scaled by travelled share of the
 * run, floored at 35% (short hops on long trains still have minimum fares). */
function segmentFares(service: TrainService, segmentMin: number): TrainClassFare[] {
  const factor = Math.max(0.35, Math.min(1, segmentMin / service.durationMin));
  return service.classes.map((c) => ({
    ...c,
    fare: c.currency === 'INR' ? Math.round((c.fare * factor) / 5) * 5 : Math.round(c.fare * factor),
  }));
}

// ---- Search ----

function matchSegment(service: TrainService, direction: 'outbound' | 'return', fromCodes: Set<string>, toCodes: Set<string>) {
  if (direction === 'return' && !service.departures.return) return null;
  const stops = directionalStops(service, direction);
  let fromIdx = -1;
  for (let i = 0; i < stops.length; i++) {
    if (fromCodes.has(stops[i].station)) {
      fromIdx = i;
      break;
    }
  }
  if (fromIdx === -1) return null;
  let toIdx = -1;
  for (let i = stops.length - 1; i > fromIdx; i--) {
    if (toCodes.has(stops[i].station)) {
      toIdx = i;
      break;
    }
  }
  if (toIdx === -1) return null;
  return { fromIdx, toIdx, stops };
}

async function journeysBetween(fromStations: TrainStation[], toStations: TrainStation[]): Promise<TrainJourney[]> {
  const fromCodes = new Set(fromStations.map((s) => s.code));
  const toCodes = new Set(toStations.map((s) => s.code));
  const overrides = await loadOverrides();
  const journeys: TrainJourney[] = [];

  for (const service of railProvider.services()) {
    for (const direction of ['outbound', 'return'] as const) {
      const match = matchSegment(service, direction, fromCodes, toCodes);
      if (!match) continue;
      const timing = segmentTiming(service, direction, match.fromIdx, match.toIdx);
      if (!timing || timing.durationMin <= 0) continue;
      const from = stationByCode(match.stops[match.fromIdx].station);
      const to = stationByCode(match.stops[match.toIdx].station);
      const operator = operatorById(service.operator);
      if (!from || !to || !operator) continue;
      const override = overrides.get(service.slug);
      journeys.push({
        service,
        operator,
        from,
        to,
        direction,
        ...timing,
        classes: segmentFares(service, timing.durationMin),
        status: override?.status ?? 'running',
        statusNote: override?.notes,
      });
    }
  }

  journeys.sort((a, b) => parseClock(a.departureTime) - parseClock(b.departureTime));
  return journeys;
}

/**
 * Corridor search: `from`/`to` accept a station code, station slug, city slug
 * or free text (city/station name). Returns every bundled service covering the
 * corridor in that direction, with admin status overlaid.
 */
export async function searchCorridor(from: string, to: string): Promise<CorridorResult | null> {
  const fromStations = resolveStations(from);
  const toStations = resolveStations(to);
  if (fromStations.length === 0 || toStations.length === 0) return null;

  const journeys = await journeysBetween(fromStations, toStations);
  const running = journeys.filter((j) => j.status !== 'suspended');
  const fastest = running.length ? running.reduce((a, b) => (b.durationMin < a.durationMin ? b : a)) : undefined;
  const cheapest = running.length
    ? running.reduce((a, b) => (minFareUsdEquivalent(b) < minFareUsdEquivalent(a) ? b : a))
    : undefined;

  return { from: fromStations, to: toStations, journeys, fastest, cheapest };
}

function minFareUsdEquivalent(j: TrainJourney): number {
  const min = Math.min(...j.classes.map((c) => c.fare));
  return j.classes[0]?.currency === 'INR' ? min / 84 : min;
}

// ---- Lookups for pages & grounding ----

export function trainBySlug(slug: string): TrainService | undefined {
  return railProvider.services().find((s) => s.slug === slug.toLowerCase());
}

export function allServices(): TrainService[] {
  return railProvider.services();
}

export interface StationDeparture {
  service: TrainService;
  direction: 'outbound' | 'return';
  departureTime: string;
  /** Final station of this direction of travel. */
  towards: TrainStation;
  /** True when this station is the terminus for the direction (arrivals only). */
  terminating: boolean;
}

/** Every service calling at a station, with departure time and direction —
 * powers the station pages' departure boards. */
export function servicesAtStation(code: string): StationDeparture[] {
  const results: StationDeparture[] = [];
  for (const service of railProvider.services()) {
    for (const direction of ['outbound', 'return'] as const) {
      const depClock = direction === 'outbound' ? service.departures.outbound : service.departures.return;
      if (!depClock) continue;
      const stops = directionalStops(service, direction);
      const idx = stops.findIndex((s) => s.station === code.toUpperCase());
      if (idx === -1) continue;
      const towards = stationByCode(stops[stops.length - 1].station);
      if (!towards) continue;
      const base = parseClock(depClock);
      results.push({
        service,
        direction,
        departureTime: formatClock(base + stops[idx].arriveMin + stops[idx].haltMin),
        towards,
        terminating: idx === stops.length - 1,
      });
    }
  }
  return results.sort((a, b) => parseClock(a.departureTime) - parseClock(b.departureTime));
}

export interface TimetableRow {
  station: TrainStation;
  arrives?: string;
  departs?: string;
  dayOffset: number;
}

/** Full outbound timetable with clock times — powers the train detail page. */
export function outboundTimetable(service: TrainService): TimetableRow[] {
  const base = parseClock(service.departures.outbound);
  const rows: TimetableRow[] = [];
  service.stops.forEach((stop, i) => {
    const station = stationByCode(stop.station);
    if (!station) return;
    const arriveAt = base + stop.minutesFromStart;
    const departAt = arriveAt + (stop.haltMin ?? 0);
    const row: TimetableRow = { station, dayOffset: Math.floor(arriveAt / 1440) };
    if (i > 0) row.arrives = formatClock(arriveAt);
    if (i < service.stops.length - 1) row.departs = formatClock(departAt);
    rows.push(row);
  });
  return rows;
}

/** Fire-and-forget analytics row. Never throws. */
export function logTrainSearch(params: { fromQuery: string; toQuery: string; fromCode?: string; toCode?: string; results: number; source: string }) {
  prisma.trainSearchLog
    .create({
      data: {
        fromQuery: params.fromQuery.slice(0, 80),
        toQuery: params.toQuery.slice(0, 80),
        fromCode: params.fromCode,
        toCode: params.toCode,
        results: params.results,
        source: params.source,
      },
    })
    .catch((err) => console.error('train search log failed:', err));
}
