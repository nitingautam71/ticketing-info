'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, ChevronDown, Minus, Plus, Check } from 'lucide-react';
import type { CabinClass } from '@/lib/providers/flights';

const CABIN_CLASSES: CabinClass[] = ['Economy', 'Premium Economy', 'Business', 'First'];

interface TravelerClassPickerProps {
  travelers: number;
  onTravelersChange: (count: number) => void;
  cabinClass: CabinClass;
  onCabinClassChange: (cabinClass: CabinClass) => void;
}

export default function TravelerClassPicker({ travelers, onTravelersChange, cabinClass, onCabinClassChange }: TravelerClassPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-semibold text-neutral-400 mb-1">Travelers &amp; Class</label>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="relative w-full flex items-center justify-between gap-2 bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-3 py-3 text-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
      >
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <span className="truncate" title={`${travelers} Traveler${travelers > 1 ? 's' : ''} • ${cabinClass}`}>
          {travelers} Traveler{travelers > 1 ? 's' : ''} &bull; {cabinClass}
        </span>
        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1.5 w-72 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Travelers</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onTravelersChange(Math.max(1, travelers - 1))}
                disabled={travelers <= 1}
                className="w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 hover:border-emerald-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-4 text-center text-sm font-bold text-white">{travelers}</span>
              <button
                type="button"
                onClick={() => onTravelersChange(Math.min(9, travelers + 1))}
                disabled={travelers >= 9}
                className="w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 hover:border-emerald-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

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
