import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/layout/HeroSection';
import TrainSearchForm from '@/components/trains/TrainSearchForm';
import TrainAssistant from '@/components/trains/TrainAssistant';
import JsonLd from '@/components/seo/JsonLd';
import { faqPageJsonLd } from '@/lib/structuredData';
import { HERO_COPY } from '@/lib/nav';
import { FEATURED_CORRIDORS_LONG_DISTANCE, FEATURED_CORRIDORS_NEC, FEATURED_TRAINS } from '@/lib/trains/popular';
import { activeStations, trainBySlug } from '@/lib/trains/engine';
import { TRAIN_OPERATORS } from '@/lib/trains/data/operators';
import { CATEGORY_LABELS, formatDuration } from '@/lib/trains/format';

export const metadata: Metadata = {
  title: 'Amtrak Train Tickets — Routes, Timetables, Fares & Booking',
  description:
    'Search Amtrak routes across the US: Acela and the Northeast Corridor, state corridors, and iconic long-distance trains — California Zephyr, Coast Starlight, Empire Builder, Auto Train and more. Compare timetables, classes and indicative fares, ask the AI rail assistant, and book with a real rail desk.',
  alternates: { canonical: '/trains' },
  openGraph: {
    title: 'Amtrak Train Tickets — US Rail Booking | Ticketing-Info',
    description: 'Amtrak across the US: Acela, the Northeast Corridor, state corridors and long-distance trains — timetables, fares, station guides and assisted booking.',
  },
};

const HUB_FAQS = [
  {
    question: 'Which train network does Ticketing-Info cover?',
    answer:
      'We focus on Amtrak and US passenger rail — Acela and the Northeast Corridor, state-supported corridors (Pacific Surfliner, San Joaquins, Keystone, Piedmont and more), and the iconic long-distance network (California Zephyr, Coast Starlight, Empire Builder, Southwest Chief, Silver Star, Auto Train). The platform’s operator abstraction is built to add other North American operators — Brightline, Alaska Railroad and VIA Rail (Canada) — without re-architecting.',
  },
  {
    question: 'Are the fares shown live?',
    answer:
      'Fares and timetables on this site are indicative, compiled from official Amtrak schedules. Amtrak fares are dynamic and rise as seats sell, so our rail desk always confirms live availability and exact pricing before ticketing — you never pay an estimated fare.',
  },
  {
    question: 'Can I get senior, military, student or child fares?',
    answer:
      'Yes. Amtrak offers 10% off for seniors (65+) and for passengers with a disability, up to 50% off for children (2–12), military and veteran discounts, and student discounts through partner programs. Our rail desk applies every discount you qualify for and books accessible seating, bike spaces and small-pet reservations where the route allows.',
  },
  {
    question: 'Can you book sleepers and scenic trains?',
    answer:
      'Yes — Amtrak Roomettes and Bedrooms on the overnight routes, and high-demand scenic services like the California Zephyr through the Rockies and Sierra, the Coast Starlight down the Pacific, and the Auto Train that carries your car to Florida. We also package Amtrak with hotels, flights, transfers, insurance and visas.',
  },
];

const CORRIDOR_GROUPS = [
  { title: 'Northeast Corridor & state corridors', corridors: FEATURED_CORRIDORS_NEC },
  { title: 'Iconic long-distance routes', corridors: FEATURED_CORRIDORS_LONG_DISTANCE },
];

export default function TrainsPage() {
  const hero = HERO_COPY['/trains'];
  const featuredTrains = FEATURED_TRAINS.map((slug) => trainBySlug(slug)).filter((s) => s !== undefined);
  const stations = activeStations();
  const liveOperators = TRAIN_OPERATORS.filter((o) => o.enabled);
  const futureOperators = TRAIN_OPERATORS.filter((o) => !o.enabled);

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd data={faqPageJsonLd(HUB_FAQS)} />
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 space-y-12">
        <TrainSearchForm />

        {/* Featured Amtrak corridors */}
        <section aria-label="Popular Amtrak routes" className="space-y-6">
          {CORRIDOR_GROUPS.map((group) => (
            <div key={group.title} className="space-y-4">
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{group.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {group.corridors.map((c) => (
                  <Link
                    key={`${c.from}-${c.to}`}
                    href={`/trains/route/${c.from}/${c.to}`}
                    className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-xl p-4 transition-colors group"
                  >
                    <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">{c.label}</p>
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">Times & fares</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <TrainAssistant />

          {/* Iconic trains */}
          <section aria-label="Iconic Amtrak trains" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-white">Iconic Amtrak Trains</h2>
              <p className="text-[11px] text-neutral-500 mt-1">Timetables, classes, amenities and booking for the trains people travel for.</p>
            </div>
            <div className="space-y-2.5">
              {featuredTrains.map((t) => (
                <Link
                  key={t.slug}
                  href={`/trains/train/${t.slug}`}
                  className="flex items-center justify-between gap-3 bg-neutral-950 border border-neutral-800 hover:border-emerald-800/60 rounded-xl px-4 py-3 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">{t.name}</p>
                    <p className="text-[10px] text-neutral-500">
                      {CATEGORY_LABELS[t.category]} · {formatDuration(t.durationMin)} · {t.frequency}
                    </p>
                  </div>
                  <span className="text-[10px] text-neutral-600 font-mono shrink-0">{t.numbers[0]}</span>
                </Link>
              ))}
            </div>
            <Link href="/trains/passes" className="inline-block text-[11px] font-bold text-emerald-300 hover:text-emerald-200 transition-colors">
              Compare Amtrak rail passes (USA Rail Pass, California Rail Pass) →
            </Link>
          </section>
        </div>

        {/* Operators — live + future placeholders */}
        <section aria-label="Rail operators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
            {liveOperators.map((o) => (
              <div key={o.id} className="bg-neutral-900 border border-emerald-900/40 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{o.name}</p>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-950/50 border border-emerald-900 rounded-full px-2 py-0.5">Bookable now</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{o.description}</p>
              </div>
            ))}
          </div>
          {futureOperators.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Coming to the platform</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {futureOperators.map((o) => (
                  <div key={o.id} className="bg-neutral-900/50 border border-neutral-850 rounded-2xl p-5 space-y-2 opacity-80">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-neutral-200">{o.name}</p>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-sky-300 bg-sky-950/40 border border-sky-900 rounded-full px-2 py-0.5">Soon</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">{o.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Station directory (active Amtrak stations only) */}
        <section aria-label="Amtrak station guides" className="space-y-3">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Amtrak station guides</h2>
          <div className="flex flex-wrap gap-2">
            {stations.map((s) => (
              <Link
                key={s.code}
                href={`/trains/station/${s.slug}`}
                className="text-[11px] text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
              >
                {s.city} <span className="text-neutral-600 font-mono">{s.code}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-label="Amtrak booking FAQs" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Good to know</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HUB_FAQS.map((faq) => (
              <div key={faq.question} className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
