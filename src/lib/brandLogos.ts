interface BrandInfo {
  cssClass: string
  label: string
  color: string
  logoPath?: string
}

const BRAND_MAP: Record<string, BrandInfo> = {
  ultramar:       { cssClass: 'brand-ultramar',     label: 'U',  color: '#e31837', logoPath: '/brands/ultramar.webp' },
  shell:          { cssClass: 'brand-shell',         label: 'S',  color: '#DD1D21', logoPath: '/brands/shell.svg' },
  petrocanada:    { cssClass: 'brand-petrocanada',   label: 'PC', color: '#CC0000', logoPath: '/brands/petrocanada.webp' },
  esso:           { cssClass: 'brand-esso',          label: 'E',  color: '#003087', logoPath: '/brands/esso.svg' },
  couchetard:     { cssClass: 'brand-couchetard',    label: 'CT', color: '#F16421', logoPath: '/brands/couchetard.svg' },
  'circle k':     { cssClass: 'brand-couchetard',    label: 'CK', color: '#F16421', logoPath: '/brands/circlek.svg' },
  irving:         { cssClass: 'brand-irving',        label: 'I',  color: '#00539B', logoPath: '/brands/irving.svg' },
  costco:         { cssClass: 'brand-costco',        label: 'Co', color: '#005DAA', logoPath: '/brands/costco.svg' },
  metro:          { cssClass: 'brand-metro',         label: 'M',  color: '#E4002B', logoPath: '/brands/metro.svg' },
  supersave:      { cssClass: 'brand-supersave',     label: 'SS', color: '#0071CE' },
  'canadian tire':{ cssClass: 'brand-canadiantire',  label: 'CT', color: '#C8102E', logoPath: '/brands/canadiantire.svg' },
  crevier:        { cssClass: 'brand-crevier',       label: 'Cr', color: '#EB0028', logoPath: '/brands/crevier.svg' },
  harnois:        { cssClass: 'brand-harnois',       label: 'H',  color: '#0057A8', logoPath: '/brands/harnois.webp' },
  pioneer:        { cssClass: 'brand-pioneer',       label: 'P',  color: '#F7941D' },
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/[\s\-_.]/g, '').replace(/[^a-z]/g, '')
}

export function getBrand(banniere: string): BrandInfo {
  if (!banniere) return { cssClass: 'brand-generic', label: '⛽', color: '#6b7280' }
  const key = normalize(banniere)
  for (const [k, v] of Object.entries(BRAND_MAP)) {
    if (key.includes(normalize(k))) return v
  }
  return { cssClass: 'brand-generic', label: banniere.substring(0, 2).toUpperCase(), color: '#6b7280' }
}
