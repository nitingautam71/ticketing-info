import type { Metadata } from 'next';
import Link from 'next/link';
import { Ticket, TrainFront } from 'lucide-react';
import { RAIL_PASSES } from '@/lib/trains/passes';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Amtrak Rail Passes — USA Rail Pass, California Rail Pass & More',
  description:
    'Compare Amtrak rail passes: the USA Rail Pass, California Rail Pass and multi-ride/monthly corridor passes — with expert advice on when a pass beats point-to-point Amtrak tickets.',
  alternates: { canonical: '/trains/passes' },
  openGraph: {
    title: 'Amtrak Rail Passes Compared | Ticketing-Info',
    description: 'USA Rail Pass, California Rail Pass and multi-ride passes — which Amtrak pass fits your trip, and when point-to-point wins.',
  },
};

const PASS_FAQS = [
  {
    question: 'When does a rail pass beat point-to-point tickets?',
    answer:
      'A pass usually wins when you take 4+ medium/long segments inside its validity window, want routing flexibility, or travel in peak season when walk-up fares spike. For 1–3 fixed journeys, advance-purchase point-to-point tickets are almost always cheaper — we run the math for your exact itinerary before recommending either.',
  },
  {
    question: 'Does the USA Rail Pass cover the Acela or sleepers?',
    answer:
      'No — the USA Rail Pass covers Coach seats on most Amtrak routes for 10 segments in 30 days. Acela and Auto Train are excluded, and sleeper accommodation requires paying the full accommodation charge on top.',
  },
  {
    question: 'Which pass is best for a long US rail trip?',
    answer:
      'For a multi-city cross-country trip the USA Rail Pass (10 segments in 30 days) is usually the winner; for California-only travel the California Rail Pass is cheaper; and for repeated trips on one corridor an Amtrak 10-ride or monthly pass beats walk-up fares. We price all three against your exact itinerary before recommending one.',
  },
  {
    question: 'Can you plan my itinerary around a pass?',
    answer:
      'Yes. Tell us your cities and dates and we design a segment-efficient routing, reserve every leg (many pass trains still need seat reservations), and handle changes mid-trip.',
  },
];

export default function RailPassesPage() {
  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Trains', path: '/trains' },
          { name: 'Rail Passes', path: '/trains/passes' },
        ])}
      />
      <JsonLd data={faqPageJsonLd(PASS_FAQS)} />

      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/trains" className="hover:text-neutral-200">Trains</Link> / Rail Passes
          </nav>
          <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
            <Ticket className="w-4 h-4" aria-hidden /> Rail passes
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">One pass, many trains.</h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Multi-journey Amtrak passes across the US — and honest advice on when point-to-point tickets are the better deal.
          </p>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10 space-y-8">
        <section aria-label="Available rail passes" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RAIL_PASSES.map((p) => (
            <article key={p.slug} className={`bg-neutral-900 border rounded-2xl p-6 space-y-3 ${p.available ? 'border-neutral-800' : 'border-neutral-850 opacity-70'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {p.name}
                    {!p.available && <span className="ml-2 text-[9px] uppercase font-bold tracking-wider text-sky-300 bg-sky-950/50 border border-sky-900 rounded-full px-2 py-0.5">Coming soon</span>}
                  </h2>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{p.operator}</p>
                </div>
                <span className="text-xs font-black text-emerald-400 shrink-0">{p.price}</span>
              </div>
              <dl className="space-y-1.5 text-xs leading-relaxed">
                <div><dt className="font-bold text-neutral-300 inline">Validity: </dt><dd className="text-neutral-400 inline">{p.validity}</dd></div>
                <div><dt className="font-bold text-neutral-300 inline">Covers: </dt><dd className="text-neutral-400 inline">{p.coverage}</dd></div>
                <div><dt className="font-bold text-neutral-300 inline">Best for: </dt><dd className="text-neutral-400 inline">{p.bestFor}</dd></div>
                <div><dt className="font-bold text-neutral-300 inline">How to buy: </dt><dd className="text-neutral-400 inline">{p.howToBuy}</dd></div>
              </dl>
            </article>
          ))}
        </section>

        <section className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-6 md:p-8 flex items-center justify-between gap-6 flex-wrap">
          <div className="space-y-1.5 max-w-xl">
            <p className="text-emerald-300 text-[10px] font-black tracking-[0.3em] uppercase">Pass planning</p>
            <h2 className="text-lg font-bold text-white">Not sure a pass pays off?</h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Send us your cities and dates — we price the pass against point-to-point tickets and book whichever wins.
            </p>
          </div>
          <Link
            href="/get-quote"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-xl transition-colors"
          >
            Get a pass quote
          </Link>
        </section>

        <section aria-label="Rail pass FAQs" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrainFront className="w-4 h-4 text-emerald-400" aria-hidden /> Pass questions, answered
          </h2>
          <div className="space-y-5">
            {PASS_FAQS.map((faq) => (
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
