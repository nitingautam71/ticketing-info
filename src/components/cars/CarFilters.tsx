'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import type { CarFacets } from '@/lib/providers/cars';

interface CarFiltersProps {
  facets: CarFacets;
}

const TOGGLES: { key: string; label: string; hint: string }[] = [
  { key: 'airportPickup', label: 'Airport Pickup', hint: 'Counter or garage at the airport' },
  { key: 'unlimitedMileage', label: 'Unlimited Mileage', hint: 'No per-km charges' },
  { key: 'freeCancellation', label: 'Free Cancellation', hint: 'Cancel free up to 48h before' },
  { key: 'oneWay', label: 'One-Way Available', hint: 'Different drop-off location' },
  { key: 'ev', label: 'Electric Only', hint: 'Battery-electric vehicles' },
  { key: 'hybrid', label: 'Hybrid Only', hint: 'Hybrid & plug-in hybrid' },
  { key: 'luxury', label: 'Luxury & Premium', hint: 'Executive and luxury classes' },
  { key: 'petFriendly', label: 'Pet Friendly', hint: 'Pets allowed in carrier' },
];

export default function CarFilters({ facets }: CarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getList = (key: string) => searchParams.get(key)?.split(',').filter(Boolean) ?? [];
  const selectedCompanies = getList('company');
  const selectedCountries = getList('country');
  const selectedCategories = getList('category');
  const selectedBrands = getList('brand');
  const transmission = searchParams.get('transmission');

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  // Adjust the locally-editable price inputs when the URL params change from outside
  // this component (Reset All, browser back/forward) — done during render, per React's
  // guidance, instead of useEffect+setState which would cause an extra render pass.
  const [syncedParams, setSyncedParams] = useState(searchParams.toString());
  if (searchParams.toString() !== syncedParams) {
    setSyncedParams(searchParams.toString());
    setMinPrice(searchParams.get('minPrice') ?? '');
    setMaxPrice(searchParams.get('maxPrice') ?? '');
  }

  function pushParams(next: URLSearchParams) {
    next.delete('page');
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggleListParam(key: string, value: string) {
    const current = getList(key);
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    const next = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) next.set(key, updated.join(',')); else next.delete(key);
    pushParams(next);
  }

  function toggleBoolParam(key: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (next.get(key) === 'true') next.delete(key); else next.set(key, 'true');
    pushParams(next);
  }

  function setTransmission(value: 'Automatic' | 'Manual' | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null) next.delete('transmission'); else next.set('transmission', value);
    pushParams(next);
  }

  function commitPrice() {
    const next = new URLSearchParams(searchParams.toString());
    if (minPrice) next.set('minPrice', minPrice); else next.delete('minPrice');
    if (maxPrice) next.set('maxPrice', maxPrice); else next.delete('maxPrice');
    pushParams(next);
  }

  function resetAll() {
    router.push(pathname, { scroll: false });
  }

  const checkboxList = (title: string, key: string, options: string[], selected: string[], maxH = 'max-h-40') => (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
      <div className={`${maxH} overflow-y-auto space-y-2 pr-2 scrollbar-thin`}>
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggleListParam(key, opt)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-750 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-slate-600 dark:text-slate-350">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          Filter Cars
        </h3>
        <button onClick={resetAll} className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Transmission */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Transmission</h4>
        <div className="flex gap-2">
          {(['Automatic', 'Manual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTransmission(transmission === t ? null : t)}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                transmission === t
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Price / Day (USD)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number" min={0} placeholder="Min" value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)} onBlur={commitPrice}
            onKeyDown={(e) => e.key === 'Enter' && commitPrice()}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-slate-400 text-xs">to</span>
          <input
            type="number" min={0} placeholder="Max" value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)} onBlur={commitPrice}
            onKeyDown={(e) => e.key === 'Enter' && commitPrice()}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Boolean toggles */}
      <div className="space-y-2.5">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Options</h4>
        {TOGGLES.map(({ key, label, hint }) => (
          <label key={key} className="flex items-center justify-between gap-2 cursor-pointer select-none" title={hint}>
            <span className="text-sm text-slate-600 dark:text-slate-350">{label}</span>
            <input
              type="checkbox"
              checked={searchParams.get(key) === 'true'}
              onChange={() => toggleBoolParam(key)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-750 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </label>
        ))}
      </div>

      {checkboxList('Vehicle Category', 'category', facets.categories, selectedCategories, 'max-h-48')}
      {checkboxList('Rental Company', 'company', facets.companies, selectedCompanies, 'max-h-48')}
      {checkboxList('Country', 'country', facets.countries, selectedCountries)}
      {checkboxList('Brand', 'brand', facets.brands, selectedBrands, 'max-h-48')}
    </div>
  );
}
