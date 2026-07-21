import type { VisaCheckResult } from './types';

/** Demonym-ish phrasing without a 199-entry demonym table: "Indian passport
 * holders" reads fine as "India passport holders" for every country. */
export function passportPhrase(passportName: string): string {
  return `${passportName} passport holders`;
}

export function pairMetaTitle(r: VisaCheckResult): string {
  const year = new Date().getFullYear();
  switch (r.category) {
    case 'visa_free':
      return `${r.destination.name} is Visa-Free for ${passportPhrase(r.passport.name)} (${year}) — Stay, Rules & Documents`;
    case 'visa_on_arrival':
      return `${r.destination.name} Visa on Arrival for ${passportPhrase(r.passport.name)} (${year}) — Fees & Documents`;
    case 'e_visa':
      return `${r.destination.name} e-Visa for ${passportPhrase(r.passport.name)} (${year}) — Apply Online, Fees & Time`;
    case 'eta':
      return `${r.destination.name} ETA for ${passportPhrase(r.passport.name)} (${year}) — Apply Online Before You Fly`;
    case 'no_admission':
      return `${r.destination.name} Entry Rules for ${passportPhrase(r.passport.name)} (${year})`;
    default:
      return `${r.destination.name} Visa Requirements for ${passportPhrase(r.passport.name)} (${year}) — Fees, Documents & Time`;
  }
}

export function pairMetaDescription(r: VisaCheckResult): string {
  const stay = r.allowedStayDays ? ` Maximum stay: ${r.allowedStayDays} days.` : '';
  return `${r.headline}${stay} Processing: ${r.processingTime}. Fee: ${r.fee.label}. See the full document checklist, passport validity rules, transit and health requirements — and apply with expert help.`;
}

export function pairFaqs(r: VisaCheckResult): { question: string; answer: string }[] {
  const p = passportPhrase(r.passport.name);
  const faqs: { question: string; answer: string }[] = [
    {
      question: `Do ${p} need a visa for ${r.destination.name}?`,
      answer: r.headline,
    },
    {
      question: `How long can ${p} stay in ${r.destination.name}?`,
      answer: r.allowedStayDays
        ? `Up to ${r.allowedStayDays} days under the ${r.categoryLabel.toLowerCase()} rules. Longer stays require a different visa category.`
        : `The permitted stay depends on the visa issued — check the sticker/approval or the official source. Category: ${r.categoryLabel}.`,
    },
    {
      question: `How much does the ${r.destination.name} visa cost for ${p}?`,
      answer: r.fee.amountUsd === 0 ? 'There is no visa fee for this entry type.' : `${r.fee.label}.${r.fee.official ? '' : ' This is a typical estimate — the official portal shows the exact amount for your nationality.'}`,
    },
    {
      question: `How long does the ${r.destination.name} visa take to process?`,
      answer: r.processingTime + (r.applyBefore ? ' Apply well before your travel date to absorb delays.' : ''),
    },
    {
      question: `What passport validity is required to enter ${r.destination.name}?`,
      answer: `${r.passportValidity}. Blank pages: ${r.blankPages.toLowerCase()}.`,
    },
  ];
  if (r.transitNote) {
    faqs.push({ question: `Do I need a transit visa when connecting through ${r.destination.name}?`, answer: r.transitNote });
  }
  return faqs;
}
