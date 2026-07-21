import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowLeftRight, Clock, Globe2, MapPin, Route as RouteIcon, TrainFront, Zap } from 'lucide-react';
import { searchCorridor, logTrainSearch, TRAIN_DISCLAIMER } from '@/lib/trains/engine';
import { corridorFaqs, corridorMetaDescription, corridorMetaTitle } from '@/lib/trains/seo';
import { AMENITY_LABELS, CATEGORY_LABELS, cheapestFareLabel, dayOffsetLabel, formatDuration, formatFare } from '@/lib/trains/format';
import { FEATURED_CORRIDORS } from '@/lib/trains/popular';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/seo/JsonLd';
import TrainBookCTA from '@/components/trains/TrainBookCTA';
import type { TrainJourney } from '@/lib/trains/types';

// On-demand ISR: corridor pages materialise when first visited (DB reachable
// for status overrides, unlike at build) and cache for a day.
export const revalidate = 86400;
export const dynamicParams = true;

type Params = { from: string; to: string };

async function loadResult(params: Params) {
  const result = await searchCorridor(params.from, params.to);
  if (!result || result.journeys.length === 0) return null;
  return result;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const result = await loadResult(await params);
  if (!result) return {};
  const title = corridorMetaTitle(result);
  const description = corridorMetaDescription(result);
  const canonical = `/trains/route/${result.from[0].citySlug}/${result.to[0].citySlug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function trainTripJsonLd(j: TrainJourney) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TrainTrip',
    trainName: j.service.name,
    trainNumber: j.service.numbers[0],
    provider: { '@type': 'Organization', name: j.operator.name, url: j.operator.website },
    departureStation: { '@type': 'TrainStation', name: j.from.name, address: `${j.from.city}, ${j.from.region}` },
    arrivalStation: { '@type': 'TrainStation', name: j.to.name, address: `${j.to.city}, ${j.to.region}` },
    departureTime: j.departureTime,
    arrivalTime: j.arrivalTime,
  };
}

export default async function TrainCorridorPage({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  const result = await loadResult(resolved);
  if (!result) notFound();

  const fromCity = result.from[0].city;
  const toCity = result.to[0].city;
  const fromSlug = result.from[0].citySlug;
  const toSlug = result.to[0].citySlug;
  const faqs = corridorFaqs(result);
  const { journeys, fastest, cheapest } = result;

  logTrainSearch({
    fromQuery: resolved.from,
    toQuery: resolved.to,
    fromCode: result.from[0]?.code,
    toCode: result.to[0]?.code,
    results: journeys.length,
    source: 'corridor-page',
  });

  const related = FEATURED_CORRIDORS.filter((c) => !(c.from === fromSlug && c.to === toSlug)).filter(
    (c) => c.from === fromSlug || c.to === toSlug || c.from === toSlug,
  ).slice(0, 6);

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Trains', path: '/trains' },
          { name: `${fromCity} to ${toCity}`, path: `/trains/route/${fromSlug}/${toSlug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      {fastest && <JsonLd data={trainTripJsonLd(fastest)} />}

      {/* Header */}
      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/trains" className="hover:text-neutral-200">Trains</Link> / {fromCity} to {toCity}
          </nav>
          <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
            <TrainFront className="w-4 h-4" aria-hidden /> {fromCity} → {toCity}
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">
            {fromCity} to {toCity} by train
          </h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            {journeys.length} {journeys.length === 1 ? 'train' : 'trains'} on this corridor
            {fastest ? ` — fastest ${formatDuration(fastest.durationMin)} on the ${fastest.service.name}` : ''}
            {cheapest ? `, fares ${cheapestFareLabel(cheapest.classes)}` : ''}. Compare timetables and classes below, then book with our rail desk.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-[11px]">
            <Link
              href={`/trains/route/${toSlug}/${fromSlug}`}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden /> Reverse: {toCity} to {fromCity}
            </Link>
            <Link
              href="/trains"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
            >
              <Globe2 className="w-3.5 h-3.5" aria-hidden /> Search another route
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10 space-y-8">
        {/* Quick stats */}
        <section aria-label="Corridor overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Trains on route', value: String(journeys.length), icon: TrainFront },
            { label: 'Fastest', value: fastest ? `${formatDuration(fastest.durationMin)} · ${fastest.service.name}` : '—', icon: Zap },
            { label: 'Cheapest (indicative)', value: cheapest ? `${cheapestFareLabel(cheapest.classes) ?? '—'} · ${cheapest.service.name}` : '—', icon: Clock },
            { label: 'Origin stations', value: result.from.map((s) => s.code).join(' · '), icon: MapPin },
          ].map((f) => (
            <div key={f.label} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-1">
              <p className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1.5">
                <f.icon className="w-3.5 h-3.5 text-emerald-400" aria-hidden /> {f.label}
              </p>
              <p className="text-sm font-bold text-white leading-snug">{f.value}</p>
            </div>
          ))}
        </section>

        {/* Journey cards */}
        <section aria-label="Trains on this corridor" className="space-y-4">
          {journeys.map((j) => (
            <article key={`${j.service.slug}-${j.direction}`} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 md:p-6 space-y-4 shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    <Link href={`/trains/train/${j.service.slug}`} className="hover:text-emerald-300 transition-colors">
                      {j.service.name}
                    </Link>{' '}
                    <span className="text-neutral-500 font-mono text-xs">({j.service.numbers.join('/')})</span>
                  </h2>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    {j.operator.name} · {CATEGORY_LABELS[j.service.category]} · {j.service.frequency}
                    {j.service.onTimePercent ? ` · ~${j.service.onTimePercent}% on-time` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Clock className="w-4 h-4" aria-hidden /> {formatDuration(j.durationMin)}
                  {j.intermediateStops > 0 && <span className="text-neutral-600">· {j.intermediateStops} stops</span>}
                </div>
              </div>

              {j.status !== 'running' && (
                <div className={`rounded-xl p-3.5 text-xs leading-relaxed flex gap-2 ${j.status === 'suspended' ? 'bg-red-950/30 border border-red-800/40 text-red-200' : 'bg-amber-950/20 border border-amber-800/40 text-amber-200'}`}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                  <span>
                    <strong className="uppercase">{j.status}</strong>
                    {j.statusNote ? ` — ${j.statusNote}` : ' — check with our rail desk before planning around this train.'}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center max-w-xl py-1">
                <div className="text-left space-y-1">
                  <p className="text-lg font-black text-white">{j.departureTime}</p>
                  <p className="text-xs text-neutral-400 leading-snug font-medium">{j.from.name} ({j.from.code})</p>
                </div>
                <div className="relative flex flex-col justify-center items-center flex-1 mx-6">
                  <div className="w-full h-[1px] bg-neutral-800 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neutral-500" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-lg font-black text-white">
                    {j.arrivalTime} <span className="text-[10px] text-amber-400 font-bold">{dayOffsetLabel(j.arrivalDayOffset)}</span>
                  </p>
                  <p className="text-xs text-neutral-400 leading-snug font-medium">{j.to.name} ({j.to.code})</p>
                </div>
              </div>

              {j.service.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {j.service.amenities.slice(0, 6).map((a) => (
                    <span key={a} className="text-[10px] text-neutral-400 bg-neutral-950 border border-neutral-850 rounded-full px-2.5 py-1">
                      {AMENITY_LABELS[a] ?? a}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-1">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">Choose a class · indicative fares</p>
                <TrainBookCTA
                  trainName={j.service.name}
                  trainNumbers={j.service.numbers.join('/')}
                  operatorName={j.operator.name}
                  fromName={`${j.from.name} (${j.from.code})`}
                  toName={`${j.to.name} (${j.to.code})`}
                  departureTime={j.departureTime}
                  arrivalTime={j.arrivalTime}
                  classes={j.classes.map((c) => ({ name: c.name, fare: c.fare, currency: c.currency, fareLabel: formatFare(c), perks: c.perks }))}
                />
              </div>
            </article>
          ))}
        </section>

        {/* FAQs */}
        <section aria-label="Frequently asked questions" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <RouteIcon className="w-4 h-4 text-emerald-400" aria-hidden /> {fromCity} to {toCity}: good to know
          </h2>
          <div className="space-y-5">
            {faqs.map((faq) => (
              <div key={faq.question} className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-sell */}
        <section aria-label="Complete your trip" className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          {[
            { href: '/hotels', title: `Hotels in ${toCity}`, sub: 'Stay near the station or the sights — free-cancellation options.' },
            { href: '/flights', title: `Flights to ${toCity}`, sub: 'Compare the train against flight times and fares.' },
            { href: '/insurance', title: 'Travel Insurance', sub: 'Cover delays, cancellations and baggage on any itinerary.' },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-2xl p-5 transition-colors group">
              <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{c.title}</p>
              <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">{c.sub}</p>
            </Link>
          ))}
        </section>

        {/* Internal links */}
        {related.length > 0 && (
          <section aria-label="Related train routes" className="space-y-4 print:hidden">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Related routes</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((c) => (
                <Link
                  key={`${c.from}-${c.to}`}
                  href={`/trains/route/${c.from}/${c.to}`}
                  className="text-[11px] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800/60 pt-6">{TRAIN_DISCLAIMER}</p>
      </div>
    </div>
  );
}
