'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LEAD_STAGES, LEAD_STAGE_LABELS, type LeadStage } from '@/lib/leadLifecycle';

export default function LeadStageSelect({ id, stage }: { id: string; stage: string }) {
  const router = useRouter();
  const [value, setValue] = useState(stage);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setValue(next);
    setIsSaving(true);
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: next }),
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
      {LEAD_STAGES.map((s) => (
        <option key={s} value={s}>
          {LEAD_STAGE_LABELS[s as LeadStage]}
        </option>
      ))}
    </select>
  );
}
