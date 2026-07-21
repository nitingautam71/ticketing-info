import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import {
  AlertCircle,
  ArrowLeftRight,
  CheckCircle,
  ExternalLink,
  Globe2,
  HeartPulse,
  Plane,
  ShieldCheck,
  Stamp,
} from 'lucide-react';
import { checkVisa } from '@/lib/visas/engine';
import { countryByCode, countryBySlug, flagEmoji } from '@/lib/visas/countries';
import { pairFaqs, pairMetaDescription, pairMetaTitle, passportPhrase } from '@/lib/visas/seo';
import { POPULAR_DESTINATIONS } from '@/lib/visas/popular';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/seo/JsonLd';
import DocumentChecklist from '@/components/visas/DocumentChecklist';
import VisaHelpCTA from '@/components/visas/VisaHelpCTA';
import PurposeAddendum from '@/components/visas/PurposeAddendum';
import type { VisaCategory } from '@/lib/visas/types';

// On-demand ISR: pages render at request time (DB reachable, unlike at build)
// and are then cached for a day. ~39k possible pairs stay cheap because only
// visited ones are materialised.
export const revalidate = 86400;
export const dynamicParams = true;

type Params = { from: string; to: string };

async function loadResult(params: Params) {
  const passport = countryBySlug(params.from);
  const destination = countryBySlug(params.to);
  if (!passport || !destination || passport.code === destination.code) return null;
  return checkVisa({ passportCode: passport.code, destinationCode: destination.code });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const result = await loadResult(await params);
  if (!result) return {};
  const title = pairMetaTitle(result);
  const description = pairMetaDescription(result);
  const canonical = `/visas/${result.passport.slug}/${result.destination.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const BADGE_STYLES: Record<VisaCategory, string> = {
  visa_free: 'bg-emerald-950/60 text-emerald-400 border-emerald-900',
  home_country: 'bg-emerald-950/60 text-emerald-400 border-emerald-900',
  visa_on_arrival: 'bg-teal-950/60 text-teal-300 border-teal-900',
  eta: 'bg-sky-950/60 text-sky-300 border-sky-900',
  e_visa: 'bg-amber-950/60 text-amber-300 border-amber-900',
  visa_required: 'bg-red-950/60 text-red-400 border-red-900',
  no_admission: 'bg-red-950/80 text-red-300 border-red-800',
};

export default async function VisaPairPage({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  const result = await loadResult(resolved);
  if (!result) notFound();

  const { passport, destination } = result;
  const faqs = pairFaqs(result);
  const positive = result.category === 'visa_free' || result.category === 'visa_on_arrival' || result.category === 'home_country';
  const relatedDestinations = POPULAR_DESTINATIONS.filter((c) => c !== destination.code && c !== passport.code).slice(0, 8);

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Visa Checker', path: '/visas' },
          { name: `${passport.name} passport`, path: `/visas/passport/${passport.slug}` },
          { name: destination.name, path: `/visas/${passport.slug}/${destination.slug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />

      {/* Header */}
      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/visas" className="hover:text-neutral-200">Visa Checker</Link> /{' '}
            <Link href={`/visas/passport/${passport.slug}`} className="hover:text-neutral-200">{passport.name} passport</Link> / {destination.name}
          </nav>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
                <span aria-hidden>{flagEmoji(passport.code)}</span> {passport.name} → {destination.name} <span aria-hidden>{flagEmoji(destination.code)}</span>
              </p>
              <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">
                {destination.name} visa requirements for {passportPhrase(passport.name)}
              </h1>
              <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">{result.headline}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 mt-2 ${BADGE_STYLES[result.category]}`}
            >
              {positive ? <CheckCircle className="w-4 h-4" aria-hidden /> : <AlertCircle className="w-4 h-4" aria-hidden />}
              {result.categoryLabel}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-[11px]">
            <Link
              href={`/visas/${destination.slug}/${passport.slug}`}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden /> Reverse: {destination.name} passport → {passport.name}
            </Link>
            <Link
              href="/visas"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
            >
              <Globe2 className="w-3.5 h-3.5" aria-hidden /> Check another route
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10 space-y-8">
        {/* Fact grid */}
        <section aria-label="Key facts" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Maximum Stay', value: result.allowedStayDays ? `${result.allowedStayDays} days` : 'Per visa issued' },
            { label: 'Processing Time', value: result.processingTime },
            { label: 'Visa Fee', value: result.fee.label },
            { label: 'Apply', value: result.applyOnline ? 'Online' : result.applyBefore ? 'Embassy / visa centre' : 'Not required in advance' },
            { label: 'Passport Validity', value: result.passportValidity },
            { label: 'Blank Pages', value: result.blankPages },
            { label: 'Entries', value: result.entryType === 'multiple' ? 'Multiple (re-entry OK)' : 'Per visa conditions' },
            { label: 'Rule Source', value: result.source === 'admin-override' ? `Verified by our team${result.updatedAt ? ` · ${result.updatedAt.slice(0, 10)}` : ''}` : 'Global visa dataset + curation' },
          ].map((f) => (
            <div key={f.label} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-1">
              <p className="text-[10px] text-neutral-500 font-bold uppercase">{f.label}</p>
              <p className="text-sm font-bold text-white leading-snug">{f.value}</p>
            </div>
          ))}
        </section>

        {result.adminNotes && (
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5 text-xs text-amber-200/90 leading-relaxed">
            <span className="font-bold text-amber-300">Note from our visa desk: </span>
            {result.adminNotes}
          </div>
        )}

        <Suspense fallback={null}>
          <PurposeAddendum category={result.category} baseDocuments={result.documents} />
        </Suspense>

        {/* Checklist */}
        {result.documents.length > 0 && (
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
            <DocumentChecklist
              documents={result.documents}
              shareTitle={`${destination.name} visa requirements for ${passportPhrase(passport.name)}`}
            />
          </section>
        )}

        {/* Lead capture */}
        <VisaHelpCTA
          destinationName={destination.name}
          passportName={passport.name}
          categoryLabel={result.categoryLabel}
          processingTime={result.processingTime}
          feeUsd={result.fee.amountUsd}
          documents={result.documents}
        />

        {/* Transit + health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plane className="w-4 h-4 text-emerald-400" aria-hidden /> Transiting {destination.name}?
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">{result.transitNote}</p>
          </section>
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" aria-hidden /> Health & Entry
            </h2>
            {result.health.yellowFever && <p className="text-xs text-neutral-300 leading-relaxed">{result.health.yellowFever}</p>}
            <p className="text-xs text-neutral-400 leading-relaxed">{result.health.routineAdvice}</p>
            <p className="text-xs text-neutral-400 leading-relaxed">{result.health.insurance}</p>
          </section>
        </div>

        {/* Official source */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden /> Official Source
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
              {result.officialLink
                ? 'Always apply through the destination government’s official portal — never through look-alike sites charging inflated fees.'
                : 'Apply via the nearest embassy or consulate of the destination. We can point you to the right mission — just ask.'}
            </p>
          </div>
          {result.officialLink && (
            <a
              href={result.officialLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-emerald-200 border border-emerald-800/50 hover:border-emerald-700 rounded-xl px-4 py-3 transition-colors"
            >
              {result.officialLink.label} <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            </a>
          )}
        </section>

        {/* Cross-sell */}
        <section aria-label="Complete your trip" className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          {[
            { href: '/insurance', title: 'Travel Insurance', sub: 'Often mandatory for visa approval — get a compliant policy.' },
            { href: '/flights', title: `Flights to ${destination.name}`, sub: 'Refundable reservations that work as visa proof of travel.' },
            { href: '/hotels', title: 'Hotel Bookings', sub: 'Confirmations accepted by embassies, free-cancellation options.' },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-2xl p-5 transition-colors group">
              <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{c.title}</p>
              <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">{c.sub}</p>
            </Link>
          ))}
        </section>

        {/* FAQs */}
        <section aria-label="Frequently asked questions" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Stamp className="w-4 h-4 text-emerald-400" aria-hidden /> Frequently Asked Questions
          </h2>
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
        <section aria-label="Related visa checks" className="space-y-4 print:hidden">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">More for the {passport.name} passport</h2>
          <div className="flex flex-wrap gap-2">
            {relatedDestinations.map((code) => (
              <RelatedLink key={code} passportSlug={passport.slug} destCode={code} />
            ))}
            <Link
              href={`/visas/passport/${passport.slug}`}
              className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 border border-emerald-800/50 rounded-full px-3.5 py-1.5 transition-colors"
            >
              All destinations for {passport.name} passports →
            </Link>
          </div>
        </section>

        <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800/60 pt-6">{result.disclaimer}</p>
      </div>
    </div>
  );
}

function RelatedLink({ passportSlug, destCode }: { passportSlug: string; destCode: string }) {
  const dest = countryByCode(destCode);
  if (!dest) return null;
  return (
    <Link
      href={`/visas/${passportSlug}/${dest.slug}`}
      className="text-[11px] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
    >
      {flagEmoji(dest.code)} {dest.name}
    </Link>
  );
}
