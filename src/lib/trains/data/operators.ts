import type { TrainOperator } from '../types';

/**
 * Operator registry. Only `enabled` operators are active in search, pages,
 * sitemap and AI grounding. The platform is Amtrak-only today; Brightline,
 * Alaska Railroad and VIA Rail are staged as disabled placeholders that can be
 * switched on by flipping `enabled` (configuration, not code) once their
 * timetables and booking paths are ready.
 */
export const TRAIN_OPERATORS: TrainOperator[] = [
  {
    id: 'amtrak',
    name: 'Amtrak',
    country: 'US',
    website: 'https://www.amtrak.com',
    enabled: true,
    bookingModel:
      'Assisted booking through our rail desk — Amtrak fares are dynamic and sold via Amtrak.com and authorised travel-agency channels; we confirm live availability and price before ticketing.',
    description:
      'The national passenger railroad of the United States, serving 500+ destinations across 46 states with high-speed Acela, the Northeast Corridor, state-supported corridors, and iconic long-distance overnight routes coast to coast.',
    policies: {
      baggage: 'Two personal items + two carry-on bags free (25 lb / 50 lb limits); up to four checked bags (two free) on routes with checked-baggage service.',
      pets: 'Dogs and cats up to 20 lb (pet + carrier) allowed on most routes up to 7 hours in a carrier, $29–$39 fee, book in advance — not on Auto Train or in sleepers.',
      bikes: 'Trainside or checked bike service on most routes for $10–$20; folding bikes ride free as carry-on. Reserve a bike space when booking.',
      refunds: 'Fully refundable up to 24h after purchase; after that, refundability depends on fare family (Flex fully refundable, Value 75% or eCredit, Saver 50% eCredit within window).',
      accessibility: 'Accessible seating/bedrooms on every train, wheelchair assistance at staffed stations, 10% rail-fare discount for passengers with a disability.',
    },
  },

  // ---- Disabled placeholders — enable via configuration when ready ----
  {
    id: 'brightline',
    name: 'Brightline',
    country: 'US',
    website: 'https://www.gobrightline.com',
    enabled: false,
    bookingModel:
      'Planned: assisted booking against Brightline’s dynamic fares, or direct referral to gobrightline.com. Not yet active on the platform.',
    description:
      'Privately operated modern intercity rail in Florida (Miami–Orlando). Staged for a future release; not part of the current Amtrak-only experience.',
    policies: {
      baggage: 'Two carry-ons + one personal item in SMART; PREMIUM adds checked-style luggage service.',
      pets: 'Small pets (≤25 lb) in carriers welcome for a fee; service animals ride free.',
      bikes: 'Bikes carried in dedicated racks for a small fee, space permitting; folding bikes free.',
      refunds: 'SMART fares refundable to credit; PREMIUM fully refundable before departure.',
      accessibility: 'Level boarding, wheelchair spaces in every coach, accessible restrooms and station assistance on request.',
    },
  },
  {
    id: 'alaska-railroad',
    name: 'Alaska Railroad',
    country: 'US',
    website: 'https://www.alaskarailroad.com',
    enabled: false,
    bookingModel:
      'Planned: assisted booking and cruise/hotel packaging for the seasonal scenic routes. Not yet active on the platform.',
    description:
      'Alaska’s flagship scenic railroad (Anchorage–Denali–Fairbanks and Anchorage–Seward). Staged for a future release; not part of the current Amtrak-only experience.',
    policies: {
      baggage: 'Two checked bags (50 lb each) plus carry-on included on mainline trains.',
      pets: 'Pets travel in kennels in the baggage car (fee applies); not permitted in passenger cabins.',
      bikes: 'Bikes checked as baggage for a fee, space permitting.',
      refunds: 'Refundable to 45 days before travel; sliding cancellation fees inside 45 days.',
      accessibility: 'Wheelchair lifts at major stations, accessible seating and restrooms on all mainline trains.',
    },
  },
  {
    id: 'via-rail',
    name: 'VIA Rail Canada',
    country: 'CA',
    website: 'https://www.viarail.ca',
    enabled: false,
    bookingModel:
      'Planned: cross-border itineraries connecting Amtrak with VIA Rail (e.g. onward from the Maple Leaf and Adirondack routes). Not yet active on the platform.',
    description:
      'Canada’s national passenger rail operator. Reserved as the first cross-border expansion target once North American coverage opens up; not part of the current US experience.',
    policies: {
      baggage: 'Two carry-on items plus checked baggage on most routes.',
      pets: 'Small pets in carriers on most corridor trains for a fee; service animals ride free.',
      bikes: 'Checked bicycle service on many routes, space permitting.',
      refunds: 'Refundability depends on fare type (Escape, Economy, Business).',
      accessibility: 'Accessible seating and assistance across the network; advance notice recommended.',
    },
  },
];

export function operatorById(id: string): TrainOperator | undefined {
  return TRAIN_OPERATORS.find((o) => o.id === id);
}

/** Operators active in the current experience (Amtrak today). */
export function enabledOperators(): TrainOperator[] {
  return TRAIN_OPERATORS.filter((o) => o.enabled);
}

export function isOperatorEnabled(id: string): boolean {
  return operatorById(id)?.enabled ?? false;
}
