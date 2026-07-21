import type { TrainOperator } from '../types';

export const TRAIN_OPERATORS: TrainOperator[] = [
  {
    id: 'amtrak',
    name: 'Amtrak',
    country: 'US',
    website: 'https://www.amtrak.com',
    bookingModel:
      'Assisted booking through our rail desk — Amtrak fares are dynamic and sold via Amtrak.com and authorised travel-agency channels; we confirm live availability and price before ticketing.',
    description:
      'The national passenger railroad of the United States, serving 500+ destinations across 46 states with high-speed Acela, Northeast Regional, corridor and iconic long-distance overnight routes.',
    policies: {
      baggage: 'Two personal items + two carry-on bags free (25 lb / 50 lb limits); up to four checked bags (two free) on routes with checked-baggage service.',
      pets: 'Dogs and cats up to 20 lb (pet + carrier) allowed on most routes up to 7 hours in a carrier, $29–$39 fee, book in advance — not on Auto Train or in sleepers.',
      bikes: 'Trainside or checked bike service on most routes for $10–$20; folding bikes ride free as carry-on. Reserve a bike space when booking.',
      refunds: 'Fully refundable up to 24h after purchase; after that, refundability depends on fare family (Flex fully refundable, Value 75% or eCredit, Saver 50% eCredit within window).',
      accessibility: 'Accessible seating/bedrooms on every train, wheelchair assistance at staffed stations, 10% rail-fare discount for passengers with a disability.',
    },
  },
  {
    id: 'brightline',
    name: 'Brightline',
    country: 'US',
    website: 'https://www.gobrightline.com',
    bookingModel:
      'Assisted booking through our rail desk against Brightline’s dynamic fares, or direct referral to gobrightline.com — we hold your itinerary details either way.',
    description:
      'Privately operated modern intercity rail in Florida linking Miami, Aventura, Fort Lauderdale, Boca Raton, West Palm Beach and Orlando International Airport at up to 125 mph.',
    policies: {
      baggage: 'Two carry-ons + one personal item in SMART; PREMIUM adds checked-style luggage service. No formal weight enforcement below oversized items.',
      pets: 'Small pets (≤25 lb) in carriers welcome for a fee; service animals ride free.',
      bikes: 'Bikes carried in dedicated racks for a small fee, space permitting; folding bikes free.',
      refunds: 'SMART fares refundable to credit; PREMIUM fully refundable before departure. Free changes up to departure.',
      accessibility: 'Level boarding, wheelchair spaces in every coach, accessible restrooms and station assistance on request.',
    },
  },
  {
    id: 'alaska-railroad',
    name: 'Alaska Railroad',
    country: 'US',
    website: 'https://www.alaskarailroad.com',
    bookingModel:
      'Assisted booking through our rail desk — Alaska Railroad seats (especially GoldStar dome cars) sell out months ahead in summer; we confirm availability and package with hotels and cruises.',
    description:
      'Alaska’s flagship scenic railroad running the Denali Star (Anchorage–Denali–Fairbanks) and Coastal Classic (Anchorage–Seward) through some of North America’s most spectacular terrain.',
    policies: {
      baggage: 'Two checked bags (50 lb each) plus carry-on included on mainline trains.',
      pets: 'Pets travel in kennels in the baggage car (fee applies); not permitted in passenger cabins.',
      bikes: 'Bikes checked as baggage for a fee, space permitting.',
      refunds: 'Refundable to 45 days before travel; sliding cancellation fees inside 45 days. Summer departures are high-demand.',
      accessibility: 'Wheelchair lifts at major stations, accessible seating and restrooms on all mainline trains.',
    },
  },
  {
    id: 'indian-railways',
    name: 'Indian Railways (IRCTC)',
    country: 'IN',
    website: 'https://www.irctc.co.in',
    bookingModel:
      'Booked via the IRCTC ecosystem — reserved e-tickets are issued through IRCTC and its authorised agents. Our rail desk handles class selection, quota strategy (General/Tatkal/Premium Tatkal), waitlist monitoring and refunds end to end.',
    description:
      'The world’s fourth-largest rail network: 68,000+ km, 7,000+ stations and 13,000+ daily trains, from semi-high-speed Vande Bharat Express to Rajdhani, Shatabdi, Duronto, Tejas and classic overnight expresses.',
    policies: {
      baggage: 'Free allowance by class (AC First 70 kg, AC 2-Tier 50 kg, AC 3-Tier/Chair Car 40 kg, Sleeper 40 kg); excess bookable through the parcel office.',
      pets: 'Dogs allowed in AC First / First Class coupes (full coupe booking) or the guard’s brake van; not permitted in AC 2/3-Tier, Chair Car or Sleeper.',
      bikes: 'Bicycles and motorbikes travel as luggage/parcel in the brake van — book at the parcel office with valid ID.',
      refunds: 'Governed by Indian Railways refund rules: cancellation charges by class and time before departure; confirmed Tatkal tickets are non-refundable; auto-refund on waitlisted e-tickets that don’t clear.',
      accessibility: 'Divyangjan concessions and quota, wheelchair assistance at major stations (book via IRCTC or station manager), accessible coaches on select trains.',
    },
  },
];

export function operatorById(id: string): TrainOperator | undefined {
  return TRAIN_OPERATORS.find((o) => o.id === id);
}
