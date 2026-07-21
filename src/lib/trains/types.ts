// Core domain types for the rail platform. The bundled dataset (stations,
// operators, services) is curated in src/lib/trains/data/ and ships inside the
// serverless bundle — searches need zero external calls. Mutable state (service
// disruptions, admin notes) lives in Postgres as TrainServiceOverride.

export type TrainCountry = 'US' | 'IN';

export type StationFacility =
  | 'parking'
  | 'wifi'
  | 'lounge'
  | 'food'
  | 'luggage_storage'
  | 'accessible'
  | 'restrooms'
  | 'waiting_room'
  | 'charging'
  | 'taxi'
  | 'checked_baggage';

export interface TrainStation {
  /** Operator station code (Amtrak 3-letter / Indian Railways code). */
  code: string;
  name: string;
  city: string;
  /** State (US) or state/UT (India). */
  region: string;
  country: TrainCountry;
  /** URL slug for /trains/station/[slug] — unique across the dataset. */
  slug: string;
  /** City slug used for corridor URLs (/trains/route/[from]/[to]) — multiple
   * stations in one city share it. */
  citySlug: string;
  lat: number;
  lon: number;
  facilities: StationFacility[];
  /** Human-readable onward connections (metro lines, airport links, bus). */
  connections: string[];
  /** Operator ids serving this station. */
  operators: string[];
}

export interface TrainOperatorPolicies {
  baggage: string;
  pets: string;
  bikes: string;
  refunds: string;
  accessibility: string;
}

export interface TrainOperator {
  id: string;
  name: string;
  country: TrainCountry;
  website: string;
  /** How Ticketing-Info fulfils bookings for this operator today. */
  bookingModel: string;
  description: string;
  policies: TrainOperatorPolicies;
}

export interface RouteStop {
  /** Station code — must exist in the stations dataset. */
  station: string;
  /** Scheduled minutes after departure from the origin (0 for the origin). */
  minutesFromStart: number;
  /** Scheduled halt at this stop, minutes (0/undefined for origin & terminus). */
  haltMin?: number;
}

export type TrainCategory = 'high-speed' | 'premium' | 'long-distance' | 'intercity' | 'regional' | 'scenic' | 'overnight';

export interface TrainClassFare {
  code: string;
  name: string;
  /** Indicative end-to-end one-way fare — real fares are dynamic. */
  fare: number;
  currency: 'USD' | 'INR';
  perks: string[];
}

export type TrainAmenity =
  | 'wifi'
  | 'dining_car'
  | 'cafe'
  | 'catering_included'
  | 'power_outlets'
  | 'quiet_car'
  | 'sleeper'
  | 'checked_baggage'
  | 'bike_space'
  | 'pets_allowed'
  | 'accessible'
  | 'lounge_access'
  | 'panoramic_windows';

export interface TrainService {
  /** URL slug for /trains/train/[slug] — unique across the dataset. */
  slug: string;
  name: string;
  /** Train numbers (typically outbound + return). */
  numbers: string[];
  operator: string;
  country: TrainCountry;
  category: TrainCategory;
  /** e.g. 'Daily', 'Daily except Sun', '3× weekly (Mon·Wed·Fri)'. */
  frequency: string;
  /** End-to-end scheduled minutes (equals last stop's minutesFromStart). */
  durationMin: number;
  distanceKm: number;
  maxSpeedKmh?: number;
  /** Ordered stops in the outbound direction. */
  stops: RouteStop[];
  /** Local departure clock times, 'HH:MM' 24h. `return` present when the
   * service runs both directions (reverse timings are derived and indicative). */
  departures: { outbound: string; return?: string };
  classes: TrainClassFare[];
  amenities: TrainAmenity[];
  onTimePercent?: number;
  description: string;
  tips?: string[];
}

// ---- Search / engine result shapes ----

export type ServiceStatus = 'running' | 'disrupted' | 'suspended';

export interface ServiceOverrideInfo {
  status: ServiceStatus;
  notes?: string;
  updatedAt: string;
}

export interface TrainJourney {
  service: TrainService;
  operator: TrainOperator;
  from: TrainStation;
  to: TrainStation;
  direction: 'outbound' | 'return';
  departureTime: string; // 'HH:MM'
  arrivalTime: string; // 'HH:MM'
  /** Nights en route for this segment (0 = same-day arrival). */
  arrivalDayOffset: number;
  durationMin: number;
  /** Number of intermediate stops on this segment. */
  intermediateStops: number;
  /** Indicative fares scaled to the travelled segment. */
  classes: TrainClassFare[];
  /** Live admin status — overrides bundled data when present. */
  status: ServiceStatus;
  statusNote?: string;
}

export interface CorridorResult {
  from: TrainStation[];
  to: TrainStation[];
  journeys: TrainJourney[];
  fastest?: TrainJourney;
  cheapest?: TrainJourney;
}

export interface RailPass {
  slug: string;
  name: string;
  operator: string;
  country: TrainCountry | 'GLOBAL';
  price: string;
  validity: string;
  coverage: string;
  bestFor: string;
  howToBuy: string;
  available: boolean;
}
