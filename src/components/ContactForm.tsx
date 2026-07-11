'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) throw new Error('Failed');
      setIsSubmitted(true);
    } catch {
      setError('Something went wrong. Please email or call us directly instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        <h3 className="text-lg font-bold text-white">Message sent</h3>
        <p className="text-neutral-400 text-sm max-w-sm">We&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Full Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">Subject</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">Message</label>
        <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none" />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50">
        {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>
          <Send className="w-4 h-4" /> Send Message
        </>}
      </button>
    </form>
  );
}
