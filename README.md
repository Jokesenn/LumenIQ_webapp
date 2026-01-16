# LumenIQ 🔮

**Plateforme SaaS de forecasting professionnel pour PME e-commerce**

Transformez vos historiques de ventes en prévisions fiables grâce à 21 modèles statistiques/ML, un routing ABC/XYZ intelligent et des rapports détaillés validés par backtesting.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## ✨ Fonctionnalités

- **21 modèles de prévision** — Statistiques classiques, ML et modèles de fondation
- **Routing ABC/XYZ intelligent** — Sélection automatique du meilleur modèle par SKU
- **Backtesting rigoureux** — Validation 5-fold cross-validation
- **Rapports détaillés** — Métriques, insights et exports PDF
- **Setup en 5 minutes** — Import CSV et résultats instantanés
- **Dark/Light mode** — Interface moderne et adaptative

## 🛠 Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Composants | Radix UI |
| Graphiques | Recharts |
| Icônes | Lucide React |
| Thèmes | next-themes |

## 📁 Structure du projet

```
src/
├── app/                    # Pages (App Router)
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Espace utilisateur
│   │   ├── forecast/      # Nouvelle prévision
│   │   ├── history/       # Historique des runs
│   │   ├── results/       # Résultats détaillés
│   │   └── settings/      # Paramètres
│   ├── features/          # Page fonctionnalités
│   ├── pricing/           # Tarification
│   └── login/             # Authentification
├── components/
│   ├── landing/           # Composants landing page
│   ├── dashboard/         # Composants dashboard
│   ├── shared/            # Navbar, Footer, Logo
│   └── ui/                # Composants UI réutilisables
└── lib/                   # Utilitaires et helpers
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- npm, yarn, pnpm ou bun

### Installation

```bash
# Cloner le repo
git clone https://github.com/your-username/lumeniq-webapp.git
cd lumeniq-webapp

# Installer les dépendances
npm install
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
| `npm run lint` | Vérification ESLint |

## 🔗 Liens

- **Moteur de prévision** : Voir le repo [Lumen_IQ](../Lumen_IQ) pour le backend Python

## 📄 Licence

Propriétaire — Tous droits réservés © 2026 LumenIQ
