export interface NavItem {
  href: string;
  label: string;
}

export const MAIN_NAV: NavItem[] = [
  { href: '/flights', label: 'Flights' },
  { href: '/hotels', label: 'Hotels' },
  { href: '/cruises', label: 'Cruises' },
  { href: '/packages', label: 'Packages' },
  { href: '/cars', label: 'Car Rentals' },
  { href: '/transfers', label: 'Transfers' },
  { href: '/trains', label: 'Trains' },
  { href: '/insurance', label: 'Insurance' },
  { href: '/visas', label: 'Visa Checker' },
];

export const HERO_COPY: Record<string, { eyebrow: string; title: string; sub: string }> = {
  '/': {
    eyebrow: 'Ticketing-Info',
    title: 'The sky is the shortcut.',
    sub: 'Flights, hotels, cruises, cars, and packages — one search, real humans to close the booking.',
  },
  '/flights': { eyebrow: 'Flights', title: 'The sky is the shortcut.', sub: 'Compare fares across hundreds of routes and lock in your seat in minutes.' },
  '/hotels': { eyebrow: 'Hotels', title: 'Sleep somewhere worth waking up in.', sub: 'From boutique hideaways to five-star icons — enquire with free cancellation options.' },
  '/cruises': { eyebrow: 'Cruises', title: 'Let the horizon set the pace.', sub: 'Ocean voyages with every port, every cabin class, one search.' },
  '/packages': { eyebrow: 'Vacation Packages', title: 'One trip, fully assembled.', sub: 'Flights, hotels, transfers, tours, and insurance bundled by our travel consultants.' },
  '/cars': { eyebrow: 'Car Rentals', title: 'Your road. Your soundtrack.', sub: 'Pick up in one city, drop in another — transparent pricing, zero surprises.' },
  '/transfers': { eyebrow: 'Airport Transfers', title: 'Land. Step out. Be met.', sub: 'Private, shared, and luxury transfers arranged before you take off.' },
  '/trains': { eyebrow: 'Trains', title: 'See the country in between.', sub: 'High-speed rail and scenic routes, booked seat by seat.' },
  '/insurance': { eyebrow: 'Insurance', title: 'Adventure, underwritten.', sub: 'Cover trips, gear, and health emergencies wherever you roam.' },
  '/visas': { eyebrow: 'Visa Checker', title: 'Borders, decoded.', sub: 'Instant entry requirements for your passport and destination.' },
};

/** Routes that render the cinematic hero section. Everything else gets a plain header. */
export const HERO_ROUTES = new Set(Object.keys(HERO_COPY));
