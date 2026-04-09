import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import type { Station } from '../types/station'
import { getBrandLogo } from '../lib/brandLogos'
import { createClusterIcon } from '../lib/clusterIcon'

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_PUBLISHER_ID ?? ''

interface ClusterLayerProps {
  stations: Station[]
  selectedFuelType: 'regulier' | 'super' | 'diesel' | null
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

const LOCATE_BTN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" x2="18" y1="12" y2="12"></line><line x1="6" x2="2" y1="12" y2="12"></line><line x1="12" x2="12" y1="6" y2="2"></line><line x1="12" x2="12" y1="22" y2="18"></line></svg>`

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

function createStationCard(s: Station, selectedFuelType: 'regulier' | 'super' | 'diesel' | null): string {
  const displayName = esc(s.banniere || s.nom)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`
  const badgeHtml = `<img src="${esc(getBrandLogo(s.banniere))}" class="brand-logo" alt="${displayName}" width="28" height="28">`
  const selectedPrice = selectedFuelType === 'regulier' ? s.prixRegulier :
                        selectedFuelType === 'super' ? s.prixSuper :
                        selectedFuelType === 'diesel' ? s.prixDiesel :
                        s.prixRegulier // default to regular if null
  const adSlotHtml = ADSENSE_CLIENT.trim()
    ? `<div class="station-card-ad-container">
         <div class="station-card-sep"></div>
         <ins class="adsbygoogle"
           style="display:block;width:250px"
           data-ad-client="${esc(ADSENSE_CLIENT)}"
           data-ad-slot="3373913657"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
         <div class="station-card-sep"></div>
       </div>`
    : ''

  return `<div class="tooltip-inner">
    <div class="station-card">

      <div class="station-card-compact">
        <div class="station-card-name">${badgeHtml}</div>
        <div class="station-card-price">${fmt(selectedPrice)}</div>
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
            ${selectedFuelType === null || selectedFuelType === 'regulier' ? `<div class="station-card-price-row"><span>Régulier</span><strong>${fmt(s.prixRegulier)}</strong></div>` : ''}
            ${selectedFuelType === null || selectedFuelType === 'super' ? `<div class="station-card-price-row"><span>Super</span><strong>${fmt(s.prixSuper)}</strong></div>` : ''}
            ${selectedFuelType === null || selectedFuelType === 'diesel' ? `<div class="station-card-price-row"><span>Diesel</span><strong>${fmt(s.prixDiesel)}</strong></div>` : ''}
          </div>
          <a class="station-card-directions" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">
            Obtenir l'itinéraire
          </a>
          ${adSlotHtml}
        </div>
      </div>
    </div>
  </div>`
}

function ClusterLayer({ stations, selectedFuelType }: ClusterLayerProps) {
  const map = useMap()
  const tooltipElsRef = useRef(new Set<HTMLElement>())

  useEffect(() => {
    if (stations.length === 0) return

    function getPrice(s: Station): number | null {
      return selectedFuelType === 'super' ? s.prixSuper :
             selectedFuelType === 'diesel' ? s.prixDiesel :
             s.prixRegulier
    }

    let lowest = Infinity, highest = -Infinity
    for (const s of stations) {
      const p = getPrice(s)
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
    const markers: L.CircleMarker[] = []

    // ── Collision-resolution for overlapping tooltips ─────────────────────
    const BASE_HALF_W = 12   // px — half-width of the triangle base on the card
    // Gap between card bottom and marker centre (matches TOOLTIP_OPTIONS offset[1])


    // rAF-debounce so rapid events (tooltipopen storm during zoom) coalesce
    let rafId = 0
    function scheduleSeparate() {
      if (rafId) return
      rafId = requestAnimationFrame(() => { rafId = 0; separateTooltips() })
    }

    function separateTooltips() {
      const PAD = 8
      const mapRect = map.getContainer().getBoundingClientRect()

      interface Item {
        marker: L.CircleMarker
        inner:  HTMLElement
        rect:   DOMRect            // natural (pre-transform) bounding rect
        markerPx: L.Point          // marker pixel coords in container
        offsetX: number
        offsetY: number
      }

      // 1. Reset previous transforms so we read natural (Leaflet-placed) positions
      for (const m of markers) {
        const inner = m.getTooltip()?.getElement()?.querySelector<HTMLElement>('.tooltip-inner')
        if (!inner) continue
        inner.style.transform = ''
      }

      // 2. Collect visible items
      const items: Item[] = []
      for (const m of markers) {
        const inner = m.getTooltip()?.getElement()?.querySelector<HTMLElement>('.tooltip-inner')
        if (!inner) continue
        const rect = inner.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue // hidden inside a cluster
        const markerPx = map.latLngToContainerPoint(m.getLatLng())
        items.push({ marker: m, inner, rect, markerPx, offsetX: 0, offsetY: 0 })
      }

      // 3. Iterative push-apart — marker-direction-aware, horizontal-first
      //    Each card is pushed toward its own marker's side so connectors stay short.
      //    Vertical push is only a last resort (avoids placing a card over its marker).
      const MAX_OFFSET = 70 // px — hard ceiling on displacement from natural position
      for (let iter = 0; iter < 40; iter++) {
        let moved = false
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            const a = items[i], b = items[j]
            const ax1 = a.rect.left - mapRect.left + a.offsetX
            const ax2 = ax1 + a.rect.width  + PAD
            const ay1 = a.rect.top  - mapRect.top  + a.offsetY
            const ay2 = ay1 + a.rect.height + PAD
            const bx1 = b.rect.left - mapRect.left + b.offsetX
            const bx2 = bx1 + b.rect.width  + PAD
            const by1 = b.rect.top  - mapRect.top  + b.offsetY
            const by2 = by1 + b.rect.height + PAD
            const ox = Math.min(ax2, bx2) - Math.max(ax1, bx1)
            const oy = Math.min(ay2, by2) - Math.max(ay1, by1)
            if (ox > 0 && oy > 0) {
              // Determine push direction from marker positions:
              //   push A toward A's marker's side, B toward B's marker's side.
              // Tiebreaker (same X): use array index so the result is stable.
              const mdx = a.markerPx.x - b.markerPx.x
              const dirA = mdx !== 0 ? (mdx > 0 ? 1 : -1) : (i < j ? -1 : 1)

              // Remaining budget for each card in its push direction
              const aUsed = Math.max(0,  dirA * a.offsetX)
              const aRoom = Math.max(0, MAX_OFFSET - aUsed)
              const bUsed = Math.max(0, -dirA * b.offsetX)
              const bRoom = Math.max(0, MAX_OFFSET - bUsed)
              const total = aRoom + bRoom

              if (total > 0.1) {
                // Horizontal push — budget-proportional split
                a.offsetX += dirA * ox * (aRoom / total)
                b.offsetX -= dirA * ox * (bRoom / total)
              } else {
                // Horizontal budget exhausted — push both upward as last resort
                a.offsetY = Math.max(-MAX_OFFSET, a.offsetY - oy / 2)
                b.offsetY = Math.max(-MAX_OFFSET, b.offsetY - oy / 2)
              }
              moved = true
            }
          }
        }
        if (!moved) break
      }

      // Hard-clamp as safety net
      for (const t of items) {
        t.offsetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, t.offsetX))
        t.offsetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, t.offsetY))
      }

      // 4. Apply transform + update SVG connector for every visible item
      for (const t of items) {
        const dx = Math.round(t.offsetX)
        const dy = Math.round(t.offsetY)
        t.inner.style.transform = dx || dy ? `translate(${dx}px,${dy}px)` : ''

        // ── SVG connector ──────────────────────────────────────────────────
        // Coordinate system: origin = top-left of .tooltip-inner (pre-transform).
        // After transform(dx,dy) the card occupies (0,0)→(W,H) in this space.
        // The marker screen position converts to local coords as:
        //   localX = markerPx.x - naturalLeft - dx
        //   localY = markerPx.y - naturalTop  - dy
        const naturalLeft = t.rect.left - mapRect.left
        const naturalTop  = t.rect.top  - mapRect.top
        const tipX = t.markerPx.x - naturalLeft - dx
        const tipY = t.markerPx.y - naturalTop  - dy

        const cardW = t.rect.width
        const cardH = t.rect.height
        // Triangle base: centred at the bottom of the card
        const baseL = cardW / 2 - BASE_HALF_W
        const baseR = cardW / 2 + BASE_HALF_W

        let svg = t.inner.querySelector<SVGSVGElement>('.tooltip-connector')
        if (!svg) {
          svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement
          svg.setAttribute('class', 'tooltip-connector')
          t.inner.appendChild(svg)
        }
        svg.innerHTML =
          `<polygon points="${baseL},${cardH} ${baseR},${cardH} ${tipX},${tipY}" ` +
          `fill="white" stroke="white" stroke-width="1" stroke-linejoin="round"/>`
      }
    }

    for (const s of stations) {
      const marker = L.circleMarker([s.lat, s.lng], {
        ...CIRCLE_MARKER_BASE,
        fillColor: getPriceColor(getPrice(s), lowThreshold, highThreshold, hasRange),
      })

      marker.bindTooltip(() => createStationCard(s, selectedFuelType), TOOLTIP_OPTIONS)

      marker.on('tooltipopen', (e) => {
        scheduleSeparate()   // draw SVG connector as soon as tooltip is in the DOM
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

      markers.push(marker)
      clusterGroup.addLayer(marker)
    }

    map.addLayer(clusterGroup)
    map.on('moveend', scheduleSeparate)
    map.on('zoomend', scheduleSeparate)
    clusterGroup.on('animationend', scheduleSeparate)

    return () => {
      cancelAnimationFrame(rafId)
      map.removeLayer(clusterGroup)
      map.off('moveend', scheduleSeparate)
      map.off('zoomend', scheduleSeparate)
      clusterGroup.off('animationend', scheduleSeparate)
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

    function applyPosition(pos: GeolocationPosition, flyTo: boolean) {
      const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude)
      if (markerRef.current) {
        markerRef.current.setLatLng(latlng)
      } else {
        markerRef.current = L.marker(latlng, { icon: LOCATION_ICON, zIndexOffset: 1000 }).addTo(map)
      }
      if (flyTo) map.flyTo(latlng, Math.max(map.getZoom(), 12), { duration: 0.8 })
    }

    function showLocateError(err: GeolocationPositionError) {
      if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
        showGeoError(
          '<p><strong>Localisation refusée</strong></p><p>Pour réactiver la localisation:</p>' +
          '<ul style="margin:0.4rem 0 0;padding-left:1.2rem;">' +
          '<li><strong>Sur iOS&nbsp;:</strong> Réglages → Confidentialité → Service de localisation</li>' +
          '<li><strong>Sur Android&nbsp;:</strong> Réglages → Applications → Permissions → Localisation</li>' +
          '</ul>' +
          '<p>Et si ça ne fonctionne toujours pas, veuillez réinitialiser toutes vos préférences de confidentialité et de localisation.</p>',
          10000
        )
      } else if (err.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
        showGeoError('<strong>Position introuvable.</strong> Réessayez dans un moment.')
      } else if (err.code === GeolocationPositionError.TIMEOUT) {
        showGeoError('<strong>Délai dépassé.</strong> Réessayez dans un endroit avec meilleure réception.')
      } else {
        showGeoError('<strong>Erreur de géolocalisation.</strong>')
      }
    }

    function locate(flyTo: boolean) {
      if (!navigator.geolocation) return
      // First try: low accuracy, fast (uses network/cell — works reliably on Android)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyPosition(pos, flyTo)
          // Second try in background: refine with GPS if better accuracy available
          navigator.geolocation.getCurrentPosition(
            (refinedPos) => applyPosition(refinedPos, false),
            () => { /* ignore refinement errors — we already have a position */ },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
          )
        },
        (err) => {
          // Low accuracy failed — try high accuracy as fallback before showing error
          navigator.geolocation.getCurrentPosition(
            (pos) => applyPosition(pos, flyTo),
            () => showLocateError(err),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
          )
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
      )
    }

    // Auto-locate on load only in browser mode; standalone requires a user gesture
    if (!isStandalone()) locate(true)

    const control = new L.Control({ position: 'bottomright' })

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
  selectedFuelType: 'regulier' | 'super' | 'diesel' | null
}

export function Map({ stations, onMapReady, selectedFuelType }: MapProps) {
  return (
    <MapContainer
      center={[46.8139, -71.2082]}
      zoom={10}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> | Données: <a href='https://regieessencequebec.ca'>Régie de l'énergie du Québec</a>"
        maxZoom={19}
      />
      <ZoomControl position="bottomright" />
      <MapController onMapReady={onMapReady} />
      <ClusterLayer stations={stations} selectedFuelType={selectedFuelType} />
      <LocateControl />
    </MapContainer>
  )
}
