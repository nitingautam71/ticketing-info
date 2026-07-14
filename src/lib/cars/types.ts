// Types for the Car Rentals vertical. Mirrors the cruises vertical's architecture:
// curated entity data (companies/vehicles/locations) -> deterministic generator ->
// generated catalog JSON + lightweight index -> live pricing engine (never baked into
// files). Stable IDs and normalized relationships so live inventory APIs (CarTrawler,
// Amadeus Cars, Booking.com Mobility, etc.) can replace the generated catalog later
// without schema redesign.

export type VehicleCategory =
  | 'Economy'
  | 'Compact'
  | 'Midsize'
  | 'Full Size'
  | 'Premium'
  | 'Luxury'
  | 'Executive'
  | 'Compact SUV'
  | 'Midsize SUV'
  | 'Full Size SUV'
  | 'Luxury SUV'
  | 'Convertible'
  | 'Sports Car'
  | 'Electric Vehicle'
  | 'Hybrid'
  | 'Pickup Truck'
  | 'Minivan'
  | 'Passenger Van'
  | 'Cargo Van'
  | 'Limousine'
  | 'Motorhome / RV';

export type Transmission = 'Automatic' | 'Manual';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | 'Plug-in Hybrid';
export type DriveType = 'FWD' | 'RWD' | 'AWD' | '4WD';
export type CompanyTier = 'budget' | 'midRange' | 'premium';
export type VehicleRegion = 'global' | 'north-america' | 'europe' | 'asia' | 'middle-east' | 'oceania' | 'south-america' | 'africa';

export type LocationType = 'airport' | 'downtown' | 'cruise-port' | 'rail-station' | 'city-office';

export type RentalDurationTier = 'hourly' | 'halfDay' | 'daily' | 'weekend' | 'weekly' | 'monthly' | 'longTerm';

export interface CarReview {
  id: string;
  author: string;
  country: string;
  date: string;
  title: string;
  body: string;
  ratings: {
    overall: number;
    vehicleCondition: number;
    pickupExperience: number;
    dropoffExperience: number;
    customerService: number;
    cleanliness: number;
    value: number;
    insuranceExperience: number;
    vehicleQuality: number;
  };
  verifiedBooking: boolean;
}

export interface RentalCompany {
  id: string;
  name: string;
  slug: string;
  tier: CompanyTier;
  commissionRate: number;
  hqCountry: string;
  logoUrl?: string;
  description: string;
  keySellingPoints: string[];
  /** Company-wide guest reviews (20 per company, per spec) — listings carry aggregate ratings only. */
  reviews: CarReview[];
}

export interface VehicleModel {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  transmission: Transmission;
  fuelType: FuelType;
  engine: string;
  horsepower: number;
  driveType: DriveType;
  doors: number;
  seats: number;
  /** Large + small bags. */
  luggageCapacity: { large: number; small: number };
  /** L/100km for combustion, kWh/100km for EVs. */
  fuelEconomy: string;
  /** Litres for combustion, kWh battery for EVs. */
  fuelTankCapacity: string;
  /** Estimated range on a full tank/charge, km. */
  rangeKm: number;
  features: {
    gps: boolean;
    bluetooth: boolean;
    appleCarPlay: boolean;
    androidAuto: boolean;
    wifi: boolean;
    usbPorts: number;
    heatedSeats: boolean;
    sunroof: boolean;
    airConditioning: boolean;
    childSeatAvailable: boolean;
    wheelchairAccessible: boolean;
    petFriendly: boolean;
    smokingAllowed: boolean;
  };
  /** Regions where this model realistically appears in rental fleets. */
  regionTags: VehicleRegion[];
  /** Which company tiers realistically stock this model (luxury exotics: premium only). */
  companyTiers: CompanyTier[];
  /** Relative daily-rate multiplier vs. a 1.0 economy baseline — drives the pricing engine. */
  priceIndex: number;
}

export interface RentalLocation {
  id: string;
  name: string;
  slug: string;
  type: LocationType;
  city: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  region: VehicleRegion;
  lat: number;
  lon: number;
  currency: string; // ISO 4217 of the location itself
  airportCode?: string; // IATA when type === 'airport'
  /** Cost-of-rental multiplier vs. a 1.0 baseline (Zurich high, Delhi low). */
  costIndex: number;
  /** Whether one-way rentals (different drop-off) are commonly supported here. */
  oneWaySupported: boolean;
  /** Whether cross-border drop-off is possible from this location. */
  crossBorderAllowed: boolean;
}

export interface CarRentalPolicies {
  minimumAge: number;
  maximumAge: number | null;
  youngDriverSurchargeUnderAge: number;
  licenseRequirements: string;
  internationalDrivingPermitRequired: boolean;
  depositUSD: number;
  acceptedCards: string[];
  fuelPolicy: 'Full to Full' | 'Full to Empty' | 'Same to Same';
  mileagePolicy: string;
  unlimitedMileage: boolean;
  lateReturnPolicy: string;
  cancellationPolicy: string;
  freeCancellation: boolean;
  noShowPolicy: string;
  borderCrossingRules: string;
  additionalDriverRules: string;
  smokingPolicy: string;
  petPolicy: string;
  evChargingPolicy?: string;
  tollPolicy: string;
  drivingSide: 'left' | 'right';
}

export interface InsuranceOption {
  id: string;
  name: string;
  type:
    | 'Basic Insurance'
    | 'Premium Insurance'
    | 'Zero Excess'
    | 'Theft Protection'
    | 'Third Party Liability'
    | 'Personal Accident Insurance'
    | 'Glass Protection'
    | 'Tyre Protection'
    | 'Roadside Assistance';
  pricePerDayUSD: number;
  excessUSD: number;
  included: boolean;
  description: string;
}

export interface CarImageAsset {
  role: 'hero' | 'exterior' | 'interior' | 'dashboard' | 'luggage' | 'seats' | '360';
  altText: string;
  keywords: string[];
  unsplashQuery: string;
  pexelsQuery: string;
}

export interface CarSEO {
  title: string;
  slug: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  openGraph: { title: string; description: string; image: string; type: string };
  twitterCard: { card: string; title: string; description: string; image: string };
  /** Schema.org Product + Vehicle + Offer + AggregateRating JSON-LD. */
  jsonLd: Record<string, unknown>;
}

export interface CarSearchFilters {
  company: string;
  location: string;
  country: string;
  airportPickup: boolean;
  hotelDelivery: boolean;
  cruisePortPickup: boolean;
  railStationPickup: boolean;
  brand: string;
  category: VehicleCategory;
  transmission: Transmission;
  fuelType: FuelType;
  ev: boolean;
  hybrid: boolean;
  luxury: boolean;
  budget: boolean;
  seats: number;
  doors: number;
  unlimitedMileage: boolean;
  instantConfirmation: boolean;
  freeCancellation: boolean;
  noDepositOption: boolean;
  petFriendly: boolean;
  wheelchairAccessible: boolean;
  snowEquipmentAvailable: boolean;
  convertible: boolean;
  sportsCar: boolean;
  oneWayAvailable: boolean;
  businessTravel: boolean;
  familyTravel: boolean;
  adventureTravel: boolean;
}

export interface CarPricingLineItems {
  basePriceUSD: number;
  taxesUSD: number;
  airportFeeUSD: number;
  oneWayFeeUSD: number;
  youngDriverFeePerDayUSD: number;
  seniorFeePerDayUSD: number;
  additionalDriverPerDayUSD: number;
  basicInsuranceUSD: number;
  collisionDamageWaiverUSD: number;
  roadsideAssistanceUSD: number;
  gpsAddonUSD: number;
  wifiAddonUSD: number;
  childSeatAddonUSD: number;
  snowChainsAddonUSD: number;
  fuelPackageUSD: number;
  cleaningFeeUSD: number;
  otaServiceFeeUSD: number;
  commissionUSD: number;
  markupUSD: number;
}

export interface CarPricingBreakdown {
  originMarket: string; // OriginMarket.code, e.g. 'US'
  durationTier: RentalDurationTier;
  /** Billable units for the tier (hours for hourly, days otherwise). */
  units: number;
  currency: string;
  usdRate: number;
  seasonMultiplier: number;
  lineItems: CarPricingLineItems;
  suggestedRetailPriceUSD: number;
  discountedPriceUSD: number;
  savingsUSD: number;
  profitMarginPercent: number;
  suggestedRetailPriceLocal: number;
  discountedPriceLocal: number;
  savingsLocal: number;
  isEstimate: boolean;
}

export interface CarListing {
  id: string; // CAR-{COMPANY}-{LOCATION}-{VEHICLE}
  slug: string;
  title: string;
  companyId: string;
  companyName: string;
  companyTier: CompanyTier;
  vehicleId: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  specs: VehicleModel;
  /** Sample identifiers, clearly synthetic. */
  sampleVin: string;
  sampleLicensePlate: string;
  color: string;
  mileageKm: number;
  locationId: string;
  locationName: string;
  locationType: LocationType;
  city: string;
  country: string;
  countryCode: string;
  pickupOptions: string[];
  dropoffOptions: string[];
  policies: CarRentalPolicies;
  insuranceOptions: InsuranceOption[];
  images: CarImageAsset[];
  aiSearchTags: string[];
  filters: CarSearchFilters;
  ratings: {
    overall: number;
    vehicleCondition: number;
    pickupExperience: number;
    dropoffExperience: number;
    customerService: number;
    cleanliness: number;
    value: number;
    insuranceExperience: number;
    vehicleQuality: number;
    reviewCount: number;
  };
  seo: CarSEO;
  /** Teaser: daily rate, US market, discounted. Full pricing computes live via computeCarPricing(). */
  fromPricePerDayUSD: number;
}

/** Lightweight shape for listings-index.json — powers search/filter/list pages. */
export interface CarSearchResult {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companyTier: CompanyTier;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  doors: number;
  luggage: number;
  locationName: string;
  locationType: LocationType;
  city: string;
  country: string;
  countryCode: string;
  fromPricePerDayUSD: number;
  ratingOverall: number;
  reviewCount: number;
  heroImage: CarImageAsset;
  aiSearchTags: string[];
  filters: Partial<CarSearchFilters>;
}
