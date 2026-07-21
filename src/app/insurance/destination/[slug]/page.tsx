import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertCircle, HeartPulse, MapPin, ShieldCheck, Stamp } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import InsuranceHelpCTA from '@/components/insurance/InsuranceHelpCTA';
import InsuranceQuoteForm from '@/components/insurance/InsuranceQuoteForm';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import { countryBySlug, flagEmoji } from '@/lib/visas/countries';
import { destinationRegion, mandatoryInsuranceNote, regionCovered, REGION_LABELS, REGION_MEDICAL_CONTEXT } from '@/lib/insurance/regions';
import { insuranceCatalogProvider } from '@/lib/providers/insurance';
import { providerById } from '@/lib/insurance/providers';
import { destinationFaqs, destinationMetaDescription, destinationMetaTitle } from '@/lib/insurance/seo';
import { POPULAR_INSURANCE_DESTINATIONS } from '@/lib/insurance/popular';
import { INSURANCE_DISCLAIMER, type InsurancePlan } from '@/lib/insurance/types';
import { countryByCode } from '@/lib/visas/countries';

/** Destination insurance guides for all 199 countries. On-demand ISR: pages
 * materialise when visited and cache for a day — pure catalog data, no DB. */
export const revalidate = 86400;
export const dynamicParams = true;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const destination = countryBySlug((await params).slug);
  if (!destination) return {};
  const title = destinationMetaTitle(destination);
  const description = destinationMetaDescription(destination);
  return {
    title,
    description,
    alternates: { canonical: `/insurance/destination/${destination.slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

function topPlans(plans: InsurancePlan[], max = 4): InsurancePlan[] {
  return [...plans].sort((a, b) => b.medicalSumInsuredUsd - a.medicalSumInsuredUsd).slice(0, max);
}

export default async function InsuranceDestinationPage({ params }: { params: Promise<Params> }) {
  const destination = countryBySlug((await params).slug);
  if (!destination) notFound();

  const mandatory = mandatoryInsuranceNote(destination.code);
  const usRegion = destinationRegion('US', destination.code);
  const inRegion = destinationRegion('IN', destination.code);
  const ctx = REGION_MEDICAL_CONTEXT[usRegion];
  const faqs = destinationFaqs(destination);

  const catalog = insuranceCatalogProvider.plans();
  const usPlans = topPlans(catalog.filter((p) => p.market === 'US' && regionCovered(p.regions, usRegion)));
  const inPlans = topPlans(catalog.filter((p) => p.market === 'IN' && regionCovered(p.regions, inRegion)));
  const visitorPlans = topPlans(
    catalog.filter(
      (p) =>
        p.market === 'GLOBAL' &&
        (destination.code === 'US'
          ? p.categories.includes('visitors_usa')
          : destination.code === 'IN'
            ? p.categories.includes('visitors_india')
            : regionCovered(p.regions, usRegion)),
    ),
    3,
  );

  const related = POPULAR_INSURANCE_DESTINATIONS.filter((c) => c !== destination.code).slice(0, 10);

  const planGroups: { title: string; plans: InsurancePlan[] }[] = [
    { title: 'For US residents', plans: usPlans },
    { title: 'For Indian residents', plans: inPlans },
    { title: 'Visitor / travel-medical plans (most nationalities)', plans: visitorPlans },
  ].filter((g) => g.plans.length > 0);

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Travel Insurance', path: '/insurance' },
          { name: `${destination.name} travel insurance`, path: `/insurance/destination/${destination.slug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />

      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/insurance" className="hover:text-neutral-200">Insurance</Link> / {destination.name}
          </nav>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3">
                <span aria-hidden>{flagEmoji(destination.code)}</span> Destination guide
              </p>
              <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">
                {destination.name} travel insurance
              </h1>
              <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
                {mandatory
                  ? `Insurance is a requirement for ${destination.name} travel — here's exactly what the rule says, and the plans that satisfy it.`
                  : `Insurance isn't required to enter ${destination.name} — but here's what treatment and evacuation cost there, and the plans that fit.`}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 mt-2 ${
                mandatory ? 'bg-amber-950/60 text-amber-300 border-amber-900' : 'bg-emerald-950/60 text-emerald-400 border-emerald-900'
              }`}
            >
              {mandatory ? <AlertCircle className="w-4 h-4" aria-hidden /> : <ShieldCheck className="w-4 h-4" aria-hidden />}
              {mandatory ? 'Insurance required' : 'Recommended'}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10 space-y-8">
        {mandatory && (
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5 text-xs text-amber-200/90 leading-relaxed flex gap-3">
            <Stamp className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" aria-hidden />
            <p>
              <span className="font-bold text-amber-300">The rule: </span>
              {mandatory}
            </p>
          </div>
        )}

        {/* Key facts */}
        <section aria-label="Key facts" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Recommended Medical Cover', value: `$${ctx.recommendedMedicalUsd.toLocaleString('en-US')}+` },
            { label: 'Rating Region', value: REGION_LABELS[usRegion] },
            { label: 'Insurance Mandatory?', value: mandatory ? 'Yes — see the rule above' : 'No, but strongly advised' },
            { label: 'COVID-19', value: 'Covered as any illness on listed plans' },
          ].map((f) => (
            <div key={f.label} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-1">
              <p className="text-[10px] text-neutral-500 font-bold uppercase">{f.label}</p>
              <p className="text-sm font-bold text-white leading-snug">{f.value}</p>
            </div>
          ))}
        </section>

        {/* Cost context */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-400" aria-hidden /> What treatment costs around {destination.name}
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed">{ctx.context}</p>
        </section>

        {/* Quote form */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
            Compare live estimates for your {destination.name} trip
          </h2>
          <InsuranceQuoteForm compact initialDestination={destination.code} />
        </section>

        {/* Plan groups */}
        {planGroups.map((group) => (
          <section key={group.title} aria-label={group.title} className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.plans.map((p) => {
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
        ))}

        <InsuranceHelpCTA
          title={`Insurance Enquiry: ${destination.name}`}
          subtitle={mandatory ? 'Destination with mandatory insurance rules' : 'Destination guide'}
          details={{ destination: destination.name, mandatory: Boolean(mandatory) }}
        />

        {/* Visa cross-link + related */}
        <section aria-label="Related" className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          {[
            {
              href: `/visas/destination/${destination.slug}`,
              title: `${destination.name} visa policy`,
              sub: 'Entry rules for every passport — and whether your visa needs an insurance certificate.',
            },
            { href: '/flights', title: `Flights to ${destination.name}`, sub: 'Compare fares with a real consultant closing the booking.' },
            { href: '/packages', title: 'Holiday packages', sub: 'Flights, hotels and insurance bundled by our travel desk.' },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-2xl p-5 transition-colors group">
              <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{c.title}</p>
              <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">{c.sub}</p>
            </Link>
          ))}
        </section>

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

        {/* Related destinations */}
        <section aria-label="Other destinations" className="space-y-4 print:hidden">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4" aria-hidden /> Other destination guides
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((code) => {
              const c = countryByCode(code);
              if (!c) return null;
              return (
                <Link
                  key={code}
                  href={`/insurance/destination/${c.slug}`}
                  className="text-[11px] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  <span aria-hidden>{flagEmoji(c.code)}</span> {c.name}
                </Link>
              );
            })}
          </div>
        </section>

        <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800/60 pt-6">{INSURANCE_DISCLAIMER}</p>
      </div>
    </div>
  );
}
