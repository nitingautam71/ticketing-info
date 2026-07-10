'use client';

import { useState } from 'react';
import { X, Phone, MessageCircle, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { BookingEnquiryItem } from '@/lib/types';
import { telLink, whatsappLink, businessPhoneDisplay } from '@/lib/whatsapp';

function pingLead(item: BookingEnquiryItem, contactMethod: 'call' | 'whatsapp') {
  fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vertical: item.vertical,
      contactMethod,
      name: 'Website visitor',
      message: `Clicked ${contactMethod} on: ${item.title}`,
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : undefined,
      payload: { title: item.title, subtitle: item.subtitle, price: item.price, date: item.date, details: item.details },
    }),
  }).catch(() => {});
}

export default function BookingEnquiryModal({ item, onClose }: { item: BookingEnquiryItem; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enquiryWhatsappText = `Hi! I'd like to enquire about: ${item.title} (${item.subtitle}) — approx $${item.price.toLocaleString()}, ${item.date}.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError('Please provide an email or phone number so we can reach you.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: item.vertical,
          contactMethod: 'form',
          name,
          email,
          phone,
          message,
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : undefined,
          payload: { title: item.title, subtitle: item.subtitle, price: item.price, date: item.date, details: item.details },
        }),
      });
      if (!res.ok) throw new Error('Failed to submit enquiry');
      setIsSubmitted(true);
    } catch {
      setError('Something went wrong submitting your enquiry. Please call or WhatsApp us directly instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-500 w-5 h-5" />
            <h3 className="text-lg font-semibold text-white tracking-tight">Book This</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Item summary */}
          <div className="bg-neutral-950 border border-neutral-800/60 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded-full inline-block mb-2">
              {item.vertical}
            </span>
            <h5 className="text-sm font-bold text-white leading-snug">{item.title}</h5>
            <p className="text-xs text-neutral-400 mt-1">{item.subtitle}</p>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-500 font-mono">Date: {item.date}</span>
              <span className="text-lg font-black text-emerald-400">~${item.price.toLocaleString()}</span>
            </div>
          </div>

          {!isSubmitted ? (
            <>
              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={telLink()}
                  onClick={() => pingLead(item, 'call')}
                  className="flex items-center justify-center gap-2 bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 text-white text-sm font-bold py-3 rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" /> Call {businessPhoneDisplay()}
                </a>
                <a
                  href={whatsappLink(enquiryWhatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => pingLead(item, 'whatsapp')}
                  className="flex items-center justify-center gap-2 bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 text-white text-sm font-bold py-3 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Us
                </a>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                <span className="flex-1 h-px bg-neutral-800" /> or send an enquiry <span className="flex-1 h-px bg-neutral-800" />
              </div>

              {/* Enquiry form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Phone (for callback)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555 000 0000"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Anything else we should know?</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Preferred dates, passenger count, budget, special requests..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] transition-all text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Booking Enquiry
                    </>
                  )}
                </button>
                <p className="text-[10px] text-neutral-500 text-center">
                  No payment is taken online. A travel consultant will contact you to confirm availability and pricing.
                </p>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Enquiry received!</h3>
              <p className="text-neutral-400 text-sm max-w-sm">
                A travel consultant will reach out shortly to confirm availability and pricing. Want it faster? Call or WhatsApp us now.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                <a href={telLink()} className="flex items-center justify-center gap-2 bg-neutral-950 border border-neutral-800 text-white text-sm font-bold py-3 rounded-xl">
                  <Phone className="w-4 h-4 text-emerald-400" /> Call
                </a>
                <a
                  href={whatsappLink(enquiryWhatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-neutral-950 border border-neutral-800 text-white text-sm font-bold py-3 rounded-xl"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp
                </a>
              </div>
              <button onClick={onClose} className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl cursor-pointer transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
