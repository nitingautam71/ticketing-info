import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, Briefcase, Clock, ExternalLink, Gauge, PawPrint, RotateCcw, TrainFront, Wifi } from 'lucide-react';
import { outboundTimetable, serviceOverride, trainBySlug, TRAIN_DISCLAIMER } from '@/lib/trains/engine';
import { operatorById } from '@/lib/trains/data/operators';
import { stationByCode } from '@/lib/trains/data/stations';
import { railProvider } from '@/lib/providers/trains';
import { trainFaqs, trainMetaDescription, trainMetaTitle } from '@/lib/trains/seo';
import { AMENITY_LABELS, CATEGORY_LABELS, dayOffsetLabel, formatDuration, formatFare } from '@/lib/trains/format';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/seo/JsonLd';
import TrainBookCTA from '@/components/trains/TrainBookCTA';

// Hourly ISR so rail-desk status notices surface quickly while the page stays cached.
export const revalidate = 3600;
export const dynamicParams = true;

type Params = { slug: string };

function loadService(slug: string) {
  const service = trainBySlug(slug);
  if (!service) return null;
  const from = stationByCode(service.stops[0].station);
  const to = stationByCode(service.stops[service.stops.length - 1].station);
  const operator = operatorById(service.operator);
  if (!from || !to || !operator) return null;
  return { service, from, to, operator };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const loaded = loadService((await params).slug);
  if (!loaded) return {};
  const title = trainMetaTitle(loaded.service);
  const description = trainMetaDescription(loaded.service, loaded.from, loaded.to);
  const canonical = `/trains/train/${loaded.service.slug}`;
  return { title, description, alternates: { canonical }, openGraph: { title, description, type: 'website' }, twitter: { card: 'summary_large_image', title, description } };
}

export default async function TrainDetailPage({ params }: { params: Promise<Params> }) {
  const loaded = loadService((await params).slug);
  if (!loaded) notFound();
  const { service, from, to, operator } = loaded;
  const override = await serviceOverride(service.slug);
  const timetable = outboundTimetable(service);
  const faqs = trainFaqs(service, from, to);
  const related = railProvider
    .services()
    .filter((s) => s.slug !== service.slug && (s.operator === service.operator || s.stops.some((st) => st.station === from.code || st.station === to.code)))
    .slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TrainTrip',
    trainName: service.name,
    trainNumber: service.numbers[0],
    provider: { '@type': 'Organization', name: operator.name, url: operator.website },
    departureStation: { '@type': 'TrainStation', name: from.name, address: `${from.city}, ${from.region}` },
    arrivalStation: { '@type': 'TrainStation', name: to.name, address: `${to.city}, ${to.region}` },
    departureTime: service.departures.outbound,
  };

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Trains', path: '/trains' },
          { name: service.name, path: `/trains/train/${service.slug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd data={jsonLd} />

      {/* Header */}
      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/trains" className="hover:text-neutral-200">Trains</Link> / {service.name}
          </nav>
          <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
            <TrainFront className="w-4 h-4" aria-hidden /> {operator.name} · {CATEGORY_LABELS[service.category]}
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">{service.name}</h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">{service.description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-[11px]">
            <Link
              href={`/trains/route/${from.citySlug}/${to.citySlug}`}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
            >
              All {from.city} → {to.city} trains
            </Link>
            <a
              href={operator.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
            >
              {operator.name} official site <ExternalLink className="w-3 h-3" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10 space-y-8">
        {override && override.status !== 'running' && (
          <div className={`rounded-2xl p-5 text-xs leading-relaxed flex gap-2.5 ${override.status === 'suspended' ? 'bg-red-950/30 border border-red-800/40 text-red-200' : 'bg-amber-950/20 border border-amber-800/40 text-amber-200'}`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
            <span>
              <strong className="uppercase">Service {override.status}</strong>
              {override.notes ? ` — ${override.notes}` : ''} <span className="opacity-70">(updated {override.updatedAt.slice(0, 10)} by our rail desk)</span>
            </span>
          </div>
        )}

        {/* Fact grid */}
        <section aria-label="Key facts" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Train numbers', value: service.numbers.join(' / '), icon: TrainFront },
            { label: 'End-to-end', value: `${formatDuration(service.durationMin)} · ${service.distanceKm.toLocaleString()} km`, icon: Clock },
            { label: 'Frequency', value: service.frequency, icon: RotateCcw },
            { label: service.maxSpeedKmh ? 'Top speed' : 'On-time', value: service.maxSpeedKmh ? `${service.maxSpeedKmh} km/h` : service.onTimePercent ? `~${service.onTimePercent}%` : '—', icon: Gauge },
          ].map((f) => (
            <div key={f.label} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-1">
              <p className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1.5">
                <f.icon className="w-3.5 h-3.5 text-emerald-400" aria-hidden /> {f.label}
              </p>
              <p className="text-sm font-bold text-white leading-snug">{f.value}</p>
            </div>
          ))}
        </section>

        {/* Timetable */}
        <section aria-label="Route and timetable" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Route & indicative timetable</h2>
            <p className="text-[10px] text-neutral-500">
              Outbound departure {service.departures.outbound}
              {service.departures.return ? ` · return departs ${service.departures.return}` : ''}
            </p>
          </div>
          <ol className="space-y-0">
            {timetable.map((row, i) => (
              <li key={row.station.code} className="relative flex gap-4 pb-5 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className={`w-2.5 h-2.5 rounded-full mt-1 ${i === 0 || i === timetable.length - 1 ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                  {i < timetable.length - 1 && <span className="flex-1 w-px bg-neutral-800 mt-1" />}
                </div>
                <div className="flex-1 flex items-start justify-between gap-4 -mt-0.5">
                  <div>
                    <Link href={`/trains/station/${row.station.slug}`} className="text-sm font-bold text-white hover:text-emerald-300 transition-colors">
                      {row.station.name} <span className="text-neutral-500 font-mono text-[10px]">{row.station.code}</span>
                    </Link>
                    <p className="text-[10px] text-neutral-500">{row.station.city}, {row.station.region}</p>
                  </div>
                  <p className="text-xs text-neutral-300 font-mono text-right shrink-0">
                    {row.arrives && <>arr {row.arrives} </>}
                    {row.departs && <span className="text-neutral-500">dep {row.departs}</span>}
                    {row.dayOffset > 0 && <span className="text-amber-400 ml-1">{dayOffsetLabel(row.dayOffset)}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Classes & booking */}
        <section aria-label="Classes and fares" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Classes & indicative end-to-end fares</h2>
          <TrainBookCTA
            trainName={service.name}
            trainNumbers={service.numbers.join('/')}
            operatorName={operator.name}
            fromName={`${from.name} (${from.code})`}
            toName={`${to.name} (${to.code})`}
            departureTime={service.departures.outbound}
            arrivalTime={timetable[timetable.length - 1]?.arrives ?? ''}
            classes={service.classes.map((c) => ({ name: c.name, fare: c.fare, currency: c.currency, fareLabel: formatFare(c), perks: c.perks }))}
          />
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {service.classes.map((c) => (
              <li key={c.code} className="text-[11px] text-neutral-400 leading-relaxed">
                <span className="font-bold text-neutral-200">{c.name}:</span> {c.perks.join(' · ')}
              </li>
            ))}
          </ul>
        </section>

        {/* Amenities + tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-400" aria-hidden /> Onboard amenities
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {service.amenities.map((a) => (
                <span key={a} className="text-[11px] text-neutral-300 bg-neutral-950 border border-neutral-850 rounded-full px-3 py-1.5">
                  {AMENITY_LABELS[a] ?? a}
                </span>
              ))}
            </div>
            {service.tips && service.tips.length > 0 && (
              <ul className="space-y-1.5 pt-2">
                {service.tips.map((t) => (
                  <li key={t} className="text-xs text-neutral-400 leading-relaxed">• {t}</li>
                ))}
              </ul>
            )}
          </section>
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" aria-hidden /> {operator.name} policies
            </h2>
            <dl className="space-y-2.5 text-xs leading-relaxed">
              <div><dt className="font-bold text-neutral-200 inline">Baggage: </dt><dd className="text-neutral-400 inline">{operator.policies.baggage}</dd></div>
              <div><dt className="font-bold text-neutral-200 inline-flex items-center gap-1"><PawPrint className="w-3 h-3" aria-hidden /> Pets: </dt><dd className="text-neutral-400 inline"> {operator.policies.pets}</dd></div>
              <div><dt className="font-bold text-neutral-200 inline">Bikes: </dt><dd className="text-neutral-400 inline">{operator.policies.bikes}</dd></div>
              <div><dt className="font-bold text-neutral-200 inline">Refunds: </dt><dd className="text-neutral-400 inline">{operator.policies.refunds}</dd></div>
              <div><dt className="font-bold text-neutral-200 inline">Accessibility: </dt><dd className="text-neutral-400 inline">{operator.policies.accessibility}</dd></div>
            </dl>
          </section>
        </div>

        {/* FAQs */}
        <section aria-label="Frequently asked questions" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Frequently asked questions</h2>
          <div className="space-y-5">
            {faqs.map((faq) => (
              <div key={faq.question} className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related trains */}
        {related.length > 0 && (
          <section aria-label="Related trains" className="space-y-4 print:hidden">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">More trains you might compare</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  href={`/trains/train/${s.slug}`}
                  className="text-[11px] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  {s.name}
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
