import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plane, Clock, MapPin, CalendarDays, ArrowLeftRight, PlaneTakeoff } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import LandingCta from '@/components/seo/LandingCta';
import FlightSearch from '@/components/search/FlightSearch';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import {
  getFlightRoute,
  allFlightRoutePairs,
  relatedFlightRoutes,
  routeMetaTitle,
  routeMetaDescription,
  routeFaqs,
  FLIGHT_ROUTE_DISCLAIMER,
  type FlightRoute,
} from '@/lib/flights/routes';

// Curated static route cluster — safe to prerender (no DB / no live API at render,
// unlike the DB-backed verticals). Only listed pairs exist; everything else 404s so
// we never publish thin auto-generated pages.
export const dynamicParams = false;

type Params = { from: string; to: string };

export function generateStaticParams(): Params[] {
  return allFlightRoutePairs();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { from, to } = await params;
  const route = getFlightRoute(from, to);
  if (!route) return {};
  const title = routeMetaTitle(route);
  const description = routeMetaDescription(route);
  const canonical = `/flights/${route.fromSlug}/${route.toSlug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title: `${title} | Ticketing-Info`, description, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function flightStat(route: FlightRoute) {
  return [
    { label: 'Fastest option', value: route.nonstop ? `${route.durationNonstop} nonstop` : `${route.durationOneStop} (1 stop)`, icon: Clock },
    { label: 'Distance', value: `~${route.distanceMiles.toLocaleString()} mi`, icon: Plane },
    { label: 'Gateway airports', value: `${route.fromAirports.join('/')} → ${route.toAirports.join('/')}`, icon: MapPin },
    { label: 'From (est.)', value: `$${route.estFromUSD.toLocaleString()} round-trip`, icon: CalendarDays },
  ];
}

export default async function FlightRoutePage({ params }: { params: Promise<Params> }) {
  const { from, to } = await params;
  const route = getFlightRoute(from, to);
  if (!route) notFound();

  const faqs = routeFaqs(route);
  const related = relatedFlightRoutes(route);
  const stats = flightStat(route);
  const stopsSentence = route.nonstop
    ? `This route has nonstop service (typically ${route.durationNonstop}), and one-stop itineraries that can come in cheaper.`
    : `This route is generally flown with one connection (typically ${route.durationOneStop}) — there is no reliable nonstop, so the choice is really about which hub and layover suit you.`;

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Flights', path: '/flights' },
          { name: `${route.fromCity} to ${route.toCity}`, path: `/flights/${route.fromSlug}/${route.toSlug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />

      {/* Header */}
      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/flights" className="hover:text-neutral-200">Flights</Link> / {route.fromCity} to {route.toCity}
          </nav>
          <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
            <PlaneTakeoff className="w-4 h-4" aria-hidden /> {route.fromCity} → {route.toCity}
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">
            {route.fromCity} to {route.toCity} Flights
          </h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Compare {route.fromCity}–{route.toCity} fares across {route.airlines.slice(0, 3).join(', ')} and more.
            {' '}{stopsSentence} Indicative economy round-trips start around ${route.estFromUSD.toLocaleString()} — search live options
            below, then lock in your dates and final price with a real travel consultant.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-[11px]">
            <Link
              href={`/flights/${route.toSlug}/${route.fromSlug}`}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden /> Reverse: {route.toCity} to {route.fromCity}
            </Link>
            <Link
              href="/flights"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
            >
              <Plane className="w-3.5 h-3.5" aria-hidden /> Search another route
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10 space-y-10">
        {/* Quick stats */}
        <section aria-label="Route overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((f) => (
            <div key={f.label} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-1">
              <p className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1.5">
                <f.icon className="w-3.5 h-3.5 text-emerald-400" aria-hidden /> {f.label}
              </p>
              <p className="text-sm font-bold text-white leading-snug">{f.value}</p>
            </div>
          ))}
        </section>

        {/* Live search — prefilled to this route */}
        <section aria-label={`Search ${route.fromCity} to ${route.toCity} flights`} className="space-y-4">
          <h2 className="font-display text-2xl text-white font-medium">Search live {route.fromCity} → {route.toCity} fares</h2>
          <FlightSearch initialFrom={route.primaryFrom} initialTo={route.primaryTo} />
        </section>

        {/* Editorial content */}
        <section className="text-neutral-300 text-sm md:text-base leading-relaxed space-y-5 max-w-3xl">
          <h2 className="font-display text-2xl text-white font-medium">Which airports and airlines serve this route?</h2>
          <p>
            Most travellers depart from {route.fromAirports.join(' or ')} and arrive into {route.toAirports.join(' or ')}. The main
            carriers are {route.airlines.join(', ')}. {stopsSentence} We compare every option side by side — including one-stop
            routings that frequently undercut a nonstop fare — so you see the real trade-off between price and total travel time.
          </p>

          <h2 className="font-display text-2xl text-white font-medium">When is the cheapest time to book?</h2>
          <p>
            Fares on {route.fromCity}–{route.toCity} are typically lowest in {route.cheapestMonths}. Prices climb around{' '}
            {route.peakSeasons}, so for those windows booking a few months ahead protects both your fare and your preferred routing.
            Indicative economy round-trips start near ${route.estFromUSD.toLocaleString()}, but your exact price depends on your dates,
            cabin, and how far ahead you book.
          </p>

          {route.india ? (
            <>
              <h2 className="font-display text-2xl text-white font-medium">Documents for {route.toCity}</h2>
              <p>
                Indian citizens and OCI cardholders travel on their passport (plus OCI card) without a separate visa. If a
                non-Indian family member is travelling, they&apos;ll need a valid Indian visa or e-Visa — our guide on{' '}
                <Link href="/visas/oci-vs-indian-visa-for-nris" className="text-emerald-400 hover:underline">
                  OCI cards vs. Indian visas for NRIs
                </Link>{' '}
                explains which applies. Add onward{' '}
                <Link href="/trains" className="text-emerald-400 hover:underline">train tickets</Link> or a{' '}
                <Link href="/packages" className="text-emerald-400 hover:underline">tour package</Link> to the same enquiry.
              </p>
            </>
          ) : route.international ? (
            <>
              <h2 className="font-display text-2xl text-white font-medium">Before you fly to {route.toCity}</h2>
              <p>
                Check your entry requirements for {route.toCity} with our{' '}
                <Link href="/visas" className="text-emerald-400 hover:underline">visa checker</Link> and consider{' '}
                <Link href="/insurance" className="text-emerald-400 hover:underline">travel insurance</Link> to cover delays and
                cancellations. We can bundle a{' '}
                <Link href="/hotels" className="text-emerald-400 hover:underline">hotel</Link> or an{' '}
                <Link href="/transfers" className="text-emerald-400 hover:underline">airport transfer</Link> into the same booking.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl text-white font-medium">Make it a complete trip</h2>
              <p>
                Add a{' '}
                <Link href="/hotels" className="text-emerald-400 hover:underline">hotel in {route.toCity}</Link>, an{' '}
                <Link href="/transfers" className="text-emerald-400 hover:underline">airport transfer</Link>, or a{' '}
                <Link href="/cars" className="text-emerald-400 hover:underline">rental car</Link> to the same enquiry and your
                consultant sorts the whole trip in one conversation.
              </p>
            </>
          )}
        </section>

        <LandingCta
          heading={`Get a free ${route.fromCity} → ${route.toCity} fare quote`}
          body="Tell us your dates and travelers — we'll compare nonstop and one-stop options across airlines and get back to you shortly."
          whatsappMessage={`Hi! I'd like a quote for ${route.fromCity} to ${route.toCity} flights.`}
        />

        {/* FAQs */}
        <section aria-label="Frequently asked questions" className="max-w-3xl">
          <h2 className="font-display text-2xl text-white font-medium mb-4">
            {route.fromCity} to {route.toCity}: frequently asked questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details key={faq.question} className="group bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 open:border-emerald-500/30">
                <summary className="text-sm font-bold text-white cursor-pointer list-none">{faq.question}</summary>
                <p className="text-sm text-neutral-400 leading-relaxed mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-sell */}
        <section aria-label="Complete your trip" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/hotels', title: `Hotels in ${route.toCity}`, sub: 'Free-cancellation options near the sights.' },
            { href: '/insurance', title: 'Travel insurance', sub: 'Cover delays, cancellations, and baggage.' },
            route.international
              ? { href: '/visas', title: `Visa for ${route.toCity}`, sub: 'Check entry requirements for your passport.' }
              : { href: '/transfers', title: `Airport transfer`, sub: 'Be met on arrival — private or shared.' },
          ].map((c) => (
            <Link key={c.href + c.title} href={c.href} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-2xl p-5 transition-colors group">
              <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{c.title}</p>
              <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">{c.sub}</p>
            </Link>
          ))}
        </section>

        {/* Internal links */}
        {related.length > 0 && (
          <section aria-label="Related flight routes" className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Related flight routes</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={`${r.fromSlug}-${r.toSlug}`}
                  href={`/flights/${r.fromSlug}/${r.toSlug}`}
                  className="text-[11px] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  {r.fromCity} → {r.toCity}
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800/60 pt-6">{FLIGHT_ROUTE_DISCLAIMER}</p>
      </div>
    </div>
  );
}
