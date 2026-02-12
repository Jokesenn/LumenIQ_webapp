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
    gradient: "from-indigo-500 to-violet-500",
    iconColor: "text-indigo-400",
    metric: "24",
    metricLabel: "modèles",
  },
  {
    icon: Shield,
    title: "Backtesting rigoureux",
    description: "Chaque prévision est validée sur vos données historiques. Vous connaissez la fiabilité avant de décider.",
    gradient: "from-emerald-500 to-cyan-500",
    iconColor: "text-emerald-400",
    metric: "5x",
    metricLabel: "cross-val",
  },
  {
    icon: Clock,
    title: "5 minutes chrono",
    description: "Upload CSV, cliquez, téléchargez. Pas de configuration complexe, pas de formation requise.",
    gradient: "from-amber-500 to-orange-500",
    iconColor: "text-amber-400",
    metric: "5",
    metricLabel: "min",
  },
  {
    icon: Target,
    title: "Classification ABC/XYZ",
    description: "Identifiez automatiquement vos best-sellers et vos produits à faible volume pour prioriser vos efforts.",
    gradient: "from-rose-500 to-pink-500",
    iconColor: "text-rose-400",
    metric: "60%",
    metricLabel: "temps gagné",
  },
  {
    icon: BarChart3,
    title: "Rapports professionnels",
    description: "Graphiques interactifs, rapports PDF, exports Excel. Présentez vos prévisions en comité sans retravailler les données.",
    gradient: "from-blue-500 to-indigo-500",
    iconColor: "text-blue-400",
  },
  {
    icon: Sparkles,
    title: "Synthèse IA",
    description: "Claude analyse vos résultats et génère un résumé exécutif en langage business compréhensible.",
    gradient: "from-violet-500 to-purple-500",
    iconColor: "text-violet-400",
  },
];

function handleSpotlight(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  e.currentTarget.style.setProperty("--spotlight-x", `${x}%`);
  e.currentTarget.style.setProperty("--spotlight-y", `${y}%`);
}

export function FeaturesSection() {
  return (
    <section id="features" aria-label="Fonctionnalités" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-hex-pattern opacity-40" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        {/* Header — offset with section number */}
        <div className="relative mb-20">
          <div className="absolute -top-8 right-0 section-number hidden lg:block">02</div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <FadeIn>
              <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                Fonctionnalités
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-[-0.03em] leading-[1.05]">
                <span className="text-gradient">Forecasting enterprise,</span>
                <br />
                <span className="text-white">accessible aux PME</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-zinc-400 mt-6 font-light leading-relaxed">
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
                className="group relative h-full min-h-[300px] p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-indigo-500/[0.06] to-violet-500/[0.03] border border-indigo-500/10 hover:border-indigo-500/20 transition-all duration-500 spotlight overflow-hidden"
                whileHover={{ y: -5 }}
                onMouseMove={handleSpotlight}
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-[1px] mb-6`}>
                      <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-700 text-white mb-3 group-hover:text-gradient-brand transition-all">
                      {features[0].title}
                    </h3>
                    <p className="text-zinc-300 leading-relaxed">{features[0].description}</p>
                    <span className="text-sm text-indigo-400 flex items-center gap-1 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                        <div className={`w-7 rounded-t-md bg-gradient-to-t from-indigo-500/50 to-violet-400/20 ${bar.h}`} />
                        <span className="text-[10px] text-zinc-600 font-medium">{bar.label}</span>
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
            const useGradientIcon = index % 2 === 0;

            return (
              <FadeIn key={index} delay={0.1 + index * 0.08}>
                <TiltCard className="h-full">
                  <motion.div
                    className="group relative h-full p-7 rounded-2xl bg-zinc-900/40 border border-white/[0.05] hover:border-white/[0.08] transition-all duration-500 spotlight"
                    whileHover={{ y: -5 }}
                    onMouseMove={handleSpotlight}
                  >
                    {/* Metric highlight (top right) */}
                    {feature.metric && (
                      <div className="absolute top-6 right-6">
                        <span className={`text-3xl font-display font-800 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity`}>
                          {feature.metric}
                        </span>
                      </div>
                    )}

                    {useGradientIcon ? (
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-5`}>
                        <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-white/[0.04] flex items-center justify-center mb-5">
                        <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                      </div>
                    )}

                    <h3 className="text-lg font-display font-600 text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>
                    <span className="text-sm text-indigo-400 flex items-center gap-1 mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
