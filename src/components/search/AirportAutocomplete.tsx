'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Plane, Loader2, Clock } from 'lucide-react';

interface Airport {
  code: string;
  name: string;
  subtitle: string;
}

interface AirportAutocompleteProps {
  label?: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  /** Compact styling (no icon/label) for tight grid layouts like the multi-city legs. */
  compact?: boolean;
  containerClassName?: string;
  /** Rotate the plane icon 45deg (departure) vs. leave it flat (arrival). */
  rotateIcon?: boolean;
}

const RECENTS_KEY = 'ticketing-info:recent-airports';
const MAX_RECENTS = 5;

function loadRecents(): Airport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    return raw ? (JSON.parse(raw) as Airport[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(airport: Airport) {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadRecents().filter((a) => a.code !== airport.code);
    const next = [airport, ...existing].slice(0, MAX_RECENTS);
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, etc.) — recents are a nicety, not required
  }
}

export default function AirportAutocomplete({ label, value, onChange, placeholder, compact, containerClassName, rotateIcon = true }: AirportAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [options, setOptions] = useState<Airport[]>([]);
  const [recents, setRecents] = useState<Airport[]>(() => loadRecents());
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listboxId = useId();
  const inputId = useId();

  // Sync local text with an externally-driven value (e.g. the "swap airports" button) without an effect.
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showingRecents = query.trim().length < 2;
  const visibleList = showingRecents ? recents : options;

  const handleInput = (text: string) => {
    const upper = text.toUpperCase();
    setQuery(upper);
    onChange(upper);
    setIsOpen(true);
    setHighlightedIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length < 2) {
      setOptions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/airports?query=${encodeURIComponent(text.trim())}`);
        const data: Airport[] = res.ok ? await res.json() : [];
        setOptions(data);
      } catch {
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const selectAirport = (airport: Airport) => {
    setQuery(airport.code);
    onChange(airport.code);
    setOptions([]);
    setIsOpen(false);
    setHighlightedIndex(-1);
    saveRecent(airport);
    setRecents(loadRecents());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || visibleList.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % visibleList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => (i <= 0 ? visibleList.length - 1 : i - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      selectAirport(visibleList[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const inputClassName = compact
    ? 'w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm font-bold tracking-wider uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500'
    : 'w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm font-bold tracking-wider uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500';

  return (
    <div className={`relative ${containerClassName || ''}`} ref={containerRef}>
      {label && <label htmlFor={inputId} className="block text-xs font-semibold text-neutral-400 mb-1">{label}</label>}
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen && visibleList.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={highlightedIndex >= 0 ? `${listboxId}-opt-${highlightedIndex}` : undefined}
          aria-label={label || placeholder || 'Airport or city'}
          className={inputClassName}
        />
        {!compact && <Plane className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 ${rotateIcon ? 'rotate-45' : 'shrink-0'}`} />}
        {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 animate-spin" />}
      </div>

      {isOpen && visibleList.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label || 'Airport suggestions'}
          className="absolute z-20 mt-1.5 w-full min-w-[260px] bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
        >
          {showingRecents && (
            <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wide text-neutral-500">Recent searches</p>
          )}
          {visibleList.map((airport, i) => (
            <button
              key={airport.code}
              id={`${listboxId}-opt-${i}`}
              role="option"
              aria-selected={highlightedIndex === i}
              type="button"
              onClick={() => selectAirport(airport)}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                highlightedIndex === i ? 'bg-neutral-800' : 'hover:bg-neutral-800'
              }`}
            >
              <div className="min-w-0 flex items-center gap-2">
                {showingRecents && <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{airport.name}</p>
                  <p className="text-[11px] text-neutral-400 truncate">{airport.subtitle}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold text-emerald-400 font-mono">{airport.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
