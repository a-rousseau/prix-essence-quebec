# Guide du projet prix-essence-quebec

Voici la carte complète du projet pour t'orienter rapidement.

---

## Point d'entrée

| Fichier | Rôle |
|---|---|
| [src/main.tsx](src/main.tsx) | Monte `<App>` dans le DOM, enregistre le service worker PWA |
| [src/App.tsx](src/App.tsx) | Racine de l'UI — orchestre la carte, la barre de stats, la recherche, les menus et le consentement publicitaire |

---

## Données (`src/hooks/` et `src/lib/`)

| Fichier | Rôle |
|---|---|
| [src/hooks/useStations.ts](src/hooks/useStations.ts) | Fetch le GeoJSON compressé de la Régie (`stations.geojson.gz`), parse les features, gère le cache `localStorage` avec vérification du `generated_at` |
| [src/hooks/useMapStats.ts](src/hooks/useMapStats.ts) | Calcule les stats de prix (min / moyen / max) pour les stations visibles sur la carte |
| [src/lib/cache.ts](src/lib/cache.ts) | Cache `localStorage` avec TTL — `getCachedEntry`, `setCached`, `clearCache` |
| [src/lib/parsePrice.ts](src/lib/parsePrice.ts) | Normalise les prix bruts du GeoJSON en `number \| null` |
| [src/lib/brandLogos.ts](src/lib/brandLogos.ts) | Mappe les noms de bannières (Petro-Canada, Esso, Shell…) vers leurs fichiers logo |
| [src/lib/clusterIcon.ts](src/lib/clusterIcon.ts) | Crée les icônes SVG personnalisées pour les clusters de marqueurs |
| [src/lib/adConsent.ts](src/lib/adConsent.ts) | Gère le consentement AdSense — `getAdConsent`, `setAdConsent`, `loadAdSense`, `clearAdConsent` |

---

## Composants (`src/components/`)

| Fichier | Rôle |
|---|---|
| [src/components/Map.tsx](src/components/Map.tsx) | **Composant principal** — carte Leaflet, cercles de marqueurs colorés par prix, tooltips permanents (station-cards), séparation des tooltips superposés via SVG connector, contrôle de localisation, clustering |
| [src/components/PriceStatsBar.tsx](src/components/PriceStatsBar.tsx) | Barre du bas — affiche prix min/moyen/max de la zone visible, horodatage des données, bouton de rafraîchissement |
| [src/components/SearchBar.tsx](src/components/SearchBar.tsx) | Recherche d'adresse/ville — géocode et centre la carte |
| [src/components/HamburgerMenu.tsx](src/components/HamburgerMenu.tsx) | Menu latéral — liens vers politique de confidentialité, marques de commerce, préférences cookies |
| [src/components/ConsentBanner.tsx](src/components/ConsentBanner.tsx) | Bannière de consentement pour les publicités AdSense |
| [src/components/LoadingSpinner.tsx](src/components/LoadingSpinner.tsx) | Spinner affiché pendant le fetch initial |
| [src/components/PrivacyNotice.tsx](src/components/PrivacyNotice.tsx) | Modal politique de confidentialité |
| [src/components/TrademarkNotice.tsx](src/components/TrademarkNotice.tsx) | Modal mentions de marques de commerce et attributions |

---

## Styles

| Fichier | Rôle |
|---|---|
| [src/index.css](src/index.css) | CSS global — reset, clusters, `.station-tooltip`, `.tooltip-inner`, `.tooltip-connector` (SVG), `.station-card` et états expanded, user location marker, responsive |

---

## Config

| Fichier | Rôle |
|---|---|
| [netlify.toml](netlify.toml) | Build (`npm run build` → `dist/`), headers HTTP sécurité, règles de cache (assets immutables, `index.html` no-store) |
| [vite.config.ts](vite.config.ts) | Plugins Vite : React, Tailwind, Netlify, PWA (manifest + service worker Workbox) |
| [tsconfig.app.json](tsconfig.app.json) | Config TypeScript pour le code source |

---

## Types

| Fichier | Rôle |
|---|---|
| [src/types/station.ts](src/types/station.ts) | Interfaces `Station` et `GeoJsonResponse` |

---

## Points chauds à connaître

- **Séparation des tooltips** : `separateTooltips()` dans [Map.tsx](src/components/Map.tsx) — algorithme itératif push-apart guidé par la position des marqueurs, connecteur SVG dynamique dans `.tooltip-inner`
- **Cache GeoJSON** : compare `metadata.generated_at` avant de re-parser — évite le travail inutile si les données n'ont pas changé
- **Couleurs des marqueurs** : vert / orange / rouge calculés par tertiles (tiers du range de prix visible)
- **PWA** : service worker géré par Workbox via `vite-plugin-pwa` — mise à jour détectée et proposée à l'utilisateur
- **Zoom de clustering** : `disableClusteringAtZoom: 14` dans `CLUSTER_GROUP_OPTIONS` — en dessous de ce zoom, les stations sont toutes individuelles
