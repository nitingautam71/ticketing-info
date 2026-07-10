import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import PackageSearch from '@/components/search/PackageSearch';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Vacation Packages — Flights, Hotels, Transfers & Tours Bundled',
  description: 'Browse all-inclusive vacation packages combining flights, hotels, transfers, tours, and insurance, then book with a real travel consultant.',
  alternates: { canonical: '/packages' },
};

export default function PackagesPage() {
  const hero = HERO_COPY['/packages'];
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16">
        <PackageSearch />
      </div>
    </div>
  );
}
