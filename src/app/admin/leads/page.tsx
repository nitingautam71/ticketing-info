import Link from 'next/link';
import { prisma } from '@/lib/db';
import LeadStatusSelect from '@/components/admin/LeadStatusSelect';

export const dynamic = 'force-dynamic';

const STATUS_FILTERS = ['all', 'new', 'contacted', 'quoted', 'converted', 'closed'];

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = status && STATUS_FILTERS.includes(status) ? status : 'all';

  const leads = await prisma.lead.findMany({
    where: filter === 'all' ? {} : { status: filter as any },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <p className="text-sm text-neutral-400 mt-1">Every call click, WhatsApp click, and enquiry form submission lands here.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s}
            href={s === 'all' ? '/admin/leads' : `/admin/leads?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border transition-colors ${
              filter === s ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Received</th>
                <th className="p-4">Vertical</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Via</th>
                <th className="p-4">Message</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 text-sm">
                    No leads yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-neutral-850 last:border-0 hover:bg-neutral-950/50">
                    <td className="p-4 text-xs text-neutral-400 whitespace-nowrap">{lead.createdAt.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase">{lead.vertical}</span>
                    </td>
                    <td className="p-4 text-xs text-white">
                      <div className="font-bold">{lead.name}</div>
                      {lead.email && <div className="text-neutral-400">{lead.email}</div>}
                      {lead.phone && <div className="text-neutral-400">{lead.phone}</div>}
                    </td>
                    <td className="p-4 text-xs text-neutral-400 capitalize">{lead.contactMethod}</td>
                    <td className="p-4 text-xs text-neutral-400 max-w-xs truncate">{lead.message || '—'}</td>
                    <td className="p-4">
                      <LeadStatusSelect id={lead.id} status={lead.status} />
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
