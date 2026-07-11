export const LEAD_STAGES = [
  'new',
  'assigned',
  'contacted',
  'follow_up',
  'quotation_sent',
  'negotiating',
  'waiting_for_documents',
  'payment_pending',
  'paid',
  'ticketed',
  'completed',
  'cancelled',
  'lost',
  'refunded',
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  new: 'New',
  assigned: 'Assigned',
  contacted: 'Contacted',
  follow_up: 'Follow-up',
  quotation_sent: 'Quotation Sent',
  negotiating: 'Negotiating',
  waiting_for_documents: 'Waiting for Documents',
  payment_pending: 'Payment Pending',
  paid: 'Paid',
  ticketed: 'Ticketed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  lost: 'Lost',
  refunded: 'Refunded',
};

export const LEAD_SOURCES = ['website', 'phone', 'whatsapp', 'facebook', 'instagram', 'google_ads', 'email', 'referral'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Website',
  phone: 'Phone',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  instagram: 'Instagram',
  google_ads: 'Google Ads',
  email: 'Email',
  referral: 'Referral',
};

export const LEAD_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];
