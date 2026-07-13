'use client';

import { useState } from 'react';
import type { CruiseReview } from '@/lib/cruises/types';

const PAGE_SIZE = 3;

export default function CruiseReviews({ reviews }: { reviews: CruiseReview[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h4 className="font-bold text-slate-900 dark:text-slate-50">Guest Reviews</h4>
        <p className="text-xs text-slate-500">Realistic feedback from verified cruise bookings.</p>
      </div>

      <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
        {visible.map((r, idx) => (
          <div key={r.id} className={`space-y-2 ${idx > 0 ? 'pt-4' : ''}`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{r.author}</span>
              <span className="text-xs text-amber-500 font-bold">★ {r.ratings.overall}</span>
            </div>
            <p className="text-xs text-slate-400">&ldquo;{r.body}&rdquo;</p>
            <span className="text-[10px] text-slate-450 block font-semibold uppercase">
              {r.travelerType} Voyage • {r.date}
            </span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          className="w-full py-2 text-xs font-bold text-blue-600 hover:text-blue-700 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          Show more reviews ({reviews.length - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}
