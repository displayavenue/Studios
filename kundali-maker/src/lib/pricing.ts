export const PRICING = {
  kundaliInr: 299,
  remediesInr: 199,
  currency: 'INR' as const,
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
