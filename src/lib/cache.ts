import type { StationsApiResponse } from '../types/station'

const CACHE_KEY = 'prix-essence-stations'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

interface CacheEntry {
  data: StationsApiResponse
  fetchedAt: number
}

export function getCached(): StationsApiResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
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
