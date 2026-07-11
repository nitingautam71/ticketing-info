import { prisma } from '@/lib/db';
import NewTaskForm from '@/components/admin/NewTaskForm';
import TaskStatusSelect from '@/components/admin/TaskStatusSelect';

export const dynamic = 'force-dynamic';

export default async function AdminTasksPage() {
  const [tasks, agents] = await Promise.all([
    prisma.task.findMany({
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
      take: 200,
      include: { assignedAgent: { select: { name: true } }, lead: { select: { displayId: true } } },
    }),
    prisma.agent.findMany({ where: { active: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ]);

  const now = new Date();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <p className="text-sm text-neutral-400 mt-1">Internal follow-ups — calls, document requests, ticketing, invoicing.</p>
      </div>

      <NewTaskForm agents={agents} />

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Task</th>
                <th className="p-4">Lead</th>
                <th className="p-4">Due</th>
                <th className="p-4">Agent</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500 text-sm">
                    No tasks yet.
                  </td>
                </tr>
              ) : (
                tasks.map((t) => {
                  const overdue = t.dueDate && t.dueDate < now && t.status !== 'done' && t.status !== 'cancelled';
                  return (
                    <tr key={t.id} className="border-b border-neutral-850 last:border-0 hover:bg-neutral-950/50">
                      <td className="p-4 text-xs text-white">
                        <div className="font-bold">{t.title}</div>
                        {t.description && <div className="text-neutral-400 mt-0.5 max-w-sm">{t.description}</div>}
                      </td>
                      <td className="p-4 text-xs text-emerald-400 font-mono">{t.lead?.displayId || '—'}</td>
                      <td className={`p-4 text-xs whitespace-nowrap ${overdue ? 'text-red-400 font-bold' : 'text-neutral-400'}`}>
                        {t.dueDate ? t.dueDate.toLocaleDateString() : '—'} {overdue && '(overdue)'}
                      </td>
                      <td className="p-4 text-xs text-neutral-300">{t.assignedAgent?.name || '—'}</td>
                      <td className="p-4">
                        <TaskStatusSelect id={t.id} status={t.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
