# PREVYA Signal

A precision-focused, warm light theme built around a copper accent and clean typographic hierarchy. Designed for data-driven SaaS interfaces, forecasting dashboards, and professional business communications. The copper line of reference is the signature visual element.

## Color Palette

### Primary & Accent
- **Copper (Primary Accent)**: `#B45309` - Brand accent, CTA buttons, key metrics, forecast elements. WCAG AA on #FAFAF9 (4.81:1)
- **Copper Hover**: `#9A4408` - Interactive hover/active states. AA+ (6.27:1)
- **Copper Dark**: `#92400E` - High contrast variant for critical text. AAA on white (7.09:1)
- **Copper Background**: `#FEF3E2` - Tinted background for highlighted areas
- **Copper Background Soft**: `#FFFBF5` - Very subtle copper tint for hover states

### Backgrounds & Surfaces
- **Background**: `#FAFAF9` - Main page background (warm white)
- **Card**: `#FFFFFF` - Cards, panels, modals
- **Surface**: `#F3F3F0` - Hover states, secondary surfaces, input backgrounds

### Borders
- **Border**: `#E5E5E0` - Standard borders, dividers
- **Border Medium**: `#D0D0C8` - Emphasized borders, active states

### Text
- **Text Primary**: `#141414` - Headings, primary content. AAA (17.64:1)
- **Text Secondary**: `#5C5C58` - Descriptions, secondary info. AA (6.43:1)
- **Text Tertiary**: `#8A8A82` - Captions, labels, non-essential. AA-large only (3.33:1) — use at 18px+ bold or 24px+ regular only

### Semantic Colors
- **Success**: `#15803D` - Validations, positive metrics, class A indicators
- **Success Background**: `#F0FDF4`
- **Warning**: `#A16207` - Alerts, attention required, class B indicators
- **Warning Background**: `#FEFCE8`
- **Error**: `#B91C1C` - Errors, urgent actions, rupture alerts
- **Error Background**: `#FEF2F2`

### Chart Colors
- **Chart Actual**: `#141414` - Historical data lines (past = dark, solid)
- **Chart Forecast**: `#B45309` - Forecast lines (future = copper, dashed)
- **Chart Grid**: `#EEEEE8` - Grid lines
- **Chart Confidence Band**: `rgba(180, 83, 9, 0.08)` - Confidence interval fill

## Typography

- **Headers**: Satoshi Bold/Black (700/900) — from Fontshare (self-host woff2 recommended). Geometric sans-serif with personality. Letter-spacing: -0.03em for large headings.
- **Body Text**: Satoshi Regular/Medium (400/500) — same family for consistency. Clean, legible, modern.
- **Data & Monospace**: IBM Plex Mono Medium (500/600) — for metrics, timestamps, badges, WAPE values. Tabular nums enabled.

### Type Scale
- Hero metric: Satoshi 700, 42–48px, copper color
- H1: Satoshi 700, 22px
- H2/Section: Satoshi 600, 13px, preceded by copper section marker
- Body: Satoshi 400, 13px
- Caption: Satoshi 400, 11px, secondary/tertiary color
- KPI value: Satoshi 700, 24px, copper color
- Mono data: IBM Plex Mono 500, 11px
- Mono badge: IBM Plex Mono 600, 9–10px, uppercase, letter-spacing 0.05em

## Brand Devices (Signature Elements)

1. **Horizon Line** — Vertical copper bar (3px width, #B45309). Appears in charts (reference separator), page titles (left accent), active cards (border-left), active nav (underline).
2. **Copper Numerals** — All key metrics displayed in copper. Satoshi 700 for display, IBM Plex Mono for inline data.
3. **Section Markers** — Small copper dash (12px × 2px) before every section title. Rhythms the reading flow.
4. **Dot Grid** — Micro-dot texture (16px grid, 0.6px radius, 35% opacity) in forecast zones and page backgrounds. Evokes precision and graph paper.
5. **Pulse** — Copper dot (r=3) with translucent halo (r=5, 12% opacity) on the last real data point in charts. "You are here."

## Logo: Ascension (Courbe → Droite)

The logo features a bold ascending curve crossing a vertical copper reference line. The curve is black (organic, past data) on the left and turns copper (directional, forecast) at the crossing point with a sharp angular break. An anchor dot grounds the composition bottom-left.

- Light variant: black #141414 curve + copper #B45309 line & future segment
- Dark variant: white #ECECEC curve + copper #B45309 line & future segment (copper never changes)
- Favicon: Angular condensed version — two straight segments with the same color break
- Wordmark: "PREVYA" in Satoshi Black (900), letter-spacing -0.03em

## Micro-Textures

- **SVG Grain**: feTurbulence fractalNoise, baseFrequency 0.9, opacity 0.015 — on main background
- **Card Shadow**: 0 1px 2px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)
- **Card Shadow Hover**: 0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)
- **Copper Glow CTA**: 0 1px 3px rgba(180,83,9,0.15) — primary button only
- **Nav Shadow**: 0 1px 0 rgba(0,0,0,0.03) — navbar bottom edge

## Spacing & Radius

- Border radius: sm=4px, md=6px, lg=8px, xl=12px
- Card padding: 16–20px
- Section spacing: 24–28px between major sections

## Best Used For

SaaS dashboards, forecasting and analytics platforms, data-driven business tools, professional reports and presentations, landing pages for B2B SME products, email templates for transactional notifications. NOT for consumer/playful products, creative portfolios, or entertainment content.

## Anti-Patterns (Never Use With This Theme)

- No violet, indigo, or electric blue — AI-generic territory
- No glow, glassmorphism, or neon gradients — superfluous effects
- No beige/cream + serif combinations — Claude.ai territory
- No Inter, DM Sans, Plus Jakarta Sans, Outfit — over-used AI fonts
- No charts without the copper reference line
- No cards without micro-shadow
- No copper on narrative text — reserved for data and accents only

## Brand Vocabulary

When generating text content with this theme, use business-friendly language:
- "Mise à jour" not "run"
- "Score de fiabilité" not "WAPE"
- "Méthode de calcul" not "modèle statistique"
- "RÉFÉRENCE" not "AUJOURD'HUI" (chart labels)
- "Prévision" not "forecast/prédiction"
- "Meilleure méthode" not "champion model"
- "Sélection automatique" not "tournament"
- "Évolution des données" not "data drift"
