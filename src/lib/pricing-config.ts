// Source unique de vérité pour les plans tarifaires LumenIQ
// Chiffres modèles issus de MODEL_ROUTING_VISUAL.md
// Chiffres séries/mois issus de la configuration produit

export interface PricingPlan {
  name: string;
  price: number;
  models: number;
  series: number;
  history: number;
  description: string;
  badge?: string;
  popular?: boolean;
  icon: "Zap" | "Sparkles" | "Crown";
  gradient: string;
  features: string[];
}

export const PLANS: Record<string, PricingPlan> = {
  standard: {
    name: "Standard",
    price: 99,
    models: 17,
    series: 50,
    history: 30,
    description: "Forecasts pro sans expertise data science",
    icon: "Zap",
    gradient: "from-zinc-500 to-zinc-600",
    features: [
      "50 séries / mois",
      "17 modèles statistiques",
      "Routing ABC/XYZ intelligent",
      "Backtesting automatique",
      "Synthèse IA (Claude)",
      "Historique 30 jours",
      "Support email 48h",
    ],
  },
  ml: {
    name: "ML",
    price: 179,
    models: 22,
    series: 150,
    history: 60,
    description: "Performance ML sans data scientist",
    badge: "PLUS POPULAIRE",
    popular: true,
    icon: "Sparkles",
    gradient: "from-indigo-500 to-violet-500",
    features: [
      "150 séries / mois",
      "Tout Standard inclus",
      "+ Ridge (régression ML)",
      "+ LightGBM (gradient boosting)",
      "+ Hurdle+ (ML-enhanced)",
      "Historique 60 jours",
      "Support email 24h",
    ],
  },
  foundation: {
    name: "Foundation",
    price: 299,
    models: 24,
    series: 300,
    history: 90,
    description: "Foundation Models + Support prioritaire",
    badge: "PREMIUM",
    icon: "Crown",
    gradient: "from-amber-500 to-orange-500",
    features: [
      "300 séries / mois",
      "Tout ML inclus",
      "+ TimeGPT (Nixtla)",
      "+ EnsembleTop2",
      "Accès API REST complet",
      "Support prioritaire 4h",
      "Connecteur Shopify (bientôt)",
    ],
  },
};

export const PLANS_LIST: PricingPlan[] = [PLANS.standard, PLANS.ml, PLANS.foundation];

export const TRIAL_DURATION_MONTHS = 3;

export const MODEL_COUNTS = {
  standard: PLANS.standard.models,
  ml: PLANS.ml.models,
  foundation: PLANS.foundation.models,
};

// Chiffre générique pour les sections marketing (hero, comparison, etc.)
export const MAX_MODELS = PLANS.foundation.models; // 24
