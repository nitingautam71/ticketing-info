import type { Metadata } from 'next';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import ContactChannelLink from '@/components/ContactChannelLink';
import { telLink, whatsappLink, businessPhoneDisplay } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contact Us — Flight, Train & Visa Booking Support',
  description:
    'Get in touch about flight tickets, train tickets, tour packages, or visa assistance by phone, WhatsApp, or message — our travel consultants respond fast.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us — Flight, Train & Visa Booking Support | Ticketing-Info',
    description: 'Get in touch about flight tickets, train tickets, tour packages, or visa assistance by phone, WhatsApp, or message.',
  },
};

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || '';

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <div className="mb-10">
        <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Get in touch</p>
        <h1 className="font-display text-4xl md:text-5xl text-white font-medium">We&apos;re a message away</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <ContactChannelLink href={telLink()} event="click_to_call" className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Call Us</p>
              <p className="text-xs text-neutral-400">{businessPhoneDisplay() || 'Add your business phone number'}</p>
            </div>
          </ContactChannelLink>

          <ContactChannelLink
            href={whatsappLink("Hi! I'd like to get in touch.")}
            target="_blank"
            rel="noopener noreferrer"
            event="whatsapp_click"
            className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">WhatsApp</p>
              <p className="text-xs text-neutral-400">Fastest way to reach us during business hours</p>
            </div>
          </ContactChannelLink>

          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Email</p>
                <p className="text-xs text-neutral-400">{email}</p>
              </div>
            </a>
          )}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
