# LumenIQ 🔮

**Plateforme SaaS de forecasting professionnel pour PME e-commerce**

Transformez vos historiques de ventes en prévisions fiables grâce à 24 modèles statistiques/ML, un routing ABC/XYZ intelligent et des rapports détaillés validés par backtesting.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?logo=supabase)

---

## ✨ Fonctionnalités

- **24 modèles de prévision** — Statistiques classiques, ML et modèles de fondation
- **Routing ABC/XYZ intelligent** — Sélection automatique du meilleur modèle par SKU
- **Backtesting rigoureux** — Validation 5-fold cross-validation
- **Rapports détaillés** — Métriques, insights et exports PDF
- **Actions intelligentes** — Recommandations post-forecast (alertes stock, fiabilité, volumes) générées par IA
- **Setup en 5 minutes** — Import CSV et résultats instantanés
- **Dark/Light mode** — Interface moderne et adaptative
- **Chatbot IA contextuel** — Posez des questions sur vos résultats de forecast
- **Export PDF** — Rapports par série avec graphiques capturés via html2canvas
- **Palette de commandes** — Navigation rapide Cmd+K (cmdk)
- **Onboarding guidé** — Tour interactif de la page résultats (driver.js)
- **Alertes séries** — Détection automatique de WAPE élevé, biais, volatilité Z
- **Vue Portfolio** — Scatter plot interactif des séries par cluster comportemental (stable, saisonnier, tendance, intermittent, volatile)
- **Seuils personnalisables** — Zones vert/jaune/rouge par métrique avec sauvegarde Supabase
- **Conformité RGPD** — Export de données, suppression de compte, politique de confidentialité
- **Sécurité renforcée** — Headers CSP/HSTS, webhooks HMAC-SHA256, RLS Supabase, proxies server-side

## 🛠 Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript 5.9 (strict mode) |
| Styling | Tailwind CSS v4 + tw-animate-css |
| Composants UI | shadcn/ui (new-york) + Radix UI primitives |
| Auth & Base de données | Supabase (PostgreSQL, schéma `lumeniq`, SSR auth) |
| Graphiques | Recharts v3 |
| Animations | Framer Motion + React Three Fiber (3D landing) |
| Export PDF | @react-pdf/renderer + html2canvas |
| Markdown | react-markdown + remark-gfm |
| Commandes | cmdk (palette Cmd+K) |
| Onboarding | driver.js |
| Dates | date-fns |
| Icônes | Lucide React |
| Thèmes | next-themes (dark par défaut) |
| Webhooks | N8N (forecast + chat IA) |
| Compiler | React Compiler (babel-plugin-react-compiler) |

## 📁 Structure du projet

```
├── middleware.ts                # Auth middleware Supabase (protège /dashboard/*)
src/
├── app/                        # Pages (App Router)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── login/                  # Authentification
│   │   └── reset-password/     # Réinitialisation mot de passe
│   ├── auth/callback/          # OAuth callback
│   ├── dashboard/              # Espace utilisateur (protégé)
│   │   ├── layout.tsx          # Layout dashboard (redirect si non-auth)
│   │   ├── dashboard-shell.tsx # Shell client (sidebar, header, chat, cmd palette)
│   │   ├── loading.tsx         # Loading state dashboard
│   │   ├── page.tsx            # Tableau de bord
│   │   ├── forecast/           # Soumission nouvelle prévision
│   │   ├── history/            # Historique des runs
│   │   ├── results/            # Résultats détaillés
│   │   │   ├── loading.tsx     # Loading state résultats
│   │   │   └── series/         # Détail par série
│   │   ├── actions/            # Tableau de bord actions (recommandations IA)
│   │   └── settings/           # Paramètres utilisateur (export, suppression RGPD)
│   ├── features/               # Page fonctionnalités (marketing)
│   ├── pricing/                # Tarification (marketing)
│   ├── contact/                # Page contact (formulaire premium)
│   ├── demo/                   # Visite produit interactive
│   ├── mentions-legales/       # Mentions légales
│   └── politique-de-confidentialite/ # Politique de confidentialité (RGPD)
├── components/
│   ├── ui/                     # shadcn/ui (button, card, sheet, tooltip, badge, etc.)
│   ├── landing/                # Sections landing page
│   ├── dashboard/              # Composants dashboard
│   │   ├── ai-chat/            # Chatbot IA (8 fichiers)
│   │   ├── results/            # Résultats (alertes, export PDF, skeletons)
│   │   ├── sidebar.tsx         # Sidebar navigation
│   │   ├── header.tsx          # Header avec recherche
│   │   ├── command-palette.tsx  # Palette Cmd+K
│   │   ├── synthesis-card.tsx  # Carte synthèse markdown
│   │   ├── series-list.tsx     # Liste des séries
│   │   ├── series-navigator.tsx # Navigation inter-séries
│   │   ├── series-sort-dropdown.tsx
│   │   ├── series-filters-dropdown.tsx
│   │   ├── active-filters-bar.tsx
│   │   ├── series-quick-select.tsx
│   │   ├── AlertsSummaryCard.tsx
│   │   ├── actions-board.tsx    # Tableau actions (page + drawer)
│   │   ├── actions-summary.tsx  # Résumé exécutif actions
│   │   ├── actions-drawer.tsx   # Panneau latéral actions
│   │   ├── actions-fab.tsx      # Bouton flottant actions
│   │   ├── action-card.tsx      # Carte action individuelle
│   │   ├── portfolio-view.tsx   # Vue portfolio scatter plot (6 clusters)
│   │   ├── threshold-settings.tsx # Seuils métriques personnalisables
│   │   └── empty-dashboard.tsx
│   ├── charts/                 # Visualisations Recharts
│   ├── shared/                 # Navbar, Footer, Logo
│   ├── animations/             # Wrappers Framer Motion
│   ├── backgrounds/            # Effets visuels (particules, gradients)
│   ├── upload/                 # Upload fichier CSV
│   ├── forecast/               # Options forecast, enriched waiting
│   ├── export/                 # SeriesPdfReport
│   ├── onboarding/             # Tour guidé driver.js
│   ├── skeletons/              # Loading skeletons
│   └── providers/              # Context providers
├── hooks/                      # Hooks React custom
│   ├── use-profile.ts          # Profil utilisateur
│   ├── useFileUpload.ts        # Upload CSV + webhook N8N
│   ├── useJobStatus.ts         # Polling statut forecast
│   ├── use-supabase.ts         # Client Supabase + useUser + useLogout
│   ├── useExportPdf.ts         # Export PDF par série
│   ├── useOnboarding.ts        # État du tour guidé
│   ├── useSeriesNavigation.ts  # Navigation précédent/suivant
│   ├── useUserPreferences.ts   # Préférences utilisateur
│   └── use-actions.ts          # Actions (page/drawer) + badge urgences
├── lib/
│   ├── supabase/
│   │   ├── server.ts           # Client Supabase SSR
│   │   └── client.ts           # Client Supabase browser
│   ├── queries/
│   │   ├── dashboard.ts        # Queries stats dashboard
│   │   └── results.ts          # Queries résultats & séries
│   ├── utils.ts                # cn() (clsx + tailwind-merge)
│   ├── tokens.ts               # Design tokens & palettes couleurs
│   ├── csv-analyzer.ts         # Parsing CSV
│   ├── metrics.ts              # Score WAPE/biais, color coding
│   ├── series-alerts.ts        # Logique alertes séries
│   ├── linkify-skus.ts         # Liens SKU dans markdown
│   ├── parse-markdown-sections.ts # Parsing sections H2
│   ├── glossary.tsx            # Contenu tooltips d'aide
│   ├── webhook-signature.ts    # Signature HMAC-SHA256 (t=<ts>,v1=<hash>)
│   ├── thresholds/
│   │   ├── context.tsx         # ThresholdsProvider + useThresholds() hook
│   │   └── defaults.ts         # Seuils par défaut (5 métriques)
│   ├── pricing-config.ts       # Configuration plans (Standard/ML/Premium)
│   ├── onboarding.ts           # État tour (localStorage)
│   └── mock-data.ts            # Données mock (dev)
├── types/
│   ├── database.ts             # Types schéma Supabase (généré)
│   ├── forecast.ts             # Types job & webhook
│   ├── actions.ts              # Types actions forecast
│   ├── export.ts               # Types export PDF
│   └── preferences.ts          # Types préférences utilisateur
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- npm, yarn, pnpm ou bun
- Un projet Supabase configuré (schéma `lumeniq`)

### Installation

```bash
# Cloner le repo
git clone https://github.com/your-username/lumeniq-webapp.git
cd lumeniq-webapp

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Puis éditer .env.local avec vos clés (voir section ci-dessous)
```

### Développement

```bash
# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Production

```bash
# Build de production
npm run build

# Démarrer le serveur
npm run start
```

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarrage en production |
| `npm run lint` | Vérification ESLint (flat config v9) |
| `npx tsc` | Type-check (no emit) |

## 🧪 Tests

```bash
npm test          # Tests unitaires (Vitest, single run)
npm run test:watch # Mode watch
```

Tests actuels : logique alertes, configuration badges, cartes actions, terminologie business.

## 🔐 Variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
# Supabase (publiques)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# N8N Webhooks (server-only, pas de prefixe NEXT_PUBLIC_)
N8N_WEBHOOK_URL=https://xxx.app.n8n.cloud/webhook/xxx
N8N_CHAT_WEBHOOK_URL=https://xxx.app.n8n.cloud/webhook/xxx
N8N_WEBHOOK_SECRET=<secret HMAC 256 bits>

# Supabase Admin (server-only, pour suppression de compte RGPD)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

| Variable | Scope | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Clé anonyme Supabase (publishable) |
| `N8N_WEBHOOK_URL` | Server | Webhook N8N pour lancer un forecast (via proxy `/api/webhook/forecast`) |
| `N8N_CHAT_WEBHOOK_URL` | Server | Webhook N8N pour le chatbot IA (via proxy `/api/webhook/chat`) |
| `N8N_WEBHOOK_SECRET` | Server | Secret HMAC-SHA256 pour signature des webhooks |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Clé admin Supabase pour suppression de compte |

> **Note sécurité** : Les URLs N8N ne sont plus exposées dans le bundle client. Les appels transitent par des API routes Next.js server-side avec signature HMAC-SHA256.

## 🔒 Sécurité

- **Headers HTTP** : CSP, HSTS (1 an + preload), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Webhooks** : Proxies server-side avec signature HMAC-SHA256 et protection anti-replay (5 min)
- **Base de données** : ~35 politiques RLS optimisées, fonctions avec `SET search_path = ''`
- **Auth** : Mot de passe minimum 8 caractères, validation côté client et serveur
- **RGPD** : Export de données, suppression de compte, politique de confidentialité, bannière cookies

Voir [`SECURITY_AUDIT.md`](SECURITY_AUDIT.md) pour le rapport complet.

## 🔗 Liens

- **Moteur de prévision** : Voir le repo [Lumen_IQ](../Lumen_IQ) pour le backend Python

## 📄 Licence

Propriétaire — Tous droits réservés © 2026 LumenIQ
