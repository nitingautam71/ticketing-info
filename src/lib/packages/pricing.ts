import type { DestinationFacts, PricingBreakdown, PricingTier, SuggestedFlightRoute, TravelerType } from './types';
import { AIRLINES_BY_MARKET, ORIGIN_MARKETS_BY_CODE } from './markets';

// Dynamic regional pricing engine.
//
// No live fare/rate API is wired up yet, so every number here is a clearly-labeled
// ESTIMATE derived from a deterministic formula: great-circle distance (haversine)
// drives an approximate flight time + economy airfare, and each destination's
// curated `dailyBudgetUSD` (see destinations-a/b.ts) drives the land package cost.
// Nothing is pre-computed into static package JSON — computePricing() runs on
// demand for any (destination, duration, origin market, traveler type, tier)
// combination, exactly the shape a live GDS/NDC + hotel-rate integration would
// take: swap the two `*Fare*`/`landPerAdultPerDay` calculations below for real
// API calls and every caller (API routes, package pages) keeps working unchanged.

const TIER_INDEX: Record<PricingTier, 0 | 1 | 2 | 3> = { budget: 0, midRange: 1, premium: 2, luxury: 3 };
const CABIN_MULTIPLIER: Record<PricingTier, number> = { budget: 0.95, midRange: 1, premium: 1.65, luxury: 3.4 };
const MARKUP_RATE: Record<PricingTier, number> = { budget: 0.18, midRange: 0.24, premium: 0.3, luxury: 0.38 };
const DISCOUNT_RATE: Record<PricingTier, number> = { budget: 0.12, midRange: 0.1, premium: 0.08, luxury: 0.06 };

const TAX_RATE = 0.08;
const OTA_FEE_RATE = 0.05;
const COMMISSION_RATE = 0.1;
const CHILD_AIRFARE_FACTOR = 0.75;
const CHILD_LAND_FACTOR = 0.65;
const GROUP_LAND_DISCOUNT = 0.9;
const GROUP_AIRFARE_DISCOUNT = 0.96;
const SOLO_HOTEL_SUPPLEMENT = 1.65;
const FAMILY_HOTEL_UPLIFT = 1.12;

interface PartyComposition {
  adults: number;
  children: number;
  partySize: number;
}

const PARTY_BY_TRAVELER_TYPE: Record<TravelerType, PartyComposition> = {
  solo: { adults: 1, children: 0, partySize: 1 },
  couple: { adults: 2, children: 0, partySize: 2 },
  family4: { adults: 2, children: 2, partySize: 4 },
  group8: { adults: 8, children: 0, partySize: 8 },
};

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function estimateFlightHours(distanceKm: number): number {
  const routingKm = distanceKm * 1.15; // indirect routing / airway buffer
  const hours = routingKm / 850 + 0.75; // cruise speed + taxi/climb/descent buffer
  return Math.round(hours * 10) / 10;
}

/** Economy round-trip airfare estimate in USD from great-circle distance. */
export function estimateEconomyFareUSD(distanceKm: number): number {
  const raw = 90 + 0.085 * distanceKm;
  return Math.round(Math.max(110, Math.min(2200, raw)));
}

/** Rounds a converted local-currency amount to a sensible denomination for its magnitude. */
function roundLocal(amount: number): number {
  if (amount >= 100_000) return Math.round(amount / 1000) * 1000;
  if (amount >= 1_000) return Math.round(amount / 10) * 10;
  return Math.round(amount);
}

export function computePricing(
  destination: DestinationFacts,
  durationDays: number,
  originMarketCode: string,
  travelerType: TravelerType,
  tier: PricingTier,
): PricingBreakdown {
  const market = ORIGIN_MARKETS_BY_CODE[originMarketCode];
  if (!market) throw new Error(`Unknown origin market: ${originMarketCode}`);

  const distanceKm = Math.round(haversineKm(market.lat, market.lon, destination.lat, destination.lon));
  const flightHoursEstimate = estimateFlightHours(distanceKm);
  const baseFare = estimateEconomyFareUSD(distanceKm);
  const adultAirfare = baseFare * CABIN_MULTIPLIER[tier];
  const childAirfare = adultAirfare * CHILD_AIRFARE_FACTOR;

  const { adults, children, partySize } = PARTY_BY_TRAVELER_TYPE[travelerType];
  const landPerAdultPerDay = destination.dailyBudgetUSD[TIER_INDEX[tier]];
  const landPerChildPerDay = landPerAdultPerDay * CHILD_LAND_FACTOR;

  let landTotal = landPerAdultPerDay * adults * durationDays + landPerChildPerDay * children * durationDays;
  let airfareTotal = adultAirfare * adults + childAirfare * children;
  if (travelerType === 'group8') {
    landTotal *= GROUP_LAND_DISCOUNT;
    airfareTotal *= GROUP_AIRFARE_DISCOUNT;
  }

  let hotel = landTotal * 0.46;
  const breakfast = landTotal * 0.09;
  const dailyTransport = landTotal * 0.14;
  const tours = landTotal * 0.2;
  const activities = landTotal * 0.11;

  if (travelerType === 'solo') hotel *= SOLO_HOTEL_SUPPLEMENT;
  if (travelerType === 'family4') hotel *= FAMILY_HOTEL_UPLIFT;

  // Shared vehicle transfer: first traveler sets the base cost, each additional
  // traveler in the same party adds only a marginal share (bigger car/van, not a new car).
  const transfers = Math.round(landPerAdultPerDay * 0.5 * (1 + 0.35 * (partySize - 1)));

  const costUSD = {
    airfare: Math.round(airfareTotal),
    hotel: Math.round(hotel),
    transfers,
    breakfast: Math.round(breakfast),
    dailyTransport: Math.round(dailyTransport),
    tours: Math.round(tours),
    activities: Math.round(activities),
  };

  const supplierCostUSD = Object.values(costUSD).reduce((a, b) => a + b, 0);
  const taxesAndFeesUSD = Math.round(supplierCostUSD * TAX_RATE);
  const otaServiceFeeUSD = Math.round(supplierCostUSD * OTA_FEE_RATE);
  const suggestedRetailPriceUSD = Math.round((supplierCostUSD + taxesAndFeesUSD + otaServiceFeeUSD) * (1 + MARKUP_RATE[tier]));
  const discountPct = DISCOUNT_RATE[tier];
  const discountedPriceUSD = Math.round(suggestedRetailPriceUSD * (1 - discountPct));
  const savingsUSD = suggestedRetailPriceUSD - discountedPriceUSD;
  const commissionUSD = Math.round(discountedPriceUSD * COMMISSION_RATE);
  const markupPct = Math.round(((suggestedRetailPriceUSD - supplierCostUSD) / supplierCostUSD) * 1000) / 1000;
  const profitMarginPct = Math.round(((discountedPriceUSD - supplierCostUSD - commissionUSD) / discountedPriceUSD) * 1000) / 1000;

  return {
    originMarket: originMarketCode,
    travelerType,
    tier,
    partySize,
    currency: market.currency,
    usdRate: market.usdRate,
    distanceKm,
    flightHoursEstimate,
    costUSD,
    supplierCostUSD,
    taxesAndFeesUSD,
    otaServiceFeeUSD,
    suggestedRetailPriceUSD,
    discountPct,
    discountedPriceUSD,
    savingsUSD,
    commissionUSD,
    markupPct,
    profitMarginPct,
    suggestedRetailPriceLocal: roundLocal(suggestedRetailPriceUSD * market.usdRate),
    discountedPriceLocal: roundLocal(discountedPriceUSD * market.usdRate),
    savingsLocal: roundLocal(savingsUSD * market.usdRate),
    isEstimate: true,
  };
}

export function suggestedFlightRoute(destination: DestinationFacts, originMarketCode: string): SuggestedFlightRoute {
  const market = ORIGIN_MARKETS_BY_CODE[originMarketCode];
  const distanceKm = haversineKm(market.lat, market.lon, destination.lat, destination.lon);
  const fare = estimateEconomyFareUSD(Math.round(distanceKm));
  return {
    originMarket: originMarketCode,
    originAirport: `${market.hubCity} (major international gateway)`,
    destinationAirport: `${destination.airportName} (${destination.airportCode})`,
    airlines: AIRLINES_BY_MARKET[originMarketCode] ?? [],
    estimatedRoundTripUSD: [Math.round(fare * 0.85), Math.round(fare * 1.35)],
    estimatedFlightHours: estimateFlightHours(Math.round(distanceKm)),
    isEstimate: true,
  };
}
