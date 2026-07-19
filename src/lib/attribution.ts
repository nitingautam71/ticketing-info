// First-party marketing attribution, captured client-side and attached to every
// call/WhatsApp CTA click (see CallClick in prisma/schema.prisma). First touch is
// kept for 90 days so a paid click still gets credit when the visitor returns
// direct a week later and finally calls; last touch always reflects the current
// session's entry.

export const ATTRIBUTION_STORAGE_KEY = 'ti_attribution_v1';
const FIRST_TOUCH_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid', // Google Ads
  'wbraid', // Google Ads (iOS app-to-web)
  'gbraid', // Google Ads (iOS web-to-app)
  'msclkid', // Microsoft Ads
  'fbclid', // Meta
  'ttclid', // TikTok
] as const;

export interface TouchPoint {
  ts: number;
  landingPage: string;
  referrer?: string;
  params: Partial<Record<(typeof TRACKED_PARAMS)[number], string>>;
}

export interface StoredAttribution {
  firstTouch: TouchPoint;
  lastTouch: TouchPoint;
}

/** Pure: pull tracked ad/utm params out of a query string. Exported for tests. */
export function extractTrackedParams(search: string): TouchPoint['params'] {
  const usp = new URLSearchParams(search);
  const params: TouchPoint['params'] = {};
  for (const key of TRACKED_PARAMS) {
    const value = usp.get(key);
    if (value) params[key] = value.slice(0, 200);
  }
  return params;
}

/** Pure: does this navigation start a new marketing touch? Any tracked param or an external referrer counts. */
export function isNewTouch(params: TouchPoint['params'], referrer: string, origin: string): boolean {
  if (Object.keys(params).length > 0) return true;
  if (!referrer) return false;
  try {
    return new URL(referrer).origin !== origin;
  } catch {
    return false;
  }
}

function readStored(): StoredAttribution | null {
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed.firstTouch?.ts || Date.now() - parsed.firstTouch.ts > FIRST_TOUCH_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Record the current page view as a touch point. Runs once per page load from
 * AttributionCapture; safe to call on every navigation (only meaningful touches
 * overwrite lastTouch, and firstTouch is never overwritten while fresh).
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = extractTrackedParams(window.location.search);
    const stored = readStored();
    const touch: TouchPoint = {
      ts: Date.now(),
      landingPage: window.location.pathname + window.location.search.slice(0, 400),
      referrer: document.referrer || undefined,
      params,
    };

    if (!stored) {
      const fresh: StoredAttribution = { firstTouch: touch, lastTouch: touch };
      window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(fresh));
      return;
    }

    if (isNewTouch(params, document.referrer, window.location.origin)) {
      stored.lastTouch = touch;
      window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(stored));
    }
  } catch {
    // localStorage unavailable (private mode, etc.) — attribution is best-effort.
  }
}

export function getStoredAttribution(): StoredAttribution | null {
  if (typeof window === 'undefined') return null;
  return readStored();
}

export interface CallClickPayload {
  channel: 'call' | 'whatsapp';
  placement: string;
  vertical?: string;
  phone?: string;
}

/**
 * Fire-and-forget log of a call/WhatsApp CTA click. Uses sendBeacon so the request
 * survives the immediate tel:/wa.me navigation that follows the click.
 */
export function beaconCallClick(payload: CallClickPayload): void {
  if (typeof window === 'undefined') return;
  try {
    const body = JSON.stringify({
      ...payload,
      page: window.location.pathname,
      attribution: getStoredAttribution() ?? undefined,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/calls', new Blob([body], { type: 'application/json' }));
    } else {
      void fetch('/api/calls', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true });
    }
  } catch {
    // Never let tracking break the actual call.
  }
}
