'use client';

import { ChevronRight } from 'lucide-react';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';
import { trackConversion, trackEvent } from '@/lib/analytics';

/** "Buy with an expert" lead capture — opens the site-wide enquiry modal. */
export default function InsuranceHelpCTA({
  title,
  subtitle,
  priceUsd = 45,
  details,
  heading = 'Buy with a real consultant — not just a checkout form',
  body = 'Our consultants confirm final premiums with the insurer, check the wording against your trip (visa rules, activities, health declarations), and stay on the file for claims help.',
  buttonLabel = 'Get Insurance Help',
}: {
  title: string;
  subtitle: string;
  priceUsd?: number;
  details: Record<string, unknown>;
  heading?: string;
  body?: string;
  buttonLabel?: string;
}) {
  const { open } = useBookingEnquiry();

  const openEnquiry = () => {
    trackEvent('insurance_help_click', { title });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD, { vertical: 'insurance' });
    open({
      vertical: 'insurance',
      title,
      subtitle,
      price: priceUsd,
      date: 'Flexible',
      details,
    });
  };

  return (
    <div className="bg-emerald-950/15 border border-emerald-500/10 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
      <div className="space-y-1">
        <p className="text-xs font-bold text-white">{heading}</p>
        <p className="text-[11px] text-neutral-400 leading-relaxed">{body}</p>
      </div>
      <button
        onClick={openEnquiry}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
      >
        {buttonLabel} <ChevronRight className="w-4 h-4" aria-hidden />
      </button>
    </div>
  );
}
