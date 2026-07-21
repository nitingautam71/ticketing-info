import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { decryptPii } from '@/lib/crypto/pii';
import CustomerEditForm from '@/components/admin/CustomerEditForm';

export const dynamic = 'force-dynamic';

function toDateInput(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : '';
}

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      leads: { orderBy: { createdAt: 'desc' }, take: 20 },
      bookings: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });

  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
        <p className="text-sm text-neutral-400 mt-1">Customer since {customer.createdAt.toLocaleDateString()}</p>
      </div>

      <CustomerEditForm
        customer={{
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone ?? '',
          whatsapp: customer.whatsapp ?? '',
          gender: customer.gender ?? '',
          dob: toDateInput(customer.dob),
          nationality: customer.nationality ?? '',
          passportNumber: decryptPii(customer.passportNumber),
          passportExpiry: toDateInput(customer.passportExpiry),
          visaStatus: decryptPii(customer.visaStatus),
          addressStreet: customer.addressStreet ?? '',
          addressCity: customer.addressCity ?? '',
          addressCountry: customer.addressCountry ?? '',
          addressZip: customer.addressZip ?? '',
          notes: customer.notes ?? '',
        }}
      />

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Lead History ({customer.leads.length})</h2>
        {customer.leads.length === 0 ? (
          <p className="text-sm text-neutral-500">No leads linked yet.</p>
        ) : (
          <div className="space-y-2">
            {customer.leads.map((l) => (
              <div key={l.id} className="flex justify-between items-center text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3">
                <span className="text-emerald-400 font-mono">{l.displayId}</span>
                <span className="text-neutral-300 uppercase">{l.vertical}</span>
                <span className="text-neutral-400">{l.stage}</span>
                <span className="text-neutral-500">{l.createdAt.toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Booking History ({customer.bookings.length})</h2>
        {customer.bookings.length === 0 ? (
          <p className="text-sm text-neutral-500">No bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {customer.bookings.map((b) => (
              <div key={b.id} className="flex justify-between items-center text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3">
                <span className="text-emerald-400 font-mono">{b.displayId}</span>
                <span className="text-white">{b.title}</span>
                <span className="text-neutral-400">{b.status}</span>
                <span className="text-neutral-500">{b.priceEstimate ? `$${b.priceEstimate.toLocaleString()}` : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
