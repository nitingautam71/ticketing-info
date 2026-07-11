'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteSettingButton({ settingKey }: { settingKey: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const remove = async () => {
    if (!confirm(`Delete setting "${settingKey}"?`)) return;
    setIsSaving(true);
    try {
      await fetch(`/api/admin/settings/${encodeURIComponent(settingKey)}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button onClick={remove} disabled={isSaving} className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer disabled:opacity-50">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
