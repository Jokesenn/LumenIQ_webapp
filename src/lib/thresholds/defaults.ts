export type ThresholdDirection = "lower_is_better" | "higher_is_better";
export type ThresholdColor = "green" | "yellow" | "red";

export interface ThresholdConfig {
  metric_key: string;
  label: string;
  unit: string;
  green_max: number;
  yellow_max: number;
  direction: ThresholdDirection;
}

export const DEFAULT_THRESHOLDS: ThresholdConfig[] = [
  {
    metric_key: "reliability_score",
    label: "Score de fiabilité",
    unit: "%",
    green_max: 80,
    yellow_max: 70,
    direction: "higher_is_better",
  },
  {
    metric_key: "wape",
    label: "Erreur pondérée (WAPE)",
    unit: "%",
    green_max: 15,
    yellow_max: 20,
    direction: "lower_is_better",
  },
  {
    metric_key: "model_score",
    label: "Score modèle",
    unit: "/100",
    green_max: 80,
    yellow_max: 50,
    direction: "higher_is_better",
  },
  {
    metric_key: "mase",
    label: "Indice prédictif (MASE)",
    unit: "/100",
    green_max: 80,
    yellow_max: 100,
    direction: "lower_is_better",
  },
  {
    metric_key: "bias",
    label: "Biais prévision",
    unit: "%",
    green_max: 5,
    yellow_max: 10,
    direction: "lower_is_better",
  },
];

export function getColorFromThreshold(
  threshold: ThresholdConfig,
  value: number
): ThresholdColor {
  if (threshold.direction === "lower_is_better") {
    if (value <= threshold.green_max) return "green";
    if (value <= threshold.yellow_max) return "yellow";
    return "red";
  }
  if (value >= threshold.green_max) return "green";
  if (value >= threshold.yellow_max) return "yellow";
  return "red";
}

export function buildThresholdsMap(
  thresholds: ThresholdConfig[]
): Record<string, ThresholdConfig> {
  const map: Record<string, ThresholdConfig> = {};
  for (const t of thresholds) {
    map[t.metric_key] = t;
  }
  return map;
}
