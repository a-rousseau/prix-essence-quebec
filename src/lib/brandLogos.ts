const BRAND_LOGOS: Record<string, string> = {
  ultramar:              '/brands/ultramar.webp',
  shell:                 '/brands/shell.svg',
  petrocanada:           '/brands/petrocanada.webp',
  esso:                  '/brands/esso.svg',
  couchetard:            '/brands/couchetard.svg',
  'circle k':            '/brands/circlek.svg',
  irving:                '/brands/irving.svg',
  costco:                '/brands/costco.svg',
  metro:                 '/brands/metro.svg',
  'canadian tire':       '/brands/canadiantire.svg',
  crevier:               '/brands/crevier.svg',
  harnois:               '/brands/harnois.webp',
  axco:                  '/brands/axco.webp',
  belzile:               '/brands/belzile.webp',
  belisle:               '/brands/belisle.svg',
  eko:                   '/brands/eko.svg',
  'gaz-o-bar':           '/brands/gaz-o-bar.webp',
  intergaz:              '/brands/intergaz.webp',
  'les huiles berthier': '/brands/les-huiles-berthier.webp',
  macewen:               '/brands/macewen.svg',
  miraco:                '/brands/miraco.webp',
  mobil:                 '/brands/mobil.webp',
  nutrinor:              '/brands/nutrinor.svg',
  paddock:               '/brands/paddock.webp',
  paquet:                '/brands/paquet.webp',
  'petro abitemis':      '/brands/petro-abitemis.webp',
  petrot:                '/brands/pétro-t.webp',
  quickie:               '/brands/Quickie.webp',
  'r.l.':                '/brands/rl-energies.webp',
  sonerco:               '/brands/sonerco.webp',
  sonic:                 '/brands/sonic.webp',
  stinson:               '/brands/stinson.webp',
}

const GENERIC_LOGO = '/brands/genericpump.svg'

function normalize(name: string): string {
  return name.toLowerCase().replace(/[\s\-_.]/g, '').replace(/[^a-z]/g, '')
}

const NORMALIZED_LOGOS: [string, string][] = Object.entries(BRAND_LOGOS).map(
  ([k, v]) => [normalize(k), v]
)

const logoCache = new Map<string, string>()

export function getBrandLogo(banniere: string): string {
  if (!banniere) return GENERIC_LOGO
  const cached = logoCache.get(banniere)
  if (cached) return cached
  const key = normalize(banniere)
  for (const [k, v] of NORMALIZED_LOGOS) {
    if (key.includes(k)) { logoCache.set(banniere, v); return v }
  }
  logoCache.set(banniere, GENERIC_LOGO)
  return GENERIC_LOGO
}
