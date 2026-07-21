/**
 * Traffic-priority country lists for internal linking and the sitemap. The
 * TOP_PASSPORTS × all-destinations product (~7.9k URLs) is what we submit to
 * search engines; every other pair still resolves on demand and gets indexed
 * through internal links.
 */

// Passport markets we actively serve (see areaServed in structuredData.ts) plus
// the world's highest-outbound-travel passports.
export const TOP_PASSPORTS = [
  'IN', 'US', 'GB', 'CA', 'AU', 'AE', 'PK', 'BD', 'LK', 'NP', 'PH', 'NG', 'ZA', 'KE', 'EG',
  'SA', 'QA', 'KW', 'OM', 'BH', 'CN', 'JP', 'KR', 'SG', 'MY', 'TH', 'ID', 'VN', 'DE', 'FR',
  'IT', 'ES', 'NL', 'PT', 'IE', 'BR', 'MX', 'RU', 'TR', 'PL',
] as const;

// High-intent destinations for related-links blocks and the hub page grid.
export const POPULAR_DESTINATIONS = [
  'US', 'GB', 'CA', 'AU', 'AE', 'SG', 'TH', 'JP', 'FR', 'IT', 'ES', 'DE', 'CH', 'TR', 'EG',
  'SA', 'QA', 'MY', 'ID', 'VN', 'IN', 'CN', 'KR', 'NZ', 'GR', 'PT', 'NL', 'MV', 'MU', 'ZA',
] as const;

// Corridors featured on the /visas hub — highest search volume pairs for our markets.
export const FEATURED_CORRIDORS: { passport: string; destination: string }[] = [
  { passport: 'IN', destination: 'AE' },
  { passport: 'IN', destination: 'US' },
  { passport: 'IN', destination: 'GB' },
  { passport: 'IN', destination: 'TH' },
  { passport: 'IN', destination: 'SG' },
  { passport: 'IN', destination: 'JP' },
  { passport: 'US', destination: 'IN' },
  { passport: 'US', destination: 'GB' },
  { passport: 'US', destination: 'JP' },
  { passport: 'US', destination: 'BR' },
  { passport: 'GB', destination: 'US' },
  { passport: 'GB', destination: 'IN' },
  { passport: 'PK', destination: 'AE' },
  { passport: 'BD', destination: 'MY' },
  { passport: 'PH', destination: 'JP' },
  { passport: 'NG', destination: 'GB' },
];
