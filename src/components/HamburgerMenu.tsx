import type { ReactNode } from 'react'
import { ADS_ENABLED } from '../lib/adConsent'

interface HamburgerMenuProps {
  onClose: () => void
  onPrivacy: () => void
  onTrademarks: () => void
  onCookies: () => void
}

export function HamburgerMenu({ onClose, onPrivacy, onTrademarks, onCookies }: HamburgerMenuProps) {
  return (
    <>
      <div className="fixed inset-0 z-[2900]" onClick={onClose} />
      <div
        className="fixed top-0 left-0 right-0 z-[3000] bg-white border-b border-gray-200 shadow-lg"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px))' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-800">Menu</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fermer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <MenuItem
          label="Politique de confidentialité"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
          onClick={() => { onClose(); onPrivacy() }}
        />
        <MenuItem
          label="Marques & logos"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
          onClick={() => { onClose(); onTrademarks() }}
        />
        {ADS_ENABLED && (
          <MenuItem
            label="Cookies"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/></svg>}
            onClick={() => { onClose(); onCookies() }}
          />
        )}
        <a
          href="https://github.com/a-rousseau/prix-essence-quebec/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
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
