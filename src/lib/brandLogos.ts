interface BrandInfo {
  cssClass: string
  label: string
  color: string
  logoPath?: string
}

const BRAND_MAP: Record<string, BrandInfo> = {
  ultramar:             { cssClass: 'brand-ultramar',          label: 'U',  color: '#e31837', logoPath: '/brands/ultramar.webp' },
  shell:                { cssClass: 'brand-shell',              label: 'S',  color: '#DD1D21', logoPath: '/brands/shell.svg' },
  petrocanada:          { cssClass: 'brand-petrocanada',        label: 'PC', color: '#CC0000', logoPath: '/brands/petrocanada.webp' },
  esso:                 { cssClass: 'brand-esso',               label: 'E',  color: '#003087', logoPath: '/brands/esso.svg' },
  couchetard:           { cssClass: 'brand-couchetard',         label: 'CT', color: '#F16421', logoPath: '/brands/couchetard.svg' },
  'circle k':           { cssClass: 'brand-couchetard',         label: 'CK', color: '#F16421', logoPath: '/brands/circlek.svg' },
  irving:               { cssClass: 'brand-irving',             label: 'I',  color: '#00539B', logoPath: '/brands/irving.svg' },
  costco:               { cssClass: 'brand-costco',             label: 'Co', color: '#005DAA', logoPath: '/brands/costco.svg' },
  metro:                { cssClass: 'brand-metro',              label: 'M',  color: '#E4002B', logoPath: '/brands/metro.svg' },
  supersave:            { cssClass: 'brand-supersave',          label: 'SS', color: '#0071CE' },
  'canadian tire':      { cssClass: 'brand-canadiantire',       label: 'CT', color: '#C8102E', logoPath: '/brands/canadiantire.svg' },
  crevier:              { cssClass: 'brand-crevier',            label: 'Cr', color: '#EB0028', logoPath: '/brands/crevier.svg' },
  harnois:              { cssClass: 'brand-harnois',            label: 'H',  color: '#0057A8', logoPath: '/brands/harnois.webp' },
  pioneer:              { cssClass: 'brand-pioneer',            label: 'P',  color: '#F7941D' },
  axco:                 { cssClass: 'brand-axco',               label: 'Ax', color: '#6b7280', logoPath: '/brands/axco.webp' },
  belzile:              { cssClass: 'brand-belzile',            label: 'Bz', color: '#6b7280', logoPath: '/brands/belzile.webp' },
  belisle:              { cssClass: 'brand-belisle',            label: 'Bs', color: '#6b7280', logoPath: '/brands/belisle.svg' },
  eko:                  { cssClass: 'brand-eko',                label: 'Ek', color: '#2e7d32', logoPath: '/brands/eko.svg' },
  'gaz-o-bar':          { cssClass: 'brand-gazobar',            label: 'GB', color: '#6b7280', logoPath: '/brands/gaz-o-bar.webp' },
  intergaz:             { cssClass: 'brand-intergaz',           label: 'IG', color: '#6b7280', logoPath: '/brands/intergaz.webp' },
  'les huiles berthier':{ cssClass: 'brand-leshuileberthier',   label: 'LH', color: '#6b7280', logoPath: '/brands/les-huiles-berthier.webp' },
  macewen:              { cssClass: 'brand-macewen',            label: 'ME', color: '#d32f2f', logoPath: '/brands/macewen.svg' },
  miraco:               { cssClass: 'brand-miraco',             label: 'Mi', color: '#6b7280', logoPath: '/brands/miraco.webp' },
  mobil:                { cssClass: 'brand-mobil',              label: 'Mo', color: '#CC0000', logoPath: '/brands/mobil.webp' },
  nutrinor:             { cssClass: 'brand-nutrinor',           label: 'Nu', color: '#1565c0', logoPath: '/brands/nutrinor.svg' },
  paddock:              { cssClass: 'brand-paddock',            label: 'Pa', color: '#6b7280', logoPath: '/brands/paddock.webp' },
  paquet:               { cssClass: 'brand-paquet',             label: 'Pq', color: '#6b7280', logoPath: '/brands/paquet.webp' },
  'petro abitemis':     { cssClass: 'brand-petroabitemis',      label: 'PA', color: '#6b7280', logoPath: '/brands/petro-abitemis.webp' },
  petrot:               { cssClass: 'brand-petrot',             label: 'PT', color: '#6b7280', logoPath: '/brands/pétro-t.webp' },
  quickie:              { cssClass: 'brand-quickie',            label: 'Qu', color: '#c62828', logoPath: '/brands/Quickie.webp' },
  'r.l.':               { cssClass: 'brand-rl',                 label: 'RL', color: '#6b7280', logoPath: '/brands/rl-energies.webp' },
  sonerco:              { cssClass: 'brand-sonerco',            label: 'Sn', color: '#6b7280', logoPath: '/brands/sonerco.webp' },
  sonic:                { cssClass: 'brand-sonic',              label: 'So', color: '#1565c0', logoPath: '/brands/sonic.webp' },
  stinson:              { cssClass: 'brand-stinson',            label: 'St', color: '#6b7280', logoPath: '/brands/stinson.webp' },
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/[\s\-_.]/g, '').replace(/[^a-z]/g, '')
}

const NORMALIZED_BRAND_MAP: [string, BrandInfo][] = Object.entries(BRAND_MAP).map(
  ([k, v]) => [normalize(k), v]
)

const GENERIC_EMPTY: BrandInfo = { cssClass: 'brand-generic', label: '⛽', color: '#6b7280' }
const brandCache = new Map<string, BrandInfo>()

export function getBrand(banniere: string): BrandInfo {
  if (!banniere) return GENERIC_EMPTY
  const cached = brandCache.get(banniere)
  if (cached) return cached
  const key = normalize(banniere)
  for (const [k, v] of NORMALIZED_BRAND_MAP) {
    if (key.includes(k)) { brandCache.set(banniere, v); return v }
  }
  const generic: BrandInfo = { cssClass: 'brand-generic', label: banniere.substring(0, 2).toUpperCase(), color: '#6b7280' }
  brandCache.set(banniere, generic)
  return generic
}
