import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  DESTINATION_HUBS_BY_SLUG,
  buildDestinationFaqs,
  destinationHubPath,
  lineHubPath,
  portHubPath,
} from '@/lib/cruises/hubs';
import { getDestinationHubStats, getTopCruises, getCruiseFacets } from '@/lib/providers/cruises';
import CruiseHubLayout, { type HubLinkGroup } from '@/components/cruises/hub/CruiseHubLayout';

// On-demand ISR: rendered on first request and cached for an hour. No
// generateStaticParams — build environments (CI, Vercel) must not need a
// reachable database to compile the site.
export const revalidate = 3600;

// Popular with U.S. searchers — the default related-destinations rail.
const FEATURED_DESTINATION_SLUGS = ['caribbean', 'bahamas', 'alaska', 'mexican-riviera', 'hawaii', 'mediterranean', 'panama-canal', 'greek-islands'];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hub = DESTINATION_HUBS_BY_SLUG[slug];
  if (!hub) return {};

  const title = `${hub.destination} Cruises — Deals, Itineraries & Expert Advice`;
  const description = `${hub.intro[0].split('. ')[0]}. Compare sailings, cabins, and current promotions with a real cruise consultant — call for a free quote.`;
  return {
    title,
    description,
    alternates: { canonical: `/cruises/destination/${slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function CruiseDestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const hub = DESTINATION_HUBS_BY_SLUG[slug];
  if (!hub) notFound();

  const [stats, cruises, facets] = await Promise.all([
    getDestinationHubStats(hub.destination),
    getTopCruises({ destination: hub.destination }),
    getCruiseFacets(),
  ]);
  if (!stats) notFound();

  const faqs = buildDestinationFaqs(hub, stats);
  const searchHref = `/cruises?destination=${encodeURIComponent(hub.destination)}`;

  const relatedDestinations = FEATURED_DESTINATION_SLUGS.filter((s) => s !== slug)
    .map((s) => DESTINATION_HUBS_BY_SLUG[s])
    .slice(0, 6);

  const linkGroups: HubLinkGroup[] = [
    {
      heading: 'Popular destinations',
      links: relatedDestinations.map((d) => ({ label: `${d.destination} cruises`, href: `/cruises/destination/${d.slug}` })),
    },
    {
      heading: 'Cruise lines sailing here',
      links: stats.topLines
        .map((name) => ({ label: `${name} cruises`, href: lineHubPath(name) }))
        .filter((l): l is { label: string; href: string } => l.href !== null),
    },
    {
      heading: 'Departure ports',
      links: facets.departurePorts
        .map((name) => ({ label: `Cruises from ${name}`, href: portHubPath(name) }))
        .filter((l): l is { label: string; href: string } => l.href !== null)
        .slice(0, 6),
    },
  ];

  return (
    <CruiseHubLayout
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Cruises', path: '/cruises' },
        { name: `${hub.destination} Cruises`, path: destinationHubPath(hub.destination) ?? '/cruises' },
      ]}
      eyebrow="Cruise Destination"
      title={`${hub.destination} Cruises`}
      subtitle={`${stats.count.toLocaleString('en-US')} sailings from $${stats.minPriceUSD.toLocaleString('en-US')} per person — compared for you by a real consultant, not a checkout page.`}
      intro={hub.intro}
      stats={[
        { label: 'Sailings', value: stats.count.toLocaleString('en-US') },
        { label: 'From', value: `$${stats.minPriceUSD.toLocaleString('en-US')} pp` },
        { label: 'Duration', value: `${stats.minNights}–${stats.maxNights} nights` },
        { label: 'Top line', value: stats.topLines[0] ?? '—' },
      ]}
      cruises={cruises}
      viewAllHref={searchHref}
      viewAllLabel={`All ${hub.destination} sailings`}
      faqs={faqs}
      ctaPlacement="cruise_destination_hub"
      ctaHeading={`Planning a ${hub.destination} cruise? Talk it through first.`}
      whatsappMessage={`Hi! I'm looking for a ${hub.destination} cruise.`}
      linkGroups={linkGroups}
    />
  );
}
