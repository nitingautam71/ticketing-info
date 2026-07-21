import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertCircle, CheckCircle, ExternalLink, FileText, HeartPulse, ShieldCheck } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import InsuranceHelpCTA from '@/components/insurance/InsuranceHelpCTA';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import { INSURANCE_PLANS, planBySlug } from '@/lib/insurance/plans';
import { providerById } from '@/lib/insurance/providers';
import { COVERAGE_INFO, COVERAGE_ORDER } from '@/lib/insurance/coverage';
import { REGION_LABELS } from '@/lib/insurance/regions';
import { categoryPage } from '@/lib/insurance/categories';
import { planFaqs, planMetaDescription, planMetaTitle } from '@/lib/insurance/seo';
import { INSURANCE_DISCLAIMER } from '@/lib/insurance/types';

/** Plan detail pages render purely from the bundled catalog — static at build,
 * refreshed daily. Admin notes/pricing overrides surface on live quote runs. */
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return INSURANCE_PLANS.map((p) => ({ slug: p.slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const plan = planBySlug((await params).slug);
  if (!plan) return {};
  const provider = providerById(plan.providerId);
  if (!provider) return {};
  const title = planMetaTitle(plan, provider);
  const description = planMetaDescription(plan);
  return {
    title,
    description,
    alternates: { canonical: `/insurance/plan/${plan.slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function InsurancePlanPage({ params }: { params: Promise<Params> }) {
  const plan = planBySlug((await params).slug);
  if (!plan) notFound();
  const provider = providerById(plan.providerId);
  if (!provider) notFound();

  const faqs = planFaqs(plan, provider);
  const siblings = INSURANCE_PLANS.filter((p) => p.providerId === plan.providerId && p.id !== plan.id);
  const relatedCategories = plan.categories.map((c) => categoryPage(c)).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Travel Insurance', path: '/insurance' },
          { name: provider.name, path: `/insurance/provider/${provider.slug}` },
          { name: plan.name, path: `/insurance/plan/${plan.slug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />

      {/* Header */}
      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/insurance" className="hover:text-neutral-200">Insurance</Link> /{' '}
            <Link href={`/insurance/provider/${provider.slug}`} className="hover:text-neutral-200">{provider.name}</Link> / {plan.name}
          </nav>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3">{provider.name}</p>
              <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">{plan.name}</h1>
              <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">{plan.tagline}</p>
            </div>
            <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border bg-emerald-950/60 text-emerald-400 border-emerald-900 flex items-center gap-1.5 mt-2">
              <ShieldCheck className="w-4 h-4" aria-hidden /> {plan.medicalSumInsuredLabel} medical
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10 space-y-8">
        {/* Fact grid */}
        <section aria-label="Key facts" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Medical Sum Insured', value: plan.medicalSumInsuredLabel },
            { label: 'Deductible', value: plan.deductibleLabel },
            { label: 'Ages Accepted', value: `${plan.eligibility.minAge}–${plan.eligibility.maxAge}` },
            {
              label: plan.eligibility.perTripCapDays ? 'Per-Trip Cap' : 'Max Trip Length',
              value: `${plan.eligibility.perTripCapDays ?? plan.eligibility.maxTripDays} days`,
            },
            { label: 'Sold To', value: plan.market === 'US' ? 'US residents' : plan.market === 'IN' ? 'India residents' : 'Most nationalities' },
            { label: 'Destinations', value: plan.regions.map((r) => REGION_LABELS[r]).join(' · ') },
            { label: 'Pricing Style', value: plan.pricingModel === 'trip_cost' ? '% of trip cost' : plan.pricingModel === 'annual_flat' ? 'Flat annual premium' : 'Per travel day' },
            { label: '24×7 Assistance', value: provider.support247 ? 'Yes — global assistance line' : 'Business hours' },
          ].map((f) => (
            <div key={f.label} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-1">
              <p className="text-[10px] text-neutral-500 font-bold uppercase">{f.label}</p>
              <p className="text-sm font-bold text-white leading-snug">{f.value}</p>
            </div>
          ))}
        </section>

        {plan.eligibility.note && (
          <p className="text-[11px] text-amber-200/90 bg-amber-950/20 border border-amber-800/40 rounded-xl px-4 py-3">{plan.eligibility.note}.</p>
        )}

        {/* Highlights */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden /> Why travellers pick it
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plan.highlights.map((h) => (
              <li key={h} className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3">
                {h}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {plan.bestFor.map((b) => (
              <span key={b} className="text-[10px] text-neutral-400 border border-neutral-800 rounded-full px-2.5 py-1">
                {b}
              </span>
            ))}
          </div>
        </section>

        {/* Full benefit table */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-5">
            <FileText className="w-4 h-4 text-emerald-400" aria-hidden /> Full benefit schedule
          </h2>
          <div className="divide-y divide-neutral-850">
            {COVERAGE_ORDER.filter((key) => plan.coverage[key]).map((key) => {
              const c = plan.coverage[key]!;
              return (
                <div key={key} className="py-3 grid grid-cols-1 sm:grid-cols-[200px_120px_1fr] gap-1 sm:gap-4 items-baseline">
                  <p className="text-xs font-bold text-white">
                    {COVERAGE_INFO[key].label}
                    {c.addOn && <span className="text-amber-400"> (add-on)</span>}
                  </p>
                  <p className="text-xs font-black text-emerald-300">{c.label}</p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{c.note ?? COVERAGE_INFO[key].explain}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Lead capture */}
        <InsuranceHelpCTA
          title={`Insurance Enquiry: ${plan.name}`}
          subtitle={`${provider.name} • ${plan.medicalSumInsuredLabel} medical`}
          details={{ planId: plan.id, planName: plan.name, provider: provider.name }}
          heading={`Get ${plan.name} for your exact trip`}
          body="Tell us the trip and travellers — we confirm the live premium and eligibility with the insurer, handle the purchase, and stay on your file for claims help."
        />

        {/* Exclusions + claims */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" aria-hidden /> Key exclusions
            </h2>
            <ul className="space-y-2">
              {plan.exclusions.map((e) => (
                <li key={e} className="text-[11px] text-neutral-400 leading-relaxed flex gap-2">
                  <span className="text-neutral-600 shrink-0">—</span> {e}
                </li>
              ))}
            </ul>
          </section>
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" aria-hidden /> How claims work
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">{plan.claimProcess}</p>
            <p className="text-[11px] text-neutral-500 leading-relaxed">{provider.claims.note}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              {provider.claims.url && (
                <a
                  href={provider.claims.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 hover:text-emerald-200"
                >
                  {provider.name} claims portal <ExternalLink className="w-3 h-3" aria-hidden />
                </a>
              )}
              {provider.claims.phone && <span className="text-[11px] text-neutral-400 font-mono">{provider.claims.phone}</span>}
            </div>
          </section>
        </div>

        {/* FAQs */}
        <section aria-label="Frequently asked questions" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {faqs.map((faq) => (
              <div key={faq.question} className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section aria-label="Related plans" className="space-y-4 print:hidden">
          {siblings.length > 0 && (
            <>
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">More from {provider.name}</h2>
              <div className="flex flex-wrap gap-2">
                {siblings.map((p) => (
                  <Link
                    key={p.id}
                    href={`/insurance/plan/${p.slug}`}
                    className="text-[11px] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </>
          )}
          <div className="flex flex-wrap gap-2">
            {relatedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/insurance/type/${c.slug}`}
                className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 border border-emerald-800/50 rounded-full px-3.5 py-1.5 transition-colors"
              >
                {c.title} →
              </Link>
            ))}
          </div>
        </section>

        <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800/60 pt-6">{INSURANCE_DISCLAIMER}</p>
      </div>
    </div>
  );
}
