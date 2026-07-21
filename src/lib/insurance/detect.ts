import { VISA_COUNTRIES } from '@/lib/visas/countries';

/**
 * Free-text trip detection for the AI advisor.
 *
 * Matching official country names alone is not enough: travellers write "USA
 * trip from India", "cover for the UK", "Dubai holiday". Worse, a single
 * detected country used to be treated as the *destination*, so "from India"
 * made India the destination and the advisor answered about domestic Indian
 * cover for a US trip.
 *
 * This module fixes both: alias matching (with a false-positive guard for the
 * ambiguous short forms) and directional cues that tell "from X" (residence)
 * apart from "to X" (destination).
 */

/** Aliases safe to match case-insensitively — none are ordinary English words. */
const LOOSE_ALIASES: Record<string, string> = {
  usa: 'US',
  'u.s.a.': 'US',
  'u.s.a': 'US',
  america: 'US',
  'the states': 'US',
  britain: 'GB',
  'great britain': 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  uae: 'AE',
  emirates: 'AE',
  dubai: 'AE',
  'abu dhabi': 'AE',
  holland: 'NL',
  turkey: 'TR',
  czechia: 'CZ',
  korea: 'KR',
  bali: 'ID',
  // Schengen questions are really Europe questions; France stands in as the
  // representative Schengen state for grounding (the €30k rule is area-wide).
  schengen: 'FR',
};

/**
 * Ambiguous abbreviations — matched only when written in uppercase in the
 * original text. "US trip" counts; "best plan for us" does not.
 */
const STRICT_ALIASES: Record<string, string> = {
  US: 'US',
  USA: 'US',
  UK: 'GB',
  UAE: 'AE',
  NZ: 'NZ',
};

const RESIDENCE_CUES = /\b(from|resident of|residing in|living in|live in|based in|citizen of|i'?m from|i am from)\s*(the\s+)?$/i;
const DESTINATION_CUES = /\b(to|into|visiting|visit|travell?ing to|going to|trip to|holiday in|vacation in|in)\s*(the\s+)?$/i;

interface Mention {
  code: string;
  index: number;
  len: number;
}

function isBoundary(char: string | undefined, pattern: RegExp): boolean {
  return char === undefined || pattern.test(char);
}

/** All country mentions in the text, de-overlapped, longest match first. */
export function countryMentions(question: string): Mention[] {
  const lower = question.toLowerCase();
  const hits: Mention[] = [];

  const scan = (haystack: string, needle: string, code: string, boundary: RegExp) => {
    let idx = haystack.indexOf(needle);
    while (idx !== -1) {
      const before = isBoundary(idx === 0 ? undefined : haystack[idx - 1], boundary);
      const after = isBoundary(haystack[idx + needle.length], boundary);
      if (before && after) hits.push({ code, index: idx, len: needle.length });
      idx = haystack.indexOf(needle, idx + 1);
    }
  };

  const NON_WORD = /[^a-z]/;
  for (const country of VISA_COUNTRIES) scan(lower, country.name.toLowerCase(), country.code, NON_WORD);
  for (const [alias, code] of Object.entries(LOOSE_ALIASES)) scan(lower, alias, code, /[^a-z]/);
  for (const [alias, code] of Object.entries(STRICT_ALIASES)) scan(question, alias, code, /[^A-Za-z]/);

  // Earliest position wins; at equal position the longer name wins ("Papua New
  // Guinea" over "Guinea"). Drop overlaps and repeats of the same country.
  hits.sort((a, b) => a.index - b.index || b.len - a.len);
  const kept: Mention[] = [];
  for (const hit of hits) {
    if (kept.some((k) => hit.index < k.index + k.len && hit.index + hit.len > k.index)) continue;
    if (kept.some((k) => k.code === hit.code)) continue;
    kept.push(hit);
  }
  return kept;
}

export interface TripContext {
  destinationCode?: string;
  residenceCode?: string;
}

/**
 * Resolve which country is the destination and which is the traveller's
 * residence. Directional cues win; anything untagged falls back to
 * "first mentioned is the destination".
 */
export function detectTripContext(question: string): TripContext {
  const mentions = countryMentions(question);
  let destinationCode: string | undefined;
  let residenceCode: string | undefined;
  const untagged: string[] = [];

  for (const mention of mentions) {
    const preceding = question.slice(Math.max(0, mention.index - 30), mention.index);
    if (!residenceCode && RESIDENCE_CUES.test(preceding)) residenceCode = mention.code;
    else if (!destinationCode && DESTINATION_CUES.test(preceding)) destinationCode = mention.code;
    else untagged.push(mention.code);
  }

  for (const code of untagged) {
    if (!destinationCode && code !== residenceCode) destinationCode = code;
    else if (!residenceCode && code !== destinationCode) residenceCode = code;
  }

  return { destinationCode, residenceCode };
}
