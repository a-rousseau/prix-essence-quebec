import { ListFilter } from 'lucide-react'

interface FilterButtonProps {
  onClick: () => void
  isActive: boolean
}

export function FilterButton({ onClick, isActive }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Filters"
      className={`w-10 h-10 flex items-center justify-center rounded-lg border shadow-lg transition-colors ${isActive ? 'bg-white/95 border-blue-500 text-blue-700' : 'bg-white/95 border-gray-200 text-gray-700 hover:bg-gray-50'}`}
    >
      <ListFilter size={18} />
    </button>
  )
}
