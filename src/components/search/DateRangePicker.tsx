'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangePickerProps {
  label?: string;
  checkIn: string;
  checkOut: string;
  onChangeCheckIn: (date: string) => void;
  onChangeCheckOut: (date: string) => void;
  /** Minimum nights between check-in and check-out (default 1). */
  minNights?: number;
  /** Maximum nights a guest can select in one stay (default 30). */
  maxNights?: number;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseISODate(s: string | undefined): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(s: string | undefined): string {
  const d = parseISODate(s);
  if (!d) return '';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function buildMonthCells(year: number, month: number): (Date | null)[] {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();
  return [...Array(leadingBlanks).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))];
}

export default function DateRangePicker({ label, checkIn, checkOut, onChangeCheckIn, onChangeCheckOut, minNights = 1, maxNights = 30 }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = parseISODate(checkIn);
  const end = parseISODate(checkOut);
  const initial = start || today;
  const [baseMonth, setBaseMonth] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nights = start && end ? Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) : 0;

  const isDateDisabled = (d: Date): boolean => {
    if (d < today) return true;
    if (start && !end) {
      const minEnd = addDays(start, minNights);
      const maxEnd = addDays(start, maxNights);
      if (d < minEnd || d > maxEnd) return true;
    }
    return false;
  };

  const handleDayClick = (d: Date) => {
    if (isDateDisabled(d)) return;
    if (!start || (start && end)) {
      onChangeCheckIn(toISODate(d));
      onChangeCheckOut('');
      return;
    }
    onChangeCheckOut(toISODate(d));
    setIsOpen(false);
  };

  const moveMonths = (delta: number) => setBaseMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  const focusDay = (containerEl: HTMLElement, offset: number, currentIso: string) => {
    const buttons = Array.from(containerEl.querySelectorAll<HTMLButtonElement>('button[data-date]'));
    const idx = buttons.findIndex((b) => b.dataset.date === currentIso);
    const target = buttons[idx + offset];
    target?.focus();
  };

  const handleDayKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, d: Date) => {
    const iso = toISODate(d);
    const grid = e.currentTarget.closest('[data-month-grid]') as HTMLElement | null;
    if (!grid) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusDay(grid, 1, iso);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusDay(grid, -1, iso);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusDay(grid, 7, iso);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusDay(grid, -7, iso);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const renderMonth = (offset: number) => {
    const year = baseMonth.getFullYear();
    const month = baseMonth.getMonth() + offset;
    const view = new Date(year, month, 1);
    const cells = buildMonthCells(view.getFullYear(), view.getMonth());
    const monthLabel = view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <div className="w-full" data-month-grid>
        <div className="flex items-center justify-between mb-3">
          {offset === 0 ? (
            <button type="button" onClick={() => moveMonths(-1)} aria-label="Previous month" className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <span className="w-7" />
          )}
          <span className="text-sm font-bold text-white">{monthLabel}</span>
          {offset === 1 ? (
            <button type="button" onClick={() => moveMonths(1)} aria-label="Next month" className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="w-7" />
          )}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-[10px] text-neutral-500 font-bold text-center py-1">
              {w[0]}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const iso = toISODate(d);
            const disabled = isDateDisabled(d);
            const isStart = Boolean(start && iso === toISODate(start));
            const isEnd = Boolean(end && iso === toISODate(end));
            const previewEnd = !end && start && hoverDate && hoverDate > start ? hoverDate : null;
            const rangeEnd = end || previewEnd;
            const inRange = Boolean(start && rangeEnd && d > start && d < rangeEnd);
            const weekend = isWeekend(d);

            return (
              <button
                key={i}
                type="button"
                data-date={iso}
                disabled={disabled}
                aria-label={`${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}${isStart ? ', check-in selected' : ''}${isEnd ? ', check-out selected' : ''}`}
                aria-pressed={isStart || isEnd}
                onClick={() => handleDayClick(d)}
                onMouseEnter={() => setHoverDate(d)}
                onKeyDown={(e) => handleDayKeyDown(e, d)}
                className={`text-xs h-8 rounded-lg font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  isStart || isEnd
                    ? 'bg-emerald-600 text-white'
                    : inRange
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : disabled
                        ? ''
                        : weekend
                          ? 'text-amber-300/80 hover:bg-neutral-800'
                          : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-semibold text-neutral-400 mb-1">{label || 'Check-in — Check-out'}</label>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="relative w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
      >
        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <span className={checkIn ? 'text-white' : 'text-neutral-500'}>
          {checkIn ? formatDisplay(checkIn) : 'Check-in'} &rarr; {checkOut ? formatDisplay(checkOut) : 'Check-out'}
        </span>
        {nights > 0 && <span className="ml-2 text-[11px] text-emerald-400 font-bold">{nights} night{nights > 1 ? 's' : ''}</span>}
      </button>

      {isOpen && (
        <div role="dialog" aria-label="Choose check-in and check-out dates" className="absolute z-30 mt-1.5 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-4 w-[min(92vw,560px)]">
          <p className="text-[11px] text-neutral-500 mb-3">{!start ? 'Select a check-in date' : !end ? `Select a check-out date (minimum ${minNights} night${minNights > 1 ? 's' : ''})` : 'Click a date to start a new selection'}</p>
          <div className="flex flex-col sm:flex-row gap-6" onMouseLeave={() => setHoverDate(null)}>
            {renderMonth(0)}
            <div className="hidden sm:block">{renderMonth(1)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
