import matrixJson from '@/data/visas/matrix.json';
import type { VisaBaseRule, VisaCategory } from '@/lib/visas/types';

/**
 * Visa rules data-provider abstraction. The engine (src/lib/visas/engine.ts)
 * consumes this interface only, so the underlying source can be swapped —
 * bundled Passport Index dataset today; a commercial feed (Sherpa, IATA
 * Timatic AutoCheck, TravelDoc) tomorrow — without touching business logic.
 * Admin corrections from the VisaRuleOverride table are layered on top by the
 * engine regardless of which provider is active.
 */
export interface VisaRulesProvider {
  readonly id: string;
  /** Base short-stay (tourism) rule for a passport/destination ISO2 pair. */
  baseRule(passportCode: string, destinationCode: string): VisaBaseRule | undefined;
}

interface MatrixShape {
  destinations: string[];
  rows: Record<string, string[]>;
}

const TOKEN_CATEGORY: Record<string, VisaCategory> = {
  F: 'visa_free',
  VOA: 'visa_on_arrival',
  EV: 'e_visa',
  ETA: 'eta',
  VR: 'visa_required',
  X: 'no_admission',
  H: 'home_country',
};

/** Compiled Passport Index dataset (MIT, github.com/ilyankou/passport-index-dataset),
 * built by scripts/visas/build-matrix.mjs. ~217KB in-bundle, zero-latency lookups. */
class PassportIndexProvider implements VisaRulesProvider {
  readonly id = 'passport-index';
  private matrix = matrixJson as MatrixShape;
  private destIndex = new Map(this.matrix.destinations.map((code, i) => [code, i]));

  baseRule(passportCode: string, destinationCode: string): VisaBaseRule | undefined {
    const row = this.matrix.rows[passportCode.toUpperCase()];
    const col = this.destIndex.get(destinationCode.toUpperCase());
    if (!row || col === undefined) return undefined;

    const token = row[col];
    if (token.startsWith('F') && token.length > 1) {
      return { category: 'visa_free', allowedStayDays: Number(token.slice(1)), source: 'passport-index' };
    }
    const category = TOKEN_CATEGORY[token];
    if (!category) return undefined;
    return { category, source: 'passport-index' };
  }
}

export const visaRulesProvider: VisaRulesProvider = new PassportIndexProvider();
