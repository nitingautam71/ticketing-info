'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Link2, Printer } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

/**
 * Interactive document checklist: tick items off, print/save as PDF via the
 * browser print dialog, or copy the shareable canonical URL.
 */
export default function DocumentChecklist({ documents, shareTitle }: { documents: string[]; shareTitle: string }) {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const toggle = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const share = async () => {
    const url = window.location.href.split('#')[0];
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      trackEvent('visa_checklist_share');
    } catch {
      /* user dismissed the share sheet */
    }
  };

  const print = () => {
    trackEvent('visa_checklist_print');
    window.print();
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">
          Document Checklist{' '}
          <span className="text-neutral-500 normal-case font-medium">
            ({done.size}/{documents.length} ready)
          </span>
        </h2>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={print}
            className="text-[11px] font-bold text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-lg px-3 py-1.5 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </button>
          <button
            onClick={share}
            className="text-[11px] font-bold text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-lg px-3 py-1.5 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Link2 className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {documents.map((doc, i) => (
          <li key={i}>
            <button
              onClick={() => toggle(i)}
              aria-pressed={done.has(i)}
              className={`w-full text-left bg-neutral-950/60 border p-4 rounded-xl flex items-start gap-3 cursor-pointer transition-colors ${
                done.has(i) ? 'border-emerald-800/60' : 'border-neutral-850 hover:border-neutral-700'
              }`}
            >
              {done.has(i) ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden />
              ) : (
                <Circle className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" aria-hidden />
              )}
              <span className={`text-xs leading-snug font-medium ${done.has(i) ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>{doc}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
