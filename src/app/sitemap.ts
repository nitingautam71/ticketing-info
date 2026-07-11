import type { MetadataRoute } from 'next';

const PUBLIC_ROUTES = ['/', '/flights', '/hotels', '/cruises', '/packages', '/cars', '/transfers', '/trains', '/insurance', '/visas', '/ai-planner', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return PUBLIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
