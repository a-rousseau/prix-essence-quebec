import type { Station } from '../types/station'
import type { FilterState } from '../types/filter'
import { FuelTypeBadges } from './FuelTypeBadges'
import { BrandDropdown } from './BrandDropdown'

interface FilterPanelProps {
  filterState: FilterState
  onFilterChange: (filterState: FilterState) => void
  stations: Station[]
}

export function FilterPanel({ filterState, onFilterChange, stations }: FilterPanelProps) {
  const availableBrands = Array.from(new Set(stations.map(s => s.banniere).filter(Boolean))).sort()
  const selectedBrands = filterState.companies

  function handleSelectFuel(fuelType: 'regulier' | 'super' | 'diesel' | null) {
    onFilterChange({
      ...filterState,
      selectedFuelType: fuelType,
    })
  }

  function handleBrandsChange(brands: string[]) {
    onFilterChange({ ...filterState, companies: brands })
  }

  return (
    <div className="w-full">
      <div className="flex flex-row gap-2">
        <div>
          <FuelTypeBadges selectedFuelType={filterState.selectedFuelType} onSelect={handleSelectFuel} />
        </div>
        <div>
          <BrandDropdown
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            onBrandsChange={handleBrandsChange}
          />
        </div>
      </div>
    </div>
  )
}
