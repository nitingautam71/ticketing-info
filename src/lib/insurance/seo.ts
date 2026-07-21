import type { VisaCountry } from '@/lib/visas/countries';
import { destinationRegion, mandatoryInsuranceNote, REGION_MEDICAL_CONTEXT } from './regions';
import type { InsurancePlan, InsuranceProviderInfo } from './types';

/** Meta + FAQ builders for the insurance SEO clusters. */

export function destinationMetaTitle(destination: VisaCountry): string {
  const year = new Date().getFullYear();
  const mandatory = mandatoryInsuranceNote(destination.code);
  return mandatory
    ? `${destination.name} Travel Insurance (${year}) — Mandatory Cover Rules & Best Plans`
    : `${destination.name} Travel Insurance (${year}) — Do You Need It & Best Plans`;
}

export function destinationMetaDescription(destination: VisaCountry): string {
  const region = destinationRegion('US', destination.code);
  const ctx = REGION_MEDICAL_CONTEXT[region];
  const mandatory = mandatoryInsuranceNote(destination.code);
  return `${mandatory ? `Insurance is required for ${destination.name} travel. ` : ''}Compare travel insurance for ${destination.name}: recommended medical cover $${ctx.recommendedMedicalUsd.toLocaleString('en-US')}+, plans for US and Indian travellers, instant indicative quotes and expert help.`;
}

export function destinationFaqs(destination: VisaCountry): { question: string; answer: string }[] {
  const region = destinationRegion('US', destination.code);
  const ctx = REGION_MEDICAL_CONTEXT[region];
  const mandatory = mandatoryInsuranceNote(destination.code);
  const faqs: { question: string; answer: string }[] = [
    {
      question: `Is travel insurance mandatory for ${destination.name}?`,
      answer:
        mandatory ??
        `No — travel insurance is not an entry requirement for ${destination.name}. It remains strongly recommended: medical treatment, evacuation and trip disruption are uninsured out-of-pocket costs without it.`,
    },
    {
      question: `How much medical cover do I need for ${destination.name}?`,
      answer: `We recommend at least $${ctx.recommendedMedicalUsd.toLocaleString('en-US')} of emergency medical cover. ${ctx.context}`,
    },
    {
      question: `How much does travel insurance for ${destination.name} cost?`,
      answer:
        'Indicative estimates: duration-priced plans run roughly $1–4 per traveller-day for adults under 50 (higher for US-bound trips and senior travellers); US comprehensive plans price at about 4–8% of the insured trip cost. Run a quote above for your exact trip — final premiums are always set by the insurer.',
    },
    {
      question: `Does travel insurance for ${destination.name} cover COVID-19?`,
      answer: 'Yes — every plan we compare treats COVID-19 medical expenses as any other illness, and a positive test before departure as a standard cancellation reason.',
    },
  ];
  return faqs;
}

export function planMetaTitle(plan: InsurancePlan, provider: InsuranceProviderInfo): string {
  const year = new Date().getFullYear();
  return `${plan.name} Review (${year}) — Coverage, Exclusions & Estimated Premiums`;
}

export function planMetaDescription(plan: InsurancePlan): string {
  return `${plan.name}: ${plan.medicalSumInsuredLabel} medical cover, ${plan.tagline.toLowerCase()} Full benefit table, exclusions, claim process and indicative premium estimates.`;
}

export function planFaqs(plan: InsurancePlan, provider: InsuranceProviderInfo): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [
    {
      question: `How much medical cover does ${plan.name} include?`,
      answer: `${plan.medicalSumInsuredLabel} of emergency medical cover (${plan.deductibleLabel.toLowerCase()}). ${plan.coverage.medical_evacuation ? `Emergency evacuation: ${plan.coverage.medical_evacuation.label}.` : ''}`,
    },
    {
      question: `Who can buy ${plan.name}?`,
      answer: `Travellers aged ${plan.eligibility.minAge}–${plan.eligibility.maxAge}, for trips up to ${plan.eligibility.perTripCapDays ?? plan.eligibility.maxTripDays} days${plan.eligibility.perTripCapDays ? ' per trip on an annual policy' : ''}. ${plan.market === 'US' ? 'Sold to US residents.' : plan.market === 'IN' ? 'Sold to Indian residents.' : 'Available to travellers of most nationalities.'}${plan.eligibility.note ? ` ${plan.eligibility.note}.` : ''}`,
    },
    {
      question: `How do claims work on ${plan.name}?`,
      answer: `${plan.claimProcess} ${provider.claims.note}`,
    },
    {
      question: `Does ${plan.name} cover COVID-19?`,
      answer: plan.coverage.covid_medical
        ? `Yes — ${plan.coverage.covid_medical.label.toLowerCase().startsWith('covered') ? plan.coverage.covid_medical.label : `COVID-19 cover: ${plan.coverage.covid_medical.label}`}.`
        : 'COVID-19 medical expenses are treated as any other illness on current wordings — confirm current terms with the insurer before purchase.',
    },
  ];
  return faqs;
}
