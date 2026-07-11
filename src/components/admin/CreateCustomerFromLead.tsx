'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';

export default function CreateCustomerFromLead({ leadId, name, email, phone }: { leadId: string; name: string; email: string | null; phone: string | null }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    if (!email) {
      setError('Needs an email to create a profile');
      return;
    }
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || '', fromLeadId: leadId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to create customer');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
    } finally {
      setIsCreating(false);
    }
  };

  if (error) return <span className="text-[10px] text-red-400">{error}</span>;

  return (
    <button
      onClick={create}
      disabled={isCreating}
      className="text-[10px] text-neutral-500 hover:text-emerald-400 flex items-center gap-1 cursor-pointer disabled:opacity-50"
    >
      <UserPlus className="w-3 h-3" /> {isCreating ? 'Creating...' : 'Create profile'}
    </button>
  );
}
