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

function createTooltipContent(s: Station): string {
  const price = s.prixRegulier !== null ? `${s.prixRegulier}¢` : 'N/D'
  const name = s.banniere || s.nom
  return `
    <div class="tooltip-card">
      <div class="tooltip-info">
        <div class="tooltip-name">${name}</div>
        <div class="tooltip-price">${price}</div>
      </div>
    </div>`
}

function formatPrice(p: number | null): string {
  return p !== null ? `${p}¢` : '—'
}

function createPopupContent(s: Station): string {
  const brand = getBrand(s.banniere)
  const name = s.banniere || s.nom
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`
  return `
    <div class="popup-full">
      <div class="popup-header">
        <span class="brand-badge ${brand.cssClass}" style="background:${brand.color}">${brand.label}</span>
        <div class="popup-title">
          <div class="popup-name">${name}</div>
          ${s.nom !== s.banniere ? `<div class="popup-subname">${s.nom}</div>` : ''}
        </div>
      </div>
      <div class="popup-address">${s.adresse}</div>
      <div class="popup-region">${s.codePostal} · ${s.region}</div>
      <div class="popup-prices">
        <div class="popup-price-row">
          <span class="popup-price-label">Régulier</span>
          <span class="popup-price-value">${formatPrice(s.prixRegulier)}</span>
        </div>
        <div class="popup-price-row">
          <span class="popup-price-label">Super</span>
          <span class="popup-price-value">${formatPrice(s.prixSuper)}</span>
        </div>
        <div class="popup-price-row">
          <span class="popup-price-label">Diesel</span>
          <span class="popup-price-value">${formatPrice(s.prixDiesel)}</span>
        </div>
      </div>
      <a class="popup-directions-btn" href="${mapsUrl}" target="_blank" rel="noopener"
         data-address="${s.adresse.replace(/"/g, '&quot;')}">
        Obtenir l'itinéraire
      </a>
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

      marker.bindTooltip(createTooltipContent(s), {
        permanent: true,
        direction: 'top',
        offset: [0, -8],
        className: 'station-tooltip',
      })

      marker.bindPopup(createPopupContent(s), {
        className: 'station-popup',
        maxWidth: 260,
        minWidth: 220,
      })

      // Copy address to clipboard when directions link is clicked
      marker.on('popupopen', (e) => {
        const btn = e.popup.getElement()?.querySelector('.popup-directions-btn')
        if (btn) {
          btn.addEventListener('click', () => {
            navigator.clipboard?.writeText(s.adresse).catch(() => {})
          })
        }
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
      map.setView(e.latlng, 10)
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
        if (userPosRef.current) {
          map.flyTo(userPosRef.current, Math.max(map.getZoom(), 10), { duration: 1 })
        } else {
          map.locate({ enableHighAccuracy: true, setView: false })
        }
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
