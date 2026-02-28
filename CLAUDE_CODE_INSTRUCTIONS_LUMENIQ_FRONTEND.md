# Instructions Claude Code - Refonte Frontend LumenIQ

> **OBSOLETE** — Ce fichier est le brief de design initial utilisé lors de la refonte UI.
> La refonte est terminée. Référez-vous à `CLAUDE.md` pour la documentation à jour du projet.
> Ce fichier est conservé uniquement comme référence historique des choix de design initiaux.

## Contexte Projet (historique)

Ce brief a été utilisé pour refondre **LumenIQ** d'un design basique vers un style "dark SaaS moderne". Le projet utilise maintenant :
- Next.js 16 (App Router) — mis à jour depuis Next.js 14
- Tailwind CSS v4 + shadcn/ui (new-york style) + Framer Motion
- Supabase Auth SSR + lumeniq schema
- Dashboard complet avec KPIs, charts, AI chat, PDF export

Les sections ci-dessous sont les instructions originales et ne reflètent plus l'état actuel du code.

---

## PHASE 0 : Analyse du Repo Existant (OBLIGATOIRE)

Avant toute modification, analyse le repo pour comprendre ce qui existe :

```bash
# 1. Structure générale
tree -I 'node_modules|.next|.git' -L 4

# 2. Identifier les fichiers clés
cat package.json
cat tailwind.config.ts
cat src/app/layout.tsx
cat src/lib/supabase.ts  # ou équivalent

# 3. Lister tous les composants existants
find src -name "*.tsx" | head -50

# 4. Identifier les connexions Supabase
grep -r "supabase" src/ --include="*.tsx" --include="*.ts" | head -30

# 5. Identifier les pages existantes
ls -la src/app/
```

**Produis un rapport** listant :
- [ ] Pages existantes et leur rôle
- [ ] Composants à conserver (logique métier)
- [ ] Composants à refondre (UI pure)
- [ ] Connexions Supabase (auth, queries, realtime)
- [ ] Variables d'environnement utilisées

---

## PHASE 1 : Design System Foundation

### 1.1 Mettre à jour les CSS variables globales

Remplace/complète le fichier `src/app/globals.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ===== DARK THEME (default) ===== */
    
    /* Backgrounds */
    --background: 240 10% 3.9%;        /* #09090b - zinc-950 */
    --bg-primary: 240 10% 3.9%;
    --bg-secondary: 240 5.9% 10%;      /* #18181b - zinc-900 */
    --bg-tertiary: 240 5.2% 15%;       /* #27272a - zinc-800 */
    
    /* Foreground / Text */
    --foreground: 0 0% 98%;            /* #fafafa */
    --text-primary: 0 0% 98%;
    --text-secondary: 240 5% 64.9%;    /* #a1a1aa - zinc-400 */
    --text-muted: 240 5% 45%;          /* zinc-500 */
    
    /* Accent (Indigo/Violet) */
    --accent: 239 84% 67%;             /* #6366f1 - indigo-500 */
    --accent-foreground: 0 0% 98%;
    --accent-glow: 239 84% 67% / 0.4;
    
    /* Brand secondary */
    --brand-violet: 258 90% 66%;       /* #8b5cf6 - violet-500 */
    --brand-cyan: 187 92% 69%;         /* #22d3ee - cyan-400 */
    
    /* UI Elements */
    --card: 240 5.9% 10%;
    --card-foreground: 0 0% 98%;
    --popover: 240 5.9% 10%;
    --popover-foreground: 0 0% 98%;
    
    --primary: 239 84% 67%;
    --primary-foreground: 0 0% 98%;
    
    --secondary: 240 5.2% 15%;
    --secondary-foreground: 0 0% 98%;
    
    --muted: 240 5.9% 10%;
    --muted-foreground: 240 5% 64.9%;
    
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    
    /* Borders */
    --border: 240 5% 17%;
    --border-subtle: 0 0% 100% / 0.08;
    --input: 240 5% 17%;
    --ring: 239 84% 67%;
    
    /* Radius */
    --radius: 0.75rem;
    
    /* Chart colors */
    --chart-1: 239 84% 67%;
    --chart-2: 258 90% 66%;
    --chart-3: 187 92% 69%;
    --chart-4: 142 76% 36%;
    --chart-5: 47 100% 50%;
  }
  
  /* Light theme override (optionnel) */
  .light {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    /* ... adapter si besoin */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* ===== CUSTOM UTILITIES ===== */

@layer utilities {
  /* Gradient text */
  .text-gradient {
    @apply bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent;
  }
  
  .text-gradient-brand {
    @apply bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent;
  }
  
  /* Glassmorphism */
  .glass {
    @apply bg-white/5 backdrop-blur-xl border border-white/10;
  }
  
  .glass-card {
    @apply bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl;
  }
  
  /* Glow effects */
  .glow-accent {
    box-shadow: 0 0 20px hsl(var(--accent-glow));
  }
  
  .glow-accent-lg {
    box-shadow: 0 0 40px hsl(var(--accent-glow)), 0 0 80px hsl(var(--accent-glow) / 0.5);
  }
  
  /* Background patterns */
  .bg-grid-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  
  .bg-dot-pattern {
    background-image: radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  
  /* Animation utilities */
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px hsl(var(--accent-glow)); }
    50% { box-shadow: 0 0 40px hsl(var(--accent-glow)); }
  }
}
```

### 1.2 Configurer Tailwind

Vérifie/mets à jour `tailwind.config.ts` :

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--brand-violet)) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 1.3 Installer les dépendances manquantes

```bash
npm install framer-motion lucide-react tailwindcss-animate
npm install @tanstack/react-table  # Pour les tables dashboard
```

---

## PHASE 2 : Architecture des Pages

### 2.1 Restructurer l'arborescence (si nécessaire)

Structure cible avec Route Groups :

```
src/app/
├── (marketing)/              # Pages publiques
│   ├── page.tsx              # Landing page
│   ├── pricing/page.tsx
│   ├── features/page.tsx
│   └── layout.tsx            # Navbar marketing
│
├── (auth)/                   # Authentification
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   └── layout.tsx            # Layout centré minimal
│
├── (dashboard)/              # App authentifiée
│   ├── dashboard/page.tsx    # Overview
│   ├── forecasts/
│   │   ├── page.tsx          # Liste des jobs
│   │   ├── new/page.tsx      # Nouveau forecast
│   │   └── [id]/page.tsx     # Détail résultat
│   ├── settings/page.tsx
│   └── layout.tsx            # Sidebar + Header dashboard
│
├── api/                      # API routes (conserver existant)
├── layout.tsx                # Root layout
└── globals.css
```

**IMPORTANT** : Ne supprime AUCUN fichier avant d'avoir vérifié qu'il n'est pas utilisé. Déplace les composants existants dans la nouvelle structure.

### 2.2 Root Layout

Mets à jour `src/app/layout.tsx` :

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

// CONSERVER : Tous les providers existants (Supabase, etc.)
// import { SupabaseProvider } from "@/components/providers/supabase-provider";

export const metadata: Metadata = {
  title: "LumenIQ - Prévisions intelligentes pour PME",
  description: "Transformez vos données de vente en forecasts professionnels en 5 minutes. Sans data scientist.",
  keywords: ["forecasting", "prévisions", "PME", "retail", "e-commerce", "IA"],
  openGraph: {
    title: "LumenIQ - Prévisions intelligentes",
    description: "Forecasts professionnels en 5 minutes",
    url: "https://lumeniq.io",
    siteName: "LumenIQ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        {/* CONSERVER VOS PROVIDERS EXISTANTS ICI */}
        {children}
      </body>
    </html>
  );
}
```

---

## PHASE 3 : Composants Réutilisables

### 3.1 Logo Component

Crée `src/components/shared/logo.tsx` :

```tsx
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
}

const sizes = {
  sm: { icon: 20, text: "text-lg" },
  md: { icon: 28, text: "text-xl" },
  lg: { icon: 36, text: "text-2xl" },
};

export function Logo({ size = "md", showText = true, href = "/" }: LogoProps) {
  const { icon, text } = sizes[size];

  const content = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/30 blur-lg rounded-full" />
        <div className="relative p-2 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl">
          <Sparkles className="text-white" size={icon} />
        </div>
      </div>
      {showText && (
        <span className={`font-bold ${text} text-gradient`}>
          LumenIQ
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
```

### 3.2 Marketing Navbar

Crée `src/components/marketing/navbar.tsx` :

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/features", label: "Fonctionnalités" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/about", label: "À propos" },
];

export function MarketingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-zinc-950/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo size="md" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                pathname === link.href
                  ? "text-white"
                  : "text-zinc-400"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-300 hover:text-white">
              Connexion
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-indigo-500 hover:bg-indigo-600 glow-accent">
              Essai gratuit
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-zinc-300 hover:text-white py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                  Essai gratuit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
```

### 3.3 Dashboard Sidebar

Crée `src/components/dashboard/sidebar.tsx` :

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LineChart,
  Upload,
  History,
  Settings,
  HelpCircle,
  ChevronLeft,
  LogOut,
} from "lucide-react";

// CONSERVER : Importer votre hook de logout Supabase existant
// import { useSupabase } from "@/hooks/use-supabase";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/forecasts/new", icon: Upload, label: "Nouveau Forecast" },
  { href: "/forecasts", icon: LineChart, label: "Mes Forecasts" },
  { href: "/history", icon: History, label: "Historique" },
];

const bottomItems = [
  { href: "/settings", icon: Settings, label: "Paramètres" },
  { href: "/help", icon: HelpCircle, label: "Aide" },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  // const { signOut } = useSupabase(); // CONSERVER VOTRE LOGIQUE

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-zinc-950 border-r border-white/10 flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
        <Logo size="sm" showText={!collapsed} href="/dashboard" />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 text-zinc-400 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="py-4 px-3 border-t border-white/10 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
        
        {/* Logout Button - ADAPTER AVEC VOTRE LOGIQUE SUPABASE */}
        <button
          // onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
```

### 3.4 Dashboard Header

Crée `src/components/dashboard/header.tsx` :

```tsx
"use client";

// CONSERVER : Vos imports Supabase pour récupérer l'utilisateur
// import { useUser } from "@/hooks/use-user";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, Plus } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  sidebarCollapsed?: boolean;
}

export function DashboardHeader({ sidebarCollapsed = false }: DashboardHeaderProps) {
  // CONSERVER : Votre logique pour récupérer l'utilisateur
  // const { user } = useUser();
  const user = { email: "user@example.com", name: "John Doe" }; // Placeholder

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-30 transition-all ${
        sidebarCollapsed ? "left-20" : "left-64"
      }`}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link href="/forecasts/new">
          <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Forecast
          </Button>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-zinc-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-indigo-500/20 text-indigo-400">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs text-zinc-400">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuItem>Facturation</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

---

## PHASE 4 : Pages Marketing

### 4.1 Landing Page Hero

Crée/mets à jour `src/app/(marketing)/page.tsx` :

```tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-zinc-300">
              Forecast Engine v2.0 — Propulsé par 15 modèles ML
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="text-gradient">Prévisions professionnelles</span>
            <br />
            <span className="text-indigo-400">en 5 minutes</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-slide-up [animation-delay:100ms]">
            Transformez vos données de vente en forecasts validés par backtesting.
            <br className="hidden md:block" />
            Sans data scientist. Sans Excel. Sans complexité.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:200ms]">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-indigo-500 hover:bg-indigo-600 glow-accent text-base px-8"
              >
                Essayer gratuitement
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 hover:bg-white/5 text-base px-8"
              >
                Voir la démo
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 animate-fade-in [animation-delay:400ms]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Setup en 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Aucune carte requise</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Export Excel inclus</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Pourquoi LumenIQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Forecasting de niveau <span className="text-indigo-400">enterprise</span>,
              <br />
              accessible aux PME
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "15 modèles ML",
                description:
                  "ARIMA, Prophet, XGBoost, LightGBM... Le meilleur modèle est sélectionné automatiquement pour chaque série.",
              },
              {
                icon: Shield,
                title: "Backtesting rigoureux",
                description:
                  "Chaque prévision est validée sur vos données historiques. Vous connaissez la fiabilité avant de décider.",
              },
              {
                icon: Clock,
                title: "5 minutes chrono",
                description:
                  "Upload CSV, cliquez, téléchargez. Pas de configuration complexe, pas de formation requise.",
              },
              {
                icon: TrendingUp,
                title: "Classification ABC/XYZ",
                description:
                  "Identifiez automatiquement vos produits stars et vos séries erratiques pour prioriser vos efforts.",
              },
              {
                icon: BarChart3,
                title: "Rapports professionnels",
                description:
                  "Graphiques interactifs, métriques clés, synthèse IA. Prêt à présenter en comité de direction.",
              },
              {
                icon: Sparkles,
                title: "Synthèse IA",
                description:
                  "Claude analyse vos résultats et génère un résumé exécutif en langage business.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card p-6 hover:border-indigo-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à améliorer vos prévisions ?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Rejoignez les PME qui font confiance à LumenIQ pour leurs décisions
              d'approvisionnement et de planification.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-indigo-500 hover:bg-indigo-600 glow-accent"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
```

### 4.2 Marketing Layout

Crée `src/app/(marketing)/layout.tsx` :

```tsx
import { MarketingNavbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <MarketingNavbar />
      {children}
      <Footer />
    </div>
  );
}
```

---

## PHASE 5 : Pages Auth

### 5.1 Login Page

Crée `src/app/(auth)/login/page.tsx` :

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// CONSERVER : Importer votre client Supabase
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // CONSERVER : Votre initialisation Supabase
  // const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // CONSERVER : Votre logique de login Supabase
      // const { error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      // if (error) throw error;
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zinc-950">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo size="lg" href="/" />
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Content de vous revoir</h1>
            <p className="text-zinc-400 text-sm">
              Connectez-vous pour accéder à vos forecasts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## PHASE 6 : Dashboard

### 6.1 Dashboard Layout

Crée `src/app/(dashboard)/layout.tsx` :

```tsx
"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

// CONSERVER : Votre protection de route auth
// import { useAuth } from "@/hooks/use-auth";
// import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // CONSERVER : Votre vérification d'authentification
  // const { user, loading } = useAuth();
  // if (!loading && !user) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-950">
      <DashboardSidebar />
      <DashboardHeader sidebarCollapsed={sidebarCollapsed} />
      <main
        className={`pt-16 min-h-screen transition-all ${
          sidebarCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
```

### 6.2 Dashboard Overview Page

Crée `src/app/(dashboard)/dashboard/page.tsx` :

```tsx
// CONSERVER : Vos imports de données Supabase
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// CONSERVER ET ADAPTER : Votre fonction de récupération des KPIs
// async function getKPIs(userId: string) {
//   const supabase = createServerComponentClient({ cookies });
//   const { data } = await supabase.from("job_summaries")...
//   return data;
// }

export default async function DashboardPage() {
  // CONSERVER : Votre logique de récupération des données
  // const supabase = createServerComponentClient({ cookies });
  // const { data: { user } } = await supabase.auth.getUser();
  // const kpis = await getKPIs(user?.id);

  // Données placeholder - À REMPLACER par vos vraies données
  const stats = [
    {
      title: "Forecasts ce mois",
      value: "12",
      change: "+3",
      trend: "up",
      icon: LineChart,
    },
    {
      title: "Séries analysées",
      value: "847",
      change: "+124",
      trend: "up",
      icon: BarChart3,
    },
    {
      title: "WAPE moyen",
      value: "8.2%",
      change: "-1.3%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Temps moyen",
      value: "4m 23s",
      change: "-12s",
      trend: "up",
      icon: Clock,
    },
  ];

  const recentJobs = [
    { id: "1", name: "Stock_Q1_2025.csv", status: "completed", series: 156, date: "Il y a 2h" },
    { id: "2", name: "Ventes_Janvier.csv", status: "completed", series: 89, date: "Hier" },
    { id: "3", name: "Promo_Analysis.csv", status: "failed", series: 0, date: "Il y a 2 jours" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-zinc-400">
          Bienvenue ! Voici un aperçu de votre activité.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-zinc-900/50 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500/10">
                  <stat.icon className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-zinc-500">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Jobs */}
      <Card className="bg-zinc-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Forecasts récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {job.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{job.name}</p>
                    <p className="text-sm text-zinc-400">
                      {job.series} séries • {job.date}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={job.status === "completed" ? "default" : "destructive"}
                  className={
                    job.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : ""
                  }
                >
                  {job.status === "completed" ? "Terminé" : "Échoué"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## PHASE 7 : Intégration Finale

### 7.1 Checklist d'intégration

Pour chaque composant existant que tu migres :

- [ ] **Identifier** la logique métier (queries Supabase, mutations, realtime)
- [ ] **Extraire** cette logique dans un hook ou fonction séparée
- [ ] **Appliquer** le nouveau design au composant UI
- [ ] **Réinjecter** la logique métier
- [ ] **Tester** que tout fonctionne

### 7.2 Fichiers à NE PAS modifier (sauf design)

```
src/lib/supabase.ts         # Client Supabase
src/hooks/use-*.ts          # Hooks de données
src/app/api/**              # API routes
.env.local                  # Variables d'environnement
```

### 7.3 Composants shadcn/ui à installer

```bash
npx shadcn@latest add avatar badge button card dropdown-menu input label progress separator tabs toast tooltip
```

---

## Commandes de Validation

Après chaque phase, vérifie :

```bash
# Build sans erreur
npm run build

# Lint
npm run lint

# Check TypeScript
npx tsc --noEmit

# Vérifier les connexions Supabase (dev)
npm run dev
# → Tester login/logout
# → Tester affichage dashboard
# → Tester récupération KPIs
```

---

## Notes Importantes

1. **PRÉSERVE TOUJOURS** les connexions Supabase existantes
2. **TESTE** après chaque modification majeure
3. **COMMITE** régulièrement avec des messages clairs
4. **DOCUMENTE** tout changement de structure

En cas de doute sur un composant existant, **demande confirmation** avant de le modifier.
