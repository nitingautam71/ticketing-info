import type { NextConfig } from 'next';

// Content-Security-Policy. This is a *static* policy (no per-request nonce) so
// that pages can stay statically/ISR-rendered — a nonce would force every route
// to dynamic rendering. Next.js App Router emits inline hydration scripts that
// have no stable hash, so `script-src` must permit 'unsafe-inline'; the policy
// still hard-locks the higher-value vectors (object/base/form/frame-ancestors)
// and constrains where scripts, styles, images and beacons may come from.
// Upgrade path: move to a nonce-based CSP via middleware if the app later
// renders dynamically. Google hosts are allowed for GA4 / Google Ads.
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://tagmanager.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.g.doubleclick.net https://www.googleadservices.com",
  "frame-src https://td.doubleclick.net https://www.googletagmanager.com",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig: NextConfig = {
  // Don't advertise the framework in responses (X-Powered-By: Next.js).
  poweredByHeader: false,
  images: {
    // Explicit allowlist instead of a wildcard host: the Next image optimizer
    // makes server-side requests to whatever host is allowed here, so a `**`
    // wildcard turns /_next/image into an open image proxy / SSRF-style fetch
    // primitive. Blog cover images entered in /admin must come from one of
    // these hosts (or be re-hosted on upload).
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'videos.pexels.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'logos.skyscnr.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          // 2-year HSTS, applied to subdomains, and preload-eligible. `preload`
          // only takes effect once the domain is submitted to hstspreload.org;
          // ensure every subdomain is HTTPS-only before submitting.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
