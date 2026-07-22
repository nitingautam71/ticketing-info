import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeroSection from '@/components/layout/HeroSection';
import FlightSearch from '@/components/search/FlightSearch';
import FeaturedFlightDeals from '@/components/flights/FeaturedFlightDeals';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import { getFlightRoute } from '@/lib/flights/routes';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Flight Tickets — Domestic & International Fares Compared',
  description:
    'Book flight tickets for domestic and international travel. Compare fares, stops, and baggage across hundreds of routes and cabin classes, then book with a real travel consultant.',
  alternates: { canonical: '/flights' },
  openGraph: {
    title: 'Flight Tickets — Domestic & International Fares Compared | Ticketing-Info',
    description:
      'Book flight tickets for domestic and international travel. Compare fares, stops, and baggage across hundreds of routes, then book with a real travel consultant.',
  },
};

// Popular routes surfaced for internal linking + crawl discovery of the /flights/[from]/[to] cluster.
const POPULAR_ROUTE_KEYS: [string, string][] = [
  ['new-york', 'delhi'],
  ['new-york', 'mumbai'],
  ['san-francisco', 'delhi'],
  ['chicago', 'delhi'],
  ['san-francisco', 'bengaluru'],
  ['new-york', 'london'],
  ['new-york', 'los-angeles'],
  ['los-angeles', 'tokyo'],
  ['new-york', 'paris'],
  ['new-york', 'miami'],
  ['new-york', 'dubai'],
  ['los-angeles', 'las-vegas'],
];

const FAQS = [
  {
    question: 'Does Ticketing-Info charge to book a flight?',
    answer:
      'No payment is taken online. You search and compare fares here, then a travel consultant confirms live availability and the final price before anything is booked — any service fee is disclosed upfront, never added silently.',
  },
  {
    question: 'Are the fares shown live prices?',
    answer:
      'Search results reflect current market fares and update as you search, but they are estimates until a consultant confirms the exact routed price for your dates. Fares change constantly with availability.',
  },
  {
    question: 'Can I book flights for children and infants?',
    answer:
      'Yes. Use the Travelers selector to add adults, children (2–11), and lap infants (under 2). Note any senior, student, or military discounts in your enquiry and a consultant applies eligible fares.',
  },
  {
    question: 'Do you book one-way, round-trip, and multi-city itineraries?',
    answer:
      'All three. Round-trip and multi-city searches let you pick each flight in turn; your consultant then confirms the best-priced combined ticket, which is often lower than the sum of the separate legs shown.',
  },
];

export default function FlightsPage() {
  const hero = HERO_COPY['/flights'];
  const popularRoutes = POPULAR_ROUTE_KEYS.map(([from, to]) => getFlightRoute(from, to)).filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <div className="flex-1 flex flex-col">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Flights', path: '/flights' }])} />
      <JsonLd data={faqPageJsonLd(FAQS)} />
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16">
        <FlightSearch />
        <FeaturedFlightDeals />

        {/* Popular routes — internal links into the route cluster */}
        <section className="mt-14 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Popular Flight Routes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularRoutes.map((r) => (
              <Link
                key={`${r.fromSlug}-${r.toSlug}`}
                href={`/flights/${r.fromSlug}/${r.toSlug}`}
                className="group flex items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 hover:border-emerald-700/60 rounded-xl px-4 py-3 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {r.fromCity} <span className="text-neutral-600">→</span> {r.toCity}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {r.nonstop ? `Nonstop ${r.durationNonstop}` : `1 stop ${r.durationOneStop}`} • from ${r.estFromUSD.toLocaleString()} est.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14 max-w-3xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Flight Booking FAQs</h2>
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 open:border-emerald-500/30">
                <summary className="text-sm font-bold text-white cursor-pointer list-none">{faq.question}</summary>
                <p className="text-sm text-neutral-400 leading-relaxed mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
