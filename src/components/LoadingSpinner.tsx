export function LoadingSpinner() {
  return (
    <div className="absolute inset-0 z-[2000] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
        <p className="text-gray-600 text-sm font-medium">Chargement des prix...</p>
      </div>
    </div>
  )
}
