import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { prisma } from '@/lib/db';
import JsonLd from '@/components/seo/JsonLd';
import { faqPageJsonLd, breadcrumbJsonLd } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'FAQs — Flight Tickets, Train Tickets, Visas & Bookings',
  description: 'Answers to common questions about booking flight tickets, train tickets, hotels, tour packages, and visa assistance with Ticketing-Info.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQs — Flight Tickets, Train Tickets, Visas & Bookings | Ticketing-Info',
    description: 'Answers to common questions about booking flight tickets, train tickets, hotels, tour packages, and visa assistance.',
  },
};

export const dynamic = 'force-dynamic';

export default async function FaqPage() {
  const faqs = await prisma.faqEntry.findMany({
    where: { published: true },
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  });

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const key = faq.category?.trim() || 'General';
    (acc[key] ??= []).push(faq);
    return acc;
  }, {});

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'FAQs', path: '/faq' }])} />
      {faqs.length > 0 && <JsonLd data={faqPageJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />}

      <nav className="text-[11px] text-neutral-500 font-mono mb-4">
        <Link href="/" className="hover:text-neutral-300">Home</Link> / FAQs
      </nav>

      <div className="mb-10">
        <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Support</p>
        <h1 className="font-display text-4xl md:text-5xl text-white font-medium">Frequently asked questions</h1>
        <p className="text-neutral-400 text-sm mt-3 max-w-xl">
          Common questions about flight tickets, train tickets, hotel bookings, tour packages, and visa assistance. Can&apos;t find your
          answer? <Link href="/contact" className="text-emerald-400 hover:underline">Contact us</Link> or{' '}
          <Link href="/get-quote" className="text-emerald-400 hover:underline">get a free quote</Link>.
        </p>
      </div>

      {faqs.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400 text-sm">
          FAQs are coming soon — in the meantime, <Link href="/contact" className="text-emerald-400 hover:underline">reach out to us directly</Link>.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-3">{category}</h2>
              <div className="space-y-2">
                {items.map((faq) => (
                  <details key={faq.id} className="group bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 open:border-emerald-500/30">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                      <h3 className="text-sm font-bold text-white leading-snug">{faq.question}</h3>
                      <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="text-sm text-neutral-400 leading-relaxed mt-3">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
