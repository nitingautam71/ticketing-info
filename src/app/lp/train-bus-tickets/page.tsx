import type { Metadata } from 'next';
import LpPageTemplate from '@/components/lp/LpPageTemplate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Train & Bus Ticket Booking Help — Tatkal, Quota & More',
  description: 'Book train and bus tickets with a real booking agent — Tatkal help, senior citizen quota, and waitlist guidance.',
  robots: { index: false, follow: false },
};

const BENEFITS = [
  { title: 'Tatkal & quota handled for you', desc: 'Tell us your route and travel date — we handle the booking window and quota request correctly the first time.' },
  { title: 'Senior citizen quota requests', desc: 'We book with the correct name/ID match so lower-berth priority isn\'t denied mid-journey over a paperwork mismatch.' },
  { title: 'Train and bus, one enquiry', desc: 'No rail option that fits your schedule? We\'ll check bus alternatives for the same route in the same conversation.' },
];

const FAQS = [
  { question: 'Can you book Tatkal tickets?', answer: 'Yes — tell us your route and preferred date and we\'ll handle the booking window and requirements for you.' },
  { question: 'Do you handle senior citizen quota bookings?', answer: 'Yes. We book using the exact name and date of birth from a government ID to avoid the quota being denied during a ticket check.' },
  { question: 'What happens if my train is cancelled or rescheduled?', answer: 'We help you check alternate trains or bus routes for the same journey and rebook where possible.' },
  { question: 'Do you also book intercity bus tickets, not just trains?', answer: 'Yes — if rail options don\'t fit your schedule, we\'ll check bus alternatives for the same route.' },
  { question: 'How do I get my e-ticket or PNR after booking?', answer: 'Your consultant sends your PNR and e-ticket details directly once the booking is confirmed.' },
];

export default function TrainBusTicketsLandingPage() {
  return (
    <LpPageTemplate
      theme="train-bus-tickets"
      vertical="train"
      eyebrow="Train & Bus Tickets"
      headline="Train & Bus Ticket Booking — Tatkal, Quota, Sorted"
      subhead="Tell us your route and date. We handle Tatkal timing, senior citizen quota, and waitlist questions so you don't have to."
      whatsappMessage="Hi! I'd like help booking a train or bus ticket."
      benefits={BENEFITS}
      faqs={FAQS}
      ctaLabel="Get Booking Help Now"
    />
  );
}
