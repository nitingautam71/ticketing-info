import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ExternalLink, MapPin, ShieldCheck, Star } from 'lucide-react';
import { getDisplayImageUrl, getPackageBySlug, listAllPackageSlugs } from '@/lib/providers/packages';
import { buildPackageSchema } from '@/lib/packages/schema';
import JsonLd from '@/components/seo/JsonLd';
import PackagePricingWidget from '@/components/packages/PackagePricingWidget';

export async function generateStaticParams() {
  return listAllPackageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return {};
  const image = getDisplayImageUrl(pkg.slug);
  return {
    title: pkg.metaTitle,
    description: pkg.metaDescription,
    alternates: { canonical: pkg.seo.canonicalUrl },
    openGraph: { title: pkg.metaTitle, description: pkg.metaDescription, images: [image], type: 'website' },
    twitter: { card: 'summary_large_image', title: pkg.metaTitle, description: pkg.metaDescription, images: [image] },
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) notFound();

  return (
    <div className="flex-1 flex flex-col pb-20">
      <JsonLd data={buildPackageSchema(pkg)} />

      <section className="relative h-[42vh] md:h-[52vh] flex items-end overflow-hidden bg-neutral-950">
        <Image src={getDisplayImageUrl(pkg.slug)} alt={pkg.images.find((i) => i.role === 'hero')?.altText ?? pkg.title} fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/20" />
        <div className="relative z-10 max-w-5xl w-full mx-auto px-4 md:px-8 pb-10 pt-32">
          <nav className="text-[11px] text-neutral-400 font-mono mb-4">
            <Link href="/" className="hover:text-neutral-200">
              Home
            </Link>{' '}
            /{' '}
            <Link href="/packages" className="hover:text-neutral-200">
              Packages
            </Link>{' '}
            / {pkg.destinationName}
          </nav>
          <p className="text-emerald-300 text-[11px] font-black tracking-[0.3em] uppercase mb-3">{pkg.categories.join(' · ')}</p>
          <h1 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight max-w-3xl">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-neutral-200">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {pkg.destinationName}, {pkg.country}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {pkg.durationDays} Days / {pkg.durationNights} Nights
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400" /> {pkg.ratings.overall} ({pkg.ratings.reviewCount} reviews)
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">Overview</h2>
            <p className="text-neutral-300 text-sm leading-relaxed">{pkg.overview}</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Highlights</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pkg.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Day-by-Day Itinerary</h2>
            <div className="space-y-4">
              {pkg.itinerary.map((day) => (
                <div key={day.day} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                  <p className="text-emerald-400 text-xs font-bold font-mono mb-1">DAY {day.day}</p>
                  <h3 className="text-white font-bold mb-2">{day.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{day.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Included</h2>
              <ul className="space-y-1.5 text-sm text-neutral-300">
                {pkg.included.map((i) => (
                  <li key={i}>✓ {i}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Not Included</h2>
              <ul className="space-y-1.5 text-sm text-neutral-500">
                {pkg.notIncluded.map((i) => (
                  <li key={i}>✕ {i}</li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Good to Know</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-neutral-500 text-xs">Best Time to Visit</dt>
                <dd className="text-neutral-200">{pkg.bestTimeToVisit}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 text-xs">Currency</dt>
                <dd className="text-neutral-200">{pkg.currency}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 text-xs">Languages</dt>
                <dd className="text-neutral-200">{pkg.languages.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 text-xs">Time Zone</dt>
                <dd className="text-neutral-200">{pkg.timeZone}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 text-xs">Nearest Airport</dt>
                <dd className="text-neutral-200">{pkg.nearestAirport}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 text-xs">Avg. Flight Time</dt>
                <dd className="text-neutral-200">{pkg.averageFlightTime}</dd>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <dt className="text-neutral-500 text-xs">Visa Information</dt>
                <dd className="text-neutral-200">{pkg.visaInformation}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {pkg.faqs.map((f) => (
                <details key={f.question} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <summary className="text-sm font-semibold text-white cursor-pointer">{f.question}</summary>
                  <p className="text-sm text-neutral-400 mt-2 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Traveler Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pkg.reviews.slice(0, 6).map((r) => (
                <div key={r.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-white">{r.author}</p>
                    <p className="text-amber-400 text-xs font-bold">★ {r.rating}</p>
                  </div>
                  <p className="text-neutral-500 text-[11px] mb-2">
                    {r.country} • {r.date}
                  </p>
                  <p className="text-neutral-300 text-sm leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          </section>

          {(pkg.seo.internalLinks.length > 0 || pkg.seo.externalLinks.length > 0) && (
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {pkg.seo.internalLinks.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3">You Might Also Like</h2>
                  <ul className="space-y-1.5 text-sm">
                    {pkg.seo.internalLinks.map((l) => (
                      <li key={l.url}>
                        <Link href={l.url} className="text-emerald-400 hover:text-emerald-300">
                          {l.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.seo.externalLinks.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3">Learn More</h2>
                  <ul className="space-y-1.5 text-sm">
                    {pkg.seo.externalLinks.map((l) => (
                      <li key={l.url}>
                        <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" /> {l.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <PackagePricingWidget pkg={pkg} />
          </div>
        </aside>
      </div>
    </div>
  );
}
