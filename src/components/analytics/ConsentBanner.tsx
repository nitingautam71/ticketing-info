'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * GDPR / ePrivacy cookie-consent banner. Non-essential tracking (GA4 + Google
 * Ads) defaults to DENIED via Consent Mode in GoogleAnalytics; this banner is
 * how the visitor grants or refuses it. The choice is stored in the `ti_consent`
 * cookie for a year and pushed to Google Consent Mode via `gtag('consent',
 * 'update', …)` so tags react without a page reload.
 *
 * The stored choice is read through useSyncExternalStore (not an effect), which
 * keeps SSR/hydration consistent — the banner renders nothing on the server and
 * during hydration, then appears on the client only if no choice exists yet.
 */

const CONSENT_COOKIE = 'ti_consent';

type Gtag = (...args: unknown[]) => void;

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

/** Client snapshot: the stored consent value, or null if the visitor hasn't chosen. */
function getChoice(): string | null {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return match ? match.slice(CONSENT_COOKIE.length + 1) : null;
}

/** Server snapshot: non-null so the banner is never server-rendered (avoids a hydration flash). */
function getServerChoice(): string {
  return 'ssr';
}

function setConsentCookie(value: 'granted' | 'denied') {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${oneYear}; SameSite=Lax`;
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
  const choice = useSyncExternalStore(subscribe, getChoice, getServerChoice);

  const choose = useCallback((granted: boolean) => {
    setConsentCookie(granted ? 'granted' : 'denied');
    updateGoogleConsent(granted);
    emitChange();
  }, []);

  if (choice !== null) return null; // already decided (or SSR/hydration) — hide

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
