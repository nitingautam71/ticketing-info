/**
 * Travel insurance marketplace — core domain types.
 *
 * Mirrors the visa platform's design: a bundled, curated catalog (providers +
 * plan profiles compiled from publicly available plan literature) powers
 * comparison and quoting with zero external calls, while mutable state
 * (admin plan overrides, quote analytics, policies, claims) lives in Postgres.
 *
 * Premiums produced by the engine are ALWAYS indicative estimates — the final
 * price is set by the insurer at purchase. Every quote carries `estimate: true`
 * and a disclaimer; UI copy must never present an estimate as a bindable price.
 */

/** Which residence market a plan is sold in. GLOBAL = visitor plans sold to
 * travellers regardless of residence (e.g. inbound-USA visitor medical). */
export type PlanMarket = 'US' | 'IN' | 'GLOBAL';

export type PlanCurrency = 'USD' | 'INR';

/** Trip / traveller segments a plan is built for — drives eligibility
 * filtering and the /insurance/type/[slug] programmatic pages. */
export type PlanCategory =
  | 'single_trip'
  | 'annual_multi_trip'
  | 'domestic_india'
  | 'schengen'
  | 'student'
  | 'senior'
  | 'family'
  | 'business'
  | 'cruise'
  | 'adventure'
  | 'backpacker'
  | 'digital_nomad'
  | 'visitors_usa'
  | 'visitors_india'
  | 'medical_travel'
  | 'pilgrimage'
  | 'group';

/** Destination rating regions. `worldwide` includes the US/Canada;
 * `worldwide_excl_us` is the classic cheaper band. */
export type CoverageRegion =
  | 'domestic_india'
  | 'asia'
  | 'schengen_europe'
  | 'us_canada'
  | 'worldwide_excl_us'
  | 'worldwide';

/** Comparable benefit slots. Amounts are stored per-plan in the plan's own
 * currency, with a normalised USD figure for cross-plan sorting. */
export type CoverageKey =
  | 'emergency_medical'
  | 'medical_evacuation'
  | 'repatriation'
  | 'trip_cancellation'
  | 'trip_interruption'
  | 'trip_delay'
  | 'missed_connection'
  | 'baggage_loss'
  | 'baggage_delay'
  | 'passport_loss'
  | 'personal_liability'
  | 'accidental_death'
  | 'permanent_disability'
  | 'adventure_sports'
  | 'winter_sports'
  | 'rental_car_excess'
  | 'electronics'
  | 'covid_medical'
  | 'pre_existing_conditions'
  | 'cancel_for_any_reason'
  | 'dental'
  | 'hijack_distress'
  | 'home_burglary'
  | 'compassionate_visit'
  | 'telemedicine'
  | 'legal_assistance';

export interface CoverageDetail {
  /** Human label, e.g. "$250,000", "₹50 lakh", "Up to 150% of trip cost". */
  label: string;
  /** Approximate value in USD for sorting/comparison. 0 = covered but not amount-based. */
  approxUsd: number;
  /** True when the benefit is an optional add-on rather than base cover. */
  addOn?: boolean;
  note?: string;
}

export type AgeBand = '0-17' | '18-35' | '36-50' | '51-60' | '61-70' | '71-80' | '81+';

export const AGE_BANDS: AgeBand[] = ['0-17', '18-35', '36-50', '51-60', '61-70', '71-80', '81+'];

export function ageBandOf(age: number): AgeBand {
  if (age <= 17) return '0-17';
  if (age <= 35) return '18-35';
  if (age <= 50) return '36-50';
  if (age <= 60) return '51-60';
  if (age <= 70) return '61-70';
  if (age <= 80) return '71-80';
  return '81+';
}

/** How the engine estimates the premium for a plan. */
export type PricingModel =
  /** Duration-driven (typical for India-market & visitor medical plans). */
  | 'per_day'
  /** Trip-cost-driven (typical for US comprehensive plans: ~4–8% of trip cost). */
  | 'trip_cost'
  /** Flat yearly premium (annual multi-trip plans) — baseRates hold the flat
   * annual premium per age band in plan currency. */
  | 'annual_flat';

export interface InsuranceProviderInfo {
  id: string;
  slug: string;
  name: string;
  /** Underwriter / group, when different from the brand. */
  group?: string;
  headquarters: string;
  founded?: number;
  markets: PlanMarket[];
  about: string;
  /** Publicly listed claim intake — where policyholders actually file. */
  claims: {
    url?: string;
    phone?: string;
    note: string;
  };
  support247: boolean;
  website: string;
  /** Directory of product families we profile (factual, from public pages). */
  productFamilies: string[];
}

export interface PlanEligibility {
  minAge: number;
  maxAge: number;
  /** Longest single trip the plan covers, in days. */
  maxTripDays: number;
  /** For annual plans: per-trip cap within the year. */
  perTripCapDays?: number;
  note?: string;
}

export interface InsurancePlan {
  id: string;
  slug: string;
  providerId: string;
  name: string;
  /** One-line positioning, shown on cards. */
  tagline: string;
  market: PlanMarket;
  currency: PlanCurrency;
  categories: PlanCategory[];
  regions: CoverageRegion[];
  eligibility: PlanEligibility;
  /** Headline medical sum insured in USD, for sorting and the compare table. */
  medicalSumInsuredUsd: number;
  /** Display label for the sum insured, in the plan's own market idiom. */
  medicalSumInsuredLabel: string;
  deductibleLabel: string;
  coverage: Partial<Record<CoverageKey, CoverageDetail>>;
  highlights: string[];
  exclusions: string[];
  claimProcess: string;
  pricingModel: PricingModel;
  /** per_day: base rate per traveller-day in plan currency, by age band.
   *  trip_cost: fraction of trip cost (e.g. 0.055), by age band. */
  baseRates: Record<AgeBand, number>;
  /** Floor premium per traveller in plan currency. */
  minPremium: number;
  bestFor: string[];
}

/** A single traveller in a quote request. */
export interface QuoteTraveller {
  age: number;
}

export interface QuoteInput {
  /** ISO2 residence country. Determines the market (US / IN / other). */
  residence: string;
  /** ISO2 destination country. */
  destination: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  travellers: QuoteTraveller[];
  /** Optional non-refundable trip cost in USD — enables cancellation-driven pricing. */
  tripCostUsd?: number;
  categories?: PlanCategory[];
  /** Annual multi-trip intent. */
  annual?: boolean;
}

export interface PlanQuote {
  plan: InsurancePlan;
  provider: InsuranceProviderInfo;
  /** Estimated premium for the whole party, in plan currency. */
  premium: number;
  premiumLabel: string;
  /** Approximate USD for sorting across currencies. */
  premiumUsd: number;
  perTravellerLabel: string;
  durationDays: number;
  region: CoverageRegion;
  /** Always true — the engine only ever produces indicative estimates. */
  estimate: true;
  /** Admin note from a plan override, when present. */
  adminNotes?: string;
  /** Fit score 0–100 used for the "recommended" ordering. */
  fitScore: number;
  fitReasons: string[];
}

export interface QuoteResultSet {
  input: QuoteInput & { durationDays: number; region: CoverageRegion; market: PlanMarket };
  quotes: PlanQuote[];
  /** Plans that exist for the market but were excluded, with the reason —
   * surfaced so "why isn't X shown" is answerable. */
  excluded: { planId: string; planName: string; reason: string }[];
  disclaimer: string;
}

export const INSURANCE_DISCLAIMER =
  'Premiums shown are indicative estimates compiled from publicly available plan literature and typical market rates — the final premium, terms and issuance are always set by the insurer. Plan benefits, limits and exclusions are summarised for comparison; the policy wording issued by the insurer is the only binding document. Confirm current terms with the insurer or our consultants before purchase.';
