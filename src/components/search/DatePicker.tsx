'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  /** Range mode picks a start then an end date (e.g. depart/return) in one calendar. */
  range?: boolean;
  label?: string;
  startValue: string;
  endValue?: string;
  onChangeStart: (date: string) => void;
  onChangeEnd?: (date: string) => void;
  /** Dates before this (yyyy-mm-dd) are disabled — e.g. the previous leg's date for multi-city. */
  minDate?: string;
  compact?: boolean;
  containerClassName?: string;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DatePicker({ range, label, startValue, endValue, onChangeStart, onChangeEnd, minDate, compact, containerClassName }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const floor = parseISODate(minDate) || today;
  const initialMonth = parseISODate(startValue) || floor;
  const [visibleMonth, setVisibleMonth] = useState(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const start = parseISODate(startValue);
  const end = parseISODate(endValue);

  const handleDayClick = (d: Date) => {
    const iso = toISODate(d);
    if (!range) {
      onChangeStart(iso);
      setIsOpen(false);
      return;
    }
    if (!start || (start && end)) {
      onChangeStart(iso);
      onChangeEnd?.('');
      return;
    }
    if (d < start) {
      onChangeStart(iso);
      onChangeEnd?.('');
      return;
    }
    onChangeEnd?.(iso);
    setIsOpen(false);
  };

  const monthLabel = visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();
  const cells: (Date | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), i + 1)),
  ];

  const triggerClassName = compact
    ? 'w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer'
    : 'relative w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer';

  return (
    <div className={`relative ${containerClassName || ''}`} ref={containerRef}>
      {!compact && <label className="block text-xs font-semibold text-neutral-400 mb-1">{label || (range ? 'Dates' : 'Date')}</label>}
      <button type="button" onClick={() => setIsOpen((v) => !v)} className={triggerClassName}>
        {!compact && <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />}
        {range ? (
          <span className={startValue ? 'text-white' : 'text-neutral-500'}>
            {startValue ? formatDisplay(startValue) : 'Depart'} &ndash; {endValue ? formatDisplay(endValue) : 'Return'}
          </span>
        ) : (
          <span className={startValue ? 'text-white' : 'text-neutral-500'}>{startValue ? formatDisplay(startValue) : 'Select date'}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1.5 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-white">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((w, i) => (
              <div key={i} className="text-[10px] text-neutral-500 font-bold text-center py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const iso = toISODate(d);
              const isDisabled = d < floor;
              const isStart = Boolean(start && iso === toISODate(start));
              const isEnd = Boolean(end && iso === toISODate(end));
              const inRange = Boolean(range && start && end && d > start && d < end);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDayClick(d)}
                  className={`text-xs h-8 rounded-lg font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:text-neutral-700 ${
                    isStart || isEnd ? 'bg-emerald-600 text-white' : inRange ? 'bg-emerald-500/15 text-emerald-300' : isDisabled ? '' : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
