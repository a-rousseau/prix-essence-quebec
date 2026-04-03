import { useState, useCallback } from 'react'
import L from 'leaflet'
import { Map } from './components/Map'
import { PriceStatsBar } from './components/PriceStatsBar'
import { SearchBar } from './components/SearchBar'
import { LoadingSpinner } from './components/LoadingSpinner'
import { useStations } from './hooks/useStations'

export default function App() {
  const { stations, loading, error, lastUpdated, refresh } = useStations()
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)

  const handleMapReady = useCallback((map: L.Map) => {
    setMapInstance(map)
  }, [])

  return (
    <div className="h-dvh w-screen overflow-hidden relative">
      {loading && <LoadingSpinner />}

      {error && (
        <div className="absolute top-4 left-4 right-4 z-[2000] bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 shadow-lg">
          <strong>Erreur:</strong> {error}
        </div>
      )}

      <Map stations={stations} onMapReady={handleMapReady} />
      <SearchBar map={mapInstance} />

      {stations.length > 0 && (
        <PriceStatsBar stations={stations} lastUpdated={lastUpdated} map={mapInstance} onRefresh={refresh} />
      )}
    </div>
  )
}
