import type { TravelPackage } from './types';

const SITE_URL = 'https://www.ticketing-info.com';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Builds a schema.org JSON-LD @graph for a package detail page: Organization, Place, TouristTrip/VacationPackage, Offer, BreadcrumbList, FAQPage, and Review/AggregateRating. Computed at render time, not stored statically. */
export function buildPackageSchema(pkg: TravelPackage) {
  const url = `${SITE_URL}${pkg.seo.canonicalUrl}`;
  const placeId = `${url}#place`;

  const organization = {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Ticketing-Info',
    url: SITE_URL,
  };

  const place = {
    '@type': 'Place',
    '@id': placeId,
    name: pkg.destinationName,
    address: { '@type': 'PostalAddress', addressCountry: pkg.country },
    sameAs: pkg.seo.externalLinks.map((l) => l.url),
  };

  const aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: pkg.ratings.overall,
    reviewCount: pkg.ratings.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };

  const reviews = pkg.reviews.slice(0, 10).map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author },
    datePublished: r.date,
    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    name: r.title,
    reviewBody: r.body,
  }));

  const offers = pkg.suggestedFlights.length
    ? {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: pkg.fromPriceUSD,
        availability: 'https://schema.org/InStock',
        url,
        priceValidUntil: undefined,
        description: 'Estimated starting price, solo traveler, budget tier, US origin market. Final pricing confirmed by a travel consultant.',
      }
    : undefined;

  const touristTrip = {
    '@type': ['TouristTrip', 'VacationPackage', 'Product'],
    '@id': url,
    name: pkg.title,
    description: pkg.metaDescription,
    url,
    image: pkg.images.filter((i) => i.role === 'hero' || i.role === 'gallery').map((i) => i.unsplashQuery),
    touristType: pkg.categories,
    itinerary: {
      '@type': 'ItemList',
      itemListElement: pkg.itinerary.map((day) => ({
        '@type': 'ListItem',
        position: day.day,
        name: day.title,
        description: day.description,
      })),
    },
    provider: { '@id': ORGANIZATION_ID },
    subjectOf: { '@id': placeId },
    aggregateRating,
    review: reviews,
    offers,
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Packages', item: `${SITE_URL}/packages` },
      { '@type': 'ListItem', position: 3, name: pkg.destinationName, item: `${SITE_URL}/packages?destination=${pkg.destinationSlug}` },
      { '@type': 'ListItem', position: 4, name: pkg.title, item: url },
    ],
  };

  const faqPage = {
    '@type': 'FAQPage',
    mainEntity: pkg.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, place, touristTrip, breadcrumb, faqPage],
  };
}
