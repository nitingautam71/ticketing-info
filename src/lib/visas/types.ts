import type { VisaCountry } from './countries';

/** Mirrors the Prisma VisaCategory enum — kept as a string union so the engine
 * and client components never need the Prisma client bundled. */
export type VisaCategory =
  | 'visa_free'
  | 'visa_on_arrival'
  | 'e_visa'
  | 'eta'
  | 'visa_required'
  | 'no_admission'
  | 'home_country';

export type TravelPurpose =
  | 'tourism'
  | 'business'
  | 'transit'
  | 'student'
  | 'work'
  | 'medical'
  | 'family_visit'
  | 'digital_nomad';

export const TRAVEL_PURPOSES: { value: TravelPurpose; label: string }[] = [
  { value: 'tourism', label: 'Tourism / Holiday' },
  { value: 'business', label: 'Business Meetings' },
  { value: 'transit', label: 'Airport Transit' },
  { value: 'student', label: 'Study' },
  { value: 'work', label: 'Work / Employment' },
  { value: 'medical', label: 'Medical Treatment' },
  { value: 'family_visit', label: 'Family / Friends Visit' },
  { value: 'digital_nomad', label: 'Remote Work / Digital Nomad' },
];

export interface VisaBaseRule {
  category: VisaCategory;
  /** Known visa-free/VoA stay allowance in days, when the dataset records one. */
  allowedStayDays?: number;
  /** 'passport-index' bundled dataset, or 'admin-override' when corrected in /admin/visas. */
  source: 'passport-index' | 'admin-override';
  /** Admin-authored clarification shown with the result. */
  notes?: string;
}

export interface FeeEstimate {
  /** Official government fee in USD when known; category-typical estimate otherwise. */
  amountUsd: number;
  /** True when this is the known official fee rather than a category-level estimate. */
  official: boolean;
  label: string; // e.g. "$21 (ESTA fee)" or "≈ $60 (typical e-visa fee)"
}

export interface VisaCheckResult {
  passport: VisaCountry;
  destination: VisaCountry;
  purpose: TravelPurpose;
  category: VisaCategory;
  categoryLabel: string;
  /** One-sentence verdict, e.g. "Visa-free entry for up to 90 days." */
  headline: string;
  allowedStayDays?: number;
  entryType: 'multiple' | 'single' | 'varies';
  applyBefore: boolean; // must be arranged before departure (e-visa/ETA/embassy)
  applyOnline: boolean;
  processingTime: string;
  fee: FeeEstimate;
  passportValidity: string;
  blankPages: string;
  documents: string[];
  /** Extra purpose-specific guidance (student/work/etc. always need a dedicated visa). */
  purposeNote?: string;
  transitNote?: string;
  health: {
    yellowFever: string | null;
    routineAdvice: string;
    insurance: string;
  };
  officialLink?: { label: string; url: string };
  adminNotes?: string;
  /** Where the base rule came from — surfaced for transparency. */
  source: VisaBaseRule['source'];
  updatedAt?: string; // ISO date of admin override, when present
  disclaimer: string;
}
