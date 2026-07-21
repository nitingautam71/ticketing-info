import type { VisaCategory } from './types';
import { SCHENGEN } from './enrichment';

/**
 * Transit guidance for the world's major connection hubs. The general rules:
 *  - If you can enter the country (visa-free/ETA/e-visa in hand), you can transit.
 *  - If a visa is normally required, airside ("sterile") transit is often still
 *    possible — except at hubs that require a transit visa for some nationalities.
 *  - Self-transfers with separate tickets always require entering the country,
 *    so the full entry rules apply, not the transit exemptions.
 */

const HUB_RULES: Record<string, string> = {
  US: 'The USA has NO airside transit — every connection requires passing immigration, so you need ESTA (visa-waiver nationals) or a C-1 transit / B visitor visa. Separate-ticket self-transfers are treated the same as entry.',
  CA: 'Canada requires an eTA or transit visa for all air transits. Some nationalities on China Transit Program / Transit Without Visa routes are exempt on specific flights.',
  GB: 'The UK allows airside transit without a visa for most nationalities, but Direct Airside Transit Visa (DATV) list nationals need a transit visa even without leaving the airport. Landside transit (bag re-check, terminal change) needs Visitor in Transit rules or a visa.',
  CN: 'China offers 240-hour (10-day) visa-free transit for 55 eligible nationalities entering via designated ports when connecting to a third country. Otherwise a transit (G) visa is required.',
  AE: 'Dubai/Abu Dhabi: airside transit under 24h needs no visa. Longer stopovers can use a 48h (free) or 96h (paid) transit visa arranged via the airline, unless your nationality gets visa-on-arrival.',
  QA: 'Doha: airside transit needs no visa. Qatar also offers a free transit visa of up to 96 hours for layovers over 5 hours (airline-arranged), subject to approval.',
  SG: 'Singapore: airside transit generally needs no visa, but nationals of some countries need a visa even for transit. Eligible nationals (e.g. India, China) can use the 96-hour Visa-Free Transit Facility with an onward ticket and a valid visa for Australia, Canada, Japan, NZ, UK, US, Germany or Switzerland.',
  TR: 'Istanbul: airside transit needs no visa for most nationalities. If you must clear immigration (separate tickets, hotel), normal entry rules apply — many nationalities qualify for the e-Visa.',
  IN: 'India requires a transit visa if you leave the international transit area or your layover exceeds 24 hours. Airside same-airport connections under 24h with confirmed onward tickets are exempt.',
  JP: 'Japan: airside transit at the same airport needs no visa ("shore pass" rules may apply for landside). If you change airports (NRT↔HND), full entry rules apply.',
  KR: 'Seoul-Incheon: airside transit needs no visa for most nationalities. K-ETA/visa needed if entering; some nationals qualify for short visa-free transit entry when holding valid visas for the US, Canada, Australia or NZ.',
  AU: 'Australia requires an ETA/eVisitor/visa or a Transit visa (subclass 771) for layovers — only some nationalities are transit-exempt for under-8-hour airside connections.',
  NZ: 'New Zealand: all air transits through Auckland need either an NZeTA (transit) or a transit visa, unless you hold a visa/ETA making you entry-eligible.',
  HK: 'Hong Kong: airside transit needs no visa; most nationalities also get 14–90 days visa-free landside entry, so a stopover in the city is usually possible.',
  ET: 'Addis Ababa: airside transit needs no visa; Ethiopian Airlines arranges free transit visas with hotel packages for long layovers.',
  KE: 'Nairobi: airside transit under 24h is exempt; longer or landside stops need the Kenya eTA (transit category).',
  EG: 'Cairo: airside transit needs no visa; landside transit up to 48h possible for many nationalities with airline escort arrangements.',
  SA: 'Saudi Arabia offers a free 96-hour stopover visa when flying Saudia/flynas, and airside transit needs no visa.',
  DE: 'Frankfurt/Munich: airside transit is visa-free for most, but Airport Transit Visa (ATV) list nationals need one even airside. Landside transit (Schengen entry) requires meeting Schengen entry rules.',
  FR: 'Paris CDG: airside transit is visa-free for most, but Airport Transit Visa (ATV) list nationals need one even airside. Landside transit requires meeting Schengen entry rules.',
  NL: 'Amsterdam Schiphol: airside transit is visa-free for most, but Airport Transit Visa (ATV) list nationals need one even airside. Landside transit requires meeting Schengen entry rules.',
};

const GENERIC_SCHENGEN =
  'Schengen hub: airside transit is visa-free for most nationalities, but Airport Transit Visa (ATV) list nationals need one even without leaving the airport. Entering the terminal landside means full Schengen entry rules apply.';

export function transitNote(destinationCode: string, category: VisaCategory): string {
  const hubRule = HUB_RULES[destinationCode] ?? (SCHENGEN.has(destinationCode) ? GENERIC_SCHENGEN : undefined);
  if (hubRule) return hubRule;

  switch (category) {
    case 'visa_free':
    case 'home_country':
      return 'You can enter this country, so transiting — including separate-ticket self-transfers — is no problem.';
    case 'eta':
    case 'e_visa':
      return 'Airside same-terminal transit is usually visa-exempt, but if you must collect bags, change terminals through immigration, or fly on a separate ticket, you need the full entry authorisation. Confirm with your airline.';
    case 'visa_on_arrival':
      return 'Transit is generally straightforward — you qualify for entry on arrival. Budget time (and cash for fees) if your connection requires passing immigration.';
    case 'visa_required':
      return 'Airside transit without a visa is allowed by many countries, but not all — and any landside connection (separate tickets, bag re-check, overnight) requires a visa. Verify the transit-without-visa policy with your airline before booking.';
    case 'no_admission':
      return 'Entry is not permitted for this passport, and airlines will usually deny boarding even for transit. Route your journey through a different hub.';
  }
}
