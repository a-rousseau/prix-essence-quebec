import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import type { Station } from '../types/station'
import { getBrandLogo } from '../lib/brandLogos'
import { createClusterIcon } from '../lib/clusterIcon'

interface ClusterLayerProps {
  stations: Station[]
}

interface LeafletTooltipInternal extends L.Tooltip {
  _updatePosition(): void
}

const LOCATION_ICON = L.divIcon({
  className: '',
  html: `<div class="user-location-outer">
           <div class="user-location-pulse"></div>
           <div class="user-location-dot"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

const LOCATE_BTN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3"/>
  <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
  <circle cx="12" cy="12" r="8" stroke-dasharray="2 4"/>
</svg>`

const CIRCLE_MARKER_BASE = {
  radius: 8,
  color: '#fff',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.9,
}

const TOOLTIP_OPTIONS: L.TooltipOptions = {
  permanent: true,
  direction: 'top',
  offset: [0, -8] as L.PointExpression,
  className: 'station-tooltip',
  interactive: true,
}

const CLUSTER_GROUP_OPTIONS: L.MarkerClusterGroupOptions = {
  iconCreateFunction: createClusterIcon,
  maxClusterRadius: 60,
  showCoverageOnHover: false,
  spiderfyOnMaxZoom: true,
  disableClusteringAtZoom: 14,
}

const EXPECTED_CARD_HEIGHT = 345 // px — expected expanded station card height for flyTo pre-offset

const PRICE_COLORS = {
  low:  '#16a34a',
  mid:  '#f59e0b',
  high: '#dc2626',
  none: '#6b7280',
}

function getPriceColor(price: number | null, lowThreshold: number, highThreshold: number, hasRange: boolean): string {
  if (price === null) return PRICE_COLORS.none
  if (!hasRange) return PRICE_COLORS.mid
  if (price <= lowThreshold) return PRICE_COLORS.low
  if (price <= highThreshold) return PRICE_COLORS.mid
  return PRICE_COLORS.high
}

function fmt(p: number | null): string {
  return p !== null ? `${p}¢` : '—'
}

const ESC_MAP: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
function esc(s: string): string {
  return s.replace(/[&<>"]/g, c => ESC_MAP[c])
}

function createStationCard(s: Station): string {
  const displayName = esc(s.banniere || s.nom)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`
  const badgeHtml = `<img src="${esc(getBrandLogo(s.banniere))}" class="brand-logo" alt="${displayName}" width="28" height="28">`
  return `
    <div class="station-card">

      <div class="station-card-compact">
        <div class="station-card-name">${badgeHtml}</div>
        <div class="station-card-price">${fmt(s.prixRegulier)}</div>
      </div>
      <div class="station-card-details">
        <div class="station-card-details-inner">
          <div class="station-card-header">
            <div>
              <div class="station-card-fullname">${esc(s.nom)}</div>
              <div class="station-card-address">${esc(s.adresse)}</div>
              <div class="station-card-region">${esc(s.codePostal)} · ${esc(s.region)}</div>
            </div>
          </div>
          <div class="station-card-prices">
            <div class="station-card-price-row"><span>Régulier</span><strong>${fmt(s.prixRegulier)}</strong></div>
            <div class="station-card-price-row"><span>Super</span><strong>${fmt(s.prixSuper)}</strong></div>
            <div class="station-card-price-row"><span>Diesel</span><strong>${fmt(s.prixDiesel)}</strong></div>
          </div>
          <a class="station-card-directions" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">
            Obtenir l'itinéraire
          </a>
          <div class="station-card-ad-container">
            <div class="station-card-sep"></div>
            <ins class="adsbygoogle"
              style="display:block;width:250px"
              data-ad-client="ca-pub-7169608195886569"
              data-ad-slot="3373913657"
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
            <div class="station-card-sep"></div>
          </div>
        </div>
      </div>
    </div>`
}

function ClusterLayer({ stations }: ClusterLayerProps) {
  const map = useMap()
  const tooltipElsRef = useRef(new Set<HTMLElement>())

  useEffect(() => {
    if (stations.length === 0) return

    let lowest = Infinity, highest = -Infinity
    for (const s of stations) {
      const p = s.prixRegulier
      if (p === null) continue
      if (p < lowest) lowest = p
      if (p > highest) highest = p
    }
    const hasRange = lowest !== Infinity && highest !== lowest
    if (lowest === Infinity) { lowest = 0; highest = 0 }
    const third = (highest - lowest) / 3
    const lowThreshold = lowest + third
    const highThreshold = lowest + third * 2

    const clusterGroup = L.markerClusterGroup(CLUSTER_GROUP_OPTIONS)
    const tooltipEls = tooltipElsRef.current

    for (const s of stations) {
      const marker = L.circleMarker([s.lat, s.lng], {
        ...CIRCLE_MARKER_BASE,
        fillColor: getPriceColor(s.prixRegulier, lowThreshold, highThreshold, hasRange),
      })

      marker.bindTooltip(() => createStationCard(s), TOOLTIP_OPTIONS)

      marker.on('tooltipopen', (e) => {
        const el = e.tooltip.getElement()
        if (!el) return

        const compact = el.querySelector('.station-card-compact')
        const card = el.querySelector('.station-card')
        const directions = el.querySelector('.station-card-directions')

        const runPositionLoop = () => {
          const tooltip = marker.getTooltip()
          if (!tooltip) return
          const start = performance.now()
          const tick = (now: number) => {
            // Only reposition — do NOT call tooltip.update() which resets innerHTML
            ;(tooltip as LeafletTooltipInternal)._updatePosition()
            if (now - start < 280) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }

        tooltipEls.add(el)

        compact?.addEventListener('click', (evt) => {
          evt.stopPropagation()
          const isExpanding = !card?.classList.contains('expanded')
          card?.classList.toggle('expanded')
          // Bring this tooltip to the front by raising its z-index above all others
          if (isExpanding) {
            for (const t of tooltipEls) t.style.zIndex = ''
            el.style.zIndex = '1000'
            // Pre-offset flyTo so the marker lands EXPECTED_CARD_HEIGHT/2 above viewport center
            const targetZoom = Math.max(map.getZoom(), 14)
            const projected = map.project([s.lat, s.lng], targetZoom)
            const offsetLatLng = map.unproject(projected.subtract([0, EXPECTED_CARD_HEIGHT / 2]), targetZoom)
            map.flyTo(offsetLatLng, targetZoom, { duration: 0.8 })
            // After flyTo, correct for actual vs expected card height
            map.once('moveend', () => {
              if (!card?.classList.contains('expanded')) return
              const actualHeight = card.getBoundingClientRect().height
              const correction = Math.round((actualHeight - EXPECTED_CARD_HEIGHT) / 2)
              if (correction !== 0) map.panBy([0, -correction], { animate: true, duration: 0.3 })
              runPositionLoop()
            })
            const ins = el.querySelector<HTMLElement>('.adsbygoogle')
            if (ins && !ins.dataset.adsbygoogleStatus) {
              const w = window as unknown as { adsbygoogle: object[] }
              w.adsbygoogle = w.adsbygoogle || []
              w.adsbygoogle.push({})
            }
          } else {
            el.style.zIndex = ''
          }
          runPositionLoop()

          if (isExpanding && card) {
            const closeOnOutside = (e: PointerEvent) => {
              if (!card.contains(e.target as Node)) {
                card.classList.remove('expanded')
                runPositionLoop()
                document.removeEventListener('pointerdown', closeOnOutside, true)
              }
            }
            setTimeout(() => document.addEventListener('pointerdown', closeOnOutside, true), 0)
          }
        })

        directions?.addEventListener('click', () => {
          navigator.clipboard?.writeText(s.adresse).catch(() => {})
        })
      })

      clusterGroup.addLayer(marker)
    }

    map.addLayer(clusterGroup)

    return () => {
      map.removeLayer(clusterGroup)
      tooltipEls.clear()
    }
  }, [stations, map])

  return null
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  )
}

function LocateControl() {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    function showGeoError(html: string, timeout: number = 4000) {
      const container = map.getContainer()
      const notice = document.createElement('div')
      notice.style.cssText =
        'position:absolute;top:1rem;left:1rem;right:1rem;z-index:2000;' +
        'background:#fef2f2;border:1px solid #fecaca;border-radius:0.5rem;' +
        'padding:0.75rem 1rem;font-size:0.875rem;color:#b91c1c;box-shadow:0 4px 6px -1px rgba(0,0,0,.1);' +
        'line-height:1.5;max-height:150px;overflow:auto;' +
        'display:flex;align-items:flex-start;gap:0.75rem;'
      const text = document.createElement('div')
      text.style.cssText = 'flex:1;'
      text.innerHTML = html
      const closeBtn = document.createElement('button')
      closeBtn.textContent = '✕'
      closeBtn.style.cssText =
        'flex-shrink:0;background:none;border:none;cursor:pointer;' +
        'color:#f87171;font-size:1rem;line-height:1;padding:0;margin-top:1px;'
      notice.appendChild(text)
      notice.appendChild(closeBtn)
      container.appendChild(notice)
      const timer = setTimeout(() => notice.remove(), timeout)
      closeBtn.addEventListener('click', () => { notice.remove(); clearTimeout(timer) })
    }

    function locate(flyTo: boolean) {
      if (!navigator.geolocation) return
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude)
          if (markerRef.current) {
            markerRef.current.setLatLng(latlng)
          } else {
            markerRef.current = L.marker(latlng, { icon: LOCATION_ICON, zIndexOffset: 1000 }).addTo(map)
          }
          if (flyTo) map.flyTo(latlng, Math.max(map.getZoom(), 12), { duration: 0.8 })
        },
        (err) => {
          if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
            showGeoError(
              '<p><strong>Localisation refusée</strong></p><p>Pour réactiver la localisation:</p>' +
              '<ul style="margin:0.4rem 0 0;padding-left:1.2rem;">' +
              '<li><strong>Sur iOS&nbsp;:</strong> Réglages → Confidentialité → Service de localisation</li>' +
              '<li><strong>Sur Android&nbsp;:</strong> Réglages → Applications → Permissions → Localisation</li>' +
              '</ul>'+
              '<p class="mt-2>Et si ça ne fonctionne toujours pas, veuillez réinitialiser toutes vos préférences de confidentialité et de localisation.</p>',
              10000
            )
          } else if (err.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
            showGeoError('<strong>Position introuvable.</strong> Réessayez dans un moment.')
          } else if (err.code === GeolocationPositionError.TIMEOUT) {
            showGeoError('<strong>Délai dépassé.</strong> La demande de localisation a expiré.')
          } else {
            showGeoError('<strong>Erreur de géolocalisation.</strong>')
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }

    // Auto-locate on load only in browser mode; standalone requires a user gesture
    if (!isStandalone()) locate(true)

    const control = new L.Control({ position: 'topright' })

    control.onAdd = () => {
      const btn = L.DomUtil.create('button', 'leaflet-control-locate')
      btn.title = 'Ma position'
      btn.innerHTML = LOCATE_BTN_SVG

      L.DomEvent.on(btn, 'click', (e) => {
        L.DomEvent.stopPropagation(e)
        locate(true)
      })

      L.DomEvent.disableClickPropagation(btn)
      return btn
    }

    control.addTo(map)
    return () => {
      control.remove()
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
    }
  }, [map])

  return null
}

function MapController({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap()
  useEffect(() => { onMapReady(map) }, [map, onMapReady])
  return null
}

interface MapProps {
  stations: Station[]
  onMapReady: (map: L.Map) => void
}

export function Map({ stations, onMapReady }: MapProps) {
  return (
    <MapContainer
      center={[46.8139, -71.2082]}
      zoom={10}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />
      <ZoomControl position="topright" />
      <MapController onMapReady={onMapReady} />
      <ClusterLayer stations={stations} />
      <LocateControl />
    </MapContainer>
  )
}
