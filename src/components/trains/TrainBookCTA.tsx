'use client';

import { ChevronRight } from 'lucide-react';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';
import { trackEvent } from '@/lib/analytics';

export interface BookableClass {
  name: string;
  fare: number;
  currency: 'USD' | 'INR';
  fareLabel: string;
  perks: string[];
}

/**
 * Class-fare grid with booking enquiry buttons. Receives only serialisable
 * props so server pages (corridor & train detail) can render it directly.
 */
export default function TrainBookCTA({
  trainName,
  trainNumbers,
  operatorName,
  fromName,
  toName,
  departureTime,
  arrivalTime,
  classes,
}: {
  trainName: string;
  trainNumbers: string;
  operatorName: string;
  fromName: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  classes: BookableClass[];
}) {
  const { open } = useBookingEnquiry();

  const select = (cls: BookableClass) => {
    trackEvent('train_book_click', { train: trainName, class: cls.name });
    open({
      vertical: 'train',
      title: `${trainName} (${trainNumbers})`,
      subtitle: `${fromName} → ${toName} • ${cls.name}`,
      price: cls.currency === 'INR' ? Math.round(cls.fare / 84) : cls.fare,
      date: 'Flexible',
      details: {
        operator: operatorName,
        train: trainName,
        trainNumbers,
        from: fromName,
        to: toName,
        departureTime,
        arrivalTime,
        class: cls.name,
        indicativeFare: cls.fareLabel,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {classes.map((cls) => (
        <div key={cls.name} className="bg-neutral-950 border border-neutral-850 hover:border-emerald-500/20 p-4 rounded-xl flex justify-between items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-white">{cls.name}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5 truncate">{cls.perks[0] ?? 'Reserved seating'}</p>
          </div>
          <div className="text-right flex items-center gap-3 shrink-0">
            <div>
              <span className="text-sm font-black text-emerald-400">{cls.fareLabel}</span>
              <p className="text-[9px] text-neutral-600 uppercase font-bold">indicative</p>
            </div>
            <button
              onClick={() => select(cls)}
              aria-label={`Book ${cls.name} on ${trainName}`}
              className="p-1.5 bg-neutral-900 hover:bg-emerald-600 hover:text-white text-neutral-400 border border-neutral-800 rounded-lg cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
