import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/layout/HeroSection';
import CarCard from '@/components/cars/CarCard';
import CarFilters from '@/components/cars/CarFilters';
import CarSearchBar from '@/components/cars/CarSearchBar';
import CarPagination from '@/components/cars/CarPagination';
import { HERO_COPY } from '@/lib/nav';
import { searchCars, getCarFacets, getDisplayImageUrl, getCarCompanyLogoUrl } from '@/lib/providers/cars';
import { CarFront, LayoutGrid } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Car Rental Booking — Airport & City Pickup Worldwide',
  description:
    'Compare car rentals from Enterprise, Hertz, Avis, Sixt, and more across 35+ countries — economy to luxury, EVs, SUVs, and vans with airport, cruise-port, and rail-station pickup.',
  alternates: { canonical: '/cars' },
  openGraph: {
    title: 'Car Rental Booking — Airport & City Pickup Worldwide | Ticketing-Info',
    description: 'Compare car rentals from the world\'s major companies — economy to luxury, EVs, SUVs, and vans, then book with a real travel consultant.',
  },
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

interface CarsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const sp = await searchParams;
  const page = Number(firstValue(sp.page)) || 1;
  const q = firstValue(sp.q) || '';
  const companies = parseList(sp.company);
  const countries = parseList(sp.country);
  const categories = parseList(sp.category);
  const brands = parseList(sp.brand);
  const transmissionRaw = firstValue(sp.transmission);
  const transmission = transmissionRaw === 'Automatic' || transmissionRaw === 'Manual' ? transmissionRaw : undefined;
  const minPriceRaw = firstValue(sp.minPrice);
  const maxPriceRaw = firstValue(sp.maxPrice);
  const flag = (key: string) => (firstValue(sp[key]) === 'true' ? true : undefined);

  const [{ results, total, totalPages }, facets] = await Promise.all([
    searchCars({
      q,
      companies,
      countries,
      categories,
      brands,
      transmission,
      evOnly: flag('ev'),
      hybridOnly: flag('hybrid'),
      luxuryOnly: flag('luxury'),
      airportPickup: flag('airportPickup'),
      unlimitedMileage: flag('unlimitedMileage'),
      freeCancellation: flag('freeCancellation'),
      petFriendly: flag('petFriendly'),
      oneWay: flag('oneWay'),
      minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
      maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
      page,
      limit: 24,
    }),
    getCarFacets(),
  ]);

  const hero = HERO_COPY['/cars'];

  function buildHref(targetPage: number) {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (companies) next.set('company', companies.join(','));
    if (countries) next.set('country', countries.join(','));
    if (categories) next.set('category', categories.join(','));
    if (brands) next.set('brand', brands.join(','));
    if (transmission) next.set('transmission', transmission);
    for (const key of ['ev', 'hybrid', 'luxury', 'airportPickup', 'unlimitedMileage', 'freeCancellation', 'petFriendly', 'oneWay']) {
      if (firstValue(sp[key]) === 'true') next.set(key, 'true');
    }
    if (minPriceRaw) next.set('minPrice', minPriceRaw);
    if (maxPriceRaw) next.set('maxPrice', maxPriceRaw);
    if (targetPage > 1) next.set('page', String(targetPage));
    const qs = next.toString();
    return qs ? `/cars?${qs}` : '/cars';
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-12 relative z-20 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CarFilters facets={facets} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <CarSearchBar />
              <div className="flex items-center justify-between md:justify-end gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-blue-500" />
                  Showing {results.length} of {total.toLocaleString()} rentals
                </span>
              </div>
            </div>

            {results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map((car) => (
                    <CarCard
                      key={car.slug}
                      car={car}
                      imageUrl={getDisplayImageUrl(car.slug, car.category)}
                      logoUrl={getCarCompanyLogoUrl(car.companyName)}
                    />
                  ))}
                </div>
                <CarPagination page={page} totalPages={totalPages} buildHref={buildHref} />
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <CarFront className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h4 className="font-bold text-slate-950 dark:text-slate-100">No Cars Found</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
                  We couldn&apos;t find any rentals matching your exact filters. Try adjusting or clearing search terms.
                </p>
                <Link
                  href="/cars"
                  className="mt-4 inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
