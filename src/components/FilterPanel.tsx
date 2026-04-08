import type { Station } from '../types/station'
import type { FilterState } from '../types/filter'
import { FuelTypeBadges } from './FuelTypeBadges'
import { BrandDropdown } from './BrandDropdown'

interface FilterPanelProps {
  open: boolean
  filterState: FilterState
  onFilterChange: (filterState: FilterState) => void
  stations: Station[]
}

export function FilterPanel({ open, filterState, onFilterChange, stations }: FilterPanelProps) {
  if (!open) return null

  const availableBrands = Array.from(new Set(stations.map(s => s.banniere).filter(Boolean))).sort()
  const selectedBrands = filterState.companies.length > 0 ? filterState.companies : availableBrands

  function handleToggleFuel(fuelType: 'regulier' | 'super' | 'diesel') {
    onFilterChange({
      ...filterState,
      fuelTypes: { ...filterState.fuelTypes, [fuelType]: !filterState.fuelTypes[fuelType] },
    })
  }

  function handleBrandsChange(brands: string[]) {
    onFilterChange({ ...filterState, companies: brands })
  }

  return (
    <div className="w-full rounded-3xl border border-gray-200 bg-white/95 backdrop-blur-sm shadow-2xl p-4">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-900 mb-2">Types de carburant</div>
          <FuelTypeBadges filterState={filterState.fuelTypes} onToggle={handleToggleFuel} />
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-900 mb-2">Bannières</div>
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
