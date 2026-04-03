import type { Config } from '@netlify/functions'
import { read, utils } from 'xlsx'

interface RawRow {
  Nom?: unknown
  Bannière?: unknown
  Adresse?: unknown
  Région?: unknown
  'Code Postal'?: unknown
  Latitude?: unknown
  Longitude?: unknown
  'Prix Régulier'?: unknown
  'Prix Super'?: unknown
  'Prix Diesel'?: unknown
}

function parsePrice(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null
  const num = parseFloat(String(val).replace(/[^\d.]/g, ''))
  return isNaN(num) ? null : num
}

function extractTimestamp(filename: string): string {
  // filename format: stations-YYYYMMDDHHMMSS.xlsx
  const match = filename.match(/stations-(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.xlsx/)
  if (!match) return new Date().toISOString()
  const [, year, month, day, hour, min, sec] = match
  return `${year}-${month}-${day}T${hour}:${min}:${sec}`
}

export default async (_req: Request): Promise<Response> => {
  try {
    // Step 1: Fetch the page HTML to find current Excel URL
    const pageResponse = await fetch('https://regieessencequebec.ca/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PrixEssenceQC/1.0)' },
    })
    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch page: ${pageResponse.status}`)
    }
    const html = await pageResponse.text()

    // Step 2: Extract the Excel file URL from the excel-download div
    const match = html.match(/href="(\/data\/stations-[\d]+\.xlsx)"/)
    if (!match) {
      throw new Error('Excel download URL not found in page HTML')
    }
    const xlsxPath = match[1]
    const xlsxUrl = `https://regieessencequebec.ca${xlsxPath}`
    const filename = xlsxPath.split('/').pop() ?? ''
    const lastUpdated = extractTimestamp(filename)

    // Step 3: Download and parse the Excel file
    const xlsxResponse = await fetch(xlsxUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PrixEssenceQC/1.0)' },
    })
    if (!xlsxResponse.ok) {
      throw new Error(`Failed to fetch Excel: ${xlsxResponse.status}`)
    }
    const buffer = await xlsxResponse.arrayBuffer()
    const wb = read(buffer, { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = utils.sheet_to_json<RawRow>(ws)

    // Step 4: Map rows to Station objects
    const stations = rows
      .filter((r) => r.Latitude && r.Longitude)
      .map((r) => ({
        nom: String(r.Nom ?? ''),
        banniere: String(r.Bannière ?? ''),
        adresse: String(r.Adresse ?? ''),
        region: String(r.Région ?? ''),
        codePostal: String(r['Code Postal'] ?? ''),
        lat: parseFloat(String(r.Latitude)),
        lng: parseFloat(String(r.Longitude)),
        prixRegulier: parsePrice(r['Prix Régulier']),
        prixSuper: parsePrice(r['Prix Super']),
        prixDiesel: parsePrice(r['Prix Diesel']),
      }))
      .filter((s) => !isNaN(s.lat) && !isNaN(s.lng))

    const body = JSON.stringify({ stations, lastUpdated, count: stations.length })

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

export const config: Config = { path: '/api/stations' }
