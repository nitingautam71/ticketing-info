/** Featured content for the /insurance hub — mirrors src/lib/visas/popular.ts. */

/** High-traffic destination ISO2 codes for destination-guide chips and sitemap. */
export const POPULAR_INSURANCE_DESTINATIONS = [
  'US', 'IN', 'FR', 'IT', 'ES', 'DE', 'CH', 'GB', 'AE', 'TH', 'SG', 'JP',
  'ID', 'VN', 'MY', 'AU', 'CA', 'MX', 'TR', 'GR', 'NL', 'PT', 'SA', 'MV',
] as const;

/** Featured (residence → destination) corridors shown on the hub. */
export const FEATURED_QUOTES: { residence: string; destination: string; label: string }[] = [
  { residence: 'IN', destination: 'US', label: 'India → USA' },
  { residence: 'IN', destination: 'FR', label: 'India → Schengen' },
  { residence: 'IN', destination: 'TH', label: 'India → Thailand' },
  { residence: 'IN', destination: 'AE', label: 'India → Dubai' },
  { residence: 'US', destination: 'IT', label: 'USA → Italy' },
  { residence: 'US', destination: 'MX', label: 'USA → Mexico' },
  { residence: 'US', destination: 'JP', label: 'USA → Japan' },
  { residence: 'US', destination: 'IN', label: 'USA → India' },
];

/** Category slugs surfaced as quick links on the hub, in display order. */
export const FEATURED_CATEGORY_SLUGS = [
  'schengen',
  'visitors-insurance-usa',
  'student',
  'senior-citizen',
  'annual-multi-trip',
  'family',
  'cruise',
  'adventure-sports',
  'backpacker',
  'digital-nomad',
  'domestic-india',
  'business',
] as const;
