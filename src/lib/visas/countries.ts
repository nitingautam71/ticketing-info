import countriesJson from '@/data/visas/countries.json';

export interface VisaCountry {
  code: string; // ISO 3166-1 alpha-2, uppercase
  name: string;
  slug: string;
  continent: string;
}

export const VISA_COUNTRIES: VisaCountry[] = countriesJson as VisaCountry[];

const byCode = new Map(VISA_COUNTRIES.map((c) => [c.code, c]));
const bySlug = new Map(VISA_COUNTRIES.map((c) => [c.slug, c]));

export function countryByCode(code: string): VisaCountry | undefined {
  return byCode.get(code.toUpperCase());
}

export function countryBySlug(slug: string): VisaCountry | undefined {
  return bySlug.get(slug.toLowerCase());
}

/** Resolves user-ish input — ISO2 code, slug, or country name — to a country. */
export function resolveCountry(input: string): VisaCountry | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  if (trimmed.length === 2) {
    const code = byCode.get(trimmed.toUpperCase());
    if (code) return code;
  }
  const slugified = trimmed
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return bySlug.get(slugified);
}

/** Unicode flag emoji from the ISO2 code (regional indicator symbols). */
export function flagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(0x1f1a5 + ch.charCodeAt(0)));
}

/** Countries sorted by name for pickers. */
export const VISA_COUNTRIES_SORTED = [...VISA_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
