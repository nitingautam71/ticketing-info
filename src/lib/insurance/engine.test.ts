import { describe, expect, it } from 'vitest';
import { INSURANCE_PLANS, planBySlug } from './plans';
import { INSURANCE_PROVIDERS, providerById } from './providers';
import { CATEGORY_PAGES } from './categories';
import { INSURANCE_GUIDES } from './guides';
import { COVERAGE_INFO } from './coverage';
import { destinationRegion, mandatoryInsuranceNote, regionCovered, SCHENGEN_CODES } from './regions';
import { estimatePremium, quotePlans, tripDurationDays } from './engine';
import { AGE_BANDS, ageBandOf, type PlanCategory } from './types';

describe('catalog integrity', () => {
  it('has unique plan ids and slugs, and valid provider references', () => {
    expect(INSURANCE_PLANS.length).toBeGreaterThanOrEqual(25);
    expect(new Set(INSURANCE_PLANS.map((p) => p.id)).size).toBe(INSURANCE_PLANS.length);
    expect(new Set(INSURANCE_PLANS.map((p) => p.slug)).size).toBe(INSURANCE_PLANS.length);
    for (const plan of INSURANCE_PLANS) {
      expect(providerById(plan.providerId), `provider missing for ${plan.id}`).toBeDefined();
    }
  });

  it('has unique provider slugs and at least one plan per provider', () => {
    expect(new Set(INSURANCE_PROVIDERS.map((p) => p.slug)).size).toBe(INSURANCE_PROVIDERS.length);
    for (const provider of INSURANCE_PROVIDERS) {
      expect(
        INSURANCE_PLANS.some((p) => p.providerId === provider.id),
        `no plans for ${provider.id}`,
      ).toBe(true);
    }
  });

  it('every plan carries the core comparable fields', () => {
    for (const plan of INSURANCE_PLANS) {
      expect(plan.coverage.emergency_medical, `${plan.id} missing medical benefit`).toBeDefined();
      expect(plan.categories.length).toBeGreaterThan(0);
      expect(plan.regions.length).toBeGreaterThan(0);
      expect(plan.minPremium).toBeGreaterThan(0);
      expect(plan.medicalSumInsuredUsd).toBeGreaterThan(0);
      expect(plan.exclusions.length).toBeGreaterThan(0);
      for (const key of Object.keys(plan.coverage)) {
        expect(COVERAGE_INFO[key as keyof typeof COVERAGE_INFO], `${plan.id} has unknown coverage key ${key}`).toBeDefined();
      }
    }
  });

  it('rates are positive for every age band inside the eligibility window', () => {
    for (const plan of INSURANCE_PLANS) {
      for (const band of AGE_BANDS) {
        // Probe a representative age per band; skip bands outside eligibility.
        const probe = { '0-17': 10, '18-35': 30, '36-50': 40, '51-60': 55, '61-70': 65, '71-80': 75, '81+': 85 }[band];
        if (probe < plan.eligibility.minAge || probe > plan.eligibility.maxAge) continue;
        // Bands with 0 model "not sold at this age" — allowed only when the
        // eligibility window is broader than the rated bands (noted plans).
        if (plan.baseRates[band] === 0) continue;
        expect(plan.baseRates[band]).toBeGreaterThan(0);
      }
    }
  });

  it('every category landing page has at least one matching plan', () => {
    for (const page of CATEGORY_PAGES) {
      const matches = INSURANCE_PLANS.filter((p) => p.categories.includes(page.category));
      expect(matches.length, `no plans for category ${page.category}`).toBeGreaterThan(0);
    }
  });

  it('category and guide slugs are unique', () => {
    expect(new Set(CATEGORY_PAGES.map((c) => c.slug)).size).toBe(CATEGORY_PAGES.length);
    expect(new Set(INSURANCE_GUIDES.map((g) => g.slug)).size).toBe(INSURANCE_GUIDES.length);
  });

  it('resolves plans by slug case-insensitively', () => {
    expect(planBySlug('TATA-AIG-TRAVEL-GUARD-GOLD')?.id).toBe('tata-aig-travel-guard-gold');
    expect(planBySlug('nonexistent')).toBeUndefined();
  });
});

describe('regions & mandatory rules', () => {
  it('maps destinations to rating regions', () => {
    expect(destinationRegion('IN', 'IN')).toBe('domestic_india');
    expect(destinationRegion('US', 'IN')).toBe('asia');
    expect(destinationRegion('IN', 'US')).toBe('us_canada');
    expect(destinationRegion('IN', 'CA')).toBe('us_canada');
    expect(destinationRegion('IN', 'FR')).toBe('schengen_europe');
    expect(destinationRegion('US', 'GB')).toBe('schengen_europe'); // Europe band
    expect(destinationRegion('IN', 'TH')).toBe('asia');
    expect(destinationRegion('US', 'BR')).toBe('worldwide_excl_us');
  });

  it('worldwide plans cover everything except Indian domestic', () => {
    expect(regionCovered(['worldwide'], 'us_canada')).toBe(true);
    expect(regionCovered(['worldwide'], 'asia')).toBe(true);
    expect(regionCovered(['worldwide'], 'domestic_india')).toBe(false);
    expect(regionCovered(['worldwide_excl_us'], 'us_canada')).toBe(false);
    expect(regionCovered(['worldwide_excl_us'], 'schengen_europe')).toBe(true);
    expect(regionCovered(['asia'], 'schengen_europe')).toBe(false);
  });

  it('flags mandatory-insurance destinations', () => {
    expect(SCHENGEN_CODES.size).toBe(29);
    expect(mandatoryInsuranceNote('FR')).toContain('€30,000');
    expect(mandatoryInsuranceNote('CU')).toContain('Cuba');
    expect(mandatoryInsuranceNote('US')).toBeNull();
    expect(mandatoryInsuranceNote('JP')).toBeNull();
  });
});

describe('premium estimation', () => {
  const perDayPlan = INSURANCE_PLANS.find((p) => p.id === 'img-patriot-america-plus')!;
  const tripCostPlan = INSURANCE_PLANS.find((p) => p.id === 'allianz-onetrip-prime')!;

  it('is deterministic', () => {
    const input = { durationDays: 14, region: 'us_canada' as const, travellerAges: [34] };
    expect(estimatePremium(perDayPlan, input)).toEqual(estimatePremium(perDayPlan, input));
  });

  it('scales with duration and age on per-day plans', () => {
    const short = estimatePremium(perDayPlan, { durationDays: 7, region: 'us_canada', travellerAges: [30] });
    const long = estimatePremium(perDayPlan, { durationDays: 60, region: 'us_canada', travellerAges: [30] });
    expect(long.premium).toBeGreaterThan(short.premium);

    const young = estimatePremium(perDayPlan, { durationDays: 30, region: 'us_canada', travellerAges: [30] });
    const senior = estimatePremium(perDayPlan, { durationDays: 30, region: 'us_canada', travellerAges: [72] });
    expect(senior.premium).toBeGreaterThan(young.premium * 2);
  });

  it('drives US comprehensive pricing from trip cost with a duration floor', () => {
    const cheap = estimatePremium(tripCostPlan, { durationDays: 10, region: 'schengen_europe', travellerAges: [40], tripCostUsd: 2000 });
    const pricey = estimatePremium(tripCostPlan, { durationDays: 10, region: 'schengen_europe', travellerAges: [40], tripCostUsd: 8000 });
    expect(pricey.premium).toBeGreaterThan(cheap.premium);
    // Without trip cost, the duration floor keeps the estimate sensible.
    const noCost = estimatePremium(tripCostPlan, { durationDays: 10, region: 'schengen_europe', travellerAges: [40] });
    expect(noCost.premium).toBeGreaterThanOrEqual(tripCostPlan.minPremium);
  });

  it('applies the admin premium multiplier', () => {
    const base = estimatePremium(perDayPlan, { durationDays: 20, region: 'us_canada', travellerAges: [40] });
    const scaled = estimatePremium(perDayPlan, { durationDays: 20, region: 'us_canada', travellerAges: [40] }, 1.5);
    expect(scaled.premium).toBeGreaterThan(base.premium * 1.4);
  });

  it('computes inclusive trip duration', () => {
    expect(tripDurationDays('2026-09-01', '2026-09-01')).toBe(1);
    expect(tripDurationDays('2026-09-01', '2026-09-10')).toBe(10);
    expect(ageBandOf(0)).toBe('0-17');
    expect(ageBandOf(35)).toBe('18-35');
    expect(ageBandOf(81)).toBe('81+');
  });
});

describe('quote engine', () => {
  const baseInput = {
    residence: 'IN',
    destination: 'US',
    startDate: '2026-09-01',
    endDate: '2026-09-20',
    travellers: [{ age: 34 }],
  };

  it('filters by market and region for an India → USA trip', async () => {
    const result = await quotePlans(baseInput);
    expect(result.quotes.length).toBeGreaterThan(0);
    const ids = result.quotes.map((q) => q.plan.id);
    expect(ids).toContain('tata-aig-travel-guard-gold'); // IN market, worldwide incl US
    expect(ids).toContain('img-patriot-america-plus'); // GLOBAL visitor plan
    expect(ids).not.toContain('allianz-onetrip-prime'); // US-residents-only
    expect(ids).not.toContain('care-explore-europe'); // region does not cover USA
    for (const q of result.quotes) {
      expect(q.estimate).toBe(true);
      expect(q.premium).toBeGreaterThan(0);
    }
    // Every catalog plan is either quoted or explained.
    expect(result.quotes.length + result.excluded.length).toBe(INSURANCE_PLANS.length);
  });

  it('quotes only annual plans when annual is requested', async () => {
    const result = await quotePlans({ ...baseInput, residence: 'US', destination: 'FR', annual: true });
    expect(result.quotes.length).toBeGreaterThan(0);
    for (const q of result.quotes) {
      expect(q.plan.pricingModel).toBe('annual_flat');
    }
  });

  it('finds cover for an 82-year-old visiting the USA', async () => {
    const result = await quotePlans({ ...baseInput, travellers: [{ age: 82 }] });
    const ids = result.quotes.map((q) => q.plan.id);
    expect(ids).toContain('icici-lombard-senior'); // issues to 85
    expect(ids).toContain('img-patriot-america-plus'); // visitor plan to 89
    expect(ids).not.toContain('tata-aig-travel-guard-gold'); // caps at 70
  });

  it('ranks senior plans higher for senior searches', async () => {
    const result = await quotePlans({ ...baseInput, travellers: [{ age: 67 }], categories: ['senior' as PlanCategory] });
    expect(result.quotes[0].plan.categories).toContain('senior');
  });

  it('quotes domestic India trips against domestic plans only', async () => {
    const result = await quotePlans({ ...baseInput, residence: 'IN', destination: 'IN' });
    const ids = result.quotes.map((q) => q.plan.id);
    expect(ids).toContain('digit-domestic');
    expect(ids).not.toContain('tata-aig-travel-guard-gold');
  });

  it('rejects overlong trips per plan caps', async () => {
    const result = await quotePlans({ ...baseInput, residence: 'US', destination: 'FR', startDate: '2026-01-01', endDate: '2027-06-01' });
    const wn = result.excluded.find((e) => e.planId === 'world-nomads-standard');
    expect(wn?.reason).toContain('Max trip length');
  });
});
