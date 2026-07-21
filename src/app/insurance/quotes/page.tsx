import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ChevronLeft } from 'lucide-react';
import InsuranceQuoteForm from '@/components/insurance/InsuranceQuoteForm';
import QuoteResults from '@/components/insurance/QuoteResults';
import { logInsuranceQuote, quotePlans } from '@/lib/insurance/engine';
import { REGION_LABELS } from '@/lib/insurance/regions';
import type { PlanCategory } from '@/lib/insurance/types';
import { countryByCode, flagEmoji, resolveCountry } from '@/lib/visas/countries';

/**
 * Canonical, shareable quote-results URL. Rendered per-request (searchParams
 * make it dynamic); the underlying engine is deterministic and DB-light (one
 * cached overrides read). Parameterised result pages stay out of the index —
 * the evergreen hub/type/destination pages are the SEO surface.
 */

export const metadata: Metadata = {
  title: 'Compare Travel Insurance Quotes',
  robots: { index: false, follow: true },
  alternates: { canonical: '/insurance' },
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CATEGORY_VALUES = new Set([
  'single_trip', 'annual_multi_trip', 'domestic_india', 'schengen', 'student', 'senior', 'family',
  'business', 'cruise', 'adventure', 'backpacker', 'digital_nomad', 'visitors_usa', 'visitors_india',
  'medical_travel', 'pilgrimage', 'group',
]);

type Search = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined): string {
  return typeof v === 'string' ? v : '';
}

async function runQuotes(sp: Search) {
  const residence = resolveCountry(str(sp.residence));
  const destination = resolveCountry(str(sp.destination));
  const start = str(sp.start);
  const end = str(sp.end);
  const ages = str(sp.ages)
    .split(',')
    .map((a) => Number(a.trim()))
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 110)
    .slice(0, 9);
  if (!residence || !destination || !DATE_RE.test(start) || !DATE_RE.test(end) || end < start || ages.length === 0) return null;

  const tripCostRaw = Number(str(sp.tripCost));
  const categories = str(sp.categories)
    .split(',')
    .map((c) => c.trim())
    .filter((c) => CATEGORY_VALUES.has(c)) as PlanCategory[];

  const result = await quotePlans({
    residence: residence.code,
    destination: destination.code,
    startDate: start,
    endDate: end,
    travellers: ages.map((age) => ({ age })),
    tripCostUsd: Number.isFinite(tripCostRaw) && tripCostRaw > 0 ? Math.min(tripCostRaw, 500_000) : undefined,
    categories,
    annual: str(sp.annual) === 'true',
  });

  logInsuranceQuote({
    residence: residence.code,
    destination: destination.code,
    durationDays: result.input.durationDays,
    travellers: ages.length,
    oldestAge: Math.max(...ages),
    categories,
    topPlanId: result.quotes[0]?.plan.id,
    source: 'widget',
  });

  return result;
}

export default async function InsuranceQuotesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const result = await runQuotes(sp);

  if (!result) {
    return (
      <div className="flex-1 flex flex-col pb-20">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 space-y-6">
          <h1 className="font-display text-3xl md:text-4xl text-white font-medium">Compare travel insurance</h1>
          <p className="text-sm text-neutral-400">Tell us about the trip and we’ll rank every eligible plan.</p>
          <InsuranceQuoteForm />
        </div>
      </div>
    );
  }

  const from = countryByCode(result.input.residence);
  const to = countryByCode(result.input.destination);

  return (
    <div className="flex-1 flex flex-col pb-20">
      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-8">
          <Link href="/insurance" className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white font-bold mb-4">
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden /> New search
          </Link>
          <h1 className="font-display text-2xl md:text-4xl text-white font-medium leading-tight">
            {from && (
              <>
                <span aria-hidden>{flagEmoji(from.code)}</span> {from.name}
              </>
            )}{' '}
            → {to && (
              <>
                <span aria-hidden>{flagEmoji(to.code)}</span> {to.name}
              </>
            )}{' '}
            travel insurance
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-3">
            {result.input.startDate} → {result.input.endDate} · {result.input.durationDays} days · {result.input.travellers.length} traveller
            {result.input.travellers.length > 1 ? 's' : ''} · rated as {REGION_LABELS[result.input.region]}
          </p>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-8 space-y-8">
        <Suspense fallback={null}>
          <QuoteResults result={result} />
        </Suspense>
      </div>
    </div>
  );
}
