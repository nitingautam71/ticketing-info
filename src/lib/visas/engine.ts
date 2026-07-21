import { prisma } from '@/lib/db';
import { visaRulesProvider } from '@/lib/providers/visas';
import { countryByCode, type VisaCountry, VISA_COUNTRIES } from './countries';
import {
  CATEGORY_LABELS,
  CATEGORY_PROCESSING,
  OFFICIAL_LINKS,
  blankPagesRule,
  feeEstimate,
  passportValidityRule,
  yellowFeverNote,
} from './enrichment';
import { buildChecklist, purposeNote } from './checklist';
import { transitNote } from './transit';
import type { TravelPurpose, VisaBaseRule, VisaCategory, VisaCheckResult } from './types';

export const VISA_DISCLAIMER =
  'Requirements are compiled from official sources and refreshed regularly, but immigration rules change without notice — always confirm with the destination’s embassy or official portal before booking non-refundable travel.';

/**
 * Admin overrides live in Postgres and always win over the bundled matrix.
 * They're cached in-memory for a minute so a burst of checks (or an ISR page
 * regeneration fan-out) costs at most one DB query, and a DB outage degrades
 * to bundled-data answers instead of failing the check.
 */
const OVERRIDE_TTL_MS = 60_000;
let overrideCache: { at: number; rules: Map<string, VisaBaseRule & { updatedAt: string }> } | null = null;

async function loadOverrides(): Promise<Map<string, VisaBaseRule & { updatedAt: string }>> {
  const now = Date.now();
  if (overrideCache && now - overrideCache.at < OVERRIDE_TTL_MS) return overrideCache.rules;
  try {
    const rows = await prisma.visaRuleOverride.findMany();
    const rules = new Map(
      rows.map((r) => [
        `${r.passportCode}:${r.destinationCode}`,
        {
          category: r.category as VisaCategory,
          allowedStayDays: r.allowedStayDays ?? undefined,
          notes: r.notes ?? undefined,
          source: 'admin-override' as const,
          updatedAt: r.updatedAt.toISOString(),
        },
      ]),
    );
    overrideCache = { at: now, rules };
    return rules;
  } catch (err) {
    console.error('Visa override lookup failed, using bundled rules:', err);
    return overrideCache?.rules ?? new Map();
  }
}

/** Test hook / admin mutation hook: drop the cached overrides. */
export function invalidateOverrideCache() {
  overrideCache = null;
}

function headline(category: VisaCategory, destination: VisaCountry, stayDays?: number): string {
  const stay = stayDays ? ` for up to ${stayDays} days` : '';
  switch (category) {
    case 'visa_free':
      return `Visa-free entry to ${destination.name}${stay}.`;
    case 'visa_on_arrival':
      return `Visa on arrival at the border of ${destination.name}${stay} — no embassy visit needed.`;
    case 'e_visa':
      return `Apply online for an e-visa before travelling to ${destination.name}.`;
    case 'eta':
      return `Apply online for an electronic travel authorisation before boarding to ${destination.name}.`;
    case 'visa_required':
      return `A visa must be arranged through an embassy or visa centre before travelling to ${destination.name}.`;
    case 'no_admission':
      return `Entry to ${destination.name} is currently not permitted on this passport.`;
    case 'home_country':
      return `This is your passport’s own country — no visa needed.`;
  }
}

export interface CheckVisaParams {
  passportCode: string;
  destinationCode: string;
  purpose?: TravelPurpose;
}

/** Full visa check: bundled matrix + admin overrides + enrichment. Returns null
 * when either country code is unknown. */
export async function checkVisa({ passportCode, destinationCode, purpose = 'tourism' }: CheckVisaParams): Promise<VisaCheckResult | null> {
  const passport = countryByCode(passportCode);
  const destination = countryByCode(destinationCode);
  if (!passport || !destination) return null;

  const base =
    passport.code === destination.code
      ? ({ category: 'home_country', source: 'passport-index' } satisfies VisaBaseRule)
      : visaRulesProvider.baseRule(passport.code, destination.code);
  if (!base) return null;

  const overrides = await loadOverrides();
  const override = overrides.get(`${passport.code}:${destination.code}`);
  const rule = override ?? base;

  const category = rule.category;
  const label = CATEGORY_LABELS[category];
  const applyBefore = category === 'e_visa' || category === 'eta' || category === 'visa_required';

  return {
    passport,
    destination,
    purpose,
    category,
    categoryLabel: label,
    headline: headline(category, destination, rule.allowedStayDays),
    allowedStayDays: rule.allowedStayDays,
    entryType: category === 'visa_free' || category === 'home_country' ? 'multiple' : 'varies',
    applyBefore,
    applyOnline: category === 'e_visa' || category === 'eta',
    processingTime: CATEGORY_PROCESSING[category],
    fee: feeEstimate(destination.code, category),
    passportValidity: passportValidityRule(destination.code),
    blankPages: blankPagesRule(destination.code),
    documents: buildChecklist(category, purpose),
    purposeNote: purposeNote(purpose, label),
    transitNote: transitNote(destination.code, category),
    health: {
      yellowFever: yellowFeverNote(destination.code),
      routineAdvice: 'Routine vaccinations should be up to date. Check destination-specific advice (hepatitis A/B, typhoid, malaria prophylaxis) with a travel clinic 4–6 weeks before departure.',
      insurance: 'Travel medical insurance is strongly recommended everywhere, and mandatory for Schengen visas, Saudi e-visas, and several other programmes.',
    },
    officialLink: OFFICIAL_LINKS[destination.code],
    adminNotes: override?.notes,
    source: rule.source,
    updatedAt: override?.updatedAt,
    disclaimer: VISA_DISCLAIMER,
  };
}

export interface PassportSummary {
  passport: VisaCountry;
  counts: Record<VisaCategory, number>;
  /** Destinations grouped by category, sorted by name. */
  groups: Partial<Record<VisaCategory, { country: VisaCountry; stayDays?: number }[]>>;
  mobilityScore: number; // destinations reachable without an embassy visa
}

/** Aggregates a passport's access across all destinations — powers the
 * "/visas/passport/[slug]" ranking pages. Bundled data only (no overrides):
 * hub pages are cached aggregates, per-pair pages show the corrected value. */
export function passportSummary(passportCode: string): PassportSummary | null {
  const passport = countryByCode(passportCode);
  if (!passport) return null;

  const counts = {
    visa_free: 0, visa_on_arrival: 0, e_visa: 0, eta: 0, visa_required: 0, no_admission: 0, home_country: 0,
  } as Record<VisaCategory, number>;
  const groups: PassportSummary['groups'] = {};

  for (const dest of VISA_COUNTRIES) {
    if (dest.code === passport.code) continue;
    const rule = visaRulesProvider.baseRule(passport.code, dest.code);
    if (!rule) continue;
    counts[rule.category] += 1;
    (groups[rule.category] ??= []).push({ country: dest, stayDays: rule.allowedStayDays });
  }
  for (const list of Object.values(groups)) list.sort((a, b) => a.country.name.localeCompare(b.country.name));

  return {
    passport,
    counts,
    groups,
    mobilityScore: counts.visa_free + counts.visa_on_arrival + counts.eta,
  };
}

export interface DestinationSummary {
  destination: VisaCountry;
  counts: Record<VisaCategory, number>;
  groups: Partial<Record<VisaCategory, { country: VisaCountry; stayDays?: number }[]>>;
}

/** Who can enter this destination and how — powers "/visas/destination/[slug]". */
export function destinationSummary(destinationCode: string): DestinationSummary | null {
  const destination = countryByCode(destinationCode);
  if (!destination) return null;

  const counts = {
    visa_free: 0, visa_on_arrival: 0, e_visa: 0, eta: 0, visa_required: 0, no_admission: 0, home_country: 0,
  } as Record<VisaCategory, number>;
  const groups: DestinationSummary['groups'] = {};

  for (const passport of VISA_COUNTRIES) {
    if (passport.code === destination.code) continue;
    const rule = visaRulesProvider.baseRule(passport.code, destination.code);
    if (!rule) continue;
    counts[rule.category] += 1;
    (groups[rule.category] ??= []).push({ country: passport, stayDays: rule.allowedStayDays });
  }
  for (const list of Object.values(groups)) list.sort((a, b) => a.country.name.localeCompare(b.country.name));

  return { destination, counts, groups };
}

/** Fire-and-forget analytics row. Never throws. */
export function logVisaCheck(params: { passportCode: string; destinationCode: string; category?: string; purpose?: string; source: string }) {
  prisma.visaCheckLog
    .create({
      data: {
        passportCode: params.passportCode.toUpperCase(),
        destinationCode: params.destinationCode.toUpperCase(),
        category: params.category,
        purpose: params.purpose,
        source: params.source,
      },
    })
    .catch((err) => console.error('visa check log failed:', err));
}
