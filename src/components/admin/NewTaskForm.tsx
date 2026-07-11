'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface AgentOption {
  id: string;
  name: string;
}

export default function NewTaskForm({ agents }: { agents: AgentOption[] }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate, assignedAgentId }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignedAgentId('');
      router.refresh();
    } catch {
      setError('Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider">New Task</h2>
      <input
        type="text"
        required
        placeholder="e.g. Call customer, Request passport, Issue ticket"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <textarea
        rows={2}
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <select
          value={assignedAgentId}
          onChange={(e) => setAssignedAgentId(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">Unassigned</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
      >
        <Plus className="w-4 h-4" /> {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
