import { useState, useCallback, useEffect, useRef } from 'react'
import { Menu } from 'lucide-react'
import type L from 'leaflet'
import { Map } from './components/Map'
import { PriceStatsBar } from './components/PriceStatsBar'
import { SearchBar } from './components/SearchBar'
import { LoadingSpinner } from './components/LoadingSpinner'
import { FilterOverlay } from './components/FilterOverlay'
import { ConsentBanner } from './components/ConsentBanner'
import { TrademarkNotice } from './components/TrademarkNotice'
import { PrivacyNotice } from './components/PrivacyNotice'
import { HamburgerMenu } from './components/HamburgerMenu'
import { FilterPanel } from './components/FilterPanel'
import { getAdConsent, loadAdSense, ADS_ENABLED, clearAdConsent } from './lib/adConsent'
import { useStations } from './hooks/useStations'
import { filterStations } from './lib/filterUtils'
import type { FilterState } from './types/filter'

const FILTER_OVERLAY_MIN_MS = 500 // ms — minimum overlay duration for perceived stability (D-03)

const ERROR_STYLE = { top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }
const TOP_CONTROLS_STYLE = {
  top: 'max(12px, env(safe-area-inset-top, 12px))',
  left: '12px',
  width: 'calc(100vw - 24px)',
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
  const [filterState, setFilterState] = useState<FilterState>({
    selectedFuelType: 'regulier',
    companies: [],
    regions: [],
    showFavoritesOnly: false,
  })
  const [filteredStations, setFilteredStations] = useState<typeof stations>([])
  const [filterPending, setFilterPending] = useState(false)
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const visibleError = error !== dismissedError ? error : null

  const handleMapReady = useCallback((map: L.Map) => {
    setMapInstance(map)
  }, [])

  useEffect(() => {
    if (stations.length === 0) return
    const availableCompanies = Array.from(new Set(stations.map(s => s.banniere).filter(Boolean))).sort()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilterState(prev => {
      // Add any newly discovered brands to the allowlist without resetting user selections
      const newBrands = availableCompanies.filter(b => !prev.companies.includes(b))
      if (newBrands.length === 0) return prev
      return { ...prev, companies: [...prev.companies, ...newBrands] }
    })
  }, [stations])

  useEffect(() => {
    // Guard: don't show filter overlay before stations data arrives.
    // LoadingSpinner handles the initial load state; filteredStations stays [] naturally.
    if (stations.length === 0) return

    // Show overlay (D-03, D-04)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilterPending(true)

    // Cancel any pending hide timer to handle rapid filter changes
    if (overlayTimerRef.current !== null) {
      clearTimeout(overlayTimerRef.current)
      overlayTimerRef.current = null
    }

    // Apply filter synchronously
    const result = filterStations(stations, filterState)
    setFilteredStations(result)

    // Enforce 500ms minimum before hiding overlay (D-03)
    overlayTimerRef.current = setTimeout(() => {
      setFilterPending(false)
      overlayTimerRef.current = null
    }, FILTER_OVERLAY_MIN_MS)

    // Cleanup: cancel pending timer on unmount or next effect run
    return () => {
      if (overlayTimerRef.current !== null) {
        clearTimeout(overlayTimerRef.current)
        overlayTimerRef.current = null
      }
    }
  }, [stations, filterState])

  function handleConsent(accepted: boolean) {
    if (accepted) loadAdSense()
    setShowBanner(false)
  }

  return (
    <div className="h-dvh w-screen flex flex-col overflow-hidden">
      <div className="relative flex-1 min-h-0">
        {loading && <LoadingSpinner />}
        <FilterOverlay visible={filterPending && !loading} />

        {visibleError && (
          <div className="absolute left-4 right-4 z-[2000] bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700 shadow-md flex items-start gap-3" style={ERROR_STYLE}>
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

        <Map stations={filteredStations} onMapReady={handleMapReady} selectedFuelType={filterState.selectedFuelType} />

        <div className="absolute z-[1001] flex flex-col gap-3" style={TOP_CONTROLS_STYLE}>
          <div className="flex flex-row gap-2">
            <button
              onClick={() => setShowMenu(true)}
              className="w-10 h-10 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-md shadow-md border border-gray-200 text-gray-700 hover:bg-white transition-colors shrink-0"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
            <SearchBar map={mapInstance} />
          </div>

          <FilterPanel
            filterState={filterState}
            onFilterChange={setFilterState}
            stations={stations}
          />
        </div>
      </div>

      {stations.length > 0 && (
        <PriceStatsBar stations={filteredStations} lastUpdated={lastUpdated} map={mapInstance} onRefresh={refresh} selectedFuelType={filterState.selectedFuelType} />
      )}

      <HamburgerMenu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        onPrivacy={() => setShowPrivacy(true)}
        onTrademarks={() => setShowTrademark(true)}
        onCookies={() => { clearAdConsent(); setShowBanner(true) }}
      />

      <PrivacyNotice open={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TrademarkNotice open={showTrademark} onClose={() => setShowTrademark(false)} />
      {showBanner && <ConsentBanner onConsent={handleConsent} />}
    </div>
  )
}
