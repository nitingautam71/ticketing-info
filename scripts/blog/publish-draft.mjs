#!/usr/bin/env node
// Publishes one or more daily blog drafts to the live site by calling the
// site's own authenticated admin API (/api/admin/login + /api/admin/blog).
// Deliberately does NOT touch the database directly - this is the one place
// in the automation that reaches production, and it reuses the app's
// existing auth + validation instead of holding DB credentials in CI.
//
// Usage: DRAFT_FILES="content/blog-drafts/2026-07-12-foo.json" \
//        ADMIN_PASSWORD=... SITE_URL=https://www.ticketing-info.org \
//        node scripts/blog/publish-draft.mjs
// (or pass file paths as argv, e.g. for local manual testing)

import { readFileSync } from 'node:fs';

const SITE_URL = (process.env.SITE_URL || 'https://www.ticketing-info.org').replace(/\/$/, '');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const files = (process.env.DRAFT_FILES ?? process.argv.slice(2).join('\n'))
  .split('\n')
  .map((f) => f.trim())
  .filter(Boolean);

if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD env var is required.');
  process.exit(1);
}

if (files.length === 0) {
  console.log('No draft files to publish.');
  process.exit(0);
}

async function login() {
  const res = await fetch(`${SITE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Admin login failed: ${res.status} ${await res.text()}`);
  }
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) {
    throw new Error('Admin login succeeded but returned no session cookie.');
  }
  return setCookie.split(';')[0];
}

async function publishOne(cookie, filePath) {
  const draft = JSON.parse(readFileSync(filePath, 'utf8'));

  const res = await fetch(`${SITE_URL}/api/admin/blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      slug: draft.slug,
      title: draft.title,
      excerpt: draft.excerpt,
      content: draft.content,
      coverImage: draft.coverImage || '',
      published: true,
    }),
  });

  if (res.status === 409) {
    console.log(`Skipping ${filePath}: slug "${draft.slug}" already exists (already published?).`);
    return;
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Failed to publish ${filePath}: ${res.status} ${JSON.stringify(body)}`);
  }

  console.log(`Published ${filePath} -> ${SITE_URL}/blog/${draft.slug}`);
}

const cookie = await login();
for (const filePath of files) {
  await publishOne(cookie, filePath);
}
