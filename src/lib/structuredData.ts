const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

type Faq = { question: string; answer: string };
type BreadcrumbItem = { name: string; path: string };
type ArticleLike = {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
};

export function travelAgencyJsonLd() {
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || undefined;
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || undefined;
  const state = process.env.NEXT_PUBLIC_BUSINESS_STATE || undefined;
  const country = process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || undefined;

  const address =
    state || country
      ? {
          '@type': 'PostalAddress',
          ...(state ? { addressRegion: state } : {}),
          ...(country ? { addressCountry: country } : {}),
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Ticketing-Info',
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    image: `${siteUrl}/favicon.png`,
    description:
      'Ticketing-Info helps domestic Indian and international travelers book flight tickets, train tickets, hotels, tour packages, and visa assistance with a real travel consultant.',
    priceRange: '$$',
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(address ? { address } : {}),
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United States' },
    ],
    sameAs: [],
  };
}

export function travelAgencyJsonLdWithRatings(testimonials: { rating: number }[]) {
  const base = travelAgencyJsonLd();
  if (testimonials.length === 0) return base;

  const count = testimonials.length;
  const average = testimonials.reduce((sum, t) => sum + t.rating, 0) / count;

  return {
    ...base,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Math.round(average * 10) / 10,
      reviewCount: count,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function faqPageJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function articleJsonLd(post: ArticleLike) {
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverImage || undefined,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: 'Ticketing-Info' },
    publisher: {
      '@type': 'Organization',
      name: 'Ticketing-Info',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.png` },
    },
  };
}
