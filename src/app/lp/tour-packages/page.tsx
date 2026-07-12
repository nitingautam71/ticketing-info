import type { Metadata } from 'next';
import LpPageTemplate from '@/components/lp/LpPageTemplate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tour Packages — Custom Quotes, Real Consultant',
  description: 'Domestic and international tour packages, honeymoon packages, and group bookings — customized and quoted by a real travel consultant.',
  robots: { index: false, follow: false },
};

const BENEFITS = [
  { title: 'Customized, not off-the-shelf', desc: 'Tell us your budget, dates, and group size — we build a package around you, not the other way around.' },
  { title: 'Flights, hotels & transfers bundled', desc: 'One consultant, one quote, one booking — instead of juggling separate flight, hotel, and transfer bookings yourself.' },
  { title: 'Group & family discounts available', desc: 'Traveling with family or a group? Tell us the headcount — package pricing often improves at scale.' },
];

const FAQS = [
  { question: 'Are flights and hotels included in the package price?', answer: 'It depends on what you ask for — we quote exactly what\'s included (flights, hotels, transfers, tours) so there\'s no ambiguity before you confirm.' },
  { question: 'Can the package be customized to my dates and budget?', answer: "Yes — that's the default, not an add-on. Tell us your budget and dates and we build around them." },
  { question: 'What is the payment process?', answer: "We don't take payment online. A consultant confirms pricing and availability with you first, then guides you through payment once you're ready to book." },
  { question: 'Do you offer discounts for group bookings?', answer: 'Often, yes, depending on group size and destination — share your headcount when you enquire and we\'ll factor it into the quote.' },
  { question: 'What if I need to cancel or change dates after booking?', answer: 'Cancellation and change terms depend on the specific hotels/airlines/operators in your package — your consultant explains these clearly before you confirm.' },
];

export default function TourPackagesLandingPage() {
  return (
    <LpPageTemplate
      theme="tour-packages"
      vertical="package"
      eyebrow="Tour Packages"
      headline="Tour Packages — Built Around Your Budget & Dates"
      subhead="Domestic getaways, international trips, honeymoons, or group tours — tell us what you're planning and get a custom quote."
      whatsappMessage="Hi! I'd like a quote for a tour package."
      benefits={BENEFITS}
      faqs={FAQS}
      ctaLabel="Get My Custom Package Quote"
    />
  );
}
