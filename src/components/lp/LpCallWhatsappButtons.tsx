'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { telLink, whatsappLink, businessPhoneDisplay } from '@/lib/whatsapp';
import { trackEvent, trackConversion } from '@/lib/analytics';
import { beaconCallClick } from '@/lib/attribution';

export default function LpCallWhatsappButtons({ theme, whatsappMessage }: { theme: string; whatsappMessage: string }) {
  const onCall = () => {
    trackEvent('click_to_call', { source: 'lp_inline', theme });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL, { theme });
    beaconCallClick({ channel: 'call', placement: 'lp_inline', phone: businessPhoneDisplay() });
  };
  const onWhatsapp = () => {
    trackEvent('whatsapp_click', { source: 'lp_inline', theme });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP, { theme });
    beaconCallClick({ channel: 'whatsapp', placement: 'lp_inline' });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={telLink()}
        onClick={onCall}
        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-sm font-bold px-5 py-3 rounded-full transition-colors shadow-lg shadow-emerald-500/30 cursor-pointer"
      >
        <Phone className="w-4 h-4" /> Call {businessPhoneDisplay()}
      </a>
      <a
        href={whatsappLink(whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onWhatsapp}
        className="inline-flex items-center gap-2 glass-soft hover:bg-white/15 text-white text-sm font-bold px-5 py-3 rounded-full transition-all cursor-pointer"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp Us
      </a>
    </div>
  );
}
