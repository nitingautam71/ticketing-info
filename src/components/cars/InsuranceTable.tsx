import type { InsuranceOption } from '@/lib/cars/types';
import { ShieldCheck, Check } from 'lucide-react';

export default function InsuranceTable({ options }: { options: InsuranceOption[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-1 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-blue-600" />
        Insurance & Protection
      </h3>
      <p className="text-sm text-slate-500 mb-5">What&apos;s included in every rate and what you can add at checkout or the counter.</p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-450 uppercase tracking-wider">
              <th className="py-2.5 pr-4">Cover</th>
              <th className="py-2.5 pr-4 text-right">Price / Day</th>
              <th className="py-2.5 pr-4 text-right">Excess</th>
              <th className="py-2.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
            {options.map((opt) => (
              <tr key={opt.id} className="align-top">
                <td className="py-3 pr-4">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100 block">{opt.name}</span>
                  {opt.included && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      <Check className="w-3 h-3" /> Included
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4 text-right text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  {opt.included || opt.pricePerDayUSD === 0 ? '—' : `$${opt.pricePerDayUSD}`}
                </td>
                <td className="py-3 pr-4 text-right text-sm text-slate-500 whitespace-nowrap">
                  {opt.excessUSD === 0 ? 'None' : `$${opt.excessUSD.toLocaleString()}`}
                </td>
                <td className="py-3 text-xs text-slate-500 leading-relaxed max-w-md">{opt.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
