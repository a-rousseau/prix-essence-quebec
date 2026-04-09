interface FuelTypeBadgesProps {
  selectedFuelType: 'regulier' | 'super' | 'diesel' | null
  onSelect: (fuelType: 'regulier' | 'super' | 'diesel' | null) => void
}

const fuelTypes = [
  { label: 'Régulier', key: 'regulier' as const },
  { label: 'Super', key: 'super' as const },
  { label: 'Diésel', key: 'diesel' as const },
]

export function FuelTypeBadges({ selectedFuelType, onSelect }: FuelTypeBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {fuelTypes.map(({ label, key }) => {
        const active = selectedFuelType === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border shadow-map ${active ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-700 border-gray-400 hover:bg-gray-200'}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
