import type { ReactNode } from 'react'
import { X, Shield, HelpCircle, Cookie, Info } from 'lucide-react'
import { ADS_ENABLED } from '../lib/adConsent'

interface HamburgerMenuProps {
  open: boolean
  onClose: () => void
  onPrivacy: () => void
  onTrademarks: () => void
  onCookies: () => void
}

export function HamburgerMenu({ open, onClose, onPrivacy, onTrademarks, onCookies }: HamburgerMenuProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[2900] bg-black/50 transition-opacity duration-300 ease-in-out ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full z-[3000] w-72 max-w-[80vw] bg-white border-b border-gray-200 shadow-xl overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-800"><img src="/brands/genericpump.svg" alt="Essence QC" className="w-6 h-6 mr-2" style={{ display: 'inline-block' }} />Essence QC</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <MenuItem
          label="Politique de confidentialité"
          icon={<Shield size={17} />}
          onClick={() => { onClose(); setTimeout(onPrivacy, 300) }}
        />
        <MenuItem
          label="Marques & logos"
          icon={<HelpCircle size={17} />}
          onClick={() => { onClose(); setTimeout(onTrademarks, 300) }}
        />
        {ADS_ENABLED && (
          <MenuItem
            label="Cookies"
            icon={<Cookie size={17} />}
            onClick={() => { onClose(); setTimeout(onCookies, 300) }}
          />
        )}
        <a
          href="https://github.com/a-rousseau/prix-essence-quebec/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          <Info size={17} />
          <span>Bugs et suggestions</span>
        </a>
      </div>
    </>
  )
}

function MenuItem({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100 w-full text-left"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
