# Prix Essence Québec

Carte interactive des prix d'essence en temps réel pour la province de Québec. Les données proviennent directement de la [Régie de l'énergie du Québec](https://regieessencequebec.ca).

## Fonctionnalités

- Carte interactive avec toutes les stations-service du Québec
- Prix en temps réel (régulier, super, diesel)
- Regroupement automatique des stations proches (clusters)
- Séparation visuelle des stations superposées avec connecteurs SVG pointant vers les marqueurs
- Localisation géographique de l'utilisateur
- Barre de statistiques (prix min / moyen / max pour la zone visible)
- Recherche de ville ou d'adresse
- PWA installable (fonctionne hors-ligne après installation)
- Itinéraire Google Maps depuis chaque station

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19 + TypeScript |
| Carte | Leaflet + react-leaflet + leaflet.markercluster |
| Styles | Tailwind CSS v4 |
| Build | Vite 7 |
| Backend | Netlify Functions (TypeScript) |
| Déploiement | Netlify |
| PWA | vite-plugin-pwa + Workbox |

## Architecture

```
prix-essence-quebec/
├── src/
│   ├── components/
│   │   ├── Map.tsx          # Carte Leaflet, marqueurs, tooltips, séparation
│   │   ├── PriceStatsBar.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── useStations.ts   # Fetch, parse et cache des données GeoJSON
│   ├── lib/
│   │   ├── brandLogos.ts    # Association bannière → logo
│   │   ├── clusterIcon.ts   # Icône personnalisée pour les clusters
│   │   └── cache.ts         # Cache localStorage avec TTL
│   └── index.css
├── netlify.toml             # Config build, headers HTTP, cache statique
└── vite.config.ts
```

## Données

Les données sont récupérées directement depuis le GeoJSON public de la Régie :

```
https://regieessencequebec.ca/stations.geojson.gz
```

Le hook `useStations.ts` :
1. Vérifie d'abord le cache `localStorage` (évite un fetch inutile)
2. Télécharge le fichier GeoJSON compressé — le navigateur le décompresse automatiquement via `Content-Encoding: gzip`
3. Parse les features GeoJSON (coordonnées, prix par type de carburant, métadonnées)
4. Si le champ `metadata.generated_at` n'a pas changé, réutilise les données déjà parsées et prolonge le TTL du cache
5. Met en cache le résultat dans `localStorage`

## Démarrage local

### Prérequis

- Node.js 18+
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm i -g netlify-cli`)

### Installation

```bash
npm install
```

### Développement (avec la fonction serverless)

```bash
npm run dev:all
```

Ouvre l'application sur `http://localhost:8888`. La fonction `/api/stations` est disponible localement via le tunnel Netlify Dev.

### Développement (frontend seulement)

```bash
npm run dev
```

### Build de production

```bash
npm run build
```

## Déploiement

Le projet se déploie automatiquement sur Netlify à chaque push sur `main`. La configuration se trouve dans `netlify.toml`.

## Données et attributions

- Données des prix : [Régie de l'énergie du Québec](https://regieessencequebec.ca)
- Tuiles de carte : [OpenStreetMap](https://www.openstreetmap.org/copyright)
- Logos de bannières : propriété de leurs détenteurs respectifs (Petro-Canada, Esso, Shell, Ultramar, etc.)
