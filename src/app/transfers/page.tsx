import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import TransferSearch from '@/components/search/TransferSearch';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Airport Transfers — Private, Shared & Luxury',
  description: 'Book private, shared, luxury, van, and bus airport transfers, then confirm with a real travel consultant.',
  alternates: { canonical: '/transfers' },
};

export default function TransfersPage() {
  const hero = HERO_COPY['/transfers'];
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16">
        <TransferSearch />
      </div>
    </div>
  );
}
