import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structuredData';
import { INSURANCE_GUIDES } from '@/lib/insurance/guides';

export const metadata: Metadata = {
  title: 'Travel Insurance Guides — Learn Before You Buy',
  description:
    'Plain-English travel insurance guides: Schengen rules, USA and India trips, cruises, claims, exclusions, students, seniors and adventure sports.',
  alternates: { canonical: '/insurance/guides' },
};

export default function InsuranceGuidesPage() {
  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Travel Insurance', path: '/insurance' },
          { name: 'Guides', path: '/insurance/guides' },
        ])}
      />

      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/insurance" className="hover:text-neutral-200">Insurance</Link> / Guides
          </nav>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight">Travel insurance, explained properly</h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            No jargon, no scare tactics — what the benefits actually do, what the exclusions actually deny, and how to buy the right cover for the trip you’re really taking.
          </p>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INSURANCE_GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/insurance/guides/${g.slug}`}
              className="bg-neutral-900 border border-neutral-800 hover:border-emerald-800/60 rounded-2xl p-6 transition-colors group"
            >
              <BookOpen className="w-5 h-5 text-emerald-400 mb-3" aria-hidden />
              <h2 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">{g.title}</h2>
              <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed line-clamp-3">{g.intro}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
