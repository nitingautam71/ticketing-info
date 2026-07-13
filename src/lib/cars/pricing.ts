import type { RentalCompanyFacts } from './companies';
import type { VehicleModel, RentalLocation, RentalDurationTier, CarPricingBreakdown, CarPricingLineItems } from './types';
import { ORIGIN_MARKETS_BY_CODE } from '../packages/markets';

// Live car rental pricing engine — mirrors src/lib/cruises/pricing.ts. All figures are
// clearly-labeled ESTIMATES (isEstimate: true) built from a deterministic formula:
// category baseline x vehicle priceIndex x location costIndex x company tier factor x
// duration-tier economics, plus itemized fees. Swap this module for live rate feeds
// (CarTrawler, Amadeus Cars, Booking.com Mobility) when those are contracted — nothing
// downstream needs to change shape.

/** Baseline economy-car daily rate in USD at a costIndex-1.0 location. */
const BASE_DAILY_USD = 42;

const TIER_FACTOR: Record<'budget' | 'midRange' | 'premium', number> = {
  budget: 0.85,
  midRange: 1.0,
  premium: 1.2,
};

/** Duration economics: billable units and an effective per-day discount vs. the daily rate. */
const DURATION_CONFIG: Record<RentalDurationTier, { units: number; unitLabel: 'hours' | 'days'; perDayFactor: number }> = {
  hourly: { units: 4, unitLabel: 'hours', perDayFactor: 0.22 }, // 4-hour block at ~22% of day rate per hour block
  halfDay: { units: 1, unitLabel: 'days', perDayFactor: 0.65 },
  daily: { units: 1, unitLabel: 'days', perDayFactor: 1.0 },
  weekend: { units: 3, unitLabel: 'days', perDayFactor: 0.92 },
  weekly: { units: 7, unitLabel: 'days', perDayFactor: 0.82 },
  monthly: { units: 30, unitLabel: 'days', perDayFactor: 0.62 },
  longTerm: { units: 90, unitLabel: 'days', perDayFactor: 0.5 },
};

export interface CarPricingOptions {
  /** Renter age bracket surcharges. */
  driverAge?: 'young' | 'standard' | 'senior';
  additionalDriver?: boolean;
  oneWay?: boolean;
  gps?: boolean;
  wifi?: boolean;
  childSeat?: boolean;
  snowChains?: boolean;
  fuelPackage?: boolean;
  premiumInsurance?: boolean;
  /** 1-12; drives seasonal multipliers (peak summer/holiday pricing). */
  travelMonth?: number;
}

function seasonMultiplierFor(month: number | undefined, locationRegion: string): number {
  if (!month) return 1.0;
  // Peak: NH summer (Jun-Aug) and Christmas/New Year, inverted for Oceania/South America.
  const southern = locationRegion === 'oceania' || locationRegion === 'south-america';
  const peakMonths = southern ? [12, 1, 2] : [6, 7, 8];
  const holidayMonths = [12];
  if (holidayMonths.includes(month)) return 1.25;
  if (peakMonths.includes(month)) return 1.2;
  if ([4, 5, 9, 10].includes(month)) return 1.05;
  return 1.0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computeCarPricing(
  company: RentalCompanyFacts,
  vehicle: VehicleModel,
  location: RentalLocation,
  originMarketCode: string,
  durationTier: RentalDurationTier,
  options: CarPricingOptions = {}
): CarPricingBreakdown {
  const market = ORIGIN_MARKETS_BY_CODE[originMarketCode];
  if (!market) {
    throw new Error(`Unknown origin market: ${originMarketCode}`);
  }

  const cfg = DURATION_CONFIG[durationTier];
  const seasonMultiplier = seasonMultiplierFor(options.travelMonth, location.region);

  const effectiveDayRate = BASE_DAILY_USD * vehicle.priceIndex * location.costIndex * TIER_FACTOR[company.tier] * cfg.perDayFactor * seasonMultiplier;
  const billableDays = cfg.unitLabel === 'hours' ? 1 : cfg.units;
  const basePriceUSD = cfg.unitLabel === 'hours' ? effectiveDayRate * cfg.units : effectiveDayRate * cfg.units;

  const airportFeeUSD = location.type === 'airport' ? basePriceUSD * 0.11 : 0;
  const oneWayFeeUSD = options.oneWay && location.oneWaySupported ? Math.min(250, 45 + basePriceUSD * 0.08) : 0;
  const youngDriverFeePerDayUSD = options.driverAge === 'young' ? 28 : 0;
  const seniorFeePerDayUSD = options.driverAge === 'senior' ? 8 : 0;
  const additionalDriverPerDayUSD = options.additionalDriver ? 12 : 0;

  const basicInsuranceUSD = basePriceUSD * 0.14; // always included in retail price
  const collisionDamageWaiverUSD = options.premiumInsurance ? billableDays * 22 : 0;
  const roadsideAssistanceUSD = options.premiumInsurance ? billableDays * 6 : 0;

  const gpsAddonUSD = options.gps && !vehicle.features.gps ? billableDays * 9 : 0;
  const wifiAddonUSD = options.wifi && !vehicle.features.wifi ? billableDays * 10 : 0;
  const childSeatAddonUSD = options.childSeat ? billableDays * 8 : 0;
  const snowChainsAddonUSD = options.snowChains ? 25 : 0;
  const fuelPackageUSD = options.fuelPackage && vehicle.fuelType !== 'Electric' ? 65 * location.costIndex : 0;
  const cleaningFeeUSD = vehicle.category === 'Motorhome / RV' ? 85 : 0;

  const perDayFees = (youngDriverFeePerDayUSD + seniorFeePerDayUSD + additionalDriverPerDayUSD) * billableDays;
  const taxableUSD = basePriceUSD + airportFeeUSD + oneWayFeeUSD + perDayFees + basicInsuranceUSD + collisionDamageWaiverUSD + roadsideAssistanceUSD + gpsAddonUSD + wifiAddonUSD + childSeatAddonUSD + snowChainsAddonUSD + fuelPackageUSD + cleaningFeeUSD;
  const taxesUSD = taxableUSD * 0.12;

  const subtotalUSD = taxableUSD + taxesUSD;
  const otaServiceFeeUSD = subtotalUSD * 0.03;
  const commissionUSD = subtotalUSD * company.commissionRate;
  const markupUSD = subtotalUSD * 0.06;

  const suggestedRetailPriceUSD = subtotalUSD + otaServiceFeeUSD + commissionUSD + markupUSD;
  const discountedPriceUSD = suggestedRetailPriceUSD * 0.88; // standard OTA promotional discount
  const savingsUSD = suggestedRetailPriceUSD - discountedPriceUSD;
  const profitUSD = otaServiceFeeUSD + markupUSD + commissionUSD - savingsUSD;
  const profitMarginPercent = Math.round((profitUSD / discountedPriceUSD) * 1000) / 10;

  const lineItems: CarPricingLineItems = {
    basePriceUSD: round2(basePriceUSD),
    taxesUSD: round2(taxesUSD),
    airportFeeUSD: round2(airportFeeUSD),
    oneWayFeeUSD: round2(oneWayFeeUSD),
    youngDriverFeePerDayUSD,
    seniorFeePerDayUSD,
    additionalDriverPerDayUSD,
    basicInsuranceUSD: round2(basicInsuranceUSD),
    collisionDamageWaiverUSD: round2(collisionDamageWaiverUSD),
    roadsideAssistanceUSD: round2(roadsideAssistanceUSD),
    gpsAddonUSD: round2(gpsAddonUSD),
    wifiAddonUSD: round2(wifiAddonUSD),
    childSeatAddonUSD: round2(childSeatAddonUSD),
    snowChainsAddonUSD,
    fuelPackageUSD: round2(fuelPackageUSD),
    cleaningFeeUSD,
    otaServiceFeeUSD: round2(otaServiceFeeUSD),
    commissionUSD: round2(commissionUSD),
    markupUSD: round2(markupUSD),
  };

  return {
    originMarket: market.code,
    durationTier,
    units: cfg.units,
    currency: market.currency,
    usdRate: market.usdRate,
    seasonMultiplier,
    lineItems,
    suggestedRetailPriceUSD: round2(suggestedRetailPriceUSD),
    discountedPriceUSD: round2(discountedPriceUSD),
    savingsUSD: round2(savingsUSD),
    profitMarginPercent,
    suggestedRetailPriceLocal: Math.round(suggestedRetailPriceUSD * market.usdRate),
    discountedPriceLocal: Math.round(discountedPriceUSD * market.usdRate),
    savingsLocal: Math.round(savingsUSD * market.usdRate),
    isEstimate: true,
  };
}
