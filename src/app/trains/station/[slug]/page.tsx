import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Accessibility, ArrowRight, Building2, Bus, Clock, ExternalLink, MapPin, TrainFront } from 'lucide-react';
import { servicesAtStation } from '@/lib/trains/engine';
import { stationBySlug, stationsByCitySlug } from '@/lib/trains/data/stations';
import { operatorById } from '@/lib/trains/data/operators';
import { stationFaqs, stationMetaDescription, stationMetaTitle } from '@/lib/trains/seo';
import { CATEGORY_LABELS } from '@/lib/trains/format';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { slug: string };

const FACILITY_LABELS: Record<string, string> = {
  parking: 'Parking',
  wifi: 'Wi-Fi',
  lounge: 'Lounge',
  food: 'Food & drink',
  luggage_storage: 'Luggage storage',
  accessible: 'Step-free access',
  restrooms: 'Restrooms',
  waiting_room: 'Waiting room',
  charging: 'Charging points',
  taxi: 'Taxi rank',
  checked_baggage: 'Checked baggage',
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const station = stationBySlug((await params).slug);
  if (!station) return {};
  const title = stationMetaTitle(station);
  const description = stationMetaDescription(station);
  const canonical = `/trains/station/${station.slug}`;
  return { title, description, alternates: { canonical }, openGraph: { title, description, type: 'website' }, twitter: { card: 'summary_large_image', title, description } };
}

export default async function StationPage({ params }: { params: Promise<Params> }) {
  const station = stationBySlug((await params).slug);
  if (!station) notFound();

  const departures = servicesAtStation(station.code);
  // Stations served only by a disabled placeholder operator (Brightline,
  // Alaska Railroad) have no active service — keep them out of the index.
  if (departures.length === 0) notFound();
  const trainNames = [...new Set(departures.map((d) => d.service.name))];
  const faqs = stationFaqs(station, trainNames);
  const siblings = stationsByCitySlug(station.citySlug).filter((s) => s.code !== station.code && servicesAtStation(s.code).length > 0);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lon}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TrainStation',
    name: station.name,
    address: { '@type': 'PostalAddress', addressLocality: station.city, addressRegion: station.region, addressCountry: station.country },
    geo: { '@type': 'GeoCoordinates', latitude: station.lat, longitude: station.lon },
  };

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Trains', path: '/trains' },
          { name: station.name, path: `/trains/station/${station.slug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd data={jsonLd} />

      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/trains" className="hover:text-neutral-200">Trains</Link> / {station.name}
          </nav>
          <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" aria-hidden /> Station guide · {station.code}
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">{station.name}</h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            {station.city}, {station.region} · served by {station.operators.map((o) => operatorById(o)?.name ?? o).join(', ')} · {trainNames.length}{' '}
            {trainNames.length === 1 ? 'train' : 'trains'} in our timetable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-[11px]">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" aria-hidden /> Open in Google Maps <ExternalLink className="w-3 h-3" aria-hidden />
            </a>
            {siblings.map((s) => (
              <Link
                key={s.code}
                href={`/trains/station/${s.slug}`}
                className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
              >
                Also in {station.city}: {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10 space-y-8">
        {/* Departure board */}
        <section aria-label="Departures" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" aria-hidden /> Departures from {station.code} (indicative)
            </h2>
            <p className="text-[10px] text-neutral-500">Sorted by scheduled time · frequencies vary by day</p>
          </div>
          <div className="divide-y divide-neutral-800/70">
            {departures.filter((d) => !d.terminating).map((d) => (
              <div key={`${d.service.slug}-${d.direction}`} className="py-3 flex items-center gap-4">
                <span className="text-sm font-black text-white font-mono w-14 shrink-0">{d.departureTime}</span>
                <div className="min-w-0 flex-1">
                  <Link href={`/trains/train/${d.service.slug}`} className="text-xs font-bold text-neutral-200 hover:text-emerald-300 transition-colors">
                    {d.service.name}
                  </Link>
                  <p className="text-[10px] text-neutral-500">
                    towards {d.towards.city} ({d.towards.code}) · {CATEGORY_LABELS[d.service.category]} · {d.service.frequency}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-600 shrink-0" aria-hidden />
              </div>
            ))}
            {departures.filter((d) => !d.terminating).length === 0 && (
              <p className="text-xs text-neutral-500 py-3">This station is a terminus for arrivals in our current timetable.</p>
            )}
          </div>
        </section>

        {/* Facilities & connections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-emerald-400" aria-hidden /> Facilities
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {station.facilities.map((f) => (
                <span key={f} className="text-[11px] text-neutral-300 bg-neutral-950 border border-neutral-850 rounded-full px-3 py-1.5">
                  {FACILITY_LABELS[f] ?? f}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-neutral-600 leading-relaxed pt-1">
              Facility hours can differ from train times — arrive early if you need staffed counters, luggage storage or lounge access.
            </p>
          </section>
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bus className="w-4 h-4 text-emerald-400" aria-hidden /> Onward connections
            </h2>
            <ul className="space-y-1.5">
              {station.connections.map((c) => (
                <li key={c} className="text-xs text-neutral-300 leading-relaxed">• {c}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Trains serving */}
        <section aria-label="Trains serving this station" className="space-y-4">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <TrainFront className="w-4 h-4 text-emerald-400" aria-hidden /> Trains calling at {station.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {trainNames.map((name) => {
              const d = departures.find((x) => x.service.name === name)!;
              return (
                <Link
                  key={name}
                  href={`/trains/train/${d.service.slug}`}
                  className="text-[11px] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </section>

        {/* FAQs */}
        <section aria-label="Frequently asked questions" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Good to know</h2>
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
        <section aria-label="Nearby" className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          {[
            { href: '/hotels', title: `Hotels near ${station.city} station`, sub: 'Walkable stays for early departures and late arrivals.' },
            { href: '/transfers', title: 'Station transfers', sub: 'Pre-booked pickups from the platform to your hotel.' },
            { href: '/ai-planner', title: `Things to do in ${station.city}`, sub: 'Let the AI planner build your city itinerary.' },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-2xl p-5 transition-colors group">
              <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{c.title}</p>
              <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">{c.sub}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
