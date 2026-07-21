import type { CoverageKey } from './types';

/** Display metadata + plain-English explanation for every comparable benefit.
 * Order here is the canonical display order in compare tables and plan pages. */
export const COVERAGE_INFO: Record<CoverageKey, { label: string; explain: string }> = {
  emergency_medical: {
    label: 'Emergency Medical',
    explain: 'Hospitalisation, physician fees, diagnostics and prescribed medicines when you fall sick or get injured abroad. The single most important number on any travel policy.',
  },
  medical_evacuation: {
    label: 'Emergency Evacuation',
    explain: 'Air-ambulance or medically-supervised transport to the nearest adequate hospital — routinely a five-to-six-figure cost from remote areas, cruise ships or mountains.',
  },
  repatriation: {
    label: 'Medical Repatriation',
    explain: 'Transport home for continued treatment, or repatriation of mortal remains — arranged and paid by the insurer’s assistance company.',
  },
  trip_cancellation: {
    label: 'Trip Cancellation',
    explain: 'Refunds prepaid, non-refundable trip costs when you must cancel for a covered reason (illness, injury, death in family, and other listed events) before departure.',
  },
  trip_interruption: {
    label: 'Trip Interruption',
    explain: 'Reimburses the unused portion of your trip and extra transport home when a covered event cuts the trip short after departure.',
  },
  trip_delay: {
    label: 'Trip Delay',
    explain: 'Fixed or per-day allowance for meals, lodging and essentials when your departure is delayed beyond the policy’s waiting period (typically 5–12 hours).',
  },
  missed_connection: {
    label: 'Missed Connection',
    explain: 'Extra transport costs to catch up with your itinerary (or cruise at the next port) after a delayed inbound leg makes you miss a connection.',
  },
  baggage_loss: {
    label: 'Lost / Damaged Baggage',
    explain: 'Reimbursement for checked baggage lost, stolen or destroyed by a carrier, subject to per-item limits and depreciation.',
  },
  baggage_delay: {
    label: 'Baggage Delay',
    explain: 'Emergency purchases (clothes, toiletries) when checked bags are delayed beyond the waiting period, usually 12–24 hours.',
  },
  passport_loss: {
    label: 'Passport Loss',
    explain: 'Costs of obtaining an emergency certificate or duplicate passport abroad — consular fees and related travel.',
  },
  personal_liability: {
    label: 'Personal Liability',
    explain: 'Legal liability for accidental injury to a third party or damage to their property during the trip.',
  },
  accidental_death: {
    label: 'Accidental Death (AD&D)',
    explain: 'Lump-sum benefit to your nominee if an accident during the trip causes death.',
  },
  permanent_disability: {
    label: 'Permanent Disability',
    explain: 'Lump-sum benefit for permanent total or partial disability caused by an accident during the trip.',
  },
  adventure_sports: {
    label: 'Adventure Sports',
    explain: 'Extends medical and evacuation cover to listed adventure activities (trekking, scuba, rafting…). Every insurer keeps its own activity list — always check yours is on it.',
  },
  winter_sports: {
    label: 'Winter Sports',
    explain: 'Skiing/snowboarding cover including piste closure and equipment, usually as an add-on with altitude limits.',
  },
  rental_car_excess: {
    label: 'Rental Car Excess',
    explain: 'Pays the deductible/excess you owe the rental company after damage or theft of a hire car.',
  },
  electronics: {
    label: 'Electronics / Gadgets',
    explain: 'Higher per-item limits for laptops, cameras and phones than standard baggage cover allows.',
  },
  covid_medical: {
    label: 'COVID-19 Cover',
    explain: 'Medical expenses and (on some plans) quarantine allowance or cancellation if you contract COVID-19 before or during the trip.',
  },
  pre_existing_conditions: {
    label: 'Pre-existing Conditions',
    explain: 'Cover for acute, life-threatening episodes of declared pre-existing conditions — or a full waiver on US plans bought within the early-purchase window.',
  },
  cancel_for_any_reason: {
    label: 'Cancel For Any Reason (CFAR)',
    explain: 'Optional upgrade refunding 50–75% of trip costs when you cancel for reasons a standard policy doesn’t list. Must usually be bought within 14–21 days of the first trip payment.',
  },
  dental: {
    label: 'Emergency Dental',
    explain: 'Acute dental pain relief while travelling, capped at a sub-limit of the medical benefit.',
  },
  hijack_distress: {
    label: 'Hijack Distress',
    explain: 'Per-day allowance paid if the common carrier you are on is hijacked.',
  },
  home_burglary: {
    label: 'Home Burglary (while away)',
    explain: 'Cover for burglary at your locked residence while you are travelling — a signature benefit on several Indian plans.',
  },
  compassionate_visit: {
    label: 'Compassionate Visit',
    explain: 'Round-trip ticket and stay for a family member to be at your bedside if you are hospitalised abroad beyond a set number of days.',
  },
  telemedicine: {
    label: 'Telemedicine',
    explain: '24×7 doctor tele-consultations through the assistance company, without a claim excess.',
  },
  legal_assistance: {
    label: 'Legal Assistance',
    explain: 'Legal referral and costs cover for civil matters arising from an accident abroad.',
  },
};

export const COVERAGE_ORDER = Object.keys(COVERAGE_INFO) as CoverageKey[];
