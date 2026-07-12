// Core data model for the travel packages engine.
//
// Design: destination *facts* (mostly static, curated once per place) are kept
// separate from generated *packages* (destination x duration, composed by
// src/lib/packages/generator.ts). Pricing is NOT pre-computed into the package
// record — src/lib/packages/pricing.ts computes it on demand for any
// (origin market, traveler type, tier) combination, the same way a real OTA
// would call a live fare/rate API. This keeps generated JSON a manageable
// size and matches the "future integration with live flight/hotel APIs" goal:
// swap computePricing()'s airfare formula for a real GDS/NDC call and nothing
// else in the app needs to change.

export type Category =
  | 'Beach'
  | 'Luxury'
  | 'Adventure'
  | 'Honeymoon'
  | 'Family'
  | 'Nature'
  | 'Wildlife'
  | 'Road Trip'
  | 'City Break'
  | 'Culture'
  | 'History'
  | 'Food'
  | 'Shopping'
  | 'Nightlife'
  | 'Romantic'
  | 'Winter'
  | 'Summer'
  | 'Spring'
  | 'Autumn'
  | 'Weekend Getaway'
  | 'Bucket List';

export const ALL_CATEGORIES: Category[] = [
  'Beach', 'Luxury', 'Adventure', 'Honeymoon', 'Family', 'Nature', 'Wildlife', 'Road Trip',
  'City Break', 'Culture', 'History', 'Food', 'Shopping', 'Nightlife', 'Romantic', 'Winter',
  'Summer', 'Spring', 'Autumn', 'Weekend Getaway', 'Bucket List',
];

export type CrowdLevel = 'Low' | 'Medium' | 'High' | 'Peak';
export type PriceBand = '$' | '$$' | '$$$' | '$$$$';

export interface DestinationFacts {
  slug: string;
  name: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  region: string; // e.g. "Western Europe", "Southeast Asia"
  continent: string;
  lat: number;
  lon: number;
  airportCode: string; // IATA
  airportName: string;
  currency: string; // ISO 4217 of the destination itself
  languages: string[];
  timeZone: string; // e.g. "CET (UTC+1)"
  utcOffset: number; // signed hours, standard time (DST not modeled — estimate)
  visaSummary: string;
  bestTimeToVisit: string;
  weatherSummary: string;
  safetyRating: number; // 1-5
  internetRating: number; // 1-5
  transportRating: number; // 1-5
  walkingScore: number; // 0-100
  accessibilityRating: number; // 1-5
  /** Per-person, per-day land cost estimate in USD: [budget, midRange, premium, luxury]. Drives hotel+food+local transport+tours in the pricing engine. */
  dailyBudgetUSD: [number, number, number, number];
  /** Multiplier applied to base hotel/tour costs relative to a mid-cost baseline destination (~1.0). */
  costIndex: number;
  emergency: { police: string; ambulance: string; fire: string };
  etiquette: string[];
  festivals: { name: string; timing: string }[];
  /** Average daily high, °C, Jan..Dec. */
  weatherByMonth: number[];
  /** Jan..Dec. */
  crowdByMonth: CrowdLevel[];
  attractionsPaid: { name: string; note: string; priceUSD: number }[];
  attractionsFree: { name: string; note: string }[];
  restaurants: { name: string; cuisine: string; price: PriceBand }[];
  cafes: string[];
  shopping: string[];
  nightlife: string[];
  instagramSpots: string[];
  hiddenGems: string[];
  familyActivities: string[];
  adventureActivities: string[];
  luxuryExperiences: string[];
  honeymoonExperiences: string[];
  budgetExperiences: string[];
  museums: string[];
  parks: string[];
  beaches: string[];
  dayTrips: string[];
  localTransportGuide: string;
  packingNotes: string[];
  travelTips: string[];
  thingsToAvoid: string[];
  categories: Category[];
  heroKeywords: string[];
}

export type TravelerType = 'solo' | 'couple' | 'family4' | 'group8';
export type PricingTier = 'budget' | 'midRange' | 'premium' | 'luxury';

export const TRAVELER_LABELS: Record<TravelerType, string> = {
  solo: 'Solo',
  couple: 'Couple',
  family4: 'Family of 4',
  group8: 'Group (6-10)',
};

export const TIER_LABELS: Record<PricingTier, string> = {
  budget: 'Budget',
  midRange: 'Mid-range',
  premium: 'Premium',
  luxury: 'Luxury',
};

export interface OriginMarket {
  code: string; // ISO 3166-1 alpha-2 of the origin country
  name: string;
  hubCity: string;
  lat: number;
  lon: number;
  currency: string; // ISO 4217
  /** units of local currency per 1 USD, static approximate — mark as estimate in UI, replace with a live FX feed in production. */
  usdRate: number;
}

export interface PricingBreakdown {
  originMarket: string; // OriginMarket.code
  travelerType: TravelerType;
  tier: PricingTier;
  partySize: number;
  currency: string; // destination-market local currency code for display
  usdRate: number;
  distanceKm: number;
  flightHoursEstimate: number;
  costUSD: {
    airfare: number;
    hotel: number;
    transfers: number;
    breakfast: number;
    dailyTransport: number;
    tours: number;
    activities: number;
  };
  supplierCostUSD: number; // sum of costUSD.*
  taxesAndFeesUSD: number;
  otaServiceFeeUSD: number;
  suggestedRetailPriceUSD: number;
  discountPct: number;
  discountedPriceUSD: number;
  savingsUSD: number;
  commissionUSD: number; // OTA/agent commission earned on the discounted price
  markupPct: number; // (retail - supplierCost) / supplierCost
  profitMarginPct: number; // (discountedPrice - supplierCost - commission) / discountedPrice
  suggestedRetailPriceLocal: number;
  discountedPriceLocal: number;
  savingsLocal: number;
  isEstimate: true;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  activities: string[];
  overnight: string;
}

export interface ImageAsset {
  role: 'hero' | 'thumbnail' | 'gallery' | 'landscape' | 'portrait';
  altText: string;
  keywords: string[];
  unsplashQuery: string;
  pexelsQuery: string;
  width: number;
  height: number;
}

export interface PackageReview {
  id: string;
  author: string;
  country: string;
  rating: number;
  foodRating: number;
  hotelRating: number;
  transportRating: number;
  activitiesRating: number;
  valueRating: number;
  cleanlinessRating: number;
  safetyRating: number;
  date: string; // ISO date
  title: string;
  body: string;
  travelerType: TravelerType;
  verifiedBooking: boolean;
}

export interface PackageFAQ {
  question: string;
  answer: string;
}

export interface SuggestedHotel {
  tier: 'Budget Hotel' | 'Mid-range Hotel' | 'Luxury Hotel' | 'Resort' | 'Villa' | 'Apartment' | 'Hostel';
  name: string;
  starRating: number;
  pricePerNightUSD: number;
  neighborhood: string;
}

export interface SuggestedFlightRoute {
  originMarket: string;
  originAirport: string;
  destinationAirport: string;
  airlines: string[];
  estimatedRoundTripUSD: [number, number]; // [low, high], economy
  estimatedFlightHours: number;
  isEstimate: true;
}

export interface TravelPackage {
  id: string;
  slug: string;
  destinationSlug: string;
  destinationName: string;
  country: string;
  region: string;
  durationDays: number;
  durationNights: number;
  title: string;
  metaTitle: string;
  metaDescription: string;
  highlights: string[];
  overview: string;
  included: string[];
  notIncluded: string[];
  itinerary: ItineraryDay[];
  travelTips: string[];
  packingList: string[];
  thingsToDo: string[];
  thingsToAvoid: string[];
  topRestaurants: string[];
  topCafes: string[];
  shoppingAreas: string[];
  nightlife: string[];
  instagramSpots: string[];
  hiddenGems: string[];
  familyActivities: string[];
  adventureActivities: string[];
  luxuryExperiences: string[];
  honeymoonExperiences: string[];
  budgetExperiences: string[];
  estimatedDailyBudgetUSD: [number, number, number, number];
  safetyRating: number;
  internetRating: number;
  publicTransportRating: number;
  walkingScore: number;
  accessibilityRating: number;
  weatherByMonth: { month: string; highC: number; crowd: CrowdLevel }[];
  festivalCalendar: { name: string; timing: string }[];
  emergencyContacts: { police: string; ambulance: string; fire: string };
  localEtiquette: string[];
  localTransportGuide: string;
  bestTimeToVisit: string;
  weather: string;
  visaInformation: string;
  currency: string;
  languages: string[];
  timeZone: string;
  averageFlightTime: string;
  nearestAirport: string;
  cancellationPolicy: string;
  termsAndConditions: string[];
  faqs: PackageFAQ[];
  categories: Category[];
  aiTags: string[];
  images: ImageAsset[];
  reviews: PackageReview[];
  ratings: {
    overall: number;
    food: number;
    hotel: number;
    transportation: number;
    activities: number;
    value: number;
    cleanliness: number;
    safety: number;
    reviewCount: number;
  };
  suggestedHotels: SuggestedHotel[];
  suggestedFlights: SuggestedFlightRoute[];
  attractionsTop50: string[];
  attractionsPaidTop20: { name: string; priceUSD: number }[];
  attractionsFreeTop20: string[];
  museums: string[];
  parks: string[];
  beaches: string[];
  dayTrips: string[];
  fromPriceUSD: number; // teaser price: solo, budget tier, US origin market
  seo: {
    title: string;
    slug: string;
    keywords: string[];
    canonicalUrl: string;
    /** Same-site links for on-page SEO internal linking: other durations of this destination + related packages sharing categories. Filled in by scripts/generate-packages.ts once all 300 packages exist (a single package doesn't know its siblings). */
    internalLinks: { title: string; url: string }[];
    /** High-confidence external reference links (Wikipedia + Wikivoyage) built from the destination name — not individually fetched/verified beyond the naming-convention spot checks done for known ambiguous cases (e.g. Banff). */
    externalLinks: { title: string; url: string }[];
  };
}
