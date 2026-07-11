import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { _count: { select: { bookings: true, leads: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-sm text-neutral-400 mt-1">Permanent customer profiles — passport, preferences, travel history.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Nationality</th>
                <th className="p-4">Leads</th>
                <th className="p-4">Bookings</th>
                <th className="p-4">Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500 text-sm">
                    No customer profiles yet — create one from a lead, or add one directly.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-850 last:border-0 hover:bg-neutral-950/50">
                    <td className="p-4 text-xs text-white font-bold">
                      <Link href={`/admin/customers/${c.id}`} className="hover:text-emerald-400 transition-colors">
                        {c.name}
                      </Link>
                    </td>
                    <td className="p-4 text-xs text-neutral-400">{c.email}</td>
                    <td className="p-4 text-xs text-neutral-400">{c.phone || '—'}</td>
                    <td className="p-4 text-xs text-neutral-400">{c.nationality || '—'}</td>
                    <td className="p-4 text-xs text-neutral-300">{c._count.leads}</td>
                    <td className="p-4 text-xs text-neutral-300">{c._count.bookings}</td>
                    <td className="p-4 text-xs text-emerald-400 font-bold">${c.totalSpend.toLocaleString()}</td>
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
