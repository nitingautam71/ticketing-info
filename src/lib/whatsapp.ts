const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
const BUSINESS_PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '';

export function whatsappLink(message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function telLink(): string {
  return `tel:${BUSINESS_PHONE}`;
}

export function businessPhoneDisplay(): string {
  return BUSINESS_PHONE;
}
