import type { RentalCompany } from './types';

// Logo URLs sourced from Wikimedia Commons via the stable Special:FilePath redirect —
// every URL below was verified to resolve (HTTP 200) before being committed, the same
// pattern used for cruise-line and airline logos. Companies without a usable Commons
// asset (Ace, Fox, Routes) omit logoUrl and render the styled text-badge fallback.
//
// Company-wide reviews (20 per company) are generated deterministically by
// scripts/generate-cars.ts and written into companies.json — they are not hand-authored
// here so the entity file stays maintainable.
export type RentalCompanyFacts = Omit<RentalCompany, 'reviews'>;

export const RENTAL_COMPANIES: RentalCompanyFacts[] = [
  {
    id: 'enterprise',
    name: 'Enterprise Rent-A-Car',
    slug: 'enterprise',
    tier: 'midRange',
    commissionRate: 0.12,
    hqCountry: 'United States',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Enterprise_Rent-A-Car_Logo.svg',
    description:
      'The world\'s largest car rental company by fleet size, known for its neighborhood branch network, "We\'ll pick you up" service, and consistently strong customer satisfaction scores.',
    keySellingPoints: ['Free pick-up service at neighborhood branches', 'Largest fleet in North America', 'Strong one-way rental network'],
  },
  {
    id: 'hertz',
    name: 'Hertz',
    slug: 'hertz',
    tier: 'premium',
    commissionRate: 0.13,
    hqCountry: 'United States',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Hertz_Logo.svg',
    description:
      'One of the oldest and most recognized rental brands worldwide, operating in 160 countries with a premium fleet including the Hertz Ultimate Choice airport experience and a large EV program.',
    keySellingPoints: ['Gold Plus Rewards skip-the-counter service', 'Large Tesla and EV fleet', 'Presence at virtually every major airport'],
  },
  {
    id: 'avis',
    name: 'Avis',
    slug: 'avis',
    tier: 'premium',
    commissionRate: 0.13,
    hqCountry: 'United States',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Avis_logo.svg',
    description:
      'A premium global brand famous for the "We try harder" ethos, strong business-travel offerings, and the Avis Preferred loyalty program with counter-free pickup at major airports.',
    keySellingPoints: ['Avis Preferred counter-free pickup', 'Strong corporate/business rental programs', 'Wide luxury and premium selection'],
  },
  {
    id: 'budget',
    name: 'Budget',
    slug: 'budget',
    tier: 'budget',
    commissionRate: 0.11,
    hqCountry: 'United States',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Budget_logo.svg',
    description:
      'Avis Budget Group\'s value brand — reliable airport and city rentals at consistently lower rates, popular with leisure travelers and road-trippers across the Americas and Europe.',
    keySellingPoints: ['Consistently among the lowest big-brand rates', 'Shares Avis\'s airport infrastructure', 'Frequent weekend and weekly deals'],
  },
  {
    id: 'sixt',
    name: 'Sixt',
    slug: 'sixt',
    tier: 'premium',
    commissionRate: 0.14,
    hqCountry: 'Germany',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Sixt-Logo.svg',
    description:
      'Germany\'s premium mobility group with a famously young, high-spec fleet — heavy on BMW, Mercedes-Benz, and Audi — and fast-growing airport coverage across Europe, North America, and the Gulf.',
    keySellingPoints: ['Youngest premium fleet in the industry', 'Strong BMW/Mercedes/Audi availability', 'Sleek app-based pickup and return'],
  },
  {
    id: 'europcar',
    name: 'Europcar',
    slug: 'europcar',
    tier: 'midRange',
    commissionRate: 0.12,
    hqCountry: 'France',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Europcar-Logo.svg',
    description:
      'Europe\'s largest home-grown rental network, with deep coverage of European cities, rail stations, and airports plus a growing van and truck division for movers and trades.',
    keySellingPoints: ['Deepest rail-station network in Europe', 'Strong van & truck rental division', 'Broad cross-border one-way options in the EU'],
  },
  {
    id: 'national',
    name: 'National Car Rental',
    slug: 'national',
    tier: 'premium',
    commissionRate: 0.13,
    hqCountry: 'United States',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/National-Car-Rental-Logo.svg',
    description:
      'Enterprise Holdings\' business-travel brand, beloved by frequent flyers for the Emerald Aisle — walk to the aisle, pick any car, and go, no counter required.',
    keySellingPoints: ['Emerald Aisle: choose any car, skip the counter', 'Business-travel focused service', 'Fast airport exit lanes'],
  },
  {
    id: 'alamo',
    name: 'Alamo',
    slug: 'alamo',
    tier: 'budget',
    commissionRate: 0.11,
    hqCountry: 'United States',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Alamo_Rent_a_Car_(logo).svg',
    description:
      'Enterprise Holdings\' leisure value brand — self-service kiosks, online check-in, and family-friendly rates at major airports across North America and holiday destinations worldwide.',
    keySellingPoints: ['Online check-in and skip-the-counter kiosks', 'Family-holiday friendly pricing', 'Strong presence at leisure destinations'],
  },
  {
    id: 'dollar',
    name: 'Dollar Rent A Car',
    slug: 'dollar',
    tier: 'budget',
    commissionRate: 0.11,
    hqCountry: 'United States',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Dollar_Car_Rental_Logo.gif',
    description:
      'Hertz Group\'s value brand offering dependable airport rentals with straightforward pricing, aimed squarely at budget-conscious leisure travelers.',
    keySellingPoints: ['Simple, transparent value pricing', 'Hertz-backed airport coverage', 'Good midsize and family car availability'],
  },
  {
    id: 'thrifty',
    name: 'Thrifty Car Rental',
    slug: 'thrifty',
    tier: 'budget',
    commissionRate: 0.11,
    hqCountry: 'United States',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Thrifty_Car_Rental_logo.svg',
    description:
      'A long-running budget brand under the Hertz umbrella, popular for cheap weekly rates and holiday rentals across the US, Europe, and Australia/New Zealand.',
    keySellingPoints: ['Aggressive weekly and holiday rates', 'Blue Chip express pickup program', 'Broad ANZ and Europe leisure network'],
  },
  {
    id: 'ace',
    name: 'Ace Rent A Car',
    slug: 'ace',
    tier: 'budget',
    commissionRate: 0.1,
    hqCountry: 'United States',
    description:
      'An independent US-based discount operator with franchised locations near major airports, undercutting the big brands with no-frills service and off-airport shuttle lots.',
    keySellingPoints: ['Among the cheapest airport-area rates', 'No-frills, straightforward rentals', 'Franchise network across the US and beyond'],
  },
  {
    id: 'fox',
    name: 'Fox Rent A Car',
    slug: 'fox',
    tier: 'budget',
    commissionRate: 0.1,
    hqCountry: 'United States',
    description:
      'A deep-discount operator at major US west-coast and sunbelt airports, popular with price-first travelers willing to take a shuttle to an off-airport lot for the lowest rate.',
    keySellingPoints: ['Consistently rock-bottom airport rates', 'Large economy and compact inventory', 'Frequent long-rental discounts'],
  },
  {
    id: 'payless',
    name: 'Payless',
    slug: 'payless',
    tier: 'budget',
    commissionRate: 0.1,
    hqCountry: 'United States',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Payless_Car_Rental_logo.svg',
    description:
      'Avis Budget Group\'s deep-value brand — basic, reliable cars at the lowest prices in the group\'s airport portfolio, for travelers who just need wheels.',
    keySellingPoints: ['Lowest rates in the Avis Budget family', 'Simple bookings, no upsell pressure', 'Solid economy fleet at busy airports'],
  },
  {
    id: 'green-motion',
    name: 'Green Motion',
    slug: 'green-motion',
    tier: 'budget',
    commissionRate: 0.12,
    hqCountry: 'United Kingdom',
    logoUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Green_Motion_Logo.jpg',
    description:
      'A UK-founded franchise focused on lower-emission rentals — hybrid and electric-heavy fleets across Europe, the Americas, and beyond, marketed to eco-conscious travelers.',
    keySellingPoints: ['Hybrid/EV-first fleet policy', 'Carbon-conscious rental programs', 'Fast-growing global franchise network'],
  },
  {
    id: 'routes',
    name: 'Routes Car Rental',
    slug: 'routes',
    tier: 'budget',
    commissionRate: 0.1,
    hqCountry: 'Canada',
    description:
      'A Canadian-founded discount operator expanding across North American airports, competing on price with lean off-airport locations and long-rental value.',
    keySellingPoints: ['Strong Canadian airport coverage', 'Competitive monthly/long-term rates', 'Lean, price-first operations'],
  },
];

export const RENTAL_COMPANIES_BY_ID: Record<string, RentalCompanyFacts> = Object.fromEntries(
  RENTAL_COMPANIES.map((c) => [c.id, c])
);
