import { useState, useEffect, useCallback } from 'react'
import type { Station, GeoJsonResponse } from '../types/station'
import { getCachedEntry, setCached, clearCache } from '../lib/cache'
import { parsePrice } from '../lib/parsePrice'

const GEOJSON_URL = 'https://regieessencequebec.ca/stations.geojson.gz'

interface UseStationsResult {
  stations: Station[]
  loading: boolean
  error: string | null
  lastUpdated: string | null
  refresh: () => void
}

function parseGeoJson(data: GeoJsonResponse): { stations: Station[]; lastUpdated: string } {
  const stations: Station[] = []

  for (const f of data.features) {
    if (f.geometry?.coordinates?.length !== 2) continue
    const p = f.properties
    const [lng, lat] = f.geometry.coordinates

    let regulier = null, super_ = null, diesel = null
    if (p.Prices) {
      for (const x of p.Prices) {
        if (x.GasType === 'Régulier') regulier = x
        else if (x.GasType === 'Super') super_ = x
        else if (x.GasType === 'Diesel') diesel = x
      }
    }

    stations.push({
      nom: p.Name ?? '',
      banniere: p.brand ?? '',
      adresse: p.Address ?? '',
      region: p.Region ?? '',
      codePostal: p.PostalCode ?? '',
      lat,
      lng,
      prixRegulier: regulier?.IsAvailable ? parsePrice(regulier.Price) : null,
      prixSuper: super_?.IsAvailable ? parsePrice(super_.Price) : null,
      prixDiesel: diesel?.IsAvailable ? parsePrice(diesel.Price) : null,
    })
  }

  return {
    stations,
    lastUpdated: data.metadata?.generated_at ?? new Date().toISOString(),
  }
}

export function useStations(): UseStationsResult {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  const refresh = useCallback(() => {
    clearCache()
    setLoading(true)
    setError(null)
    setFetchKey(k => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchStations() {
      // Check localStorage cache first — single JSON.parse for both data and timestamp
      const { data: cached, lastUpdated: cachedLastUpdated } = getCachedEntry()
      if (cached) {
        if (!cancelled) {
          setStations(cached.stations)
          setLastUpdated(cached.lastUpdated)
          setLoading(false)
        }
        return
      }

      try {
        const response = await fetch(GEOJSON_URL)
        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`)
        }
        // Browser auto-decompresses gzip via Content-Encoding header
        const data: GeoJsonResponse = await response.json()

        // If the source data hasn't changed, bump the cache TTL and reuse existing parsed data
        if (cachedLastUpdated && data.metadata?.generated_at === cachedLastUpdated) {
          const { data: existing } = getCachedEntry()
          if (!cancelled && existing) {
            setCached(existing)
            setStations(existing.stations)
            setLastUpdated(existing.lastUpdated)
            setLoading(false)
            return
          }
        }

        const { stations, lastUpdated } = parseGeoJson(data)

        if (!cancelled) {
          setStations(stations)
          setLastUpdated(lastUpdated)
          setCached({ stations, lastUpdated, count: stations.length })
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur inconnue')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchStations()
    return () => { cancelled = true }
  }, [fetchKey])

  return { stations, loading, error, lastUpdated, refresh }
}
