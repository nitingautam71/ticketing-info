import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import { HeroVideo } from './HeroVideo';

export default function HeroSection({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <section className="relative min-h-[56vh] md:min-h-[62vh] flex items-end overflow-hidden">
      <HeroVideo />
      <div className="hero-scrim absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 md:px-8 pb-20 md:pb-16 pt-40">
        <p className="rise text-emerald-300 text-[11px] font-black tracking-[0.35em] uppercase mb-4 flex items-center gap-2">
          <span className="w-8 h-px bg-emerald-400/70 inline-block" />
          {eyebrow}
        </p>
        <h1 className="rise rise-1 font-display text-4xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.05] max-w-3xl [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
          {title}
        </h1>
        <p className="rise rise-2 text-neutral-100 text-sm md:text-base mt-5 max-w-xl [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">{sub}</p>

        <div className="rise rise-2 flex flex-wrap gap-3 mt-7">
          <Link
            href="/get-quote"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-sm font-bold px-6 py-3.5 rounded-full transition-colors shadow-lg shadow-emerald-500/30 cursor-pointer"
          >
            Get Free Quote <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/ai-planner"
            className="inline-flex items-center gap-2 glass-soft hover:bg-white/15 text-white text-sm font-bold px-6 py-3.5 rounded-full transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" /> Plan My Trip
          </Link>
        </div>
      </div>
    </section>
  );
}
