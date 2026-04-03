import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import type { Station } from '../types/station'
import { getBrand } from '../lib/brandLogos'
import { createClusterIcon } from '../lib/clusterIcon'

interface ClusterLayerProps {
  stations: Station[]
}

const PRICE_COLORS = {
  low:  '#16a34a',
  mid:  '#f59e0b',
  high: '#dc2626',
  none: '#6b7280',
}

function getPriceColor(price: number | null, lowest: number, highest: number): string {
  if (price === null) return PRICE_COLORS.none
  const range = highest - lowest
  if (range === 0) return PRICE_COLORS.mid
  const third = range / 3
  if (price <= lowest + third) return PRICE_COLORS.low
  if (price <= lowest + 2 * third) return PRICE_COLORS.mid
  return PRICE_COLORS.high
}

function fmt(p: number | null): string {
  return p !== null ? `${p}¢` : '—'
}

function createStationCard(s: Station): string {
  const brand = getBrand(s.banniere)
  const displayName = s.banniere || s.nom
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`
  const badgeHtml = brand.logoPath
    ? `<img src="${brand.logoPath}" class="brand-logo" alt="${displayName}" width="28" height="28">`
    : `<span class="brand-badge ${brand.cssClass}" style="background:${brand.color}">${brand.label}</span>`
  return `
    <div class="station-card">

      <div class="station-card-compact">
        <div class="station-card-name">${badgeHtml}</div>
        <div class="station-card-price">${fmt(s.prixRegulier)}</div>
      </div>
      <div class="station-card-details">
        <div class="station-card-details-inner">
          <div class="station-card-header">
            ${badgeHtml}
            <div>
              <div class="station-card-fullname">${s.nom}</div>
              <div class="station-card-address">${s.adresse}</div>
              <div class="station-card-region">${s.codePostal} · ${s.region}</div>
            </div>
          </div>
          <div class="station-card-prices">
            <div class="station-card-price-row"><span>Régulier</span><strong>${fmt(s.prixRegulier)}</strong></div>
            <div class="station-card-price-row"><span>Super</span><strong>${fmt(s.prixSuper)}</strong></div>
            <div class="station-card-price-row"><span>Diesel</span><strong>${fmt(s.prixDiesel)}</strong></div>
          </div>
          <a class="station-card-directions" href="${mapsUrl}" target="_blank" rel="noopener">
            Obtenir l'itinéraire
          </a>
          <div class="station-card-sep"></div>
        </div>
      </div>
    </div>`
}

function ClusterLayer({ stations }: ClusterLayerProps) {
  const map = useMap()
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)

  useEffect(() => {
    if (stations.length === 0) return

    const prices = stations
      .map((s) => s.prixRegulier)
      .filter((p): p is number => p !== null)
    const lowest = prices.length ? Math.min(...prices) : 0
    const highest = prices.length ? Math.max(...prices) : 0

    const clusterGroup = L.markerClusterGroup({
      iconCreateFunction: createClusterIcon,
      maxClusterRadius: 60,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 14,
    })

    stations.forEach((s) => {
      const marker = L.circleMarker([s.lat, s.lng], {
        radius: 8,
        fillColor: getPriceColor(s.prixRegulier, lowest, highest),
        color: '#fff',
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.9,
      })

      marker.bindTooltip(createStationCard(s), {
        permanent: true,
        direction: 'top',
        offset: [0, -8],
        className: 'station-tooltip',
        interactive: true,
      })

      interface LeafletTooltipInternal extends L.Tooltip {
        _updatePosition(): void
      }

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

        compact?.addEventListener('click', (evt) => {
          evt.stopPropagation()
          const isExpanding = !card?.classList.contains('expanded')
          card?.classList.toggle('expanded')
          // Bring this tooltip to the front by raising its z-index above all others
          if (isExpanding) {
            document.querySelectorAll<HTMLElement>('.station-tooltip').forEach(t => {
              t.style.zIndex = ''
            })
            el.style.zIndex = '1000'
          } else {
            el.style.zIndex = ''
          }
          runPositionLoop()

          if (isExpanding && card) {
            const closeOnOutside = (e: MouseEvent) => {
              if (!card.contains(e.target as Node)) {
                card.classList.remove('expanded')
                runPositionLoop()
                document.removeEventListener('click', closeOnOutside, true)
              }
            }
            setTimeout(() => document.addEventListener('click', closeOnOutside, true), 0)
          }
        })

        directions?.addEventListener('click', () => {
          navigator.clipboard?.writeText(s.adresse).catch(() => {})
        })
      })

      clusterGroup.addLayer(marker)
    })

    map.addLayer(clusterGroup)
    clusterRef.current = clusterGroup

    return () => {
      map.removeLayer(clusterGroup)
      clusterRef.current = null
    }
  }, [stations, map])

  return null
}

function UserLocation({ userPosRef }: { userPosRef: { current: L.LatLng | null } }) {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    const icon = L.divIcon({
      className: '',
      html: `<div class="user-location-outer">
               <div class="user-location-pulse"></div>
               <div class="user-location-dot"></div>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    map.locate({ enableHighAccuracy: true })

    map.on('locationfound', (e) => {
      userPosRef.current = e.latlng
      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng)
      } else {
        markerRef.current = L.marker(e.latlng, { icon, zIndexOffset: 1000 })
          .addTo(map)
      }
      map.setView(e.latlng, 12)
    })

    return () => {
      map.off('locationfound')
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
    }
  }, [map, userPosRef])

  return null
}

function LocateControl({ userPosRef }: { userPosRef: { current: L.LatLng | null } }) {
  const map = useMap()

  useEffect(() => {
    const control = new L.Control({ position: 'topright' })

    control.onAdd = () => {
      const btn = L.DomUtil.create('button', 'leaflet-control-locate')
      btn.title = 'Ma position'
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        <circle cx="12" cy="12" r="8" stroke-dasharray="2 4"/>
      </svg>`

      L.DomEvent.on(btn, 'click', (e) => {
        L.DomEvent.stopPropagation(e)
        // Always call locate — this triggers the browser permission prompt on first tap.
        // Once locationfound fires, setView handles the fly-to.
        map.locate({ enableHighAccuracy: true, setView: false })
      })

      L.DomEvent.disableClickPropagation(btn)
      return btn
    }

    control.addTo(map)
    return () => { control.remove() }
  }, [map, userPosRef])

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
  const userPosRef = useRef<L.LatLng | null>(null)

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
      <UserLocation userPosRef={userPosRef} />
      <LocateControl userPosRef={userPosRef} />
    </MapContainer>
  )
}
