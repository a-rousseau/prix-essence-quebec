import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import L from 'leaflet'
import type { Station } from '../types/station'
import { useMapStats } from '../hooks/useMapStats'

interface StatItemProps {
  label: string
  value: string
  highlight?: boolean
  onClick?: () => void
}

function StatItem({ label, value, highlight, onClick }: StatItemProps) {
  const clickable = !!onClick
  return (
    <div
      className={`flex flex-col items-center gap-0.5 ${clickable ? 'cursor-pointer select-none active:scale-95 transition-transform' : ''}`}
      onClick={onClick}
    >
      <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium text-center leading-tight">
        {label}
      </span>
      <span className={`text-[24px] font-bold tabular-nums ${highlight ? 'text-green-600' : 'text-gray-800'} ${clickable ? 'underline decoration-dotted underline-offset-2' : ''}`}>
        {value}
      </span>
    </div>
  )
}

interface PriceStatsBarProps {
  stations: Station[]
  lastUpdated: string | null
  map: L.Map | null
  onRefresh: () => void
}

function formatTime(isoString: string | null): string {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function flyToStation(map: L.Map, station: Station) {
  map.flyTo([station.lat, station.lng], 16, { duration: 1.2 })
}

export function PriceStatsBar({ stations, lastUpdated, map, onRefresh }: PriceStatsBarProps) {
  const stats = useMapStats(stations)
  const [visibleBounds, setVisibleBounds] = useState<L.LatLngBounds | null>(null)
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Track map bounds on move/zoom — trailing throttle ensures final position is always captured
  useEffect(() => {
    if (!map) return
    const update = () => {
      if (throttleRef.current) clearTimeout(throttleRef.current)
      throttleRef.current = setTimeout(() => {
        setVisibleBounds(map.getBounds())
        throttleRef.current = null
      }, 200)
    }
    update()
    map.on('moveend zoomend', update)
    return () => {
      map.off('moveend zoomend', update)
      if (throttleRef.current) clearTimeout(throttleRef.current)
    }
  }, [map])

  // Lowest price in the currently visible map area — single pass
  const { visibleLowest, visibleLowestStation } = useMemo(() => {
    if (!visibleBounds) return { visibleLowest: null, visibleLowestStation: null }
    let min: number | null = null
    let minStation: Station | null = null
    for (const s of stations) {
      if (!visibleBounds.contains([s.lat, s.lng])) continue
      const p = s.prixRegulier
      if (p === null) continue
      if (min === null || p < min) { min = p; minStation = s }
    }
    return { visibleLowest: min, visibleLowestStation: minStation }
  }, [stations, visibleBounds])

  const { lowestStation, highestStation } = stats
  const lowestDisplay = stats.lowest !== null ? `${stats.lowest}¢` : '—'
  const visibleDisplay = visibleLowest !== null ? `${visibleLowest}¢` : '—'
  const highestDisplay = stats.highest !== null ? `${stats.highest}¢` : '—'
  const updatedTime = useMemo(() => formatTime(lastUpdated), [lastUpdated])

  const onClickLowest = useCallback(() => {
    if (map && lowestStation) flyToStation(map, lowestStation)
  }, [map, lowestStation])
  const onClickVisible = useCallback(() => {
    if (map && visibleLowestStation) flyToStation(map, visibleLowestStation)
  }, [map, visibleLowestStation])
  const onClickHighest = useCallback(() => {
    if (map && highestStation) flyToStation(map, highestStation)
  }, [map, highestStation])

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg"
      style={{
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <div className="flex items-center justify-around px-4 pt-2 pb-1">
        <StatItem
          label="Plus bas au Québec"
          value={lowestDisplay}
          highlight
          onClick={map && lowestStation ? onClickLowest : undefined}
        />
        <div className="w-px h-8 bg-gray-200" />
        <StatItem
          label="Plus bas de la région"
          value={visibleDisplay}
          onClick={map && visibleLowestStation ? onClickVisible : undefined}
        />
        <div className="w-px h-8 bg-gray-200" />
        <StatItem
          label="Plus élevé au Québec"
          value={highestDisplay}
          onClick={map && highestStation ? onClickHighest : undefined}
        />
        <div className="w-px h-8 bg-gray-200" />
      </div>
      {updatedTime && (
        <div className="relative flex items-center justify-center pb-1">
          <span className="text-[15px] text-black-400">Mise à jour: {updatedTime}</span>
          <button
            onClick={onRefresh}
            className="p-1 text-black-400 active:text-gray-600 transition-transform"
            aria-label="Rafraîchir"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
