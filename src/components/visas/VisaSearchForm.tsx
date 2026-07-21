'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import CountrySelect from './CountrySelect';
import { countryByCode } from '@/lib/visas/countries';
import { TRAVEL_PURPOSES, type TravelPurpose } from '@/lib/visas/types';
import { trackEvent } from '@/lib/analytics';

/**
 * The smart visa search. Navigates to the canonical, server-rendered
 * /visas/{passport}/{destination} page so every result is shareable,
 * cacheable, and indexed.
 */
export default function VisaSearchForm({
  initialPassport = '',
  initialDestination = '',
  initialPurpose = 'tourism',
  compact = false,
}: {
  initialPassport?: string;
  initialDestination?: string;
  initialPurpose?: TravelPurpose;
  compact?: boolean;
}) {
  const router = useRouter();
  const [passport, setPassport] = useState(initialPassport);
  const [destination, setDestination] = useState(initialDestination);
  const [purpose, setPurpose] = useState<TravelPurpose>(initialPurpose);
  const [error, setError] = useState('');
  const [navigating, setNavigating] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const from = countryByCode(passport);
    const to = countryByCode(destination);
    if (!from || !to) {
      setError('Pick both your passport country and your destination.');
      return;
    }
    setError('');
    setNavigating(true);
    trackEvent('visa_check_search', { passport: from.code, destination: to.code, purpose });
    const qs = purpose !== 'tourism' ? `?purpose=${purpose}` : '';
    router.push(`/visas/${from.slug}/${to.slug}${qs}`);
  };

  return (
    <form onSubmit={submit} className={compact ? 'space-y-3' : 'bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4'}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CountrySelect label="Passport / Nationality" value={passport} onChange={setPassport} placeholder="e.g. India" />
        <CountrySelect label="Destination" value={destination} onChange={setDestination} placeholder="e.g. Japan" />
        <div>
          <label htmlFor="visa-purpose" className="block text-xs font-semibold text-neutral-400 mb-1">
            Purpose of Travel
          </label>
          <select
            id="visa-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as TravelPurpose)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none"
          >
            {TRAVEL_PURPOSES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
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
          <Search className="w-4 h-4" /> {navigating ? 'Checking…' : 'Check Requirements'}
        </button>
      </div>
    </form>
  );
}
