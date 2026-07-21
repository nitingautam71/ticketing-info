import { prisma } from '@/lib/db';
import { insuranceCatalogProvider } from '@/lib/providers/insurance';
import { providerById } from './providers';
import { destinationRegion, regionCovered, residenceMarket, REGION_MULTIPLIER } from './regions';
import {
  ageBandOf,
  INSURANCE_DISCLAIMER,
  type CoverageRegion,
  type InsurancePlan,
  type PlanCategory,
  type PlanQuote,
  type QuoteInput,
  type QuoteResultSet,
} from './types';

const INR_PER_USD = 85;

/**
 * Admin plan overrides (activate/deactivate a plan, premium adjustment, public
 * note) live in Postgres and are cached in-memory for a minute — same pattern
 * as visa rule overrides: a burst of quotes costs at most one DB query, and a
 * DB outage degrades to catalog defaults instead of failing the quote.
 */
export interface PlanOverride {
  planId: string;
  active: boolean;
  premiumMultiplier: number | null;
  notes: string | null;
}

const OVERRIDE_TTL_MS = 60_000;
let overrideCache: { at: number; byPlanId: Map<string, PlanOverride> } | null = null;

async function loadOverrides(): Promise<Map<string, PlanOverride>> {
  const now = Date.now();
  if (overrideCache && now - overrideCache.at < OVERRIDE_TTL_MS) return overrideCache.byPlanId;
  try {
    const rows = await prisma.insurancePlanOverride.findMany();
    const byPlanId = new Map<string, PlanOverride>(
      rows.map((r) => [r.planId, { planId: r.planId, active: r.active, premiumMultiplier: r.premiumMultiplier, notes: r.notes }]),
    );
    overrideCache = { at: now, byPlanId };
    return byPlanId;
  } catch (err) {
    console.error('Insurance override lookup failed, using catalog defaults:', err);
    return overrideCache?.byPlanId ?? new Map();
  }
}

/** Test hook / admin mutation hook: drop the cached overrides. */
export function invalidateInsuranceOverrideCache() {
  overrideCache = null;
}

export function tripDurationDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(1, Math.round((end - start) / 86_400_000) + 1);
}

function formatPremium(amount: number, currency: 'USD' | 'INR'): string {
  return currency === 'INR' ? `₹${amount.toLocaleString('en-IN')}` : `$${amount.toLocaleString('en-US')}`;
}

/**
 * Indicative premium for one plan and party. Deterministic on purpose — the
 * same inputs always produce the same estimate, so results are cacheable and
 * testable. Never presented as a bindable price.
 */
export function estimatePremium(
  plan: InsurancePlan,
  input: { durationDays: number; region: CoverageRegion; travellerAges: number[]; tripCostUsd?: number },
  premiumMultiplier = 1,
): { premium: number; premiumUsd: number; perTraveller: number[] } {
  const regionMult = REGION_MULTIPLIER[input.region];
  const perTraveller = input.travellerAges.map((age) => {
    const rate = plan.baseRates[ageBandOf(age)];
    if (rate <= 0) return 0; // band not sold — filtered out earlier by eligibility
    let raw: number;
    if (plan.pricingModel === 'trip_cost') {
      // US comprehensive model: % of per-person trip cost, floored by a
      // duration-based minimum so zero-cost inputs still price sensibly.
      const perPersonCost = (input.tripCostUsd ?? 0) / Math.max(1, input.travellerAges.length);
      const costDriven = perPersonCost * rate;
      const durationFloor = input.durationDays * 3.2 * regionMult;
      raw = Math.max(costDriven, durationFloor);
    } else if (plan.pricingModel === 'annual_flat') {
      raw = rate; // flat annual premium per traveller
    } else {
      // Duration-driven with a gentle long-trip taper (rates decline ~ day^0.93).
      raw = rate * Math.pow(input.durationDays, 0.93) * regionMult;
    }
    return Math.max(plan.minPremium, raw) * premiumMultiplier;
  });

  // Family softener: parties of 4+ typically see bundled pricing.
  const partyDiscount = input.travellerAges.length >= 4 ? 0.9 : 1;
  const premium = Math.round(perTraveller.reduce((a, b) => a + b, 0) * partyDiscount);
  const premiumUsd = plan.currency === 'INR' ? Math.round(premium / INR_PER_USD) : premium;
  return { premium, premiumUsd, perTraveller: perTraveller.map((p) => Math.round(p * partyDiscount)) };
}

/** Why a plan fits this trip — powers the "Recommended" sort and the cards'
 * reason chips. Transparent scoring beats a black box for user trust. */
function fitScore(
  plan: InsurancePlan,
  input: { region: CoverageRegion; durationDays: number; travellerAges: number[]; categories: PlanCategory[]; tripCostUsd?: number },
): { score: number; reasons: string[] } {
  let score = 50;
  const reasons: string[] = [];

  const recommendedMedical = input.region === 'us_canada' || input.region === 'worldwide' ? 250_000 : input.region === 'domestic_india' ? 5_000 : 100_000;
  if (plan.medicalSumInsuredUsd >= recommendedMedical) {
    score += 18;
    reasons.push('Medical cover meets the recommended level for this destination');
  } else if (plan.medicalSumInsuredUsd >= recommendedMedical / 2) {
    score += 8;
  } else {
    score -= 10;
  }

  // Explicit trip-type intent outranks generic strengths — a senior search
  // should surface senior plans above a bigger-medical generalist.
  const requested = input.categories.filter((c) => plan.categories.includes(c));
  if (requested.length > 0) {
    score += 16 * requested.length;
    reasons.push(`Built for ${requested.join(', ').replaceAll('_', ' ')} trips`);
  }

  const oldest = Math.max(...input.travellerAges);
  if (oldest >= 61 && plan.categories.includes('senior')) {
    score += 15;
    reasons.push('Senior-specific benefits and acceptance');
  }
  const hasKids = input.travellerAges.some((a) => a <= 17);
  if (hasKids && plan.categories.includes('family')) {
    score += 10;
    reasons.push('Family-friendly (child pricing/benefits)');
  }

  if (input.durationDays > 60 && plan.eligibility.maxTripDays >= 180) score += 5;
  if ((input.tripCostUsd ?? 0) > 2_000 && plan.coverage.trip_cancellation) {
    score += 8;
    reasons.push('Covers your prepaid trip cost if you must cancel');
  }
  if (plan.coverage.pre_existing_conditions && oldest >= 51) {
    score += 6;
    reasons.push('Pre-existing condition provisions');
  }

  return { score: Math.max(0, Math.min(100, score)), reasons: reasons.slice(0, 3) };
}

/** Full quote run: market + region + eligibility filtering, premium estimates,
 * fit scoring, admin overrides. Sorted by fit score desc, then price asc. */
export async function quotePlans(input: QuoteInput): Promise<QuoteResultSet> {
  const market = residenceMarket(input.residence);
  const region = destinationRegion(input.residence, input.destination);
  const durationDays = tripDurationDays(input.startDate, input.endDate);
  const categories = input.categories ?? [];
  const ages = input.travellers.map((t) => t.age);
  const overrides = await loadOverrides();

  const quotes: PlanQuote[] = [];
  const excluded: QuoteResultSet['excluded'] = [];

  for (const plan of insuranceCatalogProvider.plans()) {
    const provider = providerById(plan.providerId);
    if (!provider) continue;
    const override = overrides.get(plan.id);

    const reason = (() => {
      if (override && !override.active) return 'Temporarily unavailable';
      if (plan.market !== 'GLOBAL' && plan.market !== market) return `Sold to ${plan.market === 'US' ? 'US' : 'India'} residents only`;
      if (input.annual && plan.pricingModel !== 'annual_flat') return 'Not an annual multi-trip plan';
      if (!input.annual && plan.pricingModel === 'annual_flat' && !categories.includes('annual_multi_trip')) return 'Annual plan — quoted for annual searches';
      if (!regionCovered(plan.regions, region)) return 'Does not cover this destination region';
      const cap = plan.eligibility.perTripCapDays ?? plan.eligibility.maxTripDays;
      if (plan.pricingModel !== 'annual_flat' && durationDays > plan.eligibility.maxTripDays) return `Max trip length ${plan.eligibility.maxTripDays} days`;
      if (plan.pricingModel === 'annual_flat' && durationDays > cap) return `Annual plan caps each trip at ${cap} days`;
      const ineligibleAge = ages.find((a) => a < plan.eligibility.minAge || a > plan.eligibility.maxAge || plan.baseRates[ageBandOf(a)] <= 0);
      if (ineligibleAge !== undefined) return `Age ${ineligibleAge} outside eligibility (${plan.eligibility.minAge}–${plan.eligibility.maxAge})`;
      return null;
    })();

    if (reason) {
      excluded.push({ planId: plan.id, planName: plan.name, reason });
      continue;
    }

    const { premium, premiumUsd, perTraveller } = estimatePremium(
      plan,
      { durationDays, region, travellerAges: ages, tripCostUsd: input.tripCostUsd },
      override?.premiumMultiplier ?? 1,
    );
    const fit = fitScore(plan, { region, durationDays, travellerAges: ages, categories, tripCostUsd: input.tripCostUsd });

    quotes.push({
      plan,
      provider,
      premium,
      premiumLabel: `${formatPremium(premium, plan.currency)}${plan.pricingModel === 'annual_flat' ? '/year' : ''}`,
      premiumUsd,
      perTravellerLabel:
        ages.length > 1 ? `≈ ${formatPremium(Math.round(premium / ages.length), plan.currency)} per traveller` : formatPremium(perTraveller[0] ?? premium, plan.currency),
      durationDays,
      region,
      estimate: true,
      adminNotes: override?.notes ?? undefined,
      fitScore: fit.score,
      fitReasons: fit.reasons,
    });
  }

  quotes.sort((a, b) => b.fitScore - a.fitScore || a.premiumUsd - b.premiumUsd);

  return {
    input: { ...input, durationDays, region, market },
    quotes,
    excluded,
    disclaimer: INSURANCE_DISCLAIMER,
  };
}

/** Plans eligible for a category page (no pricing context needed). */
export function plansForCategory(category: PlanCategory): InsurancePlan[] {
  return insuranceCatalogProvider.plans().filter((p) => p.categories.includes(category));
}

export function plansForProvider(providerId: string): InsurancePlan[] {
  return insuranceCatalogProvider.plans().filter((p) => p.providerId === providerId);
}

/** Fire-and-forget analytics row. Never throws, stores no PII. */
export function logInsuranceQuote(params: {
  residence: string;
  destination: string;
  durationDays: number;
  travellers: number;
  oldestAge?: number;
  categories?: string[];
  topPlanId?: string;
  source: string;
}) {
  prisma.insuranceQuoteLog
    .create({
      data: {
        residence: params.residence.toUpperCase(),
        destination: params.destination.toUpperCase(),
        durationDays: params.durationDays,
        travellers: params.travellers,
        ageBand: params.oldestAge !== undefined ? ageBandOf(params.oldestAge) : null,
        categories: params.categories ?? [],
        topPlanId: params.topPlanId,
        source: params.source,
      },
    })
    .catch((err) => console.error('insurance quote log failed:', err));
}
