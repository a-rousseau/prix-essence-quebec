import type { FilterState } from '../types/filter'

interface FuelTypeBadgesProps {
  filterState: FilterState['fuelTypes']
  onToggle: (fuelType: 'regulier' | 'super' | 'diesel') => void
}

const fuelTypes = [
  { label: 'Regular', key: 'regulier' as const },
  { label: 'Super', key: 'super' as const },
  { label: 'Diesel', key: 'diesel' as const },
]

export function FuelTypeBadges({ filterState, onToggle }: FuelTypeBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {fuelTypes.map(({ label, key }) => {
        const active = filterState[key]
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${active ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
