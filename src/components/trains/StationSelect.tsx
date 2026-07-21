'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { TRAIN_STATIONS, stationByCode } from '@/lib/trains/data/stations';

const SORTED = [...TRAIN_STATIONS].sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));

function countryFlag(country: 'US' | 'IN'): string {
  return country === 'US' ? '🇺🇸' : '🇮🇳';
}

/**
 * Accessible searchable station combobox (ARIA 1.2 combobox pattern): type a
 * city, station name or code to filter; arrow keys + Enter to pick.
 */
export default function StationSelect({
  label,
  value,
  onChange,
  placeholder = 'City, station or code…',
}: {
  label: string;
  value: string; // station code or ''
  onChange: (code: string) => void;
  placeholder?: string;
}) {
  const listId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = value ? stationByCode(value) : undefined;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SORTED;
    return SORTED.filter(
      (s) => s.city.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.code.toLowerCase() === q,
    );
  }, [query]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const pick = (code: string) => {
    onChange(code);
    setQuery('');
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = results[active];
      if (hit) pick(hit.code);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <label className="block text-xs font-semibold text-neutral-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={label}
          value={open ? query : selected ? `${countryFlag(selected.country)} ${selected.city} — ${selected.name}` : query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 pr-9 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden />
      </div>
      {open && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-label={label}
          className="absolute z-40 mt-1 w-full max-h-64 overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-1"
        >
          {results.length === 0 && <li className="px-4 py-2.5 text-xs text-neutral-500">No matching station</li>}
          {results.map((s, i) => (
            <li
              key={s.code}
              role="option"
              aria-selected={s.code === value}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(s.code);
              }}
              onMouseEnter={() => setActive(i)}
              className={`px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2.5 ${
                i === active ? 'bg-emerald-600/15 text-white' : 'text-neutral-300'
              }`}
            >
              <span aria-hidden>{countryFlag(s.country)}</span>
              <span className="truncate">
                {s.city} <span className="text-neutral-500">· {s.name}</span>
              </span>
              <span className="ml-auto text-[10px] text-neutral-500 font-mono shrink-0">{s.code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
