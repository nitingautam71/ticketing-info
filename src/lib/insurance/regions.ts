import { countryByCode } from '@/lib/visas/countries';
import type { CoverageRegion, PlanMarket } from './types';

/** Schengen area ISO2 codes (29 members, incl. Bulgaria & Romania since 2025). */
export const SCHENGEN_CODES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IT',
  'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'CH',
]);

/** Destinations where proof of travel medical insurance is a visa/entry
 * requirement for at least a major traveller segment. Keys are ISO2. */
export const MANDATORY_INSURANCE: Record<string, string> = {
  // Schengen entries are generated below — €30,000 medical cover is a visa condition.
  CU: 'Cuba requires proof of travel medical insurance for entry; policies from US insurers may not be accepted — check before departure.',
  AE: 'The UAE requires medical insurance for most visa types; visit visas normally bundle basic cover, but it is minimal — comprehensive travel cover is strongly advised.',
  TR: 'Türkiye requires travel medical insurance for visa applicants; e-visa travellers are strongly advised to carry cover for private hospital costs.',
  RU: 'Russia requires medical insurance valid for the full stay for most visa applications.',
  EC: 'Ecuador requires proof of health insurance for stays in the Galápagos Islands and recommends it nationwide.',
  AR: 'Argentina requires proof of medical coverage for some entry categories and it is checked for long stays.',
  SA: 'Saudi Arabia bundles mandatory basic insurance into eVisas and requires cover for Hajj/Umrah pilgrims.',
  TH: 'Thailand requires health insurance for certain long-stay visas (O-A/O-X retirement) and recommends it for all visitors.',
  NP: 'Nepal requires insurance covering high-altitude evacuation for trekking permits on most routes.',
  AQ: 'Antarctica operators require comprehensive evacuation and medical insurance before boarding.',
  IR: 'Iran requires travel insurance explicitly valid for Iran for visa issuance.',
  DZ: 'Algeria requires travel insurance for visa applications.',
  BY: 'Belarus requires medical insurance valid for the full stay.',
  UA: 'Ukraine requires an insurance policy covering medical costs for foreign visitors.',
};

const SCHENGEN_NOTE =
  'Schengen visa applicants must show travel medical insurance with at least €30,000 cover, valid across the whole Schengen area for the full stay — applications without a compliant certificate are refused.';

/** Whether (and why) insurance is mandatory for a destination. */
export function mandatoryInsuranceNote(destinationCode: string): string | null {
  const code = destinationCode.toUpperCase();
  if (SCHENGEN_CODES.has(code)) return SCHENGEN_NOTE;
  return MANDATORY_INSURANCE[code] ?? null;
}

/** Resolve the residence market used for plan filtering. */
export function residenceMarket(residenceCode: string): PlanMarket {
  const code = residenceCode.toUpperCase();
  if (code === 'US') return 'US';
  if (code === 'IN') return 'IN';
  return 'GLOBAL';
}

/**
 * Rating region for a (residence, destination) pair. US & Canada are the most
 * expensive medical band worldwide; Schengen/Europe carries the €30k visa
 * floor; Indian domestic trips rate lowest.
 */
export function destinationRegion(residenceCode: string, destinationCode: string): CoverageRegion {
  const dest = destinationCode.toUpperCase();
  const res = residenceCode.toUpperCase();
  if (dest === 'IN' && res === 'IN') return 'domestic_india';
  if (dest === 'US' || dest === 'CA') return 'us_canada';
  if (SCHENGEN_CODES.has(dest)) return 'schengen_europe';
  const country = countryByCode(dest);
  if (country?.continent === 'Europe') return 'schengen_europe';
  if (country?.continent === 'Asia') return 'asia';
  return 'worldwide_excl_us';
}

/** True when a plan sold for `planRegions` covers travel to `region`. */
export function regionCovered(planRegions: CoverageRegion[], region: CoverageRegion): boolean {
  if (planRegions.includes(region)) return true;
  if (planRegions.includes('worldwide')) return region !== 'domestic_india';
  // Worldwide-excl-US plans cover everything except the US/Canada band.
  if (planRegions.includes('worldwide_excl_us')) {
    return region === 'asia' || region === 'schengen_europe' || region === 'worldwide_excl_us';
  }
  return false;
}

/** Premium multiplier by destination region (relative to the Schengen/Europe base). */
export const REGION_MULTIPLIER: Record<CoverageRegion, number> = {
  domestic_india: 0.55,
  asia: 0.8,
  schengen_europe: 1.0,
  worldwide_excl_us: 1.1,
  us_canada: 1.65,
  worldwide: 1.5,
};

export const REGION_LABELS: Record<CoverageRegion, string> = {
  domestic_india: 'Domestic India',
  asia: 'Asia',
  schengen_europe: 'Europe & Schengen',
  us_canada: 'USA & Canada',
  worldwide_excl_us: 'Worldwide excl. USA/Canada',
  worldwide: 'Worldwide incl. USA/Canada',
};

/** Ballpark cost context per region — used on destination pages and by the AI
 * advisor to explain WHY a coverage level is recommended. */
export const REGION_MEDICAL_CONTEXT: Record<CoverageRegion, { context: string; recommendedMedicalUsd: number }> = {
  domestic_india: {
    context: 'Private hospital costs in India are moderate; domestic covers focus on accident hospitalisation, trip cancellation and baggage rather than large medical sums.',
    recommendedMedicalUsd: 10_000,
  },
  asia: {
    context: 'Private care in hubs like Singapore, Tokyo, Dubai or Bangkok can run $1,500–4,000 a night for inpatient care; medical evacuation from remote areas often exceeds $25,000.',
    recommendedMedicalUsd: 100_000,
  },
  schengen_europe: {
    context: 'Schengen visa rules set a €30,000 floor, but real-world inpatient care in Western Europe frequently exceeds it — €50,000+ claims are routine for surgeries or extended stays.',
    recommendedMedicalUsd: 100_000,
  },
  us_canada: {
    context: 'The USA has the highest medical costs in the world: an ER visit averages $2,000–3,000, a hospital day $11,000+, and complex inpatient episodes regularly exceed $100,000.',
    recommendedMedicalUsd: 250_000,
  },
  worldwide_excl_us: {
    context: 'Costs vary widely; medical evacuation from remote regions (safaris, islands, mountains) is the big-ticket risk and can exceed $50,000–100,000.',
    recommendedMedicalUsd: 100_000,
  },
  worldwide: {
    context: 'Worldwide trips that include the USA/Canada should be insured to US medical-cost levels — the most expensive leg sets the bar.',
    recommendedMedicalUsd: 250_000,
  },
};
