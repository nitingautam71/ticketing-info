import Link from 'next/link';
import { ChevronRight, ChevronDown, LayoutGrid } from 'lucide-react';
import type { CruiseSearchResult } from '@/lib/cruises/types';
import type { HubFaq } from '@/lib/cruises/hubs';
import CruiseCard from '@/components/cruises/CruiseCard';
import CruiseCallCta from '@/components/cruises/CruiseCallCta';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';
import { getDisplayImageUrl, getCruiseLineLogoUrl } from '@/lib/providers/cruises';

export interface HubStat {
  label: string;
  value: string;
}

export interface HubLinkGroup {
  heading: string;
  links: { label: string; href: string }[];
}

// Shared shell for the three cruise hub page types (destination / line / port).
// Renders breadcrumb + FAQPage JSON-LD, an intro, the call CTA above the fold,
// a top-rated sailings grid, any page-specific sections (children), FAQs, and
// cross-links into the rest of the cruise cluster.
export default function CruiseHubLayout({
  breadcrumbs,
  eyebrow,
  title,
  subtitle,
  intro,
  stats,
  cruises,
  viewAllHref,
  viewAllLabel,
  faqs,
  ctaPlacement,
  ctaHeading,
  whatsappMessage,
  linkGroups,
  children,
}: {
  breadcrumbs: { name: string; path: string }[];
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string[];
  stats: HubStat[];
  cruises: CruiseSearchResult[];
  viewAllHref: string;
  viewAllLabel: string;
  faqs: HubFaq[];
  ctaPlacement: string;
  ctaHeading: string;
  whatsappMessage: string;
  linkGroups: HubLinkGroup[];
  children?: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 pb-20">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={faqPageJsonLd(faqs)} />

      {/* Hero */}
      <div className="bg-slate-950 pt-28 pb-12 px-4 md:px-8">
        <div className="max-w-7xl w-full mx-auto space-y-4">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-slate-400">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.path} className="hover:text-white transition-colors">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-slate-200">{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>

          <p className="text-emerald-400 text-[11px] font-black tracking-[0.3em] uppercase flex items-center gap-2">
            <span className="w-8 h-px bg-emerald-400/70 inline-block" />
            {eyebrow}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl">{title}</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">{subtitle}</p>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-3 pt-2">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                <span className="font-extrabold text-white text-sm">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 mt-10 space-y-12">
        {/* Intro + call CTA above the fold */}
        <div className="space-y-6">
          <div className="max-w-3xl space-y-4">
            {intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <CruiseCallCta placement={ctaPlacement} heading={ctaHeading} whatsappMessage={whatsappMessage} />
        </div>

        {/* Top-rated sailings */}
        {cruises.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5 gap-4">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-blue-600" /> Top-rated sailings
              </h2>
              <Link
                href={viewAllHref}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 whitespace-nowrap"
              >
                {viewAllLabel} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cruises.map((cruise) => (
                <CruiseCard
                  key={cruise.slug}
                  cruise={cruise}
                  imageUrl={getDisplayImageUrl(cruise.slug, cruise.destination, cruise.categories)}
                  logoUrl={getCruiseLineLogoUrl(cruise.cruiseLineName)}
                />
              ))}
            </div>
          </section>
        )}

        {children}

        {/* FAQs */}
        <section className="max-w-3xl">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50 mb-5">Frequently asked questions</h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 open:border-blue-400/60"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{faq.question}</h3>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Second CTA after the FAQ read */}
        <CruiseCallCta
          placement={`${ctaPlacement}_bottom`}
          heading="Ready to compare fares? It takes one call."
          whatsappMessage={whatsappMessage}
        />

        {/* Cross-links into the rest of the cruise cluster */}
        {linkGroups.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {linkGroups.map((group) => (
              <div key={group.heading} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">{group.heading}</h2>
                <ul className="space-y-1.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
