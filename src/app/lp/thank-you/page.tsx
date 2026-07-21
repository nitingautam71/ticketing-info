import type { Metadata } from 'next';
import { Phone, MessageCircle, CheckCircle2 } from 'lucide-react';
import LpThankYouTracker from './LpThankYouTracker';
import { telLink, whatsappLink, businessPhoneDisplay } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Thank You',
  robots: { index: false, follow: false },
};

const THEME_COPY: Record<string, string> = {
  'flight-booking': "A flight specialist will call or WhatsApp you within 30 minutes during business hours to confirm fares and book your seats.",
  'visa-assistance': 'A visa consultant will review your request and call or WhatsApp you within a few hours to walk through documents and next steps.',
  'tour-packages': 'A travel consultant will call or WhatsApp you within a few hours with a customized package and pricing.',
};

export default async function LpThankYouPage({ searchParams }: { searchParams: Promise<{ theme?: string; vertical?: string }> }) {
  const { theme, vertical } = await searchParams;
  const nextStepsCopy = (theme && THEME_COPY[theme]) || "A travel consultant will call or WhatsApp you shortly to confirm the details.";

  return (
    <div className="flex-1 max-w-md w-full mx-auto px-4 md:px-8 pt-32 pb-20 text-center flex flex-col items-center">
      <LpThankYouTracker theme={theme} vertical={vertical} />
      <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h1 className="font-display text-3xl text-white font-medium mb-3">You&apos;re all set!</h1>
      <p className="text-neutral-400 text-sm mb-8">{nextStepsCopy}</p>

      <div className="grid grid-cols-2 gap-3 w-full">
        <a href={telLink()} className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 text-white text-sm font-bold py-3 rounded-xl">
          <Phone className="w-4 h-4 text-emerald-400" /> Call {businessPhoneDisplay()}
        </a>
        <a
          href={whatsappLink("Hi! I just submitted a request and wanted to follow up.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-bold py-3 rounded-xl"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp Us
        </a>
      </div>
    </div>
  );
}
