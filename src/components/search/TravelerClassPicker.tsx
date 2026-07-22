'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, ChevronDown, Minus, Plus, Check } from 'lucide-react';
import type { CabinClass } from '@/lib/providers/flights';

const CABIN_CLASSES: CabinClass[] = ['Economy', 'Premium Economy', 'Business', 'First'];

export interface TravelerCounts {
  adults: number;
  children: number;
  infants: number;
}

/** Airlines cap a single booking at ~9 passengers; keep the party within that. */
export const MAX_PARTY = 9;

export function totalTravelers(c: TravelerCounts): number {
  return c.adults + c.children + c.infants;
}

interface TravelerClassPickerProps {
  counts: TravelerCounts;
  onCountsChange: (counts: TravelerCounts) => void;
  cabinClass: CabinClass;
  onCabinClassChange: (cabinClass: CabinClass) => void;
}

interface StepperRow {
  key: keyof TravelerCounts;
  label: string;
  hint: string;
}

const ROWS: StepperRow[] = [
  { key: 'adults', label: 'Adults', hint: 'Age 12+' },
  { key: 'children', label: 'Children', hint: 'Age 2–11' },
  { key: 'infants', label: 'Infants', hint: 'Under 2, on lap' },
];

export default function TravelerClassPicker({ counts, onCountsChange, cabinClass, onCabinClassChange }: TravelerClassPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const total = totalTravelers(counts);

  // Per-row bounds: at least 1 adult, infants can't outnumber lap-holding adults,
  // and the whole party can't exceed the booking cap.
  const minFor = (key: keyof TravelerCounts) => (key === 'adults' ? 1 : 0);
  const maxFor = (key: keyof TravelerCounts) => {
    if (key === 'infants') return Math.min(counts.adults, MAX_PARTY - (counts.adults + counts.children));
    return counts[key] + (MAX_PARTY - total);
  };

  const setCount = (key: keyof TravelerCounts, value: number) => {
    const next: TravelerCounts = { ...counts, [key]: value };
    // Reducing adults may strand lap infants — clamp them down too.
    if (key === 'adults' && next.infants > value) next.infants = value;
    onCountsChange(next);
  };

  const summary = `${total} Traveler${total > 1 ? 's' : ''} • ${cabinClass}`;

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-semibold text-neutral-400 mb-1" id="travelers-label">
        Travelers &amp; Class
      </label>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-labelledby="travelers-label"
        className="relative w-full flex items-center justify-between gap-2 bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-3 py-3 text-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
      >
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <span className="truncate" title={summary}>
          {summary}
        </span>
        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div role="dialog" aria-label="Select travelers and cabin class" className="absolute z-30 mt-1.5 w-72 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-4 space-y-3">
          {ROWS.map((row) => {
            const value = counts[row.key];
            const min = minFor(row.key);
            const max = maxFor(row.key);
            return (
              <div key={row.key} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white block leading-tight">{row.label}</span>
                  <span className="text-[11px] text-neutral-500">{row.hint}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCount(row.key, Math.max(min, value - 1))}
                    disabled={value <= min}
                    aria-label={`Remove one ${row.label.toLowerCase()}`}
                    className="w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 hover:border-emerald-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-4 text-center text-sm font-bold text-white" aria-live="polite">
                    {value}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCount(row.key, Math.min(max, value + 1))}
                    disabled={value >= max}
                    aria-label={`Add one ${row.label.toLowerCase()}`}
                    className="w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 hover:border-emerald-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          <p className="text-[10px] text-neutral-500 leading-relaxed border-t border-neutral-800 pt-2">
            Senior, student, or military fares? Note it in your enquiry — a consultant applies eligible discounts.
          </p>

          <div className="border-t border-neutral-800 pt-3 space-y-1">
            <span className="text-sm font-semibold text-white block mb-1.5">Cabin class</span>
            {CABIN_CLASSES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCabinClassChange(c)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 cursor-pointer transition-colors"
              >
                {c}
                {cabinClass === c && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer transition-all"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
