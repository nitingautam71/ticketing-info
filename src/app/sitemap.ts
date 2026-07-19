import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { DESTINATION_HUBS, portHubPath } from '@/lib/cruises/hubs';
import { CRUISE_LINES } from '@/lib/cruises/cruise-lines';
import { getCruiseFacets } from '@/lib/providers/cruises';

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
  '/trains/senior-citizen-train-ticket-discount',
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

  return [...staticEntries, ...cruiseHubEntries, ...blogEntries];
}
