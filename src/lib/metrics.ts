import { CheckCircle2, Info, AlertTriangle, type LucideIcon } from "lucide-react";

/**
 * Convertit un champion_score brut (ratio SMAPE 0-1 depuis la DB) en score affichable (0-100).
 * Formule : (1 - rawScore) * 100, arrondi à 1 décimale.
 * Exemple : rawScore 0.082 → 91.8
 */
export function toChampionScore(rawScore: number | null): number | null {
  if (rawScore == null) return null;
  return Math.round((1 - rawScore) * 1000) / 10;
}

/**
 * Convertit un avg_smape / global_smape (ratio 0-1 depuis la DB) en Champion Score (0-100).
 * Même formule que toChampionScore, nommé explicitement pour le niveau job.
 */
export function toChampionScoreFromSmape(smapeRatio: number | null): number | null {
  if (smapeRatio == null) return null;
  return Math.round((1 - smapeRatio) * 1000) / 10;
}

/**
 * Résout le ratio d'erreur à utiliser pour le Champion Score d'une série.
 * Fallback : champion_score → smape → wape (tous en ratio 0-1 en DB).
 */
export function resolveSeriesErrorRatio(row: {
  champion_score?: number | null;
  smape?: number | null;
  wape?: number | null;
}): number | null {
  if (row.champion_score != null) return Number(row.champion_score);
  if (row.smape != null) return Number(row.smape);
  if (row.wape != null) return Number(row.wape);
  return null;
}

/**
 * Classe couleur Tailwind pour un Champion Score.
 * ≥ 90 : vert (excellent), ≥ 70 : orange (acceptable), < 70 : rouge (à améliorer)
 */
export function getChampionScoreColor(score: number | null): string {
  if (score == null) return "text-zinc-400";
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

/**
 * Statut + couleur + icône pour un Champion Score (vues détaillées).
 */
export function getChampionScoreStatus(score: number): {
  label: string;
  color: string;
  Icon: LucideIcon;
} {
  if (score >= 90) return { label: "Excellent", color: "text-emerald-400", Icon: CheckCircle2 };
  if (score >= 70) return { label: "Acceptable", color: "text-amber-400", Icon: Info };
  return { label: "À améliorer", color: "text-red-400", Icon: AlertTriangle };
}
