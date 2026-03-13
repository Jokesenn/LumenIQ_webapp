# LumenIQ — Migration Identité Visuelle Signal V6

## MISSION

Migrer le frontend LumenIQ (Next.js 16 + Tailwind v4 + shadcn/ui) de l'ancien thème **indigo/violet/dark** vers la nouvelle identité **Signal V6** (cuivre/light/Satoshi). La migration doit être incrémentale, fichier par fichier, avec validation visuelle à chaque étape.

---

## CONTEXTE TECHNIQUE

- **Framework :** Next.js 16 (App Router) + React 19 + TypeScript 5.9
- **CSS :** Tailwind CSS v4 — config dans `globals.css` via `@import "tailwindcss"` + `@theme {}`. PAS de `tailwind.config.ts`.
- **Composants :** shadcn/ui (style "new-york") dans `src/components/ui/`
- **Graphiques :** Recharts
- **Animations :** Framer Motion
- **Thème :** next-themes (actuellement dark-first, migration vers light-first)
- **Auth :** Supabase SSR middleware, schéma `lumeniq`
- **Alias imports :** `@/*` → `./src/*`
- **Utilitaire classes :** `cn()` de `@/lib/utils`

---

## ÉTAT ACTUEL → ÉTAT CIBLE

### Palette de couleurs — Mapping complet

| Élément | ANCIEN (dark/indigo) | NOUVEAU (Signal V6) |
|---------|---------------------|---------------------|
| **Fond principal** | `#1a1a2e` / `bg-zinc-900` | `#FAFAF9` |
| **Fond cards** | `rgba(24,24,27,0.5)` / `zinc-900` | `#FFFFFF` |
| **Fond surface/hover** | `#111A30` / `white/5%` | `#F3F3F0` |
| **Bordure** | `white/6%` - `white/8%` - `white/10%` | `#E5E5E0` |
| **Accent principal** | `#6366F1` (indigo-500) | `#B45309` (copper) |
| **Accent hover** | `#4F46E5` (indigo-600) | `#9A4408` (copper-hover) |
| **Accent secondaire** | `#8B5CF6` (violet-500) | `#92400E` (copper-dark) |
| **Accent fond** | `indigo/8%` - `violet/4%` | `#FEF3E2` (copper-bg) |
| **Accent fond subtle** | — | `#FFFBF5` (copper-bg-soft) |
| **Texte principal** | `#FFFFFF` / `text-white` | `#141414` |
| **Texte secondaire** | `text-white/70` | `#5C5C58` |
| **Texte tertiaire** | `text-white/50` | `#8A8A82` (AA-large only, ≥18px bold) |
| **Succès** | `emerald-400/500` | `#15803D` (bg: `#F0FDF4`) |
| **Warning** | `amber-400/500` | `#A16207` (bg: `#FEFCE8`) |
| **Erreur** | `red-400/500` | `#B91C1C` (bg: `#FEF2F2`) |
| **Chart actual** | `#FFFFFF` / `white` | `#141414` |
| **Chart forecast** | `indigo-500` / `violet-500` | `#B45309` |
| **Chart grid** | `white/10%` | `#EEEEE8` |
| **Focus ring** | `ring-indigo-500` | `ring-[#B45309]` |
| **Glassmorphisme** | `backdrop-blur-sm` partout | **SUPPRIMÉ** — ombres subtiles à la place |

### Typographie — Mapping

| Élément | ANCIEN | NOUVEAU |
|---------|--------|---------|
| **Display font** | Syne (800) via Google Fonts | Satoshi (700/900) via Fontshare — self-host woff2 |
| **Body font** | Manrope (300-800) via Google Fonts | Satoshi (400/500) via Fontshare |
| **Mono font** | Geist Mono (fallback) | IBM Plex Mono (400/500/600) via Google Fonts |
| **Hero metric** | Syne 48px white | Satoshi 700 42-48px `#B45309` (copper) |
| **H1** | Syne 36-40px bold white | Satoshi 700 22px `#141414` |
| **H2** | — | Satoshi 600 13px `#141414` + section marker cuivre |
| **Body** | Manrope 16px white | Satoshi 400 13px `#141414` |
| **Caption** | Manrope 12px zinc-400 | Satoshi 400 11px `#8A8A82` |
| **KPI values** | Syne 28-32px white | Satoshi 700 24px `#B45309` |
| **Data mono** | — | IBM Plex Mono 500 11px |
| **Badges** | — | IBM Plex Mono 600 9px uppercase, letter-spacing 0.05em |
| **Letter-spacing headers** | — | -0.03em |

### Mode thème

| ANCIEN | NOUVEAU |
|--------|---------|
| Dark-first (`#1a1a2e`) | **Light-first** (`#FAFAF9`) |
| next-themes default = "dark" | next-themes default = **"light"** |
| CSS variables HSL dark | CSS variables HEX light |

---

## FICHIER CSS TOKENS — À LA RACINE DU REPO

Le fichier `lumeniq-signal-v6-tokens.css` est placé à la racine du repo. Il contient tous les tokens `@theme {}` Tailwind v4, les overrides shadcn `:root`, les `@font-face` Satoshi, les classes brand devices et composants.

**Claude Code doit :**
1. Lire le fichier `lumeniq-signal-v6-tokens.css` à la racine du repo
2. Intégrer son contenu dans `src/app/globals.css` en remplaçant les anciennes variables de thème, les anciennes CSS custom properties, et les anciennes classes custom
3. Conserver la directive `@import "tailwindcss";` en première ligne
4. Conserver les styles spécifiques à des composants tiers (driver.js, Recharts, Sonner) qui ne sont pas liés au thème — les adapter aux nouvelles couleurs si nécessaire
5. Supprimer toutes les anciennes variables HSL dark mode, les classes `.dash-card`, `.dash-card-accent`, `.glow-accent` et tout ce qui référence l'ancien thème indigo/violet/dark

---

## POLICES — TÉLÉCHARGEMENT AUTOMATIQUE

Claude Code doit exécuter ces commandes pour installer les polices :

### Satoshi (Fontshare) — self-hosted woff2
```bash
mkdir -p public/fonts

# Télécharger le pack Satoshi depuis Fontshare
curl -L "https://api.fontshare.com/v2/fonts/download/satoshi" -o /tmp/satoshi.zip

# Extraire les fichiers woff2 variables
unzip -o /tmp/satoshi.zip -d /tmp/satoshi

# Copier les fichiers variable (les seuls nécessaires)
cp /tmp/satoshi/Fonts/WEB/fonts/Satoshi-Variable.woff2 public/fonts/
cp /tmp/satoshi/Fonts/WEB/fonts/Satoshi-VariableItalic.woff2 public/fonts/

# Nettoyer
rm -rf /tmp/satoshi /tmp/satoshi.zip

# Vérifier
ls -la public/fonts/Satoshi-Variable*.woff2
```

Si l'URL Fontshare ne fonctionne pas (CDN instable), alternative :
```bash
# Fallback — télécharger depuis le CDN Fontshare directement
curl -L "https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap" -o /tmp/satoshi-css.txt
# Extraire l'URL woff2 du CSS, puis curl cette URL
grep -oP 'url\(\K[^)]+\.woff2' /tmp/satoshi-css.txt | head -2 | while read url; do
  filename=$(basename "$url" | cut -d'?' -f1)
  curl -L "$url" -o "public/fonts/$filename"
done
```

### IBM Plex Mono (Google Fonts) — via CDN
Ajouter dans `layout.tsx` dans le `<head>` :
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

### Supprimer les anciennes polices
Dans `layout.tsx`, supprimer toute référence à :
- `Manrope` (Google Fonts import ou next/font)
- `Syne` (Google Fonts import ou next/font)
- `Geist` / `Geist Mono` (next/font ou import)

Si les polices sont importées via `next/font/google`, supprimer les imports et les `className` associés sur le `<body>` ou `<html>`.

---

## LOGO SVG — FICHIERS À CRÉER

### `public/logo-ascension.svg` (fond clair)
```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="13.5" y="3" width="3" height="26" rx="1.5" fill="#B45309"/>
  <path d="M4 27C6 23 9 17 12 13L15 9" stroke="#141414" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="15" y1="9" x2="27" y2="4" stroke="#B45309" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="4" cy="27" r="2" fill="#141414"/>
</svg>
```

### `public/logo-ascension-dark.svg` (fond sombre)
```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="13.5" y="3" width="3" height="26" rx="1.5" fill="#B45309"/>
  <path d="M4 27C6 23 9 17 12 13L15 9" stroke="#ECECEC" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="15" y1="9" x2="27" y2="4" stroke="#B45309" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="4" cy="27" r="2" fill="#ECECEC"/>
</svg>
```

### `public/favicon.svg` (16px angulaire)
```svg
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="6.5" y="1" width="2" height="14" rx="1" fill="#B45309"/>
  <path d="M2 14L7.5 5L14 2" stroke="#141414" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7.5 5L14 2" stroke="#B45309" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="2" cy="14" r="1.5" fill="#141414"/>
</svg>
```

---

## PLAN DE MIGRATION — ORDRE DES FICHIERS

### Phase 1 : Fondations (ne rien casser)
1. `public/fonts/` — Exécuter les commandes de téléchargement Satoshi (voir section POLICES ci-dessus)
2. `public/` — Créer les 3 fichiers SVG logos (copier le code SVG des sections ci-dessus)
3. `src/app/globals.css` — Remplacer par le nouveau CSS (voir section ci-dessus)
4. `src/app/layout.tsx` — Mettre à jour :
   - Supprimer imports Google Fonts / next/font (Manrope, Syne, Geist)
   - Ajouter link IBM Plex Mono (`<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />`)
   - Changer default theme : `<ThemeProvider defaultTheme="light">`
   - Mettre à jour `<meta name="theme-color" content="#FAFAF9" />`
   - Supprimer les `className` des anciennes polices sur `<body>` ou `<html>`

### Phase 2 : Shell (structure globale)
5. `src/components/DashboardShell.tsx` (ou équivalent layout wrapper)
   - Fond : `bg-[#FAFAF9]` au lieu de `bg-zinc-900` / `bg-[#1a1a2e]`
   - Sidebar/header : fond `bg-white`, bordure `border-[#E5E5E0]`, shadow `shadow-[0_1px_0_rgba(0,0,0,0.03)]`
6. Logo dans la sidebar/header :
   - Remplacer l'hexagone SVG par le logo Ascension (`/logo-ascension.svg`)
   - Wordmark : `font-[var(--font-display)] font-black text-[#141414] tracking-[-0.03em]`
7. Navigation active state : `text-[#B45309] font-semibold border-b-2 border-[#B45309]`

### Phase 3 : Composants shadcn/ui
Les overrides shadcn sont gérés par les CSS variables `:root` dans globals.css. Vérifier que ces fichiers utilisent bien les tokens shadcn :
8. `src/components/ui/button.tsx` — Les variantes default/secondary/ghost doivent utiliser `bg-primary`, `bg-secondary`, `bg-ghost` qui pointent vers les nouvelles CSS vars
9. `src/components/ui/card.tsx` — Vérifier `bg-card`, `border-border`, ajouter `shadow-[var(--shadow-card)]`
10. `src/components/ui/badge.tsx` — Adapter les couleurs de statut
11. `src/components/ui/input.tsx` — Vérifier `bg-background`, `border-input`, `ring-ring`
12. Tout composant utilisant `backdrop-blur` → Supprimer le glassmorphisme, remplacer par `shadow-[var(--shadow-card)]`

### Phase 4 : Pages Dashboard
13. `src/app/dashboard/page.tsx` — Dashboard principal
    - Remplacer classes de couleur (voir mapping)
    - Ajouter Horizon Line (div 3px cuivre) à gauche du titre
    - Ajouter Section Markers avant les titres de section
    - KPI values → classe `copper-num`
14. `src/app/dashboard/actions/` — Actions Board
    - Badges priorité → classes `.badge-urgent`, `.badge-warning`, `.badge-copper`, `.badge-stable`
    - Accent gauche sur actions urgentes → `border-l-[3px] border-l-[#B91C1C]`
15. `src/app/dashboard/results/` — Résultats (4 onglets)
    - Jauges → cuivre au lieu de violet/indigo
    - Matrice ABC/XYZ → success/warning/textTri pour A/B/C
    - Sparklines → stroke cuivre
16. Détail série + chart Recharts :
    - `stroke="#141414"` pour actual, `stroke="#B45309"` pour forecast
    - `fill="#EEEEE8"` pour grid
    - Ajouter reference line cuivre verticale (`<ReferenceLine>`)
    - Confidence band : `fill="#B45309"` opacity 0.08

### Phase 5 : Pages publiques
17. Landing page `src/app/page.tsx` — Adapter hero, features, CTA
18. Pages `/pricing`, `/features`, `/contact` — Mêmes tokens

### Phase 6 : Composants spécifiques
19. `src/components/ForecastProgress.tsx` — Loading screen
20. `src/styles/onboarding.css` — driver.js theme : fond blanc, accent cuivre
21. `src/lib/glossary.tsx` — Vérifier vocabulaire Signal
22. Assistant IA (drawer) — Fond blanc, accent cuivre
23. Sonner (toasts) — Adapter au thème light

---

## RECHERCHE/REMPLACEMENT GLOBAUX

Exécuter dans l'ordre (regex-safe) :

| Rechercher | Remplacer par | Contexte |
|-----------|---------------|----------|
| `bg-zinc-900` | `bg-[var(--color-bg)]` | Fonds de page |
| `bg-zinc-800` | `bg-[var(--color-bg-card)]` | Cards |
| `bg-[#1a1a2e]` | `bg-[var(--color-bg)]` | Fond custom |
| `text-white` | `text-[var(--color-text)]` | Texte principal |
| `text-white/70` | `text-[var(--color-text-secondary)]` | Texte sec |
| `text-white/50` | `text-[var(--color-text-tertiary)]` | Texte tert |
| `text-zinc-400` | `text-[var(--color-text-secondary)]` | Texte sec alt |
| `indigo-500` | `[var(--color-copper)]` | Accent (attention au contexte bg-/text-/border-) |
| `indigo-600` | `[var(--color-copper-hover)]` | Hover |
| `violet-500` | `[var(--color-copper)]` | Secondaire → copper |
| `violet-400` | `[var(--color-copper)]` | Accent alt |
| `backdrop-blur` | *(supprimer)* | Glassmorphisme → supprimer |
| `white/6%` | `[var(--color-border)]` | Bordures |
| `white/8%` | `[var(--color-border)]` | Bordures |
| `white/10%` | `[var(--color-border-med)]` | Bordures hover |

**⚠️ ATTENTION** : Ne pas faire un search/replace aveugle. Vérifier chaque occurrence dans son contexte. Par exemple `text-white` dans un bouton sur fond cuivre doit rester blanc.

---

## SEUILS WAPE — MISE À JOUR

| WAPE | ANCIEN | NOUVEAU |
|------|--------|---------|
| < 5% | `text-emerald-400` | `text-[var(--color-success)]` |
| 5-15% | `text-amber-400` | `text-[var(--color-warning)]` |
| > 15% | `text-red-400` | `text-[var(--color-error)]` |

---

## VOCABULAIRE — VÉRIFIER DANS TOUT LE CODE

| Chercher dans le code/UI | Remplacer par |
|--------------------------|---------------|
| "Dernier run" / "Last run" | "Dernière mise à jour" |
| "WAPE" (affiché seul à l'user) | "Score de fiabilité" ou "Erreur moyenne" |
| "Modèle" (au sens statistique) | "Méthode de calcul" |
| "Champion model" | "Meilleure méthode" |
| "Tournament" | "Sélection automatique" |
| "Data drift" | "Évolution des données" |
| "AUJOURD'HUI" (labels charts) | "RÉFÉRENCE" |
| "Forecast" (UI visible) | "Prévision" |

Note : les termes techniques dans le code (noms de variables, commentaires) restent en anglais. Seuls les strings visibles par l'utilisateur sont concernés.

---

## BRAND DEVICES À IMPLÉMENTER

### 1. Horizon Line
Ajouter un `<div className="horizon-line h-6 mr-3" />` à gauche des titres H1 de page (flexbox).

### 2. Copper Numerals
Toutes les valeurs KPI (score fiabilité, WAPE, nombre de séries, etc.) doivent utiliser la classe `copper-num` ou `copper-num-mono`.

### 3. Section Markers
Ajouter `<span className="section-marker mr-2" />` avant chaque titre H2/section dans les pages résultats et dashboard.

### 4. Dot Grid
Ajouter la classe `dot-grid` dans les zones forecast des charts Recharts (via un div positionné en absolute derrière le chart, côté droit de la reference line).

### 5. Pulse
Sur le dernier point de données réel dans les charts Recharts, ajouter un cercle cuivre avec halo :
```tsx
<circle cx={x} cy={y} r={5} fill="#B45309" opacity={0.12} />
<circle cx={x} cy={y} r={3} fill="#B45309" />
```

---

## CRITÈRES DE SUCCÈS

- [ ] Aucune occurrence de `#6366F1`, `#4F46E5`, `#8B5CF6`, `indigo-`, `violet-` dans les fichiers frontend (sauf commentaires)
- [ ] Aucune occurrence de `#1a1a2e`, `bg-zinc-900` comme fond de page
- [ ] Aucune occurrence de `backdrop-blur` (glassmorphisme supprimé)
- [ ] Aucune occurrence de `Syne`, `Manrope` dans les imports ou CSS
- [ ] Le thème par défaut est light (`defaultTheme="light"`)
- [ ] Le logo Ascension est visible dans le header
- [ ] Le favicon est le SVG angulaire
- [ ] Les polices Satoshi chargent correctement (vérifier le Network tab)
- [ ] Les charts Recharts utilisent noir/cuivre (pas indigo/violet)
- [ ] Les KPI values sont en cuivre
- [ ] Au moins 1 Horizon Line, 1 Section Marker, et les Copper Numerals sont visibles sur le dashboard
- [ ] Aucun texte tertiaire #8A8A82 n'est utilisé en dessous de 18px bold
- [ ] Le contraste cuivre/fond passe AA (4.5:1) — déjà validé par audit

---

## FICHIERS À NE PAS TOUCHER

- `src/lib/supabase/` — Client Supabase, pas impacté
- `src/middleware.ts` — Auth middleware, pas impacté
- Toute logique métier (calculs, API calls, hooks de données)
- `src/components/ui/*.tsx` — Normalement gérés par les CSS variables, ne modifier que si les tokens shadcn ne suffisent pas

---

## NOTES IMPORTANTES

1. **Tailwind v4** : la config est dans `globals.css` via `@theme {}`, PAS dans `tailwind.config.ts` (qui n'existe pas)
2. **shadcn/ui** : les composants lisent les CSS variables HSL (`:root { --primary: ... }`). Les overrides dans globals.css suffisent normalement.
3. **Incrémental** : migrer fichier par fichier, vérifier visuellement entre chaque étape. Ne PAS faire un mega-commit.
4. **next-themes** : changer le `defaultTheme` à "light" mais garder la possibilité de dark mode futur (les CSS variables sont prêtes).
5. **Supabase** : toujours `.schema("lumeniq")` — pas impacté par la migration visuelle.
