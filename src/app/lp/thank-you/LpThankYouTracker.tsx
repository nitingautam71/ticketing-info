'use client';

import { useEffect } from 'react';
import { trackEvent, trackConversion } from '@/lib/analytics';

export default function LpThankYouTracker({ theme, vertical }: { theme?: string; vertical?: string }) {
  useEffect(() => {
    trackEvent('generate_lead', { method: 'lp_form', theme, vertical, page: 'lp_thank_you' });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD, { theme, vertical });
  }, [theme, vertical]);

  return null;
}
