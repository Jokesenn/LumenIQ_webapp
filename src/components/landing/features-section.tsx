"use client";

import { motion } from "framer-motion";
import {
  Shield, Clock, BarChart3, Sparkles,
  Brain, Target, ArrowRight
} from "lucide-react";
import { FadeIn, TiltCard } from "@/components/animations";

const features = [
  {
    icon: Brain,
    title: "Jusqu'à 24 modèles",
    description: "Jusqu'à 24 algorithmes statistiques et ML en compétition. Le champion est sélectionné automatiquement pour chaque produit.",
    iconColor: "text-[var(--color-copper)]",
    metric: "24",
    metricLabel: "modèles",
  },
  {
    icon: Shield,
    title: "Backtesting rigoureux",
    description: "Chaque prévision est validée sur vos données historiques. Vous connaissez la fiabilité avant de décider.",
    iconColor: "text-[var(--color-success)]",
    metric: "5x",
    metricLabel: "cross-val",
  },
  {
    icon: Clock,
    title: "5 minutes chrono",
    description: "Upload CSV, cliquez, téléchargez. Pas de configuration complexe, pas de formation requise.",
    iconColor: "text-[var(--color-copper)]",
    metric: "5",
    metricLabel: "min",
  },
  {
    icon: Target,
    title: "Classification ABC/XYZ",
    description: "Identifiez automatiquement vos best-sellers et vos produits à faible volume pour prioriser vos efforts.",
    iconColor: "text-[var(--color-error)]",
    metric: "60%",
    metricLabel: "temps gagné",
  },
  {
    icon: BarChart3,
    title: "Rapports professionnels",
    description: "Graphiques interactifs, rapports PDF, exports Excel. Présentez vos prévisions en comité sans retravailler les données.",
    iconColor: "text-blue-600",
  },
  {
    icon: Sparkles,
    title: "Synthèse IA",
    description: "Claude analyse vos résultats et génère un résumé exécutif en langage business compréhensible.",
    iconColor: "text-[var(--color-copper)]",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" aria-label="Fonctionnalités" className="relative py-28 overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        {/* Header — offset with section number */}
        <div className="relative mb-20">
          <div className="absolute -top-8 right-0 section-number hidden lg:block">02</div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <FadeIn>
              <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-[var(--color-copper)] mb-4">
                Fonctionnalités
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-[-0.03em] leading-[1.05]">
                <span className="text-gradient">Forecasting enterprise,</span>
                <br />
                <span className="text-[var(--color-text)]">accessible aux PME</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-[var(--color-text-secondary)] mt-6 font-light leading-relaxed">
                Tout ce dont vous avez besoin pour des prévisions fiables,
                sans la complexité des outils enterprise.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Bento grid — varied sizes with metric highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Hero feature — spans 2 cols */}
          <FadeIn delay={0.1} className="md:col-span-2">
            <TiltCard className="h-full">
              <motion.div
                className="group relative h-full min-h-[300px] p-8 lg:p-10 rounded-2xl card-signal-accent bg-[var(--color-copper-bg-soft)] overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-copper)] p-[1px] mb-6">
                      <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                        <Brain className="w-6 h-6 text-[var(--color-copper)]" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-700 text-[var(--color-text)] mb-3 group-hover:text-gradient-brand transition-all">
                      {features[0].title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">{features[0].description}</p>
                    <span className="text-sm text-[var(--color-copper)] flex items-center gap-1 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      En savoir plus <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Visual: animated model bars */}
                  <div className="flex items-end justify-center gap-2 lg:w-48 shrink-0 pb-4">
                    {[
                      { h: "h-10", label: "C", delay: 0 },
                      { h: "h-16", label: "B", delay: 0.1 },
                      { h: "h-24", label: "A", delay: 0.2 },
                      { h: "h-32", label: "ML", delay: 0.3 },
                      { h: "h-40", label: "IA", delay: 0.4 },
                    ].map((bar, i) => (
                      <motion.div
                        key={i}
                        className="flex flex-col items-center gap-2"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + bar.delay, duration: 0.6, ease: "easeOut" }}
                        style={{ transformOrigin: "bottom" }}
                      >
                        <div className={`w-7 rounded-t-md bg-gradient-to-t from-[var(--color-copper)]/50 to-[var(--color-copper)]/20 ${bar.h}`} />
                        <span className="text-[10px] text-[var(--color-text-tertiary)] font-medium">{bar.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          </FadeIn>

          {/* Feature cards with metrics */}
          {features.slice(1).map((feature, i) => {
            const index = i + 1;

            return (
              <FadeIn key={index} delay={0.1 + index * 0.08}>
                <TiltCard className="h-full">
                  <motion.div
                    className="group relative h-full p-7 rounded-2xl card-signal transition-all duration-500"
                    whileHover={{ y: -5 }}
                  >
                    {/* Metric highlight (top right) */}
                    {feature.metric && (
                      <div className="absolute top-6 right-6">
                        <span className="text-3xl font-display font-800 text-[var(--color-copper)] opacity-15 group-hover:opacity-30 transition-opacity">
                          {feature.metric}
                        </span>
                      </div>
                    )}

                    <div className="w-11 h-11 rounded-xl bg-[var(--color-bg-surface)] flex items-center justify-center mb-5">
                      <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                    </div>

                    <h3 className="text-lg font-display font-600 text-[var(--color-text)] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {feature.description}
                    </p>
                    <span className="text-sm text-[var(--color-copper)] flex items-center gap-1 mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      En savoir plus <ArrowRight className="w-3 h-3" />
                    </span>
                  </motion.div>
                </TiltCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
