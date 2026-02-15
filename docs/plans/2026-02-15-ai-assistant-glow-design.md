# Design : Assistant IA — Cadre lumineux animé réactif

**Date** : 2026-02-15
**Statut** : Validé
**Approche retenue** : Conic Gradient Border avec glow réactif au contexte

---

## Objectif

Rehausser visuellement le drawer de l'assistant IA pour qu'il soit au niveau de l'identité visuelle premium du dashboard (StatCard, SynthesisCard). L'assistant doit donner l'impression d'un "portail vers l'IA" avec un cadre lumineux animé qui réagit à l'activité.

## Périmètre

Drawer complet + éléments internes (header, bulles, input, suggestions, FAB). Aucun nouveau fichier — modifications dans l'existant uniquement.

---

## 1. Cadre lumineux animé (Drawer Container)

### Structure

Le `SheetContent` est wrappé dans un conteneur `.ai-drawer-glow` avec un pseudo-élément `::before` portant le gradient conique animé.

```
.ai-drawer-glow (position relative, padding 1px = épaisseur bordure)
  ├── ::before (gradient conique animé, absolute, inset -1px, z-index -1, border-radius hérité)
  │     conic-gradient(from var(--angle), indigo-500, violet-400, blue-500, indigo-500)
  │     + blur(var(--glow-spread)) pour halo externe
  └── contenu interne (bg-zinc-950, rounded, overflow hidden)
```

### 3 états réactifs via `data-state`

| État | Déclencheur | Rotation | Opacité bordure | Glow spread | Box-shadow externe |
|------|-------------|----------|-----------------|-------------|--------------------|
| `idle` | Drawer ouvert, pas d'activité | 8s | 40% | 4px | `0 0 15px rgba(99,102,241,0.1)` |
| `thinking` | Message envoyé, attente réponse | 2.5s + pulse | 75% | 12px | `0 0 30px rgba(139,92,246,0.2)` |
| `streaming` | Réponse en réception | 5s | 100% | 20px | `0 0 40px rgba(99,102,241,0.25)` |

Transitions entre états : `transition: opacity 0.6s, filter 0.6s`.

Palette : indigo-500, violet-400, blue-500 (cohérent avec l'accent app).

---

## 2. Header premium

- Background renforcé : `bg-zinc-950/80 backdrop-blur-xl`
- Ligne gradient basse : `h-[2px]`, opacité réactive (30% idle → 60% thinking → 100% streaming), pulse en thinking
- Indicateur d'état : point lumineux 8px à côté du titre (fixe idle, pulse thinking, plein streaming)
- Titre en `font-display` (Syne) pour cohérence dashboard

---

## 3. Bulles de message

### Bulle utilisateur
- Ajout `border border-violet-500/15` + `shadow-lg shadow-violet-500/5`
- Gradient existant inchangé

### Bulle assistant
- Bordure d'arrivée : `border-indigo-500/10` flash qui transitionne vers `border-white/[0.06]` en 2s
- Ajout `shadow-lg shadow-indigo-500/[0.03]`
- Animation d'entrée existante conservée

### Bulle erreur
- Inchangée

---

## 4. Zone d'input

- Bordure supérieure : gradient `from-transparent via-indigo-500/20 to-transparent` (remplace `border-white/10`)
- Focus textarea : `ring-1 ring-indigo-500/30` avec transition 0.3s
- Bouton send actif : `bg-indigo-500/20` quand texte saisi, glow hover activé

---

## 5. Suggestions contextuelles

- Shimmer au premier affichage (animation existante dans globals.css)
- Hover renforcé : `border-indigo-500/40` + `shadow-sm shadow-indigo-500/10`

---

## 6. Bouton FAB

- Pulse ring quand drawer fermé et inactif : `ring-2 ring-violet-400/30` avec expansion + fade-out
- Ring disparaît quand drawer ouvert
- Micro-rotation icône au hover (8deg, spring)

---

## Fichiers impactés

| Fichier | Modifications |
|---------|---------------|
| `globals.css` | Classes `.ai-drawer-glow`, `.ai-glow-idle/thinking/streaming`, keyframe `ai-border-rotate` |
| `AiChatDrawer.tsx` | Wrapper glow, `data-state` piloté par `isLoading`/streaming |
| `ChatMessage.tsx` | Bordure/ombre subtiles, flash indigo arrivée assistant |
| `ChatInput.tsx` | Ligne gradient haut, ring focus, bouton send amélioré |
| `SuggestedQuestions.tsx` | Shimmer premier affichage, hover renforcé |
| `AiChatButton.tsx` | Pulse ring inactif, micro-rotation hover |

## Contraintes

- Pur CSS pour les animations (GPU-accéléré, pas de JS runtime)
- Pas de nouveaux fichiers — tout dans l'existant
- Cohérence avec la palette indigo/violet du design system
- Performance : aucun impact mesurable attendu (conic-gradient + box-shadow sont composités)
- UI copy reste en français
