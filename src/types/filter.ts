export interface FilterState {
  selectedFuelType: 'regulier' | 'super' | 'diesel' | null
  companies: string[]
  regions: string[]
  showFavoritesOnly: boolean
}
