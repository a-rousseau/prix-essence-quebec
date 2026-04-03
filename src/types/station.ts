export interface Station {
  nom: string
  banniere: string
  adresse: string
  region: string
  codePostal: string
  lat: number
  lng: number
  prixRegulier: number | null
  prixSuper: number | null
  prixDiesel: number | null
}

export interface StationsApiResponse {
  stations: Station[]
  lastUpdated: string
  count: number
}

// Raw GeoJSON types from regieessencequebec.ca/stations.geojson.gz
export interface GeoJsonPrice {
  GasType: string
  Price: string
  IsAvailable: boolean
}

export interface GeoJsonProperties {
  Name: string
  brand: string
  Status: string
  Address: string
  PostalCode: string
  Region: string
  Prices: GeoJsonPrice[]
}

export interface GeoJsonFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  properties: GeoJsonProperties
}

export interface GeoJsonResponse {
  type: 'FeatureCollection'
  metadata: {
    generated_at: string
    excel_url: string
    total_stations: number
    excel_size_bytes: number
  }
  features: GeoJsonFeature[]
}
