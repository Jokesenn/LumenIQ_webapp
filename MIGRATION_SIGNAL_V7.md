# PREVYA — Migration Identité Visuelle Signal V6

## MISSION

Migrer le frontend PREVYA (Next.js 16 + Tailwind v4 + shadcn/ui) de l'ancien thème **indigo/violet/dark** vers la nouvelle identité **Signal V6** (cuivre/light/Satoshi). La migration doit être incrémentale, fichier par fichier, avec validation visuelle à chaque étape.

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
    - Cards → classe `card-signal` ou `card-signal-accent` pour les KPIs mis en avant
    - Appliquer le dot grid + grain sur le wrapper principal (voir section Brand Devices §4a)
14. `src/app/dashboard/actions/` — Actions Board
    - Badges priorité → classes `.badge-urgent`, `.badge-warning`, `.badge-copper`, `.badge-stable`
    - Accent gauche sur actions urgentes → `border-l-[3px] border-l-[#B91C1C]` + fond `bg-[var(--color-error-bg)]`
    - Sparklines → stroke `var(--color-copper)` ou couleur sémantique correspondante
15. `src/app/dashboard/results/` — Résultats (4 onglets)
    - Jauges → cuivre au lieu de violet/indigo
    - Matrice ABC/XYZ → success/warning/textTri pour A/B/C
    - Sparklines → stroke cuivre
16. Détail série + chart Recharts — **IMPORTANT pour les textures** :
    - `stroke="var(--color-chart-actual)"` (#141414) pour actual
    - `stroke="var(--color-chart-forecast)"` (#B45309) pour forecast
    - `fill="var(--color-chart-grid)"` (#EEEEE8) pour grid
    - Ajouter la ligne de référence cuivre verticale (`<ReferenceLine>` Recharts avec stroke #B45309, strokeWidth 1.5)
    - Confidence band : `fill="#B45309"` opacity 0.08
    - **Dot grid dans la zone forecast** : voir section Brand Devices §4b — implémenter via ReferenceArea avec SVG pattern ou div positionné
    - **Pulse sur le dernier point réel** : voir section Brand Devices §5 — custom dot component

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

```tsx
// Exemple dans un titre de page
<div className="flex items-start gap-3">
  <div className="horizon-line h-6 mt-1" />
  <div>
    <h1 className="text-[22px] font-bold tracking-[-0.03em] text-[var(--color-text)]">
      Tableau de bord
    </h1>
    <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">
      247 séries · 24 méthodes de calcul
    </p>
  </div>
</div>
```

### 2. Copper Numerals
Toutes les valeurs KPI (score fiabilité, WAPE, nombre de séries, etc.) doivent utiliser la classe `copper-num` ou `copper-num-mono`.

```tsx
// KPI hero (grand)
<span className="copper-num text-[42px]">87.3%</span>

// KPI card (moyen)
<span className="copper-num text-[24px]">247</span>

// Inline data (petit, monospace)
<span className="copper-num-mono text-[11px]">WAPE 12.4%</span>
```

### 3. Section Markers
Ajouter `<span className="section-marker mr-2" />` avant chaque titre H2/section dans les pages résultats et dashboard.

```tsx
<div className="flex items-center gap-2 mb-3">
  <span className="section-marker" />
  <h2 className="text-[13px] font-semibold">Prévisions vs réalisé</h2>
</div>
```

### 4. Dot Grid — IMPORTANT : 3 endroits distincts

La texture dot grid apparaît à **3 niveaux** différents. Chaque usage est distinct :

#### 4a. Fond de page principal
Le fond de page combine le grain SVG (déjà sur `body` via le CSS tokens) ET un dot grid subtil. Appliquer sur le wrapper principal du dashboard :

```tsx
// Dans DashboardShell.tsx ou le layout principal
<main
  className="min-h-screen"
  style={{
    backgroundColor: 'var(--color-bg)',
    backgroundImage: `
      url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.015'/%3E%3C/svg%3E"),
      radial-gradient(var(--color-text-tertiary) 0.6px, transparent 0.6px)
    `,
    backgroundSize: '200px 200px, 16px 16px',
  }}
>
  {children}
</main>
```

Note : si le grain est déjà appliqué via `body` dans le CSS, ne pas le dupliquer. Ajouter uniquement le dot grid radial-gradient sur le wrapper.

#### 4b. Zone forecast dans les charts Recharts
Dans chaque chart série temporelle, la zone à droite de la ligne de référence (zone prévision) doit avoir un fond dot grid. Implémenter via un `<ReferenceArea>` Recharts ou un div positionné :

```tsx
// Option A : via Recharts ReferenceArea avec pattern SVG
// Dans le <defs> du SVG Recharts :
<defs>
  <pattern id="forecast-dots" width="16" height="16" patternUnits="userSpaceOnUse">
    <circle cx="8" cy="8" r="0.6" fill="var(--color-text-tertiary)" opacity="0.35" />
  </pattern>
</defs>

// Puis utiliser dans un ReferenceArea :
<ReferenceArea
  x1={lastActualDate}
  x2={lastForecastDate}
  fill="url(#forecast-dots)"
/>

// Option B : div positionné en absolute derrière le chart
// Calculer la position x de la ligne de référence, puis :
<div
  className="absolute top-0 bottom-0 right-0"
  style={{
    left: `${referenceLineX}px`,
    backgroundImage: 'radial-gradient(var(--color-text-tertiary) 0.6px, transparent 0.6px)',
    backgroundSize: '16px 16px',
    opacity: 0.35,
    pointerEvents: 'none',
  }}
/>
```

#### 4c. Cards de fond ou sections spéciales (optionnel)
Pour des sections "forecast zone" ou des cartes mises en avant, la classe `.dot-grid` peut être appliquée en fond :

```tsx
<div className="relative">
  <div className="dot-grid absolute inset-0 pointer-events-none" />
  <div className="relative z-10">
    {/* contenu */}
  </div>
</div>
```

### 5. Pulse
Sur le dernier point de données réel dans les charts Recharts, ajouter un cercle cuivre avec halo. Implémenter via un `<ReferenceDot>` custom ou un `customDot` :

```tsx
// Custom dot component pour Recharts
const PulseDot = (props) => {
  const { cx, cy, isLast } = props;
  if (!isLast) return <circle cx={cx} cy={cy} r={2.5} fill="var(--color-chart-actual)" />;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="var(--color-copper)" opacity={0.12} />
      <circle cx={cx} cy={cy} r={3} fill="var(--color-copper)" />
    </g>
  );
};

// Utilisation dans le Line chart
<Line
  dataKey="actual"
  stroke="var(--color-chart-actual)"
  dot={<PulseDot />}
/>
```

### 6. Micro-textures sur les cards
Toutes les cards doivent avoir la micro-shadow Signal. Vérifier que les cards utilisent `shadow-[var(--shadow-card)]` ou la classe `card-signal` / `card-signal-accent` :

```tsx
// Card standard
<div className="card-signal p-5">...</div>

// Card avec accent cuivre (KPI mis en avant)
<div className="card-signal-accent p-5">...</div>

// Ou via Tailwind inline si on ne veut pas la classe :
<div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
  ...
</div>
```

### 7. Copper Glow sur le CTA primaire
Le bouton d'action principal ("Lancer une prévision") doit avoir le glow cuivre subtil :

```tsx
<button className="btn-copper px-6 py-3 text-sm">
  Lancer une prévision
</button>

// Ou via Tailwind inline :
<button className="bg-[var(--color-copper)] text-white font-semibold rounded-md px-6 py-3 shadow-[0_1px_3px_rgba(180,83,9,0.15)] hover:bg-[var(--color-copper-hover)]">
  Lancer une prévision
</button>
```

### 8. Navbar shadow
La barre de navigation utilise une ombre subtile au lieu d'un border-bottom lourd :

```tsx
<nav className="bg-[var(--color-bg-card)] shadow-[0_1px_0_rgba(0,0,0,0.03)]">
  ...
</nav>
// Supprimer tout border-bottom existant sur la nav
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
- [ ] Le grain SVG est visible sur le fond de page (texture subtile, pas un fond plat)
- [ ] Le dot grid est visible dans la zone forecast des charts (à droite de la ligne de référence)
- [ ] Le dot grid est visible en fond de la zone principale du dashboard
- [ ] Le Pulse (point cuivre + halo) est visible sur le dernier point réel dans les charts
- [ ] Les cards ont une micro-shadow (pas de cards plates sans ombre)
- [ ] Le bouton CTA primaire a le copper glow (shadow cuivrée subtile)
- [ ] La navbar a un shadow bottom subtil (pas un border-bottom lourd)
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
