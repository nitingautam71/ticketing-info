// Types for the Cruise packages vertical

import type { Category, OriginMarket } from '../packages/types';

export type CruiseCategory =
  | 'Ocean Cruises'
  | 'River Cruises'
  | 'Expedition Cruises'
  | 'Luxury Cruises'
  | 'Family Cruises'
  | 'Adults-Only Cruises'
  | 'Small Ship Cruises'
  | 'World Cruises'
  | 'Repositioning Cruises'
  | 'Seasonal Cruises';

export type CabinType =
  | 'Interior Cabin'
  | 'Ocean View'
  | 'Balcony Cabin'
  | 'Junior Suite'
  | 'Suite'
  | 'Luxury Suite'
  | 'Owner\'s Suite'
  | 'Family Cabin'
  | 'Accessible Cabin'
  | 'Solo Cabin';

export type CruiseTravelerType =
  | 'solo'
  | 'couple'
  | 'family4'
  | 'largeFamily'
  | 'group'
  | 'senior'
  | 'honeymoon'
  | 'luxuryTraveler';

export type CruisePricingTier = 'budget' | 'midRange' | 'premium' | 'luxury';

export interface CruiseLine {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  category: CruiseCategory[];
  riverCruise: boolean;
  expeditionCruise: boolean;
  adultsOnly: boolean;
  luxuryLevel: CruisePricingTier;
  commissionRate: number;
  hqCountry: string;
  description: string;
  keySellingPoints: string[];
}

export interface ShipSpecs {
  name: string;
  shipClass?: string;
  launchYear: number;
  lastRenovation?: number;
  passengerCapacity: number;
  crewSize: number;
  tonnage: number; // gross tonnage
  lengthMeters: number;
  decks: number;
  totalCabins: number;
  maxOccupancy: number;
  averageAge: number;
  rating: number; // 1-5 stars rating
}

export interface Ship {
  id: string;
  cruiseLineId: string;
  cruiseLineName: string;
  specs: ShipSpecs;
  description: string;
  features: string[];
}

export interface CruisePort {
  id: string; // Port code/slug e.g., 'miami'
  name: string;
  code: string; // e.g., MIA or port LOCODE
  city: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  region: string; // e.g., 'Caribbean', 'Mediterranean'
  lat: number;
  lon: number;
  overview: string;
  history?: string;
  thingsToDo: string[];
  topAttractions: string[];
  restaurants: string[];
  shopping: string[];
  beaches: string[];
  museums: string[];
  walkingTours: string[];
  transportation: string;
  estimatedBudgetUSD: number;
  accessibility: string;
  safety: string;
  currency: string;
  languages: string[];
  timeZone: string;
  visaSummary: string;
}

export interface DayItinerary {
  day: number;
  portId?: string;
  portName: string;
  arrivalTime: string; // e.g., '08:00 AM' or 'At Sea'
  departureTime: string; // e.g., '05:00 PM' or 'At Sea'
  distanceKm: number; // distance from previous day's port
  activities: string[];
  suggestedExcursions: string[];
  diningRecommendations: string[];
  eveningEntertainment: string[];
}

export interface ShoreExcursion {
  id: string;
  name: string;
  type:
    | 'Free Activities'
    | 'Paid Excursions'
    | 'Adventure Tours'
    | 'Luxury Experiences'
    | 'Family Activities'
    | 'Nature Tours'
    | 'Water Sports'
    | 'Cultural Tours'
    | 'Food Tours'
    | 'Private Tours';
  duration: 'Half-Day Tours' | 'Full-Day Tours';
  priceUSD: number; // 0 for free
  description: string;
}

export interface OnboardExperience {
  restaurants: string[];
  specialtyDining: string[];
  bars: string[];
  lounges: string[];
  pools: number;
  waterParks: boolean;
  casino: boolean;
  spa: boolean;
  fitnessCenter: boolean;
  kidsClub: boolean;
  teenClub: boolean;
  theater: boolean;
  broadwayShows: string[];
  comedy: boolean;
  nightclubs: boolean;
  shopping: string[];
  artGallery: boolean;
  sportsFeatures: string[]; // e.g. ["Rock Climbing", "Zip Line", "Surf Simulator", "Ice Skating", "Mini Golf", "Escape Room", "Virtual Reality"]
  movieTheater: boolean;
  library: boolean;
  businessCenter: boolean;
  medicalCenter: boolean;
  weddingChapel: boolean;
}

export interface CruiseDining {
  complimentary: string[];
  buffets: string[];
  specialty: string[];
  chefsTable: boolean;
  roomService: string;
  dietaryOptions: {
    vegetarian: boolean;
    vegan: boolean;
    halal: boolean;
    kosher: boolean;
    glutenFree: boolean;
  };
  kidsMenu: boolean;
}

export interface CruiseImageAsset {
  role: 'hero' | 'ship' | 'cabin' | 'restaurant' | 'pool' | 'entertainment' | 'port' | 'excursion' | 'deckPlan';
  altText: string;
  keywords: string[];
  unsplashQuery: string;
  pexelsQuery: string;
}

export interface CruiseReview {
  id: string;
  author: string;
  country: string;
  date: string;
  title: string;
  body: string;
  ratings: {
    overall: number;
    cabin: number;
    dining: number;
    entertainment: number;
    service: number;
    excursion: number;
    cleanliness: number;
    value: number;
    internet: number;
    family: number;
    luxury: number;
  };
  travelerType: CruiseTravelerType;
  verifiedBooking: boolean;
}

export interface CruiseSEO {
  title: string;
  slug: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: string;
  };
  twitterCard: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  jsonLd: any; // Schema.org JSON-LD script content
}

export interface CruiseSearchFilters {
  cruiseLine: string[];
  ship: string[];
  shipClass: string[];
  destination: string[];
  departurePort: string[];
  arrivalPort: string[];
  cabinType: string[];
  duration: string[];
  budget: string[];
  luxury: boolean;
  family: boolean;
  adultsOnly: boolean;
  accessible: boolean;
  petFriendly: boolean;
  riverCruise: boolean;
  oceanCruise: boolean;
  expedition: boolean;
  season: string[];
  month: string[];
  schoolHolidays: boolean;
  christmas: boolean;
  newYear: boolean;
  summer: boolean;
  winter: boolean;
  spring: boolean;
  autumn: boolean;
  visaRequired: boolean;
  noVisa: boolean;
  wheelchairAccessible: boolean;
  internetIncluded: boolean;
  drinksIncluded: boolean;
  flightsIncluded: boolean;
  transfersIncluded: boolean;
}

export interface CabinPricing {
  cabinType: CabinType;
  baseFareUSD: number; // cruise fare per traveler
  portTaxesUSD: number;
  govTaxesUSD: number;
  gratuitiesUSD: number;
  portFeesUSD: number;
  travelInsuranceEstimateUSD: number;
  hotelBeforeCruiseUSD: number; // optional, pre-cruise hotel
  transfersUSD: number; // optional, transfer
  excursionsCostEstimateUSD: number; // optional, excursion costs
  drinkPackageUSD: number; // optional
  wifiPackageUSD: number; // optional
  diningPackageUSD: number; // optional
  otaServiceFeeUSD: number;
  commissionUSD: number;
  markupUSD: number;
  suggestedRetailPriceUSD: number;
  discountedPriceUSD: number;
  savingsUSD: number;
  profitMarginPercent: number;

  // Origin market converted price breakdowns
  suggestedRetailPriceLocal: number;
  discountedPriceLocal: number;
  savingsLocal: number;
}

export interface CruisePricingBreakdown {
  originMarket: string; // OriginMarket.code e.g. 'US'
  travelerType: CruiseTravelerType;
  tier: CruisePricingTier; // budget, midRange, premium, luxury
  partySize: number;
  currency: string; // Displays regional currency code
  usdRate: number;
  flightCostUSD: number; // Airfare to embarkation port if applicable
  flightHoursEstimate: number;
  cabinPricing: Record<CabinType, CabinPricing>; // pricing for each cabin type
  isEstimate: boolean;
}

export interface CruisePackage {
  id: string; // PKG-CRUISE-{SLUG}
  slug: string;
  title: string;
  cruiseName: string;
  cruiseLineId: string;
  cruiseLineName: string;
  shipId: string;
  shipName: string;
  shipSpecs: ShipSpecs;
  categories: CruiseCategory[];
  destination: string; // region name, e.g. 'Caribbean'
  departurePortId: string;
  departurePortName: string;
  arrivalPortId: string;
  arrivalPortName: string;
  durationNights: number;
  embarkationTime: string;
  disembarkationTime: string;
  seaDays: number;
  portDays: number;
  dailyItinerary: DayItinerary[];
  shoreExcursions: ShoreExcursion[];
  onboardExperience: OnboardExperience;
  dining: CruiseDining;
  images: CruiseImageAsset[];
  reviews: CruiseReview[];
  seo: CruiseSEO;
  aiSearchTags: string[];
  filters: CruiseSearchFilters;
  ratings: {
    overall: number;
    cabin: number;
    dining: number;
    entertainment: number;
    service: number;
    excursion: number;
    cleanliness: number;
    value: number;
    internet: number;
    family: number;
    luxury: number;
    reviewCount: number;
  };
  fromPriceUSD: number; // absolute starting price (interior cabin, US market, solo traveler)
  // Full pricing (any market/traveler/tier combo) is computed live via computeCruisePricing()
  // / the /api/cruises/pricing route rather than baked into this record, so it stays accurate
  // as rates change and doesn't bloat every generated package file.
}

export interface CruiseSearchResult {
  id: string;
  slug: string;
  title: string;
  cruiseLineName: string;
  shipName: string;
  destination: string;
  departurePortName: string;
  arrivalPortName: string;
  durationNights: number;
  categories: CruiseCategory[];
  fromPriceUSD: number;
  ratingOverall: number;
  reviewCount: number;
  heroImage: CruiseImageAsset;
  aiSearchTags: string[];
  filters: Partial<CruiseSearchFilters>;
}
