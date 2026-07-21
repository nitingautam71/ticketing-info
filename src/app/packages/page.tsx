import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import PackageSearch from '@/components/search/PackageSearch';
import FeaturedPackages from '@/components/packages/FeaturedPackages';
import InsuranceCrossSell from '@/components/insurance/InsuranceCrossSell';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Tour Packages — Domestic & International Vacation Deals',
  description:
    'Browse tour packages for domestic and international trips — flights, hotels, transfers, sightseeing, and insurance bundled by our travel consultants.',
  alternates: { canonical: '/packages' },
  openGraph: {
    title: 'Tour Packages — Domestic & International Vacation Deals | Ticketing-Info',
    description: 'Browse tour packages combining flights, hotels, transfers, tours, and insurance, then book with a real travel consultant.',
  },
};

export default function PackagesPage() {
  const hero = HERO_COPY['/packages'];
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16 space-y-12">
        <PackageSearch />
        <FeaturedPackages />
        <InsuranceCrossSell context="your holiday" />
      </div>
    </div>
  );
}
