import { saveConsent } from '../lib/adConsent'

interface ConsentBannerProps {
  onConsent: (accepted: boolean) => void
}

export function ConsentBanner({ onConsent }: ConsentBannerProps) {
  function accept() {
    saveConsent('accepted')
    onConsent(true)
  }

  function refuse() {
    saveConsent('refused')
    onConsent(false)
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[3000] bg-white border-t border-gray-200 shadow-lg px-4 py-4 flex flex-col gap-3"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-800">Cookies et vie privée</p>
        <p className="text-sm text-gray-600 leading-snug">
          Ce site utilise <strong>Google AdSense</strong> pour afficher des publicités qui financent son fonctionnement.
          Ce service dépose des cookies publicitaires sur votre appareil. Votre consentement est valide <strong>6 mois</strong> et
          peut être retiré à tout moment via le lien «&nbsp;Cookies&nbsp;» en bas de l'écran. Aucune information personnelle n'est collectée par ce site, et les données de navigation utilisées par Google AdSense sont anonymisées. 
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={refuse}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Refuser
        </button>
        <button
          onClick={accept}
          className="flex-1 px-4 py-2 rounded-lg border border-[#1e3a5f] bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#2d5282] transition-colors"
        >
          Accepter
        </button>
      </div>
    </div>
  )
}
