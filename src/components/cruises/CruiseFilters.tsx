'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import type { CruiseFacets } from '@/lib/providers/cruises';

const DURATIONS = ['2-4 Nights', '5-8 Nights', '9-14 Nights', '15+ Nights'];

interface CruiseFiltersProps {
  facets: CruiseFacets;
}

export default function CruiseFilters({ facets }: CruiseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getList = (key: string) => searchParams.get(key)?.split(',').filter(Boolean) ?? [];
  const selectedDestinations = getList('destination');
  const selectedLines = getList('cruiseLine');
  const selectedPorts = getList('departurePort');
  const selectedDurations = getList('duration');
  const riverParam = searchParams.get('river');
  const riverCruise: boolean | null = riverParam === 'true' ? true : riverParam === 'false' ? false : null;
  const adultsOnly = searchParams.get('adultsOnly') === 'true';

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') ?? '');
    setMaxPrice(searchParams.get('maxPrice') ?? '');
  }, [searchParams]);

  function pushParams(next: URLSearchParams) {
    next.delete('page'); // any filter change resets pagination to page 1
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

  function setRiverCruise(value: boolean | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null) next.delete('river'); else next.set('river', String(value));
    pushParams(next);
  }

  function setAdultsOnly(value: boolean) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set('adultsOnly', 'true'); else next.delete('adultsOnly');
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

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          Filter Cruises
        </h3>
        <button
          onClick={resetAll}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Cruise Category Toggle */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Voyage Type</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setRiverCruise(riverCruise === false ? null : false)}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              riverCruise === false
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350'
            }`}
          >
            Ocean Cruises
          </button>
          <button
            onClick={() => setRiverCruise(riverCruise === true ? null : true)}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              riverCruise === true
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350'
            }`}
          >
            River Cruises
          </button>
        </div>
      </div>

      {/* Adults Only Toggle */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Adults Only (18+)</h4>
          <p className="text-xs text-slate-400">Filter out family cruises</p>
        </div>
        <button
          onClick={() => setAdultsOnly(!adultsOnly)}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
            adultsOnly ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-750'
          }`}
        >
          <span
            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
              adultsOnly ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Price Range (USD)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={commitPrice}
            onKeyDown={(e) => e.key === 'Enter' && commitPrice()}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-slate-400 text-xs">to</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={commitPrice}
            onKeyDown={(e) => e.key === 'Enter' && commitPrice()}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Destinations Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Cruise Regions</h4>
        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
          {facets.destinations.map((dest) => (
            <label key={dest} className="flex items-center gap-2.5 text-sm text-slate-655 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedDestinations.includes(dest)}
                onChange={() => toggleListParam('destination', dest)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-750 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-600 dark:text-slate-350">{dest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cruise Line Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Cruise Lines</h4>
        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
          {facets.cruiseLines.map((line) => (
            <label key={line} className="flex items-center gap-2.5 text-sm text-slate-655 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedLines.includes(line)}
                onChange={() => toggleListParam('cruiseLine', line)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-750 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-600 dark:text-slate-350">{line}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Voyage Duration</h4>
        <div className="space-y-2">
          {DURATIONS.map((dur) => (
            <label key={dur} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedDurations.includes(dur)}
                onChange={() => toggleListParam('duration', dur)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-750 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-600 dark:text-slate-350">{dur}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Port Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Departure Ports</h4>
        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
          {facets.departurePorts.map((port) => (
            <label key={port} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedPorts.includes(port)}
                onChange={() => toggleListParam('departurePort', port)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-750 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-600 dark:text-slate-350">{port}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
