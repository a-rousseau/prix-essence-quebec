import { useMemo } from 'react'
import type { Station } from '../types/station'

interface MapStats {
  lowest: number | null
  highest: number | null
  count: number
  withPriceCount: number
  lowestStation: Station | null
  highestStation: Station | null
}

export function useMapStats(stations: Station[]): MapStats {
  return useMemo(() => {
    let lowest: number | null = null
    let highest: number | null = null
    let lowestStation: Station | null = null
    let highestStation: Station | null = null
    let withPriceCount = 0

    for (const s of stations) {
      const p = s.prixRegulier
      if (p === null) continue
      withPriceCount++
      if (lowest === null || p < lowest) { lowest = p; lowestStation = s }
      if (highest === null || p > highest) { highest = p; highestStation = s }
    }

    return { lowest, highest, count: stations.length, withPriceCount, lowestStation, highestStation }
  }, [stations])
}
