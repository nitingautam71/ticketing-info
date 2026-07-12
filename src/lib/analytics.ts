declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

/** Fires a Google Ads conversion event. No-ops if NEXT_PUBLIC_GOOGLE_ADS_ID or the label isn't configured. */
export function trackConversion(label: string | undefined, params?: Record<string, unknown>) {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!adsId || !label) return;
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'conversion', { send_to: `${adsId}/${label}`, ...params });
}
