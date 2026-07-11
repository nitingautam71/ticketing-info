import { prisma } from '@/lib/db';
import NewAgentForm from '@/components/admin/NewAgentForm';
import AgentActiveToggle from '@/components/admin/AgentActiveToggle';

export const dynamic = 'force-dynamic';

export default async function AdminAgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { assignedLeads: true, assignedTasks: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Agents</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Roster of consultants leads and tasks can be assigned to. Deactivate an agent to hide them from assignment
          pickers without losing their history.
        </p>
      </div>

      <NewAgentForm />

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Assigned Leads</th>
                <th className="p-4">Open Tasks</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 text-sm">
                    No agents yet — add your first consultant above.
                  </td>
                </tr>
              ) : (
                agents.map((a) => (
                  <tr key={a.id} className="border-b border-neutral-850 last:border-0 hover:bg-neutral-950/50">
                    <td className="p-4 text-xs text-white font-bold">{a.name}</td>
                    <td className="p-4 text-xs text-neutral-400">{a.email}</td>
                    <td className="p-4 text-xs text-neutral-400">{a.phone || '—'}</td>
                    <td className="p-4 text-xs text-neutral-300">{a._count.assignedLeads}</td>
                    <td className="p-4 text-xs text-neutral-300">{a._count.assignedTasks}</td>
                    <td className="p-4">
                      <AgentActiveToggle id={a.id} active={a.active} />
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
