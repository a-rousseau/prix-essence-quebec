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
├── netlify/
│   └── functions/
│       └── stations.mts     # Fonction serverless — scrape et parse le fichier Excel
│                            # de la Régie, expose /api/stations
├── src/
│   ├── components/
│   │   ├── Map.tsx          # Carte Leaflet, marqueurs, tooltips, séparation
│   │   ├── PriceStatsBar.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── useStations.ts   # Fetch + cache des données stations
│   ├── lib/
│   │   ├── brandLogos.ts    # Association bannière → logo
│   │   ├── clusterIcon.ts   # Icône personnalisée pour les clusters
│   │   └── cache.ts
│   └── index.css
├── netlify.toml             # Config build, headers HTTP, cache
└── vite.config.ts
```

## Données

La fonction serverless `/api/stations` :
1. Télécharge la page de la Régie de l'énergie du Québec
2. Extrait l'URL du fichier Excel (format `stations-YYYYMMDDHHMMSS.xlsx`)
3. Parse le fichier avec `xlsx` et retourne les stations en JSON
4. Le résultat est mis en cache 30 minutes (Cache-Control)

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
