import Link from 'next/link';
import { Plane } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-neutral-900 border border-white/10 rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-amber-400 rotate-45" />
          </div>
          <span className="font-extrabold text-sm">
            <span className="text-white">Ticketing-</span>
            <span className="text-amber-400">info</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-6 justify-center text-[10px] font-bold text-neutral-300 uppercase tracking-widest">
          <span>&copy; {year} Ticketing-Info</span>
          <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400">Live systems operational</span>
        </div>
      </div>
    </footer>
  );
}
