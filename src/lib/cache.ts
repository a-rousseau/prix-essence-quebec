import type { StationsApiResponse } from '../types/station'

const CACHE_KEY = 'prix-essence-stations'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

interface CacheEntry {
  data: StationsApiResponse
  fetchedAt: number
}

function isValidEntry(entry: unknown): entry is CacheEntry {
  if (!entry || typeof entry !== 'object') return false
  const e = entry as Record<string, unknown>
  return (
    typeof e.fetchedAt === 'number' &&
    e.data !== null &&
    typeof e.data === 'object' &&
    Array.isArray((e.data as Record<string, unknown>).stations)
  )
}

export function getCached(): StationsApiResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: unknown = JSON.parse(raw)
    if (!isValidEntry(entry)) { localStorage.removeItem(CACHE_KEY); return null }
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null
    return entry.data
  } catch {
    return null
  }
}

export function setCached(data: StationsApiResponse): void {
  try {
    const entry: CacheEntry = { data, fetchedAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // localStorage may be full or unavailable
  }
}

export function clearCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    // ignore
  }
}

export function getCacheAge(): number | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    return Date.now() - entry.fetchedAt
  } catch {
    return null
  }
}
