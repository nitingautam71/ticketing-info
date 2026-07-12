import type { Metadata } from 'next';
import LpPageTemplate from '@/components/lp/LpPageTemplate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Book Flight Tickets — Fast Fares, Real Consultant',
  description: 'Book domestic and international flight tickets. Get a fare quote from a real consultant in minutes, not a bot.',
  robots: { index: false, follow: false },
};

const BENEFITS = [
  { title: 'Personal service, not a bot', desc: 'A real consultant reviews your route and calls or WhatsApps you back with fares — no chatbot loop.' },
  { title: 'Domestic & international', desc: 'One call covers everything from a same-day domestic hop to a multi-stop international itinerary.' },
  { title: 'No payment pressure', desc: "We don't take payment online. You confirm pricing with a consultant before anything is booked." },
];

const FAQS = [
  { question: 'Do you charge a booking fee on top of the airfare?', answer: 'Any fee is disclosed upfront by your consultant before you confirm — never added silently after booking.' },
  { question: 'How fast will I get a fare quote after submitting the form?', answer: 'Typically within 30 minutes during business hours; outside those hours, first thing the next morning.' },
  { question: 'Can I change or cancel after booking?', answer: 'Change and cancellation terms depend on the airline\'s fare rules for your specific ticket — your consultant will explain them clearly before you confirm, not after.' },
  { question: 'Do you book both domestic Indian and international flights?', answer: 'Yes — domestic routes within India and international routes, including USA-India and other diaspora-heavy routes.' },
  { question: "What if I don't want to fill out the form?", answer: 'Call or WhatsApp us directly using the buttons on this page — same consultants, same fast response.' },
];

export default function FlightBookingLandingPage() {
  return (
    <LpPageTemplate
      theme="flight-booking"
      vertical="flight"
      eyebrow="Flight Tickets"
      headline="Book Flight Tickets — Fast Fares From a Real Consultant"
      subhead="Tell us your route and dates. A consultant compares fares across airlines and calls you back — usually within 30 minutes."
      whatsappMessage="Hi! I'd like to book a flight ticket."
      benefits={BENEFITS}
      faqs={FAQS}
      ctaLabel="Get My Free Fare Quote"
    />
  );
}
