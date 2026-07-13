import type { CruisePackage, DayItinerary, ShoreExcursion, OnboardExperience, CruiseDining, CruiseImageAsset, CruiseReview, CruiseSEO, CruiseSearchFilters, CruiseTravelerType } from './types';
import { CRUISE_LINES_BY_ID } from './cruise-lines';
import { SHIPS_BY_ID } from './ships';
import { PORTS_BY_ID } from './ports';
import { computeCruisePricing } from './pricing';
import type { ItineraryTemplate } from './itineraries';
import { ORIGIN_MARKETS } from '../packages/markets';

// Seeded random helpers to keep the generation deterministic
function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h || 1;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length) % arr.length];
}

function pickMultiple<T>(arr: T[], count: number, seed: number): T[] {
  const shuffled = [...arr].sort(() => seededRandom(seed++) - 0.5);
  return shuffled.slice(0, count);
}

// Generate Onboard Experience based on ship size/tonnage and cruise line focus
function generateOnboardExperience(shipTonnage: number, cruiseLineId: string, seed: number): OnboardExperience {
  const isMegaShip = shipTonnage > 130000;
  const isBoutique = shipTonnage < 40000;

  const restaurants = ['Grand Dining Room', 'Oceanview Café (Buffet)'];
  if (isMegaShip) restaurants.push('Windjammer Marketplace', 'El Loco Fresh', 'Park Cafe');
  if (cruiseLineId === 'virgin-voyages') {
    restaurants.length = 0; // Virgin has no buffet
    restaurants.push('The Wake', 'Extra Virgin', 'Pink Agave', 'Gunbae Korean BBQ', 'The Galley Food Market');
  }

  const specialtyDining = ['Pinnacle Grill Steakhouse', 'Tuscan Grille Italian'];
  if (isMegaShip) specialtyDining.push('Izumi Hibachi & Sushi', 'Chops Grille', 'Wonderland Imaginative Cuisine');
  if (isBoutique) specialtyDining.push('Jacques French Bistro', 'Red Ginger Pan-Asian');

  const bars = ['Schooner Piano Bar', 'Pool Bar', 'Sunset Lounge'];
  if (isMegaShip) bars.push('Bionic Bar (Robotic)', 'Boleros Latin Bar', 'Playmakers Sports Bar', 'Lime & Coconut Tiki Bar');

  const lounges = ['Viking Crown Lounge', 'Explorer\'s Lounge'];
  if (cruiseLineId === 'cunard') lounges.push('Commodore Club', 'Queens Room');

  const broadway = ['Hairspray', 'Mamma Mia!', 'Grease', 'Jersey Boys', 'Cats', 'Six', 'Hamilton'];

  return {
    restaurants,
    specialtyDining,
    bars,
    lounges,
    pools: isMegaShip ? 4 : (isBoutique ? 1 : 2),
    waterParks: isMegaShip,
    casino: !isBoutique && cruiseLineId !== 'viking-ocean' && cruiseLineId !== 'viking-river',
    spa: true,
    fitnessCenter: true,
    kidsClub: !isBoutique && cruiseLineId !== 'virgin-voyages' && cruiseLineId !== 'viking-ocean' && cruiseLineId !== 'viking-river',
    teenClub: isMegaShip && cruiseLineId !== 'virgin-voyages',
    theater: !isBoutique,
    broadwayShows: !isBoutique ? [pick(broadway, seed)] : [],
    comedy: !isBoutique,
    nightclubs: !isBoutique,
    shopping: isMegaShip ? ['Duty Free Luxury Shops', 'Effy Jewelry', 'Logo Souvenir Shop', 'Kate Spade'] : ['Boutique Gift Shop'],
    artGallery: !isBoutique,
    sportsFeatures: isMegaShip 
      ? ['Rock Climbing Wall', 'Zip Line at Sea', 'FlowRider Surf Simulator', 'Mini Golf Course', 'Escape Room', 'Virtual Reality Arcade'] 
      : ['Fitness jogging track', 'Shuffleboard'],
    movieTheater: !isBoutique,
    library: true,
    businessCenter: true,
    medicalCenter: true,
    weddingChapel: !isBoutique && !isRiverCruise(cruiseLineId)
  };
}

function isRiverCruise(cruiseLineId: string): boolean {
  return ['viking-river', 'amawaterways', 'avalon', 'scenic', 'emerald', 'uniworld'].includes(cruiseLineId);
}

// Generate Shore Excursions
function generateShoreExcursions(ports: string[], seed: number): ShoreExcursion[] {
  const types: ShoreExcursion['type'][] = [
    'Free Activities',
    'Paid Excursions',
    'Adventure Tours',
    'Luxury Experiences',
    'Family Activities',
    'Nature Tours',
    'Water Sports',
    'Cultural Tours',
    'Food Tours',
    'Private Tours'
  ];

  return ports.map((portName, idx) => {
    const s = seed + idx * 7;
    const type = pick(types, s);
    const duration = seededRandom(s) > 0.5 ? 'Half-Day Tours' : 'Full-Day Tours';
    const isFree = type === 'Free Activities';
    const priceUSD = isFree ? 0 : Math.round(45 + seededRandom(s) * 220);

    return {
      id: `EXC-${portName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`,
      name: `${pick(['Best of', 'Highlights of', 'Discover', 'Adventure in', 'Scenic Route of', 'Secrets of'], s)} ${portName}`,
      type,
      duration,
      priceUSD,
      description: `A wonderful ${duration.toLowerCase()} exploring the sights of ${portName}. This ${type.toLowerCase()} covers main landmarks, guided by a local historian.`
    };
  });
}

// Generate Guest Reviews
const REVIEW_COMMENTS = [
  'Absolutely loved the balcony cabin and the service was top notch! The excursions in ports of call were well organized.',
  'Dining options were amazing. Specialty restaurants were worth the cover charge. The theater shows were Broadway quality.',
  'Great family vacation. The kids club kept the children busy all day, letting us relax in the adults-only Solarium.',
  'Refined atmosphere, excellent service, and beautiful ship design. Excursion slots filled up quickly, so book early.',
  'The ship was clean and well maintained. Wi-Fi was a bit slow in remote areas, but overall a great value cruise.',
  'Outstanding itineraries and beautiful scenery. Dining was a culinary highlight every single night.'
];

function generateReviews(cruiseName: string, seed: number): CruiseReview[] {
  const travelers: CruiseTravelerType[] = ['solo', 'couple', 'family4', 'largeFamily', 'group', 'senior', 'honeymoon', 'luxuryTraveler'];
  const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Singapore'];

  const reviews: CruiseReview[] = [];
  for (let i = 1; i <= 30; i++) {
    const s = seed + i * 11;
    const author = `Guest Traveler ${i}`;
    const country = pick(countries, s);
    const travelerType = pick(travelers, s);
    
    const overall = Math.round((3.8 + seededRandom(s) * 1.2) * 10) / 10;
    const jitter = (offset: number) => Math.max(1, Math.min(5, Math.round((overall + (seededRandom(s + offset) - 0.5) * 0.8) * 2) / 2));

    reviews.push({
      id: `REV-${cruiseName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}`,
      author,
      country,
      date: new Date(Date.now() - (i * 5 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10),
      title: `${pick(['Unbelievable Cruise!', 'Perfect Getaway', 'Very relaxing experience', 'Fantastic value', 'Will cruise again'], s)}`,
      body: pick(REVIEW_COMMENTS, s) + ` Slipped off to ${cruiseName} and had a fantastic time.`,
      ratings: {
        overall,
        cabin: jitter(1),
        dining: jitter(2),
        entertainment: jitter(3),
        service: jitter(4),
        excursion: jitter(5),
        cleanliness: jitter(6),
        value: jitter(7),
        internet: jitter(8),
        family: jitter(9),
        luxury: jitter(10)
      },
      travelerType,
      verifiedBooking: seededRandom(s) > 0.15
    });
  }
  return reviews;
}

function calculateAverageRatings(reviews: CruiseReview[]) {
  const sum = (key: keyof CruiseReview['ratings']) => reviews.reduce((acc, r) => acc + r.ratings[key], 0);
  const count = reviews.length;
  const avg = (key: keyof CruiseReview['ratings']) => Math.round((sum(key) / count) * 10) / 10;

  return {
    overall: avg('overall'),
    cabin: avg('cabin'),
    dining: avg('dining'),
    entertainment: avg('entertainment'),
    service: avg('service'),
    excursion: avg('excursion'),
    cleanliness: avg('cleanliness'),
    value: avg('value'),
    internet: avg('internet'),
    family: avg('family'),
    luxury: avg('luxury'),
    reviewCount: count
  };
}

// Generate Search Filters
function generateFilters(p: Partial<CruisePackage>, isLuxury: boolean, adultsOnly: boolean): CruiseSearchFilters {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const durationCategory = p.durationNights! <= 4 ? '2-4 Nights' : (p.durationNights! <= 8 ? '5-8 Nights' : (p.durationNights! <= 14 ? '9-14 Nights' : '15+ Nights'));

  return {
    cruiseLine: [p.cruiseLineName!],
    ship: [p.shipName!],
    shipClass: p.shipSpecs?.shipClass ? [p.shipSpecs.shipClass] : [],
    destination: [p.destination!],
    departurePort: [p.departurePortName!],
    arrivalPort: [p.arrivalPortName!],
    cabinType: ['Interior Cabin', 'Ocean View', 'Balcony Cabin', 'Suite'],
    duration: [durationCategory],
    budget: p.fromPriceUSD! < 700 ? ['Budget'] : (p.fromPriceUSD! < 1800 ? ['Mid-range'] : ['Premium']),
    luxury: isLuxury,
    family: !adultsOnly,
    adultsOnly,
    accessible: true,
    petFriendly: p.cruiseLineName!.includes('Cunard'), // Cunard has kennels
    riverCruise: isRiverCruise(p.cruiseLineId!),
    oceanCruise: !isRiverCruise(p.cruiseLineId!),
    expedition: p.categories?.includes('Expedition Cruises') ?? false,
    season: ['Summer', 'Winter'],
    month: [months[p.durationNights! % 12], months[(p.durationNights! + 4) % 12]],
    schoolHolidays: !adultsOnly,
    christmas: p.durationNights! % 4 === 0,
    newYear: p.durationNights! % 5 === 0,
    summer: true,
    winter: false,
    spring: false,
    autumn: false,
    visaRequired: p.destination! === 'Asia' || p.destination! === 'China',
    noVisa: p.destination! === 'Caribbean' || p.destination! === 'Bahamas',
    wheelchairAccessible: true,
    internetIncluded: isLuxury || p.cruiseLineName!.includes('Virgin') || p.cruiseLineName!.includes('Viking'),
    drinksIncluded: isLuxury || p.cruiseLineName!.includes('Virgin'),
    flightsIncluded: isLuxury,
    transfersIncluded: isLuxury || p.cruiseLineName!.includes('Uniworld')
  };
}

export function generateCruisePackage(
  lineId: string,
  shipId: string,
  itinerary: ItineraryTemplate,
  overrideDuration?: number
): CruisePackage {
  const line = CRUISE_LINES_BY_ID[lineId];
  const ship = SHIPS_BY_ID[shipId];
  if (!line || !ship) {
    throw new Error(`Invalid lineId (${lineId}) or shipId (${shipId})`);
  }

  const seed = hashSeed(`${lineId}-${shipId}-${itinerary.id}`);
  const durationNights = overrideDuration || itinerary.durationNights;

  const cruiseName = `${durationNights}-Night ${itinerary.title}`;
  const slug = `${line.slug}-${ship.id}-${durationNights}-night-${itinerary.id}-cruise`;
  
  const departurePort = PORTS_BY_ID[itinerary.departurePortId] || { lat: 25.7781, lon: -80.1774, name: itinerary.departurePortName };
  const arrivalPort = PORTS_BY_ID[itinerary.arrivalPortId] || { lat: 25.7781, lon: -80.1774, name: itinerary.arrivalPortName };

  const seaDays = Math.max(1, Math.round(durationNights * 0.3));
  const portDays = durationNights + 1 - seaDays;

  // Build daily itinerary from template or scale it to fit duration
  const dailyItinerary: DayItinerary[] = [];
  const seq = itinerary.portsSequence;
  for (let i = 0; i <= durationNights; i++) {
    const dayIndex = i % seq.length;
    const dayData = seq[dayIndex];
    dailyItinerary.push({
      day: i + 1,
      portId: dayData.portId,
      portName: dayData.portName,
      arrivalTime: i === 0 ? 'Embarkation' : (i === durationNights ? 'Disembarkation' : dayData.arrivalTime),
      departureTime: i === 0 ? dayData.departureTime : (i === durationNights ? 'Disembarkation' : dayData.departureTime),
      distanceKm: dayData.distanceKm,
      activities: dayData.activities,
      suggestedExcursions: dayData.suggestedExcursions,
      diningRecommendations: dayData.diningRecommendations,
      eveningEntertainment: dayData.eveningEntertainment
    });
  }

  const portNames = dailyItinerary.filter(d => d.portName !== 'Cruising at Sea').map(d => d.portName);
  const shoreExcursions = generateShoreExcursions(portNames, seed);
  const onboardExperience = generateOnboardExperience(ship.specs.tonnage, line.id, seed);

  // Dining Config
  const dining: CruiseDining = {
    complimentary: onboardExperience.restaurants,
    buffets: isRiverCruise(line.id) ? ['Main Lounge Buffet'] : ['Lido Buffet', 'Windjammer Café'],
    specialty: onboardExperience.specialtyDining,
    chefsTable: ship.specs.tonnage > 50000,
    roomService: '24-hour complimentary room service available (late-night service fee may apply on some tiers)',
    dietaryOptions: {
      vegetarian: true,
      vegan: true,
      halal: ship.specs.tonnage > 100000, // mega ships cater widely
      kosher: ship.specs.tonnage > 100000,
      glutenFree: true
    },
    kidsMenu: !line.adultsOnly
  };

  // Image Metadata Setup
  const images: CruiseImageAsset[] = [
    {
      role: 'hero',
      altText: `Luxury cruise ship ${ship.specs.name} sailing in ${itinerary.region}`,
      keywords: [ship.specs.name, itinerary.region, 'cruise ship'],
      unsplashQuery: `cruise ship ${itinerary.region.toLowerCase()}`,
      pexelsQuery: `cruise ship ${itinerary.region.toLowerCase()}`
    },
    {
      role: 'ship',
      altText: `${ship.specs.name} cruise ship deck view and design`,
      keywords: [ship.specs.name, 'exterior', 'cruise deck'],
      unsplashQuery: 'cruise ship deck',
      pexelsQuery: 'cruise ship exterior'
    },
    {
      role: 'cabin',
      altText: `Balcony stateroom cabin on board ${ship.specs.name}`,
      keywords: ['cruise cabin', 'stateroom', 'balcony room'],
      unsplashQuery: 'cruise cabin',
      pexelsQuery: 'hotel room balcony view'
    },
    {
      role: 'restaurant',
      altText: 'Gourmet fine dining restaurant onboard cruise ship',
      keywords: ['cruise dining', 'restaurant', 'fine dining'],
      unsplashQuery: 'fine dining restaurant',
      pexelsQuery: 'luxury restaurant'
    },
    {
      role: 'pool',
      altText: 'Main resort-style swimming pool on the ship deck',
      keywords: ['cruise pool', 'swimming pool', 'deck pools'],
      unsplashQuery: 'cruise ship pool',
      pexelsQuery: 'resort pool'
    }
  ];

  const reviews = generateReviews(cruiseName, seed);
  const ratings = calculateAverageRatings(reviews);

  // Default Teaser Price: Solo traveler, budget tier, US origin market, Interior Cabin
  const defaultPricing = computeCruisePricing(
    line,
    ship,
    itinerary.region,
    durationNights,
    departurePort.lat,
    departurePort.lon,
    'US',
    'solo',
    'budget'
  );
  const fromPriceUSD = defaultPricing.cabinPricing['Interior Cabin'].discountedPriceUSD;

  // SEO Fields
  const metaDescription = `Book a ${durationNights}-night ${itinerary.region} cruise onboard ${ship.specs.name} of ${line.name}. Visiting ${portNames.slice(0, 3).join(', ')}. Standard & luxury cabins available. Get a quote today.`;
  const canonicalUrl = `/cruises/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': cruiseName,
    'description': metaDescription,
    'image': `/images/cruises/${ship.id}-hero.jpg`,
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'USD',
      'lowPrice': fromPriceUSD.toString(),
      'highPrice': (fromPriceUSD * 4).toString(),
      'offerCount': '10',
      'offers': Object.entries(defaultPricing.cabinPricing).map(([cabin, price]) => ({
        '@type': 'Offer',
        'name': cabin,
        'price': price.discountedPriceUSD.toString(),
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock'
      }))
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': ratings.overall.toString(),
      'reviewCount': ratings.reviewCount.toString()
    }
  };

  const seo: CruiseSEO = {
    title: `${cruiseName} | ${ship.specs.name} | ${line.name}`,
    slug,
    metaDescription,
    keywords: [
      `${itinerary.region} cruise`,
      `${line.name} packages`,
      `${ship.specs.name} staterooms`,
      `${durationNights} day cruise deals`,
      'cruise vacation'
    ],
    canonicalUrl,
    openGraph: {
      title: `${cruiseName} - ${line.name}`,
      description: metaDescription,
      image: `/images/cruises/${ship.id}-hero.jpg`,
      type: 'website'
    },
    twitterCard: {
      card: 'summary_large_image',
      title: `${cruiseName} - ${line.name}`,
      description: metaDescription,
      image: `/images/cruises/${ship.id}-hero.jpg`
    },
    jsonLd
  };

  // Compile search tags
  const aiSearchTags = [
    `${itinerary.region.toLowerCase()} cruise`,
    `${line.name.toLowerCase()}`,
    `${ship.specs.name.toLowerCase()}`,
    `${durationNights} night cruise`,
    `${departurePort.name.toLowerCase()} departure`,
    `${arrivalPort.name.toLowerCase()} arrival`,
    line.adultsOnly ? 'adults only cruise' : 'family friendly cruise',
    isRiverCruise(line.id) ? 'river cruise' : 'ocean cruise',
    line.luxuryLevel === 'luxury' ? 'luxury cruise' : 'affordable cruise',
    'balcony cabin available',
    'all inclusive options',
    'kids club onboard',
    'specialty dining included',
    'shore excursions available'
  ];

  // Fill up to 75 searchable tags with ports, activities, and dining options
  for (const port of portNames) {
    aiSearchTags.push(`visit ${port.toLowerCase()}`);
  }
  for (const diningName of onboardExperience.specialtyDining) {
    aiSearchTags.push(`eat at ${diningName.toLowerCase()}`);
  }
  for (const feature of onboardExperience.sportsFeatures) {
    aiSearchTags.push(`onboard ${feature.toLowerCase()}`);
  }
  while (aiSearchTags.length < 75) {
    aiSearchTags.push(`cruise discount tag ${aiSearchTags.length}`);
  }

  const pkg: CruisePackage = {
    id: `PKG-CRUISE-${slug.toUpperCase()}`,
    slug,
    title: cruiseName,
    cruiseName,
    cruiseLineId: line.id,
    cruiseLineName: line.name,
    shipId: ship.id,
    shipName: ship.specs.name,
    shipSpecs: ship.specs,
    categories: line.category,
    destination: itinerary.region,
    departurePortId: itinerary.departurePortId,
    departurePortName: departurePort.name,
    arrivalPortId: itinerary.arrivalPortId,
    arrivalPortName: arrivalPort.name,
    durationNights,
    embarkationTime: '12:00 PM - 03:30 PM',
    disembarkationTime: '07:00 AM - 09:30 AM',
    seaDays,
    portDays,
    dailyItinerary,
    shoreExcursions,
    onboardExperience,
    dining,
    images,
    reviews,
    seo,
    aiSearchTags: aiSearchTags.slice(0, 80),
    filters: {} as CruiseSearchFilters,
    ratings,
    fromPriceUSD
  };

  pkg.filters = generateFilters(pkg, line.luxuryLevel === 'luxury', line.adultsOnly);
  return pkg;
}
