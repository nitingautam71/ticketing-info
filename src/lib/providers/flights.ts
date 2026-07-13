export type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First';

export interface FlightSegment {
  flightNumber: string;
  carrierName: string;
  carrierCode: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  /** Ground time before this segment; undefined for the first segment of the leg. */
  layoverMinutes?: number;
}

export interface FarePolicy {
  changeable: boolean;
  cancellable: boolean;
  refundable: boolean;
}

export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  airlineLogoUrl?: string;
  /** Set only when the operating carrier differs from the marketing/codeshare carrier. */
  operatingAirline?: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  arrivesNextDay?: boolean;
  duration: string;
  stops: number;
  stopoverAirports?: string[];
  segments?: FlightSegment[];
  /** Total price for the whole itinerary across every requested traveler — NOT per-passenger. */
  price: number;
  class: CabinClass;
  baggage: string;
  /** Connection booked as separate tickets — passenger must recheck bags themselves. */
  isSelfTransfer?: boolean;
  /** Airline/booking site guarantees rebooking if a self-transfer connection is missed. */
  isProtectedSelfTransfer?: boolean;
  /** Outbound and return (or two one-ways) sold as unrelated, separately-issued tickets. */
  isMashUp?: boolean;
  farePolicy?: FarePolicy;
  /** CO2 emissions vs. the greenest itinerary on this route, as a +/- percentage. */
  ecoDeltaPercent?: number;
  /** Friendly ranking badges, e.g. "Cheapest", "Fastest". */
  tags?: string[];
  /** Skyscanner's own itinerary quality ranking (0-1, higher is better) — powers the "Best" sort. */
  qualityScore?: number;
}

export interface FlightSearchParams {
  from: string;
  to: string;
  date: string;
  cabinClass: CabinClass;
  adults: number;
}

interface FlightProvider {
  search(params: FlightSearchParams): Promise<Flight[]>;
}

// Real airline wordmarks, sourced from Wikimedia Commons (each verified to resolve) so
// mock-provider results show actual brand logos instead of a plain letter-code badge —
// this is independent of the live Sky Scrapper airlineLogoUrl (see SkyScrapperFlightProvider
// below), which is used instead whenever RAPIDAPI_KEY is configured.
const AIRLINES = [
  { name: 'Delta Air Lines', logo: 'DL', bag: '1 Carry-on, 1 Checked bag free', logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Delta_logo.svg' },
  { name: 'United Airlines', logo: 'UA', bag: '1 Carry-on, checked bag $30', logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/United_Airlines_Logo.svg' },
  { name: 'American Airlines', logo: 'AA', bag: '1 Carry-on, 1 Checked bag free', logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/American_Airlines_logo_2013.svg' },
  { name: 'British Airways', logo: 'BA', bag: '2 Checked bags free', logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/British_Airways_Logo.svg' },
  { name: 'Singapore Airlines', logo: 'SQ', bag: '2 Checked bags free', logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Singapore_Airlines_Logo_2.svg' },
  { name: 'Emirates', logo: 'EK', bag: '2 Checked bags free', logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Emirates_Logo.svg' },
  { name: 'Lufthansa', logo: 'LH', bag: '1 Checked bag free', logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Lufthansa_Logo_2018.svg' },
];

const AIRPORTS: Record<string, string> = {
  JFK: 'New York JFK',
  LHR: 'London Heathrow',
  HND: 'Tokyo Haneda',
  SFO: 'San Francisco',
  CDG: 'Paris Charles de Gaulle',
  DXB: 'Dubai Intl',
  SIN: 'Singapore Changi',
  LAX: 'Los Angeles Intl',
  ORD: "Chicago O'Hare",
};

// Static fallback airport list so the departure/arrival typeahead still returns results
// when RAPIDAPI_KEY is unset or the live Sky Scrapper lookup fails/rate-limits (mirrors
// the POPULAR_DESTINATIONS fallback pattern in src/lib/providers/hotels.ts). Covers major
// hubs across every region so most user queries resolve to something useful offline.
const POPULAR_AIRPORTS: Array<{ code: string; name: string; subtitle: string }> = [
  { code: 'JFK', name: 'New York John F. Kennedy', subtitle: 'New York, United States' },
  { code: 'EWR', name: 'Newark Liberty', subtitle: 'Newark, United States' },
  { code: 'LAX', name: 'Los Angeles Intl', subtitle: 'Los Angeles, United States' },
  { code: 'SFO', name: 'San Francisco Intl', subtitle: 'San Francisco, United States' },
  { code: 'ORD', name: "Chicago O'Hare", subtitle: 'Chicago, United States' },
  { code: 'MIA', name: 'Miami Intl', subtitle: 'Miami, United States' },
  { code: 'SEA', name: 'Seattle-Tacoma', subtitle: 'Seattle, United States' },
  { code: 'YYZ', name: 'Toronto Pearson', subtitle: 'Toronto, Canada' },
  { code: 'YVR', name: 'Vancouver Intl', subtitle: 'Vancouver, Canada' },
  { code: 'LHR', name: 'London Heathrow', subtitle: 'London, United Kingdom' },
  { code: 'LGW', name: 'London Gatwick', subtitle: 'London, United Kingdom' },
  { code: 'CDG', name: 'Paris Charles de Gaulle', subtitle: 'Paris, France' },
  { code: 'AMS', name: 'Amsterdam Schiphol', subtitle: 'Amsterdam, Netherlands' },
  { code: 'FRA', name: 'Frankfurt Intl', subtitle: 'Frankfurt, Germany' },
  { code: 'MUC', name: 'Munich Intl', subtitle: 'Munich, Germany' },
  { code: 'MAD', name: 'Madrid Barajas', subtitle: 'Madrid, Spain' },
  { code: 'BCN', name: 'Barcelona El Prat', subtitle: 'Barcelona, Spain' },
  { code: 'FCO', name: 'Rome Fiumicino', subtitle: 'Rome, Italy' },
  { code: 'IST', name: 'Istanbul Airport', subtitle: 'Istanbul, Turkey' },
  { code: 'ZRH', name: 'Zurich Airport', subtitle: 'Zurich, Switzerland' },
  { code: 'DXB', name: 'Dubai Intl', subtitle: 'Dubai, United Arab Emirates' },
  { code: 'AUH', name: 'Abu Dhabi Intl', subtitle: 'Abu Dhabi, United Arab Emirates' },
  { code: 'DOH', name: 'Hamad Intl', subtitle: 'Doha, Qatar' },
  { code: 'DEL', name: 'Delhi Indira Gandhi', subtitle: 'New Delhi, India' },
  { code: 'BOM', name: 'Mumbai Chhatrapati Shivaji', subtitle: 'Mumbai, India' },
  { code: 'BLR', name: 'Bengaluru Kempegowda', subtitle: 'Bengaluru, India' },
  { code: 'SIN', name: 'Singapore Changi', subtitle: 'Singapore' },
  { code: 'HND', name: 'Tokyo Haneda', subtitle: 'Tokyo, Japan' },
  { code: 'NRT', name: 'Tokyo Narita', subtitle: 'Tokyo, Japan' },
  { code: 'ICN', name: 'Seoul Incheon', subtitle: 'Seoul, South Korea' },
  { code: 'HKG', name: 'Hong Kong Intl', subtitle: 'Hong Kong' },
  { code: 'PVG', name: 'Shanghai Pudong', subtitle: 'Shanghai, China' },
  { code: 'BKK', name: 'Bangkok Suvarnabhumi', subtitle: 'Bangkok, Thailand' },
  { code: 'KUL', name: 'Kuala Lumpur Intl', subtitle: 'Kuala Lumpur, Malaysia' },
  { code: 'SYD', name: 'Sydney Kingsford Smith', subtitle: 'Sydney, Australia' },
  { code: 'MEL', name: 'Melbourne Airport', subtitle: 'Melbourne, Australia' },
  { code: 'AKL', name: 'Auckland Airport', subtitle: 'Auckland, New Zealand' },
  { code: 'JNB', name: 'O.R. Tambo Intl', subtitle: 'Johannesburg, South Africa' },
  { code: 'CPT', name: 'Cape Town Intl', subtitle: 'Cape Town, South Africa' },
  { code: 'GRU', name: 'São Paulo Guarulhos', subtitle: 'São Paulo, Brazil' },
  { code: 'MEX', name: 'Mexico City Intl', subtitle: 'Mexico City, Mexico' },
];

function formatClock12(hour: number, minute: number): string {
  const h = ((hour % 24) + 24) % 24;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${suffix}`;
}

function formatDuration(totalMinutes: number): string {
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
}

/**
 * Placeholder provider generating realistic-looking search results so the
 * lead-gen MVP can ship before a real supplier (Amadeus, Duffel, etc.) is
 * contracted. Swap `flightProvider` below for a real adapter later — nothing
 * else in the app needs to change.
 */
class MockFlightProvider implements FlightProvider {
  async search({ from, to, cabinClass }: FlightSearchParams): Promise<Flight[]> {
    const fCode = (from || 'JFK').toUpperCase();
    const tCode = (to || 'LHR').toUpperCase();

    const results: Flight[] = [];
    const count = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
      const flNum = Math.floor(100 + Math.random() * 899);
      const depHour = 6 + Math.floor(Math.random() * 15);
      const depMin = Math.random() > 0.5 ? 30 : 0;
      const durationHours = 4 + Math.floor(Math.random() * 10);
      const durationMins = Math.random() > 0.5 ? 45 : 15;
      const totalMinutes = durationHours * 60 + durationMins;
      const arrivalMinutesFromMidnight = depHour * 60 + depMin + totalMinutes;
      const arrivesNextDay = arrivalMinutesFromMidnight >= 24 * 60;
      const depTime = formatClock12(depHour, depMin);
      const arrTime = formatClock12(Math.floor((arrivalMinutesFromMidnight % (24 * 60)) / 60), arrivalMinutesFromMidnight % 60);

      const stops = Math.random() > 0.6 ? 1 : 0;
      const stopoverCode = Object.keys(AIRPORTS).find((k) => k !== fCode && k !== tCode) || 'ORD';
      const stopoverAirports = stops === 1 ? [stopoverCode] : [];
      const flightNumber = `${airline.logo}${flNum}`;

      const segments: FlightSegment[] = stopoverAirports.length
        ? [
            {
              flightNumber,
              carrierName: airline.name,
              carrierCode: airline.logo,
              departureAirport: fCode,
              arrivalAirport: stopoverCode,
              departureTime: depTime,
              arrivalTime: formatClock12(depHour + Math.floor(durationHours / 2), depMin),
              durationMinutes: Math.floor(totalMinutes / 2),
            },
            {
              flightNumber: `${airline.logo}${flNum + 1}`,
              carrierName: airline.name,
              carrierCode: airline.logo,
              departureAirport: stopoverCode,
              arrivalAirport: tCode,
              departureTime: formatClock12(depHour + Math.floor(durationHours / 2) + 1, depMin),
              arrivalTime: arrTime,
              durationMinutes: Math.ceil(totalMinutes / 2),
              layoverMinutes: 75,
            },
          ]
        : [
            {
              flightNumber,
              carrierName: airline.name,
              carrierCode: airline.logo,
              departureAirport: fCode,
              arrivalAirport: tCode,
              departureTime: depTime,
              arrivalTime: arrTime,
              durationMinutes: totalMinutes,
            },
          ];

      let basePrice = 250 + Math.floor(Math.random() * 600);
      if (cabinClass === 'Premium Economy') basePrice *= 1.5;
      if (cabinClass === 'Business') basePrice *= 3;
      if (cabinClass === 'First') basePrice *= 5;

      results.push({
        id: `FL-${fCode}-${tCode}-${flNum}-${i}`,
        airline: airline.name,
        airlineLogo: airline.logo,
        airlineLogoUrl: airline.logoUrl,
        flightNumber,
        departureAirport: fCode,
        arrivalAirport: tCode,
        departureTime: depTime,
        arrivalTime: arrTime,
        arrivesNextDay,
        duration: formatDuration(totalMinutes),
        stops,
        stopoverAirports,
        segments,
        price: Math.floor(basePrice),
        class: cabinClass,
        baggage: airline.bag,
      });
    }

    return results.sort((a, b) => a.price - b.price);
  }
}

const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'sky-scrapper.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const CABIN_CLASS_PARAM: Record<CabinClass, string> = {
  Economy: 'economy',
  'Premium Economy': 'premium_economy',
  Business: 'business',
  First: 'first',
};

const TAG_LABELS: Record<string, string> = {
  cheapest: 'Cheapest',
  shortest: 'Fastest',
  best: 'Recommended',
  best_quality: 'Recommended',
};

interface AirportSearchResponse {
  status: boolean;
  data?: Array<{
    navigation: {
      relevantFlightParams: { skyId: string; entityId: string; flightPlaceType: string };
    };
  }>;
}

interface RawCarrier {
  name: string;
  alternateId: string;
  logoUrl?: string;
}

interface RawSegment {
  origin?: { displayCode: string };
  destination?: { displayCode: string };
  departure: string;
  arrival: string;
  durationInMinutes: number;
  flightNumber: string;
  marketingCarrier?: RawCarrier;
  operatingCarrier?: RawCarrier;
}

interface RawLeg {
  origin?: { displayCode: string };
  destination?: { displayCode: string };
  durationInMinutes: number;
  stopCount: number;
  departure: string;
  arrival: string;
  timeDeltaInDays?: number;
  carriers?: { marketing?: RawCarrier[] };
  segments?: RawSegment[];
}

interface RawItinerary {
  id: string;
  price: { raw: number };
  legs: RawLeg[];
  isSelfTransfer?: boolean;
  isProtectedSelfTransfer?: boolean;
  isMashUp?: boolean;
  farePolicy?: {
    isChangeAllowed: boolean;
    isCancellationAllowed: boolean;
    isPartiallyRefundable: boolean;
  };
  eco?: { ecoContenderDelta: number };
  tags?: string[];
  score?: number;
}

interface FlightSearchResponse {
  status: boolean;
  data?: {
    context: { status: string; sessionId?: string };
    itineraries: RawItinerary[];
  };
}

/** Resolved Skyscanner-internal place identifiers, keyed by IATA code. */
const airportCache = new Map<string, { skyId: string; entityId: string }>();
/** Short-lived cache of full search results to avoid burning RapidAPI quota on repeat searches. */
const searchCache = new Map<string, { flights: Flight[]; expires: number }>();

async function rapidApiGet<T extends { status: boolean }>(path: string, params: Record<string, string>): Promise<T> {
  const url = `https://${RAPIDAPI_HOST}${path}?${new URLSearchParams(params)}`;
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(url, {
        headers: { 'x-rapidapi-host': RAPIDAPI_HOST, 'x-rapidapi-key': RAPIDAPI_KEY! },
        signal: controller.signal,
      });
      if (res.status === 429) throw new Error('Sky Scrapper rate limit hit');
      if (!res.ok) throw new Error(`Sky Scrapper HTTP ${res.status}`);
      const json = (await res.json()) as T;
      if (!json.status) throw new Error('Sky Scrapper returned status:false');
      return json;
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Sky Scrapper request failed');
}

function searchStaticAirports(query: string): Array<{ code: string; name: string; subtitle: string }> {
  const q = query.trim().toLowerCase();
  return POPULAR_AIRPORTS.filter(
    (a) => a.code.toLowerCase().startsWith(q) || a.name.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
  ).slice(0, 8);
}

/** Airport-only suggestions for a free-text query — used by the search typeahead and by code resolution. */
export async function searchAirports(query: string): Promise<Array<{ code: string; name: string; subtitle: string }>> {
  if (query.trim().length < 2) return [];
  if (!RAPIDAPI_KEY) return searchStaticAirports(query);

  try {
    const json = await rapidApiGet<{
      status: boolean;
      data?: Array<{
        presentation: { title: string; subtitle: string };
        navigation: { relevantFlightParams: { skyId: string; flightPlaceType: string } };
      }>;
    }>('/api/v1/flights/searchAirport', { query: query.trim(), locale: 'en-US' });

    const seen = new Set<string>();
    const results = (json.data ?? [])
      .filter((e) => e.navigation.relevantFlightParams.flightPlaceType === 'AIRPORT')
      .map((e) => ({ code: e.navigation.relevantFlightParams.skyId, name: e.presentation.title, subtitle: e.presentation.subtitle }))
      .filter((a) => {
        if (seen.has(a.code)) return false;
        seen.add(a.code);
        return true;
      })
      .slice(0, 8);

    // Live lookup succeeded but returned nothing useful (e.g. an obscure query) — fall
    // back to the static list rather than showing an empty dropdown.
    return results.length > 0 ? results : searchStaticAirports(query);
  } catch (err) {
    console.error('Live airport search failed, using static fallback', err);
    return searchStaticAirports(query);
  }
}

async function resolveAirport(code: string): Promise<{ skyId: string; entityId: string }> {
  const key = code.toUpperCase();
  const cached = airportCache.get(key);
  if (cached) return cached;

  const json = await rapidApiGet<AirportSearchResponse>('/api/v1/flights/searchAirport', {
    query: key,
    locale: 'en-US',
  });

  const entries = json.data ?? [];
  const match =
    entries.find((e) => e.navigation.relevantFlightParams.flightPlaceType === 'AIRPORT' && e.navigation.relevantFlightParams.skyId.toUpperCase() === key) ??
    entries.find((e) => e.navigation.relevantFlightParams.flightPlaceType === 'AIRPORT') ??
    entries[0];

  if (!match) throw new Error(`Sky Scrapper: no airport match for "${code}"`);

  const resolved = { skyId: match.navigation.relevantFlightParams.skyId, entityId: match.navigation.relevantFlightParams.entityId };
  airportCache.set(key, resolved);
  return resolved;
}

/** Pulls "HH:MM" straight out of the ISO string instead of routing through `Date`, so server timezone can't shift the displayed local time. */
function formatClock(iso: string): string {
  const match = iso.match(/T(\d{2}):(\d{2})/);
  if (!match) return iso;
  let hours = parseInt(match[1], 10);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${match[2]} ${suffix}`;
}

function defaultDepartureDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

/**
 * Real-time flight search backed by RapidAPI's "Sky Scrapper" (unofficial
 * Skyscanner scraper). Good enough for showing live-looking prices to
 * generate leads; it cannot create a PNR or take payment — see README/CLAUDE
 * notes before wiring an actual booking flow to this provider.
 */
class SkyScrapperFlightProvider implements FlightProvider {
  async search({ from, to, date, cabinClass, adults }: FlightSearchParams): Promise<Flight[]> {
    const originCode = (from || 'JFK').toUpperCase();
    const destCode = (to || 'LHR').toUpperCase();
    const searchDate = date || defaultDepartureDate();
    const paxCount = Math.min(9, Math.max(1, adults || 1));

    const cacheKey = `${originCode}|${destCode}|${searchDate}|${cabinClass}|${paxCount}`;
    const cached = searchCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return cached.flights;

    const [origin, destination] = await Promise.all([resolveAirport(originCode), resolveAirport(destCode)]);

    const json = await rapidApiGet<FlightSearchResponse>('/api/v1/flights/searchFlights', {
      originSkyId: origin.skyId,
      destinationSkyId: destination.skyId,
      originEntityId: origin.entityId,
      destinationEntityId: destination.entityId,
      date: searchDate,
      cabinClass: CABIN_CLASS_PARAM[cabinClass],
      adults: String(paxCount),
      currency: 'USD',
      market: 'en-US',
      countryCode: 'US',
    });

    const itineraries = json.data?.itineraries ?? [];
    const flights: Flight[] = itineraries
      .filter((it) => it.legs?.[0])
      .map((it) => {
        const leg = it.legs[0];
        const rawSegments = leg.segments ?? [];
        const marketingCarriers = leg.carriers?.marketing ?? [];
        const isMultiAirline = marketingCarriers.length > 1;
        const legMarketingCarrier = marketingCarriers[0];

        const segments: FlightSegment[] = rawSegments.map((seg, idx) => {
          const prev = rawSegments[idx - 1];
          const layoverMinutes = prev ? Math.round((new Date(seg.departure).getTime() - new Date(prev.arrival).getTime()) / 60000) : undefined;
          const carrier = seg.marketingCarrier ?? legMarketingCarrier;
          return {
            flightNumber: `${carrier?.alternateId ?? ''}${seg.flightNumber}`,
            carrierName: carrier?.name || 'Unknown Airline',
            carrierCode: carrier?.alternateId || '—',
            departureAirport: seg.origin?.displayCode || '',
            arrivalAirport: seg.destination?.displayCode || '',
            departureTime: formatClock(seg.departure),
            arrivalTime: formatClock(seg.arrival),
            durationMinutes: seg.durationInMinutes,
            layoverMinutes,
          };
        });

        const stopoverAirports = rawSegments
          .slice(0, -1)
          .map((s) => s.destination?.displayCode)
          .filter((code): code is string => Boolean(code));

        const operatingName = rawSegments[0]?.operatingCarrier?.name;
        const marketingName = rawSegments[0]?.marketingCarrier?.name ?? legMarketingCarrier?.name;
        const operatingAirline = operatingName && operatingName !== marketingName ? operatingName : undefined;

        const tags = (it.tags ?? []).map((t) => TAG_LABELS[t]).filter((label): label is string => Boolean(label));

        return {
          id: it.id,
          airline: isMultiAirline ? 'Multiple Airlines' : legMarketingCarrier?.name || 'Unknown Airline',
          airlineLogo: isMultiAirline ? '✈' : legMarketingCarrier?.alternateId || '—',
          airlineLogoUrl: isMultiAirline ? undefined : legMarketingCarrier?.logoUrl,
          operatingAirline,
          flightNumber: segments[0]?.flightNumber || legMarketingCarrier?.alternateId || '',
          departureAirport: leg.origin?.displayCode || originCode,
          arrivalAirport: leg.destination?.displayCode || destCode,
          departureTime: formatClock(leg.departure),
          arrivalTime: formatClock(leg.arrival),
          arrivesNextDay: (leg.timeDeltaInDays ?? 0) > 0,
          duration: formatDuration(leg.durationInMinutes),
          stops: leg.stopCount ?? 0,
          stopoverAirports,
          segments,
          price: Math.round(it.price?.raw ?? 0),
          class: cabinClass,
          baggage: 'Confirm baggage allowance at checkout',
          isSelfTransfer: it.isSelfTransfer,
          isProtectedSelfTransfer: it.isProtectedSelfTransfer,
          isMashUp: it.isMashUp,
          farePolicy: it.farePolicy
            ? {
                changeable: it.farePolicy.isChangeAllowed,
                cancellable: it.farePolicy.isCancellationAllowed,
                refundable: it.farePolicy.isPartiallyRefundable,
              }
            : undefined,
          ecoDeltaPercent: it.eco ? Math.round(it.eco.ecoContenderDelta * 10) / 10 : undefined,
          tags,
          qualityScore: it.score,
        };
      })
      .sort((a, b) => a.price - b.price)
      .slice(0, 20);

    if (flights.length === 0) throw new Error('Sky Scrapper returned zero itineraries for this route/date');

    searchCache.set(cacheKey, { flights, expires: Date.now() + 5 * 60 * 1000 });
    return flights;
  }
}

/**
 * Swap point for the flight data source: real Sky Scrapper search when
 * RAPIDAPI_KEY is configured, otherwise the deterministic mock so local dev
 * works without a key.
 */
export const flightProvider: FlightProvider = RAPIDAPI_KEY ? new SkyScrapperFlightProvider() : new MockFlightProvider();

export function airportName(code: string): string {
  return AIRPORTS[code.toUpperCase()] || code.toUpperCase();
}

export async function searchFlights(params: FlightSearchParams): Promise<Flight[]> {
  return flightProvider.search(params);
}
