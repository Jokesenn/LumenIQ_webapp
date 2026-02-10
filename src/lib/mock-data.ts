// Mock data extracted from LumenIQ_Website_SaaS_v3.jsx

export interface ForecastDataPoint {
  date: string;
  actual: number | null;
  forecast: number | null;
  lower: number | null;
  upper: number | null;
}

export interface RecentForecast {
  id: number;
  name: string;
  date: string;
  series: number;
  status: 'completed' | 'processing' | 'failed';
  smape: number;
}

export interface ABCDistribution {
  name: string;
  value: number;
  color: string;
  label: string;
}

export interface ModelPerformance {
  model: string;
  smape: number;
  series: number;
}

// Seeded PRNG for deterministic mock data (avoids SSR hydration mismatch)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate forecast data for 30 days (deterministic)
export const forecastData: ForecastDataPoint[] = (() => {
  const rng = seededRandom(42);
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2025, 0, i + 1);
    const actual = i < 20 ? Math.floor(1200 + rng() * 600 + Math.sin(i / 3) * 200) : null;
    const forecast = i >= 18 ? Math.floor(1400 + rng() * 400 + Math.sin(i / 3) * 150) : null;
    const lower = forecast ? forecast - 150 - rng() * 100 : null;
    const upper = forecast ? forecast + 150 + rng() * 100 : null;
    return {
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      actual,
      forecast,
      lower,
      upper,
    };
  });
})();

// Recent forecasts
export const recentForecasts: RecentForecast[] = [
  { id: 1, name: 'Q1_2025_Products.csv', date: '15 Jan 2025', series: 47, status: 'completed', smape: 8.2 },
  { id: 2, name: 'Winter_Sales.csv', date: '12 Jan 2025', series: 32, status: 'completed', smape: 11.4 },
  { id: 3, name: 'Electronics_Dec.csv', date: '08 Jan 2025', series: 89, status: 'completed', smape: 6.8 },
  { id: 4, name: 'Fashion_Q4.csv', date: '02 Jan 2025', series: 156, status: 'completed', smape: 9.1 },
];

// ABC Distribution
export const abcDistribution: ABCDistribution[] = [
  { name: 'A', value: 15, color: '#4F5BD5', label: 'Produits stratégiques' },
  { name: 'B', value: 35, color: '#6370E8', label: 'Produits standards' },
  { name: 'C', value: 50, color: '#8B94E8', label: 'Longue traîne' },
];

// Model performance data
export const modelPerformance: ModelPerformance[] = [
  { model: 'AutoARIMA', smape: 8.2, series: 12 },
  { model: 'Theta', smape: 9.1, series: 18 },
  { model: 'CrostonOptimized', smape: 7.4, series: 8 },
  { model: 'ETS', smape: 10.2, series: 6 },
  { model: 'MSTL', smape: 8.8, series: 3 },
];

// Available models list
export const availableModels = [
  'AutoARIMA',
  'AutoETS',
  'Theta',
  'Croston',
  'TSB',
  'ADIDA',
  'LightGBM',
  'Ridge',
  'Naive',
  'SeasonalNaive',
  'Drift',
  'RollingMean',
  'Hurdle',
  'TimeGPT',
  'EnsembleTop2',
];

// Pricing plans — source unique : pricing-config.ts
// Ce re-export est conservé pour compatibilité avec les composants existants
import { PLANS_LIST } from "@/lib/pricing-config";
export const pricingPlans = PLANS_LIST;

// FAQ items
export const faqItems = [
  {
    id: "format-donnees",
    question: "Quel format de données est accepté ?",
    answer: "LumenIQ accepte les fichiers CSV et Excel. Votre fichier doit contenir au minimum une colonne date et une ou plusieurs colonnes de valeurs numériques (ventes, quantités...). Le système détecte automatiquement vos colonnes et effectue des contrôles qualité (données manquantes, doublons, valeurs aberrantes)."
  },
  {
    id: "routing-abc-xyz",
    question: "Qu'est-ce que le routing ABC/XYZ ?",
    answer: "C'est notre méthode d'optimisation intelligente : vos produits les plus importants (classe A, top 20% du chiffre d'affaires) bénéficient de plus de modèles et de validations plus poussées. Les produits à faible volume reçoivent un traitement adapté mais plus rapide. Résultat : des prévisions plus précises là où ça compte, avec un temps de calcul réduit d'environ 60%."
  },
  {
    id: "backtesting",
    question: "Comment fonctionne le backtesting ?",
    answer: "Chaque prévision est validée sur vos propres données historiques : le système masque une partie de vos ventes passées, génère une prévision, puis compare avec la réalité. Ce processus est répété jusqu'à 5 fois pour les produits clés. Vous obtenez ainsi un score de fiabilité concret avant de prendre vos décisions."
  },
  {
    id: "nombre-modeles",
    question: "Combien de modèles sont disponibles ?",
    answer: "Jusqu'à 24 modèles organisés en 3 packs progressifs : Standard (17 modèles statistiques éprouvés), ML (22 modèles incluant le machine learning pour plus de précision), et Premium (24+ modèles incluant les foundation models les plus avancés). Pour chaque série, le meilleur modèle est sélectionné automatiquement grâce au backtesting."
  },
  {
    id: "integration",
    question: "Puis-je intégrer LumenIQ à mon système existant ?",
    answer: "Oui, le plan Premium (299 €/mois) inclut un accès API REST complet. Vous pouvez automatiser vos prévisions et intégrer les résultats (fichiers de prévision, métriques, rapports) directement dans votre ERP ou outil de BI. Un connecteur Shopify est également prévu prochainement."
  },
];

// Dashboard stats
export const dashboardStats = {
  seriesThisMonth: 12,
  seriesLimit: 50,
  forecastsThisMonth: 4,
  averageSmape: 8.9,
  daysUntilReset: 16,
};
