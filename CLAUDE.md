# CLAUDE.md - PREVYA WebApp

## Project Overview

PREVYA is a SaaS forecasting platform for SME retail/e-commerce businesses. It transforms sales histories into forecasts using 32 registered statistical/ML models (24 unique) with ABC/XYZ routing. The frontend is a French-language application.

## Tech Stack

- **Framework**: Next.js 16.1 (App Router) with React 19.2
- **Language**: TypeScript 5.9 (strict mode)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` syntax) + shadcn/ui (new-york style) + Radix UI primitives
- **Animations**: Framer Motion, React Three Fiber (3D), tw-animate-css
- **Charts**: Recharts v3
- **Auth & DB**: Supabase (PostgreSQL with custom `lumeniq` schema, SSR auth via middleware + layout redirect)
- **Icons**: Lucide React
- **PDF Export**: @react-pdf/renderer + html2canvas (chart capture)
- **Command Palette**: cmdk
- **Onboarding**: driver.js (guided tours)
- **Markdown**: react-markdown + remark-gfm
- **Dates**: date-fns
- **Compiler**: React Compiler (babel-plugin-react-compiler) enabled
- **Testing**: Vitest v4 + @testing-library/react + happy-dom

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint (flat config, v9)
npx tsc           # Type-check (no emit)
npm test          # Run unit tests (Vitest)
npm run test:watch # Watch mode
```

## Project Structure

```
├── middleware.ts                # Supabase auth middleware (at project root, NOT in src/)
src/
├── app/                         # Next.js App Router pages
│   ├── layout.tsx               # Root layout (Manrope+Syne fonts, ThemeProvider)
│   ├── globals.css              # Tailwind imports, design tokens, theme vars
│   ├── auth/callback/route.ts   # OAuth/SSR callback handler
│   ├── login/                   # Login / signup / forgot-password
│   ├── dashboard/               # Protected area (main app)
│   │   ├── layout.tsx           # Auth check + DashboardShell wrapper
│   │   ├── dashboard-shell.tsx  # Client shell: Sidebar + Header + CommandPalette + AiChat
│   │   ├── forecast/page.tsx    # 4-step forecast submission wizard
│   │   ├── history/page.tsx      # Past forecast jobs list
│   │   ├── results/             # Results tabs: overview, portfolio, series, synthesis, reliability
│   │   ├── actions/page.tsx     # Actions board (full-page, grouped by run)
│   │   └── settings/page.tsx    # Profile, subscription, preferences
│   ├── features/ pricing/ contact/ demo/  # Marketing pages
│   └── api/webhook/             # Server-side proxies (forecast + chat)
│
├── components/
│   ├── ui/                      # shadcn/ui base components (do NOT modify)
│   ├── dashboard/               # Dashboard-specific (series list, actions, reliability, ai-chat/)
│   ├── charts/                  # Recharts visualizations (gauges, bubble, treemap, trends)
│   ├── landing/                 # Landing page sections
│   ├── shared/                  # Navbar, footer, logo, theme toggle
│   ├── animations/              # Framer Motion wrappers
│   ├── backgrounds/              # Visual effects (particles, gradients)
│   ├── providers/                # React context providers
│   ├── skeletons/                # Loading skeleton components
│   └── forecast/ export/ upload/ onboarding/
│
├── hooks/                       # Custom React hooks (auth, upload, job polling, actions, PDF)
├── lib/
│   ├── env.ts                   # Centralized env var access (serverEnv/publicEnv)
│   ├── metrics.ts               # toChampionScore(), resolveSeriesErrorRatio()
│   ├── model-labels.ts          # French labels for technical model names
│   ├── chart-utils.ts           # fillZeroGap(), bridgeChartGap()
│   ├── series-alerts.ts         # Alert logic (WAPE thresholds, gating, drift)
│   ├── date-format.ts           # Frequency-aware date formatting
│   ├── glossary.tsx              # Alert glossary tooltips
│   ├── linkify-skus.ts           # SKU linking in text
│   ├── onboarding.ts             # Onboarding step definitions
│   ├── parse-markdown-sections.ts # Markdown section parser
│   ├── reliability-utils.ts      # Reliability tab computations (enriched models, family aggregations)
│   ├── schemas/                  # Zod validation schemas
│   │   └── actions.ts            # Action form schemas
│   ├── tokens.ts                 # Design token utilities
│   ├── supabase/                # Server + client Supabase clients (schema: lumeniq)
│   ├── queries/                 # Server-side data fetching (dashboard.ts, results.ts)
│   └── thresholds/              # User-customizable metric thresholds
│
└── types/                       # TypeScript types (database.ts, forecast.ts, actions.ts, export.ts, preferences.ts, results.ts)
```

## Key Conventions

### Imports
- Use `@/*` path alias (maps to `./src/*`)
- Component folders use barrel exports (`index.ts`)

### Components
- Server Components by default; add `"use client"` only when needed
- shadcn/ui components in `components/ui/` — do not modify these directly
- Use `cn()` from `@/lib/utils` for conditional class merging
- Dashboard pages fetch data server-side with `createClient()` from `@/lib/supabase/server`
- Client-side interactivity uses hooks from `@/hooks/`
- `DashboardShell` (in `dashboard-shell.tsx`) is the persistent client wrapper mounting Sidebar, Header, CommandPalette, and AiChat

### Styling
- Tailwind v4 with `@import "tailwindcss"` syntax in `globals.css` (no `tailwind.config.ts`)
- Dark theme is the default; light theme via `.dark` custom variant (next-themes)
- Design tokens are CSS custom properties in `globals.css` (e.g., `--bg-primary`, `--accent`)
- Use Tailwind utility classes; avoid inline styles
- Color palette: zinc scale (dark), indigo accent, violet for AI/chat elements
- Animation components in `components/animations/` wrap Framer Motion patterns

### Database
- All tables live in the `lumeniq` schema (not `public`)
- Types are in `src/types/database.ts` — regenerate with Supabase CLI when schema changes
- Server queries use `createClient()` from `@/lib/supabase/server`
- Client queries use `createClient()` from `@/lib/supabase/client` (singleton, schema pre-configured) with `.schema("lumeniq")` when needed for typed queries
- Key tables: `profiles`, `forecast_jobs`, `forecast_results`, `forecast_results_months`, `forecast_results_detail`, `series_actuals`, `forecast_syntheses`, `job_summaries`, `forecast_series`, `job_monthly_aggregates`, `user_preferences`, `forecast_actions`, `user_thresholds`
- `forecast_jobs` includes `engine_frequency` (detected data frequency) and `aggregation_applied` (boolean, true when source data was temporally aggregated to monthly)
- `forecast_results_detail` stores per-series forecast data at the source frequency (before temporal aggregation)

**Note**: `forecast_actions` uses `client_id` (not `user_id`) as its user foreign key. Queries must join via `job_id` → `forecast_jobs.user_id` for user-scoped access.

### Auth
- Supabase Auth with SSR via `@supabase/ssr`
- `middleware.ts` (at project root, NOT in `src/`) handles session refresh and route protection
- `src/app/dashboard/layout.tsx` also checks auth and redirects to `/login` if no user
- Auth callback at `/auth/callback` (handles OAuth + password recovery)
- Client-side auth via `useUser()` hook from `@/hooks/use-supabase`

### Language & Business Terminology
- UI copy is in French (the target market is French SMEs)
- **All technical ML terms must use business-friendly French labels:**

| Technical term | UI label (French) | Context |
|---|---|---|
| Champion Score | Score de fiabilité | Gauge, cards, series list (based on WAPE: `(1 - WAPE) × 100`) |
| SMAPE | Écart prévision | PDF export fallback only (legacy) |
| WAPE | Erreur pondérée | Primary metric for Score de fiabilité, alerts, PDF export |
| MAPE | Erreur moyenne | Results overview gauge card (populated via `global_mape` in `job_summaries`) |
| Bias | Biais prévision | Results overview gauge |
| CV (coefficient of variation) | Variabilité | Series detail, PDF |
| Champion model | Méthode retenue | PDF export, series detail |
| Gated | Prévisions stables | Alert badge, PDF |
| Drift | Changement de tendance | Alert badge |
| Model changed | Méthode adaptée | Alert badge |
| Backtesting | Validation sur historique | Forecast wizard |
| Upload | Import | Forecast wizard step label |
| Forecast | Prévision | All user-facing text |
| IC Bas / IC Haut | Borne basse / Borne haute | PDF export table |
| Score (in series list) | Fiabilité | Series list right column |

- **Model names**: Use `getModelMeta(technicalName).label` from `@/lib/model-labels.ts` to display French labels (e.g., `hw_multiplicative` → "Holt-Winters multiplicatif"). Never show raw technical model names to users.

### Webhook Signature (`lib/webhook-signature.ts`)
- `signWebhookPayload(body)` → `{ signature: "t=<timestamp>,v1=<hmac_hex>", timestamp }`
- Algorithm: HMAC-SHA256 over `<timestamp>.<body>` using `N8N_WEBHOOK_SECRET`
- Replay protection: N8N verifies timestamp is within 5 minutes
- Used by both `/api/webhook/forecast` and `/api/webhook/chat` routes

### API Routes (`app/api/webhook/`)
- **`/api/webhook/forecast/route.ts`** — Server-side proxy to N8N for job submission. Verifies job ownership, resolves user plan for config routing, signs payload with HMAC-SHA256.
- **`/api/webhook/chat/route.ts`** — Server-side proxy to N8N for AI chat. Verifies user auth and job ownership, forwards question + conversation history, returns markdown response.

### Queries Pattern
- **Server-side** (pages): import from `@/lib/queries/results` or `@/lib/queries/dashboard`, use `createClient()` from `@/lib/supabase/server`
- **Client-side** (hooks/components): import `createClient` from `@/lib/supabase/client`, call `.schema("lumeniq")` explicitly for typed queries
- **RPC calls**: `getJobDetailChartData(jobId, userId, frequency)` uses Supabase RPC `get_job_source_chart_data` for server-side aggregation of chart data at source frequency — avoids PostgREST row limits and client-side aggregation
- **Source-frequency data**: `getSeriesDetailForecastData(jobId, seriesId, userId)` queries `forecast_results_detail` for per-series data at the original (non-aggregated) frequency
- **Two-phase fetching**: Charts first fetch the job to extract `engine_frequency` and `aggregation_applied`, then conditionally fetch source-frequency data only when aggregation was applied (lazy-loading pattern)

> **Data Contract**: See root `CLAUDE.md` for the authoritative metric storage convention (all metrics stored as ratios 0-1). Key frontend functions: `toChampionScore(ratio)` → `(1 - ratio) × 100`, `resolveSeriesErrorRatio(row)` → fallback chain: `wape` → `smape`. The `challengers` field has two formats (old: list with SMAPE, new: dict with WAPE) — `getSeriesModelComparison` handles both.

### Series Alerts
- Alert logic in `@/lib/series-alerts.ts`: `getSeriesAlerts()` returns alert types based on WAPE thresholds (>20% = Fiabilité faible, >15% = Fiabilité modérée), gating, drift, model changes
- Alert badges rendered by `SeriesAlertBadges` component using `AlertBadge` from `components/ui/alert-badge.tsx`
- `AlertsSummaryCard` shows aggregate alert counts on the results overview
- Badge labels (French, business-friendly): Fiabilité faible, Fiabilité modérée, Changement de tendance, Méthode adaptée, Nouveau produit, Prévisions stables
- Series detail page "Alertes et observations" section combines:
  - **Computed alerts** (badges from `getSeriesAlerts()`) with glossary tooltips
  - **Rich actions** from `forecast_actions` table via `getSeriesActions()` query, rendered as `ActionCard` components with dismiss support
- Glossary tooltips available for all alert types: `attention`, `watch`, `drift`, `model_changed`, `gated`
- Trend labels on action cards: Dégradation (red), Stable (neutral), Amélioration (green)

### Model Labels (`lib/model-labels.ts`)
- `MODEL_LABELS`: maps 29 technical model names to French labels and family categories. Recent additions: `rolling_mean_long` → "Moyenne mobile étendue" (family: classical), `tbats` → "TBATS" (family: decomposition)
- `MODEL_FAMILIES`: 4 families — Décomposition avancée (violet), Statistique classique (blue), Machine Learning (emerald), Statistique avancée (amber)
- `getModelMeta(name)`: returns `{ label, family, familyColor }` — always use this for user-facing model names
- `getFamilyMeta(name)`: returns `{ hex, bgClass, label }` — for color-coding by family

## Key Features

### AI Chat (`components/dashboard/ai-chat/`)
- Floating button (bottom-right) on all `/dashboard/*` pages
- Sheet drawer with multi-turn conversation
- Calls server-side proxy `/api/webhook/chat` (HMAC-signed, N8N URL server-only) with jobId, userId, question, history
- Contextual suggestions based on job metrics (WAPE, bias, XYZ distribution)
- Markdown responses rendered with `MarkdownRenderer`
- State persists across dashboard navigation, resets on page reload

### Actions Board (`components/dashboard/actions-board.tsx`, `hooks/use-actions.ts`)
- Automatic post-forecast recommendations (stock alerts, reliability warnings, volume changes)
- Backend generates actions via rule-based detection + Claude API reformulation (see `Lumen_IQ/docs/ACTIONS_SYSTEM.md`)
- `useActions(mode, jobId)` hook: two modes — `"drawer"` (results panel) and `"page"` (full `/dashboard/actions` page grouped by run)
- `useUrgentCount()` hook: lightweight badge counter for sidebar (polls every 30s)
- `ActionsBoard` renders `ActionsSummaryCard` (executive summary) + `ActionCard[]` (per-action cards with priority colors, dismiss, navigate)
- Actions are dismissible (optimistic update + undo toast) via `status = "dismissed"` in `forecast_actions` table
- Priority levels: urgent (red), warning (orange), info (blue), clear (green)
- Recurrence badges ("3e fois") and trend indicators ("Dégradation" / "Amélioration") from multi-run enrichment

### Portfolio View (`components/dashboard/portfolio-view.tsx`)
- Interactive scatter plot of all series, grouped by 6 behavioral clusters: stable, seasonal, trendy, intermittent, volatile, other
- X-axis: forecast volume (sum/avg), Y-axis: reliability score (/100), bubble size: ABC class importance
- Filter pills per cluster, click navigates to series detail, double-click zooms 2x
- Per-cluster summary cards: count, avg reliability, volume %, top model, ABC breakdown, at-risk series, business advice
- Responsive mobile layout, Framer Motion animations
- Threshold visualization lines (reliability seuil, median volume)
- Accessible as the second tab on the results page (order: overview → portfolio → series → synthesis → reliability)

### Threshold System (`lib/thresholds/`, `components/dashboard/threshold-settings.tsx`)
- User-customizable metric color thresholds (green/yellow/red zones) for 5 dashboard metrics:
  - `reliability_score` (Score de fiabilité): ≥80 green, ≥70 yellow
  - `wape` (Erreur pondérée (WAPE)): ≤15 green, ≤20 yellow
  - `model_score` (Score modèle): ≥80 green, ≥50 yellow
  - `mase` (Indice prédictif (MASE)): ≤80 green, ≤100 yellow
  - `bias` (Biais prévision): ≤5 green, ≤10 yellow
- `ThresholdsProvider` + `useThresholds()` hook: fetches from `user_thresholds` table, merges with defaults
- `getColor(metricKey, value)` returns zone ("green" | "yellow" | "red")
- `threshold-settings.tsx`: editable grid UI with live color bar preview, debounced save to Supabase, per-metric reset
- Used by portfolio view and results pages for consistent color coding

### Results Download (`app/dashboard/results/actions.ts`)
- "Télécharger" button on results overview page
- Downloads the .zip file from Supabase Storage bucket `forecasts` at path `results/{user_id}/{job_id}`
- ZIP is uploaded by the N8N workflow after job completion (not by the frontend)
- Server action `getResultsDownloadUrl(jobId)` creates a signed URL (5 min validity, generated on each click)
- Works for any past job — not time-limited after job completion

### Results Overview Gauge Cards
5 metric cards displayed on the results overview tab:
1. **Score de fiabilité** — `(1 - WAPE) × 100` via `toChampionScore()`, quality score /100
2. **Erreur moyenne (MAPE)** — mean absolute percentage error, informational gauge (from `global_mape` in `job_summaries`, hidden for old jobs where null)
3. **Biais prévision** — directional tendency (over/under-estimation)
4. **Séries réussies** — count of successfully analyzed series
5. **Séries fiables** — % of series with champion_score ≥ 70/100

### Granularity Toggle (Temporally Aggregated Forecasts)
- Toggle "Mensuel" / "Source" on overview and series pages for datasets with temporal aggregation (e.g., daily/weekly data aggregated to monthly)
- Visible only when `aggregation_applied === true` on the job (set by backend when source frequency differs from forecast frequency)
- **Mensuel** (default): shows monthly-aggregated forecast and actuals
- **Source**: lazy-loads original-frequency data via `getSeriesDetailForecastData()` from `forecast_results_detail` table, and chart data via `getJobDetailChartData()` RPC
- Actuals are aggregated to monthly via month-start key grouping when switching back to Mensuel view
- Aggregation badge displayed in the job header when temporal aggregation was applied
- Date axis formatting adapts to frequency via `formatDateByFrequency()` from `date-format.ts`
- Source chart data is reset when navigating between series to prevent stale data display

### Frequency-Aware Date Formatting (`lib/date-format.ts`)
- `classifyFreq(freq: string): FreqFamily` — normalizes pandas frequency strings (e.g., "7D" → "W", "MS" → "M", "D" → "D") into families: H, D, W, M, Q
- `formatDateByFrequency(ds, freq)` — formats date labels per frequency: H → "dd/MM HH:mm", D → "dd MMM", W → "dd MMM yy", M → "MMM yy", Q → "T1 25"
- `formatFrequencyLabel(freq)` — returns French labels: Horaire, Journalier, Hebdomadaire, Mensuel, Trimestriel
- Falls back to monthly formatting when frequency is null/undefined

### Chart Gap Filling for Dormant Series (`lib/chart-utils.ts`)
- `fillZeroGap(dataMap, lastActualKey, firstForecastKey, frequency, formatFn)` — fills missing periods between the last actual data point and the first forecast with `actual: 0` entries
- Prevents visual jumps on charts for dormant/end-of-life series (e.g., last sale Dec 2023 → forecast Jan 2026 now shows ~24 months of zeros)
- For active weekly series, the backend cross-month boundary fix ensures no gap exists between last actual and first forecast (e.g., Dec 22 → Dec 29), so `fillZeroGap()` has nothing to fill and returns early
- Frequency-aware: steps by month (M/Q), week (W/7D), or day (D) based on `classifyFreq()`
- Used in both `getSeriesChartData()` (server-side, monthly view in `results.ts`) and source-frequency view (client-side, `series-content.tsx`)
- `bridgeChartGap(data)` — copies the last actual value into the forecast field at the junction point so Recharts draws a continuous transition line between the two series
- `resolveGlobalErrorRatio(data)` — fallback chain for global error metrics: `global_wape` → `global_smape`

### PDF Export (`components/export/`, `hooks/useExportPdf.ts`)
- Series-level PDF report generation via `@react-pdf/renderer`
- Chart capture via `html2canvas`
- Triggered by `ExportPdfButton` on series detail page
- Labels fully translated to French business terms

### Command Palette (`components/dashboard/command-palette.tsx`)
- Cmd+K (Mac) / Ctrl+K (Windows) keyboard shortcut
- Navigation to series, tabs, pages — tab order aligned with results page (overview → portfolio → series → synthesis → reliability)
- Mounted in `DashboardShell` with `<Suspense>` boundary

### Onboarding Tour (`components/onboarding/`, `hooks/useOnboarding.ts`)
- Guided tour using `driver.js` on the results page
- Completion state persisted in localStorage
- Can be reset from Settings page

### Forecast Submission (`app/dashboard/forecast/`)
- 4-step wizard: Import → Configuration → Calcul → Résultats
- CSV/XLSX upload to Supabase Storage
- N8N webhook trigger via server-side proxy `/api/webhook/forecast` (HMAC-signed) after job creation
- Job polling via `useJobStatus` hook (3s interval)
- User preferences (horizon, gating, confidence) via `useUserPreferences`
- CSV column mapping: `csv-analyzer.ts` detects date, value, and series_id columns automatically. Detected column names (`date_column`, `value_columns`) are stored on the `forecast_jobs` row and transmitted to the backend via the N8N webhook payload for correct CSV parsing
- Multi-series frequency detection: the analyzer infers temporal frequency and span across all series in the CSV for display in the submission wizard
- Success screen shows qualitative message based on WAPE ("Excellente précision" < 5%, "Bonne précision" < 15%, "Précision à surveiller" ≥ 15%)
- Job ID hidden from end users on success screen

## Environment Variables

Required (set in `.env.local`):

**Public (exposed to client):**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key

**Server-only (NOT exposed to client, no `NEXT_PUBLIC_` prefix):**
- `N8N_WEBHOOK_URL` — N8N webhook for forecast job trigger (via proxy `/api/webhook/forecast`)
- `N8N_CHAT_WEBHOOK_URL` — N8N webhook for AI chat (via proxy `/api/webhook/chat`)
- `N8N_WEBHOOK_SECRET` — HMAC-SHA256 secret for webhook signature
- `SUPABASE_SERVICE_ROLE_KEY` — Admin key for account deletion (RGPD)

**Centralized validation via `src/lib/env.ts`:**
- All env vars are accessed via `serverEnv` (lazy getters, server-only) and `publicEnv` (eager, client-safe)
- **PITFALL Next.js**: `NEXT_PUBLIC_*` vars must be accessed with **static dot notation** (`process.env.NEXT_PUBLIC_FOO`) for client-side inlining. Dynamic access (`process.env[name]`) returns `undefined` on the client. That's why `requirePublicEnv()` takes the value as a second parameter from a static reference.
- Never add `process.env.*` calls outside of `env.ts` — always import from `@/lib/env`

## Testing

- **Framework**: Vitest v4 with happy-dom environment
- **Config**: `vitest.config.ts` at project root
- **Test files**: `src/**/__tests__/*.test.{ts,tsx}`
- **Commands**: `npm test` (single run), `npm run test:watch` (watch mode)
- **Current tests**: Unit tests for alert logic (`series-alerts`), alert badge config (`alert-badge`), action card config (`action-card`), threshold calculations (`thresholds`), frequency formatting (`granularity-toggle`)
- Tests validate: alert thresholds, priority ordering, absence of technical jargon in user-facing labels, color coherence with severity levels, threshold color zone logic, frequency label formatting (`formatFrequencyLabel`), frequency classification (`classifyFreq`)

Marketing pages: `/features`, `/contact`, `/demo`, `/pricing`, `/mentions-legales`, `/politique-de-confidentialite` — see components in `app/` and `components/landing/`.

### Pricing Configuration (`lib/pricing-config.ts`)

Single source of truth for pricing tiers:
- **Standard**: 17 models, 50 series
- **ML**: 22 models, 150 series
- **Premium**: 24 models, 300 series

Used by `/pricing` page and referenced across the app.

### SEO & Social Sharing

- `opengraph-image.tsx` — Dynamic Open Graph image generation (fr_FR locale)
- `twitter-image.tsx` — Dedicated Twitter card image (1200x600, `summary_large_image`)
- `robots.ts` — Robots.txt: allows `/`, blocks `/dashboard/`, `/auth/`, `/api/`
- `sitemap.ts` — 8 routes, static dates, differentiated priorities
- Per-page `metadata` exports with unique title, description, canonical URLs (features, pricing, contact, demo, login)
- JSON-LD structured data: Organization, SoftwareApplication, FAQPage (pricing), BreadcrumbList (features, pricing, contact, demo)
- `/login` has `robots: { index: false, follow: false }`

### Security Headers

Configured in `next.config.ts` on all routes:
- `Content-Security-Policy` — Restricts content sources (self + Supabase only)
- `Strict-Transport-Security` — HSTS 1 year + preload + includeSubDomains
- `X-Frame-Options: DENY` — Anti-clickjacking
- `X-Content-Type-Options: nosniff` — Prevents MIME-sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — Disables camera, microphone, geolocation, payment

### Accessibility

- `<html lang="fr">` declared in root layout
- Skip-to-content link (`sr-only focus:not-sr-only`)
- ARIA labels on sections, FAQ, icons, menus
- Radix UI primitives = native accessibility (focus trap, keyboard nav)
- `prefers-reduced-motion` respected in `globals.css` (scroll-behavior), `animated-background.tsx`, and all Framer Motion animation components (`fade-in.tsx`, `parallax.tsx`, `tilt-card.tsx`, `text-reveal.tsx`, `stagger-children.tsx`) via `useReducedMotion()` hook
- Contrast WCAG AAA in dark mode (~15:1 white on zinc-950)
- Cmd+K palette accessible via keyboard
- Toasts (sonner) with ARIA live regions

> **Git & CI**: See root `CLAUDE.md`. No CI/CD configured — deployment is manual (Vercel).
