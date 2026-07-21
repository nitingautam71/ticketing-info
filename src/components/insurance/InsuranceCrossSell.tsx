import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

/** Contextual insurance upsell card for booking-flow pages (flights, hotels,
 * cruises, packages, visas). Server-safe — a plain link into the quote flow,
 * never a forced add-on. */
export default function InsuranceCrossSell({
  context,
  href = '/insurance',
}: {
  /** e.g. "your cruise", "this trip", "your Schengen visa application" */
  context: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-2xl p-5 transition-colors group print:hidden"
    >
      <div className="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-800/50 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-5 h-5 text-emerald-400" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Protect {context} from ~$1–4 a day</p>
        <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
          Medical emergencies, cancellations, delays and baggage — compare plans from leading US &amp; Indian insurers in seconds. Optional, never required.
        </p>
      </div>
    </Link>
  );
}
