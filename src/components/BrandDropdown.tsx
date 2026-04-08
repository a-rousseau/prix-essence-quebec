import { useState } from 'react'

interface BrandDropdownProps {
  selectedBrands: string[]
  availableBrands: string[]
  onBrandsChange: (brands: string[]) => void
}

export function BrandDropdown({ selectedBrands, availableBrands, onBrandsChange }: BrandDropdownProps) {
  const [open, setOpen] = useState(false)

  const allSelected = selectedBrands.length === availableBrands.length && availableBrands.length > 0
  const label = allSelected ? 'Toutes les bannières' : `${selectedBrands.length} sélectionnée${selectedBrands.length === 1 ? '' : 's'}`

  function toggleBrand(brand: string) {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(item => item !== brand))
      return
    }
    onBrandsChange([...selectedBrands, brand])
  }

  function selectAll() {
    onBrandsChange([...availableBrands])
  }

  function clearAll() {
    onBrandsChange([])
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(open => !open)}
        className="w-full text-left px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-between text-sm text-gray-700 hover:bg-gray-50 transition"
      >
        <span>{label}</span>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="max-h-52 overflow-y-auto p-3 space-y-2">
            {availableBrands.length === 0 ? (
              <div className="text-sm text-gray-500">Aucune bannière disponible</div>
            ) : (
              availableBrands.map(brand => (
                <label key={brand} className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md px-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="truncate">{brand || 'Sans marque'}</span>
                </label>
              ))
            )}
          </div>
          <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between gap-2 bg-gray-50">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Tout sélectionner
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-gray-600 hover:text-gray-800"
            >
              Tout effacer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
