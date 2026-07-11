import Link from 'next/link';
import { prisma } from '@/lib/db';
import LeadStageSelect from '@/components/admin/LeadStageSelect';
import LeadAgentSelect from '@/components/admin/LeadAgentSelect';
import CreateCustomerFromLead from '@/components/admin/CreateCustomerFromLead';
import { LEAD_STAGES, LEAD_STAGE_LABELS, LEAD_SOURCE_LABELS, type LeadStage, type LeadSource } from '@/lib/leadLifecycle';

export const dynamic = 'force-dynamic';

const STAGE_FILTERS = ['all', ...LEAD_STAGES] as const;

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-950/60 text-red-400 border-red-900',
  high: 'bg-amber-950/60 text-amber-400 border-amber-900',
  normal: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  low: 'bg-neutral-900 text-neutral-500 border-neutral-800',
};

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
  const { stage } = await searchParams;
  const filter = stage && (STAGE_FILTERS as readonly string[]).includes(stage) ? stage : 'all';

  const [leads, agents] = await Promise.all([
    prisma.lead.findMany({
      where: filter === 'all' ? {} : { stage: filter as LeadStage },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.agent.findMany({ where: { active: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <p className="text-sm text-neutral-400 mt-1">Every call click, WhatsApp click, and enquiry form submission lands here.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STAGE_FILTERS.map((s) => (
          <Link
            key={s}
            href={s === 'all' ? '/admin/leads' : `/admin/leads?stage=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${
              filter === s ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            {s === 'all' ? 'All' : LEAD_STAGE_LABELS[s as LeadStage]}
          </Link>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Lead ID</th>
                <th className="p-4">Received</th>
                <th className="p-4">Vertical</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Source</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Agent</th>
                <th className="p-4">Stage</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500 text-sm">
                    No leads yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-neutral-850 last:border-0 hover:bg-neutral-950/50 align-top">
                    <td className="p-4 text-xs text-emerald-400 font-mono whitespace-nowrap">
                      <Link href={`/admin/leads/${lead.id}`} className="hover:text-emerald-300 hover:underline">
                        {lead.displayId}
                      </Link>
                    </td>
                    <td className="p-4 text-xs text-neutral-400 whitespace-nowrap">{lead.createdAt.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase">{lead.vertical}</span>
                    </td>
                    <td className="p-4 text-xs text-white">
                      <div className="font-bold">{lead.name}</div>
                      {lead.email && <div className="text-neutral-400">{lead.email}</div>}
                      {lead.phone && <div className="text-neutral-400">{lead.phone}</div>}
                      {lead.message && <div className="text-neutral-500 mt-1 max-w-xs truncate">{lead.message}</div>}
                      <div className="mt-1.5">
                        {lead.customerId ? (
                          <Link href={`/admin/customers/${lead.customerId}`} className="text-[10px] text-emerald-400 hover:text-emerald-300">
                            View profile →
                          </Link>
                        ) : (
                          <CreateCustomerFromLead leadId={lead.id} name={lead.name} email={lead.email} phone={lead.phone} />
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-neutral-400">{LEAD_SOURCE_LABELS[lead.source as LeadSource] ?? lead.source}</td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${PRIORITY_COLORS[lead.priority] ?? PRIORITY_COLORS.normal}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <LeadAgentSelect id={lead.id} assignedAgentId={lead.assignedAgentId} agents={agents} />
                    </td>
                    <td className="p-4">
                      <LeadStageSelect id={lead.id} stage={lead.stage} />
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
