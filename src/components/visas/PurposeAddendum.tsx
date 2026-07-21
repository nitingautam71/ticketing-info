'use client';

import { useSearchParams } from 'next/navigation';
import { BriefcaseBusiness } from 'lucide-react';
import { buildChecklist, purposeNote } from '@/lib/visas/checklist';
import { TRAVEL_PURPOSES, type TravelPurpose, type VisaCategory } from '@/lib/visas/types';

/**
 * Purpose-specific overlay for the (statically cached) pair page. The canonical
 * page renders tourism rules; when the visitor arrived with ?purpose=…, this
 * client component adds the extra documents and guidance for that purpose —
 * computed locally from the same pure checklist module the server uses, so the
 * page stays ISR-cacheable.
 */
export default function PurposeAddendum({ category, baseDocuments }: { category: VisaCategory; baseDocuments: string[] }) {
  const params = useSearchParams();
  const raw = params.get('purpose');
  const purpose = TRAVEL_PURPOSES.find((p) => p.value === raw)?.value as TravelPurpose | undefined;
  if (!purpose || purpose === 'tourism') return null;

  const label = TRAVEL_PURPOSES.find((p) => p.value === purpose)!.label;
  const extraDocs = buildChecklist(category, purpose).filter((d) => !baseDocuments.includes(d));
  const note = purposeNote(purpose, 'the short-stay rule shown above');

  return (
    <section aria-label={`Additional requirements for ${label}`} className="bg-sky-950/20 border border-sky-800/40 rounded-2xl p-6 space-y-3.5">
      <h2 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
        <BriefcaseBusiness className="w-4 h-4" aria-hidden /> Travelling for {label}
      </h2>
      {note && <p className="text-xs text-neutral-300 leading-relaxed">{note}</p>}
      {extraDocs.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {extraDocs.map((doc) => (
            <li key={doc} className="text-xs text-neutral-300 bg-neutral-950/60 border border-neutral-850 rounded-xl p-3.5 leading-snug">
              {doc}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
