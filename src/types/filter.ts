export interface FilterState {
  fuelTypes: {
    regulier: boolean
    super: boolean
    diesel: boolean
  }
  companies: string[]
  regions: string[]
  showFavoritesOnly: boolean
}
