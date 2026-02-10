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

// Static hero chart data — handcrafted for visual impact
// 36 months: 24 months actuals (Jan 2023 – Dec 2024) + 12 months forecast (Jan – Dec 2025)
// Shows clear seasonality (peak Nov-Dec, dip Jan-Feb) with slight upward trend (~3%/yr)
// CI band widens progressively into the future
// ciBase + ciBand are computed for stacked area rendering (avoids black fill bug)
export const forecastData: (ForecastDataPoint & { ciBase: number | null; ciBand: number | null })[] = [
  // ── 2023 ──────────────────────────────────
  { date: "jan. 23",  actual: 1120, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "fév. 23",  actual: 1080, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "mars 23",  actual: 1210, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "avr. 23",  actual: 1340, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "mai 23",   actual: 1420, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "juin 23",  actual: 1380, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "juil. 23", actual: 1290, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "août 23",  actual: 1180, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "sept. 23", actual: 1350, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "oct. 23",  actual: 1510, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "nov. 23",  actual: 1780, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "déc. 23",  actual: 1920, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  // ── 2024 ──────────────────────────────────
  { date: "jan. 24",  actual: 1180, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "fév. 24",  actual: 1140, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "mars 24",  actual: 1280, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "avr. 24",  actual: 1410, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "mai 24",   actual: 1490, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "juin 24",  actual: 1440, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "juil. 24", actual: 1350, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "août 24",  actual: 1240, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "sept. 24", actual: 1420, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "oct. 24",  actual: 1580, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  { date: "nov. 24",  actual: 1850, forecast: null, lower: null, upper: null, ciBase: null, ciBand: null },
  // Junction: Dec 2024 — last actual, first forecast (continuity)
  { date: "déc. 24",  actual: 1990, forecast: 1990, lower: 1990, upper: 1990, ciBase: 1990, ciBand: 0 },
  // ── 2025 (forecast) ───────────────────────
  { date: "jan. 25",  actual: null, forecast: 1230, lower: 1150, upper: 1310, ciBase: 1150, ciBand: 160 },
  { date: "fév. 25",  actual: null, forecast: 1190, lower: 1080, upper: 1300, ciBase: 1080, ciBand: 220 },
  { date: "mars 25",  actual: null, forecast: 1340, lower: 1200, upper: 1480, ciBase: 1200, ciBand: 280 },
  { date: "avr. 25",  actual: null, forecast: 1480, lower: 1310, upper: 1650, ciBase: 1310, ciBand: 340 },
  { date: "mai 25",   actual: null, forecast: 1560, lower: 1360, upper: 1760, ciBase: 1360, ciBand: 400 },
  { date: "juin 25",  actual: null, forecast: 1510, lower: 1280, upper: 1740, ciBase: 1280, ciBand: 460 },
  { date: "juil. 25", actual: null, forecast: 1410, lower: 1150, upper: 1670, ciBase: 1150, ciBand: 520 },
  { date: "août 25",  actual: null, forecast: 1300, lower: 1010, upper: 1590, ciBase: 1010, ciBand: 580 },
  { date: "sept. 25", actual: null, forecast: 1490, lower: 1160, upper: 1820, ciBase: 1160, ciBand: 660 },
  { date: "oct. 25",  actual: null, forecast: 1660, lower: 1290, upper: 2030, ciBase: 1290, ciBand: 740 },
  { date: "nov. 25",  actual: null, forecast: 1940, lower: 1530, upper: 2350, ciBase: 1530, ciBand: 820 },
  { date: "déc. 25",  actual: null, forecast: 2090, lower: 1640, upper: 2540, ciBase: 1640, ciBand: 900 },
];

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
    id: "temps-setup",
    question: "Combien de temps pour obtenir mes premières prévisions ?",
    answer: "5 minutes chrono. Upload CSV, configuration automatique, résultats prêts. Aucune formation technique requise."
  },
  {
    id: "garantie-qualite",
    question: "Que se passe-t-il si mes prévisions sont imprécises ?",
    answer: "Chaque prévision inclut un score de fiabilité basé sur la validation historique. Vous savez à l'avance où faire confiance et où rester vigilant. Support technique disponible si besoin."
  },
  {
    id: "migration-excel",
    question: "Puis-je migrer depuis mes fichiers Excel actuels ?",
    answer: "Oui. LumenIQ accepte vos CSV/Excel existants. Glissez-déposez votre fichier, le système détecte automatiquement la structure. Pas de reformatage manuel."
  },
  {
    id: "format-donnees",
    question: "Quel format de données est accepté ?",
    answer: "LumenIQ accepte les fichiers CSV et Excel. Votre fichier doit contenir au minimum une colonne date et une ou plusieurs colonnes de valeurs numériques (ventes, quantités...). Le système détecte automatiquement vos colonnes et effectue des contrôles qualité (données manquantes, doublons, valeurs aberrantes)."
  },
  {
    id: "routing-abc-xyz",
    question: "Qu'est-ce que le routing ABC/XYZ ?",
    answer: "Méthode d'optimisation intelligente : vos produits les plus importants (classe A, top 20% du CA) bénéficient de plus de modèles et validations poussées. Les produits à faible volume reçoivent un traitement adapté mais plus rapide. Résultat : précision maximale là où ça compte, temps de calcul réduit de 60%."
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
