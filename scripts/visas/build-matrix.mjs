// Compiles the vendored Passport Index dataset (MIT, github.com/ilyankou/passport-index-dataset)
// into the two generated files the visa engine imports:
//
//   src/data/visas/matrix.json     — { destinations: string[], rows: { [passportISO2]: token[] } }
//   src/data/visas/countries.json  — [{ code, name, slug, continent }] for every passport/destination
//
// Tokens: "F<days>" visa-free with a known stay, "F" visa-free (unspecified stay),
// "VOA" visa on arrival, "EV" e-visa, "ETA" electronic travel authorisation,
// "VR" visa required, "X" no admission, "H" home country.
//
// Run after refreshing the CSV: node scripts/visas/build-matrix.mjs
// Both outputs are committed — the app never parses the CSV at runtime.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const csvPath = join(root, 'src', 'data', 'visas', 'passport-index-matrix-iso2.csv');

const NAME_OVERRIDES = {
  CD: 'DR Congo',
  CG: 'Republic of the Congo',
  CI: 'Ivory Coast',
  CZ: 'Czech Republic',
  FM: 'Micronesia',
  HK: 'Hong Kong',
  KP: 'North Korea',
  KR: 'South Korea',
  LA: 'Laos',
  MM: 'Myanmar',
  MO: 'Macau',
  PS: 'Palestine',
  ST: 'Sao Tome and Principe',
  SZ: 'Eswatini',
  TL: 'Timor-Leste',
  TW: 'Taiwan',
  VA: 'Vatican City',
  XK: 'Kosovo',
};

const CONTINENTS = {
  Africa:
    'DZ AO BJ BW BF BI CM CV CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW',
  Asia:
    'AF AM AZ BH BD BT BN KH CN CY GE HK IN ID IR IQ IL JP JO KZ KW KG LA LB MO MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TW TJ TH TL TR TM AE UZ VN YE',
  Europe:
    'AL AD AT BY BE BA BG HR CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA',
  'North America':
    'AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US',
  'South America': 'AR BO BR CL CO EC GY PY PE SR UY VE',
  Oceania: 'AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU',
};

const continentByCode = {};
for (const [continent, codes] of Object.entries(CONTINENTS)) {
  for (const code of codes.split(/\s+/)) continentByCode[code] = continent;
}

function tokenFor(value) {
  const v = value.trim().toLowerCase();
  if (v === '-1') return 'H';
  if (v === 'visa required') return 'VR';
  if (v === 'visa on arrival') return 'VOA';
  if (v === 'e-visa') return 'EV';
  if (v === 'eta') return 'ETA';
  if (v === 'no admission') return 'X';
  if (v === 'visa free') return 'F';
  if (/^\d+$/.test(v)) return `F${v}`;
  throw new Error(`Unknown matrix value: "${value}"`);
}

const lines = readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
const destinations = lines[0].split(',').slice(1).map((c) => c.trim()).filter(Boolean);

const rows = {};
for (const line of lines.slice(1)) {
  const cells = line.split(',');
  const passport = cells[0].trim();
  const values = cells.slice(1, destinations.length + 1);
  if (values.length !== destinations.length) {
    throw new Error(`Row ${passport}: expected ${destinations.length} cells, got ${values.length}`);
  }
  rows[passport] = values.map(tokenFor);
}

const allCodes = [...new Set([...destinations, ...Object.keys(rows)])].sort();
const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

const countries = allCodes.map((code) => {
  const name = NAME_OVERRIDES[code] ?? displayNames.of(code);
  if (!name || name === code) throw new Error(`No display name for ${code} — add a NAME_OVERRIDES entry`);
  const continent = continentByCode[code];
  if (!continent) throw new Error(`No continent mapping for ${code} (${name})`);
  const slug = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return { code, name, slug, continent };
});

const slugs = new Set();
for (const c of countries) {
  if (slugs.has(c.slug)) throw new Error(`Duplicate slug: ${c.slug}`);
  slugs.add(c.slug);
}

writeFileSync(join(root, 'src', 'data', 'visas', 'matrix.json'), JSON.stringify({ destinations, rows }));
writeFileSync(join(root, 'src', 'data', 'visas', 'countries.json'), JSON.stringify(countries, null, 1));

console.log(`matrix.json: ${Object.keys(rows).length} passports x ${destinations.length} destinations`);
console.log(`countries.json: ${countries.length} countries`);
