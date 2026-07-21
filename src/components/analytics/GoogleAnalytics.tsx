import Script from 'next/script';

/**
 * Loads GA4 / Google Ads with Google Consent Mode v2 defaulting to DENIED, so
 * no analytics or advertising cookies are set until the visitor opts in via the
 * cookie banner (see ConsentBanner). A stored "granted" choice from a previous
 * visit is re-applied immediately. This keeps the site compliant with GDPR /
 * ePrivacy consent-before-tracking requirements.
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const loaderId = measurementId || adsId;
  if (!loaderId) return null;

  const configCalls = [measurementId, adsId]
    .filter(Boolean)
    .map((id) => `gtag('config', '${id}');`)
    .join('\n          ');

  return (
    <>
      <Script id="ga-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });
          try {
            if (document.cookie.split('; ').indexOf('ti_consent=granted') !== -1) {
              gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted'
              });
            }
          } catch (e) {}
          gtag('js', new Date());
          ${configCalls}
        `}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`} strategy="afterInteractive" />
    </>
  );
}
