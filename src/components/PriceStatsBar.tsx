import { useState, useEffect, useMemo } from 'react'
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
      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium text-center leading-tight">
        {label}
      </span>
      <span className={`text-base font-bold tabular-nums ${highlight ? 'text-green-600' : 'text-gray-800'} ${clickable ? 'underline decoration-dotted underline-offset-2' : ''}`}>
        {value}
      </span>
    </div>
  )
}

interface PriceStatsBarProps {
  stations: Station[]
  lastUpdated: string | null
  map: L.Map | null
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

export function PriceStatsBar({ stations, lastUpdated, map }: PriceStatsBarProps) {
  const stats = useMapStats(stations)
  const [visibleBounds, setVisibleBounds] = useState<L.LatLngBounds | null>(null)

  // Track map bounds on move/zoom
  useEffect(() => {
    if (!map) return
    const update = () => setVisibleBounds(map.getBounds())
    update()
    map.on('moveend zoomend', update)
    return () => { map.off('moveend zoomend', update) }
  }, [map])

  // Find station objects for global lowest & highest
  const lowestStation = useMemo(
    () => stats.lowest !== null ? stations.find(s => s.prixRegulier === stats.lowest) ?? null : null,
    [stations, stats.lowest]
  )
  const highestStation = useMemo(
    () => stats.highest !== null ? stations.find(s => s.prixRegulier === stats.highest) ?? null : null,
    [stations, stats.highest]
  )

  // Lowest price in the currently visible map area
  const { visibleLowest, visibleLowestStation } = useMemo(() => {
    if (!visibleBounds) return { visibleLowest: null, visibleLowestStation: null }
    const visible = stations.filter(s => visibleBounds.contains([s.lat, s.lng]))
    const prices = visible.map(s => s.prixRegulier).filter((p): p is number => p !== null)
    if (!prices.length) return { visibleLowest: null, visibleLowestStation: null }
    const min = Math.min(...prices)
    return { visibleLowest: min, visibleLowestStation: visible.find(s => s.prixRegulier === min) ?? null }
  }, [stations, visibleBounds])

  const lowestDisplay = stats.lowest !== null ? `${stats.lowest}¢` : '—'
  const visibleDisplay = visibleLowest !== null ? `${visibleLowest}¢` : '—'
  const highestDisplay = stats.highest !== null ? `${stats.highest}¢` : '—'
  const updatedTime = formatTime(lastUpdated)

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around px-4 py-2">
        <StatItem
          label="Plus bas au Québec"
          value={lowestDisplay}
          highlight
          onClick={map && lowestStation ? () => flyToStation(map, lowestStation) : undefined}
        />
        <div className="w-px h-8 bg-gray-200" />
        <StatItem
          label="Plus bas de la région"
          value={visibleDisplay}
          onClick={map && visibleLowestStation ? () => flyToStation(map, visibleLowestStation) : undefined}
        />
        <div className="w-px h-8 bg-gray-200" />
        <StatItem
          label="Plus élevé au Québec"
          value={highestDisplay}
          onClick={map && highestStation ? () => flyToStation(map, highestStation) : undefined}
        />
        <div className="w-px h-8 bg-gray-200" />
      </div>
      {updatedTime && (
        <div className="text-center text-[10px] text-gray-400 pb-1">
          Mise à jour: {updatedTime}
        </div>
      )}
    </div>
  )
}
