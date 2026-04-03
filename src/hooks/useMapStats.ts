import { useMemo } from 'react'
import type { Station } from '../types/station'

interface MapStats {
  lowest: number | null
  average: number | null
  highest: number | null
  count: number
  withPriceCount: number
}

export function useMapStats(stations: Station[]): MapStats {
  return useMemo(() => {
    const prices = stations
      .map((s) => s.prixRegulier)
      .filter((p): p is number => p !== null)

    if (prices.length === 0) {
      return { lowest: null, average: null, highest: null, count: stations.length, withPriceCount: 0 }
    }

    const lowest = Math.min(...prices)
    const highest = Math.max(...prices)
    const average = Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 10) / 10

    return { lowest, average, highest, count: stations.length, withPriceCount: prices.length }
  }, [stations])
}
