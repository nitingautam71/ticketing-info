import type { Metadata } from 'next';
import LpPageTemplate from '@/components/lp/LpPageTemplate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cruise Deals — Talk to a Real Cruise Consultant',
  description: 'Caribbean, Bahamas, Alaska, and Mediterranean cruise deals compared by a real consultant. Call for live cabin availability and unpublished promotions.',
  robots: { index: false, follow: false },
};

const BENEFITS = [
  { title: 'Every major line, one call', desc: 'Royal Caribbean, Carnival, Norwegian, MSC, Princess, and 20+ more compared side by side — including promos that never appear on the big booking sites.' },
  { title: 'Cabin advice that saves money', desc: 'Interior vs. balcony, deck position, obstructed views — a consultant who has sailed these ships steers you away from expensive mistakes.' },
  { title: 'No payment pressure', desc: 'Nothing is charged online. You get a held quote, confirm it with your consultant, and only then is anything booked.' },
];

const FAQS = [
  { question: 'Are your cruise prices really the same or lower than booking direct?', answer: 'Yes. Cruise lines pay travel consultants from their own commission, not by raising your fare — and consultants can additionally apply group rates and unpublished promotions that direct websites do not show.' },
  { question: 'Which cruise lines can you book?', answer: 'All major ocean lines (Royal Caribbean, Carnival, Norwegian, MSC, Princess, Celebrity, Holland America, Disney, Virgin Voyages, and the luxury lines) plus river specialists like Viking, AmaWaterways, and Uniworld.' },
  { question: 'How fast will I get a cruise quote?', answer: 'Typically within 30 minutes during business hours with live cabin categories and current promotions; outside those hours, first thing the next morning.' },
  { question: 'Can you handle flights, hotels, and transfers too?', answer: 'Yes — pre-cruise hotel nights, flights to the departure port, transfers, and travel insurance can all go on one itinerary with one point of contact.' },
  { question: 'What if I already found a price online?', answer: 'Send it to us. We will either beat it, match it with extra perks like onboard credit, or tell you honestly that it is a great deal and you should take it.' },
];

export default function CruiseDealsLandingPage() {
  return (
    <LpPageTemplate
      theme="cruise-deals"
      vertical="cruise"
      eyebrow="Cruise Deals"
      headline="Cruise Deals From a Real Consultant — Not a Checkout Page"
      subhead="Tell us where and when you want to sail. A cruise specialist compares lines, ships, and cabin fares — then calls you back with real numbers, usually within 30 minutes."
      whatsappMessage="Hi! I'm looking for a cruise deal."
      benefits={BENEFITS}
      faqs={FAQS}
      ctaLabel="Get My Free Cruise Quote"
    />
  );
}
