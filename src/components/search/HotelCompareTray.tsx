'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Scale, ChevronUp, ChevronDown } from 'lucide-react';
import type { Hotel } from '@/lib/providers/hotels';
import { formatDistance } from '@/lib/hotelDisplay';

interface HotelCompareTrayProps {
  hotels: Hotel[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const ROWS: { label: string; render: (h: Hotel) => React.ReactNode }[] = [
  { label: 'Price / night', render: (h) => `$${h.pricePerNight.toLocaleString()}` },
  { label: 'Total for stay', render: (h) => `$${h.totalPrice.toLocaleString()}` },
  { label: 'Star rating', render: (h) => (h.stars > 0 ? '★'.repeat(h.stars) : '—') },
  { label: 'Guest rating', render: (h) => (h.rating > 0 ? `${h.rating.toFixed(1)} ${h.reviewScoreWord || ''}` : '—') },
  { label: 'Reviews', render: (h) => h.reviewsCount.toLocaleString() },
  { label: 'Distance', render: (h) => (h.distanceFromCenterKm != null ? formatDistance(h.distanceFromCenterKm) : '—') },
  { label: 'Free cancellation', render: (h) => (h.freeCancellation ? 'Yes' : 'No') },
  { label: 'Top amenities', render: (h) => (h.amenities.length > 0 ? h.amenities.slice(0, 3).join(', ') : '—') },
];

export default function HotelCompareTray({ hotels, onRemove, onClear }: HotelCompareTrayProps) {
  const [expanded, setExpanded] = useState(false);

  if (hotels.length === 0) return null;

  return (
    <div className="sticky bottom-4 z-20 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-3.5">
        <div className="flex items-center gap-2 min-w-0">
          <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex -space-x-2">
            {hotels.map((h) => (
              <div key={h.id} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-neutral-900">
                <Image src={h.image} alt={h.name} fill sizes="32px" className="object-cover" />
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-white truncate">{hotels.length} hotel{hotels.length > 1 ? 's' : ''} to compare</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={onClear} className="text-[11px] font-bold text-neutral-400 hover:text-white cursor-pointer transition-colors">
            Clear
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            disabled={hotels.length < 2}
            aria-expanded={expanded}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer transition-colors"
          >
            Compare {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {expanded && hotels.length >= 2 && (
        <div className="border-t border-neutral-800 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-3 text-neutral-500 font-semibold sticky left-0 bg-neutral-900">&nbsp;</th>
                {hotels.map((h) => (
                  <th key={h.id} className="p-3 text-left min-w-[160px]">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white leading-snug">{h.name}</span>
                      <button type="button" onClick={() => onRemove(h.id)} aria-label={`Remove ${h.name} from comparison`} className="text-neutral-500 hover:text-white cursor-pointer shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-neutral-800/60">
                  <td className="p-3 text-neutral-500 font-semibold sticky left-0 bg-neutral-900 whitespace-nowrap">{row.label}</td>
                  {hotels.map((h) => (
                    <td key={h.id} className="p-3 text-neutral-200">
                      {row.render(h)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
