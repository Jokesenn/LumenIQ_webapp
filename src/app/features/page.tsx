"use client";

import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Brain, Shield, Target, FileText, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { FadeIn, MagneticButton, TiltCard } from "@/components/animations";

const featureSections = [
  {
    icon: Target,
    title: "Routing ABC/XYZ Intelligent",
    description: "Allocation dynamique du budget compute selon la valeur business de chaque série. Classification automatique selon contribution CA (ABC) et volatilité demande (XYZ).",
    benefits: [
      "Classe A (Top 20% CA) : jusqu'à 30 modèles, 5-fold CV",
      "Classe B (30% suivants) : jusqu'à 20 modèles, 3-fold CV",
      "Classe C (50% restants) : jusqu'à 10 modèles, 2-fold CV",
      "Impact : ~60% réduction temps de calcul vs approche naïve",
    ],
    gradient: "from-rose-500 to-pink-500",
    metric: "60%",
    metricLabel: "plus rapide",
  },
  {
    icon: Brain,
    title: "Jusqu'à 24 modèles en 3 packs",
    description: "Une bibliothèque complète organisée en 3 packs progressifs : Standard (17 modèles stats), ML (+5 modèles ML), Premium (+TimeGPT & EnsembleTop2).",
    benefits: [
      "Standard : 17 modèles statistiques éprouvés (AutoARIMA, ETS, Theta, Croston...)",
      "ML : Ridge, LightGBM (75% win-rate séries stables), Hurdle+ (ML-enhanced)",
      "Premium : TimeGPT (zero-shot, court historique), EnsembleTop2",
      "Sélection automatique du champion par cross-validation temporelle",
    ],
    gradient: "from-indigo-500 to-violet-500",
    metric: "24",
    metricLabel: "modèles",
  },
  {
    icon: Shield,
    title: "Backtesting Multi-Fold",
    description: "Chaque forecast est validé par cross-validation temporelle (jusqu'à 5 folds pour classe A). Mécanisme de Gating : évite de recalculer si les données n'ont pas significativement changé.",
    benefits: [
      "Métriques : Score de fiabilité, Erreur pondérée, Erreur moyenne, Biais...",
      "Gating : 60-70% plus rapide sur séries stables (runs récurrents)",
      "Détection de drift automatique entre les runs",
      "Intervalle de confiance 80% calibré sur l'historique",
    ],
    gradient: "from-emerald-500 to-cyan-500",
    metric: "5x",
    metricLabel: "validation",
  },
  {
    icon: FileText,
    title: "6 Artifacts & Synthèse LLM",
    description: "Export complet pour audit et intégration ERP/BI. Rapport exécutif généré par Claude API traduit les résultats techniques en insights business actionnables.",
    benefits: [
      "forecast.csv : prévisions point + intervalles de confiance",
      "metrics.json : 10+ métriques par série",
      "model_registry.json : champion + audit trail complet",
      "insights.json + run_manifest.json + synthèse LLM (2-3 paragraphes)",
    ],
    gradient: "from-amber-500 to-orange-500",
    metric: "6",
    metricLabel: "artifacts",
  },
];

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20">
        {/* Hero */}
        <section className="py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-24">
              <FadeIn>
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                  Fonctionnalités
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-800 tracking-[-0.03em] leading-[0.95] text-white mb-6">
                  Tout ce qu&apos;il faut
                  <br />
                  <span className="text-gradient-brand">pour prévoir juste</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg text-zinc-400 max-w-[600px] mx-auto font-light leading-relaxed">
                  Une suite complète d&apos;outils de prévision professionnels,
                  conçue pour les PME e-commerce qui veulent des résultats fiables.
                </p>
              </FadeIn>
            </div>

            {/* Feature sections — alternating layout */}
            <div className="space-y-28">
              {featureSections.map((feature, index) => (
                <FeatureBlock key={index} {...feature} reverse={index % 2 === 1} index={index} />
              ))}
            </div>

            {/* CTA */}
            <FadeIn delay={0.3}>
              <div className="text-center mt-24">
                <Link href="/login?mode=signup">
                  <MagneticButton className="group px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold text-white glow-pulse transition-all">
                    <span className="flex items-center gap-2">
                      Essai gratuit 3 mois
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </MagneticButton>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

interface FeatureBlockProps {
  icon: typeof Brain;
  title: string;
  description: string;
  benefits: string[];
  gradient: string;
  metric: string;
  metricLabel: string;
  reverse?: boolean;
  index: number;
}

function FeatureBlock({ icon: Icon, title, description, benefits, gradient, metric, metricLabel, reverse, index }: FeatureBlockProps) {
  return (
    <motion.div
      className="grid lg:grid-cols-2 gap-16 items-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className={reverse ? "lg:order-2" : ""}>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} p-[1px] mb-6`}>
          <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-800 text-white mb-4 tracking-tight">{title}</h3>
        <p className="text-zinc-400 leading-relaxed mb-8 font-light">{description}</p>
        <div className="space-y-3">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check size={16} className="text-emerald-500 mt-1 shrink-0" />
              <span className="text-sm text-zinc-400">{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={reverse ? "lg:order-1" : ""}>
        <TiltCard>
          <div className="relative bg-zinc-900/30 rounded-2xl border border-white/[0.05] p-10 flex flex-col items-center justify-center min-h-[300px] overflow-hidden">
            {/* Gradient glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.03]`} />
            {/* Large metric display */}
            <motion.div
              className={`text-8xl md:text-9xl font-display font-800 bg-gradient-to-br ${gradient} bg-clip-text text-transparent tracking-[-0.05em] leading-none`}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            >
              {metric}
            </motion.div>
            <p className="text-sm text-zinc-500 mt-4 font-display font-600 uppercase tracking-widest">
              {metricLabel}
            </p>
          </div>
        </TiltCard>
      </div>
    </motion.div>
  );
}
