// Curated flight route cluster powering the programmatic /flights/[from]/[to]
// SEO pages. This is a static content module (no DB, no live API at render) so
// the pages prerender cheaply and match the "no DB at build" constraint —
// generateStaticParams over this list is safe (unlike a Prisma-backed one).
//
// Scope is deliberately US-origin (US-market target): the diaspora-heavy
// USA↔India corridors first, then top domestic and long-haul international
// routes. Fares are labelled ESTIMATES (typical economy round-trip) — never
// presented as live or discounted prices.

export interface FlightRoute {
  fromSlug: string;
  toSlug: string;
  fromCity: string;
  toCity: string;
  /** Gateway airports travellers actually use for this city (IATA). */
  fromAirports: string[];
  toAirports: string[];
  /** Codes used to pre-fill the live search widget. */
  primaryFrom: string;
  primaryTo: string;
  international: boolean;
  /** True when at least one nonstop option exists on the corridor. */
  nonstop: boolean;
  distanceMiles: number;
  durationNonstop?: string;
  durationOneStop: string;
  airlines: string[];
  /** Typical economy round-trip estimate in USD (indicative only). */
  estFromUSD: number;
  cheapestMonths: string;
  peakSeasons: string;
  /** India corridor → surface visa/OCI + gateway-city guidance. */
  india?: boolean;
}

export const FLIGHT_ROUTE_DISCLAIMER =
  'Fares, durations, and nonstop availability are indicative estimates that vary by date, season, airline, and availability — they are not live quotes or offers. A travel consultant confirms current routing and the exact price before any payment is taken.';

const R = (r: FlightRoute) => r;

export const FLIGHT_ROUTES: FlightRoute[] = [
  // ---- USA ↔ India (diaspora core) ----
  R({ fromSlug: 'new-york', toSlug: 'delhi', fromCity: 'New York', toCity: 'Delhi', fromAirports: ['JFK', 'EWR'], toAirports: ['DEL'], primaryFrom: 'JFK', primaryTo: 'DEL', international: true, nonstop: true, distanceMiles: 7318, durationNonstop: '~14h 30m', durationOneStop: '~18–21h', airlines: ['Air India', 'United Airlines'], estFromUSD: 1150, cheapestMonths: 'January–March, September–October', peakSeasons: 'Diwali, Christmas/New Year, June–August', india: true }),
  R({ fromSlug: 'new-york', toSlug: 'mumbai', fromCity: 'New York', toCity: 'Mumbai', fromAirports: ['JFK', 'EWR'], toAirports: ['BOM'], primaryFrom: 'EWR', primaryTo: 'BOM', international: true, nonstop: true, distanceMiles: 7794, durationNonstop: '~15h 30m', durationOneStop: '~19–22h', airlines: ['Air India', 'United Airlines'], estFromUSD: 1180, cheapestMonths: 'February–March, September–October', peakSeasons: 'Diwali, Christmas/New Year, June–August', india: true }),
  R({ fromSlug: 'san-francisco', toSlug: 'delhi', fromCity: 'San Francisco', toCity: 'Delhi', fromAirports: ['SFO'], toAirports: ['DEL'], primaryFrom: 'SFO', primaryTo: 'DEL', international: true, nonstop: true, distanceMiles: 7691, durationNonstop: '~15h 45m', durationOneStop: '~19–23h', airlines: ['Air India', 'United Airlines'], estFromUSD: 1220, cheapestMonths: 'January–March, September', peakSeasons: 'Diwali, Christmas/New Year, summer', india: true }),
  R({ fromSlug: 'san-francisco', toSlug: 'bengaluru', fromCity: 'San Francisco', toCity: 'Bengaluru', fromAirports: ['SFO'], toAirports: ['BLR'], primaryFrom: 'SFO', primaryTo: 'BLR', international: true, nonstop: true, distanceMiles: 8701, durationNonstop: '~17h 30m', durationOneStop: '~20–24h', airlines: ['Air India'], estFromUSD: 1290, cheapestMonths: 'February–March, September–October', peakSeasons: 'Diwali, Christmas/New Year, summer', india: true }),
  R({ fromSlug: 'chicago', toSlug: 'delhi', fromCity: 'Chicago', toCity: 'Delhi', fromAirports: ['ORD'], toAirports: ['DEL'], primaryFrom: 'ORD', primaryTo: 'DEL', international: true, nonstop: true, distanceMiles: 7486, durationNonstop: '~15h', durationOneStop: '~18–22h', airlines: ['Air India', 'United Airlines'], estFromUSD: 1170, cheapestMonths: 'January–March, September–October', peakSeasons: 'Diwali, Christmas/New Year, June–August', india: true }),
  R({ fromSlug: 'washington', toSlug: 'delhi', fromCity: 'Washington DC', toCity: 'Delhi', fromAirports: ['IAD'], toAirports: ['DEL'], primaryFrom: 'IAD', primaryTo: 'DEL', international: true, nonstop: true, distanceMiles: 7486, durationNonstop: '~15h', durationOneStop: '~18–22h', airlines: ['Air India', 'United Airlines'], estFromUSD: 1190, cheapestMonths: 'February–March, September–October', peakSeasons: 'Diwali, Christmas/New Year, summer', india: true }),
  R({ fromSlug: 'los-angeles', toSlug: 'delhi', fromCity: 'Los Angeles', toCity: 'Delhi', fromAirports: ['LAX'], toAirports: ['DEL'], primaryFrom: 'LAX', primaryTo: 'DEL', international: true, nonstop: false, distanceMiles: 7994, durationOneStop: '~19–23h', airlines: ['Air India', 'Emirates', 'Qatar Airways'], estFromUSD: 1250, cheapestMonths: 'January–March, September', peakSeasons: 'Diwali, Christmas/New Year, summer', india: true }),
  R({ fromSlug: 'dallas', toSlug: 'delhi', fromCity: 'Dallas', toCity: 'Delhi', fromAirports: ['DFW'], toAirports: ['DEL'], primaryFrom: 'DFW', primaryTo: 'DEL', international: true, nonstop: false, distanceMiles: 8098, durationOneStop: '~19–23h', airlines: ['Qatar Airways', 'Emirates', 'Etihad Airways'], estFromUSD: 1230, cheapestMonths: 'February–March, September–October', peakSeasons: 'Diwali, Christmas/New Year, summer', india: true }),
  R({ fromSlug: 'boston', toSlug: 'delhi', fromCity: 'Boston', toCity: 'Delhi', fromAirports: ['BOS'], toAirports: ['DEL'], primaryFrom: 'BOS', primaryTo: 'DEL', international: true, nonstop: false, distanceMiles: 6971, durationOneStop: '~17–21h', airlines: ['Qatar Airways', 'Emirates', 'Lufthansa'], estFromUSD: 1210, cheapestMonths: 'January–March, September–October', peakSeasons: 'Diwali, Christmas/New Year, summer', india: true }),
  R({ fromSlug: 'houston', toSlug: 'delhi', fromCity: 'Houston', toCity: 'Delhi', fromAirports: ['IAH'], toAirports: ['DEL'], primaryFrom: 'IAH', primaryTo: 'DEL', international: true, nonstop: false, distanceMiles: 8138, durationOneStop: '~19–23h', airlines: ['Qatar Airways', 'Emirates', 'Etihad Airways'], estFromUSD: 1240, cheapestMonths: 'February–March, September', peakSeasons: 'Diwali, Christmas/New Year, summer', india: true }),
  R({ fromSlug: 'new-york', toSlug: 'ahmedabad', fromCity: 'New York', toCity: 'Ahmedabad', fromAirports: ['JFK', 'EWR'], toAirports: ['AMD'], primaryFrom: 'JFK', primaryTo: 'AMD', international: true, nonstop: false, distanceMiles: 7710, durationOneStop: '~18–22h', airlines: ['Air India', 'Emirates', 'Qatar Airways'], estFromUSD: 1260, cheapestMonths: 'February–March, September–October', peakSeasons: 'Diwali, Christmas/New Year, summer', india: true }),
  R({ fromSlug: 'chicago', toSlug: 'hyderabad', fromCity: 'Chicago', toCity: 'Hyderabad', fromAirports: ['ORD'], toAirports: ['HYD'], primaryFrom: 'ORD', primaryTo: 'HYD', international: true, nonstop: false, distanceMiles: 8400, durationOneStop: '~19–23h', airlines: ['Emirates', 'Qatar Airways', 'Etihad Airways'], estFromUSD: 1280, cheapestMonths: 'February–March, September', peakSeasons: 'Diwali, Christmas/New Year, summer', india: true }),
  R({ fromSlug: 'new-york', toSlug: 'chennai', fromCity: 'New York', toCity: 'Chennai', fromAirports: ['JFK', 'EWR'], toAirports: ['MAA'], primaryFrom: 'JFK', primaryTo: 'MAA', international: true, nonstop: false, distanceMiles: 8664, durationOneStop: '~19–23h', airlines: ['Qatar Airways', 'Emirates', 'Etihad Airways'], estFromUSD: 1270, cheapestMonths: 'February–March, September–October', peakSeasons: 'Diwali, Pongal, Christmas/New Year, summer', india: true }),

  // ---- US domestic (high volume) ----
  R({ fromSlug: 'new-york', toSlug: 'los-angeles', fromCity: 'New York', toCity: 'Los Angeles', fromAirports: ['JFK', 'EWR', 'LGA'], toAirports: ['LAX'], primaryFrom: 'JFK', primaryTo: 'LAX', international: false, nonstop: true, distanceMiles: 2475, durationNonstop: '~6h 15m', durationOneStop: '~8–10h', airlines: ['Delta Air Lines', 'American Airlines', 'JetBlue'], estFromUSD: 320, cheapestMonths: 'January–February, September', peakSeasons: 'Summer, Thanksgiving, Christmas' }),
  R({ fromSlug: 'new-york', toSlug: 'miami', fromCity: 'New York', toCity: 'Miami', fromAirports: ['JFK', 'EWR', 'LGA'], toAirports: ['MIA'], primaryFrom: 'JFK', primaryTo: 'MIA', international: false, nonstop: true, distanceMiles: 1090, durationNonstop: '~3h 15m', durationOneStop: '~5–7h', airlines: ['American Airlines', 'Delta Air Lines', 'JetBlue'], estFromUSD: 180, cheapestMonths: 'May–September', peakSeasons: 'Winter (Dec–Mar), spring break' }),
  R({ fromSlug: 'new-york', toSlug: 'san-francisco', fromCity: 'New York', toCity: 'San Francisco', fromAirports: ['JFK', 'EWR'], toAirports: ['SFO'], primaryFrom: 'JFK', primaryTo: 'SFO', international: false, nonstop: true, distanceMiles: 2586, durationNonstop: '~6h 30m', durationOneStop: '~8–10h', airlines: ['United Airlines', 'Delta Air Lines', 'JetBlue'], estFromUSD: 330, cheapestMonths: 'January–February', peakSeasons: 'Summer, holidays' }),
  R({ fromSlug: 'chicago', toSlug: 'new-york', fromCity: 'Chicago', toCity: 'New York', fromAirports: ['ORD', 'MDW'], toAirports: ['LGA', 'JFK', 'EWR'], primaryFrom: 'ORD', primaryTo: 'LGA', international: false, nonstop: true, distanceMiles: 740, durationNonstop: '~2h 25m', durationOneStop: '~4–6h', airlines: ['United Airlines', 'American Airlines', 'Delta Air Lines'], estFromUSD: 160, cheapestMonths: 'January–February', peakSeasons: 'Summer, holidays' }),
  R({ fromSlug: 'los-angeles', toSlug: 'las-vegas', fromCity: 'Los Angeles', toCity: 'Las Vegas', fromAirports: ['LAX', 'BUR'], toAirports: ['LAS'], primaryFrom: 'LAX', primaryTo: 'LAS', international: false, nonstop: true, distanceMiles: 236, durationNonstop: '~1h 10m', durationOneStop: '~3–5h', airlines: ['Southwest', 'Spirit', 'Delta Air Lines'], estFromUSD: 90, cheapestMonths: 'Weekdays year-round', peakSeasons: 'Weekends, conventions, New Year' }),
  R({ fromSlug: 'new-york', toSlug: 'orlando', fromCity: 'New York', toCity: 'Orlando', fromAirports: ['JFK', 'EWR', 'LGA'], toAirports: ['MCO'], primaryFrom: 'JFK', primaryTo: 'MCO', international: false, nonstop: true, distanceMiles: 944, durationNonstop: '~3h', durationOneStop: '~5–7h', airlines: ['JetBlue', 'Delta Air Lines', 'Spirit'], estFromUSD: 150, cheapestMonths: 'Late January, September', peakSeasons: 'Spring break, summer, holidays' }),
  R({ fromSlug: 'seattle', toSlug: 'los-angeles', fromCity: 'Seattle', toCity: 'Los Angeles', fromAirports: ['SEA'], toAirports: ['LAX'], primaryFrom: 'SEA', primaryTo: 'LAX', international: false, nonstop: true, distanceMiles: 954, durationNonstop: '~2h 50m', durationOneStop: '~5–7h', airlines: ['Alaska Airlines', 'Delta Air Lines'], estFromUSD: 140, cheapestMonths: 'January–February', peakSeasons: 'Summer, holidays' }),

  // ---- US ↔ international long-haul ----
  R({ fromSlug: 'new-york', toSlug: 'london', fromCity: 'New York', toCity: 'London', fromAirports: ['JFK', 'EWR'], toAirports: ['LHR', 'LGW'], primaryFrom: 'JFK', primaryTo: 'LHR', international: true, nonstop: true, distanceMiles: 3459, durationNonstop: '~7h', durationOneStop: '~10–12h', airlines: ['British Airways', 'Virgin Atlantic', 'Delta Air Lines', 'American Airlines'], estFromUSD: 620, cheapestMonths: 'January–March, November', peakSeasons: 'Summer, Christmas' }),
  R({ fromSlug: 'new-york', toSlug: 'paris', fromCity: 'New York', toCity: 'Paris', fromAirports: ['JFK', 'EWR'], toAirports: ['CDG'], primaryFrom: 'JFK', primaryTo: 'CDG', international: true, nonstop: true, distanceMiles: 3628, durationNonstop: '~7h 20m', durationOneStop: '~10–12h', airlines: ['Air France', 'Delta Air Lines', 'United Airlines'], estFromUSD: 640, cheapestMonths: 'January–March, November', peakSeasons: 'Summer, Christmas' }),
  R({ fromSlug: 'los-angeles', toSlug: 'tokyo', fromCity: 'Los Angeles', toCity: 'Tokyo', fromAirports: ['LAX'], toAirports: ['HND', 'NRT'], primaryFrom: 'LAX', primaryTo: 'HND', international: true, nonstop: true, distanceMiles: 5478, durationNonstop: '~11h 30m', durationOneStop: '~14–17h', airlines: ['Japan Airlines', 'ANA', 'United Airlines', 'Delta Air Lines'], estFromUSD: 780, cheapestMonths: 'January–February, September', peakSeasons: 'Cherry-blossom (Mar–Apr), Golden Week, summer' }),
  R({ fromSlug: 'new-york', toSlug: 'rome', fromCity: 'New York', toCity: 'Rome', fromAirports: ['JFK', 'EWR'], toAirports: ['FCO'], primaryFrom: 'JFK', primaryTo: 'FCO', international: true, nonstop: true, distanceMiles: 4280, durationNonstop: '~8h 45m', durationOneStop: '~11–14h', airlines: ['ITA Airways', 'Delta Air Lines', 'United Airlines'], estFromUSD: 720, cheapestMonths: 'January–March, November', peakSeasons: 'Summer, Easter, Christmas' }),
  R({ fromSlug: 'san-francisco', toSlug: 'london', fromCity: 'San Francisco', toCity: 'London', fromAirports: ['SFO'], toAirports: ['LHR'], primaryFrom: 'SFO', primaryTo: 'LHR', international: true, nonstop: true, distanceMiles: 5367, durationNonstop: '~10h 30m', durationOneStop: '~13–15h', airlines: ['British Airways', 'Virgin Atlantic', 'United Airlines'], estFromUSD: 720, cheapestMonths: 'January–March, November', peakSeasons: 'Summer, Christmas' }),
  R({ fromSlug: 'new-york', toSlug: 'dubai', fromCity: 'New York', toCity: 'Dubai', fromAirports: ['JFK', 'EWR'], toAirports: ['DXB'], primaryFrom: 'JFK', primaryTo: 'DXB', international: true, nonstop: true, distanceMiles: 6836, durationNonstop: '~12h 30m', durationOneStop: '~15–18h', airlines: ['Emirates', 'United Airlines'], estFromUSD: 850, cheapestMonths: 'May–August', peakSeasons: 'Winter (Nov–Mar), holidays' }),
  R({ fromSlug: 'miami', toSlug: 'madrid', fromCity: 'Miami', toCity: 'Madrid', fromAirports: ['MIA'], toAirports: ['MAD'], primaryFrom: 'MIA', primaryTo: 'MAD', international: true, nonstop: true, distanceMiles: 4653, durationNonstop: '~8h 30m', durationOneStop: '~12–14h', airlines: ['Iberia', 'American Airlines', 'Air Europa'], estFromUSD: 700, cheapestMonths: 'January–February, November', peakSeasons: 'Summer, Easter, Christmas' }),
  R({ fromSlug: 'los-angeles', toSlug: 'sydney', fromCity: 'Los Angeles', toCity: 'Sydney', fromAirports: ['LAX'], toAirports: ['SYD'], primaryFrom: 'LAX', primaryTo: 'SYD', international: true, nonstop: true, distanceMiles: 7488, durationNonstop: '~15h', durationOneStop: '~18–22h', airlines: ['Qantas', 'United Airlines', 'Delta Air Lines'], estFromUSD: 1150, cheapestMonths: 'February–May', peakSeasons: 'Dec–Jan (Australian summer), June–July' }),
  R({ fromSlug: 'new-york', toSlug: 'cancun', fromCity: 'New York', toCity: 'Cancún', fromAirports: ['JFK', 'EWR'], toAirports: ['CUN'], primaryFrom: 'JFK', primaryTo: 'CUN', international: true, nonstop: true, distanceMiles: 1553, durationNonstop: '~4h 30m', durationOneStop: '~7–9h', airlines: ['JetBlue', 'Delta Air Lines', 'American Airlines'], estFromUSD: 300, cheapestMonths: 'May–June, September', peakSeasons: 'Winter, spring break, Christmas' }),
];

const routeKey = (from: string, to: string) => `${from.toLowerCase()}|${to.toLowerCase()}`;
const ROUTE_INDEX = new Map(FLIGHT_ROUTES.map((r) => [routeKey(r.fromSlug, r.toSlug), r]));

export function getFlightRoute(fromSlug: string, toSlug: string): FlightRoute | null {
  return ROUTE_INDEX.get(routeKey(fromSlug, toSlug)) ?? null;
}

export function allFlightRoutePairs(): { from: string; to: string }[] {
  return FLIGHT_ROUTES.map((r) => ({ from: r.fromSlug, to: r.toSlug }));
}

/** Up to `limit` routes sharing this origin or destination, for internal linking. */
export function relatedFlightRoutes(route: FlightRoute, limit = 6): FlightRoute[] {
  return FLIGHT_ROUTES.filter(
    (r) =>
      !(r.fromSlug === route.fromSlug && r.toSlug === route.toSlug) &&
      (r.fromSlug === route.fromSlug || r.toSlug === route.toSlug || r.toSlug === route.fromSlug),
  ).slice(0, limit);
}

export function routeMetaTitle(r: FlightRoute): string {
  return `${r.fromCity} to ${r.toCity} Flights — Fares, Airlines & Best Time to Book`;
}

export function routeMetaDescription(r: FlightRoute): string {
  const stops = r.nonstop ? `nonstop from ${r.durationNonstop}` : `one-stop from ${r.durationOneStop}`;
  return `Compare ${r.fromCity} to ${r.toCity} flight fares (${stops}) on ${r.airlines.slice(0, 3).join(', ')}. See the cheapest months to fly, gateway airports, and get a fare quote from a real travel consultant.`;
}

export interface RouteFaq {
  question: string;
  answer: string;
}

export function routeFaqs(r: FlightRoute): RouteFaq[] {
  const faqs: RouteFaq[] = [
    {
      question: `Are there nonstop flights from ${r.fromCity} to ${r.toCity}?`,
      answer: r.nonstop
        ? `Yes — nonstop service runs on this route (typically ${r.durationNonstop}), usually from ${r.fromAirports.join(' or ')} to ${r.toAirports.join(' or ')} on ${r.airlines.slice(0, 2).join(' and ')}. Nonstop schedules change with season and demand, so confirm current options when you enquire.`
        : `Not reliably — most ${r.fromCity}–${r.toCity} itineraries connect once (typically ${r.durationOneStop}) through a hub served by ${r.airlines.slice(0, 3).join(', ')}. A one-stop routing is often the best mix of price and total travel time on this corridor.`,
    },
    {
      question: `What is the cheapest time to fly from ${r.fromCity} to ${r.toCity}?`,
      answer: `Fares are usually lowest in ${r.cheapestMonths}. Demand and prices peak around ${r.peakSeasons}, when booking 2–4 months ahead is worth it. Indicative economy round-trip fares start around $${r.estFromUSD.toLocaleString()}, though your exact price depends on dates and how far ahead you book.`,
    },
    {
      question: `Which airlines fly ${r.fromCity} to ${r.toCity}?`,
      answer: `${r.airlines.join(', ')} are the main carriers on this route. We compare all of them — including one-stop options that can undercut a nonstop fare — when you request a quote.`,
    },
  ];
  if (r.india) {
    faqs.push({
      question: `What documents do I need to fly from ${r.fromCity} to ${r.toCity}?`,
      answer: `You need a valid passport, and — unless you are an Indian citizen or OCI cardholder — a valid Indian visa or e-Visa. If you are an NRI unsure whether an OCI card or a visa applies to your family, see our guide on OCI cards vs. Indian visas for NRIs.`,
    });
  } else if (r.international) {
    faqs.push({
      question: `Do I need a visa to travel from ${r.fromCity} to ${r.toCity}?`,
      answer: `Entry requirements depend on your passport and the length and purpose of your stay. Check your specific requirements with our visa checker before you book, and we'll flag anything to sort out when you enquire.`,
    });
  }
  return faqs;
}
