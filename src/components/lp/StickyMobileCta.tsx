'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { telLink, whatsappLink, businessPhoneDisplay } from '@/lib/whatsapp';
import { trackEvent, trackConversion } from '@/lib/analytics';

export default function StickyMobileCta({ theme, whatsappMessage }: { theme: string; whatsappMessage: string }) {
  const onCall = () => {
    trackEvent('call_click', { source: 'lp_sticky_bar', theme });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL, { theme });
  };
  const onWhatsapp = () => {
    trackEvent('whatsapp_click', { source: 'lp_sticky_bar', theme });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP, { theme });
  };

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-white/10 grid grid-cols-2 gap-px p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <a
        href={telLink()}
        onClick={onCall}
        className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 text-white text-sm font-bold py-3 rounded-xl"
      >
        <Phone className="w-4 h-4 text-emerald-400" /> Call {businessPhoneDisplay()}
      </a>
      <a
        href={whatsappLink(whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onWhatsapp}
        className="flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-bold py-3 rounded-xl"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
    </div>
  );
}
