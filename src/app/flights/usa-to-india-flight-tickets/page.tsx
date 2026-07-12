import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import LandingCta from '@/components/seo/LandingCta';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'USA to India Flight Tickets — Cheap Fares & Best Routes',
  description:
    'Book USA to India flight tickets from JFK, Newark, San Francisco, and Chicago to Delhi, Mumbai, Bengaluru, and Chennai. Compare direct and one-stop fares, then book with a real travel consultant.',
  alternates: { canonical: '/flights/usa-to-india-flight-tickets' },
  openGraph: {
    title: 'USA to India Flight Tickets — Cheap Fares & Best Routes | Ticketing-Info',
    description:
      'Book USA to India flight tickets from JFK, Newark, San Francisco, and Chicago to Delhi, Mumbai, Bengaluru, and Chennai. Compare direct and one-stop fares.',
  },
};

const FAQS = [
  {
    question: 'What is the cheapest time to book USA to India flight tickets?',
    answer:
      'Fares are generally lowest 2–4 months before travel for off-peak dates (January–March, September–October). Diwali, Christmas/New Year, and the June–August summer break see the highest demand from the diaspora community, so book 4–6 months ahead for those windows if you want a direct flight or a specific layover city.',
  },
  {
    question: 'Which US airports have direct flights to India?',
    answer:
      'Nonstop service to India currently runs mainly from JFK (New York), Newark (EWR), San Francisco (SFO), and Chicago (ORD), typically to Delhi and Mumbai. Other US cities connect via a layover in Europe, the Middle East, or another Indian gateway city — routing and seasonality change often, so confirm current nonstop options when you enquire.',
  },
  {
    question: 'Is a direct flight always better than a one-stop flight to India?',
    answer:
      'Not always. A one-stop itinerary via a Middle East or European hub is often 15–30% cheaper and can offer a convenient overnight layover to break up the journey, while a nonstop flight saves 4–6 hours of total travel time but usually costs more. We compare both when you request a quote.',
  },
  {
    question: 'Do I need anything besides a ticket to fly from the USA to India?',
    answer:
      'You need a valid passport, and if you are not an OCI cardholder or Indian citizen, a valid Indian visa or e-Visa. See our guide on OCI cards versus Indian visas for NRIs if you are unsure which applies to you.',
  },
];

export default function UsaToIndiaFlightTicketsPage() {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Flights', path: '/flights' }, { name: 'USA to India Flight Tickets', path: '/flights/usa-to-india-flight-tickets' }])} />
      <JsonLd data={faqPageJsonLd(FAQS)} />

      <nav className="text-[11px] text-neutral-500 font-mono mb-4">
        <Link href="/" className="hover:text-neutral-300">Home</Link> / <Link href="/flights" className="hover:text-neutral-300">Flights</Link> / USA to India
      </nav>

      <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Flight Tickets</p>
      <h1 className="font-display text-3xl md:text-5xl text-white font-medium mb-6">USA to India Flight Tickets — Fares, Routes & Booking Tips</h1>

      <div className="text-neutral-300 text-sm md:text-base leading-relaxed space-y-5">
        <p>
          For the millions of Indian-Americans, NRIs, and Indian nationals living in the United States, a USA to India flight ticket
          is more than a booking — it&apos;s the trip home for a wedding, a parent&apos;s milestone birthday, Diwali with family, or a
          long-overdue visit. Fares and routing between the two countries shift with the seasons, fuel costs, and airline capacity,
          so knowing how to time and structure your booking can save real money and hours in the air.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">Which US cities fly direct to India?</h2>
        <p>
          Nonstop service between the US and India is concentrated on a handful of routes: New York (JFK), Newark (EWR), San
          Francisco (SFO), and Chicago (ORD) are the primary US gateways with nonstop flights, usually landing in Delhi or Mumbai.
          If you&apos;re flying out of another US city — Houston, Dallas, Los Angeles, Atlanta, or Washington DC among them — you&apos;ll
          typically connect through a Middle East hub (Dubai, Abu Dhabi, Doha), a European hub (London, Frankfurt, Paris), or
          through one of the nonstop gateway cities above. Airline schedules and nonstop routes change with demand, so it&apos;s worth
          confirming current options rather than assuming last year&apos;s route map still holds.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">Direct vs. one-stop: which should you book?</h2>
        <p>
          A nonstop flight is the fastest way to cover the roughly 8,000-mile journey, cutting 4–6 hours of total travel time
          compared to a routing with a layover. But one-stop itineraries through the Middle East or Europe are frequently 15–30%
          cheaper, and a well-timed layover (say, 3–4 hours in Dubai or Doha) can be a comfortable way to stretch your legs
          mid-journey rather than sitting in one seat for 15+ hours straight. If your dates are flexible and budget matters more
          than speed, a one-stop fare is usually the better trade.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">When to book for the best fare</h2>
        <p>
          Three windows drive the bulk of USA–India demand: Diwali, the Christmas/New Year stretch, and the June–August summer
          break when schools are out. Fares on these dates can run 40–60% above off-peak pricing, and seats in popular cabin
          classes sell out early — booking 4–6 months ahead gives you the best shot at a reasonable fare and your preferred
          routing. Outside those windows (January–March and September–October are typically the quietest), booking 6–10 weeks out
          usually finds solid fares without the peak-season premium.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">Which Indian city should you fly into?</h2>
        <p>
          Delhi and Mumbai carry the most nonstop US capacity and the widest onward-connection network if you&apos;re continuing to
          a smaller city. Bengaluru and Chennai are increasingly served with one-stop itineraries and are often the better choice
          if your final destination is in South India — flying into Delhi and taking a domestic connection down south can add
          hours and a layover you don&apos;t need. Tell us your final destination when you request a quote and we&apos;ll compare gateway
          cities for you.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">Documents to have ready</h2>
        <p>
          Indian citizens and OCI cardholders travel on their passport (plus OCI card) without a separate visa. If you&apos;re a
          non-Indian family member or friend joining the trip, you&apos;ll need a valid Indian visa or e-Visa — see our guide on{' '}
          <Link href="/visas/oci-vs-indian-visa-for-nris" className="text-emerald-400 hover:underline">
            OCI cards vs. Indian visas for NRIs
          </Link>{' '}
          if you&apos;re unsure which category applies to your family. If your trip includes onward travel within India, our{' '}
          <Link href="/trains" className="text-emerald-400 hover:underline">
            train ticket
          </Link>{' '}
          and{' '}
          <Link href="/packages" className="text-emerald-400 hover:underline">
            tour package
          </Link>{' '}
          desks can bundle that in the same enquiry.
        </p>

        <p>
          Ready to compare fares for your dates? Search on our{' '}
          <Link href="/flights" className="text-emerald-400 hover:underline">
            flight search page
          </Link>{' '}
          or get a free personalized quote below — a real consultant reviews routing and pricing rather than a bot.
        </p>
      </div>

      <LandingCta
        heading="Get a free USA–India flight quote"
        body="Tell us your dates and preferred city pair — we'll compare direct and one-stop options and get back to you shortly."
        whatsappMessage="Hi! I'd like a quote for a USA to India flight ticket."
      />

      <section className="mt-10">
        <h2 className="font-display text-2xl text-white font-medium mb-4">Frequently asked questions</h2>
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
  );
}
