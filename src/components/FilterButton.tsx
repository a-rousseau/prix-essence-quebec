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
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16" />
        <path d="M7 11h10" />
        <path d="M10 18h4" />
        <path d="M7 4L12 11L17 4" />
        <path d="M10 11L12 18L14 11" />
      </svg>
    </button>
  )
}
