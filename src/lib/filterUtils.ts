import type { Station } from '../types/station'
import type { FilterState } from '../types/filter'

export function filterStations(stations: Station[], filterState: FilterState): Station[] {
  const selectedFuelType = filterState.selectedFuelType

  const allowedCompanies = filterState.companies.length > 0
    ? new Set(filterState.companies)
    : null

  return stations.filter(station => {
    const companyMatches = allowedCompanies
      ? allowedCompanies.has(station.banniere)
      : true

    if (!companyMatches) return false

    // If no fuel type selected, show all stations
    if (selectedFuelType === null) return station.prixRegulier !== null

    // Check if station has the selected fuel type
    if (selectedFuelType === 'regulier') return station.prixRegulier !== null
    if (selectedFuelType === 'super') return station.prixSuper !== null
    if (selectedFuelType === 'diesel') return station.prixDiesel !== null

    return false
  })
}
