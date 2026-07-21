'use client';

import { ChevronRight } from 'lucide-react';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';
import { trackEvent, trackConversion } from '@/lib/analytics';

/** "Apply with an expert" lead capture — opens the site-wide enquiry modal. */
export default function VisaHelpCTA({
  destinationName,
  passportName,
  categoryLabel,
  processingTime,
  feeUsd,
  documents,
}: {
  destinationName: string;
  passportName: string;
  categoryLabel: string;
  processingTime: string;
  feeUsd: number;
  documents: string[];
}) {
  const { open } = useBookingEnquiry();

  const openEnquiry = () => {
    trackEvent('visa_apply_click', { destination: destinationName, passport: passportName });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD, { vertical: 'visa' });
    open({
      vertical: 'visa',
      title: `Visa Assistance: ${destinationName}`,
      subtitle: `${passportName} passport • ${categoryLabel} • ${processingTime}`,
      price: feeUsd || 45,
      date: 'Flexible',
      details: { destinationName, passportName, categoryLabel, processingTime, documents },
    });
  };

  return (
    <div className="bg-emerald-950/15 border border-emerald-500/10 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
      <div className="space-y-1">
        <p className="text-xs font-bold text-white">Skip the paperwork — apply with an expert</p>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Our consultants handle the forms, appointments, document review, and courier logistics for your {destinationName} application.
        </p>
      </div>
      <button
        onClick={openEnquiry}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
      >
        Get Visa Help <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
