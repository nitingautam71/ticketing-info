import React, { useState, useEffect } from 'react';
import {
  Plane, Hotel, Anchor, Navigation, Car, Compass,
  ShieldCheck, FileText, Bot, User,
  Briefcase, Send, ArrowRight, MapPin, Star, PlayCircle
} from 'lucide-react';
import { Booking, UserProfile as ProfileType } from './types';

// Tab components
import FlightsTab from './components/Tabs/FlightsTab';
import HotelsTab from './components/Tabs/HotelsTab';
import CruisesTab from './components/Tabs/CruisesTab';
import TrainsTab from './components/Tabs/TrainsTab';
import RentalsTab from './components/Tabs/RentalsTab';
import TransfersTab from './components/Tabs/TransfersTab';
import InsuranceTab from './components/Tabs/InsuranceTab';
import VisasTab from './components/Tabs/VisasTab';
import AIPlanner from './components/AIPlanner';
import MyTrips from './components/MyTrips';
import UserProfile from './components/UserProfile';

// Modals
import CheckoutModal from './components/CheckoutModal';

type TabID =
  | 'flights'
  | 'hotels'
  | 'cruises'
  | 'trains'
  | 'rentals'
  | 'transfers'
  | 'insurance'
  | 'visas'
  | 'ai-planner'
  | 'my-trips'
  | 'profile';

/* ------------------------------------------------------------------ */
/* Media library — royalty-free (Pexels video / Unsplash photography)  */
/* ------------------------------------------------------------------ */

const HERO_VIDEO_SOURCES = [
  'https://videos.pexels.com/video-files/4010511/4010511-hd_1920_1080_25fps.mp4',
  'https://www.pexels.com/download/video/4010511/',
];
const HERO_POSTER =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80';

const BAND_VIDEO_SOURCES = [
  'https://www.pexels.com/download/video/1675442/',
];
const BAND_POSTER =
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2000&q=80';

const HERO_COPY: Record<string, { eyebrow: string; title: string; sub: string }> = {
  flights:   { eyebrow: 'Flights',      title: 'The sky is the shortcut.',            sub: 'Compare fares across 500+ airlines and lock in your seat in minutes.' },
  hotels:    { eyebrow: 'Hotels',       title: 'Sleep somewhere worth waking up in.', sub: 'From boutique hideaways to five-star icons — book with free cancellation.' },
  cruises:   { eyebrow: 'Cruises',      title: 'Let the horizon set the pace.',       sub: 'Ocean and river voyages with every port, every cabin class, one search.' },
  trains:    { eyebrow: 'Trains',       title: 'See the country in between.',         sub: 'High-speed rail and scenic routes, booked seat by seat.' },
  rentals:   { eyebrow: 'Car Rentals',  title: 'Your road. Your soundtrack.',         sub: 'Pick up in one city, drop in another — transparent pricing, zero surprises.' },
  transfers: { eyebrow: 'Transfers',    title: 'Land. Step out. Be met.',             sub: 'Private drivers and airport pickups arranged before you take off.' },
  insurance: { eyebrow: 'Insurance',    title: 'Adventure, underwritten.',            sub: 'Cover trips, gear, and health emergencies wherever you roam.' },
  visas:     { eyebrow: 'Visa Checker', title: 'Borders, decoded.',                   sub: 'Instant entry requirements for your passport and destination.' },
};

const TRENDING = [
  { name: 'Maldives',  country: 'Indian Ocean',  price: 899,  img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Santorini', country: 'Greece',        price: 649,  img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Tokyo',     country: 'Japan',         price: 1120, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Paris',     country: 'France',        price: 540,  img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Dubai',     country: 'United Arab Emirates', price: 720, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Bali',      country: 'Indonesia',     price: 830,  img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
];

const EXPERIENCES = [
  { name: 'Beach escapes',    desc: 'Slow mornings, warm water',      img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80' },
  { name: 'City breaks',      desc: 'Skylines, food, late nights',    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Mountain trails',  desc: 'Thin air, wide views',           img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Culture & history',desc: 'Old streets, living stories',    img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80' },
];

/* ------------------------------------------------------------------ */

function HeroVideo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <img
        src={HERO_POSTER}
        alt=""
        aria-hidden="true"
        className="hero-media kenburns"
      />
    );
  }
  return (
    <video
      className="hero-media"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={HERO_POSTER}
      onError={() => setFailed(true)}
    >
      {HERO_VIDEO_SOURCES.map((src) => (
        <source key={src} src={src} type="video/mp4" />
      ))}
    </video>
  );
}

function BandVideo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <img src={BAND_POSTER} alt="" aria-hidden="true" className="hero-media kenburns" />;
  }
  return (
    <video
      className="hero-media"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={BAND_POSTER}
      onError={() => setFailed(true)}
    >
      {BAND_VIDEO_SOURCES.map((src) => (
        <source key={src} src={src} type="video/mp4" />
      ))}
    </video>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabID>('flights');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  // Loading states
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Header scroll state
  const [scrolled, setScrolled] = useState(false);

  // Checkout modal trigger
  const [selectedBookingItem, setSelectedBookingItem] = useState<{
    type: 'flight' | 'hotel' | 'cruise' | 'train' | 'rental' | 'transfer' | 'insurance' | 'visa' | 'package';
    title: string;
    subtitle: string;
    price: number;
    date: string;
    details: any;
  } | null>(null);

  // AI Companion states
  const [bandAIInput, setBandAIInput] = useState('');
  const [initialAIQuery, setInitialAIQuery] = useState<string | undefined>(undefined);

  const handleAISubmit = (query: string) => {
    setInitialAIQuery(query);
    setActiveTab('ai-planner');
    window.scrollTo({ top: 0 });
  };

  const switchTab = (tab: TabID) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  };

  // Init - Fetch data
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchProfile();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCancelBooking = async (id: string) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking itinerary?');
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (updated: ProfileType) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        await fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Nav categories definition
  const mainNavs = [
    { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4 rotate-45" /> },
    { id: 'hotels', label: 'Hotels', icon: <Hotel className="w-4 h-4" /> },
    { id: 'cruises', label: 'Cruises', icon: <Anchor className="w-4 h-4" /> },
    { id: 'trains', label: 'Trains', icon: <Navigation className="w-4 h-4" /> },
    { id: 'rentals', label: 'Car Rentals', icon: <Car className="w-4 h-4" /> },
    { id: 'transfers', label: 'Transfers', icon: <Compass className="w-4 h-4" /> },
    { id: 'insurance', label: 'Insurance', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'visas', label: 'Visa Checker', icon: <FileText className="w-4 h-4" /> },
  ] as const;

  const isBookingTab = ['flights', 'hotels', 'cruises', 'trains', 'rentals', 'transfers', 'insurance', 'visas'].includes(activeTab);
  const hero = HERO_COPY[activeTab] ?? HERO_COPY.flights;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div id="ota_root_layout" className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col font-sans">

      {/* ------------------------------------------------------------ */}
      {/* Fixed header — transparent over hero, glass once scrolled     */}
      {/* ------------------------------------------------------------ */}
      <header
        className={`fixed top-0 inset-x-0 z-50 px-4 md:px-8 h-16 flex items-center justify-between transition-all duration-300 ${
          scrolled || !isBookingTab
            ? 'glass shadow-2xl shadow-black/40'
            : 'bg-transparent border-b border-white/10'
        }`}
      >
        <div className="flex items-center gap-8 flex-1 min-w-0 h-full">
          {/* Logo / Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => switchTab('flights')}
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Plane className="w-5 h-5 text-neutral-950 rotate-45" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">Ticketing-Info</span>
          </div>

          {/* Primary nav */}
          <nav className="hidden lg:flex items-center gap-6 overflow-x-auto scrollbar-none h-full">
            {mainNavs.map((nav) => (
              <button
                key={nav.id}
                onClick={() => switchTab(nav.id)}
                className={`text-[11px] font-bold tracking-widest uppercase transition-all h-full border-b-2 cursor-pointer shrink-0 ${
                  activeTab === nav.id
                    ? 'text-emerald-400 border-emerald-400'
                    : 'text-neutral-200 hover:text-white border-transparent'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right utilities */}
        <div className="flex items-center gap-3 ml-4 shrink-0">
          <button
            onClick={() => switchTab('ai-planner')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'ai-planner'
                ? 'bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/30'
                : 'glass-soft text-white hover:bg-white/15'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Companion</span>
          </button>

          <button
            onClick={() => switchTab('my-trips')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'my-trips'
                ? 'bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/30'
                : 'glass-soft text-white hover:bg-white/15'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden md:inline">My Trips</span>
            {confirmedCount > 0 && (
              <span className="bg-emerald-400 text-neutral-950 text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {confirmedCount}
              </span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-soft rounded-full text-[10px] font-bold text-neutral-100">
            <span>USD</span>
            <span className="w-px h-3 bg-white/20"></span>
            <span>EN</span>
          </div>

          <button
            onClick={() => switchTab('profile')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-neutral-950'
                : 'glass-soft text-white hover:bg-white/15'
            }`}
            title="Profile Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile category rail (below fixed header) */}
      <div className="lg:hidden fixed top-16 inset-x-0 z-40 glass px-4 py-2 flex gap-5 overflow-x-auto scrollbar-none">
        {mainNavs.map((nav) => (
          <button
            key={nav.id}
            onClick={() => switchTab(nav.id)}
            className={`text-[10px] font-bold tracking-widest uppercase whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${
              activeTab === nav.id ? 'text-emerald-400 border-emerald-400' : 'text-neutral-200 border-transparent'
            }`}
          >
            {nav.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Cinematic hero — booking tabs only                            */}
      {/* ------------------------------------------------------------ */}
      {isBookingTab && (
        <section className="relative min-h-[68vh] md:min-h-[76vh] flex items-end overflow-hidden">
          <HeroVideo />
          <div className="hero-scrim absolute inset-0 pointer-events-none" />

          <div className="relative z-10 max-w-7xl w-full mx-auto px-4 md:px-8 pb-44 md:pb-40 pt-40">
            <p className="rise text-emerald-300 text-[11px] font-black tracking-[0.35em] uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-emerald-400/70 inline-block" />
              {hero.eyebrow}
            </p>
            <h1 className="rise rise-1 font-display text-4xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.05] max-w-3xl [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
              {hero.title}
            </h1>
            <p className="rise rise-2 text-neutral-100 text-sm md:text-base mt-5 max-w-xl [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
              {hero.sub}
            </p>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Main content — search deck overlaps the hero bottom           */}
      {/* ------------------------------------------------------------ */}
      <div className={`flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 ${
        isBookingTab ? '-mt-36 md:-mt-32 pb-10' : 'pt-28 lg:pt-24 pb-12'
      }`}>
        <main className="rise rise-3">
          {activeTab === 'flights' && <FlightsTab onSelectBookingItem={setSelectedBookingItem} />}
          {activeTab === 'hotels' && <HotelsTab onSelectBookingItem={setSelectedBookingItem} />}
          {activeTab === 'cruises' && <CruisesTab onSelectBookingItem={setSelectedBookingItem} />}
          {activeTab === 'trains' && <TrainsTab onSelectBookingItem={setSelectedBookingItem} />}
          {activeTab === 'rentals' && <RentalsTab onSelectBookingItem={setSelectedBookingItem} />}
          {activeTab === 'transfers' && <TransfersTab onSelectBookingItem={setSelectedBookingItem} />}
          {activeTab === 'insurance' && <InsuranceTab onSelectBookingItem={setSelectedBookingItem} />}
          {activeTab === 'visas' && <VisasTab onSelectBookingItem={setSelectedBookingItem} />}
          {activeTab === 'ai-planner' && (
            <AIPlanner
              onSelectBookingItem={setSelectedBookingItem}
              initialQuery={initialAIQuery}
              onClearInitialQuery={() => setInitialAIQuery(undefined)}
            />
          )}
          {activeTab === 'my-trips' && (
            <MyTrips bookings={bookings} onCancelBooking={handleCancelBooking} isLoading={bookingsLoading} />
          )}
          {activeTab === 'profile' && (
            <UserProfile profile={profile} onUpdateProfile={handleUpdateProfile} isLoading={profileLoading} />
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Discovery sections — booking tabs only                        */}
      {/* ------------------------------------------------------------ */}
      {isBookingTab && (
        <>
          {/* Trending destinations */}
          <section className="max-w-7xl w-full mx-auto px-4 md:px-8 py-14">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Trending now</p>
                <h2 className="font-display text-3xl md:text-4xl text-white font-medium">Destinations everyone's booking</h2>
              </div>
              <button
                onClick={() => handleAISubmit('Suggest trending destinations for my next trip')}
                className="hidden md:flex items-center gap-2 text-xs font-bold text-neutral-200 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Ask AI for more <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {TRENDING.map((d, i) => (
                <button
                  key={d.name}
                  onClick={() => handleAISubmit(`Plan a trip to ${d.name}, ${d.country}`)}
                  className={`card-media group relative rounded-3xl overflow-hidden text-left cursor-pointer border border-white/10 ${
                    i === 0 ? 'col-span-2 lg:col-span-1 lg:row-span-2 h-64 lg:h-auto' : 'h-64'
                  }`}
                >
                  <img src={d.img} alt={d.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="img-scrim absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="flex items-center gap-1.5 text-neutral-200 text-[10px] font-bold tracking-widest uppercase mb-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {d.country}
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <h3 className="font-display text-2xl text-white">{d.name}</h3>
                      <span className="glass-soft rounded-full px-3 py-1 text-[11px] font-black text-white whitespace-nowrap">
                        from ${d.price}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Experiences */}
          <section className="max-w-7xl w-full mx-auto px-4 md:px-8 py-6 pb-16">
            <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Travel your way</p>
            <h2 className="font-display text-3xl md:text-4xl text-white font-medium mb-8">Pick an experience, we'll do the rest</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {EXPERIENCES.map((e) => (
                <button
                  key={e.name}
                  onClick={() => handleAISubmit(`Plan a ${e.name.toLowerCase()} trip for me`)}
                  className="card-media group relative rounded-3xl overflow-hidden h-80 text-left cursor-pointer border border-white/10"
                >
                  <img src={e.img} alt={e.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="img-scrim absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-xl text-white mb-1">{e.name}</h3>
                    <p className="text-neutral-200 text-xs">{e.desc}</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-emerald-300 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Start planning <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Full-width video band — AI companion */}
          <section className="relative overflow-hidden py-24 md:py-32">
            <BandVideo />
            <div className="absolute inset-0 bg-neutral-950/70" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent" />

            <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center">
              <div className="inline-flex items-center gap-2 glass-soft rounded-full px-4 py-1.5 text-[10px] font-black tracking-[0.25em] uppercase text-emerald-300 mb-6">
                <Bot className="w-3.5 h-3.5" /> AI Travel Assistant
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-white font-medium leading-tight mb-4">
                Describe the trip. Watch it take shape.
              </h2>
              <p className="text-neutral-100 text-sm md:text-base mb-8">
                "Plan a 5-day romantic getaway to Italy under $3,000, flying from LHR" — and the itinerary, flights, and hotels appear.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (bandAIInput.trim()) {
                    handleAISubmit(bandAIInput);
                    setBandAIInput('');
                  }
                }}
                className="max-w-xl mx-auto"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={bandAIInput}
                    onChange={(e) => setBandAIInput(e.target.value)}
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
                {[
                  'Tropical escape in December',
                  'Do I need a visa for Japan?',
                  'Hotels with rooftop pools in Dubai',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleAISubmit(q)}
                    className="glass-soft hover:bg-white/15 rounded-full px-4 py-2 text-xs font-semibold text-neutral-100 transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Trust strip */}
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
        </>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Footer                                                        */}
      {/* ------------------------------------------------------------ */}
      <footer className="border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-neutral-950 rotate-45" />
            </div>
            <span className="font-extrabold text-white text-sm">Ticketing-Info</span>
          </div>

          <div className="flex flex-wrap gap-6 justify-center text-[10px] font-bold text-neutral-300 uppercase tracking-widest">
            <span>&copy; 2026 Ticketing-Info Global</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400">Live systems operational</span>
          </div>
        </div>
      </footer>

      {/* Checkout overlay modal */}
      {selectedBookingItem && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setSelectedBookingItem(null)}
          bookingItem={selectedBookingItem}
          onSuccess={async () => {
            await fetchBookings();
            setActiveTab('my-trips');
          }}
        />
      )}
    </div>
  );
}
