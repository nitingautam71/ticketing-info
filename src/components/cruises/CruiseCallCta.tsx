'use client';

import Link from 'next/link';
import { Phone, MessageCircle, PhoneCall } from 'lucide-react';
import { telLink, whatsappLink, businessPhoneDisplay } from '@/lib/whatsapp';
import { trackEvent, trackConversion } from '@/lib/analytics';
import { beaconCallClick } from '@/lib/attribution';

// The conversion unit for every cruise SEO page: call-first, WhatsApp second,
// callback form third. `placement` flows through GA4 events and the CallClick
// table so each banner position's call volume is attributable.
export default function CruiseCallCta({
  placement,
  heading = 'Talk to a real cruise consultant',
  subline = 'Live cabin availability, unpublished promos, and honest advice — free, and usually faster than comparing sites yourself.',
  whatsappMessage = "Hi! I'd like help finding a cruise.",
}: {
  placement: string;
  heading?: string;
  subline?: string;
  whatsappMessage?: string;
}) {
  const phone = businessPhoneDisplay();

  const onCall = () => {
    trackEvent('click_to_call', { source: placement, vertical: 'cruise' });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL, { placement });
    beaconCallClick({ channel: 'call', placement, vertical: 'cruise', phone });
  };
  const onWhatsapp = () => {
    trackEvent('whatsapp_click', { source: placement, vertical: 'cruise' });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP, { placement });
    beaconCallClick({ channel: 'whatsapp', placement, vertical: 'cruise' });
  };

  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-900 dark:to-slate-900 rounded-2xl p-6 md:p-8 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
        <div className="flex-1">
          <p className="text-blue-200 text-[10px] font-black tracking-[0.25em] uppercase mb-2 flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5" /> Free expert help
          </p>
          <h2 className="text-xl md:text-2xl font-black text-white leading-tight">{heading}</h2>
          <p className="text-blue-100/90 text-sm mt-2 max-w-xl">{subline}</p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 shrink-0">
          <a
            href={telLink()}
            onClick={onCall}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-900 text-sm font-black px-6 py-3.5 rounded-full transition-colors shadow-md cursor-pointer"
          >
            <Phone className="w-4 h-4" /> Call {phone}
          </a>
          <a
            href={whatsappLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsapp}
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold px-6 py-3.5 rounded-full transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <Link
            href="/get-quote"
            className="inline-flex items-center justify-center gap-2 border border-white/40 hover:bg-white/10 text-white text-sm font-bold px-6 py-3.5 rounded-full transition-colors"
          >
            Request a callback
          </Link>
        </div>
      </div>
    </section>
  );
}
