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

const { searchCorridor, allServices, servicesAtStation, activeStations, outboundTimetable, trainBySlug } = await import('./engine');
const { TRAIN_STATIONS, stationByCode, stationBySlug, resolveStations, activeStationsList } = await import('./data/stations');
const { TRAIN_OPERATORS, operatorById, enabledOperators, isOperatorEnabled } = await import('./data/operators');
const { railProvider } = await import('@/lib/providers/trains');
const { allCorridorPairs } = await import('./popular');
const { formatDuration, formatFare } = await import('./format');

describe('operator gating (Amtrak-only today)', () => {
  it('enables only Amtrak; Brightline, Alaska Railroad and VIA Rail are disabled placeholders', () => {
    expect(isOperatorEnabled('amtrak')).toBe(true);
    expect(isOperatorEnabled('brightline')).toBe(false);
    expect(isOperatorEnabled('alaska-railroad')).toBe(false);
    expect(isOperatorEnabled('via-rail')).toBe(false);
    expect(enabledOperators().map((o) => o.id)).toEqual(['amtrak']);
  });

  it('keeps disabled placeholders in the registry for future activation', () => {
    expect(operatorById('via-rail')).toBeDefined();
    expect(operatorById('brightline')).toBeDefined();
  });

  it('active catalog is Amtrak-only; the full catalog still holds placeholder data', () => {
    expect(allServices().every((s) => s.operator === 'amtrak')).toBe(true);
    // Brightline/Alaska data is retained but filtered out of the active catalog.
    expect(railProvider.allServices().some((s) => s.operator === 'brightline')).toBe(true);
    expect(railProvider.services().some((s) => s.operator === 'brightline')).toBe(false);
  });
});

describe('India has been fully removed', () => {
  it('no station, service or operator is Indian', () => {
    expect(TRAIN_STATIONS.some((s) => (s.country as string) === 'IN')).toBe(false);
    expect(railProvider.allServices().some((s) => (s.country as string) === 'IN')).toBe(false);
    expect(TRAIN_OPERATORS.some((o) => o.id === 'indian-railways')).toBe(false);
    for (const code of ['NDLS', 'CSMT', 'MAS', 'HWH']) expect(stationByCode(code)).toBeUndefined();
  });

  it('does not resolve Indian cities or return Indian corridors', async () => {
    expect(resolveStations('delhi')).toHaveLength(0);
    expect(resolveStations('mumbai')).toHaveLength(0);
    expect(await searchCorridor('mumbai', 'delhi')).toBeNull();
    expect(trainBySlug('mumbai-rajdhani')).toBeUndefined();
    expect(trainBySlug('gatimaan-express')).toBeUndefined();
  });
});

describe('dataset integrity', () => {
  it('has unique station codes and slugs', () => {
    const codes = new Set(TRAIN_STATIONS.map((s) => s.code));
    const slugs = new Set(TRAIN_STATIONS.map((s) => s.slug));
    expect(codes.size).toBe(TRAIN_STATIONS.length);
    expect(slugs.size).toBe(TRAIN_STATIONS.length);
  });

  it('has unique train slugs across the full catalog', () => {
    const all = railProvider.allServices();
    expect(new Set(all.map((s) => s.slug)).size).toBe(all.length);
  });

  it('references only known stations and operators from every service', () => {
    for (const service of railProvider.allServices()) {
      expect(operatorById(service.operator), `operator for ${service.slug}`).toBeDefined();
      for (const stop of service.stops) {
        expect(stationByCode(stop.station), `station ${stop.station} on ${service.slug}`).toBeDefined();
      }
    }
  });

  it('has monotonically increasing stop times ending at the stated duration', () => {
    for (const service of railProvider.allServices()) {
      expect(service.stops.length, service.slug).toBeGreaterThanOrEqual(2);
      for (let i = 1; i < service.stops.length; i++) {
        expect(service.stops[i].minutesFromStart, `${service.slug} stop ${i}`).toBeGreaterThan(service.stops[i - 1].minutesFromStart);
      }
      expect(service.stops[service.stops.length - 1].minutesFromStart, service.slug).toBe(service.durationMin);
    }
  });

  it('gives every service USD (or future CAD) fares, one currency each', () => {
    for (const service of railProvider.allServices()) {
      expect(service.classes.length, service.slug).toBeGreaterThan(0);
      const currencies = new Set(service.classes.map((c) => c.currency));
      expect(currencies.size, service.slug).toBe(1);
      expect(['USD', 'CAD']).toContain([...currencies][0]);
      for (const cls of service.classes) expect(cls.fare, `${service.slug} ${cls.code}`).toBeGreaterThan(0);
    }
  });
});

describe('Amtrak route coverage', () => {
  const REQUIRED = [
    'acela', 'northeast-regional', 'california-zephyr', 'empire-builder', 'coast-starlight',
    'southwest-chief', 'texas-eagle', 'silver-star', 'silver-meteor', 'capitol-limited',
    'lake-shore-limited', 'crescent', 'cardinal', 'auto-train', 'sunset-limited',
    'city-of-new-orleans', 'borealis', 'downeaster', 'pacific-surfliner', 'san-joaquins',
    'amtrak-cascades', 'keystone-service', 'carolinian', 'palmetto', 'piedmont',
    'missouri-river-runner', 'lincoln-service', 'hiawatha', 'heartland-flyer', 'maple-leaf',
    'adirondack', 'ethan-allen-express', 'vermonter',
  ];

  it('includes every headline Amtrak service from the brief', () => {
    const slugs = new Set(allServices().map((s) => s.slug));
    for (const slug of REQUIRED) expect(slugs.has(slug), `missing ${slug}`).toBe(true);
  });
});

describe('station resolution', () => {
  it('resolves a station code, slug and city name to the same station', () => {
    expect(resolveStations('NYP')[0].code).toBe('NYP');
    expect(resolveStations('new-york-moynihan-train-hall')[0].code).toBe('NYP');
    expect(resolveStations('New York').some((s) => s.code === 'NYP')).toBe(true);
  });

  it('resolves a multi-station city slug to every station in that city', () => {
    const boston = resolveStations('boston');
    expect(boston.length).toBeGreaterThan(1);
    expect(boston.map((s) => s.code)).toEqual(expect.arrayContaining(['BOS', 'BON']));
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

  it('computes an overnight arrival with a day offset (Capitol Limited)', async () => {
    const result = await searchCorridor('chicago', 'washington-dc');
    const capitol = result!.journeys.find((j) => j.service.slug === 'capitol-limited')!;
    expect(capitol.departureTime).toBe('16:05');
    expect(capitol.arrivalDayOffset).toBe(1);
    expect(capitol.durationMin).toBe(1075);
  });

  it('handles the nonstop Auto Train as a single overnight segment', async () => {
    const result = await searchCorridor('lorton', 'sanford');
    const auto = result!.journeys.find((j) => j.service.slug === 'auto-train')!;
    expect(auto.intermediateStops).toBe(0);
    expect(auto.arrivalDayOffset).toBe(1);
  });

  it('counts intermediate stops on a segment', async () => {
    const result = await searchCorridor('new-york', 'washington-dc');
    const acela = result!.journeys.find((j) => j.service.slug === 'acela')!;
    expect(acela.intermediateStops).toBe(3); // Newark, Philadelphia, Baltimore
  });

  it('picks the cheapest journey by fare', async () => {
    const result = await searchCorridor('new-york', 'washington-dc');
    expect(result!.cheapest).toBeDefined();
    const cheapestFare = Math.min(...result!.cheapest!.classes.map((c) => c.fare));
    for (const j of result!.journeys) {
      expect(Math.min(...j.classes.map((c) => c.fare))).toBeGreaterThanOrEqual(cheapestFare * 0.999);
    }
  });

  it('returns null for unknown places and empty journeys for uncovered pairs', async () => {
    expect(await searchCorridor('atlantis', 'new-york')).toBeNull();
    const uncovered = await searchCorridor('bakersfield', 'miami');
    expect(uncovered!.journeys).toHaveLength(0);
  });

  it('only ever surfaces enabled (Amtrak) operators', async () => {
    const all = await searchCorridor('new-york', 'washington-dc');
    expect(all!.journeys.every((j) => j.operator.id === 'amtrak' && j.operator.enabled)).toBe(true);
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

  it('shows no active departures at a disabled-operator-only station', () => {
    expect(servicesAtStation('ANC')).toHaveLength(0); // Anchorage — Alaska Railroad only
    expect(servicesAtStation('BLM')).toHaveLength(0); // MiamiCentral — Brightline only
  });
});

describe('active stations', () => {
  it('activeStations and activeStationsList agree and exclude placeholder-only stations', () => {
    const byService = new Set(activeStations().map((s) => s.code));
    const byOperator = new Set(activeStationsList().map((s) => s.code));
    expect(byService).toEqual(byOperator);
    expect(byService.has('ANC')).toBe(false); // Alaska-only
    expect(byService.has('BLM')).toBe(false); // Brightline-only
    expect(byService.has('NYP')).toBe(true);
  });

  it('every active station has a resolvable slug and at least one active service', () => {
    for (const station of activeStations()) {
      expect(stationBySlug(station.slug)?.code).toBe(station.code);
      expect(servicesAtStation(station.code).length, `${station.code} has no active service`).toBeGreaterThan(0);
    }
  });
});

describe('corridor enumeration for the sitemap', () => {
  it('produces unique, well-formed city pairs, none touching a disabled operator', () => {
    const pairs = allCorridorPairs();
    expect(pairs.length).toBeGreaterThan(100);
    const keys = new Set(pairs.map((p) => `${p.from}|${p.to}`));
    expect(keys.size).toBe(pairs.length);
    for (const p of pairs) expect(p.from).not.toBe(p.to);
    const disabledCities = ['anchorage', 'fairbanks', 'talkeetna', 'seward', 'aventura', 'boca-raton'];
    for (const p of pairs) {
      expect(disabledCities).not.toContain(p.from);
      expect(disabledCities).not.toContain(p.to);
    }
  });

  it('lists a sample of enumerated pairs as resolvable corridors', async () => {
    for (const { from, to } of allCorridorPairs().slice(0, 50)) {
      const result = await searchCorridor(from, to);
      expect(result, `${from} -> ${to}`).not.toBeNull();
    }
  });
});

describe('formatting', () => {
  it('formats durations and USD/CAD fares', () => {
    expect(formatDuration(89)).toBe('1h 29m');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(45)).toBe('45m');
    expect(formatFare({ fare: 89, currency: 'USD' })).toBe('$89');
    expect(formatFare({ fare: 799, currency: 'CAD' })).toBe('C$799');
  });
});
