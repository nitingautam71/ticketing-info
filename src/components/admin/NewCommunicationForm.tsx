'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { COMM_CHANNELS } from '@/lib/communications';

const CHANNEL_LABELS: Record<string, string> = {
  call: 'Call',
  email: 'Email',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  internal_note: 'Internal Note',
};

export default function NewCommunicationForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [channel, setChannel] = useState<(typeof COMM_CHANNELS)[number]>('internal_note');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, content, leadId }),
      });
      setContent('');
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {COMM_CHANNELS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChannel(c)}
            className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase cursor-pointer transition-colors ${
              channel === c ? 'bg-emerald-600 text-white' : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {CHANNEL_LABELS[c]}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <textarea
          rows={2}
          placeholder="Log a call, message, or internal note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
