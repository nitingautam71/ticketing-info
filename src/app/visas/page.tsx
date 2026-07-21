import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/layout/HeroSection';
import VisaSearchForm from '@/components/visas/VisaSearchForm';
import VisaAssistant from '@/components/visas/VisaAssistant';
import JsonLd from '@/components/seo/JsonLd';
import { faqPageJsonLd } from '@/lib/structuredData';
import { HERO_COPY } from '@/lib/nav';
import { countryByCode, flagEmoji } from '@/lib/visas/countries';
import { FEATURED_CORRIDORS, POPULAR_DESTINATIONS, TOP_PASSPORTS } from '@/lib/visas/popular';

export const metadata: Metadata = {
  title: 'Visa Checker — Instant Requirements for Every Passport & Destination',
  description:
    'Check visa requirements for any of 199 passports to 199 destinations: visa-free stays, e-visas, ETAs, visa on arrival, fees, processing times, documents, transit and health rules — then apply with expert help.',
  alternates: { canonical: '/visas' },
  openGraph: {
    title: 'Visa Checker — Instant Requirements for Every Passport & Destination | Ticketing-Info',
    description:
      'Instant visa requirements for every passport and destination worldwide: stay limits, fees, documents, transit and health rules.',
  },
};

const HUB_FAQS = [
  {
    question: 'How accurate is this visa checker?',
    answer:
      'Results combine a continuously maintained global visa dataset covering all 199 passports and destinations with corrections curated by our visa desk. Rules change without notice, so always confirm with the official government portal linked on each result before booking non-refundable travel.',
  },
  {
    question: 'Does the checker cover e-visas, ETAs and visa on arrival?',
    answer:
      'Yes — every check distinguishes visa-free entry, visa on arrival, e-visa, electronic travel authorisations (like ESTA, UK ETA, eTA Canada), and embassy visas, with stay limits, fees and processing times for each.',
  },
  {
    question: 'Can you help me actually get the visa?',
    answer:
      'Yes. Our consultants handle forms, appointment booking, document review, insurance-compliant bookings and courier logistics for embassy and online applications alike. Use the “Get Visa Help” button on any result.',
  },
  {
    question: 'Do I need a transit visa for my connection?',
    answer:
      'Every result includes transit rules for the destination — including special hub rules for the USA, UK, Schengen airports, China, the Gulf hubs, Singapore and more, plus what changes when you self-transfer on separate tickets.',
  },
];

export default function VisasPage() {
  const hero = HERO_COPY['/visas'];
  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd data={faqPageJsonLd(HUB_FAQS)} />
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 space-y-12">
        <VisaSearchForm />

        {/* Featured corridors */}
        <section aria-label="Popular visa checks" className="space-y-4">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Popular right now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATURED_CORRIDORS.map(({ passport, destination }) => {
              const from = countryByCode(passport);
              const to = countryByCode(destination);
              if (!from || !to) return null;
              return (
                <Link
                  key={`${passport}-${destination}`}
                  href={`/visas/${from.slug}/${to.slug}`}
                  className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-xl p-4 transition-colors group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    <span aria-hidden>{flagEmoji(from.code)}</span> {from.name} → <span aria-hidden>{flagEmoji(to.code)}</span> {to.name}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">Visa requirements</p>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <VisaAssistant />

          <section aria-label="Passport power reports" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-white">Passport Power Reports</h2>
              <p className="text-[11px] text-neutral-500 mt-1">
                Every destination your passport reaches — visa-free, on-arrival, ETA, e-visa — with stay limits.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {TOP_PASSPORTS.map((code) => {
                const c = countryByCode(code);
                if (!c) return null;
                return (
                  <Link
                    key={code}
                    href={`/visas/passport/${c.slug}`}
                    className="text-[11px] text-neutral-300 hover:text-white bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                  >
                    <span aria-hidden>{flagEmoji(code)}</span> {c.name}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Destination policies */}
        <section aria-label="Destination visa policies" className="space-y-4">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Destination visa policies</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_DESTINATIONS.map((code) => {
              const c = countryByCode(code);
              if (!c) return null;
              return (
                <Link
                  key={code}
                  href={`/visas/destination/${c.slug}`}
                  className="text-[11px] text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  <span aria-hidden>{flagEmoji(code)}</span> {c.name} visa policy
                </Link>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section aria-label="Visa checker FAQs" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
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
