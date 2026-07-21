import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle, Lightbulb, ShieldCheck } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import InsuranceHelpCTA from '@/components/insurance/InsuranceHelpCTA';
import InsuranceQuoteForm from '@/components/insurance/InsuranceQuoteForm';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import { CATEGORY_PAGES, categoryPageBySlug } from '@/lib/insurance/categories';
import { plansForCategory } from '@/lib/insurance/engine';
import { providerById } from '@/lib/insurance/providers';
import { INSURANCE_DISCLAIMER } from '@/lib/insurance/types';

/** Trip-type landing pages (/insurance/type/schengen, /student, …) — static
 * content + the catalog plans built for that segment. */
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_PAGES.map((c) => ({ slug: c.slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const page = categoryPageBySlug((await params).slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/insurance/type/${page.slug}` },
    openGraph: { title: page.metaTitle, description: page.metaDescription, type: 'website' },
  };
}

export default async function InsuranceTypePage({ params }: { params: Promise<Params> }) {
  const page = categoryPageBySlug((await params).slug);
  if (!page) notFound();

  const plans = plansForCategory(page.category);
  const others = CATEGORY_PAGES.filter((c) => c.slug !== page.slug).slice(0, 8);

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Travel Insurance', path: '/insurance' },
          { name: page.title, path: `/insurance/type/${page.slug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(page.faqs)} />

      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/insurance" className="hover:text-neutral-200">Insurance</Link> / {page.shortLabel}
          </nav>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">{page.title}</h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">{page.hero}</p>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10 space-y-8">
        {/* Quote form */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Get an instant comparison for your trip</h2>
          <InsuranceQuoteForm compact />
        </section>

        {/* Why it matters */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden /> Why it matters
          </h2>
          <ul className="space-y-3">
            {page.whyItMatters.map((w) => (
              <li key={w} className="text-xs text-neutral-300 leading-relaxed flex gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden /> {w}
              </li>
            ))}
          </ul>
        </section>

        {/* Matching plans */}
        {plans.length > 0 && (
          <section aria-label="Matching plans" className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {plans.length} plan{plans.length > 1 ? 's' : ''} built for this
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((p) => {
                const provider = providerById(p.providerId);
                return (
                  <Link
                    key={p.id}
                    href={`/insurance/plan/${p.slug}`}
                    className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-2xl p-5 transition-colors group"
                  >
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{provider?.name}</p>
                    <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">{p.name}</p>
                    <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">{p.tagline}</p>
                    <p className="text-[11px] font-bold text-emerald-300 mt-2.5">{p.medicalSumInsuredLabel} medical cover →</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Lead capture */}
        <InsuranceHelpCTA
          title={`Insurance Enquiry: ${page.title}`}
          subtitle={page.shortLabel}
          details={{ category: page.category }}
        />

        {/* Buying advice */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-400" aria-hidden /> How to buy it right
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {page.buyingAdvice.map((a) => (
              <li key={a} className="text-xs text-neutral-300 leading-relaxed">
                {a}
              </li>
            ))}
          </ol>
        </section>

        {/* FAQs */}
        <section aria-label="Frequently asked questions" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section aria-label="Other trip types" className="space-y-4 print:hidden">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Other trip types</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/insurance/type/${c.slug}`}
                className="text-[11px] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
              >
                {c.shortLabel}
              </Link>
            ))}
            <Link
              href="/insurance"
              className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 border border-emerald-800/50 rounded-full px-3.5 py-1.5 transition-colors"
            >
              All plans &amp; instant quotes →
            </Link>
          </div>
        </section>

        <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800/60 pt-6">{INSURANCE_DISCLAIMER}</p>
      </div>
    </div>
  );
}
