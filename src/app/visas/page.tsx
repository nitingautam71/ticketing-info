import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import VisaCheck from '@/components/search/VisaCheck';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Visa Checker — Instant Entry Requirements',
  description: 'Check visa requirements, processing time, and fees for your passport and destination, then get help from a real travel consultant.',
  alternates: { canonical: '/visas' },
};

export default function VisasPage() {
  const hero = HERO_COPY['/visas'];
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16">
        <VisaCheck />
      </div>
    </div>
  );
}
