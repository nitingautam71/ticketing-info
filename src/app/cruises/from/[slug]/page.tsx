import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, Landmark, Bus, Wallet, ShieldCheck } from 'lucide-react';
import { PORTS } from '@/lib/cruises/ports';
import { buildPortFaqs, destinationHubPath, lineHubPath, portHubPath } from '@/lib/cruises/hubs';
import { getPortHubStats, getTopCruises, getCruiseFacets } from '@/lib/providers/cruises';
import CruiseHubLayout, { type HubLinkGroup } from '@/components/cruises/hub/CruiseHubLayout';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const port = PORTS.find((p) => p.id === slug);
  if (!port) return {};

  const title = `Cruises from ${port.city} (${port.name}) — Deals & Departures`;
  const description = `Compare cruise departures from ${port.name} in ${port.city}: itineraries, fares, and parking-to-pier logistics from a real cruise consultant. Call for a free quote.`;
  return {
    title,
    description,
    alternates: { canonical: `/cruises/from/${slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function CruisePortPage({ params }: PageProps) {
  const { slug } = await params;
  const port = PORTS.find((p) => p.id === slug);
  if (!port) notFound();

  const [stats, cruises, facets] = await Promise.all([
    getPortHubStats(port.name),
    getTopCruises({ departurePortName: port.name }),
    getCruiseFacets(),
  ]);
  if (!stats) notFound();

  const faqs = buildPortFaqs(port, stats);
  const searchHref = `/cruises?departurePort=${encodeURIComponent(port.name)}`;

  const otherPortLinks = facets.departurePorts
    .filter((name) => name !== port.name)
    .map((name) => ({ label: `Cruises from ${name}`, href: portHubPath(name) }))
    .filter((l): l is { label: string; href: string } => l.href !== null)
    .slice(0, 6);

  const linkGroups: HubLinkGroup[] = [
    {
      heading: 'Where these cruises go',
      links: stats.topDestinations
        .map((name) => ({ label: `${name} cruises`, href: destinationHubPath(name) }))
        .filter((l): l is { label: string; href: string } => l.href !== null),
    },
    {
      heading: 'Cruise lines at this port',
      links: stats.topLines
        .map((name) => ({ label: `${name} cruises`, href: lineHubPath(name) }))
        .filter((l): l is { label: string; href: string } => l.href !== null),
    },
    {
      heading: 'Other departure ports',
      links: otherPortLinks,
    },
  ];

  return (
    <CruiseHubLayout
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Cruises', path: '/cruises' },
        { name: `From ${port.city}`, path: `/cruises/from/${slug}` },
      ]}
      eyebrow="Departure Port"
      title={`Cruises from ${port.city}`}
      subtitle={`${stats.count.toLocaleString('en-US')} departures from ${port.name}, sailing to ${stats.topDestinations.slice(0, 3).join(', ')} and beyond — from $${stats.minPriceUSD.toLocaleString('en-US')} per person.`}
      intro={[port.overview, ...(port.history ? [port.history] : [])]}
      stats={[
        { label: 'Departures', value: stats.count.toLocaleString('en-US') },
        { label: 'From', value: `$${stats.minPriceUSD.toLocaleString('en-US')} pp` },
        { label: 'Duration', value: `${stats.minNights}–${stats.maxNights} nights` },
        { label: 'Port code', value: port.code },
      ]}
      cruises={cruises}
      viewAllHref={searchHref}
      viewAllLabel={`All departures from ${port.city}`}
      faqs={faqs}
      ctaPlacement="cruise_port_hub"
      ctaHeading={`Sailing from ${port.city}? Get the local logistics right.`}
      whatsappMessage={`Hi! I'm looking for a cruise from ${port.city}.`}
      linkGroups={linkGroups}
    >
      {/* Port guide */}
      <section>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50 mb-5 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" /> {port.city} port guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-600" /> Before you board
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              {port.thingsToDo.slice(0, 4).map((thing) => (
                <li key={thing}>• {thing}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Bus className="w-4 h-4 text-blue-600" /> Getting to the pier
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{port.transportation}</p>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-600" /> Pre-cruise day budget
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Roughly ${port.estimatedBudgetUSD.toLocaleString('en-US')} per person including meals and local transport.</p>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Accessibility & safety
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {port.accessibility} {port.safety}
              </p>
            </div>
          </div>
        </div>
      </section>
    </CruiseHubLayout>
  );
}
