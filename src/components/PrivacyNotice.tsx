import { useEffect, useRef } from 'react'
import { ADS_ENABLED } from '../lib/adConsent'

interface PrivacyNoticeProps {
  open: boolean
  onClose: () => void
}

export function PrivacyNotice({ open, onClose }: PrivacyNoticeProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) closeButtonRef.current?.focus()
  }, [open])

  return (
    <>
      <div
        className={`fixed inset-0 z-[2900] bg-black/50 transition-opacity duration-300 ease-in-out ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Politique de confidentialité"
        className={`fixed bottom-0 left-0 right-0 z-[3000] bg-white border-t border-gray-200 shadow-lg px-4 py-4 flex flex-col gap-3 transition-all duration-300 ease-in-out ${
          open ? 'translate-y-0 inset-100' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex-2 grow flex-col gap-1">
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
          ref={closeButtonRef}
          onClick={onClose}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Fermer
        </button>
      </div>
    </>
  )
}
