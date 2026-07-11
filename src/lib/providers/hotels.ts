export type BedType = 'Single' | 'Double' | 'Twin' | 'Queen' | 'King';
export type MealPlan = 'Room Only' | 'Breakfast Included' | 'Half Board' | 'Full Board' | 'All Inclusive';

export interface HotelRoomType {
  name: string;
  price: number;
  description: string;
  capacity: number;
  bedType: BedType;
  mealPlan: MealPlan;
  refundable: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  /** Real-line-of-sight distance from the searched destination's coordinates — city center, landmark, or airport, whichever was searched. */
  distanceFromCenterKm?: number;
  /** Guest review score, 0-10 scale. */
  rating: number;
  reviewScoreWord?: string;
  reviewsCount: number;
  /** Property class / star rating, 0-5 (0 = unrated). */
  stars: number;
  pricePerNight: number;
  originalPricePerNight?: number;
  /** Total price for the full requested stay (all nights, all rooms) — the figure actually quoted by the source. */
  totalPrice: number;
  nights: number;
  currency: string;
  image: string;
  images: string[];
  amenities: string[];
  roomTypes: HotelRoomType[];
  freeCancellation?: boolean;
  payAtProperty?: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  isSponsored?: boolean;
}

export interface HotelDestination {
  destId: string;
  searchType: string;
  name: string;
  label: string;
  /** Human-friendly place type: City, Region, Landmark, Hotel, District, Airport. */
  placeType: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface HotelSearchParams {
  destId: string;
  searchType: string;
  location: string;
  destLatitude?: number;
  destLongitude?: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  childAges: number[];
  rooms: number;
}

interface HotelProvider {
  search(params: HotelSearchParams): Promise<Hotel[]>;
}

const AMENITIES_POOL = [
  'Free WiFi',
  'Free Breakfast',
  'Free Parking',
  'Swimming Pool',
  'Fitness Center',
  'Spa & Wellness',
  'Pet Friendly',
  'Air Conditioning',
  'Kitchenette',
  'Beach Access',
  'Business Center',
  'Family Rooms',
  'Airport Shuttle',
  'Bar / Lounge',
];

const HOTEL_BRANDS = [
  { name: 'Grand Plaza Resort', rating: 9.2, reviews: 1250, stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60' },
  { name: 'Vanguard Boutique Hotel', rating: 8.9, reviews: 420, stars: 4, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60' },
  { name: 'Royal Palace Suites', rating: 9.5, reviews: 890, stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=60' },
  { name: 'Comfort Inn & Executive Suites', rating: 7.8, reviews: 2100, stars: 3, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=60' },
  { name: 'The Meridian Luxury Lodge', rating: 8.7, reviews: 670, stars: 5, image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=60' },
  { name: 'Apex Urban Residences', rating: 8.3, reviews: 1530, stars: 4, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=60' },
  { name: 'Harborview Inn', rating: 8.0, reviews: 340, stars: 3, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=60' },
  { name: 'Cedar & Stone Hotel', rating: 9.0, reviews: 980, stars: 4, image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=60' },
];

const GALLERY_POOL = [
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=900&auto=format&fit=crop&q=60',
];

const POPULAR_DESTINATIONS: HotelDestination[] = [
  { destId: 'mock-london', searchType: 'mock', name: 'London', label: 'London, United Kingdom', placeType: 'City', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { destId: 'mock-paris', searchType: 'mock', name: 'Paris', label: 'Paris, France', placeType: 'City', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { destId: 'mock-dubai', searchType: 'mock', name: 'Dubai', label: 'Dubai, United Arab Emirates', placeType: 'City', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
  { destId: 'mock-newyork', searchType: 'mock', name: 'New York', label: 'New York, United States', placeType: 'City', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { destId: 'mock-tokyo', searchType: 'mock', name: 'Tokyo', label: 'Tokyo, Japan', placeType: 'City', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { destId: 'mock-rome', searchType: 'mock', name: 'Rome', label: 'Rome, Italy', placeType: 'City', country: 'Italy', latitude: 41.9028, longitude: 12.4964 },
  { destId: 'mock-bali', searchType: 'mock', name: 'Bali', label: 'Bali, Indonesia', placeType: 'Region', country: 'Indonesia', latitude: -8.3405, longitude: 115.092 },
  { destId: 'mock-singapore', searchType: 'mock', name: 'Singapore', label: 'Singapore', placeType: 'City', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { destId: 'mock-eiffeltower', searchType: 'mock', name: 'Eiffel Tower', label: 'Eiffel Tower, Paris, France', placeType: 'Landmark', country: 'France', latitude: 48.8584, longitude: 2.2945 },
  { destId: 'mock-barcelona', searchType: 'mock', name: 'Barcelona', label: 'Barcelona, Spain', placeType: 'City', country: 'Spain', latitude: 41.3874, longitude: 2.1686 },
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const inD = new Date(checkIn);
  const outD = new Date(checkOut);
  const diff = Math.round((outD.getTime() - inD.getTime()) / (24 * 60 * 60 * 1000));
  return Math.max(1, diff || 1);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Placeholder provider generating realistic-looking search results so the
 * lead-gen MVP works before/without a RAPIDAPI_KEY. Swap point is
 * `hotelProvider` below — nothing else in the app needs to change.
 */
class MockHotelProvider implements HotelProvider {
  async search(params: HotelSearchParams): Promise<Hotel[]> {
    const { location, checkIn, checkOut, adults, rooms, destLatitude, destLongitude } = params;
    const nights = nightsBetween(checkIn || defaultCheckIn(), checkOut || defaultCheckOut());
    const paxFactor = 1 + Math.max(0, adults - 2) * 0.08;

    return HOTEL_BRANDS.map((b, idx): Hotel => {
      const seed = idx + 1;
      const basePricePerNight = Math.round((90 + seededRandom(seed) * 340) * paxFactor);
      const totalPrice = basePricePerNight * nights * Math.max(1, rooms);
      const hasDiscount = seededRandom(seed * 7) > 0.45;
      const originalPricePerNight = hasDiscount ? Math.round(basePricePerNight * (1.12 + seededRandom(seed * 3) * 0.28)) : undefined;

      const amenityCount = 3 + Math.floor(seededRandom(seed * 5) * 5);
      const amenities = [...AMENITIES_POOL].sort(() => seededRandom(seed * 11) - 0.5).slice(0, amenityCount);

      const lat = destLatitude != null ? destLatitude + (seededRandom(seed * 13) - 0.5) * 0.08 : undefined;
      const lng = destLongitude != null ? destLongitude + (seededRandom(seed * 17) - 0.5) * 0.08 : undefined;

      return {
        id: `HTL-${idx}-${seed * 1013}`,
        name: b.name,
        location: location || 'London, United Kingdom',
        address: `${12 + idx * 7} ${b.name.split(' ')[0]} Street, ${location || 'London'}`,
        latitude: lat,
        longitude: lng,
        distanceFromCenterKm: lat != null && lng != null && destLatitude != null && destLongitude != null ? haversineKm(destLatitude, destLongitude, lat, lng) : undefined,
        rating: b.rating,
        reviewScoreWord: reviewWordFromScore(b.rating),
        reviewsCount: b.reviews,
        stars: b.stars,
        pricePerNight: basePricePerNight,
        originalPricePerNight,
        totalPrice,
        nights,
        currency: 'USD',
        image: b.image,
        images: [b.image, ...GALLERY_POOL.slice(0, 3)],
        amenities,
        freeCancellation: seededRandom(seed * 19) > 0.4,
        payAtProperty: seededRandom(seed * 23) > 0.5,
        checkInTime: '3:00 PM',
        checkOutTime: '11:00 AM',
        isSponsored: idx === 1,
        roomTypes: [
          { name: 'Standard Room', price: basePricePerNight, description: 'Comfortable room with modern bathroom, smart TV, and city view.', capacity: 2, bedType: 'Queen', mealPlan: 'Room Only', refundable: true },
          {
            name: 'Executive Suite',
            price: Math.round(basePricePerNight * 1.55),
            description: 'Spacious suite with a separate living area, workspace, and lounge access.',
            capacity: 3,
            bedType: 'King',
            mealPlan: 'Breakfast Included',
            refundable: true,
          },
          {
            name: 'Presidential Penthouse',
            price: Math.round(basePricePerNight * 2.9),
            description: 'Top-floor suite with panoramic windows, private balcony, and butler service.',
            capacity: 4,
            bedType: 'King',
            mealPlan: 'All Inclusive',
            refundable: false,
          },
        ],
      };
    }).sort((a, b) => a.pricePerNight - b.pricePerNight);
  }
}

function reviewWordFromScore(score: number): string {
  if (score >= 9) return 'Exceptional';
  if (score >= 8) return 'Excellent';
  if (score >= 7) return 'Very Good';
  if (score >= 6) return 'Good';
  return 'Fair';
}

function defaultCheckIn(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

function defaultCheckOut(): string {
  const d = new Date();
  d.setDate(d.getDate() + 17);
  return d.toISOString().slice(0, 10);
}

const RAPIDAPI_HOTELS_HOST = process.env.RAPIDAPI_HOTELS_HOST || 'booking-com15.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

async function rapidApiGet<T extends { status: boolean }>(path: string, params: Record<string, string>): Promise<T> {
  const url = `https://${RAPIDAPI_HOTELS_HOST}${path}?${new URLSearchParams(params)}`;
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(url, {
        headers: { 'x-rapidapi-host': RAPIDAPI_HOTELS_HOST, 'x-rapidapi-key': RAPIDAPI_KEY! },
        signal: controller.signal,
      });
      if (res.status === 429) throw new Error('Booking.com15 rate limit hit');
      if (!res.ok) throw new Error(`Booking.com15 HTTP ${res.status}`);
      const json = (await res.json()) as T;
      if (!json.status) throw new Error('Booking.com15 returned status:false');
      return json;
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Booking.com15 request failed');
}

interface RawDestination {
  dest_id: string;
  search_type: string;
  name?: string;
  label?: string;
  city_name?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface DestinationSearchResponse {
  status: boolean;
  data?: RawDestination[];
}

const PLACE_TYPE_LABELS: Record<string, string> = {
  city: 'City',
  district: 'District',
  region: 'Region',
  landmark: 'Landmark',
  hotel: 'Hotel',
  airport: 'Airport',
  country: 'Country',
};

/** Destination-only cache to avoid burning quota on repeat keystrokes for the same query. */
const destinationCache = new Map<string, { destinations: HotelDestination[]; expires: number }>();
const searchCache = new Map<string, { hotels: Hotel[]; expires: number }>();

export async function searchHotelDestinations(query: string): Promise<HotelDestination[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  if (!RAPIDAPI_KEY) {
    const lower = trimmed.toLowerCase();
    return POPULAR_DESTINATIONS.filter((d) => d.name.toLowerCase().includes(lower) || d.label.toLowerCase().includes(lower)).slice(0, 8);
  }

  const cacheKey = trimmed.toLowerCase();
  const cached = destinationCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.destinations;

  const json = await rapidApiGet<DestinationSearchResponse>('/api/v1/hotels/searchDestination', { query: trimmed });
  const destinations: HotelDestination[] = (json.data ?? [])
    .filter((d) => d.dest_id && d.search_type)
    .map((d) => {
      const name = d.name || d.city_name || trimmed;
      const label = d.label || [name, d.region, d.country].filter(Boolean).join(', ');
      return {
        destId: d.dest_id,
        searchType: d.search_type,
        name,
        label,
        placeType: PLACE_TYPE_LABELS[d.search_type?.toLowerCase()] || 'Place',
        country: d.country,
        latitude: d.latitude,
        longitude: d.longitude,
      };
    })
    .slice(0, 8);

  destinationCache.set(cacheKey, { destinations, expires: Date.now() + 10 * 60 * 1000 });
  return destinations;
}

const TRENDING_QUERIES = ['London', 'Paris', 'Dubai', 'New York', 'Tokyo', 'Rome', 'Bali', 'Singapore', 'Barcelona', 'Bangkok'];
let trendingCache: { destinations: HotelDestination[]; expires: number } | null = null;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Resolves a curated shortlist of popular city names through whichever destination source is active, so "Trending"
 * always yields real, searchable dest IDs. Resolved sequentially with a short gap between requests — firing all ten
 * concurrently trips RapidAPI's burst rate limit on lower-tier plans and silently drops most of the results.
 */
export async function popularHotelDestinations(): Promise<HotelDestination[]> {
  if (!RAPIDAPI_KEY) return POPULAR_DESTINATIONS;
  if (trendingCache && trendingCache.expires > Date.now()) return trendingCache.destinations;

  const destinations: HotelDestination[] = [];
  for (const q of TRENDING_QUERIES) {
    try {
      const matches = await searchHotelDestinations(q);
      const best = matches.find((m) => m.searchType.toLowerCase() === 'city') ?? matches[0];
      if (best) destinations.push(best);
    } catch {
      // one destination failing to resolve shouldn't blank out the whole trending list
    }
    await sleep(150);
  }

  if (destinations.length > 0) trendingCache = { destinations, expires: Date.now() + 60 * 60 * 1000 };
  return destinations.length > 0 ? destinations : POPULAR_DESTINATIONS;
}

interface RawPriceAmount {
  value: number;
  currency: string;
}

interface RawHotelProperty {
  name: string;
  wishlistName?: string;
  reviewScore?: number;
  reviewScoreWord?: string;
  reviewCount?: number;
  propertyClass?: number;
  latitude?: number;
  longitude?: number;
  photoUrls?: string[];
  checkin?: { fromTime?: string; untilTime?: string };
  checkout?: { fromTime?: string; untilTime?: string };
  priceBreakdown?: {
    grossPrice?: RawPriceAmount;
    strikethroughPrice?: RawPriceAmount;
  };
}

interface RawHotelEntry {
  hotel_id: number;
  property?: RawHotelProperty;
}

interface HotelSearchResponse {
  status: boolean;
  data?: { hotels?: RawHotelEntry[] };
}

/**
 * Real-time hotel search backed by RapidAPI's "Booking.com15" wrapper. Only
 * fields verified against real response samples are read from `property`
 * (name, review score/word/count, propertyClass, priceBreakdown, photoUrls,
 * coordinates, checkin/checkout times). The search endpoint does not return
 * facility/amenity or cancellation-policy data, so those stay unset here
 * rather than being guessed — see the hotels gap-analysis roadmap for what
 * unlocks them (the getHotelDetails endpoint, once its shape is verified).
 */
class BookingComHotelProvider implements HotelProvider {
  async search(params: HotelSearchParams): Promise<Hotel[]> {
    const { destId, searchType, checkIn, checkOut, adults, childAges, rooms, location, destLatitude, destLongitude } = params;
    if (!destId) throw new Error('Booking.com15 search requires a resolved destination');

    const arrival = checkIn || defaultCheckIn();
    const departure = checkOut || defaultCheckOut();
    const nights = nightsBetween(arrival, departure);
    const paxCount = Math.min(30, Math.max(1, adults || 1));
    const roomCount = Math.min(8, Math.max(1, rooms || 1));

    const cacheKey = `${destId}|${arrival}|${departure}|${paxCount}|${roomCount}|${childAges.join(',')}`;
    const cached = searchCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return cached.hotels;

    const queryParams: Record<string, string> = {
      dest_id: destId,
      search_type: searchType,
      arrival_date: arrival,
      departure_date: departure,
      adults: String(paxCount),
      room_qty: String(roomCount),
      currency_code: 'USD',
      languagecode: 'en-us',
    };
    // Best-effort child-age passthrough — the API's exact param name for children isn't verified from public docs,
    // so this is included defensively (harmless if ignored) rather than dropped silently.
    if (childAges.length > 0) queryParams.children_age = childAges.join(',');

    const json = await rapidApiGet<HotelSearchResponse>('/api/v1/hotels/searchHotels', queryParams);
    const entries = json.data?.hotels ?? [];

    const hotels: Hotel[] = entries
      .filter((e) => e.property?.name)
      .map((e): Hotel => {
        const p = e.property!;
        const gross = p.priceBreakdown?.grossPrice;
        const strike = p.priceBreakdown?.strikethroughPrice;
        const totalPrice = Math.round(gross?.value ?? 0);
        const pricePerNight = Math.max(1, Math.round(totalPrice / nights));
        const originalTotal = strike?.value && strike.value > (gross?.value ?? 0) ? strike.value : undefined;
        const originalPricePerNight = originalTotal ? Math.round(originalTotal / nights) : undefined;

        const distanceFromCenterKm =
          p.latitude != null && p.longitude != null && destLatitude != null && destLongitude != null
            ? haversineKm(destLatitude, destLongitude, p.latitude, p.longitude)
            : undefined;

        const images = (p.photoUrls ?? []).filter(Boolean).slice(0, 8);

        return {
          id: String(e.hotel_id),
          name: p.name,
          location: p.wishlistName || location,
          latitude: p.latitude,
          longitude: p.longitude,
          distanceFromCenterKm,
          rating: p.reviewScore ?? 0,
          reviewScoreWord: p.reviewScoreWord || (p.reviewScore ? reviewWordFromScore(p.reviewScore) : undefined),
          reviewsCount: p.reviewCount ?? 0,
          stars: Math.max(0, Math.min(5, p.propertyClass ?? 0)),
          pricePerNight,
          originalPricePerNight,
          totalPrice,
          nights,
          currency: gross?.currency || 'USD',
          image: images[0] || GALLERY_POOL[0],
          images: images.length > 0 ? images : [GALLERY_POOL[0]],
          amenities: [],
          checkInTime: p.checkin?.fromTime,
          checkOutTime: p.checkout?.untilTime,
          roomTypes: [
            {
              name: 'Available Rate',
              price: pricePerNight,
              description: `Live rate returned by Booking.com for ${nights} night${nights > 1 ? 's' : ''}, ${paxCount} guest${paxCount > 1 ? 's' : ''}, ${roomCount} room${roomCount > 1 ? 's' : ''}.`,
              capacity: Math.ceil(paxCount / roomCount),
              bedType: 'Queen',
              mealPlan: 'Room Only',
              refundable: false,
            },
          ],
        };
      })
      .filter((h) => h.totalPrice > 0)
      .sort((a, b) => a.pricePerNight - b.pricePerNight)
      .slice(0, 30);

    if (hotels.length === 0) throw new Error('Booking.com15 returned zero hotels for this destination/date range');

    searchCache.set(cacheKey, { hotels, expires: Date.now() + 5 * 60 * 1000 });
    return hotels;
  }
}

/**
 * Swap point for the hotel data source: real Booking.com15 search when
 * RAPIDAPI_KEY is configured, otherwise the deterministic mock so local dev
 * (and destinations without a key) still works.
 */
export const hotelProvider: HotelProvider = RAPIDAPI_KEY ? new BookingComHotelProvider() : new MockHotelProvider();

export async function searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
  return hotelProvider.search(params);
}
                                                                                                      