import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/layout/HeroSection';
import TrainSearchForm from '@/components/trains/TrainSearchForm';
import TrainAssistant from '@/components/trains/TrainAssistant';
import JsonLd from '@/components/seo/JsonLd';
import { faqPageJsonLd } from '@/lib/structuredData';
import { HERO_COPY } from '@/lib/nav';
import { FEATURED_CORRIDORS_IN, FEATURED_CORRIDORS_US, FEATURED_TRAINS } from '@/lib/trains/popular';
import { trainBySlug } from '@/lib/trains/engine';
import { TRAIN_OPERATORS } from '@/lib/trains/data/operators';
import { TRAIN_STATIONS } from '@/lib/trains/data/stations';
import { CATEGORY_LABELS, formatDuration } from '@/lib/trains/format';

export const metadata: Metadata = {
  title: 'Train Tickets — Amtrak, Brightline & Indian Railways Booking',
  description:
    'Search US and India train routes: Amtrak, Acela, Brightline, Alaska Railroad, Vande Bharat, Rajdhani, Shatabdi and more. Compare timetables, classes and indicative fares, ask the AI rail assistant, and book with a real rail desk.',
  alternates: { canonical: '/trains' },
  openGraph: {
    title: 'Train Tickets — US & India Rail Booking | Ticketing-Info',
    description: 'Amtrak, Brightline, Alaska Railroad and Indian Railways premium trains: timetables, fares, station guides and assisted booking.',
  },
};

const HUB_FAQS = [
  {
    question: 'Which train networks does Ticketing-Info cover?',
    answer:
      'Today we cover Amtrak (including Acela and the long-distance network), Brightline in Florida, the Alaska Railroad, and Indian Railways premium services — Vande Bharat, Rajdhani, Shatabdi, Duronto, Tejas and Gatimaan. The platform is built to add more networks (Europe, Japan, Canada) without re-architecting.',
  },
  {
    question: 'Are the fares shown live?',
    answer:
      'Fares and timetables on this site are indicative, compiled from official operator schedules. Rail fares are dynamic (and quota-driven in India), so our rail desk always confirms live availability and exact pricing before ticketing — you never pay an estimated fare.',
  },
  {
    question: 'How do Indian Railways quotas and Tatkal work?',
    answer:
      'Reserved classes sell through quotas: General opens ~60 days out, Tatkal opens the day before travel (10:00 AM for AC, 11:00 AM for non-AC), and Premium Tatkal adds dynamic pricing. Our rail desk plans quota strategy, monitors waitlists and handles refunds under Indian Railways rules.',
  },
  {
    question: 'Can you book sleepers and scenic trains?',
    answer:
      'Yes — Amtrak roomettes and bedrooms, Indian AC 1st/2nd/3rd tier berths, and high-demand scenic services like the Alaska Railroad GoldStar domes (which sell out months ahead in summer). We also package trains with hotels, flights, transfers, insurance and visas.',
  },
];

export default function TrainsPage() {
  const hero = HERO_COPY['/trains'];
  const featuredTrains = FEATURED_TRAINS.map((slug) => trainBySlug(slug)).filter((s) => s !== undefined);
  const usStations = TRAIN_STATIONS.filter((s) => s.country === 'US');
  const inStations = TRAIN_STATIONS.filter((s) => s.country === 'IN');

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd data={faqPageJsonLd(HUB_FAQS)} />
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 space-y-12">
        <TrainSearchForm />

        {/* Featured corridors */}
        <section aria-label="Popular train routes" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Popular US routes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FEATURED_CORRIDORS_US.map((c) => (
                <Link
                  key={`${c.from}-${c.to}`}
                  href={`/trains/route/${c.from}/${c.to}`}
                  className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-xl p-4 transition-colors group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">🇺🇸 {c.label}</p>
                  <p className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">Times & fares</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Popular India routes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FEATURED_CORRIDORS_IN.map((c) => (
                <Link
                  key={`${c.from}-${c.to}`}
                  href={`/trains/route/${c.from}/${c.to}`}
                  className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-xl p-4 transition-colors group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">🇮🇳 {c.label}</p>
                  <p className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">Times & fares</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <TrainAssistant />

          {/* Famous trains */}
          <section aria-label="Famous trains" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-white">Iconic Trains</h2>
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
              Compare rail passes (USA Rail Pass, circular tickets, Eurail) →
            </Link>
          </section>
        </div>

        {/* Operators */}
        <section aria-label="Rail operators" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {TRAIN_OPERATORS.map((o) => (
            <div key={o.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
              <p className="text-sm font-bold text-white">{o.name}</p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{o.description}</p>
            </div>
          ))}
        </section>

        {/* Station directory */}
        <section aria-label="Station guides" className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">US station guides</h2>
            <div className="flex flex-wrap gap-2">
              {usStations.map((s) => (
                <Link
                  key={s.code}
                  href={`/trains/station/${s.slug}`}
                  className="text-[11px] text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  {s.city} <span className="text-neutral-600 font-mono">{s.code}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">India station guides</h2>
            <div className="flex flex-wrap gap-2">
              {inStations.map((s) => (
                <Link
                  key={s.code}
                  href={`/trains/station/${s.slug}`}
                  className="text-[11px] text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  {s.city} <span className="text-neutral-600 font-mono">{s.code}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-label="Train booking FAQs" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
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
