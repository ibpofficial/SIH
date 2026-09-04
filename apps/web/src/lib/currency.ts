export const USD_TO_INR_EXCHANGE_RATE = 83.5;

/**
 * Format USD value to standard USD currency string ($3,510,000)
 */
export function formatUsd(usd: number): string {
  if (usd === undefined || usd === null || isNaN(usd)) return '—';
  return `$${Math.round(usd).toLocaleString()}`;
}

/**
 * Format USD value to INR Crores (₹29.31 Cr)
 */
export function formatInrCrore(usd: number, usdToInr = USD_TO_INR_EXCHANGE_RATE): string {
  if (usd === undefined || usd === null || isNaN(usd)) return '—';
  const inrCrore = (usd * usdToInr) / 10_000_000;
  return `₹${inrCrore.toFixed(2)} Cr`;
}

/**
 * Format USD rate per MT to INR per MT (₹2,380/MT)
 */
export function formatInrPerMt(usdRate: number, usdToInr = USD_TO_INR_EXCHANGE_RATE): string {
  if (usdRate === undefined || usdRate === null || isNaN(usdRate)) return '—';
  const inrRate = Math.round(usdRate * usdToInr);
  return `₹${inrRate.toLocaleString()}/MT`;
}

/**
 * Dual currency display: ₹ INR Primary ($ USD secondary)
 * e.g., "₹29.31 Cr ($3,510,000)" or "₹2,380/MT ($28.50/MT)"
 */
export function formatInrPrimary(
  usd: number,
  isPerMt = false,
  usdToInr = USD_TO_INR_EXCHANGE_RATE
): string {
  if (usd === undefined || usd === null || isNaN(usd)) return '—';

  if (isPerMt) {
    const inrRate = Math.round(usd * usdToInr);
    return `₹${inrRate.toLocaleString()}/MT ($${usd.toFixed(2)}/MT)`;
  } else {
    const inrCrore = (usd * usdToInr) / 10_000_000;
    return `₹${inrCrore.toFixed(2)} Cr (${formatUsd(usd)})`;
  }
}

/**
 * Dual currency display: Both USD and INR formatted clearly
 */
export function formatUsdAndInr(usd: number, usdToInr = USD_TO_INR_EXCHANGE_RATE): string {
  if (usd === undefined || usd === null || isNaN(usd)) return '—';
  return `${formatUsd(usd)} (${formatInrCrore(usd, usdToInr)})`;
}
