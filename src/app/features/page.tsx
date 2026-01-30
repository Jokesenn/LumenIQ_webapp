import { Navbar, Footer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, BarChart3 } from "lucide-react";
import Link from "next/link";

const featureSections = [
  {
    title: "Routing ABC/XYZ Intelligent",
    description:
      "Innovation différenciante : allocation dynamique du budget compute selon la valeur business de chaque série. Classification automatique selon contribution CA (ABC) et volatilité demande (XYZ).",
    benefits: [
      "Classe A (Top 20% CA) : jusqu'à 30 modèles, 5-fold CV",
      "Classe B (30% suivants) : jusqu'à 20 modèles, 3-fold CV",
      "Classe C (50% restants) : jusqu'à 10 modèles, 2-fold CV",
      "Impact : ~60% réduction temps de calcul vs approche naïve",
    ],
  },
  {
    title: "15 Modèles en 3 Packs",
    description:
      "Une bibliothèque complète organisée en 3 packs progressifs : Standard (10 modèles stats), ML (+3 modèles batch-vectorisés), Foundation (+TimeGPT). Chaque série est automatiquement associée au modèle champion.",
    benefits: [
      "Standard : Naive, SeasonalNaive, Drift, AutoETS, Theta, AutoARIMA, Croston, TSB, ADIDA, Hurdle",
      "ML : Ridge, LightGBM (75% win-rate séries stables), Hurdle+ (ML-enhanced)",
      "Foundation : TimeGPT (zero-shot, court historique), EnsembleTop2",
      "Sélection automatique du champion par cross-validation temporelle",
    ],
  },
  {
    title: "Backtesting Multi-Fold",
    description:
      "Chaque forecast est validé par cross-validation temporelle (jusqu'à 5 folds pour classe A). Mécanisme de Gating : évite de recalculer si les données n'ont pas significativement changé.",
    benefits: [
      "Métriques : WAPE (principale), SMAPE, MAPE, MASE, Bias, MAE, RMSE",
      "Gating : 60-70% plus rapide sur séries stables (runs récurrents)",
      "Détection de drift automatique entre les runs",
      "Intervalle de confiance 80% calibré sur l'historique",
    ],
  },
  {
    title: "6 Artifacts & Synthèse LLM",
    description:
      "Export complet pour audit et intégration ERP/BI. Rapport exécutif généré par Claude API traduit les résultats techniques en insights business actionnables.",
    benefits: [
      "forecast.csv : prévisions point + intervalles de confiance",
      "metrics.json : 10+ métriques par série",
      "model_registry.json : champion + audit trail complet",
      "insights.json + run_manifest.json + synthèse LLM (2-3 paragraphes)",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="pt-20">
        <section className="py-20 px-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-20">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-[-0.02em] text-white">
                Fonctionnalités
              </h1>
              <p className="text-lg text-zinc-400 max-w-[600px] mx-auto">
                Une suite complète d&apos;outils de prévision professionnels,
                conçue pour les PME e-commerce qui veulent des résultats fiables.
              </p>
            </div>

            <div className="space-y-20">
              {featureSections.map((feature, index) => (
                <FeatureSection key={index} {...feature} reverse={index % 2 === 1} />
              ))}
            </div>

            <div className="text-center mt-20">
              <Link href="/dashboard">
                <Button size="large" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  Essayer gratuitement
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

interface FeatureSectionProps {
  title: string;
  description: string;
  benefits: string[];
  reverse?: boolean;
}

function FeatureSection({ title, description, benefits, reverse }: FeatureSectionProps) {
  return (
    <div
      className={`grid md:grid-cols-2 gap-16 items-center ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className={reverse ? "md:order-2" : ""}>
        <h3 className="text-2xl md:text-[28px] font-bold text-white mb-4">{title}</h3>
        <p className="text-zinc-400 leading-relaxed mb-6">
          {description}
        </p>
        <div className="space-y-3">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check
                size={18}
                className="text-emerald-500 mt-0.5 shrink-0"
              />
              <span className="text-sm text-zinc-400">{b}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={reverse ? "md:order-1" : ""}>
        <div className="bg-zinc-900/50 rounded-2xl border border-white/[0.08] h-[300px] flex items-center justify-center">
          <div className="w-[120px] h-[120px] rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <BarChart3 size={48} className="text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
