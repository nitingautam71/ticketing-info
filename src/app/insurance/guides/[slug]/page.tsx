import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import InsuranceHelpCTA from '@/components/insurance/InsuranceHelpCTA';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import { guideBySlug, INSURANCE_GUIDES } from '@/lib/insurance/guides';
import { INSURANCE_DISCLAIMER } from '@/lib/insurance/types';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return INSURANCE_GUIDES.map((g) => ({ slug: g.slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const guide = guideBySlug((await params).slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: `/insurance/guides/${guide.slug}` },
    openGraph: { title: guide.metaTitle, description: guide.metaDescription, type: 'article' },
  };
}

export default async function InsuranceGuidePage({ params }: { params: Promise<Params> }) {
  const guide = guideBySlug((await params).slug);
  if (!guide) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const others = INSURANCE_GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 4);

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Travel Insurance', path: '/insurance' },
          { name: 'Guides', path: '/insurance/guides' },
          { name: guide.title, path: `/insurance/guides/${guide.slug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(guide.faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.title,
          description: guide.metaDescription,
          url: `${siteUrl}/insurance/guides/${guide.slug}`,
          author: { '@type': 'Organization', name: 'Ticketing-Info' },
          publisher: { '@type': 'Organization', name: 'Ticketing-Info', logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.png` } },
        }}
      />

      <section className="bg-neutral-950 border-b border-neutral-800/60">
        <div className="max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-mono mb-5">
            <Link href="/" className="hover:text-neutral-200">Home</Link> /{' '}
            <Link href="/insurance" className="hover:text-neutral-200">Insurance</Link> /{' '}
            <Link href="/insurance/guides" className="hover:text-neutral-200">Guides</Link>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl text-white font-medium leading-tight">{guide.title}</h1>
          <p className="text-neutral-300 text-sm md:text-base mt-4 leading-relaxed">{guide.intro}</p>
        </div>
      </section>

      <article className="max-w-3xl w-full mx-auto px-4 md:px-8 mt-10 space-y-8">
        {guide.sections.map((s) => (
          <section key={s.heading} className="space-y-3">
            <h2 className="text-lg font-bold text-white">{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-neutral-300 leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}

        <InsuranceHelpCTA
          title={`Insurance Enquiry: ${guide.title}`}
          subtitle="Guide reader"
          details={{ guide: guide.slug }}
          heading="Apply this to your actual trip"
          body="Run an instant comparison, or tell our consultants the trip — they’ll shortlist plans and confirm live premiums with the insurers."
        />

        {/* FAQs */}
        <section aria-label="Frequently asked questions" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {guide.faqs.map((faq) => (
              <div key={faq.question} className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section aria-label="Related reading" className="space-y-4 print:hidden">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Keep reading</h2>
          <div className="flex flex-wrap gap-2">
            {guide.related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 border border-emerald-800/50 rounded-full px-3.5 py-1.5 transition-colors"
              >
                {r.label} →
              </Link>
            ))}
            {others.map((g) => (
              <Link
                key={g.slug}
                href={`/insurance/guides/${g.slug}`}
                className="text-[11px] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full px-3.5 py-1.5 transition-colors"
              >
                {g.title}
              </Link>
            ))}
          </div>
        </section>

        <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800/60 pt-6">{INSURANCE_DISCLAIMER}</p>
      </article>
    </div>
  );
}
