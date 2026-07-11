'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AgentOption {
  id: string;
  name: string;
}

export default function LeadAgentSelect({ id, assignedAgentId, agents }: { id: string; assignedAgentId: string | null; agents: AgentOption[] }) {
  const router = useRouter();
  const [value, setValue] = useState(assignedAgentId ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setValue(next);
    setIsSaving(true);
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedAgentId: next || null }),
      });
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={isSaving}
      className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white disabled:opacity-50"
    >
      <option value="">Unassigned</option>
      {agents.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name}
        </option>
      ))}
    </select>
  );
}
