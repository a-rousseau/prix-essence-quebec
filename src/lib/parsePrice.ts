export function parsePrice(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null
  const num = parseFloat(String(val).replace(/[^\d.]/g, ''))
  return isNaN(num) ? null : num
}
