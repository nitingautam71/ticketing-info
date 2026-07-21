'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Search } from 'lucide-react';
import CountrySelect from '@/components/visas/CountrySelect';
import { countryByCode } from '@/lib/visas/countries';
import { trackEvent } from '@/lib/analytics';

/**
 * The insurance quote search. Navigates to the canonical, server-rendered
 * /insurance/quotes URL so every comparison is shareable and re-runnable.
 */
export default function InsuranceQuoteForm({
  initialResidence = '',
  initialDestination = '',
  compact = false,
}: {
  initialResidence?: string;
  initialDestination?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const today = new Date();
  const defaultStart = new Date(today.getTime() + 14 * 86_400_000).toISOString().slice(0, 10);
  const defaultEnd = new Date(today.getTime() + 24 * 86_400_000).toISOString().slice(0, 10);

  const [residence, setResidence] = useState(initialResidence);
  const [destination, setDestination] = useState(initialDestination);
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [ages, setAges] = useState<string[]>(['32']);
  const [tripCost, setTripCost] = useState('');
  const [annual, setAnnual] = useState(false);
  const [error, setError] = useState('');
  const [navigating, setNavigating] = useState(false);

  const setAge = (i: number, v: string) => setAges((a) => a.map((x, j) => (j === i ? v : x)));
  const addTraveller = () => setAges((a) => (a.length < 9 ? [...a, '32'] : a));
  const removeTraveller = () => setAges((a) => (a.length > 1 ? a.slice(0, -1) : a));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const from = countryByCode(residence);
    const to = countryByCode(destination);
    if (!from || !to) {
      setError('Pick both your country of residence and your destination.');
      return;
    }
    const parsedAges = ages.map((a) => Number(a));
    if (parsedAges.some((a) => !Number.isFinite(a) || a < 0 || a > 110)) {
      setError('Traveller ages must be between 0 and 110.');
      return;
    }
    if (end < start) {
      setError('Return date must be on or after the departure date.');
      return;
    }
    setError('');
    setNavigating(true);
    trackEvent('insurance_quote_search', { residence: from.code, destination: to.code, travellers: parsedAges.length, annual });
    const params = new URLSearchParams({
      residence: from.code,
      destination: to.code,
      start,
      end,
      ages: parsedAges.join(','),
    });
    if (tripCost && Number(tripCost) > 0) params.set('tripCost', String(Number(tripCost)));
    if (annual) params.set('annual', 'true');
    router.push(`/insurance/quotes?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className={compact ? 'space-y-3' : 'bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4'}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CountrySelect label="Country of Residence" value={residence} onChange={setResidence} placeholder="e.g. India" />
        <CountrySelect label="Destination" value={destination} onChange={setDestination} placeholder="e.g. United States" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="ins-start" className="block text-xs font-semibold text-neutral-400 mb-1">Departure</label>
          <input
            id="ins-start"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 [color-scheme:dark]"
          />
        </div>
        <div>
          <label htmlFor="ins-end" className="block text-xs font-semibold text-neutral-400 mb-1">Return</label>
          <input
            id="ins-end"
            type="date"
            value={end}
            min={start}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 [color-scheme:dark]"
          />
        </div>
        <div>
          <label htmlFor="ins-cost" className="block text-xs font-semibold text-neutral-400 mb-1">Trip Cost (USD, optional)</label>
          <input
            id="ins-cost"
            type="number"
            min={0}
            max={500000}
            placeholder="e.g. 3000"
            value={tripCost}
            onChange={(e) => setTripCost(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <span className="block text-xs font-semibold text-neutral-400 mb-1">Travellers</span>
          <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5">
            <button type="button" onClick={removeTraveller} aria-label="Remove traveller" className="text-neutral-400 hover:text-white cursor-pointer disabled:opacity-40" disabled={ages.length <= 1}>
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm text-white font-bold flex-1 text-center">{ages.length}</span>
            <button type="button" onClick={addTraveller} aria-label="Add traveller" className="text-neutral-400 hover:text-white cursor-pointer disabled:opacity-40" disabled={ages.length >= 9}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {ages.map((age, i) => (
          <div key={i}>
            <label htmlFor={`ins-age-${i}`} className="block text-[10px] font-semibold text-neutral-500 mb-1">
              Traveller {i + 1} age
            </label>
            <input
              id={`ins-age-${i}`}
              type="number"
              min={0}
              max={110}
              value={age}
              onChange={(e) => setAge(i, e.target.value)}
              className="w-20 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        ))}
        <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer pb-2.5 ml-auto">
          <input
            type="checkbox"
            checked={annual}
            onChange={(e) => setAnnual(e.target.checked)}
            className="accent-emerald-500 w-4 h-4"
          />
          Annual multi-trip cover
        </label>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={navigating}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Search className="w-4 h-4" /> {navigating ? 'Comparing…' : 'Compare Plans'}
        </button>
      </div>
    </form>
  );
}
