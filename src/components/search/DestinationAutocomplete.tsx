'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, Clock, TrendingUp, Building2, Landmark, Map } from 'lucide-react';
import type { HotelDestination } from '@/lib/providers/hotels';

interface DestinationAutocompleteProps {
  label?: string;
  value: string;
  onSelect: (destination: HotelDestination) => void;
  placeholder?: string;
}

const RECENTS_KEY = 'ticketing-info:recent-hotel-destinations';
const MAX_RECENTS = 5;

function loadRecents(): HotelDestination[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    return raw ? (JSON.parse(raw) as HotelDestination[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(destination: HotelDestination) {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadRecents().filter((d) => d.destId !== destination.destId);
    const next = [destination, ...existing].slice(0, MAX_RECENTS);
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, etc.) — recents are a nicety, not required
  }
}

function placeIcon(placeType: string) {
  const t = placeType.toLowerCase();
  if (t === 'landmark') return Landmark;
  if (t === 'region' || t === 'district') return Map;
  if (t === 'hotel') return Building2;
  return MapPin;
}

export default function DestinationAutocomplete({ label, value, onSelect, placeholder }: DestinationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [options, setOptions] = useState<HotelDestination[]>([]);
  const [recents, setRecents] = useState<HotelDestination[]>(() => loadRecents());
  const [trending, setTrending] = useState<HotelDestination[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local text with an externally-driven value without an effect.
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showingSuggestions = query.trim().length < 2;
  const visibleList = showingSuggestions ? [...recents, ...trending.filter((t) => !recents.some((r) => r.destId === t.destId))] : options;

  const handleInput = (text: string) => {
    setQuery(text);
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
        const res = await fetch(`/api/hotels/destinations?query=${encodeURIComponent(text.trim())}`);
        const data: HotelDestination[] = res.ok ? await res.json() : [];
        setOptions(data);
      } catch {
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const selectDestination = (destination: HotelDestination) => {
    setQuery(destination.label);
    onSelect(destination);
    setOptions([]);
    setIsOpen(false);
    setHighlightedIndex(-1);
    saveRecent(destination);
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
      selectDestination(visibleList[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label htmlFor="hotel-destination-input" className="block text-xs font-semibold text-neutral-400 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id="hotel-destination-input"
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="hotel-destination-listbox"
          aria-autocomplete="list"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            setIsOpen(true);
            if (trending.length === 0) {
              fetch('/api/hotels/trending')
                .then((res) => (res.ok ? res.json() : []))
                .then((data: HotelDestination[]) => setTrending(data))
                .catch(() => {});
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'City, hotel, region, or landmark'}
          autoComplete="off"
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 animate-spin" />}
      </div>

      {isOpen && visibleList.length > 0 && (
        <div id="hotel-destination-listbox" role="listbox" className="absolute z-20 mt-1.5 w-full min-w-[280px] bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
          {showingSuggestions && recents.length > 0 && (
            <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wide text-neutral-500">Recent searches</p>
          )}
          {showingSuggestions &&
            recents.map((d, i) => (
              <DestinationRow key={`recent-${d.destId}`} destination={d} icon={Clock} highlighted={highlightedIndex === i} onClick={() => selectDestination(d)} onHover={() => setHighlightedIndex(i)} />
            ))}
          {showingSuggestions && trending.filter((t) => !recents.some((r) => r.destId === t.destId)).length > 0 && (
            <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wide text-neutral-500">Trending destinations</p>
          )}
          {showingSuggestions &&
            trending
              .filter((t) => !recents.some((r) => r.destId === t.destId))
              .map((d, i) => {
                const idx = recents.length + i;
                return <DestinationRow key={`trend-${d.destId}`} destination={d} icon={TrendingUp} highlighted={highlightedIndex === idx} onClick={() => selectDestination(d)} onHover={() => setHighlightedIndex(idx)} />;
              })}
          {!showingSuggestions &&
            options.map((d, i) => (
              <DestinationRow key={d.destId} destination={d} icon={placeIcon(d.placeType)} highlighted={highlightedIndex === i} onClick={() => selectDestination(d)} onHover={() => setHighlightedIndex(i)} />
            ))}
        </div>
      )}
    </div>
  );
}

function DestinationRow({
  destination,
  icon: Icon,
  highlighted,
  onClick,
  onHover,
}: {
  destination: HotelDestination;
  icon: typeof MapPin;
  highlighted: boolean;
  onClick: () => void;
  onHover: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={highlighted}
      onClick={onClick}
      onMouseEnter={onHover}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${highlighted ? 'bg-neutral-800' : 'hover:bg-neutral-800'}`}
    >
      <Icon className="w-4 h-4 text-neutral-500 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate">{destination.name}</p>
        <p className="text-[11px] text-neutral-400 truncate">{destination.label}</p>
      </div>
      <span className="shrink-0 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">{destination.placeType}</span>
    </button>
  );
}

