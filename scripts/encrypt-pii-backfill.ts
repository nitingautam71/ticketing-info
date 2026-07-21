/**
 * One-time backfill: encrypt existing plaintext customer PII (passport number,
 * visa status) in place, so legacy rows match what new writes now store.
 *
 * SAFE BY DESIGN:
 *  - Dry-run by default — prints how many rows WOULD change and writes nothing.
 *    Pass `--apply` to actually update.
 *  - Idempotent — already-encrypted values (prefixed `enc:v1:`) are skipped, so
 *    re-running is harmless.
 *  - Non-destructive — only encrypts; never clears or overwrites with empties.
 *
 * IMPORTANT: this project uses the SAME DATABASE_URL for dev and prod, so this
 * script operates on LIVE customer data. Take a Neon branch/snapshot first.
 *
 * Usage:
 *   1. Put PII_ENCRYPTION_KEY (and DATABASE_URL) in .env
 *   2. Preview:  npx tsx scripts/encrypt-pii-backfill.ts
 *   3. Apply:    npx tsx scripts/encrypt-pii-backfill.ts --apply
 */

import { PrismaClient } from '@prisma/client';
import { encryptPii, isEncryptionConfigured } from '../src/lib/crypto/pii';

// Load .env (and .env.local if present) into process.env. Node >= 20.12.
for (const file of ['.env', '.env.local']) {
  try {
    process.loadEnvFile(file);
  } catch {
    /* file may not exist — ignore */
  }
}

const APPLY = process.argv.includes('--apply');
const prisma = new PrismaClient();

async function main() {
  if (!isEncryptionConfigured()) {
    console.error(
      '\n✗ PII_ENCRYPTION_KEY is not set (or not 32 bytes base64). Set it in .env first.\n' +
        '  Generate one with:\n' +
        '  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"\n',
    );
    process.exit(1);
  }

  const customers = await prisma.customer.findMany({
    select: { id: true, passportNumber: true, visaStatus: true },
  });

  let scanned = 0;
  let toChange = 0;
  let updated = 0;

  for (const c of customers) {
    scanned++;
    const data: { passportNumber?: string; visaStatus?: string } = {};

    // encryptPii returns the value unchanged if already encrypted or empty,
    // so a difference means the stored value is legacy plaintext.
    const encPassport = encryptPii(c.passportNumber);
    if (encPassport && encPassport !== c.passportNumber) data.passportNumber = encPassport;

    const encVisa = encryptPii(c.visaStatus);
    if (encVisa && encVisa !== c.visaStatus) data.visaStatus = encVisa;

    if (Object.keys(data).length === 0) continue;
    toChange++;

    if (APPLY) {
      await prisma.customer.update({ where: { id: c.id }, data });
      updated++;
    }
  }

  console.log(`\nScanned ${scanned} customer(s).`);
  if (APPLY) {
    console.log(`✓ Encrypted PII on ${updated} row(s).`);
  } else {
    console.log(`Would encrypt PII on ${toChange} row(s). Re-run with --apply to write.`);
  }
}

main()
  .catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
