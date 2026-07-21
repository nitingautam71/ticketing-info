import type { FeeEstimate, VisaCategory } from './types';

/**
 * Curated per-destination enrichment layered on top of the base rules matrix:
 * official application portals, known government fees, passport-validity rules,
 * and health requirements. Everything here is destination-scoped defaults —
 * where a value isn't curated, the engine falls back to honest category-level
 * estimates that are labelled as such in the UI.
 */

// Official government portals for the destination's visa/entry programme.
// Kept to sources we can attribute to the destination government (or its
// contracted application system) — when a destination isn't listed, the UI
// tells users to confirm with the nearest embassy instead of guessing a URL.
export const OFFICIAL_LINKS: Record<string, { label: string; url: string }> = {
  US: { label: 'U.S. Department of State — travel.state.gov', url: 'https://travel.state.gov/content/travel/en/us-visas.html' },
  GB: { label: 'GOV.UK — Check if you need a UK visa', url: 'https://www.gov.uk/check-uk-visa' },
  CA: { label: 'IRCC — Visit Canada', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html' },
  AU: { label: 'Australian Home Affairs — Immi', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder' },
  NZ: { label: 'Immigration New Zealand', url: 'https://www.immigration.govt.nz/' },
  IN: { label: 'Indian e-Visa (official)', url: 'https://indianvisaonline.gov.in/' },
  CN: { label: 'Chinese Visa Application Service Center', url: 'https://www.visaforchina.cn/' },
  JP: { label: 'Ministry of Foreign Affairs of Japan — Visa', url: 'https://www.mofa.go.jp/j_info/visit/visa/' },
  KR: { label: 'Korea Visa Portal', url: 'https://www.visa.go.kr/' },
  SG: { label: 'ICA Singapore', url: 'https://www.ica.gov.sg/' },
  TH: { label: 'Thailand Official E-Visa', url: 'https://www.thaievisa.go.th/' },
  VN: { label: 'Vietnam National E-Visa', url: 'https://evisa.gov.vn/' },
  ID: { label: 'Indonesia Official e-Visa', url: 'https://evisa.imigrasi.go.id/' },
  MY: { label: 'Immigration Department of Malaysia', url: 'https://www.imi.gov.my/' },
  PH: { label: 'Philippines Bureau of Immigration', url: 'https://immigration.gov.ph/' },
  KH: { label: 'Cambodia Official e-Visa', url: 'https://www.evisa.gov.kh/' },
  LA: { label: 'Laos Official eVisa', url: 'https://laoevisa.gov.la/' },
  MM: { label: 'Myanmar eVisa', url: 'https://evisa.moip.gov.mm/' },
  LK: { label: 'Sri Lanka ETA', url: 'https://eta.gov.lk/' },
  NP: { label: 'Nepal Department of Immigration', url: 'https://nepalimmigration.gov.np/' },
  PK: { label: 'Pakistan Online Visa System', url: 'https://visa.nadra.gov.pk/' },
  MV: { label: 'Maldives Immigration — IMUGA', url: 'https://imuga.immigration.gov.mv/' },
  AE: { label: 'UAE Federal Authority (ICP)', url: 'https://icp.gov.ae/' },
  SA: { label: 'Visit Saudi eVisa', url: 'https://visa.visitsaudi.com/' },
  QA: { label: 'Qatar — Hayya Portal', url: 'https://hayya.qa/' },
  OM: { label: 'Royal Oman Police eVisa', url: 'https://evisa.rop.gov.om/' },
  BH: { label: 'Bahrain eVisa', url: 'https://www.evisa.gov.bh/' },
  KW: { label: 'Kuwait MOI eVisa', url: 'https://kuwaitvisa.moi.gov.kw/' },
  IL: { label: 'Israel Government Portal', url: 'https://www.gov.il/en/departments/population_and_immigration_authority' },
  TR: { label: 'Türkiye Official e-Visa', url: 'https://www.evisa.gov.tr/' },
  GE: { label: 'Georgia e-VISA Portal', url: 'https://www.evisa.gov.ge/' },
  AM: { label: 'Armenia e-Visa', url: 'https://evisa.mfa.am/' },
  AZ: { label: 'Azerbaijan ASAN Visa', url: 'https://evisa.gov.az/' },
  UZ: { label: 'Uzbekistan e-Visa', url: 'https://e-visa.gov.uz/' },
  RU: { label: 'Russia Unified e-Visa', url: 'https://evisa.kdmid.ru/' },
  EG: { label: 'Egypt Official e-Visa', url: 'https://visa2egypt.gov.eg/' },
  KE: { label: 'Kenya eTA (official)', url: 'https://www.etakenya.go.ke/' },
  TZ: { label: 'Tanzania Immigration e-Visa', url: 'https://visa.immigration.go.tz/' },
  ET: { label: 'Ethiopia e-Visa', url: 'https://www.evisa.gov.et/' },
  UG: { label: 'Uganda Electronic Visa', url: 'https://visas.immigration.go.ug/' },
  RW: { label: 'Rwanda — Irembo', url: 'https://irembo.gov.rw/' },
  ZA: { label: 'South Africa Home Affairs', url: 'https://www.dha.gov.za/' },
  NG: { label: 'Nigeria Immigration Service', url: 'https://immigration.gov.ng/' },
  ZW: { label: 'Zimbabwe eVisa', url: 'https://www.evisa.gov.zw/' },
  ZM: { label: 'Zambia Immigration e-Services', url: 'https://eservices.zambiaimmigration.gov.zm/' },
  MZ: { label: 'Mozambique eVisa', url: 'https://evisa.gov.mz/' },
  BR: { label: 'Brazilian Government — Visas', url: 'https://www.gov.br/mre/en/subjects/visas' },
  MX: { label: 'Instituto Nacional de Migración (Mexico)', url: 'https://www.inm.gob.mx/' },
  AR: { label: 'Migraciones Argentina', url: 'https://www.migraciones.gob.ar/' },
  CO: { label: 'Cancillería de Colombia — Visas', url: 'https://www.cancilleria.gov.co/tramites_servicios/visa' },
  PE: { label: 'Migraciones Perú', url: 'https://www.gob.pe/migraciones' },
  CU: { label: 'Cuba Official eVisa', url: 'https://evisacuba.cu/' },
  FR: { label: 'France-Visas (official)', url: 'https://france-visas.gouv.fr/' },
  DE: { label: 'German Federal Foreign Office — Visa', url: 'https://www.auswaertiges-amt.de/en/visa-service' },
  ES: { label: 'Spain Ministry of Foreign Affairs', url: 'https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Servicios-consulares.aspx' },
  IT: { label: 'Visto per l’Italia (official)', url: 'https://vistoperitalia.esteri.it/' },
  NL: { label: 'Netherlands Worldwide — Visas', url: 'https://www.netherlandsworldwide.nl/visa-the-netherlands' },
  CH: { label: 'Swiss State Secretariat for Migration', url: 'https://www.sem.admin.ch/' },
  PT: { label: 'Portugal — Vistos MNE', url: 'https://vistos.mne.gov.pt/' },
  AT: { label: 'Austria Foreign Ministry — Travel & Visa', url: 'https://www.bmeia.gv.at/en/travel-stay' },
  GR: { label: 'Greece Ministry of Foreign Affairs', url: 'https://www.mfa.gr/en/visas/' },
  IE: { label: 'Irish Immigration Service', url: 'https://www.irishimmigration.ie/' },
  NO: { label: 'UDI Norway', url: 'https://www.udi.no/en/' },
  SE: { label: 'Swedish Migration Agency', url: 'https://www.migrationsverket.se/en' },
  DK: { label: 'New to Denmark (official)', url: 'https://www.nyidanmark.dk/en-GB' },
  FI: { label: 'Finnish Immigration Service', url: 'https://migri.fi/en/' },
  IS: { label: 'Icelandic Directorate of Immigration', url: 'https://island.is/en/o/directorate-of-immigration' },
  PL: { label: 'Poland — Gov.pl Visas', url: 'https://www.gov.pl/web/diplomacy/visas' },
  CZ: { label: 'Czech Ministry of Foreign Affairs', url: 'https://mzv.gov.cz/jnp/en/information_for_aliens/index.html' },
  HR: { label: 'Croatia Ministry of the Interior', url: 'https://mup.gov.hr/aliens-281621/281621' },
  HK: { label: 'Hong Kong Immigration Department', url: 'https://www.immd.gov.hk/' },
  TW: { label: 'Taiwan Bureau of Consular Affairs', url: 'https://www.boca.gov.tw/' },
  FJ: { label: 'Fiji Immigration', url: 'https://www.immigration.gov.fj/' },
  JM: { label: 'PICA Jamaica', url: 'https://www.pica.gov.jm/' },
  DO: { label: 'Migración República Dominicana', url: 'https://migracion.gob.do/' },
  CR: { label: 'Migración Costa Rica', url: 'https://www.migracion.go.cr/' },
  PA: { label: 'Migración Panamá', url: 'https://www.migracion.gob.pa/' },
};

// Known official fees in USD for (destination, category) pairs. Anything not
// listed falls back to CATEGORY_FEE_DEFAULTS and is labelled an estimate.
const KNOWN_FEES: Record<string, Partial<Record<VisaCategory, { amountUsd: number; label: string }>>> = {
  US: {
    eta: { amountUsd: 21, label: '$21 ESTA fee' },
    visa_required: { amountUsd: 185, label: '$185 B1/B2 visitor visa (MRV) fee' },
  },
  GB: {
    eta: { amountUsd: 20, label: '£16 UK ETA fee (≈ $20)' },
    visa_required: { amountUsd: 160, label: '£127 Standard Visitor visa (≈ $160)' },
  },
  CA: {
    eta: { amountUsd: 5, label: 'CAD $7 eTA fee (≈ $5)' },
    visa_required: { amountUsd: 75, label: 'CAD $100 visitor visa (≈ $75)' },
  },
  AU: {
    eta: { amountUsd: 13, label: 'A$20 ETA app fee (≈ $13)' },
    e_visa: { amountUsd: 13, label: 'A$20 ETA app fee (≈ $13); eVisitor is free' },
    visa_required: { amountUsd: 130, label: 'A$195 Visitor visa 600 (≈ $130)' },
  },
  NZ: {
    eta: { amountUsd: 65, label: 'NZeTA + IVL levy (≈ $65 combined)' },
    visa_required: { amountUsd: 235, label: 'NZ$341 visitor visa (≈ $235)' },
  },
  IN: { e_visa: { amountUsd: 40, label: '$25–$80 Indian e-Visa (by duration)' } },
  TR: { e_visa: { amountUsd: 50, label: '≈ $50 Türkiye e-Visa (varies by nationality)' } },
  VN: { e_visa: { amountUsd: 25, label: '$25 Vietnam e-Visa (single entry)' } },
  TH: { e_visa: { amountUsd: 40, label: '≈ $40 Thailand e-Visa' } },
  KH: { e_visa: { amountUsd: 30, label: '$30 Cambodia e-Visa (plus $6 processing)' } },
  LK: { eta: { amountUsd: 50, label: '$50 Sri Lanka ETA (tourist)' } },
  EG: { e_visa: { amountUsd: 25, label: '$25 Egypt e-Visa (single entry)' } },
  KE: { eta: { amountUsd: 34, label: '$32.50 + fees Kenya eTA (≈ $34)' } },
  SA: { e_visa: { amountUsd: 125, label: 'SAR 480 incl. insurance (≈ $125)' } },
  RU: { e_visa: { amountUsd: 52, label: '$52 Russia unified e-Visa' } },
  JP: { visa_required: { amountUsd: 22, label: '¥3,000 single-entry visa (≈ $22)' } },
};

// Schengen members share the €90 short-stay fee and the 3-months-beyond-departure
// passport rule.
export const SCHENGEN = new Set([
  'AT', 'BE', 'BG', 'HR', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IT', 'LV', 'LI',
  'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'CH',
]);

const CATEGORY_FEE_DEFAULTS: Record<VisaCategory, { amountUsd: number; label: string }> = {
  visa_free: { amountUsd: 0, label: 'No visa fee' },
  home_country: { amountUsd: 0, label: 'No visa needed' },
  eta: { amountUsd: 20, label: '≈ $20 typical travel-authorisation fee' },
  e_visa: { amountUsd: 50, label: '≈ $50 typical e-visa fee' },
  visa_on_arrival: { amountUsd: 35, label: '≈ $35 typical visa-on-arrival fee (bring cash)' },
  visa_required: { amountUsd: 80, label: '≈ $80 typical embassy visa fee' },
  no_admission: { amountUsd: 0, label: 'Entry not permitted' },
};

export function feeEstimate(destinationCode: string, category: VisaCategory): FeeEstimate {
  if (SCHENGEN.has(destinationCode) && category === 'visa_required') {
    return { amountUsd: 97, official: true, label: '€90 Schengen short-stay visa fee (≈ $97)' };
  }
  const known = KNOWN_FEES[destinationCode]?.[category];
  if (known) return { ...known, official: true };
  return { ...CATEGORY_FEE_DEFAULTS[category], official: false };
}

export const CATEGORY_PROCESSING: Record<VisaCategory, string> = {
  visa_free: 'No application needed',
  home_country: 'No application needed',
  eta: 'Usually minutes — allow up to 72 hours',
  e_visa: 'Typically 3–7 business days online',
  visa_on_arrival: 'Issued at the border on arrival',
  visa_required: 'Typically 5–15+ business days via embassy or visa centre',
  no_admission: 'Not applicable',
};

export const CATEGORY_LABELS: Record<VisaCategory, string> = {
  visa_free: 'Visa Free',
  visa_on_arrival: 'Visa on Arrival',
  e_visa: 'e-Visa Required',
  eta: 'Electronic Travel Authorisation (ETA)',
  visa_required: 'Embassy Visa Required',
  no_admission: 'Entry Not Permitted',
  home_country: 'Home Country',
};

// Destinations that strictly enforce 6 months of passport validity on arrival.
const STRICT_SIX_MONTH = new Set([
  'CN', 'IN', 'TH', 'ID', 'MY', 'SG', 'VN', 'KH', 'LA', 'MM', 'PH', 'LK', 'NP', 'BD', 'BN', 'TL',
  'AE', 'SA', 'QA', 'OM', 'KW', 'BH', 'JO', 'IQ', 'IR', 'IL', 'EG', 'KE', 'TZ', 'UG', 'ET', 'NG',
  'GH', 'CI', 'CM', 'ZW', 'ZM', 'MZ', 'MG', 'BW', 'NA', 'EC', 'BO', 'PY', 'SR', 'GY', 'FJ', 'WS',
  'TO', 'VU', 'PG', 'MV', 'PK', 'AF', 'TR',
]);

// Destinations where a passport valid for the length of stay is accepted.
const DURATION_OF_STAY = new Set(['US', 'CA', 'AU', 'NZ', 'GB', 'IE', 'MX', 'AR', 'CL', 'UY', 'HK', 'MO', 'JP', 'KR', 'ZA']);

export function passportValidityRule(destinationCode: string): string {
  if (SCHENGEN.has(destinationCode)) {
    return 'Valid 3 months beyond your planned departure from the Schengen area, and issued within the last 10 years';
  }
  if (STRICT_SIX_MONTH.has(destinationCode)) {
    return 'At least 6 months validity on arrival — strictly enforced';
  }
  if (DURATION_OF_STAY.has(destinationCode)) {
    return 'Valid for the full duration of your stay (6 months recommended as a buffer)';
  }
  return 'At least 6 months validity on arrival recommended';
}

export function blankPagesRule(destinationCode: string): string {
  if (destinationCode === 'ZA') return '2 consecutive blank visa pages required';
  return 'At least 1–2 blank visa pages';
}

// WHO-listed countries with risk of yellow fever transmission. Arriving FROM
// one of these usually triggers certificate checks worldwide; travelling TO one
// means vaccination is recommended (and often required if transiting others after).
const YELLOW_FEVER_RISK = new Set([
  'AO', 'BJ', 'BF', 'BI', 'CM', 'CF', 'TD', 'CG', 'CD', 'CI', 'GQ', 'ET', 'GA', 'GM', 'GH', 'GN',
  'GW', 'KE', 'LR', 'ML', 'MR', 'NE', 'NG', 'RW', 'SN', 'SL', 'SS', 'SD', 'TG', 'UG', 'ZM',
  'AR', 'BO', 'BR', 'CO', 'EC', 'GY', 'PA', 'PY', 'PE', 'SR', 'TT', 'VE',
]);

export function yellowFeverNote(destinationCode: string): string | null {
  if (YELLOW_FEVER_RISK.has(destinationCode)) {
    return 'Yellow fever vaccination is recommended for this destination and the certificate may be checked on arrival. It becomes mandatory for onward travel to many countries.';
  }
  return 'Yellow fever certificate required only if you arrive from (or transited through) a country with risk of yellow fever transmission.';
}
