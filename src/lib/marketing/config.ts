/**
 * Shared credential/config loading for the Marketing Intelligence admin page
 * (src/app/admin/marketing). Every source (GA4, Search Console, Google Ads) is
 * independently optional — the dashboard renders a "not connected" card for
 * whichever ones are unset instead of failing the whole page. See
 * GOOGLE-MARKETING-API-SETUP.md for how to obtain each credential.
 */

interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

/**
 * The GCP service account key JSON, base64-encoded into one env var. Storing
 * it this way (rather than the raw JSON, or splitting client_email/private_key
 * into separate vars) avoids the newline-escaping problems `-----BEGIN PRIVATE
 * KEY-----\n...` keys otherwise hit when pasted into Vercel's env var UI.
 */
function getServiceAccountCredentials(): ServiceAccountCredentials | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!raw) return null;

  try {
    const json = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
    if (!json.client_email || !json.private_key) return null;
    return { client_email: json.client_email, private_key: json.private_key };
  } catch {
    return null;
  }
}

export const ga4Config = {
  get credentials() {
    return getServiceAccountCredentials();
  },
  get propertyId() {
    return process.env.GA4_PROPERTY_ID || null;
  },
  get isConfigured() {
    return Boolean(this.credentials && this.propertyId);
  },
};

export const searchConsoleConfig = {
  get credentials() {
    return getServiceAccountCredentials();
  },
  get siteUrl() {
    return process.env.GSC_SITE_URL || null;
  },
  get isConfigured() {
    return Boolean(this.credentials && this.siteUrl);
  },
};

export const googleAdsConfig = {
  get developerToken() {
    return process.env.GOOGLE_ADS_DEVELOPER_TOKEN || null;
  },
  get clientId() {
    return process.env.GOOGLE_ADS_CLIENT_ID || null;
  },
  get clientSecret() {
    return process.env.GOOGLE_ADS_CLIENT_SECRET || null;
  },
  get refreshToken() {
    return process.env.GOOGLE_ADS_REFRESH_TOKEN || null;
  },
  get customerId() {
    return process.env.GOOGLE_ADS_CUSTOMER_ID || null;
  },
  /** Manager (MCC) account ID — only needed when customerId sits under a manager account. */
  get loginCustomerId() {
    return process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || null;
  },
  get isConfigured() {
    return Boolean(this.developerToken && this.clientId && this.clientSecret && this.refreshToken && this.customerId);
  },
};
