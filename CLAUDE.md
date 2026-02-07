# CLAUDE.md - LumenIQ WebApp

## Project Overview

LumenIQ is a SaaS forecasting platform for SME retail/e-commerce businesses. It transforms sales histories into forecasts using 21 statistical/ML models with ABC/XYZ routing. The frontend is a French-language application.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
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

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint (flat config, v9)
npx tsc           # Type-check (no emit)
```

## Project Structure

```
├── middleware.ts                # Supabase auth middleware (at project root, NOT in src/)
src/
├── app/                         # Next.js App Router pages
│   ├── layout.tsx               # Root layout (Manrope font, ThemeProvider, PageTransition)
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Tailwind imports, design tokens, theme vars
│   ├── auth/callback/route.ts   # OAuth/SSR callback handler
│   ├── login/
│   │   ├── page.tsx             # Login / signup / forgot-password tabs
│   │   └── reset-password/page.tsx
│   ├── dashboard/               # Protected area (main app)
│   │   ├── layout.tsx           # Auth check + DashboardShell wrapper
│   │   ├── page.tsx             # Dashboard home (stats, charts, recent jobs)
│   │   ├── loading.tsx          # Dashboard loading skeleton
│   │   ├── dashboard-shell.tsx  # Client shell: Sidebar + Header + CommandPalette + AiChat
│   │   ├── dashboard-content.tsx
│   │   ├── forecast/page.tsx    # 4-step forecast submission wizard
│   │   ├── history/
│   │   │   ├── page.tsx
│   │   │   └── history-content.tsx
│   │   ├── results/
│   │   │   ├── page.tsx         # Tabs: overview, series, models, synthesis
│   │   │   ├── loading.tsx
│   │   │   ├── results-content.tsx
│   │   │   ├── results-client.tsx  # Dynamic import wrapper (avoids SSR hydration mismatch)
│   │   │   ├── actions.ts       # Server actions
│   │   │   └── series/
│   │   │       ├── page.tsx     # Individual series detail (?job=&series=)
│   │   │       ├── loading.tsx
│   │   │       └── series-content.tsx
│   │   └── settings/page.tsx    # Profile, subscription, preferences, API key, danger zone
│   ├── features/page.tsx        # Features marketing page
│   ├── pricing/page.tsx         # Pricing page (3 tiers + enterprise)
│   └── test-upload/page.tsx     # Dev-only: CSV upload test page
│
├── components/
│   ├── ui/                      # shadcn/ui base components (do NOT modify)
│   │   ├── accordion.tsx
│   │   ├── alert-badge.tsx
│   │   ├── badge-with-tooltip.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── command.tsx          # cmdk-based command component
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── help-tooltip.tsx
│   │   ├── input.tsx
│   │   ├── popover.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx            # Side panel (used by AI Chat drawer)
│   │   ├── skeleton.tsx
│   │   ├── sparkline.tsx        # Mini inline chart
│   │   ├── switch.tsx
│   │   └── tooltip.tsx
│   │
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── index.ts             # Barrel export
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── command-palette.tsx  # Cmd+K navigation palette
│   │   ├── stat-card.tsx
│   │   ├── recent-forecasts.tsx
│   │   ├── empty-dashboard.tsx
│   │   ├── series-list.tsx
│   │   ├── series-navigator.tsx
│   │   ├── series-quick-select.tsx
│   │   ├── series-filters-dropdown.tsx
│   │   ├── series-sort-dropdown.tsx
│   │   ├── active-filters-bar.tsx
│   │   ├── AlertsSummaryCard.tsx
│   │   ├── synthesis-card.tsx
│   │   ├── synthesis-accordion.tsx
│   │   ├── markdown-renderer.tsx  # react-markdown with dark theme styling
│   │   ├── ai-chat/            # AI chatbot (N8N webhook)
│   │   │   ├── index.ts
│   │   │   ├── AiChatButton.tsx   # Floating action button
│   │   │   ├── AiChatDrawer.tsx   # Sheet + orchestrator
│   │   │   ├── ChatMessages.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── SuggestedQuestions.tsx
│   │   │   └── types.ts
│   │   └── results/            # Results-page-specific
│   │       ├── SeriesAlertBadges.tsx
│   │       ├── ExportPdfButton.tsx
│   │       └── results-skeletons.tsx
│   │
│   ├── charts/                  # Recharts-based visualizations
│   │   ├── index.ts
│   │   ├── abc-xyz-matrix.tsx
│   │   ├── animated-area-chart.tsx
│   │   ├── animated-gauge.tsx
│   │   ├── metric-gauge-card.tsx
│   │   ├── model-performance-chart.tsx
│   │   └── quota-progress.tsx
│   │
│   ├── landing/                 # Landing page sections
│   │   ├── index.ts
│   │   ├── hero.tsx
│   │   ├── hero-chart.tsx
│   │   ├── features-section.tsx
│   │   ├── how-it-works.tsx
│   │   ├── comparison-section.tsx
│   │   ├── cta-section.tsx
│   │   ├── faq-section.tsx
│   │   └── pricing-preview.tsx
│   │
│   ├── shared/                  # Global components (navbar, footer, logo)
│   │   ├── index.ts
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── logo.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── page-loader.tsx
│   │   └── scroll-progress.tsx
│   │
│   ├── animations/              # Framer Motion wrappers
│   │   ├── index.ts
│   │   ├── fade-in.tsx
│   │   ├── text-reveal.tsx
│   │   ├── parallax.tsx
│   │   ├── tilt-card.tsx
│   │   ├── magnetic-button.tsx
│   │   └── stagger-children.tsx
│   │
│   ├── backgrounds/             # Background effects
│   │   ├── index.ts
│   │   ├── animated-background.tsx
│   │   └── floating-particles.tsx
│   │
│   ├── onboarding/              # Guided tours (driver.js)
│   │   ├── index.ts
│   │   └── results-tour.tsx
│   │
│   ├── forecast/                # Forecast submission components
│   │   ├── ForecastOptions.tsx
│   │   └── enriched-waiting.tsx
│   │
│   ├── export/                  # PDF export
│   │   └── SeriesPdfReport.tsx
│   │
│   ├── upload/                  # File upload
│   │   └── file-upload-zone.tsx
│   │
│   ├── skeletons/               # Loading skeletons
│   │   └── index.tsx
│   │
│   ├── providers/               # Context providers
│   │   └── page-transition.tsx
│   │
│   └── theme-provider.tsx
│
├── hooks/                       # Custom React hooks
│   ├── use-profile.ts           # User profile fetch from DB
│   ├── use-supabase.ts          # useUser(), useSupabase(), useLogout()
│   ├── useFileUpload.ts         # CSV upload → job creation → N8N webhook
│   ├── useJobStatus.ts          # Job polling (3s interval, auto-stop)
│   ├── useExportPdf.ts          # PDF export (html2canvas + react-pdf)
│   ├── useOnboarding.ts         # Tour state (localStorage-based)
│   ├── useSeriesNavigation.ts   # Series list navigation + sorting + URL sync
│   └── useUserPreferences.ts    # Forecast config preferences (horizon, gating, CI)
│
├── lib/
│   ├── utils.ts                 # cn() utility (clsx + tailwind-merge)
│   ├── tokens.ts                # Design tokens & color schemas
│   ├── metrics.ts               # toChampionScore(), getChampionScoreColor(), getChampionScoreStatus()
│   ├── csv-analyzer.ts          # CSV parsing, format detection, frequency analysis
│   ├── series-alerts.ts         # getSeriesAlerts(), sortAlertsByPriority(), countAlertsByType()
│   ├── linkify-skus.ts          # SKU linkification in markdown content
│   ├── parse-markdown-sections.ts  # Split markdown by H2 headers for accordions
│   ├── glossary.tsx             # Help tooltip content definitions
│   ├── onboarding.ts            # Tour completion state (localStorage)
│   ├── mock-data.ts             # Development mock data
│   ├── supabase/
│   │   ├── server.ts            # Server-side Supabase client (SSR, schema: lumeniq)
│   │   └── client.ts            # Browser-side Supabase client (singleton, schema: lumeniq)
│   └── queries/
│       ├── dashboard.ts         # getDashboardStats(), getModelPerformance(), etc.
│       └── results.ts           # getJobMetrics(), getTopBottomSeries(), getSeriesDetails(), etc.
│
└── types/
    ├── database.ts              # Supabase-generated schema types (lumeniq schema)
    ├── forecast.ts              # ForecastJob, ForecastResult, SeriesListItem, upload types
    ├── export.ts                # PDF export types
    └── preferences.ts           # User preferences & defaults
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
- Key tables: `profiles`, `forecast_jobs`, `forecast_results`, `forecast_results_months`, `series_actuals`, `forecast_syntheses`, `job_summaries`, `forecast_series`, `job_monthly_aggregates`, `user_preferences`

### Auth
- Supabase Auth with SSR via `@supabase/ssr`
- `middleware.ts` (at project root, NOT in `src/`) handles session refresh and route protection
- `src/app/dashboard/layout.tsx` also checks auth and redirects to `/login` if no user
- Auth callback at `/auth/callback` (handles OAuth + password recovery)
- Client-side auth via `useUser()` hook from `@/hooks/use-supabase`

### Language
- UI copy is in French (the target market is French SMEs)

### Queries Pattern
- **Server-side** (pages): import from `@/lib/queries/results` or `@/lib/queries/dashboard`, use `createClient()` from `@/lib/supabase/server`
- **Client-side** (hooks/components): import `createClient` from `@/lib/supabase/client`, call `.schema("lumeniq")` explicitly for typed queries
- Metric values in DB are stored as ratios (0-1); the frontend converts to percentages (0-100) in query functions

### Series Alerts
- Alert logic in `@/lib/series-alerts.ts`: `getSeriesAlerts()` returns alert types based on SMAPE thresholds, gating, drift, model changes
- Alert badges rendered by `SeriesAlertBadges` component
- `AlertsSummaryCard` shows aggregate alert counts on the results overview

## Key Features

### AI Chat (`components/dashboard/ai-chat/`)
- Floating button (bottom-right) on all `/dashboard/*` pages
- Sheet drawer with multi-turn conversation
- Calls N8N webhook (`NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL`) with jobId, userId, question, history
- Contextual suggestions based on job metrics (WAPE, bias, XYZ distribution)
- Markdown responses rendered with `MarkdownRenderer`
- State persists across dashboard navigation, resets on page reload

### PDF Export (`components/export/`, `hooks/useExportPdf.ts`)
- Series-level PDF report generation via `@react-pdf/renderer`
- Chart capture via `html2canvas`
- Triggered by `ExportPdfButton` on series detail page

### Command Palette (`components/dashboard/command-palette.tsx`)
- Cmd+K (Mac) / Ctrl+K (Windows) keyboard shortcut
- Navigation to series, tabs, pages
- Mounted in `DashboardShell` with `<Suspense>` boundary

### Onboarding Tour (`components/onboarding/`, `hooks/useOnboarding.ts`)
- Guided tour using `driver.js` on the results page
- Completion state persisted in localStorage
- Can be reset from Settings page

### Forecast Submission (`app/dashboard/forecast/`)
- 4-step wizard: upload → config review → processing → done
- CSV/XLSX upload to Supabase Storage
- N8N webhook trigger (`NEXT_PUBLIC_N8N_WEBHOOK_URL`) after job creation
- Job polling via `useJobStatus` hook (3s interval)
- User preferences (horizon, gating, confidence) via `useUserPreferences`

## Environment Variables

Required (set in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `NEXT_PUBLIC_N8N_WEBHOOK_URL` — N8N webhook for forecast job trigger
- `NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL` — N8N webhook for AI chat

## No Test Suite

There is currently no testing framework configured. No Jest, Vitest, or other test runner.

## No CI/CD

No GitHub Actions or other CI/CD pipelines are configured. Deployment is manual (likely Vercel).
