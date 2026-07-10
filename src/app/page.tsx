import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Bot, Send } from 'lucide-react';
import HeroSection from '@/components/layout/HeroSection';
import { BandVideo } from '@/components/layout/HeroVideo';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Ticketing-Info — Flights, Hotels, Cruises, Cars & Vacation Packages',
  description:
    'Search flights, hotels, cruises, car rentals, vacation packages, and airport transfers, then book with a real travel consultant by call, WhatsApp, or enquiry form.',
  alternates: { canonical: '/' },
};

const TRENDING = [
  { name: 'Maldives', country: 'Indian Ocean', price: 899, img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Santorini', country: 'Greece', price: 649, img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Tokyo', country: 'Japan', price: 1120, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Paris', country: 'France', price: 540, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Dubai', country: 'United Arab Emirates', price: 720, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Bali', country: 'Indonesia', price: 830, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
];

const EXPERIENCES = [
  { name: 'Beach escapes', desc: 'Slow mornings, warm water', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80' },
  { name: 'City breaks', desc: 'Skylines, food, late nights', img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Mountain trails', desc: 'Thin air, wide views', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Culture & history', desc: 'Old streets, living stories', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80' },
];

export default function HomePage() {
  const hero = HERO_COPY['/'];

  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />

      <section className="max-w-7xl w-full mx-auto px-4 md:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Trending now</p>
            <h2 className="font-display text-3xl md:text-4xl text-white font-medium">Destinations everyone&apos;s booking</h2>
          </div>
          <Link
            href={`/ai-planner?q=${encodeURIComponent('Suggest trending destinations for my next trip')}`}
            className="hidden md:flex items-center gap-2 text-xs font-bold text-neutral-200 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Ask AI for more →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {TRENDING.map((d, i) => (
            <Link
              key={d.name}
              href={`/ai-planner?q=${encodeURIComponent(`Plan a trip to ${d.name}, ${d.country}`)}`}
              className={`card-media group relative rounded-3xl overflow-hidden text-left cursor-pointer border border-white/10 block ${
                i === 0 ? 'col-span-2 lg:col-span-1 lg:row-span-2 h-64 lg:h-auto' : 'h-64'
              }`}
            >
              <Image
                src={d.img}
                alt={`${d.name}, ${d.country}`}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                priority={i === 0}
                className="object-cover"
              />
              <div className="img-scrim absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-center gap-1.5 text-neutral-200 text-[10px] font-bold tracking-widest uppercase mb-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> {d.country}
                </div>
                <div className="flex items-end justify-between gap-3">
                  <h3 className="font-display text-2xl text-white">{d.name}</h3>
                  <span className="glass-soft rounded-full px-3 py-1 text-[11px] font-black text-white whitespace-nowrap">from ${d.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl w-full mx-auto px-4 md:px-8 py-6 pb-16">
        <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Travel your way</p>
        <h2 className="font-display text-3xl md:text-4xl text-white font-medium mb-8">Pick an experience, we&apos;ll do the rest</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {EXPERIENCES.map((e) => (
            <Link
              key={e.name}
              href={`/ai-planner?q=${encodeURIComponent(`Plan a ${e.name.toLowerCase()} trip for me`)}`}
              className="card-media group relative rounded-3xl overflow-hidden h-80 text-left cursor-pointer border border-white/10 block"
            >
              <Image src={e.img} alt={e.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              <div className="img-scrim absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl text-white mb-1">{e.name}</h3>
                <p className="text-neutral-200 text-xs">{e.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-emerald-300 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Start planning →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-32">
        <BandVideo />
        <div className="absolute inset-0 bg-neutral-950/70" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 glass-soft rounded-full px-4 py-1.5 text-[10px] font-black tracking-[0.25em] uppercase text-emerald-300 mb-6">
            <Bot className="w-3.5 h-3.5" /> AI Travel Assistant
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight mb-4">Describe the trip. Watch it take shape.</h2>
          <p className="text-neutral-100 text-sm md:text-base mb-8">
            &quot;Plan a 5-day romantic getaway to Italy under $3,000, flying from LHR&quot; — and the itinerary, flights, and hotels appear.
          </p>

          <form action="/ai-planner" method="get" className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                name="q"
                placeholder="Where do you want to go?"
                className="w-full glass rounded-full py-4 pl-6 pr-14 text-sm font-semibold text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                aria-label="Ask the AI travel assistant"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2.5 mt-6">
            {['Tropical escape in December', 'Do I need a visa for Japan?', 'Hotels with rooftop pools in Dubai'].map((q) => (
              <Link
                key={q}
                href={`/ai-planner?q=${encodeURIComponent(q)}`}
                className="glass-soft hover:bg-white/15 rounded-full px-4 py-2 text-xs font-semibold text-neutral-100 transition-all cursor-pointer"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl w-full mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { k: '2M+', v: 'Trips booked' },
            { k: '500+', v: 'Airline partners' },
            { k: '190', v: 'Countries covered' },
            { k: '4.8', v: 'Traveler rating', star: true },
          ].map((s) => (
            <div key={s.v} className="glass rounded-3xl p-6 text-center">
              <div className="font-display text-3xl md:text-4xl text-white flex items-center justify-center gap-1.5">
                {s.k}
                {s.star && <Star className="w-5 h-5 text-sand-400 fill-sand-400" />}
              </div>
              <div className="text-neutral-300 text-[11px] font-bold tracking-widest uppercase mt-2">{s.v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
