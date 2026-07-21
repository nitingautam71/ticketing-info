import { prisma } from '@/lib/db';
import { activeStations, allServices } from '@/lib/trains/engine';
import { stationByCode } from '@/lib/trains/data/stations';
import { TRAIN_OPERATORS } from '@/lib/trains/data/operators';
import TrainOverrideEditor from '@/components/admin/trains/TrainOverrideEditor';

export const dynamic = 'force-dynamic';

async function loadTrainAdminData() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [overrides, totalSearches, corridorGroups, zeroResultGroups] = await Promise.all([
    prisma.trainServiceOverride.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.trainSearchLog.count({ where: { createdAt: { gte: since } } }),
    prisma.trainSearchLog.groupBy({
      by: ['fromCode', 'toCode'],
      where: { createdAt: { gte: since }, results: { gt: 0 } },
      _count: { _all: true },
      orderBy: { _count: { fromCode: 'desc' } },
      take: 10,
    }),
    prisma.trainSearchLog.groupBy({
      by: ['fromQuery', 'toQuery'],
      where: { createdAt: { gte: since }, results: 0 },
      _count: { _all: true },
      orderBy: { _count: { fromQuery: 'desc' } },
      take: 10,
    }),
  ]);
  return { overrides, totalSearches, corridorGroups, zeroResultGroups };
}

export default async function AdminTrainsPage() {
  const { overrides, totalSearches, corridorGroups, zeroResultGroups } = await loadTrainAdminData();
  const services = allServices();
  const stations = activeStations();
  const trains = services.map((s) => ({ slug: s.slug, name: s.name })).sort((a, b) => a.name.localeCompare(b.name));
  const liveOperators = TRAIN_OPERATORS.filter((o) => o.enabled);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Amtrak Rail Services</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Post disruption and suspension notices against bundled Amtrak timetables (notices always win, cached 60s) and watch what travellers are searching.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Searches · last 30 days</p>
          <p className="text-2xl font-black text-white mt-1">{totalSearches}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Active notices</p>
          <p className="text-2xl font-black text-white mt-1">{overrides.length}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Active timetable</p>
          <p className="text-sm font-bold text-white mt-1 leading-snug">{services.length} services · {stations.length} stations</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Live networks</p>
          <p className="text-sm font-bold text-white mt-1 leading-snug">{liveOperators.map((o) => o.name).join(' · ')}</p>
        </div>
      </div>

      {/* Operator registry — enable additional networks via configuration */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-bold text-white">Operators</h2>
          <p className="text-[10px] text-neutral-500">Enable a network by setting <code className="text-neutral-300">enabled: true</code> in src/lib/trains/data/operators.ts — no other code change.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TRAIN_OPERATORS.map((o) => (
            <div key={o.id} className="flex items-center justify-between bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5">
              <div>
                <p className="text-xs font-bold text-white">{o.name}</p>
                <p className="text-[10px] text-neutral-500">{o.country === 'CA' ? 'Canada' : 'United States'}</p>
              </div>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider border px-2.5 py-1 rounded-full ${
                  o.enabled ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900' : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                }`}
              >
                {o.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {corridorGroups.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-sm font-bold text-white">Top corridors · last 30 days</h2>
          <div className="space-y-2">
            {corridorGroups.map((g) => {
              const from = g.fromCode ? stationByCode(g.fromCode) : undefined;
              const to = g.toCode ? stationByCode(g.toCode) : undefined;
              return (
                <div key={`${g.fromCode}-${g.toCode}`} className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">
                    {from ? `${from.city} (${from.code})` : (g.fromCode ?? '—')} → {to ? `${to.city} (${to.code})` : (g.toCode ?? '—')}
                  </span>
                  <span className="text-neutral-500 font-mono">{g._count._all}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {zeroResultGroups.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-6 space-y-3">
          <h2 className="text-sm font-bold text-amber-200">Searches with no results — coverage gaps worth filling</h2>
          <div className="space-y-2">
            {zeroResultGroups.map((g) => (
              <div key={`${g.fromQuery}-${g.toQuery}`} className="flex items-center justify-between text-xs">
                <span className="text-amber-100/90">{g.fromQuery} → {g.toQuery}</span>
                <span className="text-amber-300/60 font-mono">{g._count._all}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-amber-200/60 leading-relaxed">
            Add the missing service to src/lib/trains/data/services-*.ts (or the station to stations.ts) and ship a PR — the corridor page appears on the next deploy.
          </p>
        </div>
      )}

      <TrainOverrideEditor
        overrides={overrides.map((o) => ({
          id: o.id,
          trainSlug: o.trainSlug,
          status: o.status,
          notes: o.notes,
          updatedAt: o.updatedAt.toISOString(),
        }))}
        trains={trains}
      />
    </div>
  );
}
