import type { CruisePackage, CruisePricingBreakdown, CabinPricing, CabinType, CruiseTravelerType, CruisePricingTier, CruiseLine, Ship } from './types';
import { ORIGIN_MARKETS_BY_CODE } from '../packages/markets';
import { haversineKm, estimateEconomyFareUSD, estimateFlightHours } from '../packages/pricing';

// Configuration constants for pricing math
const CABIN_BASE_MULTIPLIER: Record<CabinType, number> = {
  'Interior Cabin': 1.0,
  'Ocean View': 1.25,
  'Balcony Cabin': 1.6,
  'Junior Suite': 2.1,
  'Suite': 2.8,
  'Accessible Cabin': 1.1,
  'Solo Cabin': 0.85, // single supplement handled elsewhere
  'Family Cabin': 1.95,
  'Luxury Suite': 4.2,
  'Owner\'s Suite': 6.5
};

const TIER_RATE: Record<CruisePricingTier, number> = {
  budget: 95,      // Base fare per adult per night
  midRange: 160,
  premium: 320,
  luxury: 750
};

const TRAVELER_MULTIPLIERS: Record<CruiseTravelerType, { adults: number; kids: number; hotelRooms: number; multiplier: number }> = {
  solo: { adults: 1, kids: 0, hotelRooms: 1, multiplier: 1.65 }, // Single supplement for cabin
  couple: { adults: 2, kids: 0, hotelRooms: 1, multiplier: 2.0 },
  family4: { adults: 2, kids: 2, hotelRooms: 1, multiplier: 3.3 }, // Kids pay discounted cruise fare
  largeFamily: { adults: 4, kids: 2, hotelRooms: 2, multiplier: 5.1 },
  group: { adults: 8, kids: 0, hotelRooms: 4, multiplier: 7.2 }, // Group discount applied
  senior: { adults: 2, kids: 0, hotelRooms: 1, multiplier: 1.9 }, // Senior discount
  honeymoon: { adults: 2, kids: 0, hotelRooms: 1, multiplier: 2.1 }, // Honeymoon perks added
  luxuryTraveler: { adults: 2, kids: 0, hotelRooms: 1, multiplier: 2.4 } // Upgraded default hotels/transfers
};

export function computeCruisePricing(
  cruiseLine: CruiseLine,
  ship: Ship,
  destination: string,
  durationNights: number,
  embarkationPortLat: number,
  embarkationPortLon: number,
  originMarketCode: string,
  travelerType: CruiseTravelerType,
  tier: CruisePricingTier
): CruisePricingBreakdown {
  const market = ORIGIN_MARKETS_BY_CODE[originMarketCode];
  if (!market) {
    throw new Error(`Unknown origin market: ${originMarketCode}`);
  }

  // Calculate distance & airfare to the embarkation port
  const distanceKm = Math.round(haversineKm(market.lat, market.lon, embarkationPortLat, embarkationPortLon));
  const flightHoursEstimate = estimateFlightHours(distanceKm);
  const baseFlightFare = estimateEconomyFareUSD(distanceKm);

  const travelersInfo = TRAVELER_MULTIPLIERS[travelerType];
  const partySize = travelersInfo.adults + travelersInfo.kids;

  // Cruise line specifics (e.g. ultra luxury lines are all-inclusive)
  const isLuxuryLine = cruiseLine.luxuryLevel === 'luxury';
  const drinksDefaultIncluded = cruiseLine.keySellingPoints.some(k => k.toLowerCase().includes('drinks included')) || isLuxuryLine;
  const wifiDefaultIncluded = cruiseLine.keySellingPoints.some(k => k.toLowerCase().includes('wi-fi included')) || isLuxuryLine;
  const excursionsDefaultIncluded = cruiseLine.keySellingPoints.some(k => k.toLowerCase().includes('excursions included')) || isLuxuryLine;
  const gratuitiesDefaultIncluded = isLuxuryLine;

  // Compile pricing for each cabin type
  const cabinPricing = {} as Record<CabinType, CabinPricing>;
  const cabinTypes: CabinType[] = [
    'Interior Cabin',
    'Ocean View',
    'Balcony Cabin',
    'Junior Suite',
    'Suite',
    'Luxury Suite',
    'Owner\'s Suite',
    'Family Cabin',
    'Accessible Cabin',
    'Solo Cabin'
  ];

  for (const cabin of cabinTypes) {
    // 1. Cruise fare calculation
    const baseCabinMultiplier = CABIN_BASE_MULTIPLIER[cabin];
    const baseDailyRate = TIER_RATE[tier] * baseCabinMultiplier;
    
    // Total cruise fare for the whole party
    let totalFareUSD = baseDailyRate * durationNights * travelersInfo.multiplier;
    
    // Adjustments for river or luxury cruises
    if (cruiseLine.riverCruise) {
      totalFareUSD *= 1.25; // River cruises are typically premium priced
    }
    if (isLuxuryLine) {
      totalFareUSD *= 1.5; // Luxury lines incorporate more amenities
    }

    // 2. Port Taxes & Fees
    const portFeesPerPerson = 45 + (durationNights * 8);
    const portTaxesUSD = Math.round(portFeesPerPerson * partySize * 0.45);
    const portFeesUSD = Math.round(portFeesPerPerson * partySize * 0.55);
    const govTaxesUSD = Math.round((totalFareUSD * 0.065));

    // 3. Gratuities
    const dailyGratuityPerPerson = isLuxuryLine ? 0 : (tier === 'luxury' || cabin.includes('Suite') ? 18.5 : 16.0);
    const gratuitiesUSD = gratuitiesDefaultIncluded ? 0 : Math.round(dailyGratuityPerPerson * durationNights * partySize);

    // 4. Travel Insurance Estimate
    const travelInsuranceEstimateUSD = Math.round((totalFareUSD + portTaxesUSD + govTaxesUSD) * 0.075);

    // 5. Pre-cruise Hotel (Optional, default included in total package for midRange+)
    const hotelRatePerNight = tier === 'luxury' ? 450 : (tier === 'premium' ? 260 : 130);
    const hotelBeforeCruiseUSD = Math.round(hotelRatePerNight * travelersInfo.hotelRooms);

    // 6. Transfers (airport-to-port and back)
    const transferCostPerPerson = tier === 'luxury' ? 85 : 45;
    const transfersUSD = Math.round(transferCostPerPerson * partySize);

    // 7. Excursions cost estimate (assume 2 paid excursions per traveler on average, unless included)
    const excursionCostPerPerson = tier === 'luxury' ? 250 : (tier === 'premium' ? 140 : 80);
    const excursionsCostEstimateUSD = excursionsDefaultIncluded ? 0 : Math.round(excursionCostPerPerson * 2 * partySize);

    // 8. Onboard packages (Drinks, Wifi, Dining)
    const drinkPkgDaily = tier === 'luxury' ? 0 : (tier === 'premium' ? 79 : 59);
    const drinkPackageUSD = drinksDefaultIncluded ? 0 : Math.round(drinkPkgDaily * durationNights * partySize);

    const wifiPkgDaily = tier === 'luxury' ? 0 : 20;
    const wifiPackageUSD = wifiDefaultIncluded ? 0 : Math.round(wifiPkgDaily * durationNights * Math.max(1, Math.round(partySize / 2))); // share connections

    const diningPkgDaily = tier === 'luxury' ? 0 : (tier === 'premium' ? 35 : 18);
    const diningPackageUSD = Math.round(diningPkgDaily * (durationNights / 2) * partySize); // specialty dining a few nights

    // 9. OTA Service Fee, Commission, Markups
    const supplierCostUSD = totalFareUSD + portTaxesUSD + govTaxesUSD + gratuitiesUSD + portFeesUSD + travelInsuranceEstimateUSD;
    const otaServiceFeeUSD = Math.round(supplierCostUSD * 0.05);
    const commissionPct = cruiseLine.commissionRate;
    const commissionUSD = Math.round((totalFareUSD + portFeesUSD) * commissionPct);

    // Markup is added to optional components and fare
    const markupPct = tier === 'luxury' ? 0.28 : (tier === 'premium' ? 0.22 : 0.16);
    const markupUSD = Math.round(supplierCostUSD * markupPct);

    const suggestedRetailPriceUSD = supplierCostUSD + otaServiceFeeUSD + markupUSD;
    const discountPct = tier === 'luxury' ? 0.05 : (tier === 'premium' ? 0.08 : 0.12);
    const discountedPriceUSD = Math.round(suggestedRetailPriceUSD * (1 - discountPct));
    const savingsUSD = suggestedRetailPriceUSD - discountedPriceUSD;
    
    // Profit margin calculation: (discountedPrice - supplierCost + commission) / discountedPrice
    const netProfitUSD = (discountedPriceUSD - supplierCostUSD) + commissionUSD;
    const profitMarginPercent = Math.round((netProfitUSD / discountedPriceUSD) * 1000) / 10;

    // Local currency conversions
    const suggestedRetailPriceLocal = Math.round(suggestedRetailPriceUSD * market.usdRate);
    const discountedPriceLocal = Math.round(discountedPriceUSD * market.usdRate);
    const savingsLocal = Math.round(savingsUSD * market.usdRate);

    cabinPricing[cabin] = {
      cabinType: cabin,
      baseFareUSD: Math.round(totalFareUSD / partySize), // average per person
      portTaxesUSD,
      govTaxesUSD,
      gratuitiesUSD,
      portFeesUSD,
      travelInsuranceEstimateUSD,
      hotelBeforeCruiseUSD,
      transfersUSD,
      excursionsCostEstimateUSD,
      drinkPackageUSD,
      wifiPackageUSD,
      diningPackageUSD,
      otaServiceFeeUSD,
      commissionUSD,
      markupUSD,
      suggestedRetailPriceUSD,
      discountedPriceUSD,
      savingsUSD,
      profitMarginPercent,
      suggestedRetailPriceLocal,
      discountedPriceLocal,
      savingsLocal
    };
  }

  // Calculate flight cost (round-trip for all passengers, if international/far)
  let flightCostUSD = 0;
  if (distanceKm > 200) {
    flightCostUSD = baseFlightFare * partySize;
  }

  return {
    originMarket: originMarketCode,
    travelerType,
    tier,
    partySize,
    currency: market.currency,
    usdRate: market.usdRate,
    flightCostUSD: Math.round(flightCostUSD),
    flightHoursEstimate,
    cabinPricing,
    isEstimate: true
  };
}
