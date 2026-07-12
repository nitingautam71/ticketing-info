import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';

export default function LandingCta({ heading, body, whatsappMessage }: { heading: string; body: string; whatsappMessage: string }) {
  return (
    <div className="glass rounded-3xl p-6 md:p-8 my-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <h2 className="font-display text-xl md:text-2xl text-white font-medium mb-1">{heading}</h2>
        <p className="text-neutral-300 text-sm max-w-md">{body}</p>
      </div>
      <div className="flex flex-wrap gap-3 shrink-0">
        <Link
          href="/get-quote"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-sm font-bold px-5 py-3 rounded-full transition-colors shadow-lg shadow-emerald-500/30 cursor-pointer"
        >
          Get Free Quote <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href={whatsappLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 glass-soft hover:bg-white/15 text-white text-sm font-bold px-5 py-3 rounded-full transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp Us
        </a>
      </div>
    </div>
  );
}
