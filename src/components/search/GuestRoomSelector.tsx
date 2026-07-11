'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, ChevronDown, Minus, Plus, AlertTriangle } from 'lucide-react';

interface GuestRoomSelectorProps {
  adults: number;
  childAges: number[];
  rooms: number;
  onChange: (patch: { adults?: number; childAges?: number[]; rooms?: number }) => void;
}

const MAX_ADULTS = 30;
const MAX_CHILDREN = 10;
const MAX_ROOMS = 8;
const MAX_GUESTS_PER_ROOM = 4;

function Counter({ label, hint, value, min, max, onDecrement, onIncrement }: { label: string; hint?: string; value: number; min: number; max: number; onDecrement: () => void; onIncrement: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-semibold text-white block">{label}</span>
        {hint && <span className="text-[11px] text-neutral-500">{hint}</span>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 hover:border-emerald-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-4 text-center text-sm font-bold text-white" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 hover:border-emerald-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function GuestRoomSelector({ adults, childAges, rooms, onChange }: GuestRoomSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalGuests = adults + childAges.length;
  const overOccupied = totalGuests > rooms * MAX_GUESTS_PER_ROOM;

  const summary = `${totalGuests} Guest${totalGuests !== 1 ? 's' : ''} • ${rooms} Room${rooms !== 1 ? 's' : ''}`;

  const addChild = () => onChange({ childAges: [...childAges, 8] });
  const removeChild = (idx: number) => onChange({ childAges: childAges.filter((_, i) => i !== idx) });
  const setChildAge = (idx: number, age: number) => onChange({ childAges: childAges.map((a, i) => (i === idx ? age : a)) });

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-semibold text-neutral-400 mb-1">Guests &amp; Rooms</label>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="relative w-full flex items-center justify-between gap-2 bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-3 py-3 text-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
      >
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <span className="truncate">{summary}</span>
        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div role="dialog" aria-label="Choose guests and rooms" className="absolute z-30 mt-1.5 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-4 space-y-4">
          <Counter label="Adults" value={adults} min={1} max={MAX_ADULTS} onDecrement={() => onChange({ adults: Math.max(1, adults - 1) })} onIncrement={() => onChange({ adults: Math.min(MAX_ADULTS, adults + 1) })} />

          <div className="border-t border-neutral-800 pt-3">
            <Counter
              label="Children"
              hint="Ages 0-17"
              value={childAges.length}
              min={0}
              max={MAX_CHILDREN}
              onDecrement={() => removeChild(childAges.length - 1)}
              onIncrement={addChild}
            />
            {childAges.length > 0 && (
              <div className="mt-3 space-y-2">
                {childAges.map((age, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <label htmlFor={`child-age-${idx}`} className="text-xs text-neutral-400">
                      Child {idx + 1} age
                    </label>
                    <select
                      id={`child-age-${idx}`}
                      value={age}
                      onChange={(e) => setChildAge(idx, parseInt(e.target.value, 10))}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {Array.from({ length: 18 }, (_, a) => (
                        <option key={a} value={a}>
                          {a === 0 ? '<1' : a}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-800 pt-3">
            <Counter label="Rooms" value={rooms} min={1} max={MAX_ROOMS} onDecrement={() => onChange({ rooms: Math.max(1, rooms - 1) })} onIncrement={() => onChange({ rooms: Math.min(MAX_ROOMS, rooms + 1) })} />
          </div>

          {overOccupied && (
            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-[11px] text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{totalGuests} guests across {rooms} room{rooms > 1 ? 's' : ''} may exceed typical room capacity ({MAX_GUESTS_PER_ROOM}/room). Consider adding another room.</span>
            </div>
          )}

          <button type="button" onClick={() => setIsOpen(false)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer transition-all">
            Done
          </button>
        </div>
      )}
    </div>
  );
}
