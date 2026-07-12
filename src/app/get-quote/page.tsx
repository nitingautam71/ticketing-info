import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, MessageCircle, ShieldCheck } from 'lucide-react';
import QuoteForm from '@/components/QuoteForm';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structuredData';
import { telLink, whatsappLink, businessPhoneDisplay } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Get a Free Travel Quote — Flights, Hotels, Trains & Packages',
  description:
    'Request a free quote for flight tickets, train tickets, hotel bookings, tour packages, or visa assistance. A real travel consultant responds fast.',
  alternates: { canonical: '/get-quote' },
  openGraph: {
    title: 'Get a Free Travel Quote | Ticketing-Info',
    description: 'Request a free quote for flight tickets, train tickets, hotel bookings, tour packages, or visa assistance.',
  },
};

export default function GetQuotePage() {
  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Get a Free Quote', path: '/get-quote' }])} />

      <nav className="text-[11px] text-neutral-500 font-mono mb-4">
        <Link href="/" className="hover:text-neutral-300">Home</Link> / Get a Free Quote
      </nav>

      <div className="mb-10">
        <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Free quote</p>
        <h1 className="font-display text-4xl md:text-5xl text-white font-medium">Plan your trip, on us</h1>
        <p className="text-neutral-400 text-sm mt-3 max-w-xl">
          Tell us about the flight tickets, train tickets, hotel, tour package, or visa assistance you need. A real travel consultant
          reviews every request and gets back to you — usually the same day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Prefer to talk now?
          </div>
          <a href={telLink()} className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Call Us</p>
              <p className="text-xs text-neutral-400">{businessPhoneDisplay() || 'Add your business phone number'}</p>
            </div>
          </a>
          <a
            href={whatsappLink("Hi! I'd like a free travel quote.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">WhatsApp</p>
              <p className="text-xs text-neutral-400">Fastest way to reach us during business hours</p>
            </div>
          </a>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Not sure what you need yet? Browse{' '}
            <Link href="/flights" className="text-emerald-400 hover:underline">flight tickets</Link>,{' '}
            <Link href="/trains" className="text-emerald-400 hover:underline">train tickets</Link>,{' '}
            <Link href="/packages" className="text-emerald-400 hover:underline">tour packages</Link>, or check our{' '}
            <Link href="/faq" className="text-emerald-400 hover:underline">FAQs</Link>.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
