# OG Image System - LumenIQ

## Overview

LumenIQ utilise le système de génération d'images Open Graph dynamique de Next.js via `next/og` (`ImageResponse`).

## Files

- `/src/app/opengraph-image.tsx` — Génère l'image OG (1200x630 px) pour Facebook, LinkedIn, Slack, etc.
- `/src/app/twitter-image.tsx` — Réexporte `opengraph-image` pour Twitter (même image, format `summary_large_image`)

## Convention Next.js

Next.js détecte automatiquement ces fichiers par convention (file-based metadata) et génère les balises meta correspondantes:

```html
<meta property="og:image" content="https://lumeniq.fr/opengraph-image" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="LumenIQ - Prévisions professionnelles pour PME" />
<meta name="twitter:image" content="https://lumeniq.fr/twitter-image" />
<meta name="twitter:card" content="summary_large_image" />
```

**Aucune modification manuelle des metadata dans `layout.tsx` n'est nécessaire.**

## Design

L'image OG suit les couleurs de la brand LumenIQ:
- Fond: gradient zinc-950 → indigo-900 → zinc-950 (cohérent avec le dark theme de l'app)
- Accent: indigo-500 → violet-500 (gradient logo)
- Texte: blanc (logo + titre principal), zinc-300 (sous-titre), zinc-400 (URL)
- Badge CTA: "Essai gratuit 3 mois" avec bordure indigo translucide

Contenu:
- Logo "L" carré avec gradient indigo-violet
- Titre "LumenIQ" en bold 48px
- Sous-titre "Prévisions professionnelles pour PME" en 36px
- Features: "Jusqu'à 24 modèles · Backtesting automatique · 5 minutes"
- Badge: "Essai gratuit 3 mois"
- URL: "lumeniq.fr" en bas

## Testing

### Vérifier la génération locale

1. Démarrer le serveur de dev: `npm run dev`
2. Ouvrir dans le navigateur: `http://localhost:3000/opengraph-image`
3. L'image PNG devrait s'afficher (1200x630 px)

### Tester le rendu OG sur les réseaux sociaux

Après déploiement en production:

- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Slack**: Partager l'URL dans un canal privé

Si l'image ne se met pas à jour immédiatement, les plateformes ont un cache. Utiliser les boutons "Re-scrape" sur les outils de debug.

## Modification

Pour changer le design, éditer `/src/app/opengraph-image.tsx`.

Contraintes:
- Utiliser uniquement des styles inline (Satori, le moteur derrière `ImageResponse`, ne supporte pas les classes Tailwind)
- Dimensions: 1200x630 px (standard OG)
- Utiliser `display: 'flex'` pour tous les layouts (Satori utilise Flexbox, pas CSS Grid)
- Fonts: system-ui ou charger une font avec `fetch()` + `@vercel/og` (voir doc Next.js)

## Production

En production, Next.js génère l'image au build time (SSG) si le composant est statique. L'image est ensuite servie via le CDN.

Si vous avez besoin d'images OG dynamiques par page (ex: image différente par série ou par job), créer des routes API avec `ImageResponse` à la place (voir doc Next.js `next/og`).
