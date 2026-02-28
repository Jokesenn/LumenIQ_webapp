export interface ModelMeta {
  label: string;
  family: string;
  familyColor: string;
}

export const MODEL_FAMILIES = {
  decomposition: { label: "Décomposition avancée", color: "violet", hex: "#8b5cf6", bgClass: "bg-violet-500" },
  classical:     { label: "Statistique classique", color: "blue",   hex: "#60a5fa", bgClass: "bg-blue-400" },
  ml:            { label: "Machine Learning",      color: "emerald", hex: "#34d399", bgClass: "bg-emerald-400" },
  advanced:      { label: "Statistique avancée",   color: "amber",  hex: "#fbbf24", bgClass: "bg-amber-400" },
} as const;

export type ModelFamily = keyof typeof MODEL_FAMILIES;

export const MODEL_LABELS: Record<string, { label: string; family: ModelFamily }> = {
  mstl:                     { label: "Décomposition saisonnière", family: "decomposition" },
  ets:                      { label: "Lissage exponentiel",       family: "decomposition" },
  dynamic_optimized_theta:  { label: "Theta optimisé",            family: "decomposition" },
  optimized_theta:          { label: "Theta",                     family: "decomposition" },
  ces:                      { label: "Lissage complexe",          family: "decomposition" },
  seasonal_naive:           { label: "Référence saisonnière",     family: "classical" },
  naive:                    { label: "Référence simple",          family: "classical" },
  drift:                    { label: "Tendance linéaire",         family: "classical" },
  rolling_mean:             { label: "Moyenne mobile",            family: "classical" },
  historical_average:       { label: "Moyenne historique",        family: "classical" },
  ridge:                    { label: "Régression ML",             family: "ml" },
  ridge_custom:             { label: "Régression ML",             family: "ml" },
  lgbm:                     { label: "Gradient Boosting",         family: "ml" },
  lgbm_custom:              { label: "Gradient Boosting",         family: "ml" },
  prophet:                  { label: "Prévision Prophet",         family: "advanced" },
  arima:                    { label: "Auto-régressif (ARIMA)",    family: "advanced" },
  auto_arima:               { label: "Auto-régressif (ARIMA)",    family: "advanced" },
  croston:                  { label: "Demande intermittente",     family: "advanced" },
  adida:                    { label: "Demande intermittente",     family: "advanced" },
  imapa:                    { label: "Demande intermittente",     family: "advanced" },
  tsb:                      { label: "Demande intermittente",     family: "advanced" },
  hurdle_plus:              { label: "Modèle à seuil",           family: "advanced" },
  hw_multiplicative:        { label: "Holt-Winters multiplicatif", family: "decomposition" },
  hw_additive:              { label: "Holt-Winters additif",       family: "decomposition" },
  theta:                    { label: "Theta classique",            family: "decomposition" },
  seasonal_rolling_mean:    { label: "Moyenne mobile saisonnière", family: "classical" },
  rolling_mean_long:          { label: "Moyenne mobile étendue",    family: "classical" },
  tbats:                      { label: "TBATS",                      family: "decomposition" },
};

export function getModelMeta(technicalName: string): ModelMeta {
  const entry = MODEL_LABELS[technicalName];
  if (!entry) {
    return { label: technicalName, family: "Autre", familyColor: "text-white/50" };
  }
  const fam = MODEL_FAMILIES[entry.family];
  return { label: entry.label, family: fam.label, familyColor: `text-${fam.color}-400` };
}

export function getModelFamily(technicalName: string): ModelFamily | null {
  return MODEL_LABELS[technicalName]?.family ?? null;
}

export function getFamilyMeta(technicalName: string) {
  const entry = MODEL_LABELS[technicalName];
  if (!entry) return { hex: "#71717a", bgClass: "bg-zinc-500", label: "Autre" };
  const fam = MODEL_FAMILIES[entry.family];
  return { hex: fam.hex, bgClass: fam.bgClass, label: fam.label };
}
