'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, AlertCircle, Briefcase, X, CheckCircle2, Leaf, Timer } from 'lucide-react';
import type { Flight } from '@/lib/providers/flights';
import { connectionWarning } from '@/lib/flightDisplay';

function AirlineLogo({ url, code }: { url?: string; code: string }) {
  const [failed, setFailed] = useState(false);
  if (url && !failed) {
    return (
      <div className="w-9 h-9 rounded-xl bg-white p-1 border border-neutral-800 shrink-0 relative overflow-hidden">
        <Image src={url} alt={code} fill sizes="36px" className="object-contain" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 bg-neutral-950 rounded-xl flex items-center justify-center font-bold text-xs text-emerald-400 border border-neutral-800 shrink-0">
      {code}
    </div>
  );
}

interface FlightResultCardProps {
  flight: Flight;
  isSelected: boolean;
  onSelect: () => void;
  /** Client-computed ranking badges (used when the provider supplies none). */
  badges?: string[];
}

export default function FlightResultCard({ flight: f, isSelected, onSelect, badges }: FlightResultCardProps) {
  const allTags = [...(f.tags ?? []), ...(badges ?? [])];
  const conn = connectionWarning(f);
  return (
    <div
      className={`bg-neutral-900 border rounded-2xl overflow-hidden shadow-md transition-all group ${
        isSelected ? 'border-emerald-500' : 'border-neutral-800 hover:border-neutral-700'
      }`}
    >
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pt-3">
          {allTags.map((tag) => (
            <span key={tag} className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center gap-3">
            <AirlineLogo url={f.airlineLogoUrl} code={f.airlineLogo} />
            <div>
              <h4 className="text-sm font-bold text-white leading-none">{f.airline}</h4>
              <span className="text-[10px] text-neutral-500 font-mono">
                Flight {f.flightNumber} • {f.class}
                {f.operatingAirline && ` • Operated by ${f.operatingAirline}`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center max-w-md">
            <div className="text-left">
              <p className="text-lg font-extrabold text-white leading-none tracking-tight">{f.departureTime}</p>
              <p className="text-xs text-neutral-400 font-bold mt-1 uppercase">{f.departureAirport}</p>
            </div>
            <div className="relative flex flex-col justify-center items-center">
              <span className="text-[10px] text-neutral-400 font-semibold">{f.duration}</span>
              <div className="w-full h-[2px] bg-neutral-800 relative my-1.5">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                {f.stops > 0 && <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-400" />}
              </div>
              <span className="text-[9px] text-neutral-500">{f.stops === 0 ? 'Nonstop' : `${f.stops} Stop (${f.stopoverAirports?.join(', ')})`}</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold text-white leading-none tracking-tight">
                {f.arrivalTime}
                {f.arrivesNextDay && <sup className="text-emerald-400 text-[10px] font-bold ml-0.5">+1</sup>}
              </p>
              <p className="text-xs text-neutral-400 font-bold mt-1 uppercase">{f.arrivalAirport}</p>
            </div>
          </div>

          {f.segments && f.segments.length > 1 && (
            <details className="text-[11px] text-neutral-400 group/details">
              <summary className="cursor-pointer text-emerald-400 font-bold hover:text-emerald-300 list-none flex items-center gap-1">
                <ChevronRight className="w-3 h-3 transition-transform group-open/details:rotate-90" /> View layover details
              </summary>
              <div className="mt-2 space-y-2.5 pl-4 border-l border-neutral-800">
                {f.segments.map((seg, i) => (
                  <div key={i}>
                    {seg.layoverMinutes != null && (
                      <p className="text-orange-400 font-semibold mb-1">
                        {Math.floor(seg.layoverMinutes / 60)}h {seg.layoverMinutes % 60}m layover in {seg.departureAirport}
                      </p>
                    )}
                    <p className="text-neutral-300">
                      {seg.carrierCode} {seg.flightNumber} &bull; {seg.departureAirport} {seg.departureTime} &rarr; {seg.arrivalAirport} {seg.arrivalTime}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          )}

          <div className="flex flex-wrap gap-2 items-center text-[10px] text-neutral-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-neutral-500" /> {f.baggage}
            </span>
            {conn && (
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${conn.tone === 'warn' ? 'border-amber-500/30 text-amber-400' : 'border-neutral-700 text-neutral-400'}`}>
                <Timer className="w-3 h-3" /> {conn.label}
              </span>
            )}
            {f.farePolicy && (
              <>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                    f.farePolicy.refundable ? 'border-emerald-500/30 text-emerald-400' : 'border-neutral-700 text-neutral-500'
                  }`}
                >
                  {f.farePolicy.refundable ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {f.farePolicy.refundable ? 'Refundable' : 'Non-refundable'}
                </span>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                    f.farePolicy.changeable ? 'border-emerald-500/30 text-emerald-400' : 'border-neutral-700 text-neutral-500'
                  }`}
                >
                  {f.farePolicy.changeable ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {f.farePolicy.changeable ? 'Changes allowed' : 'No changes'}
                </span>
              </>
            )}
            {f.isSelfTransfer && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-400">
                <AlertCircle className="w-3 h-3" /> {f.isProtectedSelfTransfer ? 'Self-transfer (protected)' : 'Self-transfer (unprotected)'}
              </span>
            )}
            {f.isMashUp && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-400">
                <AlertCircle className="w-3 h-3" /> Separate tickets
              </span>
            )}
            {f.ecoDeltaPercent != null && (
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                  f.ecoDeltaPercent <= 0 ? 'border-emerald-500/30 text-emerald-400' : 'border-neutral-700 text-neutral-500'
                }`}
              >
                <Leaf className="w-3 h-3" /> {f.ecoDeltaPercent > 0 ? `+${f.ecoDeltaPercent}` : f.ecoDeltaPercent}% CO2
              </span>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col justify-between items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-neutral-800 pt-4 sm:pt-0 shrink-0">
          <div className="sm:text-right">
            <p className="text-[10px] text-neutral-500 font-semibold">Total price</p>
            <p className="text-2xl font-black text-white mt-0.5">${f.price.toLocaleString()}</p>
          </div>
          <button
            onClick={onSelect}
            className={`font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
              isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 group-hover:scale-[1.02] text-white'
            }`}
          >
            {isSelected ? 'Selected' : 'Select Flight'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
