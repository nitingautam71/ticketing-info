'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function ThankYouTracker({ type }: { type?: string }) {
  useEffect(() => {
    trackEvent('generate_lead', { method: type ?? 'unknown', page: 'thank_you' });
  }, [type]);

  return null;
}
