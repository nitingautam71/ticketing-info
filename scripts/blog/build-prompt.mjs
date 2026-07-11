#!/usr/bin/env node
// Builds the prompt fed to Claude Code (headless) by .github/workflows/daily-blog.yml.
// Kept as a script rather than an inline YAML heredoc so it's easy to read/edit and lint.

const TODAY = process.env.TODAY;

if (!TODAY) {
  console.error('TODAY env var is required (YYYY-MM-DD).');
  process.exit(1);
}

const prompt = `You are writing the daily travel news blog post for ticketing-info.org, a travel booking site serving Indian domestic and international travelers (flights, hotels, trains, visas, packages).

## Task
1. Use WebSearch to find travel industry news from roughly the past 24 hours relevant to this audience: airline announcements or fare/schedule changes, visa or entry policy changes, IRCTC/Indian Railways updates, airport news, notable travel deals, and tourism/travel advisories. Prioritize India-relevant and high-impact international news.
2. Use WebFetch to read the full articles for anything you plan to cite, and cross-check important facts (dates, fees, policy details) against at least one other source when possible.
3. Before writing, use Glob on "content/blog-drafts/*.json" and Read the 5-7 most recent files (by the date in the filename) so you do not repeat the same topic covered in the last few days.
4. Choose ONE topic (or a small cluster of closely related news items) and write ONE completely original blog post, 500-800 words. Write entirely in your own words - summarize and analyze, never copy sentences from source articles. Short direct quotes (under 15 words) are fine if clearly attributed.
5. Tone: practical and helpful for someone actively booking travel - what changed, why it matters, and what a traveler should actually do about it (e.g. book now vs wait, documents needed, deadlines).
6. Write an SEO-friendly title (under 70 characters) and an excerpt that doubles as the HTML meta description (under 155 characters, no clickbait, accurately summarizes the post).

## Output
Create exactly ONE new file at content/blog-drafts/${TODAY}-<slug>.json using the Write tool, and make no other file changes. <slug> must be lowercase letters/numbers/hyphens only (e.g. irctc-tatkal-booking-rules-change), derived from the title.

The file must contain exactly this JSON shape:
{
  "date": "${TODAY}",
  "slug": "your-slug-here",
  "title": "Your SEO title",
  "excerpt": "Your <=155 character meta description / card teaser",
  "content": "Full post body as plain text. Separate paragraphs with a blank line (\\n\\n). Do not use Markdown or HTML syntax - the live site renders this field as plain text, not rendered Markdown/HTML. End with a final section starting with a line that just says 'Sources' followed by one 'Title - URL' line per source.",
  "sources": [ { "title": "Publisher/article title", "url": "https://..." } ]
}

## Rules
- Do not use any tool other than WebSearch, WebFetch, Glob, Read, and Write.
- Do not run any commands, do not edit any other file, do not touch git.
- If, after searching, you genuinely find no relevant travel news from the past 24 hours, do not create any file - instead respond with only the text: NO_NEWS_FOUND: <one sentence reason>
- The content field must contain 500-800 words of actual article body (the Sources section is in addition to that range, but keep the total reasonable).
- Never fabricate a source URL. Only cite articles you actually fetched or saw in search results.
`;

console.log(prompt);
