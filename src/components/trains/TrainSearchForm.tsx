'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftRight, Search } from 'lucide-react';
import StationSelect from './StationSelect';
import { stationByCode } from '@/lib/trains/data/stations';
import { trackEvent } from '@/lib/analytics';

/**
 * Corridor search. Navigates to the canonical, server-rendered
 * /trains/route/{from}/{to} page (city-slug based) so every result is
 * shareable, cacheable and indexed — same pattern as the visa checker.
 */
export default function TrainSearchForm({
  initialFrom = '',
  initialTo = '',
  compact = false,
}: {
  initialFrom?: string;
  initialTo?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [error, setError] = useState('');
  const [navigating, setNavigating] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = stationByCode(from);
    const destination = stationByCode(to);
    if (!origin || !destination) {
      setError('Pick both an origin and a destination station.');
      return;
    }
    if (origin.citySlug === destination.citySlug) {
      setError('Origin and destination must be different cities.');
      return;
    }
    setError('');
    setNavigating(true);
    trackEvent('train_search', { from: origin.code, to: destination.code });
    router.push(`/trains/route/${origin.citySlug}/${destination.citySlug}`);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <form onSubmit={submit} className={compact ? 'space-y-3' : 'bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4'}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        <StationSelect label="From" value={from} onChange={setFrom} placeholder="e.g. New York or NDLS" />
        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          className="hidden md:flex mb-1.5 p-2.5 bg-neutral-950 border border-neutral-800 hover:border-emerald-800/60 text-neutral-400 hover:text-white rounded-xl cursor-pointer transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" aria-hidden />
        </button>
        <StationSelect label="To" value={to} onChange={setTo} placeholder="e.g. Washington DC or Agra" />
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
      <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
        <p className="text-[10px] text-neutral-600">Covers Amtrak, Brightline, Alaska Railroad and Indian Railways premium trains.</p>
        <button
          type="submit"
          disabled={navigating}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Search className="w-4 h-4" aria-hidden /> {navigating ? 'Searching…' : 'Find Trains'}
        </button>
      </div>
    </form>
  );
}
