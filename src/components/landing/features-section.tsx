"use client";

import { motion } from "framer-motion";
import {
  Shield, Clock, BarChart3, Sparkles,
  Brain, Target, Layers
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, TiltCard } from "@/components/animations";
import { AnimatedBackground } from "@/components/backgrounds";

const features = [
  {
    icon: Brain,
    title: "Jusqu'à 24 modèles",
    description: "Jusqu'à 24 algorithmes statistiques et ML en compétition. Le champion est sélectionné automatiquement pour chaque produit.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Shield,
    title: "Backtesting rigoureux",
    description: "Chaque prévision est validée sur vos données historiques. Vous connaissez la fiabilité avant de décider.",
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "5 minutes chrono",
    description: "Upload CSV, cliquez, téléchargez. Pas de configuration complexe, pas de formation requise.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Target,
    title: "Classification ABC/XYZ",
    description: "Identifiez automatiquement vos best-sellers et vos produits à faible volume pour prioriser vos efforts.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Rapports professionnels",
    description: "Graphiques interactifs, rapports PDF, exports Excel. Présentez vos prévisions en comité sans retravailler les données.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Sparkles,
    title: "Synthèse IA",
    description: "Claude analyse vos résultats et génère un résumé exécutif en langage business compréhensible.",
    gradient: "from-violet-500 to-purple-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" aria-label="Fonctionnalités" className="relative py-20 overflow-hidden">
      <AnimatedBackground variant="section" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeIn>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-zinc-300">Fonctionnalités</span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gradient">Forecasting enterprise,</span>
              <br />
              <span className="text-white">accessible aux PME</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour des prévisions fiables,
              sans la complexité des outils enterprise.
            </p>
          </FadeIn>
        </div>

        {/* Features grid */}
        <StaggerChildren staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <StaggerItem key={i}>
              <TiltCard className="h-full">
                <motion.div
                  className="group relative h-full p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all duration-500 spotlight"
                  whileHover={{ y: -5 }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    e.currentTarget.style.setProperty('--spotlight-x', `${x}%`);
                    e.currentTarget.style.setProperty('--spotlight-y', `${y}%`);
                  }}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-6`}>
                    <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gradient transition-all">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {feature.description}
                  </p>

                </motion.div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
