# Design: Seuils personnalisables par utilisateur

**Date**: 2026-02-15
**Status**: Approuve

## Objectif

Externaliser les seuils de coloration (vert/jaune/rouge) des metriques de forecast, actuellement hardcodes dans le frontend, vers Supabase avec des valeurs par defaut. Chaque utilisateur peut personnaliser ses seuils via une UI dediee.

## Decisions de design

- **Schema**: `lumeniq.user_thresholds` (coherent avec le reste du schema)
- **Perimetre**: Coloration visuelle uniquement (pas les triggers IA chat ni messages qualificatifs)
- **Contextes**: Un seul jeu de seuils par metrique (pas de variantes par contexte)
- **Gestion d'etat**: React Context + fetch au mount (pas de React Query/SWR)
- **Emplacement UI**: Section dans `/dashboard/settings` (pas de page separee)

## Modele de donnees

### Table Supabase

```sql
CREATE TABLE lumeniq.user_thresholds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_key TEXT NOT NULL,
  green_max NUMERIC NOT NULL,
  yellow_max NUMERIC NOT NULL,
  direction TEXT DEFAULT 'lower_is_better'
    CHECK (direction IN ('lower_is_better', 'higher_is_better')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, metric_key)
);

ALTER TABLE lumeniq.user_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own thresholds"
  ON lumeniq.user_thresholds FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Metriques couvertes

| metric_key | Label FR | Defauts (green/yellow) | Direction | Composants impactes |
|---|---|---|---|---|
| `reliability_score` | Score de fiabilite | 90 / 70 | higher_is_better | Gauge, metrics.ts, series list |
| `wape` | Erreur ponderee (WAPE) | 15 / 20 | lower_is_better | Alertes series, series list |
| `model_score` | Score modele | 80 / 50 | higher_is_better | Reliability detail table |
| `mase` | Indice predictif (MASE) | 0.8 / 1.2 | lower_is_better | Gauge MASE |
| `bias` | Biais prevision | 5 / 15 | lower_is_better | Gauge biais |

## Architecture cote client

### Fichiers a creer

```
src/lib/thresholds/
  defaults.ts     # DEFAULT_THRESHOLDS, types
  context.tsx      # ThresholdsProvider + useThresholds()
```

### ThresholdsProvider

Monte dans `DashboardShell`. Expose via context :

- `thresholds: Record<string, ThresholdConfig>` -- seuils merges (custom + defaults)
- `getColor(metricKey, value): 'green' | 'yellow' | 'red'` -- logique centralisee
- `updateThreshold(metricKey, green_max, yellow_max): Promise<void>` -- UPSERT optimiste
- `resetThreshold(metricKey): Promise<void>` -- supprime le custom
- `resetAll(): Promise<void>` -- supprime tous les customs
- `isLoading: boolean`
- `isCustom(metricKey): boolean`

### Logique getColor

```
lower_is_better:  valeur <= green_max -> vert | valeur <= yellow_max -> jaune | sinon -> rouge
higher_is_better: valeur >= green_max -> vert | valeur >= yellow_max -> jaune | sinon -> rouge
```

## Refactoring des composants existants

| Composant | Seuils actuels | Apres |
|-----------|---------------|-------|
| `lib/metrics.ts` (getChampionScoreColor) | 90/70 hardcodes | `getColor('reliability_score', score)` |
| `lib/series-alerts.ts` | WAPE 15/20 constantes | Recoit thresholds en parametre |
| `reliability-detail-table.tsx` | 80/50 hardcodes | `getColor('model_score', score)` |
| `results-content.tsx` (gauges) | Props hardcodes 70/90, 80/100 | Lit depuis thresholds context |
| `animated-gauge.tsx` | Recoit deja thresholds en props | Pas de changement |

**Note**: `series-alerts.ts` est utilise cote serveur (SSR). Les seuils seront passes en parametre a `getSeriesAlerts(series, thresholds)` plutot qu'un appel direct au hook.

## UI Settings

Nouveau bloc "Seuils d'affichage" dans `/dashboard/settings/page.tsx`.

### Pour chaque metrique:
- Card avec label, unite, 2 inputs number (borne verte, borne jaune)
- Barre de preview coloree (vert/jaune/rouge proportionnelle)
- Badge "Personnalise" (indigo) ou "Par defaut" (zinc)
- Bouton reset par metrique (visible si custom)
- Bouton "Reinitialiser tout" global

### Comportement:
- Save automatique (debounced 500ms)
- Validation inline (coherence bornes selon direction)
- Design: cards bg-white/5, bordures border-white/10 (dark theme existant)

## Edge cases

- User sans seuils custom -> defaults s'appliquent partout
- User avec seulement certaines metriques custom -> merge correct
- Valeurs nulles -> fallback aux defaults
- Suppression du compte -> CASCADE supprime les thresholds
- Performance: un seul fetch au mount du DashboardShell, cache en memoire via context
