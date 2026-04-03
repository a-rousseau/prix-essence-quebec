interface BrandInfo {
  cssClass: string
  label: string
  color: string
}

const BRAND_MAP: Record<string, BrandInfo> = {
  ultramar:      { cssClass: 'brand-ultramar',      label: 'U',  color: '#e31837' },
  shell:         { cssClass: 'brand-shell',          label: 'S',  color: '#DD1D21' },
  petrocanada:   { cssClass: 'brand-petrocanada',    label: 'PC', color: '#CC0000' },
  esso:          { cssClass: 'brand-esso',           label: 'E',  color: '#003087' },
  couchetard:    { cssClass: 'brand-couchetard',     label: 'CT', color: '#F16421' },
  irving:        { cssClass: 'brand-irving',         label: 'I',  color: '#00539B' },
  pioneer:       { cssClass: 'brand-pioneer',        label: 'P',  color: '#F7941D' },
  costco:        { cssClass: 'brand-costco',         label: 'Co', color: '#005DAA' },
  metro:         { cssClass: 'brand-metro',          label: 'M',  color: '#E4002B' },
  supersave:     { cssClass: 'brand-supersave',      label: 'SS', color: '#0071CE' },
  'canadian tire': { cssClass: 'brand-canadiantire', label: 'CT', color: '#C8102E' },
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
