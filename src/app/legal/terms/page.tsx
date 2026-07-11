import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  robots: { index: false },
  alternates: { canonical: '/legal/terms' },
};

const LAST_UPDATED = 'July 11, 2026';

export default function TermsPage() {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <h1 className="font-display text-4xl text-white font-medium mb-2">Terms of Service</h1>
      <p className="text-neutral-500 text-xs font-mono mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-5 mb-8 text-sm text-amber-200">
        This document was drafted to reflect how Ticketing-Info actually operates today. It has not been reviewed by a
        licensed attorney and does not constitute legal advice — in particular, &quot;seller of travel&quot; registration/bonding
        requirements vary by state and country and are not addressed here. Have counsel review this before relying on it
        for anything beyond a good-faith first draft.
      </div>

      <div className="space-y-8 text-sm text-neutral-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. Who We Are</h2>
          <p>
            Ticketing-Info (&quot;Ticketing-Info,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is operated by Ticketing-Info LLC, a limited
            liability company organized under the laws of the State of Wyoming, USA. These Terms of Service (&quot;Terms&quot;)
            govern your access to and use of ticketing-info.org, ticketing-info.com, and any related services
            (collectively, the &quot;Service&quot;). By using the Service, you agree to these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. What the Service Does</h2>
          <p>
            The Service lets you search for flights, hotels, cruises, car rentals, vacation packages, airport transfers,
            trains, and travel insurance, and to submit a booking enquiry by phone, WhatsApp, or an online form. The
            Service does <strong>not</strong> currently process online payments or complete bookings automatically.
            Every enquiry is reviewed and completed by a human travel consultant, who confirms final availability,
            pricing, and terms with you directly before any booking is made.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Pricing Is Indicative</h2>
          <p>
            Prices, availability, and other details shown in search results are indicative estimates generated for
            planning purposes and are not a binding offer. Final pricing, fare rules, and availability are confirmed by
            a consultant once your exact travel dates, passenger details, and preferences are known. No booking is
            confirmed, and no payment obligation arises, until you and a consultant agree on final terms through a
            separate process (phone, WhatsApp, email, or another method the consultant specifies).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. AI Travel Planner</h2>
          <p>
            The AI Travel Planner is an assistant powered by a third-party large language model (Google Gemini). It is
            provided for convenience and inspiration only. It can make mistakes, and its suggestions — including
            itineraries, prices, visa information, and availability — are not verified and are not a substitute for
            confirmation from a human consultant or for official guidance from airlines, hotels, immigration
            authorities, or other relevant bodies. Do not rely on the AI Travel Planner as your sole source of
            information for visa requirements, health/entry requirements, or any decision with legal or financial
            consequences.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">5. Eligibility &amp; Your Responsibilities</h2>
          <p>
            You must be at least 18 years old (or the age of majority in your jurisdiction) to submit a booking
            enquiry. You agree to provide accurate contact and travel information, and you are responsible for the
            accuracy of any details (names, passport information, dates) you provide for a booking. We are not liable
            for issues arising from inaccurate information you supply.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">6. Acceptable Use</h2>
          <p>
            You agree not to misuse the Service — including submitting fraudulent enquiries, attempting to access
            non-public areas of the Service without authorization, scraping or bulk-harvesting content, or using the
            Service to violate any applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">7. Third-Party Suppliers</h2>
          <p>
            Any flights, hotels, cruises, car rentals, transfers, insurance, or other travel services ultimately
            arranged for you are provided by independent third-party suppliers (airlines, hotels, insurers, and other
            operators), not by Ticketing-Info LLC. Those suppliers&apos; own terms and conditions, cancellation policies,
            and liability terms apply to the services they provide. Ticketing-Info LLC acts as an intermediary that
            arranges these services on your behalf and is not itself the transportation or accommodation provider.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">8. Disclaimers &amp; Limitation of Liability</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any kind, express or implied. To the fullest extent
            permitted by law, Ticketing-Info LLC disclaims all warranties, and our liability for any claim relating to
            the Service is limited to the amount of fees, if any, you paid to us directly for the specific booking
            giving rise to the claim. We are not liable for indirect, incidental, or consequential damages, or for
            acts, errors, or omissions of third-party suppliers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold Ticketing-Info LLC harmless from claims arising out of your misuse of the
            Service or your violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Wyoming, USA, without regard to conflict-of-law
            principles, except where mandatory consumer-protection law in your jurisdiction requires otherwise.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Service after changes are posted
            constitutes acceptance of the updated Terms. We will update the &quot;Last updated&quot; date above when changes
            are made.
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
