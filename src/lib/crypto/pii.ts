import crypto from 'node:crypto';

/**
 * Application-level encryption for sensitive PII string fields (passport number,
 * visa status). Ciphertext — not plaintext — is what lands in Postgres, so a
 * leaked DATABASE_URL, a stray backup, or an over-broad read no longer exposes
 * identity data (defence beyond Neon's transparent at-rest encryption).
 *
 * AES-256-GCM (authenticated) with a 96-bit random IV per value. Serialized as
 *   enc:v1:<iv-base64>:<ciphertext+tag-base64>
 *
 * Key: PII_ENCRYPTION_KEY — 32 bytes, base64-encoded. Generate with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 *
 * BACKWARD-COMPATIBLE + SAFE TO DEPLOY UNCONFIGURED:
 *  - No key set  → encrypt/decrypt are no-ops (values pass through unchanged),
 *    so existing deployments keep working exactly as before.
 *  - Key set     → new writes are encrypted; reads transparently decrypt both
 *    encrypted values and any legacy plaintext rows (detected by the prefix).
 *  To activate: set PII_ENCRYPTION_KEY, then run a one-time backfill that reads
 *  each customer and re-saves it so existing plaintext rows become ciphertext.
 *
 * Node runtime only (uses node:crypto) — never import into an Edge/client path.
 */

const PREFIX = 'enc:v1:';
const IV_BYTES = 12;
const TAG_BYTES = 16;

function getKey(): Buffer | null {
  const raw = process.env.PII_ENCRYPTION_KEY;
  if (!raw) return null;
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    console.warn('PII_ENCRYPTION_KEY must decode to 32 bytes (base64); PII encryption disabled.');
    return null;
  }
  return key;
}

export function isEncryptionConfigured(): boolean {
  return getKey() !== null;
}

/** Encrypt a value for storage. No-op when unconfigured or value is empty. */
export function encryptPii(value: string | null | undefined): string | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  if (value.startsWith(PREFIX)) return value; // already encrypted
  const key = getKey();
  if (!key) return value; // unconfigured: store as-is

  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString('base64')}:${Buffer.concat([enc, tag]).toString('base64')}`;
}

/** Decrypt a stored value. Passes through legacy plaintext and empty values. */
export function decryptPii(value: string | null | undefined): string {
  if (!value) return '';
  if (!value.startsWith(PREFIX)) return value; // legacy plaintext row
  const key = getKey();
  if (!key) return value; // can't decrypt without the key

  try {
    const parts = value.split(':'); // ['enc','v1',iv,data]
    const iv = Buffer.from(parts[2], 'base64');
    const data = Buffer.from(parts[3], 'base64');
    const enc = data.subarray(0, data.length - TAG_BYTES);
    const tag = data.subarray(data.length - TAG_BYTES);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
  } catch (err) {
    console.error('Failed to decrypt PII field:', err);
    return '';
  }
}
