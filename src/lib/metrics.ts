import { CheckCircle2, Info, AlertTriangle, type LucideIcon } from "lucide-react";

/**
 * Convertit un ratio d'erreur (0-1 depuis la DB) en score affichable (0-100).
 * Formule : (1 - rawScore) * 100, arrondi à 1 décimale.
 * Exemple : rawScore 0.082 → 91.8
 *
 * Utilisé avec WAPE (Score de fiabilité = 1 - WAPE).
 */
export function toChampionScore(rawScore: number | null): number | null {
  if (rawScore == null) return null;
  return Math.round((1 - rawScore) * 1000) / 10;
}

/**
 * Résout le ratio d'erreur à utiliser pour le Score de fiabilité d'une série.
 * Priorité : wape → smape (tous en ratio 0-1 en DB).
 *
 * Note : champion_score n'est plus utilisé car il contient maintenant la valeur MASE
 * (non bornée 0-1) qui sert uniquement à la sélection interne du champion.
 */
export function resolveSeriesErrorRatio(row: {
  wape?: number | null;
  smape?: number | null;
}): number | null {
  if (row.wape != null) return Number(row.wape);
  if (row.smape != null) return Number(row.smape);
  return null;
}

/**
 * Classe couleur Tailwind pour un Champion Score.
 * ≥ 90 : vert (excellent), ≥ 70 : orange (acceptable), < 70 : rouge (à améliorer)
 */
export function getChampionScoreColor(
  score: number | null,
  thresholds?: { green: number; yellow: number }
): string {
  if (score == null) return "text-zinc-400";
  const { green, yellow } = thresholds ?? { green: 90, yellow: 70 };
  if (score >= green) return "text-emerald-400";
  if (score >= yellow) return "text-amber-400";
  return "text-red-400";
}

/**
 * Statut + couleur + icône pour un Champion Score (vues détaillées).
 */
export function getChampionScoreStatus(
  score: number,
  thresholds?: { green: number; yellow: number }
): {
  label: string;
  color: string;
  Icon: LucideIcon;
} {
  const { green, yellow } = thresholds ?? { green: 90, yellow: 70 };
  if (score >= green) return { label: "Excellent", color: "text-emerald-400", Icon: CheckCircle2 };
  if (score >= yellow) return { label: "Acceptable", color: "text-amber-400", Icon: Info };
  return { label: "À améliorer", color: "text-red-400", Icon: AlertTriangle };
}
