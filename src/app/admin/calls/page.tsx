import Link from 'next/link';
import { prisma } from '@/lib/db';
import type { StoredAttribution } from '@/lib/attribution';

export const dynamic = 'force-dynamic';

const CHANNEL_FILTERS = ['all', 'call', 'whatsapp'] as const;

function describeSource(attribution: StoredAttribution | null): string {
  const touch = attribution?.lastTouch ?? attribution?.firstTouch;
  if (!touch) return 'unknown';
  const p = touch.params;
  if (p.gclid || (p.utm_source === 'google' && p.utm_medium === 'cpc')) return `Google Ads${p.utm_campaign ? ` · ${p.utm_campaign}` : ''}`;
  if (p.msclkid) return `Microsoft Ads${p.utm_campaign ? ` · ${p.utm_campaign}` : ''}`;
  if (p.fbclid) return 'Meta';
  if (p.utm_source) return `${p.utm_source}${p.utm_medium ? ` / ${p.utm_medium}` : ''}${p.utm_campaign ? ` · ${p.utm_campaign}` : ''}`;
  if (touch.referrer) {
    try {
      return `Organic · ${new URL(touch.referrer).hostname.replace(/^www\./, '')}`;
    } catch {
      return 'Referral';
    }
  }
  return 'Direct';
}

async function loadCallClicks(filter: string) {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [clicks, totalThirtyDays, byPlacement] = await Promise.all([
    prisma.callClick.findMany({
      where: filter === 'all' ? {} : { channel: filter },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.callClick.count({ where: { createdAt: { gte: since } } }),
    prisma.callClick.groupBy({
      by: ['placement'],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { placement: 'desc' } },
      take: 6,
    }),
  ]);
  return { clicks, totalThirtyDays, byPlacement };
}

export default async function AdminCallsPage({ searchParams }: { searchParams: Promise<{ channel?: string }> }) {
  const { channel } = await searchParams;
  const filter = channel && (CHANNEL_FILTERS as readonly string[]).includes(channel) ? channel : 'all';

  const { clicks, totalThirtyDays, byPlacement } = await loadCallClicks(filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Call Clicks</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Every call and WhatsApp CTA click with its marketing attribution. Join these against actual answered calls to compute campaign-level cost per call.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Clicks · 30 days</span>
          <span className="text-2xl font-black text-white">{totalThirtyDays.toLocaleString('en-US')}</span>
        </div>
        {byPlacement.slice(0, 3).map((row) => (
          <div key={row.placement} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider truncate">{row.placement}</span>
            <span className="text-2xl font-black text-white">{row._count._all.toLocaleString('en-US')}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {CHANNEL_FILTERS.map((c) => (
          <Link
            key={c}
            href={c === 'all' ? '/admin/calls' : `/admin/calls?channel=${c}`}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap capitalize ${
              filter === c ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">When</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Placement</th>
                <th className="p-4">Page</th>
                <th className="p-4">Vertical</th>
                <th className="p-4">Source</th>
              </tr>
            </thead>
            <tbody>
              {clicks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 text-sm">
                    No call clicks recorded yet.
                  </td>
                </tr>
              ) : (
                clicks.map((click) => (
                  <tr key={click.id} className="border-b border-neutral-850 last:border-0 hover:bg-neutral-950/50 align-top">
                    <td className="p-4 text-xs text-neutral-400 whitespace-nowrap">
                      {click.createdAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          click.channel === 'call'
                            ? 'bg-blue-950/60 text-blue-400 border-blue-900'
                            : 'bg-emerald-950/60 text-emerald-400 border-emerald-900'
                        }`}
                      >
                        {click.channel}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-neutral-300 whitespace-nowrap">{click.placement}</td>
                    <td className="p-4 text-xs text-neutral-400 max-w-[220px] truncate">{click.page}</td>
                    <td className="p-4 text-xs text-neutral-400">{click.vertical ?? '—'}</td>
                    <td className="p-4 text-xs text-neutral-300 whitespace-nowrap">
                      {describeSource(click.attribution as unknown as StoredAttribution | null)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
