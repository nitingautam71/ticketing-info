'use client';

import { useState } from 'react';
import { Search, AlertCircle, CheckCircle, ChevronRight, FileText } from 'lucide-react';
import type { VisaInfo } from '@/lib/providers/visas';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';

export default function VisaCheck() {
  const { open } = useBookingEnquiry();
  const [nationality, setNationality] = useState('United States');
  const [destination, setDestination] = useState('United Kingdom');
  const [visaInfo, setVisaInfo] = useState<VisaInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasChecked(true);
    try {
      const res = await fetch(`/api/visa/check?nationality=${encodeURIComponent(nationality)}&destination=${encodeURIComponent(destination)}`);
      setVisaInfo(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestVisaHelp = () => {
    if (!visaInfo) return;
    open({
      vertical: 'visa',
      title: `Consular Visa Processing: ${visaInfo.destinationCountry}`,
      subtitle: `Passport State: ${nationality} • Processing: ${visaInfo.processingTime}`,
      price: visaInfo.fee || 45,
      date: 'Flexible',
      details: { destinationCountry: visaInfo.destinationCountry, nationality, processingTime: visaInfo.processingTime, requirements: visaInfo.requirements },
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCheck} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Your Passport Nationality</label>
            <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="e.g. United States" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Target Destination Country</label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. United Kingdom" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <Search className="w-4 h-4" /> Check Visa Requirements
          </button>
        </div>
      </form>

      {hasChecked && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-400 text-sm">Accessing consular regulations and immigration visa databases...</p>
            </div>
          ) : visaInfo ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-neutral-800">
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white tracking-tight">Visa Assessment: {visaInfo.destinationCountry}</h4>
                  <p className="text-xs text-neutral-450">Nationality: {nationality}</p>
                </div>
                <div>
                  {visaInfo.visaRequired ? (
                    <span className="bg-red-950/60 text-red-400 border border-red-900 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Visa Required Before Arrival
                    </span>
                  ) : (
                    <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Visa Free Entrance Allowed
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl text-center space-y-1">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">Max Allowed Stay</p>
                  <p className="text-base font-black text-white">{visaInfo.maxStayDays ? `${visaInfo.maxStayDays} Days` : 'Varies'}</p>
                </div>
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl text-center space-y-1">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">Consular Process Time</p>
                  <p className="text-base font-black text-white">{visaInfo.processingTime}</p>
                </div>
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl text-center space-y-1">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">Government Consular Fee</p>
                  <p className="text-base font-black text-white">{visaInfo.fee ? `$${visaInfo.fee}` : 'No Fee'}</p>
                </div>
              </div>

              {visaInfo.requirements && visaInfo.requirements.length > 0 && (
                <div className="space-y-3.5 pt-2">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Required Application Documents</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {visaInfo.requirements.map((req, idx) => (
                      <div key={idx} className="bg-neutral-950/60 border border-neutral-850 p-4 rounded-xl flex items-start gap-3">
                        <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-300 leading-snug font-medium">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-neutral-500 leading-relaxed">
                This is a rule-of-thumb estimate for planning purposes only, not official immigration advice — always confirm with the relevant embassy or consulate.
              </p>

              {visaInfo.visaRequired && (
                <div className="bg-emerald-950/15 border border-emerald-500/10 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Consular Processing Assistance</p>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Submit passport credentials and documentation. We handle visa forms, consular submissions, appointments, and courier transits.
                    </p>
                  </div>
                  <button onClick={requestVisaHelp} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0">
                    Get Visa Help <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
