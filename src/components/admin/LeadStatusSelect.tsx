'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STATUSES = ['new', 'contacted', 'quoted', 'converted', 'closed'];

export default function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setValue(next);
    setIsSaving(true);
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
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
      className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white capitalize disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
