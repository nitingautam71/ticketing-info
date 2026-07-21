import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Building2, ExternalLink, PhoneCall, ShieldCheck } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import InsuranceHelpCTA from '@/components/insurance/InsuranceHelpCTA';
import { breadcrumbJsonLd } from '@/lib/structuredData';
import { INSURANCE_PROVIDERS, providerBySlug } from '@/lib/insurance/providers';
import { plansForProvider } from '@/lib/insurance/engine';
import { INSURANCE_DISCLAIMER } from '@/lib/insurance/types';

/** Provider directory pages — factual profiles + the plans we compare. */
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return INSURANCE_PROVIDERS.map((p) => ({ slug: p.slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const provider = providerBySlug((await params).slug);
  if (!provider) return {};
  const year = new Date().getFullYear();
  const title = `${provider.name} Travel Insurance (${year}) — Plans, Claims & Contacts`;
  const description = `${provider.name} travel insurance reviewed: plan lineup, claim process and contacts, and how it compares for US and Indian travellers.`;
  return {
    title,
    description,
    alternates: { canonical: `/insurance/provider/${provider.slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function InsuranceProviderPage({ params }: { params: Promise<Params> }) {
  const provider = providerBySlug((await params).slug);
  if (!provider) notFound();

  const plans = plansForProvider(provider.id);
  const others = INSURANCE_PROVIDERS.filter((p) => p.id !== provider.id);

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Travel Insurance', path: '/insurance' },
          { name: provider.name, path: `/insurance/provider/${provider.slug}` },
        ])}
      />

      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/insurance" className="hover:text-neutral-200">Insurance</Link> / {provider.name}
          </nav>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">
            {provider.name} travel insurance
          </h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">{provider.about}</p>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10 space-y-8">
        {/* Fact grid */}
        <section aria-label="Provider facts" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Headquarters', value: provider.headquarters },
            { label: 'Founded', value: provider.founded ? String(provider.founded) : '—' },
            { label: 'Group', value: provider.group ?? provider.name },
            {
              label: 'Markets Served',
              value: provider.markets.map((m) => (m === 'US' ? 'United States' : m === 'IN' ? 'India' : 'Global visitors')).join(' · '),
            },
          ].map((f) => (
            <div key={f.label} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-1">
              <p className="text-[10px] text-neutral-500 font-bold uppercase">{f.label}</p>
              <p className="text-sm font-bold text-white leading-snug">{f.value}</p>
            </div>
          ))}
        </section>

        {/* Plans */}
        {plans.length > 0 && (
          <section aria-label="Plans we compare" className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden /> {provider.name} plans we compare
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((p) => (
                <Link
                  key={p.id}
                  href={`/insurance/plan/${p.slug}`}
                  className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-2xl p-5 transition-colors group"
                >
                  <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{p.name}</p>
                  <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">{p.tagline}</p>
                  <p className="text-[11px] font-bold text-emerald-300 mt-2.5">{p.medicalSumInsuredLabel} medical cover →</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Product families */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" aria-hidden /> Product families
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {provider.productFamilies.map((f) => (
              <span key={f} className="text-[11px] text-neutral-300 border border-neutral-800 rounded-full px-3 py-1">
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* Claims */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" aria-hidden /> Claims &amp; support
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">{provider.claims.note}</p>
            {provider.claims.phone && <p className="text-xs text-neutral-400 font-mono">{provider.claims.phone}</p>}
            <p className="text-[11px] text-neutral-500">{provider.support247 ? '24×7 emergency assistance line.' : 'Business-hours support.'}</p>
          </div>
          <div className="flex flex-col gap-2">
            {provider.claims.url && (
              <a
                href={provider.claims.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-emerald-200 border border-emerald-800/50 hover:border-emerald-700 rounded-xl px-4 py-3 transition-colors"
              >
                Official claims portal <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              </a>
            )}
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-xl px-4 py-3 transition-colors"
            >
              {provider.name} website <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            </a>
          </div>
        </section>

        <InsuranceHelpCTA
          title={`Insurance Enquiry: ${provider.name}`}
          subtitle={provider.headquarters}
          details={{ provider: provider.name }}
          heading={`Get a ${provider.name} plan matched to your trip`}
        />

        {/* Other providers */}
        <section aria-label="Other insurers" className="space-y-4 print:hidden">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Other insurers we compare</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((p) => (
              <Link
                key={p.id}
                href={`/insurance/provider/${p.slug}`}
                className="text-[11px] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </section>

        <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800/60 pt-6">{INSURANCE_DISCLAIMER}</p>
      </div>
    </div>
  );
}
