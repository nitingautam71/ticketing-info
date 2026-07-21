# Google Marketing API Setup — /admin/marketing

The `/admin/marketing` page pulls live, read-only reporting data from three Google sources:

| Source | What it shows | Client library |
|---|---|---|
| GA4 (Analytics Data API) | Sessions, users, engagement, conversions, revenue, channels, landing pages | `@google-analytics/data` |
| Search Console | Clicks, impressions, CTR, position, top queries/pages | `googleapis` |
| Google Ads | Per-campaign spend, clicks, conversions, CPC, cost/conversion | `google-ads-api` |

Each source is **independently optional**. If its env vars are unset, the dashboard shows a
"not connected" card for that source and the others still work. Nothing here can modify
campaigns, properties, or settings — every call is a reporting/read call.

Prerequisite for all three: note that this is a different set of credentials from the
`NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GOOGLE_ADS_*` tags in `GOOGLE-ADS-SETUP.md`.
Those make the *website send data in*; these let the *server read reports back out*.

---

## 1. GA4 + Search Console (one service account covers both)

### 1a. Create the service account

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → create (or pick) a project.
2. **APIs & Services → Library** → enable **"Google Analytics Data API"** and
   **"Google Search Console API"**.
3. **IAM & Admin → Service Accounts → Create service account**. Name it something like
   `marketing-readonly`. No project roles needed — access is granted per-product below.
4. Open the new service account → **Keys → Add key → Create new key → JSON**. A `.json` key
   file downloads. Treat it like a password.

### 1b. Encode the key into the env var

One env var holds the whole key file, base64-encoded (avoids the multiline-private-key
paste problems in Vercel's env UI):

```bash
# macOS / Git Bash / WSL
base64 -w0 service-account.json      # (on macOS: base64 -i service-account.json | tr -d '\n')
```

```powershell
# PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))
```

Set the output as `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` (Vercel → Project Settings →
Environment Variables, and your local `.env`). Then delete the downloaded `.json` file —
don't leave service account keys sitting in Downloads, and **never commit it to the repo**.

### 1c. Grant GA4 access

1. [analytics.google.com](https://analytics.google.com) → **Admin → Property → Property access management**.
2. **+** → add the service account's email (`marketing-readonly@<project>.iam.gserviceaccount.com`)
   with the **Viewer** role.
3. **Admin → Property → Property settings** → copy the numeric **Property ID** (e.g. `123456789`
   — *not* the `G-XXXXXXXX` measurement ID) → set it as `GA4_PROPERTY_ID`.

### 1d. Grant Search Console access

1. [search.google.com/search-console](https://search.google.com/search-console) → pick your property →
   **Settings → Users and permissions → Add user**.
2. Add the same service account email with **Full** permission ("Restricted" also works for
   reading search analytics).
3. Set `GSC_SITE_URL` to the property *exactly as registered*:
   - Domain property → `sc-domain:ticketing-info.org`
   - URL-prefix property → `https://www.ticketing-info.org/` (trailing slash included)

---

## 2. Google Ads API

The Ads API doesn't accept service accounts for standard access — it needs OAuth with a
refresh token, plus a developer token.

### 2a. Developer token

1. In the Google Ads UI (the account itself, or its manager account) → **Tools & Settings →
   Setup → API Center**.
2. Apply for API access. A fresh token starts at **Test account** access level — apply for
   **Basic access** (a short form) to query production accounts. Approval typically takes a
   day or two.
3. Set the token as `GOOGLE_ADS_DEVELOPER_TOKEN`.

### 2b. OAuth client + refresh token (one-time)

1. In the same GCP project: **APIs & Services → Library** → enable **"Google Ads API"**.
2. **APIs & Services → OAuth consent screen**: External, fill in the app name/email, add your
   own Google account as a **test user** (the app can stay in "Testing" — no verification
   needed since only you use it).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID → Desktop app**.
   Copy the client ID and secret into `GOOGLE_ADS_CLIENT_ID` / `GOOGLE_ADS_CLIENT_SECRET`.
4. Generate a refresh token by visiting this URL in a browser (replace `CLIENT_ID`), signing
   in with the Google account that has access to the Ads account:

   ```
   https://accounts.google.com/o/oauth2/v2/auth?client_id=CLIENT_ID&redirect_uri=http://127.0.0.1:8080&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent
   ```

   The browser will fail to load `127.0.0.1:8080` — that's expected. Copy the `code=` value
   out of the address bar, then exchange it (within a few minutes):

   ```bash
   curl -d client_id=CLIENT_ID -d client_secret=CLIENT_SECRET \
        -d code=THE_CODE -d grant_type=authorization_code \
        -d redirect_uri=http://127.0.0.1:8080 \
        https://oauth2.googleapis.com/token
   ```

   The JSON response contains `refresh_token` → set it as `GOOGLE_ADS_REFRESH_TOKEN`.
   (Refresh tokens for test-mode OAuth apps expire after 7 days — either push the consent
   screen to "In production" (no verification needed for the adwords scope with your own
   account) or re-generate when it expires.)

### 2c. Customer IDs

- `GOOGLE_ADS_CUSTOMER_ID` — the account whose campaigns you want to read; the 10-digit ID
  shown top-right in the Ads UI. Dashes are fine (`123-456-7890`).
- `GOOGLE_ADS_LOGIN_CUSTOMER_ID` — only set this if you access that account *through a
  manager (MCC) account*; use the manager's ID. Leave unset otherwise.

---

## 3. Verify

Set the vars in `.env` locally (or Vercel + redeploy), then open **/admin/marketing**:

- A configured source renders its data card; an unconfigured one shows exactly which vars
  are missing.
- If a source errors (bad key, missing grant, pending developer token), the card shows the
  underlying API error message instead of taking down the page.

Common first-run errors:

| Error | Cause |
|---|---|
| GA4 `PERMISSION_DENIED` | Service account email not added as Viewer on the property, or wrong `GA4_PROPERTY_ID` (measurement ID used instead of numeric ID) |
| GSC `User does not have sufficient permission` | Service account not added on the Search Console property, or `GSC_SITE_URL` doesn't exactly match the property format |
| Ads `DEVELOPER_TOKEN_NOT_APPROVED` | Token still at Test-account level — Basic access application pending |
| Ads `USER_PERMISSION_DENIED` | Refresh token's Google account lacks access to the customer ID, or missing `GOOGLE_ADS_LOGIN_CUSTOMER_ID` for MCC-managed accounts |
| Ads `invalid_grant` | Refresh token expired (OAuth app still in Testing mode — 7-day limit) |

## Build memory note

`google-ads-api` ships very large generated TypeScript definitions. `npm run typecheck` and
GitHub Actions already set a bigger Node heap (`--max-old-space-size=6144`). If a Vercel
build ever fails with "JavaScript heap out of memory", add the same value as a
`NODE_OPTIONS` environment variable in Vercel → Project Settings → Environment Variables.

## Security notes

- All vars are server-side only (no `NEXT_PUBLIC_` prefix) — they never reach the browser.
- The page lives under `/admin`, behind the same `ADMIN_PASSWORD` session gate as the rest
  of the admin panel.
- Scopes are read-only (`webmasters.readonly`, Analytics Data read, Ads reporting queries) —
  nothing in this integration can mutate campaigns, budgets, or settings.
