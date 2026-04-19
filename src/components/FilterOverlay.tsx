interface FilterOverlayProps {
  visible: boolean
}

export function FilterOverlay({ visible }: FilterOverlayProps) {
  return (
    <div
      className={`absolute inset-0 z-[2000] flex items-center justify-center bg-black/40 transition-opacity duration-150 ease-in-out ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      aria-hidden="true"
    >
      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )
}
