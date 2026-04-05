import { useState, useCallback } from 'react'
import type L from 'leaflet'
import { Map } from './components/Map'
import { PriceStatsBar } from './components/PriceStatsBar'
import { SearchBar } from './components/SearchBar'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ConsentBanner } from './components/ConsentBanner'
import { getAdConsent, loadAdSense, ADS_ENABLED, clearAdConsent } from './lib/adConsent'
import { useStations } from './hooks/useStations'

const ERROR_STYLE = { top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }

// Load AdSense immediately if consent was already given in a previous session
const initialConsent = getAdConsent()
if (ADS_ENABLED && initialConsent === 'accepted') loadAdSense()

export default function App() {
  const { stations, loading, error, lastUpdated, refresh } = useStations()
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [dismissedError, setDismissedError] = useState<string | null>(null)
  const [showBanner, setShowBanner] = useState(ADS_ENABLED && initialConsent === null)

  const visibleError = error !== dismissedError ? error : null

  const handleMapReady = useCallback((map: L.Map) => {
    setMapInstance(map)
  }, [])

  function handleConsent(accepted: boolean) {
    if (accepted) loadAdSense()
    setShowBanner(false)
  }

  function handleManageCookies() {
    clearAdConsent()
    setShowBanner(true)
  }

  return (
    <div className="h-dvh w-screen overflow-hidden relative">
      {loading && <LoadingSpinner />}

      {visibleError && (
        <div className="absolute left-4 right-4 z-[2000] bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 shadow-lg flex items-start gap-3" style={ERROR_STYLE}>
          <span className="flex-1"><strong>Erreur:</strong> {visibleError}</span>
          <button
            onClick={() => setDismissedError(visibleError)}
            className="shrink-0 text-red-400 hover:text-red-600 transition-colors leading-none mt-0.5"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      )}

      <Map stations={stations} onMapReady={handleMapReady} />
      <SearchBar map={mapInstance} />

      {stations.length > 0 && (
        <PriceStatsBar stations={stations} lastUpdated={lastUpdated} map={mapInstance} onRefresh={refresh} onManageCookies={handleManageCookies} />
      )}

      {showBanner && <ConsentBanner onConsent={handleConsent} />}
    </div>
  )
}
