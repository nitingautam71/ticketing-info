import { describe, expect, it } from 'vitest';
import { computePricing, estimateEconomyFareUSD, estimateFlightHours, haversineKm } from './pricing';
import type { DestinationFacts } from './types';

function makeDestination(overrides: Partial<DestinationFacts> = {}): DestinationFacts {
  return {
    slug: 'testville',
    name: 'Testville',
    country: 'Testland',
    countryCode: 'TL',
    region: 'Test Region',
    continent: 'Test Continent',
    lat: 48.8566,
    lon: 2.3522,
    airportCode: 'TST',
    airportName: 'Testville Airport',
    currency: 'EUR',
    languages: ['Testish'],
    timeZone: 'CET (UTC+1)',
    utcOffset: 1,
    visaSummary: 'Visa-free for most nationalities for short stays.',
    bestTimeToVisit: 'Spring and autumn.',
    weatherSummary: 'Mild year-round.',
    safetyRating: 4,
    internetRating: 4,
    transportRating: 4,
    walkingScore: 80,
    accessibilityRating: 4,
    dailyBudgetUSD: [80, 150, 280, 600],
    costIndex: 1.25,
    emergency: { police: '112', ambulance: '112', fire: '112' },
    etiquette: ['Greet with a handshake.'],
    festivals: [{ name: 'Test Festival', timing: 'June' }],
    weatherByMonth: [8, 9, 12, 15, 19, 22, 25, 25, 21, 16, 11, 8],
    crowdByMonth: ['Low', 'Low', 'Medium', 'Medium', 'High', 'Peak', 'Peak', 'Peak', 'High', 'Medium', 'Low', 'Low'],
    attractionsPaid: [
      { name: 'Test Tower', note: 'Iconic viewpoint.', priceUSD: 30 },
      { name: 'Test Museum', note: 'Local history.', priceUSD: 20 },
    ],
    attractionsFree: [{ name: 'Test Park', note: 'Green space in the center.' }],
    restaurants: [{ name: 'Test Bistro', cuisine: 'Local', price: '$$' }],
    cafes: ['Test Cafe'],
    shopping: ['Test Market'],
    nightlife: ['Test Bar District'],
    instagramSpots: ['Test Bridge'],
    hiddenGems: ['Test Alley'],
    familyActivities: ['Test Aquarium'],
    adventureActivities: ['Test Zipline'],
    luxuryExperiences: ['Test Private Tour'],
    honeymoonExperiences: ['Test Sunset Cruise'],
    budgetExperiences: ['Test Free Walking Tour'],
    museums: ['Test Museum'],
    parks: ['Test Park'],
    beaches: [],
    dayTrips: ['Test Village'],
    localTransportGuide: 'The metro covers most of the city center.',
    packingNotes: ['Comfortable shoes.'],
    travelTips: ['Book attractions in advance.'],
    thingsToAvoid: ['Unlicensed taxis.'],
    categories: ['City Break', 'Culture'],
    heroKeywords: ['Test Tower sunset'],
    ...overrides,
  };
}

describe('haversineKm', () => {
  it('is zero for identical coordinates', () => {
    expect(haversineKm(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0);
  });

  it('roughly matches the known Paris-London great-circle distance', () => {
    const km = haversineKm(48.8566, 2.3522, 51.5074, -0.1278);
    expect(km).toBeGreaterThan(330);
    expect(km).toBeLessThan(360);
  });
});

describe('estimateEconomyFareUSD / estimateFlightHours', () => {
  it('increases fare and flight time with distance', () => {
    expect(estimateEconomyFareUSD(10000)).toBeGreaterThan(estimateEconomyFareUSD(1000));
    expect(estimateFlightHours(10000)).toBeGreaterThan(estimateFlightHours(1000));
  });

  it('floors very short-hop fares rather than going near zero', () => {
    expect(estimateEconomyFareUSD(50)).toBeGreaterThanOrEqual(110);
  });
});

describe('computePricing', () => {
  const destination = makeDestination();

  it('is marked as an estimate', () => {
    const result = computePricing(destination, 7, 'US', 'couple', 'midRange');
    expect(result.isEstimate).toBe(true);
  });

  it('increases retail price monotonically across tiers for the same trip', () => {
    const tiers = ['budget', 'midRange', 'premium', 'luxury'] as const;
    const prices = tiers.map((tier) => computePricing(destination, 7, 'US', 'couple', tier).suggestedRetailPriceUSD);
    for (let i = 1; i < prices.length; i++) expect(prices[i]).toBeGreaterThan(prices[i - 1]);
  });

  it('charges a solo traveler more per person than half of a couple (single supplement)', () => {
    const solo = computePricing(destination, 7, 'US', 'solo', 'midRange').discountedPriceUSD;
    const couple = computePricing(destination, 7, 'US', 'couple', 'midRange').discountedPriceUSD;
    expect(solo).toBeGreaterThan(couple / 2);
  });

  it('gives a group of 8 a lower effective per-person rate than 8 solo travelers', () => {
    const group = computePricing(destination, 7, 'US', 'group8', 'midRange').discountedPriceUSD;
    const solo = computePricing(destination, 7, 'US', 'solo', 'midRange').discountedPriceUSD;
    expect(group / 8).toBeLessThan(solo);
  });

  it('scales the discounted price above the supplier cost and below the retail price', () => {
    const result = computePricing(destination, 7, 'US', 'couple', 'midRange');
    expect(result.discountedPriceUSD).toBeGreaterThan(result.supplierCostUSD);
    expect(result.discountedPriceUSD).toBeLessThan(result.suggestedRetailPriceUSD);
    expect(result.savingsUSD).toBe(result.suggestedRetailPriceUSD - result.discountedPriceUSD);
  });

  it('produces a longer estimated flight time for a farther origin market', () => {
    const near = computePricing(destination, 7, 'FR', 'couple', 'midRange'); // Paris hub, same coords as fixture
    const far = computePricing(destination, 7, 'AU', 'couple', 'midRange'); // Sydney hub
    expect(far.flightHoursEstimate).toBeGreaterThan(near.flightHoursEstimate);
  });

  it('throws on an unknown origin market code', () => {
    expect(() => computePricing(destination, 7, 'ZZ', 'couple', 'midRange')).toThrow();
  });
});
