import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Sparkles } from 'lucide-react';
import { getPackageBySlug, getDisplayImageUrl } from '@/lib/providers/packages';

// Hand-researched packages for destinations with major 2025-26 tourism momentum:
// Macau (#4 globally by international arrivals, Euromonitor Top 100 City Destinations
// Index 2025), Mexico City & São Paulo (Lonely Planet Best in Travel 2026), AlUla
// (Saudi Arabia's Vision 2030 tourism push, 122M national visitors in 2025), plus
// Jeju, Antalya, Kuala Lumpur, Sharm El Sheikh, and Ibiza — long-standing high-volume
// destinations with a gap in the existing 150-destination catalog. Generated through
// the same generatePackage() pipeline as every other package (src/lib/packages/destinations-g.ts),
// just curated and surfaced here rather than left to blend into general search.
const FEATURED_SLUGS = [
  'macau-7-day-package',
  'mexico-city-7-day-package',
  'sao-paulo-7-day-package',
  'jeju-island-7-day-package',
  'alula-7-day-package',
  'antalya-7-day-package',
  'kuala-lumpur-7-day-package',
  'sharm-el-sheikh-7-day-package',
  'ibiza-7-day-package',
];

export default function FeaturedPackages() {
  const packages = FEATURED_SLUGS.map((slug) => getPackageBySlug(slug)).filter((p) => p !== null);
  if (packages.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Featured — World&apos;s Most Visited Destinations, 2025-26</h2>
      </div>
      <p className="text-neutral-400 text-xs -mt-3">Hand-curated packages for the destinations topping global travel rankings this year.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Link
            key={pkg.slug}
            href={`/packages/${pkg.slug}`}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:border-emerald-800 transition-colors flex flex-col group"
          >
            <div className="h-44 relative bg-neutral-950">
              <Image
                src={getDisplayImageUrl(pkg.slug)}
                alt={pkg.images.find((i) => i.role === 'hero')?.altText ?? pkg.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-emerald-950/60 border border-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-400 font-bold font-mono uppercase tracking-wider">
                {pkg.durationDays} Days
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors">{pkg.title}</h3>
                <p className="text-xs text-neutral-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {pkg.destinationName}, {pkg.country}
                </p>
                <p className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {pkg.ratings.overall} ({pkg.ratings.reviewCount} reviews)
                </p>
              </div>
              <div className="border-t border-neutral-800/60 pt-3 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-neutral-500 font-semibold">From, per person</p>
                  <p className="text-lg font-black text-white">${pkg.fromPriceUSD.toLocaleString()}</p>
                </div>
                <span className="text-emerald-400 text-xs font-bold group-hover:translate-x-0.5 transition-transform">View Package →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
