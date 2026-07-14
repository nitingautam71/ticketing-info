'use client';

import Image from 'next/image';
import { Plane, Clock, MapPin, Tag, Flame } from 'lucide-react';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';

// Launch-offer deal cards for the world's busiest international airports.
// Fares are illustrative ESTIMATES (economy round-trip from the listed hub) with a
// promotional 50%-off launch price — final fares are always confirmed by a consultant,
// consistent with the site's lead-gen model. Every Unsplash photo ID below was
// verified to resolve (HTTP 200) before being committed.
interface FlightDeal {
  code: string;
  airport: string;
  city: string;
  country: string;
  blurb: string;
  fromHub: string; // sample origin used for the illustrative fare
  flightTime: string;
  airlines: string[];
  wasPriceUSD: number; // estimated economy round-trip retail
  highlights: string[];
  image: string;
  imageAlt: string;
}

const DEALS: FlightDeal[] = [
  {
    code: 'ATL',
    airport: 'Hartsfield-Jackson Atlanta International Airport',
    city: 'Atlanta',
    country: 'United States',
    blurb: 'The world\'s busiest airport is your gateway to the American South — CNN, Coca-Cola, and the civil-rights history trail all start here.',
    fromHub: 'London (LHR)',
    flightTime: '~9h 20m nonstop',
    airlines: ['Delta Air Lines', 'British Airways', 'Virgin Atlantic'],
    wasPriceUSD: 980,
    highlights: ['Georgia Aquarium & World of Coca-Cola', 'Martin Luther King Jr. National Historical Park', 'Gateway hub to 150+ US domestic routes'],
    image: 'https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?w=800&auto=format&fit=crop&q=60',
    imageAlt: 'Atlanta downtown skyline at dusk',
  },
  {
    code: 'DXB',
    airport: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
    blurb: 'The world\'s busiest international hub — Burj Khalifa views, desert safaris, and duty-free legend, all 4 hours from half the planet.',
    fromHub: 'New Delhi (DEL)',
    flightTime: '~3h 45m nonstop',
    airlines: ['Emirates', 'Air India', 'IndiGo'],
    wasPriceUSD: 420,
    highlights: ['Burj Khalifa & Dubai Mall', 'Desert safari with Bedouin dinner', 'Visa-on-arrival for many nationalities'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=60',
    imageAlt: 'Dubai skyline with Burj Khalifa',
  },
  {
    code: 'HND',
    airport: 'Tokyo Haneda Airport',
    city: 'Tokyo',
    country: 'Japan',
    blurb: 'Tokyo\'s city-center airport puts you 20 minutes from Shibuya Crossing, sushi counters, and the world\'s best-connected rail network.',
    fromHub: 'Singapore (SIN)',
    flightTime: '~7h 10m nonstop',
    airlines: ['Japan Airlines', 'ANA', 'Singapore Airlines'],
    wasPriceUSD: 760,
    highlights: ['Senso-ji Temple & Shibuya Crossing', '20 min by monorail to central Tokyo', 'Visa-waiver for 68 nationalities'],
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=60',
    imageAlt: 'Tokyo street with Tokyo Tower at night',
  },
  {
    code: 'DFW',
    airport: 'Dallas/Fort Worth International Airport',
    city: 'Dallas',
    country: 'United States',
    blurb: 'Bigger than Manhattan, DFW is American Airlines\' fortress hub — Texas BBQ, cowboys, and connections to every corner of the Americas.',
    fromHub: 'London (LHR)',
    flightTime: '~9h 45m nonstop',
    airlines: ['American Airlines', 'British Airways'],
    wasPriceUSD: 1020,
    highlights: ['Fort Worth Stockyards rodeo culture', 'Sixth Floor Museum at Dealey Plaza', 'Onward reach across the whole US & Latin America'],
    image: 'https://images.unsplash.com/photo-1545194445-dddb8f4487c6?w=800&auto=format&fit=crop&q=60',
    imageAlt: 'Dallas skyline at sunset',
  },
  {
    code: 'PVG',
    airport: 'Shanghai Pudong International Airport',
    city: 'Shanghai',
    country: 'China',
    blurb: 'Ride the 431 km/h Maglev into China\'s futuristic mega-city — the Bund, Yu Garden, and the world\'s second-tallest tower await.',
    fromHub: 'Singapore (SIN)',
    flightTime: '~5h 30m nonstop',
    airlines: ['China Eastern Airlines', 'Air China', 'Singapore Airlines'],
    wasPriceUSD: 620,
    highlights: ['The Bund riverfront skyline', 'World\'s fastest commercial train (Maglev)', '15-day visa-free transit for many markets'],
    image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&auto=format&fit=crop&q=60',
    imageAlt: 'Shanghai Pudong skyline with Oriental Pearl Tower',
  },
  {
    code: 'ORD',
    airport: "Chicago O'Hare International Airport",
    city: 'Chicago',
    country: 'United States',
    blurb: 'United\'s global fortress in the heart of the Midwest — deep-dish pizza, The Bean, and one-stop connections across North America.',
    fromHub: 'New Delhi (DEL)',
    flightTime: '~15h nonstop',
    airlines: ['United Airlines', 'Air India', 'American Airlines'],
    wasPriceUSD: 1350,
    highlights: ['Millennium Park & Cloud Gate ("The Bean")', 'Art Institute of Chicago', 'Architecture river cruise'],
    image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&auto=format&fit=crop&q=60',
    imageAlt: 'Chicago skyline and river',
  },
  {
    code: 'LHR',
    airport: 'London Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    blurb: 'Europe\'s busiest gateway — the West End, royal palaces, and same-day rail connections to the whole of Britain.',
    fromHub: 'New York (JFK)',
    flightTime: '~7h nonstop',
    airlines: ['British Airways', 'Virgin Atlantic', 'Delta Air Lines'],
    wasPriceUSD: 890,
    highlights: ['Buckingham Palace & Tower of London', 'West End theatre district', '15 min to Paddington on the Heathrow Express'],
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=60',
    imageAlt: 'London Tower Bridge and skyline',
  },
  {
    code: 'BKK',
    airport: 'Bangkok Suvarnabhumi Airport',
    city: 'Bangkok',
    country: 'Thailand',
    blurb: 'Southeast Asia\'s street-food capital — golden temples, floating markets, and the launchpad to Thailand\'s islands.',
    fromHub: 'Dubai (DXB)',
    flightTime: '~6h 15m nonstop',
    airlines: ['Thai Airways', 'Emirates'],
    wasPriceUSD: 540,
    highlights: ['Grand Palace & Wat Arun', 'Chatuchak weekend market', 'Easy hops to Phuket, Krabi & Koh Samui'],
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=60',
    imageAlt: 'Bangkok temple at sunset',
  },
  {
    code: 'DEL',
    airport: 'Indira Gandhi International Airport',
    city: 'New Delhi',
    country: 'India',
    blurb: 'India\'s largest hub and the doorway to the Golden Triangle — Old Delhi\'s bazaars, the Taj Mahal, and Jaipur\'s forts within reach.',
    fromHub: 'London (LHR)',
    flightTime: '~8h 30m nonstop',
    airlines: ['Air India', 'British Airways', 'Vistara'],
    wasPriceUSD: 820,
    highlights: ['Red Fort & Chandni Chowk', 'Day trip to the Taj Mahal (Agra)', 'e-Visa available for 170+ nationalities'],
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=60',
    imageAlt: 'India Gate, New Delhi',
  },
];

export default function FeaturedFlightDeals() {
  const { open } = useBookingEnquiry();

  const claim = (deal: FlightDeal) => {
    const offerPrice = Math.round(deal.wasPriceUSD / 2);
    open({
      vertical: 'flight',
      title: `50% OFF launch fare — ${deal.city} (${deal.code})`,
      subtitle: `${deal.airport} • from ${deal.fromHub} • Economy round-trip`,
      price: offerPrice,
      date: 'Flexible',
      details: {
        promotion: '50% off launch offer',
        destinationAirport: `${deal.airport} (${deal.code})`,
        city: deal.city,
        country: deal.country,
        sampleOrigin: deal.fromHub,
        typicalFlightTime: deal.flightTime,
        airlines: deal.airlines,
        estimatedRetailUSD: deal.wasPriceUSD,
        offerPriceUSD: offerPrice,
        note: 'Estimated economy round-trip fare; exact routing, dates, and final price confirmed by a consultant.',
      },
    });
  };

  return (
    <section className="mt-12 space-y-5">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-sky-400" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">50% Off Launch Fares — The World&apos;s Busiest Airports</h2>
      </div>
      <p className="text-neutral-400 text-xs -mt-3">
        Limited-time half-price estimated fares to nine flagship hubs. Claim a deal and a consultant locks in your dates and final price.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEALS.map((deal) => {
          const offerPrice = Math.round(deal.wasPriceUSD / 2);
          return (
            <div
              key={deal.code}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:border-sky-800 transition-colors flex flex-col group"
            >
              <div className="h-44 relative bg-neutral-950">
                <Image
                  src={deal.image}
                  alt={deal.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-sky-600 px-2.5 py-1 rounded-full text-[11px] text-white font-black uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3" /> 50% OFF
                </div>
                <div className="absolute bottom-3 right-4 bg-neutral-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-lg font-black text-white tracking-widest">
                  {deal.code}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">{deal.city}, {deal.country}</h3>
                  <p className="text-[11px] text-neutral-500 flex items-center gap-1 -mt-1">
                    <MapPin className="w-3 h-3 shrink-0" /> {deal.airport}
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed">{deal.blurb}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-400 pt-1">
                    <span className="flex items-center gap-1"><Plane className="w-3 h-3" /> from {deal.fromHub}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {deal.flightTime}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">{deal.airlines.join(' · ')}</p>

                  <ul className="space-y-1 pt-1">
                    {deal.highlights.map((h) => (
                      <li key={h} className="text-[11px] text-neutral-300 flex items-start gap-1.5">
                        <span className="text-sky-400 mt-0.5">✓</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-neutral-800/60 pt-3 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-neutral-500 line-through">was ~${deal.wasPriceUSD.toLocaleString()} est.</p>
                    <p className="text-lg font-black text-white">
                      ${offerPrice.toLocaleString()} <span className="text-[10px] font-semibold text-neutral-400">round-trip est.</span>
                    </p>
                  </div>
                  <button
                    onClick={() => claim(deal)}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                  >
                    Claim 50% Off
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-neutral-600 text-[10px] leading-relaxed">
        Fares are estimated economy round-trips from the listed sample origin and vary by date and availability. The 50% launch
        discount applies to the estimated retail fare; your consultant confirms the final routed price before any payment.
      </p>
    </section>
  );
}
