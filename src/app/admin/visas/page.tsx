import { prisma } from '@/lib/db';
import { countryByCode } from '@/lib/visas/countries';
import VisaOverrideEditor from '@/components/admin/visas/VisaOverrideEditor';

export const dynamic = 'force-dynamic';

async function loadVisaAdminData() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [overrides, totalChecks, corridorGroups] = await Promise.all([
    prisma.visaRuleOverride.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.visaCheckLog.count({ where: { createdAt: { gte: since } } }),
    prisma.visaCheckLog.groupBy({
      by: ['passportCode', 'destinationCode'],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { passportCode: 'desc' } },
      take: 10,
    }),
  ]);
  return { overrides, totalChecks, corridorGroups };
}

export default async function AdminVisasPage() {
  const { overrides, totalChecks, corridorGroups } = await loadVisaAdminData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Visa Rules</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Correct individual passport→destination rules (overrides beat the bundled dataset) and watch what travellers are checking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Checks · last 30 days</p>
          <p className="text-2xl font-black text-white mt-1">{totalChecks}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Active overrides</p>
          <p className="text-2xl font-black text-white mt-1">{overrides.length}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Dataset</p>
          <p className="text-sm font-bold text-white mt-1 leading-snug">199 passports × 199 destinations, bundled + curated</p>
        </div>
      </div>

      {corridorGroups.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4">Top corridors · last 30 days</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {corridorGroups.map((g) => (
              <div key={`${g.passportCode}-${g.destinationCode}`} className="flex items-center justify-between bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5">
                <span className="text-xs font-medium text-neutral-300">
                  {countryByCode(g.passportCode)?.name ?? g.passportCode} → {countryByCode(g.destinationCode)?.name ?? g.destinationCode}
                </span>
                <span className="text-xs font-black text-emerald-400">{g._count._all}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <VisaOverrideEditor
        overrides={overrides.map((o) => ({
          id: o.id,
          passportCode: o.passportCode,
          destinationCode: o.destinationCode,
          category: o.category,
          allowedStayDays: o.allowedStayDays,
          notes: o.notes,
          updatedAt: o.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
