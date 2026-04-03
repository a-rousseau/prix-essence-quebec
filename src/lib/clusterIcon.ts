import L from 'leaflet'

export function createClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  const count = cluster.getChildCount()
  const size = count < 10 ? 36 : count < 50 ? 44 : 52

  return L.divIcon({
    html: `<div class="cluster-icon" style="width:${size}px;height:${size}px">
             <span class="cluster-count">${count}</span>
           </div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}
