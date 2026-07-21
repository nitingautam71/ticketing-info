import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { DESTINATION_HUBS, portHubPath } from '@/lib/cruises/hubs';
import { CRUISE_LINES } from '@/lib/cruises/cruise-lines';
import { getCruiseFacets } from '@/lib/providers/cruises';
import { VISA_COUNTRIES, countryByCode } from '@/lib/visas/countries';
import { TOP_PASSPORTS } from '@/lib/visas/popular';
import { INSURANCE_PLANS } from '@/lib/insurance/plans';
import { INSURANCE_PROVIDERS } from '@/lib/insurance/providers';
import { CATEGORY_PAGES } from '@/lib/insurance/categories';
import { INSURANCE_GUIDES } from '@/lib/insurance/guides';
import { activeStationsList } from '@/lib/trains/data/stations';
import { railProvider } from '@/lib/providers/trains';
import { allCorridorPairs } from '@/lib/trains/popular';

const PUBLIC_ROUTES = [
  '/',
  '/flights',
  '/hotels',
  '/cruises',
  '/packages',
  '/cars',
  '/transfers',
  '/trains',
  '/insurance',
  '/visas',
  '/ai-planner',
  '/contact',
  '/get-quote',
  '/faq',
  '/blog',
];

// SEO landing pages built for specific high-intent keywords (see SEO-CONTENT-PLAN.md).
const LANDING_PAGE_ROUTES = [
  '/flights/usa-to-india-flight-tickets',
  '/visas/oci-vs-indian-visa-for-nris',
];

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticEntries: MetadataRoute.Sitemap = [...PUBLIC_ROUTES, ...LANDING_PAGE_ROUTES].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : LANDING_PAGE_ROUTES.includes(route) ? 0.9 : 0.8,
  }));

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true, publishedAt: true, createdAt: true },
  });

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt ?? post.createdAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Cruise hub cluster: destination + cruise line pages are static content
  // modules; port pages only exist where the catalog actually has departures.
  const facets = await getCruiseFacets();
  const cruiseHubPaths = [
    ...DESTINATION_HUBS.map((hub) => `/cruises/destination/${hub.slug}`),
    ...CRUISE_LINES.map((line) => `/cruises/line/${line.slug}`),
    ...facets.departurePorts.map((name) => portHubPath(name)).filter((p): p is string => p !== null),
  ];

  const cruiseHubEntries: MetadataRoute.Sitemap = cruiseHubPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Visa cluster: every passport & destination hub, plus the full pair matrix
  // for the passports our traffic actually comes from (~8k URLs). Remaining
  // pairs resolve on demand and get discovered through internal links.
  const visaHubPaths = VISA_COUNTRIES.flatMap((c) => [`/visas/passport/${c.slug}`, `/visas/destination/${c.slug}`]);
  const visaPairPaths = TOP_PASSPORTS.flatMap((code) => {
    const passport = countryByCode(code);
    if (!passport) return [];
    return VISA_COUNTRIES.filter((dest) => dest.code !== passport.code).map((dest) => `/visas/${passport.slug}/${dest.slug}`);
  });

  const hubSet = new Set(visaHubPaths);
  const visaEntries: MetadataRoute.Sitemap = [...visaHubPaths, ...visaPairPaths].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: hubSet.has(path) ? 0.8 : 0.7,
  }));

  // Insurance cluster: trip-type, plan, provider and guide pages are bundled
  // content; destination guides exist for every country (on-demand ISR).
  const insuranceHubPaths = [
    ...CATEGORY_PAGES.map((c) => `/insurance/type/${c.slug}`),
    ...INSURANCE_PLANS.map((p) => `/insurance/plan/${p.slug}`),
    ...INSURANCE_PROVIDERS.map((p) => `/insurance/provider/${p.slug}`),
    '/insurance/guides',
    ...INSURANCE_GUIDES.map((g) => `/insurance/guides/${g.slug}`),
  ];
  const insuranceDestinationPaths = VISA_COUNTRIES.map((c) => `/insurance/destination/${c.slug}`);

  const insuranceHubSet = new Set(insuranceHubPaths);
  const insuranceEntries: MetadataRoute.Sitemap = [...insuranceHubPaths, ...insuranceDestinationPaths].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: insuranceHubSet.has(path) ? 0.8 : 0.7,
  }));
  // Rail cluster: station guides, named-train pages and every city-pair
  // corridor a bundled service actually covers. Corridor pages materialise on
  // demand (ISR), so listing them costs nothing until they're crawled.
  const trainHubPaths = [
    '/trains/passes',
    ...activeStationsList().map((s) => `/trains/station/${s.slug}`),
    ...railProvider.services().map((s) => `/trains/train/${s.slug}`),
  ];
  const trainCorridorPaths = allCorridorPairs().map(({ from, to }) => `/trains/route/${from}/${to}`);

  const trainHubSet = new Set(trainHubPaths);
  const trainEntries: MetadataRoute.Sitemap = [...trainHubPaths, ...trainCorridorPaths].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: trainHubSet.has(path) ? 0.8 : 0.7,
  }));
  return [...staticEntries, ...cruiseHubEntries, ...visaEntries, ...insuranceEntries, ...trainEntries, ...blogEntries];
}
