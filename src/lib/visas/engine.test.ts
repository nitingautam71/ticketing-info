import { describe, expect, it } from 'vitest';
import { visaRulesProvider } from '@/lib/providers/visas';
import { VISA_COUNTRIES, countryByCode, countryBySlug, flagEmoji, resolveCountry } from './countries';
import { buildChecklist } from './checklist';
import { destinationSummary, passportSummary } from './engine';
import { feeEstimate, passportValidityRule } from './enrichment';
import { transitNote } from './transit';

describe('country registry', () => {
  it('covers all 199 passports/destinations with unique slugs', () => {
    expect(VISA_COUNTRIES).toHaveLength(199);
    const slugs = new Set(VISA_COUNTRIES.map((c) => c.slug));
    expect(slugs.size).toBe(199);
  });

  it('resolves by code, slug, and name', () => {
    expect(countryByCode('in')?.name).toBe('India');
    expect(countryBySlug('united-states')?.code).toBe('US');
    expect(resolveCountry('United Arab Emirates')?.code).toBe('AE');
    expect(resolveCountry('narnia')).toBeUndefined();
  });

  it('renders flag emoji from ISO2', () => {
    expect(flagEmoji('IN')).toBe('🇮🇳');
  });
});

describe('base rules provider (passport-index matrix)', () => {
  it('has a rule for every non-identical pair', () => {
    let missing = 0;
    for (const p of VISA_COUNTRIES) {
      for (const d of VISA_COUNTRIES) {
        if (p.code === d.code) continue;
        if (!visaRulesProvider.baseRule(p.code, d.code)) missing++;
      }
    }
    expect(missing).toBe(0);
  });

  it('reports well-known corridors correctly', () => {
    // Indian passport → Nepal: visa-free (open border treaty)
    expect(visaRulesProvider.baseRule('IN', 'NP')?.category).toBe('visa_free');
    // Indian passport → US: embassy visa
    expect(visaRulesProvider.baseRule('IN', 'US')?.category).toBe('visa_required');
    // US passport → Japan: visa-free with day allowance
    const usJp = visaRulesProvider.baseRule('US', 'JP');
    expect(usJp?.category).toBe('visa_free');
    expect(usJp?.allowedStayDays).toBeGreaterThan(0);
    // German passport → Schengen neighbour France: visa-free
    expect(visaRulesProvider.baseRule('DE', 'FR')?.category).toBe('visa_free');
  });
});

describe('summaries', () => {
  it('passport summary counts add up to 198 destinations', () => {
    const summary = passportSummary('IN');
    expect(summary).not.toBeNull();
    const total = Object.values(summary!.counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(198);
    expect(summary!.mobilityScore).toBeGreaterThan(0);
  });

  it('destination summary counts add up to 198 passports', () => {
    const summary = destinationSummary('JP');
    expect(summary).not.toBeNull();
    const total = Object.values(summary!.counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(198);
  });
});

describe('enrichment', () => {
  it('returns known official fees and flags estimates honestly', () => {
    expect(feeEstimate('US', 'visa_required')).toMatchObject({ amountUsd: 185, official: true });
    expect(feeEstimate('FR', 'visa_required')).toMatchObject({ amountUsd: 97, official: true });
    expect(feeEstimate('TG', 'e_visa').official).toBe(false);
    expect(feeEstimate('DE', 'visa_free').amountUsd).toBe(0);
  });

  it('applies Schengen and strict six-month passport validity rules', () => {
    expect(passportValidityRule('FR')).toContain('Schengen');
    expect(passportValidityRule('TH')).toContain('6 months');
  });
});

describe('checklists & transit', () => {
  it('adds category and purpose documents on top of the base set', () => {
    const tourist = buildChecklist('visa_required', 'tourism');
    const student = buildChecklist('visa_required', 'student');
    expect(student.length).toBeGreaterThan(tourist.length);
    expect(student.join(' ')).toContain('enrolment');
    expect(buildChecklist('visa_free', 'tourism').length).toBeGreaterThan(0);
    expect(buildChecklist('no_admission', 'tourism')).toHaveLength(0);
  });

  it('gives hub-specific transit guidance', () => {
    expect(transitNote('US', 'visa_required')).toContain('NO airside transit');
    expect(transitNote('DE', 'visa_required')).toContain('Airport Transit Visa');
    expect(transitNote('MU', 'visa_free')).toContain('enter this country');
  });
});
