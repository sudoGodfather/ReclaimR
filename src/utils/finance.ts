/**
 * Financial utilities for ReclaimR.
 * Single source of truth for all SIP / compounding math.
 */

/**
 * Future value of a monthly SIP (annuity-due: contribution at start of month).
 * FV = P * (((1 + r)^n - 1) / r) * (1 + r)
 *
 * @param monthly   Monthly contribution in INR
 * @param years     Investment horizon in years
 * @param annualCagr Expected annual return in percent (default 12% = Nifty 50 long-run avg)
 */
export function sipFutureValue(monthly: number, years: number, annualCagr = 12): number {
  const r = annualCagr / 100 / 12;
  const n = years * 12;
  return Math.round(monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
}

/** Total amount contributed out-of-pocket over the horizon. */
export function sipTotalInvested(monthly: number, years: number): number {
  return Math.round(monthly * years * 12);
}

/** Format a number as Indian Rupees with lakh/crore separators. */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Format a number as lakhs (₹1,00,000) with a given decimal precision. */
export function formatLakhs(amount: number, decimals = 2): string {
  return `₹${(amount / 100000).toFixed(decimals)} Lakhs`;
}

/** Compact INR for chart axes: ₹1.2k / ₹3.5L / ₹1Cr, with typographic minus for negatives. */
export function formatINRCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '−' : '';
  const trim = (v: number) => v.toFixed(1).replace(/\.0$/, '');
  if (abs >= 10000000) return `${sign}₹${trim(abs / 10000000)}Cr`;
  if (abs >= 100000) return `${sign}₹${trim(abs / 100000)}L`;
  if (abs >= 1000) return `${sign}₹${trim(abs / 1000)}k`;
  return `${sign}₹${Math.round(abs)}`;
}

const ORDINALS = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];

/** Ordinal suffix for a day-of-month, e.g. 14 → "14th", 21 → "21st". */
export function ordinal(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;
  return `${day}${ORDINALS[day % 10]}`;
}

/**
 * Human renewal label computed from a mock "today", e.g. "In 3 Days (14th)".
 * Keeps dates live instead of frozen strings ("14th Aug" forever).
 */
export function daysFromNowLabel(days: number, dayOfMonth?: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const base = `In ${days} Day${days === 1 ? '' : 's'}`;
  return dayOfMonth
    ? `${base} (${ordinal(dayOfMonth)})`
    : `${base} (${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;
}
