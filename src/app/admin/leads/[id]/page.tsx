import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import LeadStageSelect from '@/components/admin/LeadStageSelect';
import LeadAgentSelect from '@/components/admin/LeadAgentSelect';
import NewCommunicationForm from '@/components/admin/NewCommunicationForm';
import { LEAD_SOURCE_LABELS, type LeadSource } from '@/lib/leadLifecycle';

export const dynamic = 'force-dynamic';

const CHANNEL_ICONS: Record<string, string> = {
  call: '📞',
  email: '✉️',
  whatsapp: '💬',
  sms: '📱',
  internal_note: '📝',
};

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead, agents] = await Promise.all([
    prisma.lead.findUnique({
      where: { id },
      include: {
        assignedAgent: true,
        customer: true,
        communications: { orderBy: { createdAt: 'desc' } },
        tasks: { orderBy: { createdAt: 'desc' } },
      },
    }),
    prisma.agent.findMany({ where: { active: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ]);

  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-emerald-400 text-xs font-mono mb-1">{lead.displayId}</p>
          <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {lead.vertical} • {LEAD_SOURCE_LABELS[lead.source as LeadSource] ?? lead.source} • {lead.createdAt.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LeadAgentSelect id={lead.id} assignedAgentId={lead.assignedAgentId} agents={agents} />
          <LeadStageSelect id={lead.id} stage={lead.stage} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Communication Timeline</h2>
            <NewCommunicationForm leadId={lead.id} />
            <div className="space-y-3 mt-5">
              {lead.communications.length === 0 ? (
                <p className="text-sm text-neutral-500">No communications logged yet.</p>
              ) : (
                lead.communications.map((c) => (
                  <div key={c.id} className="flex gap-3 bg-neutral-950 border border-neutral-850 rounded-xl p-4">
                    <span className="text-lg leading-none">{CHANNEL_ICONS[c.channel] ?? '•'}</span>
                    <div className="flex-1">
                      <p className="text-xs text-neutral-300">{c.content}</p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-1.5">{c.createdAt.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {lead.message && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Original Enquiry</h2>
              <p className="text-sm text-neutral-300">{lead.message}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Contact</h2>
            <div className="space-y-1.5 text-xs text-neutral-300">
              {lead.email && <p>{lead.email}</p>}
              {lead.phone && <p>{lead.phone}</p>}
              <p className="text-neutral-500 capitalize">Prefers: {lead.contactMethod}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-850">
              {lead.customer ? (
                <Link href={`/admin/customers/${lead.customer.id}`} className="text-xs text-emerald-400 hover:text-emerald-300">
                  View customer profile →
                </Link>
              ) : (
                <p className="text-xs text-neutral-500">No linked customer profile yet.</p>
              )}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Tasks ({lead.tasks.length})</h2>
            {lead.tasks.length === 0 ? (
              <p className="text-xs text-neutral-500">No tasks linked yet — add one from the Tasks page.</p>
            ) : (
              <div className="space-y-2">
                {lead.tasks.map((t) => (
                  <div key={t.id} className="text-xs bg-neutral-950 border border-neutral-850 rounded-lg p-2.5">
                    <p className="text-white font-bold">{t.title}</p>
                    <p className="text-neutral-500 capitalize mt-0.5">{t.status.replace('_', ' ')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
