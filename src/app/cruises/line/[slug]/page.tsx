import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Ship as ShipIcon, Star } from 'lucide-react';
import { CRUISE_LINES } from '@/lib/cruises/cruise-lines';
import { SHIPS } from '@/lib/cruises/ships';
import { buildLineFaqs, destinationHubPath, lineHubPath } from '@/lib/cruises/hubs';
import { getLineHubStats, getTopCruises, getCruiseLineLogoUrl } from '@/lib/providers/cruises';
import CruiseLineLogo from '@/components/cruises/CruiseLineLogo';
import CruiseHubLayout, { type HubLinkGroup } from '@/components/cruises/hub/CruiseHubLayout';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const line = CRUISE_LINES.find((l) => l.slug === slug);
  if (!line) return {};

  const title = `${line.name} Cruises — Ships, Deals & Expert Advice`;
  const description = `${line.description.split('. ')[0]}. Compare ${line.name} sailings, ships, and cabin fares with a real cruise consultant — call for a free quote.`;
  return {
    title,
    description,
    alternates: { canonical: `/cruises/line/${slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function CruiseLinePage({ params }: PageProps) {
  const { slug } = await params;
  const line = CRUISE_LINES.find((l) => l.slug === slug);
  if (!line) notFound();

  const [stats, cruises] = await Promise.all([
    getLineHubStats(line.name),
    getTopCruises({ cruiseLineName: line.name }),
  ]);
  if (!stats) notFound();

  const faqs = buildLineFaqs(line, stats);
  const ships = SHIPS.filter((s) => s.cruiseLineId === line.id);
  const logoUrl = getCruiseLineLogoUrl(line.name);
  const searchHref = `/cruises?cruiseLine=${encodeURIComponent(line.name)}`;

  const peerLines = CRUISE_LINES.filter((l) => l.slug !== slug && l.luxuryLevel === line.luxuryLevel).slice(0, 6);

  const linkGroups: HubLinkGroup[] = [
    {
      heading: 'Where this line sails',
      links: stats.topDestinations
        .map((name) => ({ label: `${name} cruises`, href: destinationHubPath(name) }))
        .filter((l): l is { label: string; href: string } => l.href !== null),
    },
    {
      heading: 'Similar cruise lines',
      links: peerLines
        .map((l) => ({ label: `${l.name} cruises`, href: lineHubPath(l.name) }))
        .filter((l): l is { label: string; href: string } => l.href !== null),
    },
    {
      heading: 'Keep exploring',
      links: [
        { label: 'All cruises', href: '/cruises' },
        { label: 'Caribbean cruises', href: '/cruises/destination/caribbean' },
        { label: 'Alaska cruises', href: '/cruises/destination/alaska' },
        { label: 'Get a free quote', href: '/get-quote' },
      ],
    },
  ];

  return (
    <CruiseHubLayout
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Cruises', path: '/cruises' },
        { name: line.name, path: `/cruises/line/${slug}` },
      ]}
      eyebrow="Cruise Line"
      title={`${line.name} Cruises`}
      subtitle={`${stats.count.toLocaleString('en-US')} sailings from $${stats.minPriceUSD.toLocaleString('en-US')} per person across ${stats.topDestinations.length}+ regions — with a consultant who knows every ship in the fleet.`}
      intro={[line.description, `What sets ${line.name} apart: ${line.keySellingPoints.join(' · ')}.`]}
      stats={[
        { label: 'Sailings', value: stats.count.toLocaleString('en-US') },
        { label: 'From', value: `$${stats.minPriceUSD.toLocaleString('en-US')} pp` },
        { label: 'Duration', value: `${stats.minNights}–${stats.maxNights} nights` },
        { label: 'Style', value: line.adultsOnly ? 'Adults-only' : line.riverCruise ? 'River' : line.luxuryLevel === 'luxury' ? 'Luxury' : 'Family-friendly' },
      ]}
      cruises={cruises}
      viewAllHref={searchHref}
      viewAllLabel={`All ${line.name} sailings`}
      faqs={faqs}
      ctaPlacement="cruise_line_hub"
      ctaHeading={`Thinking about ${line.name}? Ask someone who has sailed it.`}
      whatsappMessage={`Hi! I'm interested in a ${line.name} cruise.`}
      linkGroups={linkGroups}
    >
      {/* Fleet overview */}
      {ships.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5 gap-4">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <ShipIcon className="w-5 h-5 text-blue-600" /> The {line.name} fleet
            </h2>
            {logoUrl && (
              <div className="bg-white rounded-lg px-3 py-2 hidden sm:block">
                <CruiseLineLogo logoUrl={logoUrl} name={line.name} className="h-6 w-28" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ships.map((ship) => (
              <div key={ship.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{ship.specs.name}</h3>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-500 whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 fill-current" /> {ship.specs.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{ship.description}</p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Guests</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{ship.specs.passengerCapacity.toLocaleString('en-US')}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Launched</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{ship.specs.launchYear}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tonnage</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{ship.specs.tonnage.toLocaleString('en-US')} GT</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </CruiseHubLayout>
  );
}
