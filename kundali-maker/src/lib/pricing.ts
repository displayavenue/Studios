export const PRICING = {
  kundaliInr: 299,
  remediesInr: 199,
  milanInr: 399,
  careerInr: 499,
  muhuratInr: 699,
  varshphalInr: 599,
  manglikInr: 149,
  deepInr: 899,
  shaadiPackInr: 799,
  businessPackInr: 1299,
  studentPackInr: 699,
  currency: 'INR' as const,
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
