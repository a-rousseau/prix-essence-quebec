interface TrademarkNoticeProps {
  onClose: () => void
}

export function TrademarkNotice({ onClose }: TrademarkNoticeProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[3000] bg-white border-t border-gray-200 shadow-lg px-4 py-4 flex flex-col gap-3"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-800">Marques de commerce</p>
        <p className="text-sm text-gray-600 leading-snug">
          Les marques de commerce et logos affichés sur ce site sont la propriété de leurs détenteurs respectifs.
          Leur utilisation est à titre indicatif uniquement et n'implique aucune affiliation ni approbation de leur part.
        </p>
      </div>
      <button
        onClick={onClose}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        Fermer
      </button>
    </div>
  )
}
