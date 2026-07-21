'use client';

import { useEffect, useState } from 'react';

/**
 * GDPR / ePrivacy cookie-consent banner. Non-essential tracking (GA4 + Google
 * Ads) defaults to DENIED via Consent Mode in GoogleAnalytics; this banner is
 * how the visitor grants or refuses it. The choice is stored in the `ti_consent`
 * cookie for a year and pushed to Google Consent Mode via `gtag('consent',
 * 'update', …)` so tags react without a page reload.
 */

const CONSENT_COOKIE = 'ti_consent';

type Gtag = (...args: unknown[]) => void;

function setConsentCookie(value: 'granted' | 'denied') {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${oneYear}; SameSite=Lax`;
}

function hasStoredChoice() {
  return document.cookie.split('; ').some((c) => c.startsWith(`${CONSENT_COOKIE}=`));
}

function updateGoogleConsent(granted: boolean) {
  const state = granted ? 'granted' : 'denied';
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  }
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasStoredChoice()) setVisible(true);
  }, []);

  function choose(granted: boolean) {
    setConsentCookie(granted ? 'granted' : 'denied');
    updateGoogleConsent(granted);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900/95 backdrop-blur p-4 md:p-5 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <p className="text-sm text-neutral-300 flex-1">
          We use cookies to analyze traffic and measure our ads. Analytics and advertising cookies load
          only if you accept. See our{' '}
          <a href="/legal/privacy" className="underline hover:text-white">privacy policy</a>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => choose(false)}
            className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-300 border border-neutral-700 hover:bg-neutral-800 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-neutral-950 bg-white hover:bg-neutral-200 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
