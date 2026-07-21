export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function formatCurrency(n: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}m ${seconds}s`;
}

/** null means "undefined %" (previous period was zero) — callers should render an em dash, not 0%. */
export function formatChange(pct: number | null): { text: string; direction: 'up' | 'down' | 'flat' | 'na' } {
  if (pct === null) return { text: '—', direction: 'na' };
  if (Math.abs(pct) < 0.05) return { text: '0%', direction: 'flat' };
  const sign = pct > 0 ? '+' : '';
  return { text: `${sign}${pct.toFixed(1)}%`, direction: pct > 0 ? 'up' : 'down' };
}
