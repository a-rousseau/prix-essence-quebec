import { useState, useEffect, useRef, useCallback } from 'react'
import type L from 'leaflet'

interface PhotonFeature {
  geometry: { coordinates: [number, number] }
  properties: {
    name?: string
    street?: string
    housenumber?: string
    city?: string
    state?: string
    country?: string
    type?: string
  }
}

interface SearchResult {
  label: string
  sublabel: string
  lat: number
  lng: number
}

function buildLabel(p: PhotonFeature['properties']): { label: string; sublabel: string } {
  const parts: string[] = []
  if (p.name) parts.push(p.name)
  else {
    if (p.housenumber) parts.push(p.housenumber)
    if (p.street) parts.push(p.street)
  }
  const sub: string[] = []
  if (p.name && p.street) sub.push(`${p.housenumber ?? ''} ${p.street}`.trim())
  if (p.city) sub.push(p.city)
  if (p.state) sub.push(p.state)
  return {
    label: parts.join(' ') || p.city || p.state || '',
    sublabel: sub.join(', '),
  }
}

const PHOTON_BASE_URL = 'https://photon.komoot.io/api/?lang=fr&limit=6&lat=46.8&lon=-71.2&q='
const INPUT_STYLE = { fontSize: '16px' }

interface SearchBarProps {
  map: L.Map | null
}

export function SearchBar({ map }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return }

    controllerRef.current?.abort()
    controllerRef.current = new AbortController()

    try {
      const res = await fetch(PHOTON_BASE_URL + encodeURIComponent(q), { signal: controllerRef.current.signal })
      const data: { features: PhotonFeature[] } = await res.json()

      const mapped: SearchResult[] = data.features.map((f) => {
        const { label, sublabel } = buildLabel(f.properties)
        return { label, sublabel, lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] }
      })

      setResults(mapped)
      setOpen(mapped.length > 0)
      setActiveIdx(-1)
    } catch {
      // aborted or network error — ignore
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 280)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function select(r: SearchResult) {
    setQuery(r.label)
    setOpen(false)
    inputRef.current?.blur()
    map?.flyTo([r.lat, r.lng], 15, { duration: 1.0 })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      select(results[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function clear() {
    setQuery('')
    setResults([])
    setOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div
      ref={containerRef}
      className="w-full"
    >
      <div className="relative">
        {/* Search icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Rechercher une adresse..."
          className="w-full pl-9 pr-8 py-2 rounded-md bg-white/95 backdrop-blur-sm border border-gray-200 shadow-map text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
          style={INPUT_STYLE}
        />

        {query && (
          <button
            onClick={clear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Effacer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <ul className="mt-1 bg-white/95 backdrop-blur-sm rounded-md border border-gray-200 shadow-map overflow-hidden">
          {results.map((r, i) => (
            <li key={`${r.lat},${r.lng}`}>
              <button
                className={`w-full text-left px-4 py-2.5 flex flex-col gap-0.5 transition-colors ${i === activeIdx ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onMouseDown={() => select(r)}
              >
                <span className="text-sm font-medium text-gray-800 truncate">{r.label}</span>
                {r.sublabel && (
                  <span className="text-xs text-gray-500 truncate">{r.sublabel}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
