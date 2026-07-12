#!/usr/bin/env node
// Builds the prompt fed to Claude Code (headless) by .github/workflows/daily-blog.yml.
// Kept as a script rather than an inline YAML heredoc so it's easy to read/edit and lint.

const TODAY = process.env.TODAY;

if (!TODAY) {
  console.error('TODAY env var is required (YYYY-MM-DD).');
  process.exit(1);
}

// One post per day, so region coverage is driven by a fixed rotation rather than
// left to the model to "remember" to diversify - that guarantees every region
// gets a turn on a predictable cycle instead of drifting toward whatever's most
// prominent in search results on a given day.
const REGIONS = [
  {
    label: 'India',
    guidance:
      'IRCTC/Indian Railways updates (Tatkal, PRS changes, new trains), domestic Indian airlines (IndiGo, Air India, Akasa, SpiceJet) schedule/fare news, Indian airport news, and visa/entry policy changes affecting Indians traveling abroad.',
  },
  {
    label: 'United States',
    guidance:
      'US domestic airline announcements (Delta, United, American, Southwest) and fare/schedule changes, TSA rule changes, US airport news, ESTA/US visa policy changes, and news relevant to travelers flying to or within the US.',
  },
  {
    label: 'Europe',
    guidance:
      'Schengen visa and ETIAS policy updates, European low-cost carriers (Ryanair, easyJet, Wizz Air) news, European airport disruptions or strikes, rail travel (Eurostar, Interrail), and EU entry/exit system changes.',
  },
  {
    label: 'Asia-Pacific (excluding India)',
    guidance:
      'Southeast/East Asia travel news relevant to international visitors - visa-free or e-visa changes (Thailand, Vietnam, Indonesia, Japan, South Korea, China), regional low-cost carriers (AirAsia, Scoot, Jetstar), and Australia/New Zealand ETA or entry-policy updates.',
  },
  {
    label: 'Middle East & global travel hubs',
    guidance:
      'UAE/Dubai and Qatar visa or entry-policy changes, major Gulf carriers (Emirates, Qatar Airways, Etihad) announcements, Turkey travel/visa updates, and news about major international stopover hubs used by long-haul travelers.',
  },
];

function regionForDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const epoch = Date.UTC(2026, 0, 1);
  const today = Date.UTC(y, m - 1, d);
  const daysSinceEpoch = Math.floor((today - epoch) / 86400000);
  const index = ((daysSinceEpoch % REGIONS.length) + REGIONS.length) % REGIONS.length;
  return REGIONS[index];
}

const region = regionForDate(TODAY);
const otherRegionLabels = REGIONS.filter((r) => r.label !== region.label)
  .map((r) => r.label)
  .join(', ');

const prompt = `You are writing the daily travel news blog post for ticketing-info.org, a travel booking site serving travelers booking flights, hotels, trains, visas, and packages across India, the US, Europe, Asia, and other major travel regions worldwide.

## Today's regional focus: ${region.label}
This blog runs on a fixed daily region rotation (${REGIONS.map((r) => r.label).join(' -> ')} -> repeats) so that over any 5-day cycle every major region gets covered - not just whichever region is easiest to find news about. Today is ${region.label}'s turn. The other regions in the rotation are: ${otherRegionLabels} - do not write about those today even if they're more prominent in search results; that's what tomorrow and the following days are for.

Categories to search within for ${region.label}: ${region.guidance}

## Task
1. Use WebSearch to find travel industry news from roughly the past 24 hours in the categories above, specific to ${region.label}.
2. Use WebFetch to read the full articles for anything you plan to cite, and cross-check important facts (dates, fees, policy details) against at least one other source when possible.
3. Before writing, use Glob on "content/blog-drafts/*.json" and Read the 5-7 most recent files (by the date in the filename) so you do not repeat the same specific topic covered in the last few days, even if it's a different region's turn.
4. Choose ONE topic (or a small cluster of closely related news items) about ${region.label} and write ONE completely original blog post, 500-800 words. Write entirely in your own words - summarize and analyze, never copy sentences from source articles. Short direct quotes (under 15 words) are fine if clearly attributed.
5. Tone: practical and helpful for someone actively booking travel - what changed, why it matters, and what a traveler should actually do about it (e.g. book now vs wait, documents needed, deadlines).
6. Write an SEO-friendly title (under 70 characters) and an excerpt that doubles as the HTML meta description (under 155 characters, no clickbait, accurately summarizes the post).

## Output
Create exactly ONE new file at content/blog-drafts/${TODAY}-<slug>.json using the Write tool, and make no other file changes. <slug> must be lowercase letters/numbers/hyphens only (e.g. irctc-tatkal-booking-rules-change), derived from the title.

The file must contain exactly this JSON shape:
{
  "date": "${TODAY}",
  "region": "${region.label}",
  "slug": "your-slug-here",
  "title": "Your SEO title",
  "excerpt": "Your <=155 character meta description / card teaser",
  "content": "Full post body as plain text. Separate paragraphs with a blank line (\\n\\n). Do not use Markdown or HTML syntax - the live site renders this field as plain text, not rendered Markdown/HTML. End with a final section starting with a line that just says 'Sources' followed by one 'Title - URL' line per source.",
  "sources": [ { "title": "Publisher/article title", "url": "https://..." } ]
}

## Rules
- Do not use any tool other than WebSearch, WebFetch, Glob, Read, and Write.
- Do not run any commands, do not edit any other file, do not touch git.
- Stay on today's region (${region.label}). If you genuinely find no relevant ${region.label} travel news from the past 24 hours, do not switch regions and do not create any file - instead respond with only the text: NO_NEWS_FOUND: <one sentence reason>
- The content field must contain 500-800 words of actual article body (the Sources section is in addition to that range, but keep the total reasonable).
- Never fabricate a source URL. Only cite articles you actually fetched or saw in search results.
`;

console.log(prompt);
