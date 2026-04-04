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

// Parse localStorage once — returns the raw entry regardless of TTL
function getRawEntry(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: unknown = JSON.parse(raw)
    if (!isValidEntry(entry)) { localStorage.removeItem(CACHE_KEY); return null }
    return entry
  } catch {
    return null
  }
}

export function getCached(): StationsApiResponse | null {
  const entry = getRawEntry()
  if (!entry) return null
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null
  return entry.data
}

// Returns lastUpdated even if cache is expired — avoids a second JSON.parse
export function getCachedLastUpdated(): string | null {
  return getRawEntry()?.data.lastUpdated ?? null
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
