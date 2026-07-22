import type { Lead } from '@prisma/client';

// Instant new-lead alerting. When LEAD_NOTIFY_WEBHOOK_URL is set, every booking
// enquiry POSTs a Slack-formatted message to it the moment it's saved — so a
// consultant can act on the "we'll call you back fast" promise instead of that
// depending on someone refreshing /admin/leads. Dependency-free (plain webhook),
// so it works with Slack, Mattermost, Google Chat, or a Zapier/Make catch-hook.
const WEBHOOK_URL = process.env.LEAD_NOTIFY_WEBHOOK_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

const VERTICAL_EMOJI: Record<string, string> = {
  flight: '✈️',
  hotel: '🏨',
  cruise: '🛳️',
  train: '🚆',
  car: '🚗',
  transfer: '🚕',
  insurance: '🛡️',
  package: '🧳',
  visa: '🛂',
};

/** Pull the human-meaningful bits out of the enquiry payload (title/price/date), if present. */
function payloadSummary(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const p = payload as Record<string, unknown>;
  const parts: string[] = [];
  if (typeof p.title === 'string') parts.push(p.title);
  if (typeof p.price === 'number' && p.price > 0) parts.push(`~$${p.price.toLocaleString()}`);
  if (typeof p.date === 'string') parts.push(p.date);
  return parts.length ? parts.join(' • ') : null;
}

function buildMessage(lead: Lead) {
  const emoji = VERTICAL_EMOJI[lead.vertical] ?? '📩';
  const contact = lead.phone || lead.email || 'no contact provided';
  const summary = payloadSummary(lead.payload);
  const adminUrl = SITE_URL ? `${SITE_URL}/admin/leads/${lead.id}` : null;

  const fields = [
    { type: 'mrkdwn', text: `*Name:*\n${lead.name}` },
    { type: 'mrkdwn', text: `*Contact:*\n${contact}` },
    { type: 'mrkdwn', text: `*Method:*\n${lead.contactMethod}` },
    { type: 'mrkdwn', text: `*Ref:*\n${lead.displayId}` },
  ];

  const detail: string[] = [];
  if (summary) detail.push(`*Enquiry:* ${summary}`);
  if (lead.message) detail.push(`*Message:* ${lead.message}`);
  if (lead.sourcePage) detail.push(`*Page:* ${lead.sourcePage}`);

  const blocks: unknown[] = [
    { type: 'header', text: { type: 'plain_text', text: `${emoji} New ${lead.vertical} lead`, emoji: true } },
    { type: 'section', fields },
  ];
  if (detail.length) blocks.push({ type: 'section', text: { type: 'mrkdwn', text: detail.join('\n') } });
  if (adminUrl) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `<${adminUrl}|Open in admin> — respond fast to keep the callback promise` }],
    });
  }

  // `text` is the notification/preview fallback for clients that don't render blocks.
  return { text: `${emoji} New ${lead.vertical} lead — ${lead.name} (${contact}) via ${lead.contactMethod}`, blocks };
}

/**
 * Fire an instant team alert for a new lead. No-ops when the webhook isn't
 * configured, and never throws — a failed alert must never fail lead capture,
 * and the lead is already safely persisted before this runs. Call via `after()`
 * so it doesn't add latency to the enquiry response.
 */
export async function notifyNewLead(lead: Lead): Promise<void> {
  if (!WEBHOOK_URL) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildMessage(lead)),
      signal: controller.signal,
    });
    if (!res.ok) console.error(`Lead notification webhook returned HTTP ${res.status}`);
  } catch (err) {
    console.error('Lead notification failed', err);
  } finally {
    clearTimeout(timeout);
  }
}
