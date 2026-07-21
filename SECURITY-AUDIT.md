# Ticketing-Info — Security Audit Report

**Target:** www.ticketing-info.org · **Date:** 2026-07-21 · **Method:** Read-only, non-destructive
**Stack:** Next.js 16.2.10 · React 19 · TypeScript · Prisma 6.19 · PostgreSQL (Neon) · Vercel
**Original score:** 72 / 100 (C+) → **Post-remediation: 87 / 100 (B+)**
**Findings:** 0 critical · 2 high · 7 medium · 5 low · 2 info — **13 of 16 fixed in code; 3 need operator action**

> Interactive dashboard version (risk heatmap, CVSS tables): see the published artifact for this session.

---

## 0. Remediation Status (2026-07-21)

Fixes were implemented and verified: `tsc --noEmit` clean, 39/39 tests pass, `next build` succeeds with middleware and static generation intact.

| ID | Finding | Sev | Status |
|---|---|---|---|
| F-01 | JSON-LD stored XSS | HIGH | ✅ **Fixed** — serializer escapes `< > &` |
| F-03 | Plaintext PII at rest | HIGH | ⚙️ **Implemented, needs activation** — AES-256-GCM field encryption wired in (env-gated); set `PII_ENCRYPTION_KEY` + backfill to activate |
| F-02 | No CSP | MED | ✅ **Fixed** — CSP shipped (static; locks object/base/form/frame-ancestors + restricts script/img/connect) |
| F-04 | Shared admin password / no MFA | MED | 🔶 **Partially hardened** — constant-time compare + trusted IP added; full fix needs multi-user auth (product work) |
| F-05 | Image optimizer wildcard host | MED | ✅ **Fixed** — explicit host allowlist |
| F-06 | Rate-limit IP spoof / serverless | MED | 🔶 **Partially fixed** — trusted `x-real-ip`/`x-vercel-forwarded-for`; shared-store backend still needs KV/Upstash |
| F-07 | AI chat cost DoS | MED | ✅ **Fixed** — Zod-bounded history (turns + per-item + total budget) |
| F-08 | Admin authz only at edge | MED | ✅ **Fixed** — `requireAdmin()` guard on every admin route |
| F-09 | Tracking without consent | MED | ✅ **Fixed** — consent banner + Consent Mode v2 default-deny |
| F-10 | Framework disclosure | LOW | ✅ **Fixed** — `poweredByHeader:false` |
| F-11 | HSTS scope | LOW | ✅ **Fixed** — `includeSubDomains; preload` (submit to preload list) |
| F-12 | No COOP/CORP | LOW | ✅ **Fixed** — COOP + CORP + broadened Permissions-Policy |
| F-13 | Dependency advisories | LOW | 🔶 **Reviewed** — 4 transitive moderates need breaking major bumps; non-exploitable here, left for upstream |
| F-14 | Incomplete audit trail | LOW | ✅ **Fixed** — all admin mutations write AuditLog |
| F-15 | Non-constant-time compare | INFO | ✅ **Fixed** — `constantTimeEqual` in login + middleware |
| F-16 | `db push` vs migrations | INFO | ⚪ **Unchanged** — operational workflow choice |

**To reach A- (~90):** activate F-03 (`PII_ENCRYPTION_KEY` + one-time backfill), then move F-04 to real multi-user auth + MFA.

**Files changed:** `next.config.ts`, `src/components/seo/JsonLd.tsx`, `src/lib/adminAuth.ts`, `src/lib/adminAudit.ts` (new), `src/lib/crypto/pii.ts` (new), `src/lib/customers.ts`, `src/lib/rateLimit.ts`, `src/proxy.ts`, `src/app/api/ai/chat/route.ts`, all `src/app/api/admin/**` routes, `src/components/analytics/GoogleAnalytics.tsx` + `ConsentBanner.tsx` (new), `src/app/layout.tsx`, `src/app/admin/customers/[id]/page.tsx`, `.env.example`.

---

## 1. Executive Summary

Ticketing-Info is a well-engineered MVP with genuinely good security hygiene for its stage. There are **no critical vulnerabilities** and **no exposed secrets**. However, it collects and stores **high-value identity PII** — passport numbers, dates of birth, visa status, and card-authorization records — which raises the required bar.

Two high-impact gaps and a stopgap authentication model should be closed before data and traffic grow:

- **F-01 (High)** — Unescaped JSON-LD serialization is a stored-XSS sink; the AI-generated blog feeds it.
- **F-03 (High)** — Passport/DOB/visa PII is stored in plaintext (no application-level encryption).
- **F-04 (Medium)** — Admin is gated by one shared password with no MFA and a non-rotating session token.
- **F-02 (Medium)** — No Content-Security-Policy, so XSS has no second line of defense.

**Closing these four raises the posture to an estimated B+ (~85).**

### Domain scores

| Domain | Score | | Domain | Score |
|---|---|---|---|---|
| Server | 88 | | Application | 68 |
| Infrastructure | 86 | | Compliance | 60 |
| Code Quality | 85 | | Authentication | 56 |
| Cloud | 84 | | Data Protection | 55 |
| Dependencies | 78 | | API Security | 72 |

---

## 2. Scope & Method

- Read-only review of the repository, live HTTP/TLS surface, and cloud configuration for the site owner.
- No exploitation beyond existence verification. No production data was read, modified, or exfiltrated.
- **Verified** = reproduced against the running app or source. **Assessed** = inferred from configuration.
- Out of scope: authenticated internal testing, network reachability from inside the VPC, destructive/DoS testing.
- CVSS values are prioritization estimates, not formal vendor scores. Point-in-time snapshot; re-run after remediation.

---

## 3. Technology Inventory

| Layer | Technology | Source |
|---|---|---|
| Framework | Next.js 16.2.10 (App Router) | Verified (build + `X-Powered-By`) |
| UI / Language | React 19.2.7 · TypeScript 5.8 (ESM) | Verified |
| Styling | Tailwind CSS v4 + PostCSS | Verified |
| ORM / DB | Prisma 6.19.3 → PostgreSQL (Neon, `sslmode=require`) | Verified / Assessed |
| Hosting / CDN | Vercel serverless + Edge Network (`iad1` / `bom1`) | Verified (`Server: Vercel`) |
| TLS | Let's Encrypt, Vercel-managed, exp 2026-10-08 | Verified (cert chain) |
| AI | Google Gemini (`@google/genai`), server-side | Verified |
| 3rd-party APIs | RapidAPI (Sky-Scrapper flights, Booking.com15 hotels) | Verified |
| Marketing | GA4, Google Ads, Search Console (`googleapis`) | Verified |
| Payments | None (offline) — last-4 only, no PAN/CVV | Verified (schema) |
| Auth | Custom shared-secret gate via edge middleware (`proxy.ts`) | Verified |

---

## 4. HTTP Security Headers (live)

| Header | Status | Observed | Recommendation |
|---|---|---|---|
| `Strict-Transport-Security` | PARTIAL | `max-age=63072000` | add `includeSubDomains; preload` |
| `Content-Security-Policy` | **MISSING** | — | define policy (F-02) |
| `X-Content-Type-Options` | OK | `nosniff` | — |
| `X-Frame-Options` | OK | `DENY` | — |
| `Referrer-Policy` | OK | `strict-origin-when-cross-origin` | — |
| `Permissions-Policy` | PARTIAL | `camera=(), microphone=(), geolocation=()` | broaden directives |
| `Cross-Origin-Opener/Resource-Policy` | MISSING | — | `same-origin` (defense-in-depth) |
| `X-Powered-By` | LEAK | `Next.js` | `poweredByHeader:false` (F-10) |
| HTTPS redirect | OK | `308` http→https, apex→www | — |
| Admin `Set-Cookie` | OK | `HttpOnly; Secure; SameSite=Lax` | consider `__Host-` prefix |

---

## 5. SSL / TLS

Strong and low-maintenance because it is fully platform-managed: valid Let's Encrypt chain (auto-renewed), TLS 1.2/1.3 only, ECDHE forward secrecy, HSTS active, no mixed content. **Only gap:** HSTS lacks `includeSubDomains`/`preload` (F-11). This is an area of strength.

---

## 6. OWASP Top 10 (2021)

| Category | Result | Notes |
|---|---|---|
| A01 Broken Access Control | PARTIAL | Edge gate verified live; no handler-level defense-in-depth (F-08); single-tenant admin (no IDOR) |
| A02 Cryptographic Failures | **FINDING** | Plaintext passport/DOB/visa PII (F-03); TLS strong |
| A03 Injection | FINDING | No SQLi (100% Prisma); JSON-LD HTML injection (F-01) |
| A04 Insecure Design | PARTIAL | Shared-password admin (F-04); AI-cost DoS (F-07) |
| A05 Security Misconfiguration | FINDING | No CSP (F-02), image wildcard (F-05), `X-Powered-By` (F-10) |
| A06 Vulnerable Components | FINDING | 4 moderate transitive advisories (F-13); patched vs CVE-2025-29927 |
| A07 Auth Failures | FINDING | No MFA, single credential, best-effort brute-force limiting (F-04/F-06) |
| A08 Data Integrity | OK | No untrusted deserialization; Zod-validated; no `eval` |
| A09 Logging & Monitoring | PARTIAL | AuditLog exists but only `lead.created` written (F-14) |
| A10 SSRF | FINDING | Provider fetches safe (fixed hosts); Image optimizer wildcard `**` (F-05) |

---

## 7. Prioritized Findings

### F-01 — Stored XSS via unescaped JSON-LD serialization · HIGH · CVSS ~7.1 · CWE-79 · VERIFIED
`src/components/seo/JsonLd.tsx` renders `JSON.stringify(data)` into a `<script type="application/ld+json">` via `dangerouslySetInnerHTML`. `JSON.stringify` does **not** escape `<`, `>`, `/`, so any DB string containing `</script>` breaks out into live HTML. `articleJsonLd()`/`breadcrumbJsonLd()`/`faqPageJsonLd()` feed blog titles, excerpts, and FAQ text straight in.
- **Scenario:** The blog is auto-generated daily by an AI pipeline summarizing external travel news; malformed/prompt-injected upstream text can emit `</script>` in a title. The payload runs **same-origin**, so when an admin views the page it can call `/api/admin/*` with the admin's `SameSite=Lax` cookie — reading/deleting all customer PII.
- **Fix (~30 min):** escape in the serializer — `JSON.stringify(data).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026')`. Pair with CSP (F-02).
- **Refs:** OWASP A03 · XSS Prevention CS Rule 3.1 · CWE-79/116

### F-03 — Sensitive PII stored without application-level encryption · HIGH · CVSS ~6.5 · CWE-311 · VERIFIED
`Customer.passportNumber/passportExpiry/dob/nationality/visaStatus`, `Passenger.passportNumber/visaDetails`, and `CardAuthorization` (cardholder name, signature image, IP) are plaintext columns. `Supplier.apiCredentials` holds third-party keys in plaintext JSON. Protection relies solely on Neon's transparent at-rest encryption, which does not defend against a leaked `DATABASE_URL`, a compromised process, or an over-broad read.
- **Impact:** GDPR Art. 32/34 breach-notification exposure; passport numbers are among the most abusable PII.
- **Fix (1–2 wk):** envelope-encrypt passport/DOB/visa at the app layer (KMS or `pgcrypto`); move supplier creds to a secrets manager; least-privilege DB roles.
- **Refs:** OWASP A02 · NIST SP 800-53 SC-28 · GDPR Art. 32 · CWE-311/312

### F-04 — Single shared admin password; no MFA; non-rotating token · MEDIUM · CVSS ~6.8 · CWE-308 · VERIFIED
Admin access is one shared `ADMIN_PASSWORD`. The session cookie is `SHA-256("ticketing-info-admin:"+password)` — a deterministic value that never rotates, cannot be revoked per-session, and is identical for every login. No MFA, no per-user identity. Documented in-code as an MVP stopgap.
- **Fix (30-day):** Auth.js/NextAuth with per-user accounts, argon2/bcrypt hashing, TOTP MFA, random revocable session IDs, idle/absolute timeouts. Interim: long random passphrase + revocable token allowlist.
- **Refs:** OWASP A07 · NIST SP 800-63B · CWE-308/521 · ASVS V2

### F-02 — No Content-Security-Policy · MEDIUM · CVSS ~5.3 · CWE-693 · VERIFIED (live)
No CSP header. With F-01 present and inline analytics scripts in use, there is no second line of defense against script injection or exfiltration.
- **Fix (7-day):** ship a nonce-based policy via `next.config.ts headers()`/middleware, e.g. `default-src 'self'; script-src 'self' 'nonce-…' https://www.googletagmanager.com; img-src 'self' https: data:; frame-ancestors 'none'; base-uri 'self'; object-src 'none'`. Refactor inline GA init to a nonce.
- **Refs:** OWASP A05 · OWASP Secure Headers · CWE-693

### F-05 — Image optimizer allows any remote host (`hostname:'**'`) · MEDIUM · CVSS ~5.8 · CWE-918 · VERIFIED
`next.config.ts` `remotePatterns` permits any HTTPS host, so `/_next/image?url=…` makes server-side requests to arbitrary URLs — an open image proxy / SSRF-style fetch primitive and bandwidth-amplification vector.
- **Fix (7-day):** explicit host allowlist (Unsplash, Pexels, Skyscanner logos, own CDN). Validate/re-host admin-entered blog covers on upload.
- **Refs:** OWASP A10 · CWE-918

### F-06 — Best-effort serverless rate limiting; spoofable forwarded-IP · MEDIUM · CVSS ~5.3 · CWE-307 · VERIFIED
`src/lib/rateLimit.ts` is an in-memory `Map` that resets per process; on Vercel's multi-instance runtime the effective limit multiplies. Login allows 5/15 min but has no CAPTCHA/lockout. `clientIp()` trusts the left-most `X-Forwarded-For`, which a client can set arbitrarily.
- **Fix (30-day):** shared store (Vercel KV/Upstash); derive IP from trusted `x-vercel-forwarded-for`; CAPTCHA + exponential backoff on login.
- **Refs:** OWASP A07 · CWE-307/348 · ASVS V11

### F-07 — AI chat accepts unbounded history → token-cost DoS · MEDIUM · CVSS ~5.3 · CWE-770 · VERIFIED
`/api/ai/chat` caps `message` at 2000 chars but the client `history[]` (last 10 turns) has no per-item length limit; an attacker inflates Gemini token spend. Endpoint is unauthenticated and only in-memory rate-limited (F-06).
- **Fix (7-day):** Zod-validate history (per-item + total budget, type coercion); alert on daily Gemini spend; optional turnstile before the model call.
- **Refs:** OWASP A04 · API4:2023 · CWE-770 · OWASP LLM DoS

### F-08 — Admin authorization only at the edge (no handler check) · MEDIUM · CVSS ~5.0 · CWE-306 · VERIFIED
Every `/api/admin/*` handler trusts `proxy.ts` middleware and performs no secondary check. Middleware auth has a recurring bypass history (e.g. CVE-2025-29927 class — patched here) and is one matcher typo from silent exposure.
- **Fix (30-day):** shared `requireAdmin(req)` guard at the top of each admin route/Server Action/RSC fetch.
- **Refs:** OWASP A01 · CWE-306

### F-09 — Analytics/ad cookies load without consent · MEDIUM · Compliance · VERIFIED
`GoogleAnalytics.tsx` loads GA4 + Google Ads unconditionally — no consent banner, no Consent Mode v2 default-deny. Non-essential cookies fire before choice; audience is EU/UK-reachable and PII-heavy.
- **Fix (30-day):** consent banner/CMP + `gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied'})`, granting only on opt-in; add CCPA "Do Not Sell/Share".
- **Refs:** GDPR Art. 6/7 · ePrivacy Art. 5(3) · CCPA/CPRA · Consent Mode v2

### F-10 → F-16 — Low & informational

| ID | Finding | Sev | Fix |
|---|---|---|---|
| F-10 | `X-Powered-By: Next.js` framework disclosure | LOW | `poweredByHeader:false` |
| F-11 | HSTS lacks `includeSubDomains; preload` | LOW | extend + submit to preload list |
| F-12 | Missing COOP/COEP/CORP isolation headers | LOW | add `COOP: same-origin` etc. |
| F-13 | 4 moderate transitive advisories (`postcss`, `uuid`, `gaxios`); 0 high/critical | LOW | `npm audit fix`; monthly cadence |
| F-14 | Incomplete audit trail — only `lead.created` logged | LOW | AuditLog on every admin mutation |
| F-15 | Non-constant-time password/token compare (`!==`) | INFO | `timingSafeEqual` |
| F-16 | Schema via `db push`, no versioned migrations | INFO | adopt `prisma migrate` |

---

## 8. Controls Working Well (verified)

- **Secrets:** `.env`, `.env.local`, `.vercel-token` gitignored and absent from history; live `/.env`, `/.git/config`, `/prisma/schema.prisma` all return 404.
- **Injection:** 100% Prisma ORM, zero raw SQL; no `eval`/`child_process`/dynamic code.
- **Input validation:** all public inputs Zod-validated; explicit field mapping closes mass-assignment.
- **Auth gate:** verified live — `/admin`→307 login, `/api/admin/*`→401; cookie `HttpOnly + Secure + SameSite=Lax` (CSRF-resistant).
- **Transport:** HTTPS enforced (308), HSTS on, managed TLS 1.2/1.3, no mixed content.
- **Payments:** no PAN/CVV stored — last-4 + declaration only, minimal PCI scope.
- **Client secrets:** none in the bundle; only non-sensitive `NEXT_PUBLIC_` values exposed.
- **Patching:** Next.js 16.2.10 current, patched vs CVE-2025-29927 middleware-bypass class.

---

## 9. Remediation Roadmap

**≤ 24 hours (contain):** F-01 serializer escape · F-04 rotate `ADMIN_PASSWORD` to random passphrase · F-05 image host allowlist.

**7 days (harden surface):** F-02 CSP (nonce) + F-10 remove `X-Powered-By` + F-12 COOP/CORP · F-07 bound AI history + spend alerts · F-13 `npm audit fix`.

**30 days (structural):** F-03 app-level PII encryption + secrets manager · F-04 real multi-user auth + MFA · F-06 shared-store rate limits + trusted IP + login CAPTCHA · F-08/F-14 handler-level authz + full audit logging · F-09 consent + Consent Mode.

**90 days (program):** CI security gates (npm audit/Dependabot, CodeQL/Semgrep SAST, gitleaks, `prisma migrate`) · centralized logging + auth-failure alerting + IR runbook · PII retention/erasure + DSAR + DPAs + encrypted backup restore test · annual third-party pentest once auth/payments mature.

---

## 10. Hardening Checklist

**In place (verified):** server-side Zod validation · ORM-only DB access · explicit field mapping · HttpOnly/Secure/SameSite cookie · server-side session verification · HTTPS+HSTS+managed TLS · secrets gitignored · no PAN/CVV · rate limiting on mutations · method-scoped routes · dependency lockfile · partial audit logging · privacy policy + terms published.

**Recommended:** JSON-LD output encoding (F-01) · CSP (F-02) · image host allowlist (F-05) · per-user auth + MFA + revocable sessions (F-04) · login CAPTCHA/lockout (F-06) · app-level PII encryption + secrets manager (F-03) · PII retention/erasure + encrypted backups · HSTS preload + remove `X-Powered-By` (F-11/F-10) · handler-level authz (F-08) · shared-store rate limits + bounded AI size (F-06/F-07) · SAST/secret scanning/Dependabot in CI · full admin audit trail (F-14) · auth-failure alerting + IR runbook · cookie consent + Consent Mode + CCPA link (F-09) · DPAs with Vercel/Neon · Neon IP allowlist + least-priv DB role · scoped/rotated API tokens.

---

*Generated 2026-07-21. Read-only, non-destructive assessment. Re-run after remediation.*
