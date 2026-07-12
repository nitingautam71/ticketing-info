import type { Metadata } from 'next';
import LpPageTemplate from '@/components/lp/LpPageTemplate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Visa Assistance — Documents & Application Help',
  description: 'Get visa assistance from a real consultant — document checklists, application guidance, and appointment help for Indian and international travelers.',
  robots: { index: false, follow: false },
};

const BENEFITS = [
  { title: 'Document checklist, sorted for you', desc: 'We tell you exactly what you need before you start — not after your appointment gets rejected.' },
  { title: 'Support in Hindi & English', desc: 'Explain your situation in whichever language is easier — our consultants handle both.' },
  { title: 'Honest guidance, no false promises', desc: 'We help you apply correctly and completely. No agency can guarantee a visa outcome, and we\'ll never claim otherwise.' },
];

const FAQS = [
  { question: 'Can you guarantee my visa will be approved?', answer: 'No — no agency can guarantee a visa decision; that is made solely by the consulate or embassy. What we do guarantee is a complete, correctly prepared application and clear guidance through the process, which meaningfully reduces avoidable rejections.' },
  { question: 'Which visas do you help with?', answer: 'Tourist, business, and family-visit visas for major destinations, plus OCI card guidance for NRIs and people of Indian origin. Tell us your destination and we\'ll confirm we can help before you commit to anything.' },
  { question: 'How long does the process take?', answer: 'It depends entirely on the destination country\'s current processing times, which we\'ll walk you through for your specific case — some are a few days, others several weeks.' },
  { question: 'What documents will I need?', answer: 'This varies by visa type and destination. Once you share your travel details, we send a specific checklist rather than a generic one.' },
  { question: "Do you handle OCI card or NRI-specific cases?", answer: 'Yes — this is one of our most common requests. Tell us your situation and we\'ll clarify whether OCI or a regular visa applies to your family.' },
];

export default function VisaAssistanceLandingPage() {
  return (
    <LpPageTemplate
      theme="visa-assistance"
      vertical="visa"
      eyebrow="Visa Assistance"
      headline="Visa Assistance From a Real Consultant"
      subhead="Tell us your destination. We'll send a document checklist and guide you through the application — no guesswork, no false promises."
      whatsappMessage="Hi! I'd like visa assistance."
      benefits={BENEFITS}
      faqs={FAQS}
      ctaLabel="Get Free Visa Guidance"
    />
  );
}
