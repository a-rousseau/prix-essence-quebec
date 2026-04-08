---
goal: Implement Station Filtering, Price Analytics, and AdSense Configuration Hiding
version: 1.3
date_created: 2026-04-07
last_updated: 2026-04-07
owner:
status: In progress
tags: feature, frontend, filtering, security, UI/UX, analytics, regional-filtering, interactive-workflow
---

# Introduction

![Status: In progress](https://img.shields.io/badge/status-In%20progress-yellow)

This implementation plan outlines the addition of filtering functionality to the gas station map by fuel type and company, along with securing AdSense configuration by moving it to environment variables. The filter UI consists of a funnel icon button positioned to the right of the search bar, which opens an interactive filter panel with three fuel type badges and a brand dropdown with multi-select checkboxes. Additional features inspired by gazquebec.ca include regional filtering, price statistics/analytics, favorites functionality, and price trend indicators.

## Interactive Workflow Guide

### How to Use This Plan as an Agent

1. **Start Here**: Read the requirements (Section 1) to understand the feature set
2. **Choose Your Path**: Use the decision tree below to determine your starting point
3. **Track Progress**: Mark completed tasks in the Implementation Progress Tracker (Section 9)
4. **Next Steps**: After completing a phase, reference Section 9 to determine what to implement next
5. **Revert if Needed**: See "Version History & Rollback" in Section 9 to revert to a previous checkpoint

### Quick Decision Tree

**Q1: Are you starting fresh or continuing from a previous checkpoint?**
- → Fresh start: Go to Phase 1 (Core Filtering Logic) - TASK-001
- → Continuing: Check Section 9 to see what phase was last completed

**Q2: Which feature set interests you most?**
- → Basic: Complete Phases 1-3 (Filtering + AdSense security)
- → Analytics: Add Phases 4-5 (Price stats + Regional filters)
- → Full featured: Implement all Phases 1-7 (includes Favorites and Trends)

**Q3: Can you implement in parallel?**
- → YES: Phase 3 (AdSense) can be done alongside Phase 1-2 independently
- → NO: Follow sequential order exactly as phases must complete in order

**Q4: After completing a phase, what's next?**
- → Check "Section 9: Implementation Progress Tracker" for status and next steps
- → Or run task query: `grep "TASK-0[next-number]" implementation-plan.md`

**Q5: Do you need to remove or rollback a feature?**
- → Remove feature: See "Feature Removal Reference Matrix" in Section 9
- → Full rollback: See "Version History & Checkpoints" in Section 9

## 1. Requirements & Constraints

- **REQ-001**: Add filter controls for fuel types (Regular, Super, Diesel) as interactive badges below the search bar
- **REQ-002**: Add filter controls for service station companies via dropdown with multi-select checkboxes below the search bar
- **REQ-003**: Implement real-time filtering of stations displayed on the map as filters are toggled
- **REQ-004**: Move AdSense publisher ID and configuration to environment variables
- **REQ-005**: Place filter activation button (funnel icon) to the right of the search bar within the same container
- **REQ-006**: Display three fuel type badges (Regular, Super, Diesel) in a row below search bar when filter panel is open
- **REQ-007**: Display brand filter dropdown below fuel type badges with multi-select checkboxes, clear all, and select all options
- **REQ-008**: Add regional filtering by Quebec administrative regions (Montreal, Montérégie, Laval, Laurentides, etc.)
- **REQ-009**: Display price statistics showing cheapest stations for each fuel type
- **REQ-010**: Add local price indicators showing current average prices and price changes (↑/↓)
- **REQ-011**: Implement favorites/bookmarks functionality to save preferred stations
- **REQ-012**: Add price trend indicators showing price direction changes
- **REQ-013**: Support selective feature implementation allowing agents to choose which phase/feature to work on independently
- **REQ-014**: Track implementation progress with versioning history to enable rollback to previous checkpoints
- **REQ-015**: Provide feature removal capability without affecting existing implemented changes
- **CON-001**: Maintain map performance with up to thousands of stations
- **CON-002**: Client-side filtering only, no backend changes required
- **SEC-001**: Hide sensitive AdSense configuration from repository
- **GUD-001**: Follow existing code patterns and TypeScript best practices
- **PAT-001**: Use React state management patterns consistent with existing components

## 2. Implementation Steps

### Implementation Phase 1: Core Filtering Logic

- GOAL-001: Implement the filtering logic and state management in the App component

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create FilterState interface in types/filter.ts with fuelTypes object (regulier, super, diesel booleans) and companies array | |  |
| TASK-002 | Add filter state to App.tsx with initial values: all fuel types true, all companies included | |  |
| TASK-003 | Implement filterStations function in App.tsx that takes stations array and filter state, returns filtered array based on fuel availability and brand | |  |
| TASK-004 | Update App.tsx to pass filtered stations to Map component instead of all stations | |  |
| TASK-005 | Add useEffect in App.tsx to re-filter when stations or filter state changes | |  |

### Implementation Phase 2: Filter UI Components

- GOAL-002: Create flexible filter UI components ready for various placements

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-006 | Create FilterButton component in components/FilterButton.tsx: funnel icon button positioned to the right of SearchBar within TOP_CONTROLS_STYLE container, onClick toggles filterPanelOpen state | |  |
| TASK-007 | Create FilterPanel component in components/FilterPanel.tsx that conditionally renders below search bar, containing fuel type badges and brand dropdown | |  |
| TASK-008 | Implement FuelTypeBadges subcomponent: three clickable badges (Regular, Super, Diesel) with active/inactive visual states, onClick toggles filter state | |  |
| TASK-009 | Implement BrandDropdown subcomponent: displays dropdown trigger, when opened shows checkboxes list of all unique banniere values, includes "Select all" and "Clear all" buttons in dropdown footer | |  |
| TASK-010 | Integrate FilterButton and FilterPanel into App.tsx, add filterPanelOpen state, pass onFilterChange callback to both components, ensure layout flows: SearchBar \| FilterButton in top row, FilterPanel below | |  |

### Implementation Phase 3: AdSense Configuration Security

- GOAL-003: Move AdSense configuration to environment variables

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-011 | Create .env file with VITE_ADSENSE_PUBLISHER_ID variable | |  |
| TASK-012 | Update adConsent.ts to use import.meta.env.VITE_ADSENSE_PUBLISHER_ID instead of hardcoded value | |  |
| TASK-013 | Update Map.tsx createStationCard function to use environment variable for data-ad-client | |  |
| TASK-014 | Add .env to .gitignore to prevent committing sensitive data | |  |
| TASK-015 | Update README.md with instructions for setting up AdSense environment variable | |  |

### Implementation Phase 4: Testing and Validation

- GOAL-004: Ensure filtering works correctly and performance is maintained

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-016 | Test filtering logic with various combinations of fuel types and companies | |  |
| TASK-017 | Verify map performance with filtered vs unfiltered large datasets | |  |
| TASK-018 | Test AdSense configuration loading with environment variables | |  |
| TASK-019 | Validate that .env is properly ignored by git | |  |

### Implementation Phase 5: Regional Filtering and Price Statistics

- GOAL-005: Add regional filtering and display price statistics

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-020 | Create RegionalFilter component to show Quebec regions: Montreal, Montérégie, Laval, Laurentides, Lanaudière, Capitale-Nationale, Outaouais, Saguenay-Lac-Saint-Jean, Estrie, Mauricie | |  |
| TASK-021 | Add region mapping data to Station type (derive from codePostal using postal code ranges) | |  |
| TASK-022 | Integrate regional filter into FilterPanel below brand dropdown, render as scrollable list or combined filter | |  |
| TASK-023 | Create PriceStatsPanel component displaying cheapest stations for each fuel type with brand logo and price | |  |
| TASK-024 | Add logic to calculate and display current average prices for Regular, Super, Diesel with price change indicator (↑/↓) | |  |
| TASK-025 | Implement favorites/bookmarks functionality using localStorage to persist user's saved stations | |  |

### Implementation Phase 6: Favorites and Enhanced Statistics

- GOAL-006: Implement favorites/bookmarks and price analytics display

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-026 | Create FavoritesButton component (heart icon) for each station card, toggles favorite status | |  |
| TASK-027 | Add favorites state management to App.tsx using localStorage with StationFavorites interface | |  |
| TASK-028 | Create favorites filter toggle in FilterPanel to show only saved stations | |  |
| TASK-029 | Implement PriceIndicator component to show price trends for each fuel type (↑ red, ↓ green, → neutral) | |  |
| TASK-030 | Add historical price tracking using local data (daily snapshots stored in localStorage) | |  |

### Implementation Phase 7: Testing and Validation

- GOAL-007: Ensure all filtering and new features work correctly and performance is maintained

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-031 | Test filtering logic with various combinations of fuel types, companies, and regions | |  |
| TASK-032 | Verify map performance with filtered vs unfiltered large datasets and all filter types active | |  |
| TASK-033 | Test favorites functionality persistence across sessions | |  |
| TASK-034 | Test AdSense configuration loading with environment variables | |  |
| TASK-035 | Validate that .env is properly ignored by git | |  |

## 2.1 Component Specifications

### FilterButton Component
- **Location**: src/components/FilterButton.tsx
- **Props**: `onClick: () => void`, `isActive: boolean` (indicates if panel is open)
- **Render**: Button element positioned absolute to right within search bar container
- **Icon**: Funnel SVG icon (18x18), similar style to existing icons (stroke-width: 2.5, stroke-linecap: round)
- **Styling**: 
  - Base: `absolute right-2.5 top-1/2 -translate-y-1/2`
  - Background: `bg-white/95 backdrop-blur-sm` when isActive true, `hover:bg-gray-50`
  - Border: `border border-gray-200`, `text-gray-700`
  - Rounded: `rounded-lg`
- **Accessibility**: `aria-label="Filters"`, proper button semantics

### FilterPanel Component
- **Location**: src/components/FilterPanel.tsx
- **Props**: `open: boolean`, `filterState: FilterState`, `onFilterChange: (filterState: FilterState) => void`, `stations: Station[]`
- **Render**: Conditional div that renders when `open === true`, positioned below search bar
- **Layout**: Flex column with gap-3, padding consistent with SearchBar
- **Children**: FuelTypeBadges, BrandDropdown, and RegionalFilter components
- **Styling**:
  - Background: `bg-white/95 backdrop-blur-sm`
  - Border: `border border-gray-200`, `rounded-xl`
  - Shadow: `shadow-lg`
  - Padding: `p-4`

### FuelTypeBadges Component
- **Location**: src/components/FuelTypeBadges.tsx
- **Props**: `filterState: { regulier: boolean, super: boolean, diesel: boolean }`, `onToggle: (fuelType: 'regulier' | 'super' | 'diesel') => void`
- **Render**: Three badge buttons in a row (gap-2)
- **Badge Data**: `[{ label: 'Regular', key: 'regulier' }, { label: 'Super', key: 'super' }, { label: 'Diesel', key: 'diesel' }]`
- **Badge Styling**:
  - Active: `bg-blue-500 text-white border border-blue-500`
  - Inactive: `bg-gray-100 text-gray-700 border border-gray-300`
  - Both: `px-3 py-1.5`, `rounded-full`, `cursor-pointer`, `transition-colors`, `text-sm font-medium`

### BrandDropdown Component
- **Location**: src/components/BrandDropdown.tsx
- **Props**: `selectedBrands: string[]`, `availableBrands: string[]`, `onBrandsChange: (brands: string[]) => void`
- **Render**: 
  - Trigger: Badge/button with dropdown icon, shows count of selected brands (`n selected`)
  - Dropdown: Popover positioned below trigger
  - Content: Scrollable list of checkboxes, footer with "Select all" and "Clear all" buttons
- **Dropdown Content Specification**:
  - Each checkbox: `<label><input type="checkbox" /> Brand Name</label>`
  - Checkboxes styled with Tailwind (consistent with SearchBar pattern)
  - Footer: Two buttons in flex row (space-between), padding-top with border-top
  - Footer button styling: `text-sm`, `text-blue-500`, `hover:text-blue-600`
- **Behavior**:
  - "Select all": Sets selectedBrands to availableBrands
  - "Clear all": Sets selectedBrands to empty array
  - Individual checkbox: Toggles brand in selectedBrands array

### RegionalFilter Component
- **Location**: src/components/RegionalFilter.tsx
- **Props**: `selectedRegions: string[]`, `onRegionChange: (regions: string[]) => void`
- **Regions**: `['Montreal', 'Montérégie', 'Laval', 'Laurentides', 'Lanaudière', 'Capitale-Nationale', 'Outaouais', 'Saguenay-Lac-Saint-Jean', 'Estrie', 'Mauricie']`
- **Render**: Scrollable checkbox list or toggle buttons (max-height: 200px with overflow-y-auto)
- **Styling**: Similar to BrandDropdown checkboxes, consistent Tailwind styling

### PriceStatsPanel Component
- **Location**: src/components/PriceStatsPanel.tsx
- **Props**: `stations: Station[], selectedFuelType: 'regulier' | 'super' | 'diesel'`
- **Render**: 
  - Header: Current average price with trend indicator (↑/↓/→) and change amount
  - List of cheapest 5-10 stations with: brand logo, station name, region, price
  - Color-coded pricing (green for low, amber for mid, red for high)

### PriceIndicator Component
- **Location**: src/components/PriceIndicator.tsx
- **Props**: `fuelType: string`, `currentPrice: number | null`, `previousPrice: number | null`
- **Render**: Compact display showing trend arrow and change amount (e.g., "↓ 4.0¢")
- **Styling**:
  - Up: `text-red-600 font-bold`
  - Down: `text-green-600 font-bold`
  - Neutral: `text-gray-500`

### FavoritesButton Component
- **Location**: src/components/FavoritesButton.tsx
- **Props**: `stationId: string`, `isFavorite: boolean`, `onToggle: (stationId: string) => void`
- **Render**: Heart icon button with filled/outline states
- **Styling**:
  - Unfavorited: `text-gray-400 hover:text-red-400`
  - Favorited: `text-red-500 fill-red-500`

### FilterState Type Definition
```typescript
interface FilterState {
  fuelTypes: {
    regulier: boolean
    super: boolean
    diesel: boolean
  }
  companies: string[]
  regions: string[]
  showFavoritesOnly: boolean
}

interface StationFavorites {
  stationIds: string[]
  lastModified: number
}

interface PriceHistory {
  date: string
  regulierAvg: number | null
  superAvg: number | null
  dieselAvg: number | null
}
```

## 3. Alternatives

- **ALT-001**: Server-side filtering - Rejected due to no backend and requirement for real-time client-side filtering
- **ALT-002**: Filter stations in Map component - Rejected to keep separation of concerns, filtering logic in App
- **ALT-003**: Use URL parameters for filter state - Considered but not implemented initially, can be added later for shareable filtered views
- **ALT-004**: Hardcode AdSense ID in build config - Rejected for security, environment variables provide better separation
- **ALT-005**: Side panel for filters - Rejected in favor of inline controls below search bar for better UX and space efficiency

## 4. Dependencies

- **DEP-001**: Existing React and TypeScript setup
- **DEP-002**: Leaflet map components for displaying filtered stations
- **DEP-003**: Tailwind CSS for styling filter components
- **DEP-004**: Vite for environment variable handling

## 5. Files

- **FILE-001**: src/App.tsx - Add filter state (filterPanelOpen, filterState, favorites, regions), integrate all filter and stats components
- **FILE-002**: src/components/FilterButton.tsx - Funnel icon button component
- **FILE-003**: src/components/FilterPanel.tsx - Container for filter controls that renders below search bar
- **FILE-004**: src/components/FuelTypeBadges.tsx - Three interactive fuel type badges
- **FILE-005**: src/components/BrandDropdown.tsx - Dropdown with multi-select checkboxes for brands
- **FILE-006**: src/components/RegionalFilter.tsx - Region selection filter
- **FILE-007**: src/components/PriceStatsPanel.tsx - Display price statistics and cheapest stations
- **FILE-008**: src/components/PriceIndicator.tsx - Price trend indicator component
- **FILE-009**: src/components/FavoritesButton.tsx - Heart icon button for saving stations
- **FILE-010**: src/types/filter.ts - FilterState and related interfaces
- **FILE-011**: src/types/favorites.ts - Favorites storage interface
- **FILE-012**: src/lib/filterUtils.ts - filterStations function and helper utilities
- **FILE-013**: src/lib/favoritesUtils.ts - Favorites management utilities
- **FILE-014**: src/lib/regionUtils.ts - Region mapping and postal code utilities
- **FILE-015**: src/lib/priceUtils.ts - Price calculation and statistics utilities
- **FILE-016**: src/lib/adConsent.ts - Update to use environment variables
- **FILE-017**: src/components/Map.tsx - Update AdSense configuration
- **FILE-018**: .env - New environment file
- **FILE-019**: .gitignore - Add .env
- **FILE-020**: README.md - Add setup instructions

## 6. Testing

- **TEST-001**: Unit test for filterStations function with various filter combinations
- **TEST-002**: Integration test for filter state updates triggering re-renders
- **TEST-003**: Performance test with 1000+ stations and filtering operations
- **TEST-004**: E2E test for filter UI interactions and map updates
- **TEST-005**: Security test to ensure AdSense ID not exposed in built files
- **TEST-006**: Test regional filter selection and postal code mapping
- **TEST-007**: Test favorites persistence across browser sessions
- **TEST-008**: Test price statistics calculation with various station datasets
- **TEST-009**: Test price trend indicators with historical price data

## 7. Risks & Assumptions

- **RISK-001**: Performance degradation with large station datasets - Mitigated by efficient filtering algorithms and memoization
- **RISK-002**: Dropdown overflow issues on small screens - Mitigated by positioning dropdown with viewport awareness or scrolling
- **RISK-003**: Regional filter increases filter complexity - Mitigated by collapsing regional filter by default or integrating into main filter panel
- **ASSUMPTION-001**: External API provides consistent station data format with banniere and codePostal fields
- **ASSUMPTION-002**: User has AdSense account and can provide publisher ID
- **ASSUMPTION-003**: FilterButton and FilterPanel can be integrated within existing TOP_CONTROLS_STYLE layout constraints
- **ASSUMPTION-004**: Postal code ranges can reliably map to Quebec regions
- **ASSUMPTION-005**: LocalStorage has sufficient capacity for favorites and price history data

## 8. Additional Features from gazquebec.ca Analysis

Based on analysis of https://gazquebec.ca, the following features are recommended for implementation in future phases:

### Phase 2 Features (Short term)
- **Price Statistics Display**: Show cheapest stations for each fuel type with trend indicators
- **Favorites/Bookmarks**: Allow users to save and filter by favorite stations
- **Regional Filtering**: Filter stations by Quebec administrative regions
- **Price Indicators**: Display current average prices with ↑/↓ change indicators

### Phase 3 Features (Medium term)
- **Price Analysis Page**: Dedicated page showing historical price trends
- **Tax Information**: Display fuel tax breakdown by region
- **City-Specific Pages**: Generate pages for major cities with local price data
- **Price History Tracking**: Track and visualize price changes over time

### Phase 4 Features (Long term)
- **Crude Oil Price Integration**: Display relationship between gas prices and crude oil prices
- **Advanced Analytics**: Price predictions, trend analysis, best time to buy analysis
- **Notifications**: Alert users when prices drop below user-set thresholds
- **Social Features**: Share favorite locations, price tips, or savings achievements

## 9. Implementation Progress Tracker

### Phase Completion Status

| Phase | Name | Status | Completed Tasks | Total Tasks | Last Updated |
|-------|------|--------|-----------------|-------------|--------------|
| Phase 1 | Core Filtering Logic | Not Started | 0 | 5 | - |
| Phase 2 | Filter UI Components | Not Started | 0 | 5 | - |
| Phase 3 | AdSense Security | Not Started | 0 | 5 | - |
| Phase 4 | Regional & Price Features | Not Started | 0 | 5 | - |
| Phase 5 | Price Statistics Display | Not Started | 0 | 5 | - |
| Phase 6 | Favorites & Price Trends | Not Started | 0 | 5 | - |
| Phase 7 | Testing & Documentation | Not Started | 0 | 5 | - |

### Current Checkpoints

- **v1.3-start**: Initial release with full specification (this checkpoint)
- **v1.3-phase1-complete**: After completing Core Filtering Logic (Phase 1)
- **v1.3-foundation-complete**: After completing Phases 1-3 (basic filtering + security)
- **v1.3-analytics-complete**: After completing Phases 1-5 (with price stats)
- **v1.3-full-complete**: After completing all Phases 1-7

### Feature Removal Reference Matrix

Use this matrix to identify which components, utilities, and type definitions are involved with each major feature. This helps when removing a feature to avoid breaking other parts of the system.

| Feature | Core Tasks | Components | Utilities | Types | Dependencies |
|---------|-----------|-----------|-----------|-------|--------------|
| Fuel Type Filtering | TASK-001, TASK-004, TASK-013 | FuelTypeBadges | filterUtils.ts | filter.ts | None |
| Brand/Company Filtering | TASK-002, TASK-005, TASK-014 | BrandDropdown | filterUtils.ts | filter.ts | Fuel Type Filter |
| Regional Filtering | TASK-020, TASK-021 | RegionalFilter | regionUtils.ts, filterUtils.ts | filter.ts | Fuel + Brand Filters |
| Price Statistics | TASK-022, TASK-023 | PriceStatsPanel | priceUtils.ts | station.ts | None |
| Favorites System | TASK-029, TASK-030, TASK-031 | FavoritesButton | favoritesUtils.ts | favorites.ts | None |
| Price Trend Indicators | TASK-032, TASK-033 | PriceIndicator | priceUtils.ts | None | Price Statistics |
| AdSense Security | TASK-011, TASK-012, TASK-015 | None | adConsent.ts | None | None |

**Key Insight**: Fuel Type and Brand Filtering are foundational - Regional Filtering depends on them. Price Statistics stand alone. Favorites system is completely independent. AdSense security has no dependencies.

### Version History & Rollback Instructions

**Current Version**: v1.3 (In progress)

**Available Checkpoints**:

1. **v1.3-start** (Current)
   - What's included: Full specification with 35 tasks across 7 phases
   - Files: Only documentation (implementation-plan.md)
   - Recovery: This is the current state
   - Command: Use current branch

2. **v1.2-full-features** (Previous)
   - What's included: Original specification with gazquebec.ca features added
   - Without: Interactive workflow sections (Sections 2 & 9)
   - Recovery: If v1.3 becomes unstable, revert to this checkpoint
   - Command: `git checkout v1.2-full-features` (if tagged) or manually remove Sections 2 & 9

3. **v1.1-base-filtering** (Previous)
   - What's included: Core filtering with fuel types and brands only
   - Without: Regional filtering, price stats, favorites, trends, interactive workflow
   - Recovery: Minimal implementation, good fallback
   - Phase reduction: Keep Phases 1-3 only (remove Tasks TASK-020 through TASK-035)

4. **v1.0-foundation** (Original)
   - What's included: Specification structure and framework only
   - Without: All feature specifications and implementation details
   - Recovery: Complete restart if needed

**To Revert to Previous Version**:
```bash
# For git-based version control (recommended)
git tag v1.3-start  # Tag current version first
git checkout v1.2-full-features --quiet
git checkout -b feature/filtering-v1.2-rollback

# For manual rollback (no git)
# 1. Open implementation-plan.md
# 2. Remove Sections 2 (Interactive Workflow Guide) and 9 (Implementation Progress Tracker)
# 3. Change version in front matter from 1.3 to 1.2
# 4. Change status from "In progress" to "Planned"
```

### How to Update Progress as You Complete Tasks

After completing each task, update the tracker:

1. Find the task in "Implementation Steps" (Section 2)
2. Mark the checkbox: Change `| |` to `|✓|` in the task table
3. Update phase row in "Phase Completion Status" table above
4. Update "Last Updated" date in phase row
5. Commit: `git commit -m "feat: complete TASK-XXX - [task description]"`

Example:
```
| TASK-001 | Create FilterState interface | ✓ | 2026-04-08 |
```

### Next Steps After Each Phase

- **After Phase 1**: Verify filterStations function with test examples, then proceed to Phase 2
- **After Phase 2**: Component integration test, check UI positioning, then Phase 3 can be done in parallel
- **After Phase 3**: Security verification (no AdSense ID in bundle), then Phase 4
- **After Phase 4+**: Run full integration tests before proceeding to next phase
- **After Phase 7**: Code review, perform TEST-001 through TEST-009, prepare for production deploy

## 10. Related Specifications / Further Reading

- [Station Data API Documentation](https://regieessencequebec.ca/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [AdSense Publisher Guidelines](https://support.google.com/adsense/answer/10502902)
- [gazquebec.ca Reference Site](https://gazquebec.ca)
- [Quebec Administrative Regions](https://en.wikipedia.org/wiki/Regions_of_Quebec)
