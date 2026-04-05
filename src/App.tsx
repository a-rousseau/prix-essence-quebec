import { useState, useCallback } from 'react'
import type L from 'leaflet'
import { Map } from './components/Map'
import { PriceStatsBar } from './components/PriceStatsBar'
import { SearchBar } from './components/SearchBar'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ConsentBanner } from './components/ConsentBanner'
import { TrademarkNotice } from './components/TrademarkNotice'
import { PrivacyNotice } from './components/PrivacyNotice'
import { HamburgerMenu } from './components/HamburgerMenu'
import { getAdConsent, loadAdSense, ADS_ENABLED, clearAdConsent } from './lib/adConsent'
import { useStations } from './hooks/useStations'

const ERROR_STYLE = { top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }
const TOP_CONTROLS_STYLE = {
  top: 'max(12px, env(safe-area-inset-top, 12px))',
  left: '12px',
  width: 'max(320px, calc(100vw - 80px))',
}

// Load AdSense immediately if consent was already given in a previous session
const initialConsent = getAdConsent()
if (ADS_ENABLED && initialConsent === 'accepted') loadAdSense()

export default function App() {
  const { stations, loading, error, lastUpdated, refresh } = useStations()
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [dismissedError, setDismissedError] = useState<string | null>(null)
  const [showBanner, setShowBanner] = useState(ADS_ENABLED && initialConsent === null)
  const [showMenu, setShowMenu] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTrademark, setShowTrademark] = useState(false)

  const visibleError = error !== dismissedError ? error : null

  const handleMapReady = useCallback((map: L.Map) => {
    setMapInstance(map)
  }, [])

  function handleConsent(accepted: boolean) {
    if (accepted) loadAdSense()
    setShowBanner(false)
  }

  return (
    <div className="h-dvh w-screen flex flex-col overflow-hidden">
      <div className="relative flex-1 min-h-0">
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

        <div className="absolute z-[1001] flex flex-row gap-2" style={TOP_CONTROLS_STYLE}>
          <button
            onClick={() => setShowMenu(true)}
            className="w-10 h-10 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 text-gray-700 hover:bg-white transition-colors shrink-0"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <SearchBar map={mapInstance} />
        </div>
      </div>

      {stations.length > 0 && (
        <PriceStatsBar stations={stations} lastUpdated={lastUpdated} map={mapInstance} onRefresh={refresh} />
      )}

      {showMenu && (
        <HamburgerMenu
          onClose={() => setShowMenu(false)}
          onPrivacy={() => setShowPrivacy(true)}
          onTrademarks={() => setShowTrademark(true)}
          onCookies={() => { clearAdConsent(); setShowBanner(true) }}
        />
      )}

      {showPrivacy && <PrivacyNotice onClose={() => setShowPrivacy(false)} />}
      {showTrademark && <TrademarkNotice onClose={() => setShowTrademark(false)} />}
      {showBanner && <ConsentBanner onConsent={handleConsent} />}
    </div>
  )
}
