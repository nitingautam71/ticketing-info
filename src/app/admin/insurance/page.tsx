import { prisma } from '@/lib/db';
import { countryByCode } from '@/lib/visas/countries';
import { INSURANCE_PLANS, planById } from '@/lib/insurance/plans';
import { providerById } from '@/lib/insurance/providers';
import PlanOverrideEditor from '@/components/admin/insurance/PlanOverrideEditor';
import PolicyManager from '@/components/admin/insurance/PolicyManager';

export const dynamic = 'force-dynamic';

async function loadInsuranceAdminData() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [overrides, totalQuotes, corridorGroups, topPlanGroups, policies] = await Promise.all([
    prisma.insurancePlanOverride.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.insuranceQuoteLog.count({ where: { createdAt: { gte: since } } }),
    prisma.insuranceQuoteLog.groupBy({
      by: ['residence', 'destination'],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { residence: 'desc' } },
      take: 10,
    }),
    prisma.insuranceQuoteLog.groupBy({
      by: ['topPlanId'],
      where: { createdAt: { gte: since }, topPlanId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { topPlanId: 'desc' } },
      take: 6,
    }),
    prisma.insurancePolicy.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: { claims: { orderBy: { updatedAt: 'desc' } }, customer: { select: { name: true } } },
    }),
  ]);
  return { overrides, totalQuotes, corridorGroups, topPlanGroups, policies };
}

export default async function AdminInsurancePage() {
  const { overrides, totalQuotes, corridorGroups, topPlanGroups, policies } = await loadInsuranceAdminData();

  const planOptions = INSURANCE_PLANS.map((p) => ({
    id: p.id,
    label: `${providerById(p.providerId)?.name ?? p.providerId} — ${p.name}`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Insurance</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Adjust catalog plans (overrides beat the bundled catalog), watch what travellers are quoting, and track policies &amp; claims.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Quotes · last 30 days</p>
          <p className="text-2xl font-black text-white mt-1">{totalQuotes}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Active overrides</p>
          <p className="text-2xl font-black text-white mt-1">{overrides.length}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Policies tracked</p>
          <p className="text-2xl font-black text-white mt-1">{policies.length}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase">Catalog</p>
          <p className="text-sm font-bold text-white mt-1 leading-snug">{INSURANCE_PLANS.length} plans · 13 insurers, bundled + curated</p>
        </div>
      </div>

      {corridorGroups.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-4">Top corridors · last 30 days</h2>
            <div className="space-y-2">
              {corridorGroups.map((g) => (
                <div key={`${g.residence}-${g.destination}`} className="flex items-center justify-between bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5">
                  <span className="text-xs font-medium text-neutral-300">
                    {countryByCode(g.residence)?.name ?? g.residence} → {countryByCode(g.destination)?.name ?? g.destination}
                  </span>
                  <span className="text-xs font-black text-emerald-400">{g._count._all}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-4">Most-recommended plans · last 30 days</h2>
            <div className="space-y-2">
              {topPlanGroups.map((g) => (
                <div key={g.topPlanId} className="flex items-center justify-between bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5">
                  <span className="text-xs font-medium text-neutral-300">{g.topPlanId ? (planById(g.topPlanId)?.name ?? g.topPlanId) : '—'}</span>
                  <span className="text-xs font-black text-emerald-400">{g._count._all}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <PolicyManager
        policies={policies.map((p) => ({
          id: p.id,
          displayId: p.displayId,
          status: p.status,
          providerName: p.providerName,
          planName: p.planName,
          policyNumber: p.policyNumber,
          premium: p.premium,
          currency: p.currency,
          startDate: p.startDate?.toISOString() ?? null,
          endDate: p.endDate?.toISOString() ?? null,
          travellers: p.travellers,
          customerName: p.customer?.name ?? null,
          claims: p.claims.map((c) => ({
            id: c.id,
            displayId: c.displayId,
            status: c.status,
            claimType: c.claimType,
            amountClaimed: c.amountClaimed,
            amountApproved: c.amountApproved,
            currency: c.currency,
            insurerRef: c.insurerRef,
          })),
        }))}
        planOptions={planOptions}
      />

      <PlanOverrideEditor
        plans={planOptions}
        overrides={overrides.map((o) => ({
          id: o.id,
          planId: o.planId,
          active: o.active,
          premiumMultiplier: o.premiumMultiplier,
          notes: o.notes,
          updatedAt: o.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
