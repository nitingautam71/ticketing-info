import Link from 'next/link';
import { Compass, Ship, Anchor } from 'lucide-react';
import { DESTINATION_HUBS } from '@/lib/cruises/hubs';
import { CRUISE_LINES } from '@/lib/cruises/cruise-lines';
import { portHubPath } from '@/lib/cruises/hubs';

// Internal-linking block on /cruises: every hub page is reachable within one
// click of the index, which is what lets the destination/line/port cluster
// get crawled and pass authority around.
export default function CruiseHubLinks({ departurePorts }: { departurePorts: string[] }) {
  const portLinks = departurePorts
    .map((name) => ({ name, href: portHubPath(name) }))
    .filter((p): p is { name: string; href: string } => p.href !== null);

  return (
    <section className="max-w-7xl w-full mx-auto px-4 md:px-8 pb-16">
      <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50 mb-6">Browse cruises your way</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" /> By destination
          </h3>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {DESTINATION_HUBS.map((hub) => (
              <li key={hub.slug}>
                <Link href={`/cruises/destination/${hub.slug}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  {hub.destination}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Ship className="w-4 h-4 text-blue-600" /> By cruise line
          </h3>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {CRUISE_LINES.map((line) => (
              <li key={line.slug}>
                <Link href={`/cruises/line/${line.slug}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  {line.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Anchor className="w-4 h-4 text-blue-600" /> By departure port
          </h3>
          <ul className="space-y-1.5">
            {portLinks.map((port) => (
              <li key={port.href}>
                <Link href={port.href} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  Cruises from {port.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
