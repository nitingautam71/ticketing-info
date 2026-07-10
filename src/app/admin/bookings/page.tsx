import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Bookings are created manually by an admin once a lead is confirmed offline (phone, WhatsApp, bank transfer) — there is no online payment yet.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Created</th>
                <th className="p-4">Vertical</th>
                <th className="p-4">Title</th>
                <th className="p-4">Price Estimate</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500 text-sm">
                    No bookings yet. Bookings are created from the Leads tab once a sale is confirmed.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="border-b border-neutral-850 last:border-0 hover:bg-neutral-950/50">
                    <td className="p-4 text-xs text-neutral-400 whitespace-nowrap">{b.createdAt.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase">{b.vertical}</span>
                    </td>
                    <td className="p-4 text-xs text-white">
                      <div className="font-bold">{b.title}</div>
                      {b.subtitle && <div className="text-neutral-400">{b.subtitle}</div>}
                    </td>
                    <td className="p-4 text-xs text-white font-bold">{b.priceEstimate ? `$${b.priceEstimate.toLocaleString()}` : '—'}</td>
                    <td className="p-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-neutral-800 text-neutral-300">{b.status}</span>
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
