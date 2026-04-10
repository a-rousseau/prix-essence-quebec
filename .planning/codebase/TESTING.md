---
generated: 2026-04-10
focus: quality
---

# Testing Patterns

**Analysis Date:** 2026-04-10

## Test Framework

**Runner:** None — no test framework is installed or configured.

**Assertion Library:** None.

**Run Commands:** No test scripts defined in `package.json`.

```bash
# No test commands available
# package.json scripts: dev, dev:all, build, lint, preview
```

## Test File Organization

**Location:** No test files exist anywhere in `src/`.

**Naming:** Not applicable.

**Structure:** Not applicable.

## Test Coverage

**Requirements:** None enforced.

**Coverage tooling:** Not configured.

## Current State

The project has **zero automated tests**. There are no:
- Unit test files (`*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`)
- Test framework dependencies (`vitest`, `jest`, `@testing-library/react`, etc.)
- Test configuration files (`vitest.config.ts`, `jest.config.ts`)
- Test directories (`__tests__/`, `tests/`)
- Test scripts in `package.json`

The `lint` script runs ESLint as the only automated code quality check:
```bash
npm run lint    # Runs: eslint .
```

## What Exists Instead of Tests

**TypeScript strict mode** provides compile-time safety:
- `strict: true`, `noUnusedLocals`, `noUnusedParameters` in `tsconfig.app.json`
- Type-checked build via `tsc -b && vite build`

**Manual verification** appears to be the current approach for runtime behavior.

**Playwright MCP artifacts** exist at `.playwright-mcp/` (session logs and page snapshots from 2026-04-02), indicating Playwright was used interactively via Claude MCP for exploratory/manual testing — not automated test suites.

## Where Tests Would Live (If Added)

**Recommended structure if tests are introduced:**

```
src/
├── lib/
│   ├── parsePrice.ts
│   ├── parsePrice.test.ts     ← co-located unit tests
│   ├── filterUtils.ts
│   ├── filterUtils.test.ts
│   ├── cache.ts
│   └── cache.test.ts
├── hooks/
│   ├── useStations.ts
│   └── useStations.test.ts
```

**Best candidates for unit testing** (pure functions with no DOM/network dependencies):
- `src/lib/parsePrice.ts` — `parsePrice()` pure function, trivial to test
- `src/lib/filterUtils.ts` — `filterStations()` pure function with clear inputs/outputs
- `src/lib/cache.ts` — `getCached`, `setCached`, `clearCache`, `getCachedEntry` (requires `localStorage` mock)
- `src/lib/brandLogos.ts` — `getBrandLogo()` pure function with lookup logic

**Recommended framework if adopted:** Vitest (matches Vite build toolchain, no additional config overhead).

```bash
# To add Vitest:
# npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

**Vitest config would extend `vite.config.ts`:**
```ts
// vite.config.ts addition
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  // ...existing config
})
```

## Example Test Patterns (If Written)

**Pure utility function:**
```typescript
// src/lib/parsePrice.test.ts
import { describe, it, expect } from 'vitest'
import { parsePrice } from './parsePrice'

describe('parsePrice', () => {
  it('returns null for empty string', () => {
    expect(parsePrice('')).toBeNull()
  })
  it('parses numeric string', () => {
    expect(parsePrice('175.9')).toBe(175.9)
  })
  it('strips non-numeric characters', () => {
    expect(parsePrice('175.9¢')).toBe(175.9)
  })
})
```

**Filter function:**
```typescript
// src/lib/filterUtils.test.ts
import { describe, it, expect } from 'vitest'
import { filterStations } from './filterUtils'
import type { Station } from '../types/station'

const makeStation = (overrides: Partial<Station> = {}): Station => ({
  nom: 'Test', banniere: 'ultramar', adresse: '', region: '', codePostal: '',
  lat: 46, lng: -71, prixRegulier: 175, prixSuper: null, prixDiesel: null,
  ...overrides,
})

describe('filterStations', () => {
  it('filters out stations not in companies list', () => {
    const stations = [makeStation({ banniere: 'ultramar' }), makeStation({ banniere: 'shell' })]
    const result = filterStations(stations, { selectedFuelType: 'regulier', companies: ['ultramar'], regions: [], showFavoritesOnly: false })
    expect(result).toHaveLength(1)
    expect(result[0].banniere).toBe('ultramar')
  })
})
```

---

*Testing analysis: 2026-04-10*
