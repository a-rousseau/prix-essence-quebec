import { useState, useEffect, useCallback } from 'react'
import type { Station, GeoJsonResponse } from '../types/station'
import { getCached, setCached, clearCache } from '../lib/cache'
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
  const stations: Station[] = data.features
    .filter((f) => f.geometry?.coordinates?.length === 2)
    .map((f) => {
      const p = f.properties
      const [lng, lat] = f.geometry.coordinates

      const regulier = p.Prices?.find((x) => x.GasType === 'Régulier')
      const super_ = p.Prices?.find((x) => x.GasType === 'Super')
      const diesel = p.Prices?.find((x) => x.GasType === 'Diesel')

      return {
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
      }
    })

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
      // Check localStorage cache first
      const cached = getCached()
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
