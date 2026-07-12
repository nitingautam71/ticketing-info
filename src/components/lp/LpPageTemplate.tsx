import { CheckCircle2, ChevronDown } from 'lucide-react';
import type { BookingVertical } from '@/lib/types';
import LpLeadForm from './LpLeadForm';
import LpCallWhatsappButtons from './LpCallWhatsappButtons';
import LpCtaButton from './LpCtaButton';
import TrustSignals from './TrustSignals';
import StickyMobileCta from './StickyMobileCta';
import JsonLd from '@/components/seo/JsonLd';
import { faqPageJsonLd } from '@/lib/structuredData';

export interface LpFaq {
  question: string;
  answer: string;
}

export default function LpPageTemplate({
  theme,
  vertical,
  eyebrow,
  headline,
  subhead,
  whatsappMessage,
  benefits,
  faqs,
  ctaLabel = 'Get My Free Quote',
}: {
  theme: string;
  vertical: BookingVertical;
  eyebrow: string;
  headline: string;
  subhead: string;
  whatsappMessage: string;
  benefits: { title: string; desc: string }[];
  faqs: LpFaq[];
  ctaLabel?: string;
}) {
  return (
    <div className="flex-1 flex flex-col pb-20 sm:pb-0">
      <JsonLd data={faqPageJsonLd(faqs)} />

      <section className="max-w-6xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
          <div>
            <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-emerald-400/70 inline-block" />
              {eyebrow}
            </p>
            <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight mb-4">{headline}</h1>
            <p className="text-neutral-300 text-sm md:text-base mb-7 max-w-xl">{subhead}</p>
            <LpCallWhatsappButtons theme={theme} whatsappMessage={whatsappMessage} />
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">{ctaLabel}</h2>
            <p className="text-xs text-neutral-400 mb-5">Takes 30 seconds. A real consultant calls you back.</p>
            <LpLeadForm vertical={vertical} theme={theme} ctaLabel={ctaLabel} />
          </div>
        </div>
      </section>

      <section className="max-w-6xl w-full mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <div key={b.title} className="glass rounded-2xl p-5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">{b.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl w-full mx-auto px-4 md:px-8">
        <TrustSignals />
        <LpCtaButton label={ctaLabel} />
      </div>

      <section className="max-w-3xl w-full mx-auto px-4 md:px-8 py-6">
        <h2 className="font-display text-2xl text-white font-medium mb-4">Frequently asked questions</h2>
        <div className="space-y-2">
          {faqs.map((faq) => (
            <details key={faq.question} className="group bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 open:border-emerald-500/30">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                <h3 className="text-sm font-bold text-white leading-snug">{faq.question}</h3>
                <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-sm text-neutral-400 leading-relaxed mt-3">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="max-w-3xl w-full mx-auto px-4 md:px-8">
        <LpCtaButton label={ctaLabel} />
      </div>

      <StickyMobileCta theme={theme} whatsappMessage={whatsappMessage} />
    </div>
  );
}
