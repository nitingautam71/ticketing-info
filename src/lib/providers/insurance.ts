import { INSURANCE_PLANS } from '@/lib/insurance/plans';
import type { InsurancePlan } from '@/lib/insurance/types';

/**
 * Provider abstraction for the insurance catalog — the single seam between the
 * quote engine and wherever plan data actually comes from.
 *
 * Today: the bundled curated catalog (src/lib/insurance/plans.ts), so quoting
 * needs zero external calls, works during DB outages, and never blocks builds.
 *
 * Upgrade path: implement this interface against a live aggregator/insurer API
 * (battleface/Robin Assist, Ancileo, Zhooosh for US brands; insurer partner
 * APIs or a broker aggregator for India — see INSURANCE-PLATFORM.md). The
 * engine, pages, APIs and AI grounding are source-agnostic; swapping feeds
 * touches only this file.
 */
export interface InsuranceCatalogProvider {
  plans(): InsurancePlan[];
}

class BundledCatalogProvider implements InsuranceCatalogProvider {
  plans(): InsurancePlan[] {
    return INSURANCE_PLANS;
  }
}

export const insuranceCatalogProvider: InsuranceCatalogProvider = new BundledCatalogProvider();
