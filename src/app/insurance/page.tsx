import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/layout/HeroSection';
import InsuranceQuoteForm from '@/components/insurance/InsuranceQuoteForm';
import InsuranceAssistant from '@/components/insurance/InsuranceAssistant';
import JsonLd from '@/components/seo/JsonLd';
import { faqPageJsonLd } from '@/lib/structuredData';
import { HERO_COPY } from '@/lib/nav';
import { countryByCode, flagEmoji } from '@/lib/visas/countries';
import { INSURANCE_PROVIDERS } from '@/lib/insurance/providers';
import { CATEGORY_PAGES } from '@/lib/insurance/categories';
import { INSURANCE_GUIDES } from '@/lib/insurance/guides';
import { FEATURED_CATEGORY_SLUGS, FEATURED_QUOTES, POPULAR_INSURANCE_DESTINATIONS } from '@/lib/insurance/popular';

export const metadata: Metadata = {
  title: 'Travel Insurance — Compare Plans from Leading US & Indian Insurers',
  description:
    'Compare travel insurance from Allianz, Travel Guard, IMG, Tata AIG, ICICI Lombard, HDFC ERGO and more: medical, cancellation, baggage and evacuation cover with instant indicative quotes, an AI advisor and expert purchase help.',
  alternates: { canonical: '/insurance' },
  openGraph: {
    title: 'Travel Insurance — Compare Plans from Leading US & Indian Insurers | Ticketing-Info',
    description:
      'Compare travel insurance plans for every trip type: instant indicative quotes, side-by-side benefits, AI guidance and expert purchase help.',
  },
};

const HUB_FAQS = [
  {
    question: 'How does this comparison work?',
    answer:
      'We maintain a curated catalog of plans from leading US and Indian insurers — benefit tables compiled from public plan literature — and estimate premiums from your trip details. Estimates are indicative: the insurer always sets the final premium, and our consultants confirm it before any purchase.',
  },
  {
    question: 'Do you sell the policies yourselves?',
    answer:
      'Policies are issued by the insurers. Our consultants help you choose, confirm final pricing and eligibility with the insurer, complete the purchase, and stay on your file for renewals and claims help — at no extra cost to you.',
  },
  {
    question: 'Which travellers do you serve?',
    answer:
      'Primarily US residents and Indian residents, plus visitor-medical plans (inbound USA and inbound India) available to most nationalities. Senior travellers are covered to age 85 through specific plans, and students up to 2 years abroad.',
  },
  {
    question: 'What if I need to claim?',
    answer:
      'Claims are filed with the insurer — every plan page lists the process and contacts. If you bought through us, our desk helps assemble the claim file and chases the insurer on your behalf.',
  },
];

export default function InsurancePage() {
  const hero = HERO_COPY['/insurance'];
  const featuredCategories = FEATURED_CATEGORY_SLUGS.map((slug) => CATEGORY_PAGES.find((c) => c.slug === slug)).filter(
    (c): c is (typeof CATEGORY_PAGES)[number] => Boolean(c),
  );

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd data={faqPageJsonLd(HUB_FAQS)} />
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 space-y-12">
        <InsuranceQuoteForm />

        {/* Featured corridors */}
        <section aria-label="Popular insurance quotes" className="space-y-4">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Popular right now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATURED_QUOTES.map(({ residence, destination, label }) => {
              const from = countryByCode(residence);
              const to = countryByCode(destination);
              if (!from || !to) return null;
              return (
                <Link
                  key={label}
                  href={`/insurance/destination/${to.slug}`}
                  className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-xl p-4 transition-colors group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    <span aria-hidden>{flagEmoji(from.code)}</span> {label} <span aria-hidden>{flagEmoji(to.code)}</span>
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">Insurance guide &amp; plans</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Trip types */}
        <section aria-label="Insurance by trip type" className="space-y-4">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Cover for every kind of trip</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {featuredCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/insurance/type/${c.slug}`}
                className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-xl p-4 transition-colors group"
              >
                <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">{c.title}</p>
                <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed line-clamp-2">{c.metaDescription.split(':')[1]?.trim() ?? c.hero}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InsuranceAssistant />

          {/* Providers */}
          <section aria-label="Insurance providers" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-white">Insurers We Compare</h2>
              <p className="text-[11px] text-neutral-500 mt-1">
                Leading US and Indian travel insurers — benefit tables, claim processes and support contacts for each.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INSURANCE_PROVIDERS.map((p) => (
                <Link
                  key={p.id}
                  href={`/insurance/provider/${p.slug}`}
                  className="text-[11px] text-neutral-300 hover:text-white bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Destination guides */}
        <section aria-label="Destination insurance guides" className="space-y-4">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Destination insurance guides</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_INSURANCE_DESTINATIONS.map((code) => {
              const c = countryByCode(code);
              if (!c) return null;
              return (
                <Link
                  key={code}
                  href={`/insurance/destination/${c.slug}`}
                  className="text-[11px] text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  <span aria-hidden>{flagEmoji(code)}</span> {c.name} insurance
                </Link>
              );
            })}
          </div>
        </section>

        {/* Guides */}
        <section aria-label="Insurance guides" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Learn before you buy</h2>
            <Link href="/insurance/guides" className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200">
              All guides →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {INSURANCE_GUIDES.slice(0, 6).map((g) => (
              <Link
                key={g.slug}
                href={`/insurance/guides/${g.slug}`}
                className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-xl p-4 transition-colors group"
              >
                <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">{g.title}</p>
                <p className="text-[10px] text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">{g.intro}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-label="Insurance FAQs" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
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
