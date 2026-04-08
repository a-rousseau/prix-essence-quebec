import type { Station } from '../types/station'
import type { FilterState } from '../types/filter'

export function filterStations(stations: Station[], filterState: FilterState): Station[] {
  const selectedFuelTypes = Object.entries(filterState.fuelTypes)
    .filter(([, selected]) => selected)
    .map(([key]) => key)

  if (selectedFuelTypes.length === 0) {
    return []
  }

  const allowedCompanies = filterState.companies.length > 0
    ? new Set(filterState.companies)
    : null

  return stations.filter(station => {
    const companyMatches = allowedCompanies
      ? allowedCompanies.has(station.banniere)
      : true

    if (!companyMatches) return false

    const hasFuelMatch = selectedFuelTypes.some(fuelType => {
      if (fuelType === 'regulier') return station.prixRegulier !== null
      if (fuelType === 'super') return station.prixSuper !== null
      if (fuelType === 'diesel') return station.prixDiesel !== null
      return false
    })

    return hasFuelMatch
  })
}
