'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureAttribution } from '@/lib/attribution';

// Renders nothing; records marketing touch points (utm/gclid/referrer) on page load
// and on route changes. Reads window.location directly rather than useSearchParams()
// so the root layout doesn't need a Suspense boundary around it.
export default function AttributionCapture() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
  }, [pathname]);

  return null;
}
