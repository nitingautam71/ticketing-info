import type { RentalCompanyFacts } from './companies';
import type {
  VehicleModel,
  RentalLocation,
  CarListing,
  CarRentalPolicies,
  InsuranceOption,
  CarImageAsset,
  CarSearchFilters,
  CarReview,
  CarSEO,
} from './types';
import { computeCarPricing } from './pricing';

// Deterministic (seeded) generator — same idiom as src/lib/cruises/generator.ts.
// Re-running produces identical output unless entity data or a rule here changes.

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h || 1;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length) % arr.length];
}

const COLORS = ['White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Dark Grey', 'Pearl White'] as const;

const LEFT_DRIVE_COUNTRIES = new Set(['GB', 'IE', 'AU', 'NZ', 'IN', 'ZA', 'KE', 'MY', 'SG', 'TH', 'HK', 'JP', 'ID']);

function sampleVin(seed: number): string {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let vin = 'SAMPLE';
  for (let i = 0; i < 11; i++) vin += chars[Math.floor(seededRandom(seed + i) * chars.length) % chars.length];
  return vin;
}

function samplePlate(countryCode: string, seed: number): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const l = (i: number) => letters[Math.floor(seededRandom(seed + i) * letters.length) % letters.length];
  const d = (i: number) => Math.floor(seededRandom(seed + 10 + i) * 10);
  return `${countryCode}-${l(1)}${l(2)}${l(3)}-${d(1)}${d(2)}${d(3)}${d(4)} (sample)`;
}

function generatePolicies(company: RentalCompanyFacts, vehicle: VehicleModel, location: RentalLocation, seed: number): CarRentalPolicies {
  const isLuxury = vehicle.priceIndex >= 2.5;
  const isPremiumTier = company.tier === 'premium';
  const minimumAge = isLuxury ? 25 : company.tier === 'budget' ? 21 : 21;
  const unlimitedMileage = !isLuxury && seededRandom(seed + 3) > 0.25;

  return {
    minimumAge,
    maximumAge: seededRandom(seed + 1) > 0.7 ? 75 : null,
    youngDriverSurchargeUnderAge: 25,
    licenseRequirements: `A full, valid driving license held for at least ${isLuxury ? 3 : 1} year${isLuxury ? 's' : ''} is required at pickup.`,
    internationalDrivingPermitRequired: !['US', 'CA', 'GB', 'IE', 'AU', 'NZ'].includes(location.countryCode) && seededRandom(seed + 2) > 0.4,
    depositUSD: Math.round((isLuxury ? 1500 : isPremiumTier ? 400 : 250) * location.costIndex),
    acceptedCards: isLuxury ? ['Visa Credit', 'Mastercard Credit', 'American Express'] : ['Visa Credit', 'Mastercard Credit', 'Visa Debit (surcharge)', 'American Express'],
    fuelPolicy: seededRandom(seed + 4) > 0.2 ? 'Full to Full' : 'Same to Same',
    mileagePolicy: unlimitedMileage ? 'Unlimited mileage included.' : `${isLuxury ? 200 : 300} km/day included; ${isLuxury ? '0.85' : '0.35'} USD per additional km.`,
    unlimitedMileage,
    lateReturnPolicy: 'A 29-minute grace period applies; afterwards an extra day is charged at the daily rate.',
    cancellationPolicy: 'Free cancellation up to 48 hours before pickup. Within 48 hours, one day\'s rental is charged.',
    freeCancellation: true,
    noShowPolicy: 'No-shows are charged the full prepaid amount, or three days\' rental for pay-at-desk bookings.',
    borderCrossingRules: location.crossBorderAllowed
      ? 'Cross-border travel is permitted to neighboring countries with advance written approval and a cross-border fee.'
      : 'The vehicle may not be taken across international borders.',
    additionalDriverRules: 'Additional drivers must meet the same age/license requirements and be registered at the counter (daily fee applies).',
    smokingPolicy: 'All vehicles are strictly non-smoking; a deep-cleaning fee applies for violations.',
    petPolicy: vehicle.features.petFriendly ? 'Pets are allowed in a carrier; the vehicle must be returned clean.' : 'Pets are not permitted except certified service animals.',
    evChargingPolicy: vehicle.fuelType === 'Electric' ? 'Return with at least the pickup charge level (typically 70%+), or a recharge fee applies. Public charging costs are the renter\'s responsibility.' : undefined,
    tollPolicy: location.region === 'north-america' ? 'Electronic toll transponder available as a paid add-on; unpaid tolls incur an admin fee.' : 'Tolls are the renter\'s responsibility; some vehicles include an electronic toll tag billed after return.',
    drivingSide: LEFT_DRIVE_COUNTRIES.has(location.countryCode) ? 'left' : 'right',
  };
}

function generateInsuranceOptions(vehicle: VehicleModel, location: RentalLocation, seed: number): InsuranceOption[] {
  const isLuxury = vehicle.priceIndex >= 2.5;
  const scale = location.costIndex * (isLuxury ? 2.2 : 1);
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return [
    { id: 'basic', name: 'Basic Cover', type: 'Basic Insurance', pricePerDayUSD: 0, excessUSD: Math.round(1200 * scale), included: true, description: 'Collision damage waiver and theft protection with a standard excess — included in every rate.' },
    { id: 'premium', name: 'Premium Protection', type: 'Premium Insurance', pricePerDayUSD: r2(22 * scale), excessUSD: Math.round(250 * scale), included: false, description: 'Reduces the excess to a fraction of the standard amount and adds glass, tyre, and undercarriage cover.' },
    { id: 'zero-excess', name: 'Zero Excess Package', type: 'Zero Excess', pricePerDayUSD: r2(31 * scale), excessUSD: 0, included: false, description: 'Full peace of mind: no excess payable for damage or theft, including glass, tyres, roof, and undercarriage.' },
    { id: 'theft', name: 'Theft Protection', type: 'Theft Protection', pricePerDayUSD: 0, excessUSD: Math.round(1200 * scale), included: true, description: 'Covers theft of the vehicle (excess applies). Included in every rate.' },
    { id: 'third-party', name: 'Third Party Liability', type: 'Third Party Liability', pricePerDayUSD: 0, excessUSD: 0, included: true, description: 'Legally required third-party injury and property liability cover — always included.' },
    { id: 'pai', name: 'Personal Accident Insurance', type: 'Personal Accident Insurance', pricePerDayUSD: r2(7 * location.costIndex), excessUSD: 0, included: false, description: 'Medical and accidental-death cover for the driver and passengers.' },
    { id: 'glass-tyre', name: 'Glass & Tyre Protection', type: 'Glass Protection', pricePerDayUSD: r2(9 * location.costIndex), excessUSD: 0, included: false, description: 'Covers windscreen chips, glass breakage, and tyre damage not included in basic cover.' },
    { id: 'roadside', name: 'Roadside Assistance Plus', type: 'Roadside Assistance', pricePerDayUSD: r2(6 * location.costIndex), excessUSD: 0, included: seededRandom(seed) > 0.6, description: '24/7 breakdown response, lockout service, flat battery, and misfuelling assistance.' },
  ];
}

function generateImages(vehicle: VehicleModel, company: RentalCompanyFacts, location: RentalLocation): CarImageAsset[] {
  const name = `${vehicle.brand} ${vehicle.model}`;
  const cat = vehicle.category.toLowerCase();
  return [
    { role: 'hero', altText: `${name} rental car from ${company.name} in ${location.city}`, keywords: [name, cat, 'car rental', location.city], unsplashQuery: `${vehicle.brand} ${vehicle.model}`, pexelsQuery: `${vehicle.brand} ${vehicle.model} car` },
    { role: 'exterior', altText: `${name} exterior view`, keywords: [name, 'exterior'], unsplashQuery: `${vehicle.brand} ${vehicle.model} exterior`, pexelsQuery: `${cat} car exterior` },
    { role: 'interior', altText: `${name} interior cabin and seats`, keywords: [name, 'interior', 'cabin'], unsplashQuery: `${vehicle.brand} car interior`, pexelsQuery: 'car interior' },
    { role: 'dashboard', altText: `${name} dashboard and infotainment`, keywords: [name, 'dashboard'], unsplashQuery: 'car dashboard infotainment', pexelsQuery: 'car dashboard' },
    { role: 'luggage', altText: `${name} trunk and luggage space`, keywords: [name, 'trunk', 'luggage'], unsplashQuery: 'car trunk luggage', pexelsQuery: 'car boot space' },
    { role: 'seats', altText: `${name} seating for ${vehicle.seats}`, keywords: [name, 'seats'], unsplashQuery: 'car seats interior', pexelsQuery: 'car seats' },
  ];
}

function generateTags(vehicle: VehicleModel, company: RentalCompanyFacts, location: RentalLocation, policies: CarRentalPolicies): string[] {
  const tags = new Set<string>();
  const add = (t: string) => tags.add(t.toLowerCase());

  add(`${vehicle.brand} rental`);
  add(`${vehicle.brand} ${vehicle.model} rental`);
  add(`${vehicle.category} rental`);
  add(`rent a car ${location.city}`);
  add(`car rental ${location.city}`);
  add(`car rental ${location.country}`);
  add(`${company.name} ${location.city}`);
  add(`${location.city} ${vehicle.category}`);
  if (location.type === 'airport') { add('airport rental'); add(`${location.airportCode} car rental`); add('airport pickup'); }
  if (location.type === 'cruise-port') { add('cruise port pickup'); add('cruise terminal car rental'); }
  if (location.type === 'rail-station') { add('train station pickup'); add('railway station car rental'); }
  add(`${vehicle.transmission.toLowerCase()} transmission`);
  add(`${vehicle.fuelType.toLowerCase()} car`);
  if (vehicle.fuelType === 'Electric') { add('electric car rental'); add('ev rental'); add('zero emission rental'); if (vehicle.brand === 'Tesla') add('tesla rental'); }
  if (vehicle.fuelType === 'Hybrid' || vehicle.fuelType === 'Plug-in Hybrid') add('hybrid rental');
  if (vehicle.seats >= 7) { add(`${vehicle.seats} seater`); add('family car rental'); add('group travel'); }
  if (vehicle.category.includes('SUV')) { add('suv rental'); add('adventure travel'); add('road trip car'); }
  if (vehicle.category === 'Convertible') { add('convertible rental'); add('cabriolet hire'); add('open top driving'); }
  if (vehicle.category === 'Sports Car') { add('sports car rental'); add('supercar hire'); add('exotic car rental'); }
  if (vehicle.priceIndex >= 2.5) { add('luxury car rental'); add('premium car hire'); add('executive rental'); add('business rental'); }
  if (vehicle.priceIndex <= 1.0) { add('cheap car rental'); add('budget car hire'); add('economy rental'); }
  if (vehicle.category === 'Pickup Truck') { add('pickup truck rental'); add('ute hire'); }
  if (vehicle.category.includes('Van')) { add('van rental'); add('minivan hire'); }
  if (vehicle.category === 'Motorhome / RV') { add('rv rental'); add('campervan hire'); add('motorhome rental'); }
  if (policies.unlimitedMileage) add('unlimited mileage');
  if (policies.freeCancellation) add('free cancellation');
  if (location.oneWaySupported) add('one way rental');
  add('weekend rental');
  add('weekly car rental');
  add('monthly car rental');
  add('long term car rental');
  add('daily car hire');
  add('instant confirmation');
  add(`rent ${vehicle.brand.toLowerCase()} ${location.country.toLowerCase()}`);
  add(`${location.city.toLowerCase()} ${vehicle.transmission.toLowerCase()} car`);
  add(`${vehicle.doors} door car`);
  add(`${vehicle.seats} seat car`);
  add(`${vehicle.year} ${vehicle.brand.toLowerCase()}`);
  vehicle.features.appleCarPlay && add('apple carplay');
  vehicle.features.androidAuto && add('android auto');
  vehicle.features.gps && add('gps included');
  vehicle.features.wifi && add('wifi included');
  add(`${company.slug} car rental`);
  add(`${company.slug} ${location.slug}`);
  add(`best ${vehicle.category.toLowerCase()} deals`);
  add(`${location.city.toLowerCase()} airport transfer alternative`);
  add(`self drive ${location.city.toLowerCase()}`);
  add(`car hire near ${location.name.toLowerCase()}`);

  // Ensure the 100-tag floor with meaningful long-tail combinations rather than filler.
  const durations = ['hourly', 'daily', 'weekend', 'weekly', 'monthly'];
  for (const d of durations) add(`${d} ${vehicle.category.toLowerCase()} rental ${location.city.toLowerCase()}`);
  const audiences = ['business', 'family', 'couples', 'solo traveler', 'road trip'];
  for (const a of audiences) add(`${a} car rental ${location.city.toLowerCase()}`);
  const intents = ['deals', 'discount', 'best price', 'compare', 'book online'];
  for (const i of intents) add(`${vehicle.category.toLowerCase()} rental ${i}`);
  for (const i of intents) add(`${location.city.toLowerCase()} car rental ${i}`);
  const seasons = ['summer', 'winter', 'holiday', 'christmas', 'easter'];
  for (const s of seasons) add(`${s} car rental ${location.city.toLowerCase()}`);
  const near = ['hotel delivery', 'downtown', 'city centre', 'near me'];
  for (const n of near) add(`car rental ${n} ${location.city.toLowerCase()}`);
  const brandCombos = ['rental deals', 'hire price', 'rent near me', 'automatic rental', 'airport hire'];
  for (const b of brandCombos) add(`${vehicle.brand.toLowerCase()} ${b}`);
  const countryCombos = ['car hire', 'self drive', 'rental comparison', 'cheap rental', `${vehicle.category.toLowerCase()} hire`];
  for (const c of countryCombos) add(`${location.country.toLowerCase()} ${c}`);
  const modelCombos = ['hire', 'rental price', 'rent per day', 'daily rate', 'book now'];
  for (const m of modelCombos) add(`${vehicle.brand.toLowerCase()} ${vehicle.model.toLowerCase()} ${m}`);
  const companyCombos = ['deals', 'discount code', 'airport desk', 'reviews', 'fleet'];
  for (const c of companyCombos) add(`${company.name.toLowerCase()} ${c}`);
  add(`${vehicle.transmission.toLowerCase()} ${vehicle.category.toLowerCase()} ${location.city.toLowerCase()}`);
  add(`${vehicle.fuelType.toLowerCase()} ${vehicle.category.toLowerCase()} rental`);
  add(`${vehicle.seats} seater ${location.city.toLowerCase()}`);
  add(`${location.city.toLowerCase()} to anywhere one way`);
  add(`${vehicle.category.toLowerCase()} with driver alternative`);
  add(`${location.city.toLowerCase()} chauffeur alternative`);
  add(`no deposit car rental ${location.city.toLowerCase()}`);
  add(`last minute car rental ${location.city.toLowerCase()}`);
  add(`${vehicle.brand.toLowerCase()} vs competitors rental`);
  add(`${location.city.toLowerCase()} driving guide`);
  const universal = [
    'compare car rental prices', 'best car rental deals', 'car rental with insurance included',
    'flexible cancellation car hire', 'pay at pickup car rental', 'car rental price match',
    `full to full fuel policy ${location.city.toLowerCase()}`, `car rental under $${Math.max(30, Math.ceil((vehicle.priceIndex * 50) / 10) * 10)}`,
    `${location.region.replace('-', ' ')} car rental`, `top rated car rental ${location.country.toLowerCase()}`,
    `${vehicle.year} model rental car`, 'clean sanitized rental car', 'contactless car pickup',
    `${vehicle.brand.toLowerCase()} official rental partner`,
  ];
  for (const u of universal) add(u);

  return Array.from(tags).slice(0, 150);
}

function generateFilters(vehicle: VehicleModel, company: RentalCompanyFacts, location: RentalLocation, policies: CarRentalPolicies): CarSearchFilters {
  const isLuxury = vehicle.priceIndex >= 2.5;
  return {
    company: company.name,
    location: location.name,
    country: location.country,
    airportPickup: location.type === 'airport',
    hotelDelivery: company.tier !== 'budget' && location.type !== 'airport',
    cruisePortPickup: location.type === 'cruise-port',
    railStationPickup: location.type === 'rail-station',
    brand: vehicle.brand,
    category: vehicle.category,
    transmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    ev: vehicle.fuelType === 'Electric',
    hybrid: vehicle.fuelType === 'Hybrid' || vehicle.fuelType === 'Plug-in Hybrid',
    luxury: isLuxury,
    budget: vehicle.priceIndex <= 1.0,
    seats: vehicle.seats,
    doors: vehicle.doors,
    unlimitedMileage: policies.unlimitedMileage,
    instantConfirmation: true,
    freeCancellation: policies.freeCancellation,
    noDepositOption: false,
    petFriendly: vehicle.features.petFriendly,
    wheelchairAccessible: vehicle.features.wheelchairAccessible,
    snowEquipmentAvailable: ['europe', 'north-america'].includes(location.region),
    convertible: vehicle.category === 'Convertible',
    sportsCar: vehicle.category === 'Sports Car',
    oneWayAvailable: location.oneWaySupported,
    businessTravel: isLuxury || vehicle.category === 'Executive' || vehicle.category === 'Premium',
    familyTravel: vehicle.seats >= 5 && !isLuxury,
    adventureTravel: vehicle.category.includes('SUV') || vehicle.category === 'Pickup Truck' || vehicle.category === 'Motorhome / RV',
  };
}

const REVIEW_BODIES = [
  'Pickup was quick and the car was exactly the model booked — clean, recent, and well maintained. Would rent again without hesitation.',
  'Counter staff were friendly and the paperwork took under ten minutes. The car had barely any kilometres on it and drove beautifully.',
  'Return process was effortless — drove in, scanned, receipt by email before I reached the terminal. Very impressed with the drop-off.',
  'Good value overall, though the queue at pickup was longer than expected at peak hour. The vehicle itself was faultless.',
  'The car was spotless inside and out. Insurance options were explained clearly with zero upsell pressure, which I appreciated.',
  'Smooth experience end to end. The fuel policy was honest full-to-full and the deposit released within three days of return.',
  'Great highway cruiser with excellent fuel economy. Roadside assistance answered immediately when I had a flat tyre question.',
  'Booking modification was handled without fees when my flight changed. Customer service genuinely tried to help rather than quote policy.',
];

const REVIEW_TITLES = ['Smooth rental, would repeat', 'Great value and clean car', 'Effortless pickup and return', 'Solid experience overall', 'Exactly as booked', 'Impressed with the service'];
const REVIEW_COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'India', 'Singapore', 'France'];

/** 20 deterministic company-wide reviews, generated once per company by scripts/generate-cars.ts. */
export function generateCompanyReviews(company: RentalCompanyFacts): CarReview[] {
  const seed = hashSeed(`reviews-${company.id}`);
  const reviews: CarReview[] = [];
  const tierBase = company.tier === 'premium' ? 4.3 : company.tier === 'midRange' ? 4.1 : 3.8;
  for (let i = 1; i <= 20; i++) {
    const s = seed + i * 13;
    const overall = Math.round((tierBase + (seededRandom(s) - 0.35) * 1.1) * 10) / 10;
    const clamped = Math.max(2.5, Math.min(5, overall));
    const jitter = (o: number) => Math.max(1, Math.min(5, Math.round((clamped + (seededRandom(s + o) - 0.5) * 0.8) * 2) / 2));
    reviews.push({
      id: `REV-${company.id}-${i}`,
      author: `Verified Renter ${i}`,
      country: pick(REVIEW_COUNTRIES, s),
      date: new Date(Date.UTC(2026, (i * 3) % 12, ((i * 7) % 27) + 1)).toISOString().slice(0, 10),
      title: pick(REVIEW_TITLES, s + 1),
      body: pick(REVIEW_BODIES, s + 2),
      ratings: {
        overall: clamped,
        vehicleCondition: jitter(1),
        pickupExperience: jitter(2),
        dropoffExperience: jitter(3),
        customerService: jitter(4),
        cleanliness: jitter(5),
        value: jitter(6),
        insuranceExperience: jitter(7),
        vehicleQuality: jitter(8),
      },
      verifiedBooking: seededRandom(s + 9) > 0.1,
    });
  }
  return reviews;
}

function aggregateRatings(reviews: CarReview[]): CarListing['ratings'] {
  const count = reviews.length;
  const avg = (key: keyof CarReview['ratings']) => Math.round((reviews.reduce((acc, r) => acc + r.ratings[key], 0) / count) * 10) / 10;
  return {
    overall: avg('overall'),
    vehicleCondition: avg('vehicleCondition'),
    pickupExperience: avg('pickupExperience'),
    dropoffExperience: avg('dropoffExperience'),
    customerService: avg('customerService'),
    cleanliness: avg('cleanliness'),
    value: avg('value'),
    insuranceExperience: avg('insuranceExperience'),
    vehicleQuality: avg('vehicleQuality'),
    reviewCount: count,
  };
}

export function generateCarListing(
  company: RentalCompanyFacts,
  vehicle: VehicleModel,
  location: RentalLocation,
  companyReviews: CarReview[]
): CarListing {
  const slug = `${company.slug}-${vehicle.id}-${location.slug}`;
  const seed = hashSeed(slug);

  const policies = generatePolicies(company, vehicle, location, seed);
  const insuranceOptions = generateInsuranceOptions(vehicle, location, seed);
  const images = generateImages(vehicle, company, location);
  const aiSearchTags = generateTags(vehicle, company, location, policies);
  const filters = generateFilters(vehicle, company, location, policies);
  const ratings = aggregateRatings(companyReviews);

  const pickupOptions = [
    location.type === 'airport' ? 'Airport counter & garage pickup' : location.type === 'cruise-port' ? 'Cruise terminal desk pickup' : location.type === 'rail-station' ? 'Rail station desk pickup' : 'Downtown office pickup',
    ...(company.tier !== 'budget' ? ['Hotel delivery (on request)'] : []),
    ...(company.id === 'enterprise' ? ['Free local pick-up service'] : []),
  ];
  const dropoffOptions = [
    'Return to pickup location',
    ...(location.oneWaySupported ? ['Different drop-off location (one-way fee applies)'] : []),
    ...(location.crossBorderAllowed ? ['Cross-border drop-off (where supported, on request)'] : []),
  ];

  const defaultPricing = computeCarPricing(company, vehicle, location, 'US', 'daily');
  const fromPricePerDayUSD = Math.round(defaultPricing.discountedPriceUSD);

  const title = `${vehicle.brand} ${vehicle.model} — ${company.name}, ${location.name}`;
  const metaDescription = `Rent a ${vehicle.year} ${vehicle.brand} ${vehicle.model} (${vehicle.category}) from ${company.name} at ${location.name}, ${location.city}. ${vehicle.seats} seats, ${vehicle.transmission.toLowerCase()}, from $${fromPricePerDayUSD}/day (estimate). Free cancellation.`;
  const canonicalUrl = `/cars/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: metaDescription,
    brand: { '@type': 'Brand', name: vehicle.brand },
    additionalType: 'https://schema.org/Vehicle',
    vehicleTransmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    seatingCapacity: vehicle.seats,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: fromPricePerDayUSD.toString(),
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2027-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratings.overall.toString(),
      reviewCount: ratings.reviewCount.toString(),
    },
  };

  const seo: CarSEO = {
    title: `${vehicle.brand} ${vehicle.model} Rental | ${company.name} ${location.city}`,
    slug,
    metaDescription,
    keywords: aiSearchTags.slice(0, 15),
    canonicalUrl,
    openGraph: { title, description: metaDescription, image: `/images/cars/${vehicle.id}-hero.jpg`, type: 'website' },
    twitterCard: { card: 'summary_large_image', title, description: metaDescription, image: `/images/cars/${vehicle.id}-hero.jpg` },
    jsonLd,
  };

  return {
    id: `CAR-${slug.toUpperCase()}`,
    slug,
    title,
    companyId: company.id,
    companyName: company.name,
    companyTier: company.tier,
    vehicleId: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    category: vehicle.category,
    specs: vehicle,
    sampleVin: sampleVin(seed),
    sampleLicensePlate: samplePlate(location.countryCode, seed),
    color: pick(COLORS, seed + 5),
    mileageKm: 3000 + Math.floor(seededRandom(seed + 6) * 42000),
    locationId: location.id,
    locationName: location.name,
    locationType: location.type,
    city: location.city,
    country: location.country,
    countryCode: location.countryCode,
    pickupOptions,
    dropoffOptions,
    policies,
    insuranceOptions,
    images,
    aiSearchTags,
    filters,
    ratings,
    seo,
    fromPricePerDayUSD,
  };
}
