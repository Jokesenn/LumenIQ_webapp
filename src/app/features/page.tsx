import { Navbar, Footer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, BarChart3 } from "lucide-react";
import Link from "next/link";

const featureSections = [
  {
    title: "Routing ABC/XYZ Intelligent",
    description:
      "Innovation diff\u00e9renciante : allocation dynamique du budget compute selon la valeur business de chaque s\u00e9rie. Classification automatique selon contribution CA (ABC) et volatilit\u00e9 demande (XYZ).",
    benefits: [
      "Classe A (Top 20% CA) : jusqu'\u00e0 30 mod\u00e8les, 5-fold CV",
      "Classe B (30% suivants) : jusqu'\u00e0 20 mod\u00e8les, 3-fold CV",
      "Classe C (50% restants) : jusqu'\u00e0 10 mod\u00e8les, 2-fold CV",
      "Impact : ~60% r\u00e9duction temps de calcul vs approche na\u00efve",
    ],
  },
  {
    title: "15 Mod\u00e8les en 3 Packs",
    description:
      "Une biblioth\u00e8que compl\u00e8te organis\u00e9e en 3 packs progressifs : Standard (10 mod\u00e8les stats), ML (+3 mod\u00e8les batch-vectoris\u00e9s), Foundation (+TimeGPT). Chaque s\u00e9rie est automatiquement associ\u00e9e au mod\u00e8le champion.",
    benefits: [
      "Standard : Naive, SeasonalNaive, Drift, AutoETS, Theta, AutoARIMA, Croston, TSB, ADIDA, Hurdle",
      "ML : Ridge, LightGBM (75% win-rate s\u00e9ries stables), Hurdle+ (ML-enhanced)",
      "Foundation : TimeGPT (zero-shot, court historique), EnsembleTop2",
      "S\u00e9lection automatique du champion par cross-validation temporelle",
    ],
  },
  {
    title: "Backtesting Multi-Fold",
    description:
      "Chaque forecast est valid\u00e9 par cross-validation temporelle (jusqu'\u00e0 5 folds pour classe A). M\u00e9canisme de Gating : \u00e9vite de recalculer si les donn\u00e9es n'ont pas significativement chang\u00e9.",
    benefits: [
      "M\u00e9triques : WAPE (principale), SMAPE, MAPE, MASE, Bias, MAE, RMSE",
      "Gating : 60-70% plus rapide sur s\u00e9ries stables (runs r\u00e9currents)",
      "D\u00e9tection de drift automatique entre les runs",
      "Intervalle de confiance 80% calibr\u00e9 sur l'historique",
    ],
  },
  {
    title: "6 Artifacts & Synth\u00e8se LLM",
    description:
      "Export complet pour audit et int\u00e9gration ERP/BI. Rapport ex\u00e9cutif g\u00e9n\u00e9r\u00e9 par Claude API traduit les r\u00e9sultats techniques en insights business actionnables.",
    benefits: [
      "forecast.csv : pr\u00e9visions point + intervalles de confiance",
      "metrics.json : 10+ m\u00e9triques par s\u00e9rie",
      "model_registry.json : champion + audit trail complet",
      "insights.json + run_manifest.json + synth\u00e8se LLM (2-3 paragraphes)",
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
                Fonctionnalit\u00e9s
              </h1>
              <p className="text-lg text-zinc-400 max-w-[600px] mx-auto">
                Une suite compl\u00e8te d&apos;outils de pr\u00e9vision professionnels,
                con\u00e7ue pour les PME e-commerce qui veulent des r\u00e9sultats fiables.
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
