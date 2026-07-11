'use client';

import { Filter, RotateCcw } from 'lucide-react';
import { DEPARTURE_BUCKET_LABELS, type DepartureBucket } from '@/lib/flightDisplay';

interface Bounds {
  min: number;
  max: number;
}

interface FlightFiltersProps {
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
  priceBounds: Bounds;

  selectedStops: Set<number>;
  onToggleStop: (stop: number) => void;

  airlines: string[];
  selectedAirlines: Set<string>;
  onToggleAirline: (airline: string) => void;

  selectedBuckets: Set<DepartureBucket>;
  onToggleBucket: (bucket: DepartureBucket) => void;

  maxDurationMinutes: number;
  onMaxDurationChange: (v: number) => void;
  durationBounds: Bounds;

  onReset: () => void;
}

const STOP_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Nonstop' },
  { value: 1, label: '1 stop' },
  { value: 2, label: '2+ stops' },
];

function formatDuration(minutes: number): string {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export default function FlightFilters({
  maxPrice,
  onMaxPriceChange,
  priceBounds,
  selectedStops,
  onToggleStop,
  airlines,
  selectedAirlines,
  onToggleAirline,
  selectedBuckets,
  onToggleBucket,
  maxDurationMinutes,
  onMaxDurationChange,
  durationBounds,
  onReset,
}: FlightFiltersProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl h-fit space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h4>
        </div>
        <button type="button" onClick={onReset} className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-white cursor-pointer transition-colors">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-neutral-400">Max Ticket Price</span>
          <span className="text-white">${maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={10}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(parseInt(e.target.value, 10))}
          className="w-full accent-emerald-500"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-neutral-400">Max Duration</span>
          <span className="text-white">{formatDuration(maxDurationMinutes)}</span>
        </div>
        <input
          type="range"
          min={durationBounds.min}
          max={durationBounds.max}
          step={15}
          value={maxDurationMinutes}
          onChange={(e) => onMaxDurationChange(parseInt(e.target.value, 10))}
          className="w-full accent-emerald-500"
        />
      </div>

      <div className="space-y-2">
        <h5 className="text-xs font-bold text-neutral-400 uppercase">Stops</h5>
        <div className="space-y-2 text-xs">
          {STOP_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
              <input type="checkbox" checked={selectedStops.has(opt.value)} onChange={() => onToggleStop(opt.value)} className="accent-emerald-500" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h5 className="text-xs font-bold text-neutral-400 uppercase">Departure Time</h5>
        <div className="space-y-2 text-xs">
          {(Object.keys(DEPARTURE_BUCKET_LABELS) as DepartureBucket[]).map((bucket) => (
            <label key={bucket} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
              <input type="checkbox" checked={selectedBuckets.has(bucket)} onChange={() => onToggleBucket(bucket)} className="accent-emerald-500" />
              <span>{DEPARTURE_BUCKET_LABELS[bucket]}</span>
            </label>
          ))}
        </div>
      </div>

      {airlines.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-neutral-400 uppercase">Airlines</h5>
          <div className="space-y-2 text-xs">
            {airlines.map((al) => (
              <label key={al} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
                <input type="checkbox" checked={selectedAirlines.has(al)} onChange={() => onToggleAirline(al)} className="accent-emerald-500" />
                <span>{al}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
