'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export default function WhatsAppFab() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <a
      href={whatsappLink("Hi! I'd like help planning a trip.")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { source: 'floating_button', page: pathname })}
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
    >
      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
      <MessageCircle className="w-7 h-7 relative" strokeWidth={2.25} />
    </a>
  );
}
