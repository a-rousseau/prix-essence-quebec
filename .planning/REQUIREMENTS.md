# Requirements — Milestone v1.1: Favorites, Geolocation & Revenue

## Active Requirements

### Favorites

- [ ] **FAV-01**: User can save a station as a favorite from the station card
- [ ] **FAV-02**: User can remove a station from favorites
- [ ] **FAV-03**: Favorited stations are visually distinct on the map
- [ ] **FAV-04**: User can filter the map to show only favorite stations
- [ ] **FAV-05**: Favorites persist across sessions (localStorage)
- [ ] **FAV-06**: Favorites have a time-based TTL; user is notified before expiry and can extend the TTL
- [ ] **FAV-07**: User can export favorites as JSON and re-import them

### Geolocation

- [ ] **GEO-01**: Map auto-centers on user location on first load (after permission granted)
- [ ] **GEO-02**: Accuracy ring (translucent circle) shown around user location marker
- [ ] **GEO-03**: Clear French error message when geolocation is denied, unavailable, or times out
- [ ] **GEO-04**: Locate-me button can be re-tapped to retry location after denial or error

### AdSense

- [ ] **ADS-01**: AdSense slot 3373913657 rendered in designated zone (below price stats bar on mobile)
- [ ] **ADS-02**: Ad unit only renders when user has accepted cookies (consent-gated via adConsent.ts)
- [ ] **ADS-03**: Maximum one active ad unit at any time (density policy per ADS-STRATEGY.md)
- [ ] **ADS-04**: Ad unit respects mobile safe-area-inset and does not overlap map controls

### Accessibility

- [ ] **A11Y-01**: Fuel type buttons expose aria-pressed state to screen readers
- [ ] **A11Y-02**: Brand checkbox group is wrapped in fieldset/legend
- [ ] **A11Y-03**: Map markers are keyboard-navigable (Tab to focus, Enter/Space to open station card)
- [ ] **A11Y-04**: Focus moves into station card when opened and returns to source marker on close

## Future Requirements

- Price alerts — notify user when a nearby station drops below a threshold (requires PWA push notification infrastructure; deferred to v1.2+)
- Favorites sync across devices — requires accounts; out of scope by design
- Region filter — `regions` field exists in FilterState but is unused; deferred

## Out of Scope

- User accounts / cross-device sync — no backend, app is stateless by design
- Price history / trend charts — data source is current-state only
- Native mobile app — PWA covers the use case
- Server-side rendering — SPA architecture established

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| A11Y-01 | Phase 05 | TBD | Pending |
| A11Y-02 | Phase 05 | TBD | Pending |
| A11Y-03 | Phase 05 | TBD | Pending |
| A11Y-04 | Phase 05 | TBD | Pending |
| GEO-01 | Phase 06 | TBD | Pending |
| GEO-02 | Phase 06 | TBD | Pending |
| GEO-03 | Phase 06 | TBD | Pending |
| GEO-04 | Phase 06 | TBD | Pending |
| ADS-01 | Phase 07 | TBD | Pending |
| ADS-02 | Phase 07 | TBD | Pending |
| ADS-03 | Phase 07 | TBD | Pending |
| ADS-04 | Phase 07 | TBD | Pending |
| FAV-01 | Phase 08 | TBD | Pending |
| FAV-02 | Phase 08 | TBD | Pending |
| FAV-03 | Phase 08 | TBD | Pending |
| FAV-04 | Phase 08 | TBD | Pending |
| FAV-05 | Phase 08 | TBD | Pending |
| FAV-06 | Phase 08 | TBD | Pending |
| FAV-07 | Phase 08 | TBD | Pending |

---
*Last updated: 2026-04-22 — roadmap created, phase assignments complete*
