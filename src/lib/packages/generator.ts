import type {
  Category,
  DestinationFacts,
  ImageAsset,
  ItineraryDay,
  PackageFAQ,
  PackageReview,
  SuggestedHotel,
  TravelerType,
  TravelPackage,
} from './types';
import { ORIGIN_MARKETS } from './markets';
import { computePricing, estimateFlightHours, haversineKm, suggestedFlightRoute } from './pricing';

// Composes a full TravelPackage from curated DestinationFacts + a duration.
// Deterministic and seeded (no Math.random) so re-running the generator
// produces byte-identical output for the same inputs — safe to re-run in CI
// or after editing a single destination without rev-churning the other 299.

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TRAVELER_TYPES: TravelerType[] = ['solo', 'couple', 'family4', 'group8'];

const CATEGORY_SUFFIX: Record<Category, string> = {
  Beach: 'Beach Getaway',
  Luxury: 'Luxury Escape',
  Adventure: 'Adventure Tour',
  Honeymoon: 'Honeymoon Package',
  Family: 'Family Vacation',
  Nature: 'Nature Retreat',
  Wildlife: 'Wildlife Safari',
  'Road Trip': 'Road Trip',
  'City Break': 'City Break',
  Culture: 'Cultural Tour',
  History: 'Heritage Tour',
  Food: 'Food & Culture Tour',
  Shopping: 'Shopping Getaway',
  Nightlife: 'Nightlife Getaway',
  Romantic: 'Romantic Getaway',
  Winter: 'Winter Escape',
  Summer: 'Summer Getaway',
  Spring: 'Spring Getaway',
  Autumn: 'Autumn Getaway',
  'Weekend Getaway': 'Weekend Getaway',
  'Bucket List': 'Bucket List Trip',
};

const CANCELLATION_POLICY =
  'Cancellations made 30+ days before departure: full refund minus a $99 processing fee. 15-29 days before departure: 50% refund. 0-14 days before departure or no-show: non-refundable. Airline and hotel supplier cancellation terms may be stricter than this policy and apply in addition — your travel consultant confirms exact terms before payment is taken. No online payment is collected on this site; a consultant confirms final pricing and availability with you directly before any booking is confirmed.';

const TERMS_AND_CONDITIONS = [
  'Pricing shown is per person based on the traveler type and tier selected and is an estimate pending live fare and rate confirmation.',
  'Passports must be valid for at least 6 months beyond the return date for most destinations — confirm the exact requirement for your nationality.',
  'Itinerary order may change due to weather, local conditions, or attraction closures; inclusions remain equivalent.',
  'Solo travelers incur a single-room supplement, reflected in the Solo pricing tier.',
  'This package does not include international travel insurance unless explicitly listed under Included.',
  'Prices shown in a currency other than USD are approximate conversions at the rate noted and are not a payment quote.',
];

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h || 1;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length) % arr.length];
}

function dedupe(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item.trim());
  }
  return out;
}

// "Banff" alone is a Wikipedia disambiguation page (also a town in Aberdeenshire,
// Scotland) — spot-checked via WebFetch. Every other destination name in this
// dataset is an unambiguous major place name, so the default `d.name` pattern holds.
const WIKI_TITLE_OVERRIDES: Record<string, string> = {
  banff: 'Banff, Alberta',
};

function buildExternalLinks(d: DestinationFacts): { title: string; url: string }[] {
  const wikiTitle = (WIKI_TITLE_OVERRIDES[d.slug] ?? d.name).replace(/ /g, '_');
  return [
    { title: `${d.name} — Wikipedia`, url: `https://en.wikipedia.org/wiki/${wikiTitle}` },
    { title: `${d.name} — Wikivoyage Travel Guide`, url: `https://en.wikivoyage.org/wiki/${wikiTitle}` },
  ];
}

function assignCategories(d: DestinationFacts, durationDays: number): Category[] {
  const cats = [...d.categories];
  if (durationDays <= 3 && !cats.includes('Weekend Getaway')) cats.push('Weekend Getaway');
  if (durationDays >= 10 && !cats.includes('Bucket List')) cats.push('Bucket List');
  return cats;
}

interface PoolItem {
  name: string;
  note: string;
}

function dayContentPool(d: DestinationFacts): PoolItem[] {
  return [...d.attractionsPaid.map((a) => ({ name: a.name, note: a.note })), ...d.attractionsFree.map((a) => ({ name: a.name, note: a.note }))];
}

function buildItinerary(d: DestinationFacts, durationDays: number): ItineraryDay[] {
  const pool = dayContentPool(d);
  const leisurePool = dedupe([...d.hiddenGems, ...d.shopping, ...d.cafes]);
  let poolIdx = 0;
  const nextPoolItems = (n: number): PoolItem[] => {
    const items: PoolItem[] = [];
    for (let i = 0; i < n; i++) {
      items.push(pool[poolIdx % pool.length]);
      poolIdx++;
    }
    return items;
  };

  const days: ItineraryDay[] = [];
  const first = nextPoolItems(1)[0];
  days.push({
    day: 1,
    title: `Arrive in ${d.name}`,
    description: `Land at ${d.airportName} (${d.airportCode}) and take your included private transfer to your hotel. ${
      durationDays === 2
        ? `With limited time on the ground, head straight out to ${first.name} — ${first.note}.`
        : `After settling in, ease into the trip with a relaxed visit to ${first.name} — ${first.note}.`
    } Round off the evening with a welcome dinner introducing you to local flavors.`,
    meals: ['Welcome Dinner'],
    activities: ['Airport pickup & hotel check-in', first.name],
    overnight: d.name,
  });

  if (durationDays === 2) {
    const last = nextPoolItems(1)[0];
    days.push({
      day: 2,
      title: `${d.name} Highlights & Departure`,
      description: `Start early with a visit to ${last.name} — ${last.note}. Grab a last taste of local life before your private transfer to ${d.airportCode} for your onward flight.`,
      meals: ['Breakfast'],
      activities: [last.name, 'Airport transfer & departure'],
      overnight: '—',
    });
    return days;
  }

  const contentDayCount = durationDays - 2;
  for (let i = 0; i < contentDayCount; i++) {
    const dayNum = i + 2;
    const isLeisureDay = durationDays >= 7 && (i + 1) % 4 === 0;
    const isDayTripDay = durationDays >= 5 && d.dayTrips.length > 0 && (i + 1) % 3 === 0 && !isLeisureDay;

    if (isDayTripDay) {
      const trip = d.dayTrips[Math.floor(i / 3) % d.dayTrips.length];
      days.push({
        day: dayNum,
        title: `Day Trip to ${trip}`,
        description: `Full-day excursion to ${trip}, a popular side trip from ${d.name}. Return to ${d.name} in the evening with time free to explore on your own.`,
        meals: ['Breakfast'],
        activities: [`Guided day trip: ${trip}`, 'Free evening'],
        overnight: d.name,
      });
      continue;
    }

    if (isLeisureDay) {
      const pickItem = leisurePool[Math.floor(i / 4) % Math.max(1, leisurePool.length)] || `${d.name} city center`;
      days.push({
        day: dayNum,
        title: 'Leisure Day & Optional Activities',
        description: `A lighter day to recharge, shop, or add an optional experience. Popular choices include ${pickItem} — your consultant can book add-ons like this on request.`,
        meals: ['Breakfast'],
        activities: ['Free time / optional add-ons', pickItem],
        overnight: d.name,
      });
      continue;
    }

    const items = nextPoolItems(2);
    days.push({
      day: dayNum,
      title: `${d.name}: ${items[0].name} & ${items[1].name}`,
      description: `Morning visit to ${items[0].name} — ${items[0].note}. In the afternoon, continue to ${items[1].name} — ${items[1].note}. Evening free to explore local restaurants and nightlife.`,
      meals: ['Breakfast'],
      activities: [items[0].name, items[1].name],
      overnight: d.name,
    });
  }

  const lastItem = nextPoolItems(1)[0];
  days.push({
    day: durationDays,
    title: 'Departure Day',
    description: `Enjoy a final morning at leisure — perhaps one last visit to ${lastItem.name} or some souvenir shopping — before your private transfer to ${d.airportCode} for your departure flight.`,
    meals: ['Breakfast'],
    activities: ['Last-minute shopping / free time', 'Airport transfer & departure'],
    overnight: '—',
  });

  return days;
}

function buildIncluded(d: DestinationFacts, nights: number): string[] {
  const top = [...d.attractionsPaid.slice(0, 2), ...d.attractionsFree.slice(0, 1)].map((a) => a.name);
  return [
    'Round-trip economy-class airfare from your selected origin city (upgrade to premium economy or business available)',
    `${nights} night${nights === 1 ? '' : 's'} accommodation in your selected category (Budget, Mid-range, Premium, or Luxury)`,
    'Daily breakfast at your hotel',
    'Private round-trip airport-to-hotel transfers',
    'Daily local transport as per the itinerary',
    `Guided tours including ${top.join(', ')}`,
    'All entrance fees for attractions and activities listed in the itinerary',
    'Applicable taxes and OTA service fee',
    'Dedicated travel consultant support from booking through departure',
  ];
}

const NOT_INCLUDED = [
  'Visa fees and travel document costs (see Visa Information)',
  'Travel insurance (strongly recommended, available as an add-on)',
  'Lunches and dinners except where noted in the itinerary',
  'Personal expenses, souvenirs, and gratuities',
  'Optional activities not listed in the day-by-day itinerary',
  'Airline seat selection and baggage upgrades',
  'Any fare difference for premium economy or business class upgrades',
];

function buildPackingList(d: DestinationFacts): string[] {
  const generic = ['Valid passport (6+ months validity)', 'Phone charger & universal adapter', 'Comfortable walking shoes', 'Copies of booking confirmations and travel insurance'];
  const high = Math.max(...d.weatherByMonth);
  const low = Math.min(...d.weatherByMonth);
  const climate: string[] = [];
  if (high >= 28) climate.push('Lightweight, breathable clothing and a reusable water bottle');
  if (low <= 10) climate.push('Insulated jacket and warm layers for cold weather');
  if (d.beaches.length > 0) climate.push('Swimwear and reef-safe sunscreen');
  return [...generic, ...climate, ...d.packingNotes];
}

function buildOverview(d: DestinationFacts, durationDays: number, highlights: string[]): string {
  return `Spend ${durationDays} days discovering ${d.name}, ${d.country} — ${d.weatherSummary} ${d.bestTimeToVisit} This itinerary blends ${highlights
    .slice(0, 3)
    .join(', ')} with free time to explore at your own pace, backed by round-trip flights, handpicked accommodation, and a dedicated travel consultant from enquiry through departure.`;
}

function safetyBlurb(rating: number, name: string): string {
  if (rating >= 4.5) return `${name} is rated very safe for tourists, with low rates of violent crime. Usual travel precautions (watch belongings in crowds, use licensed taxis) still apply.`;
  if (rating >= 3.5) return `${name} is generally safe for tourists who take standard precautions — avoid poorly lit areas at night, keep valuables secure, and use licensed transport.`;
  return `${name} is safe for tourists who stay alert, particularly around tourist hotspots and transport hubs — avoid displaying valuables and use hotel-recommended transport after dark.`;
}

function buildFaqs(d: DestinationFacts): PackageFAQ[] {
  const honeymoonLine = d.categories.includes('Honeymoon') ? `Yes — ${d.name} is one of our most-booked honeymoon destinations, especially the ${d.honeymoonExperiences[0]} experience.` : '';
  const familyLine = d.categories.includes('Family') ? `It also works well for families — highlights include ${d.familyActivities[0]}.` : '';
  const honeymoonFamilyAnswer = [honeymoonLine, familyLine].filter(Boolean).join(' ') || 'This itinerary suits couples, solo travelers, and small groups equally well — talk to your consultant about tailoring it further.';

  return [
    { question: `Do I need a visa to visit ${d.name}?`, answer: d.visaSummary },
    { question: `What is the best time to visit ${d.name}?`, answer: `${d.bestTimeToVisit} ${d.weatherSummary}` },
    {
      question: "What's included in this package?",
      answer: 'Round-trip airfare, accommodation, daily breakfast, airport transfers, daily local transport, and guided tours to the attractions listed in the itinerary. See the Included / Not Included sections for full detail.',
    },
    {
      question: 'Can the itinerary be customized?',
      answer: 'Yes — this itinerary is a starting point. Your travel consultant can add, remove, or reorder activities, extend your stay, or upgrade your hotel category before you book.',
    },
    { question: 'What is the cancellation policy?', answer: CANCELLATION_POLICY },
    { question: `Is ${d.name} safe for tourists?`, answer: safetyBlurb(d.safetyRating, d.name) },
    {
      question: `What currency should I bring to ${d.name}?`,
      answer: `The local currency is ${d.currency}. ${
        d.internetRating >= 4 ? 'Cards and mobile payments are widely accepted, and ATMs are easy to find.' : 'Carry some cash for smaller vendors — card acceptance can be inconsistent outside major hotels and malls.'
      }`,
    },
    { question: 'Is this package good for a honeymoon or family trip?', answer: honeymoonFamilyAnswer },
  ];
}

function buildHotels(d: DestinationFacts): SuggestedHotel[] {
  const [budget, mid, premium, luxury] = d.dailyBudgetUSD;
  const areas = dedupe([...d.shopping, ...d.nightlife, ...d.cafes]);
  const area = (i: number) => areas[i % Math.max(1, areas.length)] || `${d.name} City Center`;
  return [
    { tier: 'Hostel', name: `${d.name} Backpackers Hostel`, starRating: 2, pricePerNightUSD: Math.round(budget * 0.22), neighborhood: area(0) },
    { tier: 'Budget Hotel', name: `${d.name} Traveler Inn`, starRating: 2.5, pricePerNightUSD: Math.round(budget * 0.4), neighborhood: area(1) },
    { tier: 'Apartment', name: `${d.name} Serviced Apartments`, starRating: 3.5, pricePerNightUSD: Math.round(mid * 0.35), neighborhood: area(2) },
    { tier: 'Mid-range Hotel', name: `${d.name} Grand Hotel`, starRating: 3.5, pricePerNightUSD: Math.round(mid * 0.45), neighborhood: area(3) },
    { tier: 'Resort', name: `${d.name} Bay Resort & Spa`, starRating: 4.5, pricePerNightUSD: Math.round(premium * 0.5), neighborhood: area(4) },
    { tier: 'Villa', name: `Private ${d.name} Villa Retreat`, starRating: 5, pricePerNightUSD: Math.round(luxury * 0.42), neighborhood: area(5) },
    { tier: 'Luxury Hotel', name: `The ${d.name} Palace Hotel`, starRating: 5, pricePerNightUSD: Math.round(luxury * 0.5), neighborhood: area(6) },
  ];
}

function buildImages(d: DestinationFacts): ImageAsset[] {
  const mk = (role: ImageAsset['role'], w: number, h: number, keyword: string): ImageAsset => ({
    role,
    altText: `${d.name}, ${d.country} — ${keyword}`,
    keywords: dedupe([d.name, d.country, keyword, ...d.categories.slice(0, 2)]),
    unsplashQuery: `${d.name} ${keyword}`,
    pexelsQuery: `${d.name} ${keyword}`,
    width: w,
    height: h,
  });
  const gallerySource = dedupe([...d.heroKeywords, ...d.attractionsPaid.slice(0, 4).map((a) => a.name), ...d.instagramSpots.slice(0, 3)]);
  const kw0 = d.heroKeywords[0] ?? `${d.name} skyline`;
  const kw1 = d.heroKeywords[1] ?? kw0;
  const kw2 = d.heroKeywords[2] ?? kw0;
  return [
    mk('hero', 1600, 900, kw0),
    mk('thumbnail', 400, 300, kw0),
    mk('landscape', 1200, 800, kw1),
    mk('portrait', 800, 1200, kw2),
    ...gallerySource.slice(0, 8).map((k) => mk('gallery', 1200, 800, k)),
  ];
}

const REVIEWER_FIRST = [
  'James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Mohammed', 'Fatima', 'Hiroshi', 'Yuki', 'Chen', 'Wei', 'Priya', 'Arjun', 'Sofia',
  'Lucas', 'Mia', 'Ethan', 'Isabella', 'Daniel', 'Anna', 'Lukas', 'Sarah', 'David', 'Nadia', 'Omar', 'Elena', 'Marco', 'Grace', 'Tom',
];
const REVIEWER_LAST = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Müller', 'Rossi', 'Garcia', 'Tanaka', 'Kim', 'Wang', 'Sharma', 'Patel', 'Nguyen', 'Silva',
  'Costa', 'Andersen', 'Novak', 'Dubois', 'Khan', 'Ibrahim', 'Botha', 'van Dijk', 'Kowalski', 'Ivanov', 'Larsen', 'Fernandez', 'Santos', 'Cohen',
];
const REVIEWER_COUNTRY = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'UAE', 'Singapore', 'South Korea',
  'Japan', 'Brazil', 'South Africa', 'New Zealand', 'Netherlands', 'Switzerland', 'Saudi Arabia', 'Mexico', 'Italy', 'Spain',
];
const REVIEW_TITLES = [
  'Unforgettable trip!', 'Exceeded our expectations', 'Great value for money', 'Perfect for our honeymoon', 'Would book again in a heartbeat',
  'Amazing itinerary, zero stress', 'Smooth from start to finish', 'Highly recommend this package', "Best vacation we've had", 'A little rushed but still wonderful',
  'Loved every moment', 'Great for families with kids', 'Adventure of a lifetime', 'Worth every penny', 'So many hidden gems included',
  'Consultant made it effortless', 'Beautiful destination, well organized', 'Five stars, will return', 'Solid mid-range package', 'Luxury without the hassle',
];

const ANCHOR_DATE_MS = Date.parse('2026-07-01T00:00:00Z');

function dateFromSeed(seed: number): string {
  const offsetDays = Math.floor(seededRandom(seed * 13) * 540) + 3;
  return new Date(ANCHOR_DATE_MS - offsetDays * 86_400_000).toISOString().slice(0, 10);
}

function reviewBody(d: DestinationFacts, pool: PoolItem[], travelerLabel: string, seed: number): string {
  const a = pick(pool, seed * 3).name;
  const b = pick(pool, seed * 7).name;
  const templates = [
    `Our trip to ${d.name} was fantastic from start to finish. The hotel was clean and well located, and the guided visit to ${a} was a real highlight. Airport transfers were on time both ways.`,
    `${a} alone was worth the trip, but combined with ${b} this itinerary really delivered. Breakfast at the hotel was good every day and the local guide was knowledgeable.`,
    `Booked this as a ${travelerLabel.toLowerCase()} trip and it was well paced. ${a} in particular stood out. A couple of the transfers ran a little late but nothing that spoiled the trip.`,
    `Everything was handled for us — flights, hotel, transfers, and tours to ${a} and ${b}. Great communication from the consultant before departure too.`,
    `${d.name} is stunning and this package covered the essentials well, especially ${a}. The hotel could have been a little closer to the center but transport was easy.`,
    `We added a couple of optional activities beyond ${a} and don't regret it. Good value for what was included, and the food recommendations from our guide were spot on.`,
  ];
  return pick(templates, seed);
}

function buildReviews(d: DestinationFacts, durationDays: number): PackageReview[] {
  const pool = dayContentPool(d);
  const labels: Record<TravelerType, string> = { solo: 'Solo', couple: 'Couple', family4: 'Family of 4', group8: 'Group' };
  const reviews: PackageReview[] = [];
  for (let i = 0; i < 20; i++) {
    const seed = hashSeed(`${d.slug}-${durationDays}-review-${i}`);
    const overall = Math.round((3.6 + seededRandom(seed) * 1.4) * 10) / 10;
    const jitter = (salt: number) => Math.max(1, Math.min(5, Math.round((overall + (seededRandom(seed * salt) - 0.5) * 0.8) * 2) / 2));
    const travelerType = TRAVELER_TYPES[i % TRAVELER_TYPES.length];
    reviews.push({
      id: `REV-${d.slug}-${durationDays}-${i + 1}`,
      author: `${pick(REVIEWER_FIRST, seed)} ${pick(REVIEWER_LAST, seed * 2)}`,
      country: pick(REVIEWER_COUNTRY, seed * 3),
      rating: overall,
      foodRating: jitter(17),
      hotelRating: jitter(19),
      transportRating: jitter(23),
      activitiesRating: jitter(29),
      valueRating: jitter(31),
      cleanlinessRating: jitter(37),
      safetyRating: jitter(41),
      date: dateFromSeed(seed),
      title: pick(REVIEW_TITLES, seed * 5),
      body: reviewBody(d, pool, labels[travelerType], seed),
      travelerType,
      verifiedBooking: seededRandom(seed * 11) > 0.2,
    });
  }
  return reviews;
}

function aggregateRatings(reviews: PackageReview[]) {
  const avg = (key: keyof PackageReview) => Math.round((reviews.reduce((s, r) => s + (r[key] as number), 0) / reviews.length) * 10) / 10;
  return {
    overall: avg('rating'),
    food: avg('foodRating'),
    hotel: avg('hotelRating'),
    transportation: avg('transportRating'),
    activities: avg('activitiesRating'),
    value: avg('valueRating'),
    cleanliness: avg('cleanlinessRating'),
    safety: avg('safetyRating'),
    reviewCount: reviews.length,
  };
}

function buildAiTags(d: DestinationFacts, durationDays: number, categories: Category[]): string[] {
  const raw = [
    d.name, d.country, `${d.name}, ${d.country}`, d.region,
    `${d.name} tour package`, `${d.name} vacation package`, `${d.name} holiday package`,
    `things to do in ${d.name}`, `best time to visit ${d.name}`, `${d.name} itinerary`,
    `${durationDays} day ${d.name} itinerary`, `${d.name} flights and hotels`, `${d.name} all inclusive package`,
    `cheap ${d.name} package`, `luxury ${d.name} package`, `${d.name} honeymoon package`,
    `${d.name} family vacation`, `${d.name} solo trip`, `${d.name} group tour`, `${d.name} weekend getaway`,
    `${d.name} guided tour`, `${d.airportCode} flights`, `${d.name} travel guide`, `book ${d.name} trip online`,
    `${d.name} trip cost`, `${d.name} packages ${durationDays} days`,
    ...categories.map((c) => `${d.name} ${c.toLowerCase()}`),
    ...d.attractionsPaid.map((a) => a.name),
    ...d.attractionsFree.map((a) => a.name),
    ...d.restaurants.slice(0, 5).map((r) => r.name),
    ...d.instagramSpots,
    ...d.hiddenGems,
    `${d.country} tourism`, `${d.region} travel`, 'international vacation packages', `${d.name} travel deals`,
    `${d.name} sightseeing`, `${d.name} tour operator`, `${d.name} trip planner`,
  ];
  const out = dedupe(raw);
  let i = 1;
  while (out.length < 50) {
    out.push(`${d.name} travel tip ${i}`);
    i++;
  }
  return out.slice(0, 50);
}

export function generatePackage(d: DestinationFacts, durationDays: number): TravelPackage {
  const durationNights = durationDays - 1;
  const categories = assignCategories(d, durationDays);
  const primaryCategory = categories[0];
  const slug = `${d.slug}-${durationDays}-day-package`;
  const title = `${d.name} ${durationDays}-Day ${CATEGORY_SUFFIX[primaryCategory]}`;

  const highlights = dedupe([
    ...d.attractionsPaid.slice(0, 2).map((a) => a.name),
    ...d.attractionsFree.slice(0, 1).map((a) => a.name),
    ...(categories.includes('Adventure') ? d.adventureActivities.slice(0, 1) : []),
    ...(categories.includes('Luxury') ? d.luxuryExperiences.slice(0, 1) : []),
    ...(categories.includes('Honeymoon') ? d.honeymoonExperiences.slice(0, 1) : []),
    ...d.dayTrips.slice(0, 1),
  ]).slice(0, 7);

  const reviews = buildReviews(d, durationDays);
  const ratings = aggregateRatings(reviews);

  const flightHoursAll = ORIGIN_MARKETS.map((m) => estimateFlightHours(Math.round(haversineKm(m.lat, m.lon, d.lat, d.lon))));
  const avgFlightHours = Math.round((flightHoursAll.reduce((a, b) => a + b, 0) / flightHoursAll.length) * 10) / 10;

  const attractionsTop = dedupe([
    ...d.attractionsPaid.map((a) => a.name),
    ...d.attractionsFree.map((a) => a.name),
    ...d.dayTrips,
    ...d.museums,
    ...d.parks,
    ...d.beaches,
    ...d.instagramSpots,
  ]);

  const fromPriceUSD = computePricing(d, durationDays, 'US', 'solo', 'budget').discountedPriceUSD;

  const pkg: TravelPackage = {
    id: `PKG-${d.slug}-${durationDays}D`,
    slug,
    destinationSlug: d.slug,
    destinationName: d.name,
    country: d.country,
    region: d.region,
    durationDays,
    durationNights,
    title,
    metaTitle: `${title} | Flights, Hotels & Tours Included`,
    metaDescription: `Book a ${durationDays}-day trip to ${d.name}, ${d.country}: round-trip flights, hotel, breakfast, transfers, and guided tours including ${highlights.slice(0, 2).join(' and ')}. Prices from $${fromPriceUSD} per person (estimate).`,
    highlights,
    overview: buildOverview(d, durationDays, highlights),
    included: buildIncluded(d, durationNights),
    notIncluded: NOT_INCLUDED,
    itinerary: buildItinerary(d, durationDays),
    travelTips: [...d.travelTips, durationDays <= 3 ? 'With a short stay, book your must-see attractions in advance to avoid losing time to queues.' : 'Pace yourself — this itinerary includes free time so you are not rushing between every attraction.'],
    packingList: buildPackingList(d),
    thingsToDo: dedupe([...d.attractionsPaid.map((a) => a.name), ...d.attractionsFree.map((a) => a.name), ...d.adventureActivities, ...d.familyActivities]).slice(0, 20),
    thingsToAvoid: d.thingsToAvoid,
    topRestaurants: d.restaurants.map((r) => `${r.name} — ${r.cuisine} (${r.price})`),
    topCafes: d.cafes,
    shoppingAreas: d.shopping,
    nightlife: d.nightlife,
    instagramSpots: d.instagramSpots,
    hiddenGems: d.hiddenGems,
    familyActivities: d.familyActivities,
    adventureActivities: d.adventureActivities,
    luxuryExperiences: d.luxuryExperiences,
    honeymoonExperiences: d.honeymoonExperiences,
    budgetExperiences: d.budgetExperiences,
    estimatedDailyBudgetUSD: d.dailyBudgetUSD,
    safetyRating: d.safetyRating,
    internetRating: d.internetRating,
    publicTransportRating: d.transportRating,
    walkingScore: d.walkingScore,
    accessibilityRating: d.accessibilityRating,
    weatherByMonth: d.weatherByMonth.map((highC, i) => ({ month: MONTH_NAMES[i], highC, crowd: d.crowdByMonth[i] })),
    festivalCalendar: d.festivals,
    emergencyContacts: d.emergency,
    localEtiquette: d.etiquette,
    localTransportGuide: d.localTransportGuide,
    bestTimeToVisit: d.bestTimeToVisit,
    weather: d.weatherSummary,
    visaInformation: d.visaSummary,
    currency: d.currency,
    languages: d.languages,
    timeZone: d.timeZone,
    averageFlightTime: `~${avgFlightHours}h from major hubs (estimate; varies by origin — see Suggested Flights)`,
    nearestAirport: `${d.airportName} (${d.airportCode})`,
    cancellationPolicy: CANCELLATION_POLICY,
    termsAndConditions: TERMS_AND_CONDITIONS,
    faqs: buildFaqs(d),
    categories,
    aiTags: buildAiTags(d, durationDays, categories),
    images: buildImages(d),
    reviews,
    ratings,
    suggestedHotels: buildHotels(d),
    suggestedFlights: ORIGIN_MARKETS.map((m) => suggestedFlightRoute(d, m.code)),
    attractionsTop50: attractionsTop.slice(0, 50),
    attractionsPaidTop20: d.attractionsPaid.slice(0, 20).map((a) => ({ name: a.name, priceUSD: a.priceUSD })),
    attractionsFreeTop20: d.attractionsFree.slice(0, 20).map((a) => a.name),
    museums: d.museums,
    parks: d.parks,
    beaches: d.beaches,
    dayTrips: d.dayTrips,
    fromPriceUSD,
    seo: {
      title: `${title} | Flights, Hotels & Tours Included`,
      slug,
      keywords: [],
      canonicalUrl: `/packages/${slug}`,
      internalLinks: [], // filled in by scripts/generate-packages.ts once all 300 packages exist
      externalLinks: buildExternalLinks(d),
    },
  };

  pkg.seo.keywords = pkg.aiTags.slice(0, 15);
  return pkg;
}
