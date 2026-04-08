// Set to true when ads are active
export const ADS_ENABLED = false

const CONSENT_KEY = 'ad-consent'
const CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000 // 6 mois (Loi 25)
const ADSENSE_PUBLISHER_ID = import.meta.env.VITE_ADSENSE_PUBLISHER_ID ?? ''

interface ConsentEntry {
  value: 'accepted' | 'refused'
  expiresAt: number
}

export function getAdConsent(): 'accepted' | 'refused' | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const entry: ConsentEntry = JSON.parse(raw)
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(CONSENT_KEY)
      return null
    }
    return entry.value
  } catch {
    localStorage.removeItem(CONSENT_KEY)
    return null
  }
}

export function saveConsent(value: 'accepted' | 'refused') {
  const entry: ConsentEntry = { value, expiresAt: Date.now() + CONSENT_DURATION_MS }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(entry))
}

export function clearAdConsent() {
  localStorage.removeItem(CONSENT_KEY)
}

export function loadAdSense() {
  if (!ADSENSE_PUBLISHER_ID.trim()) return
  if (document.querySelector('script[data-adsense]')) return
  const preconnect = document.createElement('link')
  preconnect.rel = 'preconnect'
  preconnect.href = 'https://pagead2.googlesyndication.com'
  document.head.appendChild(preconnect)
  const script = document.createElement('script')
  script.async = true
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`
  script.crossOrigin = 'anonymous'
  script.dataset.adsense = '1'
  document.head.appendChild(script)
}
