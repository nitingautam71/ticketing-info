'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { telLink, whatsappLink, businessPhoneDisplay } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export default function ThankYouActions() {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
      <a
        href={telLink()}
        onClick={() => trackEvent('click_to_call', { source: 'thank_you' })}
        className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 text-white text-sm font-bold py-3 rounded-xl"
      >
        <Phone className="w-4 h-4 text-emerald-400" /> Call {businessPhoneDisplay()}
      </a>
      <a
        href={whatsappLink("Hi! I just submitted a request and wanted to follow up.")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('whatsapp_click', { source: 'thank_you' })}
        className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 text-white text-sm font-bold py-3 rounded-xl"
      >
        <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp
      </a>
    </div>
  );
}
