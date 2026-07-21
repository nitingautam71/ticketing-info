import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Globe2 } from 'lucide-react';
import { passportSummary } from '@/lib/visas/engine';
import { countryBySlug, flagEmoji } from '@/lib/visas/countries';
import { CATEGORY_LABELS } from '@/lib/visas/enrichment';
import { breadcrumbJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/seo/JsonLd';
import type { VisaCategory } from '@/lib/visas/types';

export const revalidate = 86400;
export const dynamicParams = true;

const GROUP_ORDER: VisaCategory[] = ['visa_free', 'visa_on_arrival', 'eta', 'e_visa', 'visa_required', 'no_admission'];

const GROUP_ACCENT: Record<string, string> = {
  visa_free: 'text-emerald-400',
  visa_on_arrival: 'text-teal-300',
  eta: 'text-sky-300',
  e_visa: 'text-amber-300',
  visa_required: 'text-red-400',
  no_admission: 'text-red-300',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const country = countryBySlug(slug);
  if (!country) return {};
  const summary = passportSummary(country.code);
  if (!summary) return {};
  const year = new Date().getFullYear();
  const title = `${country.name} Passport Visa-Free Countries (${year}) — Full List of ${summary.mobilityScore} Destinations`;
  const description = `${country.name} passport holders can visit ${summary.counts.visa_free} countries visa-free, ${summary.counts.visa_on_arrival} with visa on arrival, ${summary.counts.eta} with an ETA and ${summary.counts.e_visa} with an e-visa. See every destination with stay limits.`;
  return {
    title,
    description,
    alternates: { canonical: `/visas/passport/${country.slug}` },
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function PassportHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = countryBySlug(slug);
  if (!country) notFound();
  const summary = passportSummary(country.code);
  if (!summary) notFound();

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Visa Checker', path: '/visas' },
          { name: `${country.name} passport`, path: `/visas/passport/${country.slug}` },
        ])}
      />

      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-6xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/visas" className="hover:text-neutral-200">Visa Checker</Link> / {country.name} passport
          </nav>
          <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3">
            <span aria-hidden>{flagEmoji(country.code)}</span> Passport Power Report
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">
            Where can {country.name} passport holders travel?
          </h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            {summary.mobilityScore} destinations are reachable without an embassy visa — {summary.counts.visa_free} visa-free,{' '}
            {summary.counts.visa_on_arrival} visa on arrival, and {summary.counts.eta} with a quick online ETA. Every country below links to the
            full requirements, fees, and document checklist.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-8">
            {GROUP_ORDER.map((cat) => (
              <div key={cat} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
                <p className={`text-2xl font-black ${GROUP_ACCENT[cat]}`}>{summary.counts[cat]}</p>
                <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">{CATEGORY_LABELS[cat]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl w-full mx-auto px-4 md:px-8 mt-10 space-y-10">
        {GROUP_ORDER.map((cat) => {
          const list = summary.groups[cat];
          if (!list || list.length === 0) return null;
          return (
            <section key={cat} aria-label={CATEGORY_LABELS[cat]}>
              <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${GROUP_ACCENT[cat]}`}>
                {CATEGORY_LABELS[cat]} <span className="text-neutral-500 font-medium">({list.length})</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {list.map(({ country: dest, stayDays }) => (
                  <Link
                    key={dest.code}
                    href={`/visas/${country.slug}/${dest.slug}`}
                    className="text-[11px] text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                  >
                    <span aria-hidden>{flagEmoji(dest.code)}</span> {dest.name}
                    {stayDays ? <span className="text-neutral-500"> · {stayDays}d</span> : null}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <div className="border-t border-neutral-800/60 pt-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[11px] text-neutral-500 leading-relaxed max-w-2xl">
            Counts reflect standard short-stay tourism rules for ordinary passports. Diplomatic/official passports, dual citizens, and residence-permit
            holders often have different access.
          </p>
          <Link href="/visas" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-colors">
            <Globe2 className="w-4 h-4" aria-hidden /> Run a full visa check
          </Link>
        </div>
      </div>
    </div>
  );
}
