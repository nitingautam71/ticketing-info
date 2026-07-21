'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, ChevronRight, Scale, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { PlanQuote, QuoteResultSet } from '@/lib/insurance/types';
import { COVERAGE_INFO, COVERAGE_ORDER } from '@/lib/insurance/coverage';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';
import { trackConversion, trackEvent } from '@/lib/analytics';

type SortKey = 'recommended' | 'price' | 'medical';

/** Interactive comparison over server-computed quotes: sort, side-by-side
 * compare (up to 3 plans), and lead capture per plan. */
export default function QuoteResults({ result }: { result: QuoteResultSet }) {
  const { open } = useBookingEnquiry();
  const [sort, setSort] = useState<SortKey>('recommended');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showExcluded, setShowExcluded] = useState(false);

  const quotes = useMemo(() => {
    const list = [...result.quotes];
    if (sort === 'price') list.sort((a, b) => a.premiumUsd - b.premiumUsd);
    else if (sort === 'medical') list.sort((a, b) => b.plan.medicalSumInsuredUsd - a.plan.medicalSumInsuredUsd);
    return list;
  }, [result.quotes, sort]);

  const compared = quotes.filter((q) => compareIds.includes(q.plan.id));

  const toggleCompare = (id: string) => {
    setCompareIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : ids.length < 3 ? [...ids, id] : ids));
  };

  const enquire = (q: PlanQuote) => {
    trackEvent('insurance_plan_enquire', { plan: q.plan.id, provider: q.provider.name, premiumUsd: q.premiumUsd });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD, { vertical: 'insurance' });
    open({
      vertical: 'insurance',
      title: q.plan.name,
      subtitle: `${q.provider.name} • ${q.plan.medicalSumInsuredLabel} medical • ${q.durationDays} days`,
      price: q.premiumUsd,
      date: result.input.startDate,
      details: {
        planId: q.plan.id,
        planName: q.plan.name,
        provider: q.provider.name,
        estimatedPremium: q.premiumLabel,
        residence: result.input.residence,
        destination: result.input.destination,
        startDate: result.input.startDate,
        endDate: result.input.endDate,
        travellers: result.input.travellers.map((t) => t.age),
      },
    });
  };

  if (result.quotes.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-3">
        <p className="text-sm font-bold text-white">No plans match this exact trip.</p>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          This usually means an age above standard eligibility or an unusually long trip. Our consultants place these cases with specialist insurers — tell us the trip and we’ll quote it manually.
        </p>
        <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-emerald-200">
          Ask our insurance desk <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        {result.excluded.length > 0 && (
          <div className="text-left max-w-md mx-auto pt-3 border-t border-neutral-800">
            {result.excluded.slice(0, 6).map((e) => (
              <p key={e.planId} className="text-[11px] text-neutral-500 py-0.5">
                {e.planName}: {e.reason}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">
          <span className="text-white font-bold">{result.quotes.length} plans</span> match · estimates for {result.input.durationDays} days ·{' '}
          {result.input.travellers.length} traveller{result.input.travellers.length > 1 ? 's' : ''}
        </p>
        <div className="flex gap-1.5" role="group" aria-label="Sort plans">
          {(
            [
              ['recommended', 'Recommended'],
              ['price', 'Lowest price'],
              ['medical', 'Highest medical'],
            ] as [SortKey, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              aria-pressed={sort === key}
              className={`text-[11px] font-bold rounded-full px-3.5 py-1.5 border transition-colors cursor-pointer ${
                sort === key ? 'bg-emerald-600/15 border-emerald-700 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Compare table */}
      {compared.length >= 2 && (
        <section aria-label="Plan comparison" className="bg-neutral-900 border border-emerald-800/40 rounded-2xl p-4 md:p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" aria-hidden /> Side-by-side comparison
            </h2>
            <button onClick={() => setCompareIds([])} className="text-[11px] text-neutral-400 hover:text-white cursor-pointer flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <table className="w-full text-left min-w-[560px]">
            <thead>
              <tr>
                <th scope="col" className="text-[10px] text-neutral-500 font-bold uppercase py-2 pr-3 w-40">Benefit</th>
                {compared.map((q) => (
                  <th key={q.plan.id} scope="col" className="text-xs text-white font-bold py-2 pr-3 align-top">
                    {q.plan.name}
                    <span className="block text-[10px] text-neutral-500 font-medium">{q.provider.name}</span>
                    <span className="block text-emerald-300 font-black mt-1">{q.premiumLabel}*</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COVERAGE_ORDER.filter((key) => compared.some((q) => q.plan.coverage[key])).map((key) => (
                <tr key={key} className="border-t border-neutral-850">
                  <th scope="row" className="text-[11px] text-neutral-400 font-semibold py-2.5 pr-3">{COVERAGE_INFO[key].label}</th>
                  {compared.map((q) => {
                    const c = q.plan.coverage[key];
                    return (
                      <td key={q.plan.id} className="text-[11px] py-2.5 pr-3 text-neutral-200">
                        {c ? (
                          <span>
                            {c.label}
                            {c.addOn && <span className="text-amber-400 font-bold"> (add-on)</span>}
                          </span>
                        ) : (
                          <span className="text-neutral-600">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-neutral-850">
                <th scope="row" className="text-[11px] text-neutral-400 font-semibold py-2.5 pr-3">Deductible</th>
                {compared.map((q) => (
                  <td key={q.plan.id} className="text-[11px] py-2.5 pr-3 text-neutral-200">{q.plan.deductibleLabel}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="text-[10px] text-neutral-500 mt-3">* Indicative estimates — final premiums are set by the insurer.</p>
        </section>
      )}

      {/* Quote cards */}
      <div className="space-y-4">
        {quotes.map((q, idx) => (
          <article key={q.plan.id} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/50 rounded-2xl p-5 md:p-6 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start gap-5">
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex items-start gap-3 flex-wrap">
                  <div>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{q.provider.name}</p>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      <Link href={`/insurance/plan/${q.plan.slug}`} className="hover:text-emerald-300 transition-colors">
                        {q.plan.name}
                      </Link>
                    </h3>
                  </div>
                  {sort === 'recommended' && idx === 0 && (
                    <span className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-900 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" aria-hidden /> Best match
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ['Medical cover', q.plan.medicalSumInsuredLabel],
                    ['Evacuation', q.plan.coverage.medical_evacuation?.label ?? '—'],
                    ['Cancellation', q.plan.coverage.trip_cancellation?.label ?? '—'],
                    ['Baggage', q.plan.coverage.baggage_loss?.label ?? '—'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase">{label}</p>
                      <p className="text-xs font-bold text-white mt-0.5 leading-snug">{value}</p>
                    </div>
                  ))}
                </div>

                {q.fitReasons.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {q.fitReasons.map((r) => (
                      <li key={r} className="text-[10px] text-emerald-200/90 bg-emerald-950/30 border border-emerald-900/40 rounded-full px-2.5 py-1 flex items-center gap-1">
                        <Check className="w-3 h-3 shrink-0" aria-hidden /> {r}
                      </li>
                    ))}
                  </ul>
                )}

                {q.adminNotes && (
                  <p className="text-[11px] text-amber-200/90 bg-amber-950/20 border border-amber-800/40 rounded-xl px-3 py-2">
                    <span className="font-bold text-amber-300">Note from our desk: </span>
                    {q.adminNotes}
                  </p>
                )}
              </div>

              <div className="md:w-48 shrink-0 md:border-l md:border-neutral-850 md:pl-5 flex md:flex-col items-center md:items-end justify-between gap-3">
                <div className="md:text-right">
                  <p className="text-[10px] text-neutral-500 font-semibold">Estimated premium*</p>
                  <p className="text-2xl font-black text-white leading-tight">{q.premiumLabel}</p>
                  {result.input.travellers.length > 1 && <p className="text-[10px] text-neutral-500">{q.perTravellerLabel}</p>}
                </div>
                <div className="flex md:flex-col gap-2 w-auto md:w-full">
                  <button
                    onClick={() => enquire(q)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    Get this plan <ChevronRight className="w-4 h-4" aria-hidden />
                  </button>
                  <button
                    onClick={() => toggleCompare(q.plan.id)}
                    aria-pressed={compareIds.includes(q.plan.id)}
                    className={`text-[11px] font-bold px-4 py-2 rounded-xl border transition-colors cursor-pointer ${
                      compareIds.includes(q.plan.id)
                        ? 'bg-emerald-600/15 border-emerald-700 text-emerald-300'
                        : 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {compareIds.includes(q.plan.id) ? 'In comparison' : 'Compare'}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Excluded plans */}
      {result.excluded.length > 0 && (
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl">
          <button
            onClick={() => setShowExcluded((s) => !s)}
            aria-expanded={showExcluded}
            className="w-full flex items-center justify-between px-5 py-3.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
          >
            <span className="font-bold">Why aren’t the other {result.excluded.length} plans shown?</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showExcluded ? 'rotate-180' : ''}`} aria-hidden />
          </button>
          {showExcluded && (
            <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {result.excluded.map((e) => (
                <p key={e.planId} className="text-[11px] text-neutral-500">
                  <span className="text-neutral-300 font-semibold">{e.planName}</span> — {e.reason}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-[11px] text-neutral-500 leading-relaxed flex gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0 text-neutral-600" aria-hidden />
        {result.disclaimer}
      </p>
    </div>
  );
}
