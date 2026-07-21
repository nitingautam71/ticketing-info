import { describe, expect, it, vi } from 'vitest';

// The engine reads admin overrides from Postgres. Tests exercise the bundled
// dataset, so the DB is stubbed out to return no overrides (which is also the
// production degradation path when Postgres is unreachable).
vi.mock('@/lib/db', () => ({
  prisma: {
    trainServiceOverride: { findMany: async () => [] },
    trainSearchLog: { create: async () => ({}) },
  },
}));

const { searchCorridor, allServices, servicesAtStation, outboundTimetable, trainBySlug } = await import('./engine');
const { TRAIN_STATIONS, stationByCode, stationBySlug, resolveStations } = await import('./data/stations');
const { TRAIN_OPERATORS, operatorById } = await import('./data/operators');
const { allCorridorPairs } = await import('./popular');
const { formatDuration, formatFare } = await import('./format');

describe('dataset integrity', () => {
  it('has unique station codes and slugs', () => {
    const codes = new Set(TRAIN_STATIONS.map((s) => s.code));
    const slugs = new Set(TRAIN_STATIONS.map((s) => s.slug));
    expect(codes.size).toBe(TRAIN_STATIONS.length);
    expect(slugs.size).toBe(TRAIN_STATIONS.length);
  });

  it('has unique train slugs', () => {
    const slugs = new Set(allServices().map((s) => s.slug));
    expect(slugs.size).toBe(allServices().length);
  });

  it('references only known stations and operators from every service', () => {
    for (const service of allServices()) {
      expect(operatorById(service.operator), `operator for ${service.slug}`).toBeDefined();
      for (const stop of service.stops) {
        expect(stationByCode(stop.station), `station ${stop.station} on ${service.slug}`).toBeDefined();
      }
    }
  });

  it('has monotonically increasing stop times ending at the stated duration', () => {
    for (const service of allServices()) {
      expect(service.stops.length, service.slug).toBeGreaterThanOrEqual(2);
      for (let i = 1; i < service.stops.length; i++) {
        expect(service.stops[i].minutesFromStart, `${service.slug} stop ${i}`).toBeGreaterThan(service.stops[i - 1].minutesFromStart);
      }
      expect(service.stops[service.stops.length - 1].minutesFromStart, service.slug).toBe(service.durationMin);
    }
  });

  it('gives every service at least one priced class in a single currency', () => {
    for (const service of allServices()) {
      expect(service.classes.length, service.slug).toBeGreaterThan(0);
      const currencies = new Set(service.classes.map((c) => c.currency));
      expect(currencies.size, service.slug).toBe(1);
      expect([...currencies][0]).toBe(service.country === 'IN' ? 'INR' : 'USD');
      for (const cls of service.classes) expect(cls.fare, `${service.slug} ${cls.code}`).toBeGreaterThan(0);
    }
  });

  it('covers both target markets across four operators', () => {
    expect(TRAIN_OPERATORS).toHaveLength(4);
    expect(allServices().some((s) => s.country === 'US')).toBe(true);
    expect(allServices().some((s) => s.country === 'IN')).toBe(true);
  });
});

describe('station resolution', () => {
  it('resolves a station code, slug and city name to the same station', () => {
    expect(resolveStations('NYP')[0].code).toBe('NYP');
    expect(resolveStations('new-york-moynihan-train-hall')[0].code).toBe('NYP');
    expect(resolveStations('New York').some((s) => s.code === 'NYP')).toBe(true);
  });

  it('resolves a multi-station city slug to every station in that city', () => {
    const delhi = resolveStations('delhi');
    expect(delhi.length).toBeGreaterThan(1);
    expect(delhi.map((s) => s.code)).toContain('NDLS');
    expect(delhi.map((s) => s.code)).toContain('NZM');
  });

  it('returns nothing for an unknown place', () => {
    expect(resolveStations('atlantis')).toHaveLength(0);
  });
});

describe('corridor search', () => {
  it('finds Acela and Northeast Regional on New York → Washington DC', async () => {
    const result = await searchCorridor('new-york', 'washington-dc');
    expect(result).not.toBeNull();
    const names = result!.journeys.map((j) => j.service.name);
    expect(names).toContain('Acela');
    expect(names).toContain('Northeast Regional');
    // Acela is the fastest thing on the corridor.
    expect(result!.fastest?.service.slug).toBe('acela');
  });

  it('searches the reverse direction using the return timetable', async () => {
    const result = await searchCorridor('washington-dc', 'new-york');
    expect(result!.journeys.length).toBeGreaterThan(0);
    expect(result!.journeys.every((j) => j.from.city === 'Washington DC')).toBe(true);
    expect(result!.journeys.every((j) => j.to.city === 'New York')).toBe(true);
  });

  it('prices a short segment below the end-to-end fare', async () => {
    const full = await searchCorridor('chicago', 'seattle'); // Empire Builder, full run
    const short = await searchCorridor('chicago', 'milwaukee'); // same train, 89 min
    const fullBuilder = full!.journeys.find((j) => j.service.slug === 'empire-builder')!;
    const shortBuilder = short!.journeys.find((j) => j.service.slug === 'empire-builder')!;
    expect(shortBuilder.classes[0].fare).toBeLessThan(fullBuilder.classes[0].fare);
  });

  it('computes an overnight arrival with a day offset', async () => {
    const result = await searchCorridor('mumbai', 'delhi');
    const rajdhani = result!.journeys.find((j) => j.service.slug === 'mumbai-rajdhani')!;
    expect(rajdhani.departureTime).toBe('17:00');
    expect(rajdhani.arrivalDayOffset).toBe(1);
    expect(rajdhani.durationMin).toBe(930);
  });

  it('counts intermediate stops on a segment', async () => {
    const result = await searchCorridor('new-york', 'washington-dc');
    const acela = result!.journeys.find((j) => j.service.slug === 'acela')!;
    expect(acela.intermediateStops).toBe(3); // Newark, Philadelphia, Baltimore
  });

  it('picks the cheapest journey by fare, normalising currency', async () => {
    const result = await searchCorridor('delhi', 'agra');
    expect(result!.cheapest).toBeDefined();
    const cheapestFare = Math.min(...result!.cheapest!.classes.map((c) => c.fare));
    for (const j of result!.journeys) {
      expect(Math.min(...j.classes.map((c) => c.fare))).toBeGreaterThanOrEqual(cheapestFare * 0.999);
    }
  });

  it('returns null for unknown places and empty journeys for uncovered pairs', async () => {
    expect(await searchCorridor('atlantis', 'delhi')).toBeNull();
    const uncovered = await searchCorridor('anchorage', 'varanasi');
    expect(uncovered!.journeys).toHaveLength(0);
  });

  it('never returns a segment travelling backwards in time', async () => {
    for (const { from, to } of allCorridorPairs().slice(0, 200)) {
      const result = await searchCorridor(from, to);
      for (const j of result?.journeys ?? []) {
        expect(j.durationMin, `${from}->${to} on ${j.service.slug}`).toBeGreaterThan(0);
      }
    }
  });
});

describe('timetables and station boards', () => {
  it('builds an outbound timetable with clock times for every stop', () => {
    const service = trainBySlug('acela')!;
    const rows = outboundTimetable(service);
    expect(rows).toHaveLength(5);
    expect(rows[0].departs).toBe('06:00');
    expect(rows[0].arrives).toBeUndefined();
    expect(rows[rows.length - 1].arrives).toBe('08:50'); // 06:00 + 170 min
    expect(rows[rows.length - 1].departs).toBeUndefined();
  });

  it('lists departures at a station sorted by time, both directions', () => {
    const board = servicesAtStation('CHI');
    expect(board.length).toBeGreaterThan(5);
    const times = board.map((d) => d.departureTime);
    expect([...times].sort()).toEqual(times);
  });

  it('marks a terminus call as terminating', () => {
    const board = servicesAtStation('SEA');
    const builder = board.find((d) => d.service.slug === 'empire-builder' && d.direction === 'outbound');
    expect(builder?.terminating).toBe(true);
  });
});

describe('corridor enumeration for the sitemap', () => {
  it('produces unique, well-formed city pairs', () => {
    const pairs = allCorridorPairs();
    expect(pairs.length).toBeGreaterThan(100);
    const keys = new Set(pairs.map((p) => `${p.from}|${p.to}`));
    expect(keys.size).toBe(pairs.length);
    for (const p of pairs) expect(p.from).not.toBe(p.to);
  });

  it('lists every enumerated pair as a resolvable corridor', async () => {
    // Sample the first 50 so the suite stays fast; a broken slug would fail here.
    for (const { from, to } of allCorridorPairs().slice(0, 50)) {
      const result = await searchCorridor(from, to);
      expect(result, `${from} -> ${to}`).not.toBeNull();
    }
  });
});

describe('formatting', () => {
  it('formats durations and fares per currency', () => {
    expect(formatDuration(89)).toBe('1h 29m');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(45)).toBe('45m');
    expect(formatFare({ fare: 89, currency: 'USD' })).toBe('$89');
    expect(formatFare({ fare: 3610, currency: 'INR' })).toBe('₹3,610');
  });
});

describe('station pages', () => {
  it('gives every station a resolvable slug and at least one calling service', () => {
    for (const station of TRAIN_STATIONS) {
      expect(stationBySlug(station.slug)?.code).toBe(station.code);
      expect(servicesAtStation(station.code).length, `${station.code} has no services`).toBeGreaterThan(0);
    }
  });
});
