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

// Generate forecast data for 30 days
export const forecastData: ForecastDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2025, 0, i + 1);
  const actual = i < 20 ? Math.floor(1200 + Math.random() * 600 + Math.sin(i / 3) * 200) : null;
  const forecast = i >= 18 ? Math.floor(1400 + Math.random() * 400 + Math.sin(i / 3) * 150) : null;
  const lower = forecast ? forecast - 150 - Math.random() * 100 : null;
  const upper = forecast ? forecast + 150 + Math.random() * 100 : null;
  return {
    date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    actual,
    forecast,
    lower,
    upper,
  };
});

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

// Pricing plans
export const pricingPlans = [
  {
    name: 'Standard',
    price: 99,
    description: 'Forecasts pro sans expertise data science',
    features: [
      '50 séries / mois',
      '10 modèles statistiques',
      'Routing ABC/XYZ intelligent',
      'Backtesting automatique',
      'Synthèse LLM (Claude)',
      'Historique 30 jours',
      'Support email 48h',
    ],
    models: 10,
    series: 50,
    history: 30,
  },
  {
    name: 'ML',
    price: 179,
    description: 'Performance ML sans data scientist',
    badge: 'BEST VALUE',
    popular: true,
    features: [
      '150 séries / mois',
      'Tout Standard inclus',
      '+ Ridge (batch vectorisé)',
      '+ LightGBM (tree-based)',
      '+ Hurdle+ (ML-enhanced)',
      'Historique 60 jours',
      'Support email 24h',
    ],
    models: 13,
    series: 150,
    history: 60,
  },
  {
    name: 'Foundation',
    price: 299,
    description: 'Foundation Models + Support prioritaire',
    badge: 'PREMIUM',
    features: [
      '300 séries / mois',
      'Tout ML inclus',
      '+ TimeGPT (Nixtla)',
      '+ EnsembleTop2',
      'API REST complète',
      'Support prioritaire 4h',
      'Connecteur Shopify (M9+)',
    ],
    models: 15,
    series: 300,
    history: 90,
  },
];

// FAQ items
export const faqItems = [
  {
    question: "Quel format de données est accepté ?",
    answer: "LumenIQ accepte les fichiers CSV et XLSX. Votre fichier doit contenir au minimum une colonne date et une ou plusieurs colonnes de valeurs numériques (ventes, quantités...). Le système effectue des contrôles qualité automatiques (missing, duplicates, outliers) et détecte automatiquement les colonnes."
  },
  {
    question: "Qu'est-ce que le routing ABC/XYZ ?",
    answer: "C'est notre innovation différenciante : allocation dynamique du budget compute selon la valeur business. Les produits classe A (top 20% CA) reçoivent jusqu'à 30 modèles avec 5-fold CV, tandis que la classe C utilise 10 modèles avec 2-fold CV. Résultat : ~60% de réduction du temps de calcul vs approche naïve, permettant un pricing compétitif."
  },
  {
    question: "Comment fonctionne le backtesting ?",
    answer: "Chaque forecast est validé par cross-validation temporelle (jusqu'à 5 folds pour classe A). De plus, notre mécanisme de Gating détecte si vos données ont significativement changé entre les runs. Si stable, un mini-backtest suffit : 60-70% plus rapide sur les exécutions récurrentes."
  },
  {
    question: "Combien de modèles sont disponibles ?",
    answer: "15 modèles organisés en 3 packs progressifs : Standard (10 modèles stats : Naive, SeasonalNaive, Drift, AutoETS, Theta, AutoARIMA, Croston, TSB, ADIDA, Hurdle), ML (+ Ridge, LightGBM, Hurdle+ batch-vectorisés avec 75% win-rate sur séries stables), et Foundation (+ TimeGPT zero-shot, EnsembleTop2). Le champion est sélectionné automatiquement par cross-validation."
  },
  {
    question: "Puis-je intégrer LumenIQ à mon système existant ?",
    answer: "Oui, le plan Foundation (€299/mois) inclut un accès API REST complet avec clé personnelle. Vous pouvez automatiser vos forecasts et intégrer les 6 artifacts (forecast.csv, metrics.json, etc.) directement dans votre ERP/BI. Un connecteur Shopify est prévu pour M9+."
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
