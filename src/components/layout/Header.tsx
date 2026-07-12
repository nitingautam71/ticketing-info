'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Bot, Phone, MessageCircle } from 'lucide-react';
import { MAIN_NAV, HERO_ROUTES } from '@/lib/nav';
import { telLink, whatsappLink, businessPhoneDisplay } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHeroRoute = HERO_ROUTES.has(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLandingPage = pathname?.startsWith('/lp/');

  if (isLandingPage) {
    return (
      <header className="fixed top-0 inset-x-0 z-50 px-4 md:px-8 h-16 flex items-center justify-between glass shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-neutral-900 border border-white/10 rounded-lg flex items-center justify-center shadow-lg shadow-black/30">
            <Plane className="w-5 h-5 text-amber-400 rotate-45" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-white">Ticketing-</span>
            <span className="text-amber-400">info</span>
          </span>
        </div>
        <a
          href={telLink()}
          onClick={() => trackEvent('click_to_call', { source: 'lp_header', page: pathname })}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{businessPhoneDisplay() || 'Call Now'}</span>
        </a>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 px-4 md:px-8 h-16 flex items-center justify-between transition-all duration-300 ${
          scrolled || !isHeroRoute ? 'glass shadow-2xl shadow-black/40' : 'bg-transparent border-b border-white/10'
        }`}
      >
        <div className="flex items-center gap-8 flex-1 min-w-0 h-full">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer shrink-0">
            <div className="w-8 h-8 bg-neutral-900 border border-white/10 rounded-lg flex items-center justify-center shadow-lg shadow-black/30">
              <Plane className="w-5 h-5 text-amber-400 rotate-45" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-white">Ticketing-</span>
              <span className="text-amber-400">info</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 overflow-x-auto scrollbar-none h-full">
            {MAIN_NAV.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                className={`text-[11px] font-bold tracking-widest uppercase transition-all h-full flex items-center border-b-2 cursor-pointer shrink-0 ${
                  pathname === nav.href
                    ? 'text-emerald-400 border-emerald-400'
                    : 'text-neutral-200 hover:text-white border-transparent'
                }`}
              >
                {nav.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5 ml-4 shrink-0">
          <Link
            href="/ai-planner"
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
              pathname === '/ai-planner' ? 'bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/30' : 'glass-soft text-white hover:bg-white/15'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Companion</span>
          </Link>

          <a
            href={whatsappLink("Hi! I'd like help planning a trip.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { source: 'header', page: pathname })}
            className="w-8 h-8 rounded-full flex items-center justify-center glass-soft text-emerald-400 hover:bg-white/15 transition-all"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <a
            href={telLink()}
            onClick={() => trackEvent('click_to_call', { source: 'header', page: pathname })}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{businessPhoneDisplay() || 'Call Now'}</span>
          </a>
        </div>
      </header>

      <div className="lg:hidden fixed top-16 inset-x-0 z-40 glass px-4 py-2 flex gap-5 overflow-x-auto scrollbar-none">
        {MAIN_NAV.map((nav) => (
          <Link
            key={nav.href}
            href={nav.href}
            className={`text-[10px] font-bold tracking-widest uppercase whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${
              pathname === nav.href ? 'text-emerald-400 border-emerald-400' : 'text-neutral-200 border-transparent'
            }`}
          >
            {nav.label}
          </Link>
        ))}
      </div>
    </>
  );
}
