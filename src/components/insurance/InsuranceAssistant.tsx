'use client';

import { useRef, useState } from 'react';
import { Bot, Loader2, Send, Sparkles } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

const SUGGESTIONS = [
  'Which insurance should I buy for a USA trip from India?',
  'Is travel insurance mandatory for a Schengen visa?',
  'Which plan is best for my parents visiting me in America?',
  'Does travel insurance cover scuba diving in Thailand?',
];

/** Grounded AI Q&A widget — answers come from the same quote engine as the
 * comparison, via /api/insurance/assistant. */
export default function InsuranceAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || loading) return;
    setInput('');
    setLoading(true);
    trackEvent('insurance_assistant_ask');
    const nextMessages: Message[] = [...messages, { sender: 'user', text: q }];
    setMessages(nextMessages);
    try {
      const res = await fetch('/api/insurance/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, history: nextMessages.slice(-6, -1) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { sender: 'assistant', text: data.text ?? data.error ?? 'Something went wrong.' }]);
    } catch {
      setMessages((m) => [...m, { sender: 'assistant', text: 'Network error — please try again.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-600/15 border border-emerald-800/50 flex items-center justify-center">
          <Bot className="w-5 h-5 text-emerald-400" aria-hidden />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">AI Insurance Advisor</h2>
          <p className="text-[11px] text-neutral-500">Recommendations grounded in our live plan catalog — not guesswork.</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="text-[11px] text-neutral-300 hover:text-white bg-neutral-950 border border-neutral-800 hover:border-emerald-800/60 rounded-full px-3.5 py-2 cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" aria-hidden /> {s}
            </button>
          ))}
        </div>
      ) : (
        <div ref={scrollRef} className="max-h-80 overflow-y-auto space-y-3 pr-1" aria-live="polite">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`text-xs leading-relaxed rounded-xl p-3.5 whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-emerald-600/10 border border-emerald-800/40 text-emerald-100 ml-8'
                  : 'bg-neutral-950 border border-neutral-850 text-neutral-300 mr-4'
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden /> Checking the plans…
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={600}
          placeholder="Ask anything — e.g. “Best plan for a 3-week Europe trip with kids?”"
          aria-label="Ask the insurance advisor"
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send question"
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl px-4 flex items-center justify-center cursor-pointer transition-colors"
        >
          <Send className="w-4 h-4" aria-hidden />
        </button>
      </form>
      <p className="text-[10px] text-neutral-600 leading-relaxed">
        AI answers are guidance, not insurance advice; premiums shown are estimates. Plan terms are always confirmed with the insurer before purchase.
      </p>
    </div>
  );
}
