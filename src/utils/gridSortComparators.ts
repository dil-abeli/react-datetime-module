/**
 * Compares two values that are expected to be UTC ISO datetime strings.
 * - Safely handles null/undefined/invalid inputs
 * - Returns negative when a < b, positive when a > b, 0 when equal
 */
export function dateIsoSortComparator(v1: unknown, v2: unknown): number {
  const a = typeof v1 === 'string' ? v1 : undefined
  const b = typeof v2 === 'string' ? v2 : undefined

  if (!a && !b) return 0
  if (!a) return -1
  if (!b) return 1

  const ta = Date.parse(a)
  const tb = Date.parse(b)

  const aInvalid = Number.isNaN(ta)
  const bInvalid = Number.isNaN(tb)
  if (aInvalid && bInvalid) return 0
  if (aInvalid) return -1
  if (bInvalid) return 1

  return ta - tb
}


