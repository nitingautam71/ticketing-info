import type { RailPass } from './types';

export const RAIL_PASSES: RailPass[] = [
  {
    slug: 'usa-rail-pass',
    name: 'USA Rail Pass',
    operator: 'Amtrak',
    country: 'US',
    price: 'from $499',
    validity: '10 segments within 30 days',
    coverage: 'Coach seats on almost every Amtrak route nationwide (Acela, Auto Train and sleepers excluded; upgrades payable).',
    bestFor: 'Multi-city US itineraries — e.g. New York → Chicago → Denver → San Francisco → Los Angeles on one pass.',
    howToBuy: 'Sold by Amtrak with occasional flash sales; our rail desk plans segment-efficient routings and books each leg.',
    available: true,
  },
  {
    slug: 'california-rail-pass',
    name: 'California Rail Pass',
    operator: 'Amtrak California',
    country: 'US',
    price: 'from $159',
    validity: '7 travel days within 21 days',
    coverage: 'Pacific Surfliner, Capitol Corridor, San Joaquins and connecting thruway buses across California.',
    bestFor: 'Coastal + valley loops: San Diego, LA, Santa Barbara, Bay Area, Sacramento and Yosemite gateway towns.',
    howToBuy: 'Bookable through Amtrak California channels; we build the day-by-day plan around validity rules.',
    available: true,
  },
  {
    slug: 'amtrak-multi-ride',
    name: 'Amtrak Multi-Ride & Monthly Passes',
    operator: 'Amtrak',
    country: 'US',
    price: 'Route-dependent (10-ride & monthly)',
    validity: '10-ride tickets (45–180 days) or monthly unlimited on a corridor',
    coverage: 'Northeast Regional, Keystone, Pacific Surfliner, Capitol Corridor, San Joaquins and other state corridors.',
    bestFor: 'Regular commuters and frequent point-to-point travellers on a single corridor — cheaper per trip than walk-up fares.',
    howToBuy: 'Sold by Amtrak per route; our rail desk runs the break-even math against single tickets.',
    available: true,
  },
  {
    slug: 'via-rail-canrailpass',
    name: 'VIA Rail Canrailpass (future)',
    operator: 'VIA Rail Canada',
    country: 'CA',
    price: 'from C$799',
    validity: '7 one-way trips within 60 days (System pass)',
    coverage: 'Cross-border onward travel into Canada from Amtrak’s Maple Leaf and Adirondack routes — a future integration.',
    bestFor: 'Travellers continuing beyond the US border to Toronto, Montreal and beyond once cross-border booking is live.',
    howToBuy: 'Not yet bookable on the platform — listed as a preview of the planned VIA Rail expansion.',
    available: false,
  },
];

export function passBySlug(slug: string): RailPass | undefined {
  return RAIL_PASSES.find((p) => p.slug === slug);
}
