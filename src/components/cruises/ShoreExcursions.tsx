import type { ShoreExcursion } from '@/lib/cruises/types';
import { Compass, Clock } from 'lucide-react';

export default function ShoreExcursions({ excursions }: { excursions: ShoreExcursion[] }) {
  if (!excursions || excursions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-1 flex items-center gap-2">
        <Compass className="w-5 h-5 text-blue-600" />
        Shore Excursions
      </h3>
      <p className="text-sm text-slate-500 mb-6">Optional activities available at your ports of call.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {excursions.map((exc) => (
          <div key={exc.id} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{exc.name}</h4>
              <span className="shrink-0 text-xs font-black text-slate-900 dark:text-slate-50">
                {exc.priceUSD === 0 ? 'Free' : `$${exc.priceUSD}`}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide">
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">{exc.type}</span>
              <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> {exc.duration}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{exc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
