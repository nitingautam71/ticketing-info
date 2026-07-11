import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalLeads, newLeads, leadsToday, totalBookings, unreadMessages, leadsByVertical] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.booking.count(),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.lead.groupBy({ by: ['vertical'], _count: { vertical: true } }),
  ]);

  const stats = [
    { label: 'Total Leads', value: totalLeads },
    { label: 'New (Unactioned)', value: newLeads },
    { label: 'Leads Today', value: leadsToday },
    { label: 'Bookings', value: totalBookings },
    { label: 'Unread Messages', value: unreadMessages },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-neutral-400 mt-1">Live overview of lead flow and bookings.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-3xl font-black text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Leads by Vertical</h2>
        {leadsByVertical.length === 0 ? (
          <p className="text-sm text-neutral-400">No leads yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {leadsByVertical
              .sort((a, b) => b._count.vertical - a._count.vertical)
              .map((row) => (
                <div key={row.vertical} className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-emerald-400">{row._count.vertical}</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{row.vertical}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
