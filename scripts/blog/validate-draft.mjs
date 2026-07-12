#!/usr/bin/env node
// Verifies that Claude Code's daily blog run produced exactly one well-formed
// draft file and nothing else. Used by .github/workflows/daily-blog.yml as the
// gate before `npm run build` and opening a PR. On failure it writes a report
// to $RUNNER_TEMP/blog-error.md so the workflow can attach it to a FAILED- branch.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const TODAY = process.env.TODAY;
const CLAUDE_OUTPUT_FILE = process.env.CLAUDE_OUTPUT_FILE || 'claude-output.json';
const RUNNER_TEMP = process.env.RUNNER_TEMP || '.';

if (!TODAY) {
  console.error('TODAY env var is required (YYYY-MM-DD).');
  process.exit(1);
}

function safeRead(p) {
  try {
    return readFileSync(p, 'utf8');
  } catch {
    return '';
  }
}

function fail(message) {
  const gitStatus = execSync('git status --porcelain').toString();
  const report = [
    `# Daily blog draft validation failed - ${TODAY}`,
    '',
    '## Reason',
    message,
    '',
    '## git status --porcelain',
    '```',
    gitStatus || '(clean - no files changed)',
    '```',
    '',
    '## Claude Code output',
    '```json',
    safeRead(CLAUDE_OUTPUT_FILE) || '(no output captured)',
    '```',
  ].join('\n');
  writeFileSync(path.join(RUNNER_TEMP, 'blog-error.md'), report);
  console.error(message);
  process.exit(1);
}

const statusOut = execSync('git status --porcelain').toString().trim();
const changedLines = statusOut ? statusOut.split('\n') : [];

if (changedLines.length === 0) {
  fail(
    'Claude Code did not create a draft file (no repo changes detected). Possibly no relevant news was found in the last 24 hours, or the model was blocked from writing.',
  );
}

const expectedPrefix = `content/blog-drafts/${TODAY}-`;
const draftLines = changedLines.filter((line) => {
  const filePath = line.slice(3).trim();
  return filePath.startsWith(expectedPrefix) && filePath.endsWith('.json');
});
const unexpectedLines = changedLines.filter((line) => !draftLines.includes(line));

if (draftLines.length === 0) {
  fail(`No draft file matching ${expectedPrefix}*.json was created. Changes seen:\n${statusOut}`);
}
if (draftLines.length > 1) {
  fail(`Expected exactly one new draft file, found ${draftLines.length}:\n${draftLines.join('\n')}`);
}
if (unexpectedLines.length > 0) {
  fail(`Unexpected file changes outside content/blog-drafts/ - refusing to proceed:\n${unexpectedLines.join('\n')}`);
}

const draftPath = draftLines[0].slice(3).trim();
let draft;
try {
  draft = JSON.parse(readFileSync(draftPath, 'utf8'));
} catch (e) {
  fail(`Draft file ${draftPath} is not valid JSON: ${e.message}`);
}

const errors = [];
const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
if (typeof draft.slug !== 'string' || !slugRe.test(draft.slug)) errors.push('slug missing or not lowercase-hyphenated');
if (typeof draft.title !== 'string' || draft.title.trim().length < 5) errors.push('title missing or too short');
if (typeof draft.excerpt !== 'string' || draft.excerpt.trim().length < 10) errors.push('excerpt missing or too short');
if (typeof draft.content !== 'string' || draft.content.trim().length < 10) errors.push('content missing');
if (!Array.isArray(draft.sources) || draft.sources.length === 0) {
  errors.push('sources missing or empty');
} else {
  draft.sources.forEach((s, i) => {
    if (!s || typeof s.url !== 'string' || !/^https?:\/\//.test(s.url)) errors.push(`sources[${i}].url is missing or not http(s)`);
    if (!s || typeof s.title !== 'string' || !s.title.trim()) errors.push(`sources[${i}].title is missing`);
  });
}

const wordCount = typeof draft.content === 'string' ? draft.content.trim().split(/\s+/).filter(Boolean).length : 0;
if (wordCount < 400 || wordCount > 1000) {
  errors.push(`content word count (${wordCount}) is outside the expected 500-800 range (hard limit 400-1000)`);
}

if (errors.length > 0) {
  fail(`Draft ${draftPath} failed validation:\n- ${errors.join('\n- ')}`);
}

const prTitle = draft.region ? `[${draft.region}] ${draft.title}` : draft.title;
writeFileSync(path.join(RUNNER_TEMP, 'blog-title.txt'), prTitle);

const prBody = [
  `## Daily travel news post - ${TODAY}`,
  '',
  `**Region:** ${draft.region || '(not set)'}`,
  '',
  `**Title:** ${draft.title}`,
  '',
  `**Excerpt / meta description:** ${draft.excerpt}`,
  '',
  `**Slug:** \`${draft.slug}\` -> will be live at \`/blog/${draft.slug}\` once this PR is merged (the merge-triggered publish workflow does the rest).`,
  '',
  `**Word count:** ${wordCount}`,
  '',
  '### Full content',
  '',
  '```',
  draft.content,
  '```',
  '',
  '### Sources',
  '',
  ...draft.sources.map((s) => `- [${s.title}](${s.url})`),
  '',
  '---',
  `Draft file: \`${draftPath}\``,
  'Merging this PR triggers the "Publish Blog Draft on Merge" workflow, which calls the site\'s admin API to publish this post live.',
].join('\n');

writeFileSync(path.join(RUNNER_TEMP, 'blog-body.md'), prBody);

console.log(`Draft OK: ${draftPath} (${wordCount} words, ${draft.sources.length} source(s))`);
