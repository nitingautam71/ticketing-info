'use client';

import { trackEvent } from '@/lib/analytics';

export default function ContactChannelLink({
  href,
  target,
  rel,
  event,
  className,
  children,
}: {
  href: string;
  target?: string;
  rel?: string;
  event: 'click_to_call' | 'whatsapp_click';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target={target} rel={rel} onClick={() => trackEvent(event, { source: 'contact_page' })} className={className}>
      {children}
    </a>
  );
}
