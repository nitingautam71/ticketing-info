'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentActiveToggle({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const toggle = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/admin/agents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      });
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={isSaving}
      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase cursor-pointer disabled:opacity-50 ${
        active ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </button>
  );
}
