# CLAUDE.md - LumenIQ WebApp

## Project Overview

LumenIQ is a SaaS forecasting platform for SME retail/e-commerce businesses. It transforms sales histories into forecasts using 21 statistical/ML models with ABC/XYZ routing. The frontend is a French-language application.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5.9 (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style) + Radix UI primitives
- **Animations**: Framer Motion, React Three Fiber (3D), tailwindcss-animate
- **Charts**: Recharts v3
- **Auth & DB**: Supabase (PostgreSQL with custom `lumeniq` schema, SSR auth via middleware)
- **Icons**: Lucide React
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
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── login/              # Auth pages
│   ├── auth/callback/      # OAuth callback
│   ├── dashboard/          # Protected area (main app)
│   │   ├── forecast/       # New forecast submission
│   │   ├── history/        # Past forecast runs
│   │   ├── results/        # Forecast results & metrics
│   │   │   └── series/     # Individual series details
│   │   └── settings/       # User settings
│   ├── features/           # Features marketing page
│   └── pricing/            # Pricing marketing page
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── landing/            # Landing page sections
│   ├── dashboard/          # Dashboard-specific components
│   ├── charts/             # Recharts-based visualizations
│   ├── shared/             # Global components (navbar, footer, logo)
│   ├── animations/         # Framer Motion wrappers
│   ├── backgrounds/        # Background effects (particles, gradients)
│   ├── upload/             # File upload components
│   └── providers/          # Context providers
├── lib/
│   ├── supabase/
│   │   ├── server.ts       # Server-side Supabase client (SSR)
│   │   └── client.ts       # Browser-side Supabase client
│   ├── queries/            # Supabase query functions
│   ├── utils.ts            # cn() utility (clsx + tailwind-merge)
│   ├── tokens.ts           # Design tokens & color schemas
│   └── csv-analyzer.ts     # CSV parsing utilities
├── hooks/                  # Custom React hooks
│   ├── use-profile.ts
│   ├── useFileUpload.ts
│   ├── useJobStatus.ts
│   └── use-supabase.ts
├── types/
│   ├── database.ts         # Supabase-generated schema types
│   └── forecast.ts         # Forecast job & webhook types
└── middleware.ts            # Supabase auth middleware (protects /dashboard)
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

### Styling
- Dark theme is the default; light theme via `.light` class (next-themes)
- Design tokens are CSS custom properties in `globals.css` (e.g., `--bg-primary`, `--accent`)
- Use Tailwind utility classes; avoid inline styles
- Animation components in `components/animations/` wrap Framer Motion patterns

### Database
- All tables live in the `lumeniq` schema (not `public`)
- Types are in `src/types/database.ts` — regenerate with Supabase CLI when schema changes
- Server queries use `createClient()` (SSR); client queries use `createBrowserClient()`
- Key tables: `profiles`, `forecast_jobs`, `forecast_results`, `forecast_results_months`, `series_actuals`, `forecast_syntheses`, `job_summaries`

### Auth
- Supabase Auth with SSR via `@supabase/ssr`
- `middleware.ts` protects all `/dashboard/*` routes
- Auth callback at `/auth/callback`

### Language
- UI copy is in French (the target market is French SMEs)

## Environment Variables

Required (set in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## No Test Suite

There is currently no testing framework configured. No Jest, Vitest, or other test runner.

## No CI/CD

No GitHub Actions or other CI/CD pipelines are configured. Deployment is manual (likely Vercel).
