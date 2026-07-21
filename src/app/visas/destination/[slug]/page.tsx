import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { destinationSummary } from '@/lib/visas/engine';
import { countryBySlug, flagEmoji } from '@/lib/visas/countries';
import { CATEGORY_LABELS, OFFICIAL_LINKS, blankPagesRule, passportValidityRule, yellowFeverNote } from '@/lib/visas/enrichment';
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
  const summary = destinationSummary(country.code);
  if (!summary) return {};
  const year = new Date().getFullYear();
  const title = `${country.name} Visa Policy (${year}) — Who Enters Visa-Free, Who Needs a Visa`;
  const description = `${country.name} entry rules by nationality: ${summary.counts.visa_free} passports enter visa-free, ${summary.counts.visa_on_arrival} get visa on arrival, ${summary.counts.e_visa} use an e-visa. Check your passport, validity rules and health requirements.`;
  return {
    title,
    description,
    alternates: { canonical: `/visas/destination/${country.slug}` },
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function DestinationHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = countryBySlug(slug);
  if (!country) notFound();
  const summary = destinationSummary(country.code);
  if (!summary) notFound();
  const officialLink = OFFICIAL_LINKS[country.code];

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Visa Checker', path: '/visas' },
          { name: country.name, path: `/visas/destination/${country.slug}` },
        ])}
      />

      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-6xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/visas" className="hover:text-neutral-200">Visa Checker</Link> / {country.name}
          </nav>
          <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3">
            <span aria-hidden>{flagEmoji(country.code)}</span> Destination Visa Policy
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">
            Who needs a visa for {country.name}?
          </h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Find your passport below to see how you can enter {country.name} — then open the full breakdown with fees, documents, transit and health
            rules.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <p className="text-[10px] text-neutral-500 font-bold uppercase">Passport validity</p>
              <p className="text-xs font-bold text-white mt-1 leading-snug">{passportValidityRule(country.code)}</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <p className="text-[10px] text-neutral-500 font-bold uppercase">Blank pages</p>
              <p className="text-xs font-bold text-white mt-1 leading-snug">{blankPagesRule(country.code)}</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <p className="text-[10px] text-neutral-500 font-bold uppercase">Yellow fever</p>
              <p className="text-xs font-bold text-white mt-1 leading-snug">{yellowFeverNote(country.code)}</p>
            </div>
          </div>

          {officialLink && (
            <a
              href={officialLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-emerald-200 border border-emerald-800/50 hover:border-emerald-700 rounded-xl px-4 py-3 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden /> {officialLink.label} <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            </a>
          )}
        </div>
      </section>

      <div className="max-w-6xl w-full mx-auto px-4 md:px-8 mt-10 space-y-10">
        {GROUP_ORDER.map((cat) => {
          const list = summary.groups[cat];
          if (!list || list.length === 0) return null;
          return (
            <section key={cat} aria-label={CATEGORY_LABELS[cat]}>
              <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${GROUP_ACCENT[cat]}`}>
                {CATEGORY_LABELS[cat]} <span className="text-neutral-500 font-medium">({list.length} passports)</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {list.map(({ country: passport, stayDays }) => (
                  <Link
                    key={passport.code}
                    href={`/visas/${passport.slug}/${country.slug}`}
                    className="text-[11px] text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
                  >
                    <span aria-hidden>{flagEmoji(passport.code)}</span> {passport.name}
                    {stayDays ? <span className="text-neutral-500"> · {stayDays}d</span> : null}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800/60 pt-6">
          Standard short-stay tourism rules for ordinary passports. Special categories (diplomatic passports, residence-permit holders, crew) follow
          different rules — contact us for a personal assessment.
        </p>
      </div>
    </div>
  );
}
