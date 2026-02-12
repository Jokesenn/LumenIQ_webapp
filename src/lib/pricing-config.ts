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
    description: "Prévisions professionnelles sans expertise technique",
    icon: "Zap",
    gradient: "from-zinc-500 to-zinc-600",
    features: [
      "50 séries / mois",
      "17 modèles statistiques",
      "Routing ABC/XYZ intelligent",
      "Validation automatique sur historique",
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
    description: "Précision supérieure pour produits complexes",
    badge: "PLUS POPULAIRE",
    popular: true,
    icon: "Sparkles",
    gradient: "from-indigo-500 to-violet-500",
    features: [
      "150 séries / mois",
      "Tout Standard inclus",
      "+ 5 modèles machine learning avancés",
      "+ Idéal pour catalogues à forte variabilité",
      "Historique 60 jours",
      "Support email 24h",
    ],
  },
  premium: {
    name: "Premium",
    price: 299,
    models: 24,
    series: 300,
    history: 90,
    description: "Modèles avancés + Support prioritaire",
    badge: "PREMIUM",
    icon: "Crown",
    gradient: "from-amber-500 to-orange-500",
    features: [
      "300 séries / mois",
      "Tout ML inclus",
      "+ Modèles fondation IA (TimeGPT)",
      "+ Combinaisons automatiques (Ensemble)",
      "Accès API REST complet",
      "Support prioritaire 4h",
      "Connecteur Shopify (bientôt)",
    ],
  },
};

export const PLANS_LIST: PricingPlan[] = [PLANS.standard, PLANS.ml, PLANS.premium];

export const TRIAL_DURATION_MONTHS = 3;

export const MODEL_COUNTS = {
  standard: PLANS.standard.models,
  ml: PLANS.ml.models,
  premium: PLANS.premium.models,
};

