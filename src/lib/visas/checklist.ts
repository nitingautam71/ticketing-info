import type { TravelPurpose, VisaCategory } from './types';

/**
 * Document checklist generator: base travel documents + what the visa category
 * demands + what the travel purpose adds. Used for the results page checklist,
 * the printable version, and the AI assistant's grounding context.
 */

const BASE_DOCUMENTS = [
  'Passport meeting the validity rule below',
  'Confirmed return or onward ticket',
  'Proof of sufficient funds for your stay',
  'Accommodation details (hotel booking or host address)',
];

const CATEGORY_DOCUMENTS: Record<VisaCategory, string[]> = {
  visa_free: [],
  home_country: [],
  eta: ['Approved electronic travel authorisation linked to your passport before boarding'],
  e_visa: [
    'Printed or digital e-visa approval letter',
    'Digital passport-style photo (per portal specs)',
    'Scanned passport bio page for the online application',
  ],
  visa_on_arrival: [
    'Passport photos (2, usually 2x2in / 35x45mm)',
    'Visa fee in cash (USD or local currency)',
    'Completed arrival/visa form (often handed out in-flight)',
  ],
  visa_required: [
    'Completed visa application form',
    'Recent passport photos meeting embassy specs',
    'Bank statements (usually last 3–6 months)',
    'Travel itinerary and flight reservations',
    'Travel insurance certificate covering the stay',
    'Employment letter or proof of occupation',
  ],
  no_admission: [],
};

const PURPOSE_DOCUMENTS: Record<TravelPurpose, string[]> = {
  tourism: [],
  business: [
    'Invitation letter from the host company',
    'Letter from your employer stating the purpose of travel',
    'Company registration/trade licence copy of the inviting party (some embassies)',
  ],
  transit: ['Boarding pass or confirmed ticket for the onward flight', 'Visa for your final destination (if required there)'],
  student: [
    'Admission/enrolment letter from the institution',
    'Proof of tuition payment or scholarship',
    'Proof of funds for the study period',
    'Academic transcripts and certificates',
  ],
  work: [
    'Signed employment contract or job offer',
    'Work permit / labour-market approval from the destination authority',
    'Professional qualification certificates (attested where required)',
    'Police clearance certificate',
    'Medical examination certificate (many countries)',
  ],
  medical: [
    'Medical invitation/appointment letter from the treating hospital',
    'Referral or diagnosis letter from your home doctor',
    'Proof of funds for treatment costs',
  ],
  family_visit: [
    'Invitation letter from your host',
    'Host’s ID/residence permit copy',
    'Proof of relationship (birth/marriage certificates where relevant)',
  ],
  digital_nomad: [
    'Proof of ongoing remote income (contracts, payslips — thresholds vary by country)',
    'Proof of health insurance valid in the destination',
    'Clean criminal record certificate (for dedicated nomad-visa programmes)',
  ],
};

// Purposes that almost always need a dedicated long-stay visa regardless of the
// short-stay category the matrix reports.
export const LONG_STAY_PURPOSES: TravelPurpose[] = ['student', 'work', 'digital_nomad'];

export function purposeNote(purpose: TravelPurpose, categoryLabel: string): string | undefined {
  switch (purpose) {
    case 'student':
      return `The result below (${categoryLabel}) covers short visits only. Enrolling in a course of study virtually always requires a dedicated student visa arranged through the embassy before travel.`;
    case 'work':
      return `The result below (${categoryLabel}) covers short visits only. Taking up employment requires a work visa/permit sponsored by your employer — never travel on a visitor status to start a job.`;
    case 'digital_nomad':
      return `Short visits under the rule below (${categoryLabel}) usually tolerate incidental remote work, but for extended remote-work stays check whether the destination offers a dedicated digital-nomad visa with income requirements.`;
    case 'medical':
      return 'Many countries issue a specific medical visa (often faster, with attendant visas for family). Mention treatment when applying.';
    case 'business':
      return 'Business meetings, conferences and negotiations are normally covered by the same short-stay rules as tourism — but productive work is not.';
    default:
      return undefined;
  }
}

export function buildChecklist(category: VisaCategory, purpose: TravelPurpose): string[] {
  if (category === 'no_admission') return [];
  const docs = [...BASE_DOCUMENTS, ...CATEGORY_DOCUMENTS[category], ...PURPOSE_DOCUMENTS[purpose]];
  return [...new Set(docs)];
}
