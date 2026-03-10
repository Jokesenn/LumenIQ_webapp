# Réordonnancement des onglets résultats

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Réordonner les 5 onglets de la page résultats pour un parcours utilisateur cohérent : global → macro → micro → conclusion → expert.

**Architecture:** Deux fichiers à modifier — le tableau `tabs` dans `results-content.tsx` (barre d'onglets), et les `CommandItem` dans `command-palette.tsx` (palette Cmd+K). Aucun changement fonctionnel, aucune migration de données.

**Tech Stack:** TypeScript, React, Next.js App Router

---

### Ordre cible

```
overview → portfolio → series → synthesis → reliability
```

Vs. ordre actuel :
```
overview → series → portfolio → reliability → synthesis
```

---

### Task 1 : Réordonner la barre d'onglets

**Files:**
- Modify: `src/app/dashboard/results/results-content.tsx:177-183`

**Step 1 : Modifier le tableau `tabs`**

Remplacer (lignes 177-183) :
```typescript
const tabs: { id: TabType; label: string }[] = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "series", label: "Séries" },
  { id: "portfolio", label: "Portfolio" },
  { id: "reliability", label: "Fiabilité" },
  { id: "synthesis", label: "Synthèse IA" },
];
```

Par :
```typescript
const tabs: { id: TabType; label: string }[] = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "portfolio", label: "Portfolio" },
  { id: "series", label: "Séries" },
  { id: "synthesis", label: "Synthèse IA" },
  { id: "reliability", label: "Fiabilité" },
];
```

**Step 2 : Vérification visuelle**

Lancer `npm run dev`, ouvrir `/dashboard/results?job=<id>` et vérifier que la barre affiche :
`Vue d'ensemble | Portfolio | Séries | Synthèse IA | Fiabilité`

**Step 3 : Commit**

```bash
cd LumenIQ_webapp
git add src/app/dashboard/results/results-content.tsx
git commit -m "ux: réordonner les onglets résultats (parcours business-first)"
```

---

### Task 2 : Aligner la palette de commandes (Cmd+K)

**Files:**
- Modify: `src/components/dashboard/command-palette.tsx:154-173`

**Step 1 : Réordonner les `CommandItem` de navigation**

Remplacer le bloc Navigation (lignes 154-173) :
```tsx
<CommandItem onSelect={() => runCommand(() => goToTab("overview"))}>
  <LayoutDashboard className="mr-2 h-4 w-4" />
  Vue d&apos;ensemble
</CommandItem>
<CommandItem onSelect={() => runCommand(() => goToTab("series"))}>
  <List className="mr-2 h-4 w-4" />
  Séries
</CommandItem>
<CommandItem onSelect={() => runCommand(() => goToTab("portfolio"))}>
  <ScatterChart className="mr-2 h-4 w-4" />
  Portfolio
</CommandItem>
<CommandItem onSelect={() => runCommand(() => goToTab("reliability"))}>
  <BarChart3 className="mr-2 h-4 w-4" />
  Fiabilité
</CommandItem>
<CommandItem onSelect={() => runCommand(() => goToTab("synthesis"))}>
  <Sparkles className="mr-2 h-4 w-4" />
  Synthèse IA
</CommandItem>
```

Par :
```tsx
<CommandItem onSelect={() => runCommand(() => goToTab("overview"))}>
  <LayoutDashboard className="mr-2 h-4 w-4" />
  Vue d&apos;ensemble
</CommandItem>
<CommandItem onSelect={() => runCommand(() => goToTab("portfolio"))}>
  <ScatterChart className="mr-2 h-4 w-4" />
  Portfolio
</CommandItem>
<CommandItem onSelect={() => runCommand(() => goToTab("series"))}>
  <List className="mr-2 h-4 w-4" />
  Séries
</CommandItem>
<CommandItem onSelect={() => runCommand(() => goToTab("synthesis"))}>
  <Sparkles className="mr-2 h-4 w-4" />
  Synthèse IA
</CommandItem>
<CommandItem onSelect={() => runCommand(() => goToTab("reliability"))}>
  <BarChart3 className="mr-2 h-4 w-4" />
  Fiabilité
</CommandItem>
```

**Step 2 : Vérification**

Ouvrir la palette Cmd+K sur la page résultats et confirmer que l'ordre correspond à la barre d'onglets.

**Step 3 : Commit**

```bash
git add src/components/dashboard/command-palette.tsx
git commit -m "ux: aligner la palette Cmd+K sur le nouvel ordre des onglets"
```

---

### Notes

- `results-tour.tsx` n'est pas impacté — le tour cible `[data-onboarding="synthesis-tab"]` par attribut, pas par position.
- Le `initialTab` prop et les navigations croisées (Portfolio → Séries, ABC/XYZ → Séries, etc.) ne sont pas impactés car ils utilisent les IDs de tab, pas leur position.
- Aucun test unitaire à écrire — la logique fonctionnelle ne change pas, seul l'ordre visuel change. Lancer `npm test` pour vérifier qu'aucune régression n'est introduite.
