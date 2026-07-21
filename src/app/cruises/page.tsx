import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/layout/HeroSection';
import CruiseCard from '@/components/cruises/CruiseCard';
import CruiseFilters from '@/components/cruises/CruiseFilters';
import CruiseSearchBar from '@/components/cruises/CruiseSearchBar';
import CruisePagination from '@/components/cruises/CruisePagination';
import { HERO_COPY } from '@/lib/nav';
import { searchCruises, getCruiseFacets, getDisplayImageUrl, getCruiseLineLogoUrl } from '@/lib/providers/cruises';
import CruiseHubLinks from '@/components/cruises/hub/CruiseHubLinks';
import CruiseCallCta from '@/components/cruises/CruiseCallCta';
import InsuranceCrossSell from '@/components/insurance/InsuranceCrossSell';
import { Ship, LayoutGrid } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cruises | Ocean, River & Expedition Voyages',
  description: HERO_COPY['/cruises'].sub,
  alternates: { canonical: '/cruises' }
};

function parseList(value: string | string[] | undefined): string[] | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const list = raw.split(',').map((v) => v.trim()).filter(Boolean);
  return list.length > 0 ? list : undefined;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

interface CruisesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CruisesPage({ searchParams }: CruisesPageProps) {
  const sp = await searchParams;
  const page = Number(firstValue(sp.page)) || 1;
  const q = firstValue(sp.q) || '';
  const destinations = parseList(sp.destination);
  const cruiseLines = parseList(sp.cruiseLine);
  const departurePorts = parseList(sp.departurePort);
  const durations = parseList(sp.duration);
  const riverParam = firstValue(sp.river);
  const riverCruise = riverParam === 'true' ? true : riverParam === 'false' ? false : undefined;
  const adultsOnly = firstValue(sp.adultsOnly) === 'true' ? true : undefined;
  const minPriceRaw = firstValue(sp.minPrice);
  const maxPriceRaw = firstValue(sp.maxPrice);
  const minPrice = minPriceRaw ? Number(minPriceRaw) : undefined;
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined;

  const [{ results, total, totalPages }, facets] = await Promise.all([
    searchCruises({
      q,
      destinations,
      cruiseLines,
      departurePorts,
      durations,
      riverCruise,
      adultsOnly,
      minPrice,
      maxPrice,
      page,
      limit: 24
    }),
    getCruiseFacets()
  ]);

  const hero = HERO_COPY['/cruises'];

  function buildHref(targetPage: number) {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (destinations) next.set('destination', destinations.join(','));
    if (cruiseLines) next.set('cruiseLine', cruiseLines.join(','));
    if (departurePorts) next.set('departurePort', departurePorts.join(','));
    if (durations) next.set('duration', durations.join(','));
    if (riverCruise !== undefined) next.set('river', String(riverCruise));
    if (adultsOnly) next.set('adultsOnly', 'true');
    if (minPrice !== undefined) next.set('minPrice', String(minPrice));
    if (maxPrice !== undefined) next.set('maxPrice', String(maxPrice));
    if (targetPage > 1) next.set('page', String(targetPage));
    const qs = next.toString();
    return qs ? `/cruises?${qs}` : '/cruises';
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Page Hero */}
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-12 relative z-20 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CruiseFilters facets={facets} />
          </div>

          {/* Results grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Input and Metadata Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <CruiseSearchBar />

              <div className="flex items-center justify-between md:justify-end gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-blue-500" />
                  Showing {results.length} of {total.toLocaleString()} results
                </span>
              </div>
            </div>

            {/* Grid */}
            {results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map((cruise) => (
                    <CruiseCard
                      key={cruise.slug}
                      cruise={cruise}
                      imageUrl={getDisplayImageUrl(cruise.slug, cruise.destination, cruise.categories)}
                      logoUrl={getCruiseLineLogoUrl(cruise.cruiseLineName)}
                    />
                  ))}
                </div>
                <CruisePagination page={page} totalPages={totalPages} buildHref={buildHref} />
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <Ship className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h4 className="font-bold text-slate-950 dark:text-slate-100">No Cruises Found</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
                  We couldn&apos;t find any voyages matching your exact filters. Try adjusting or clearing search terms.
                </p>
                <Link
                  href="/cruises"
                  className="mt-4 inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <CruiseCallCta placement="cruise_index" heading="Not sure which cruise? That's literally our job." />
        </div>

        <div className="mt-6">
          <InsuranceCrossSell context="your cruise" href="/insurance/type/cruise" />
        </div>
      </div>

      <CruiseHubLinks departurePorts={facets.departurePorts} />
    </div>
  );
}
