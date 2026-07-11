import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: { index: false },
  alternates: { canonical: '/legal/privacy' },
};

const LAST_UPDATED = 'July 11, 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <h1 className="font-display text-4xl text-white font-medium mb-2">Privacy Policy</h1>
      <p className="text-neutral-500 text-xs font-mono mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-5 mb-8 text-sm text-amber-200">
        This document was drafted to reflect how Ticketing-Info actually collects and uses data today. It has not been
        reviewed by a licensed attorney and does not constitute legal advice — if you serve customers in jurisdictions
        with specific requirements (e.g. GDPR in the EU/UK, CCPA in California), have counsel confirm this meets those
        obligations before relying on it.
      </div>

      <div className="space-y-8 text-sm text-neutral-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. Who We Are</h2>
          <p>
            This Privacy Policy explains how Ticketing-Info LLC, a Wyoming, USA limited liability company (&quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;), collects, uses, and shares information when you use ticketing-info.org, ticketing-info.com,
            or any related services (the &quot;Service&quot;).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. Information We Collect</h2>
          <p className="mb-2">We collect information you provide directly to us, including:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Your name, email address, and/or phone number, when you submit a booking enquiry or contact form</li>
            <li>The content of any message, enquiry details, or travel preferences you share with us</li>
            <li>Conversation content you send to the AI Travel Planner chat</li>
            <li>Which page you were on when you submitted an enquiry (used to route it to the right context)</li>
          </ul>
          <p className="mt-2">
            We do not currently ask you to create an account, and we do not collect payment card information, since
            the Service does not process online payments.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. How We Use Information</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>To respond to your enquiry and help arrange the travel services you asked about</li>
            <li>To contact you by phone, WhatsApp, email, or the method you used to reach us</li>
            <li>To operate and improve the Service, including troubleshooting and preventing abuse</li>
            <li>To generate a response from the AI Travel Planner when you use that feature</li>
          </ul>
          <p className="mt-2">We do not sell your personal information.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. Third-Party Service Providers</h2>
          <p className="mb-2">We share information with the following categories of service providers, only as needed to operate the Service:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Google (Gemini API)</strong> — if you use the AI Travel Planner, your messages are sent to
              Google&apos;s Gemini API to generate a response. Google processes this content under its own terms.
            </li>
            <li>
              <strong>Neon</strong> — our database provider, which stores enquiry, contact, and content data on our
              behalf.
            </li>
            <li>
              <strong>Vercel</strong> — our hosting provider, which serves the Service and may process technical/server
              log data (e.g. IP address, request metadata) as part of standard web hosting.
            </li>
          </ul>
          <p className="mt-2">
            We do not share your information with third parties for their own marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">5. Cookies</h2>
          <p>
            The public site does not currently set marketing or analytics cookies. A functional session cookie is used
            solely to keep an authenticated administrator signed in to the internal admin dashboard — this cookie is
            not set for, or used to track, ordinary visitors. If we add analytics or marketing cookies in the future,
            we will update this policy and provide appropriate notice/consent controls.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">6. Data Retention</h2>
          <p>
            We retain enquiry and contact information for as long as reasonably necessary to respond to you, complete
            any booking you requested, and maintain business records, after which it may be deleted or anonymized. You
            can request earlier deletion as described below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">7. Your Rights</h2>
          <p>
            You can request access to, correction of, or deletion of the personal information we hold about you by
            emailing us at the address below. We will respond within a reasonable time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">8. Data Security</h2>
          <p>
            We use reasonable technical measures (encrypted transport, access-controlled admin systems) to protect
            your information, but no method of transmission or storage is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">9. Children&apos;s Privacy</h2>
          <p>
            The Service is not directed to children under 13, and we do not knowingly collect personal information
            from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">10. International Users</h2>
          <p>
            Ticketing-Info LLC is based in the United States, and information you provide is processed and stored in
            the United States (and by the service providers listed above, which may process data in other countries).
            By using the Service, you consent to this transfer and processing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will update the &quot;Last updated&quot; date above when
            changes are made.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">12. Contact Us</h2>
          <p>
            Ticketing-Info LLC
            <br />
            Registered agent: Northwest Registered Agent Service Inc, 30 N Gould St Ste N, Sheridan, WY 82801, USA
            <br />
            Email: info@ticketinginfo.com
          </p>
        </section>
      </div>
    </div>
  );
}
