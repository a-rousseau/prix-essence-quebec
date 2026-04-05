import { ADS_ENABLED } from '../lib/adConsent'

interface PrivacyNoticeProps {
  onClose: () => void
}

export function PrivacyNotice({ onClose }: PrivacyNoticeProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[3000] bg-white border-t border-gray-200 shadow-lg px-4 py-4 flex flex-col gap-3"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-800">Politique de confidentialité</p>
        <p className="text-sm text-gray-600 leading-snug">
          Ce site ne collecte aucune donnée personnelle vous concernant. Aucun compte, formulaire
          ou traçage individuel n'est utilisé. Les seules données affichées sont les prix des
          stations-service publiés par la{' '}
          <a href="https://regieessencequebec.ca" target="_blank" rel="noopener noreferrer" className="underline">
            Régie de l'énergie du Québec
          </a>.
          {ADS_ENABLED && (
            <> Des cookies publicitaires peuvent être déposés par Google AdSense si vous y avez consenti via le menu.</>
          )}
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
