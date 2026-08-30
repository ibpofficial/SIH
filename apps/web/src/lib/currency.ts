export const USD_TO_INR_EXCHANGE_RATE = 83.5;

export function formatUsd(usd: number): string {
  if (usd === undefined || usd === null || isNaN(usd)) return '—';
  return `$${Math.round(usd).toLocaleString()}`;
}

export function formatInrCrore(usd: number, usdToInr = USD_TO_INR_EXCHANGE_RATE): string {
  if (usd === undefined || usd === null || isNaN(usd)) return '—';
  const inrCrore = (usd * usdToInr) / 10_000_000;
  return `₹${inrCrore.toFixed(2)} Cr`;
}

export function formatUsdAndInr(usd: number, usdToInr = USD_TO_INR_EXCHANGE_RATE): string {
  if (usd === undefined || usd === null || isNaN(usd)) return '—';
  return `${formatUsd(usd)} (${formatInrCrore(usd, usdToInr)})`;
}
