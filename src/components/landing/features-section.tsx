"use client";

import { motion } from "framer-motion";
import {
  Shield, Clock, BarChart3, Sparkles,
  Brain, Target, ArrowRight
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, TiltCard } from "@/components/animations";

const features = [
  {
    icon: Brain,
    title: "Jusqu'à 24 modèles",
    description: "Jusqu'à 24 algorithmes statistiques et ML en compétition. Le champion est sélectionné automatiquement pour chaque produit.",
    gradient: "from-indigo-500 to-violet-500",
    iconColor: "text-indigo-400",
  },
  {
    icon: Shield,
    title: "Backtesting rigoureux",
    description: "Chaque prévision est validée sur vos données historiques. Vous connaissez la fiabilité avant de décider.",
    gradient: "from-emerald-500 to-cyan-500",
    iconColor: "text-emerald-400",
  },
  {
    icon: Clock,
    title: "5 minutes chrono",
    description: "Upload CSV, cliquez, téléchargez. Pas de configuration complexe, pas de formation requise.",
    gradient: "from-amber-500 to-orange-500",
    iconColor: "text-amber-400",
  },
  {
    icon: Target,
    title: "Classification ABC/XYZ",
    description: "Identifiez automatiquement vos best-sellers et vos produits à faible volume pour prioriser vos efforts.",
    gradient: "from-rose-500 to-pink-500",
    iconColor: "text-rose-400",
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

/** Style A: gradient-border icon (indices 0, 2, 4) */
function GradientBorderIcon({ icon: Icon, gradient }: { icon: typeof Brain; gradient: string }) {
  return (
    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} p-[1px] mb-6`}>
      <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}

/** Style B: flat colored icon (indices 1, 3, 5) */
function FlatIcon({ icon: Icon, iconColor }: { icon: typeof Brain; iconColor: string }) {
  return (
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5">
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
  );
}

/** Hover reveal link */
function HoverReveal() {
  return (
    <span className="text-sm text-indigo-400 flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      En savoir plus <ArrowRight className="w-3 h-3" />
    </span>
  );
}

/** Spotlight mouse handler */
function handleSpotlight(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  e.currentTarget.style.setProperty("--spotlight-x", `${x}%`);
  e.currentTarget.style.setProperty("--spotlight-y", `${y}%`);
}

/** Standard feature card (used for features[1] and features[2..5]) */
function FeatureCard({ feature, index }: { feature: (typeof features)[number]; index: number }) {
  const useStyleA = index % 2 === 0;

  return (
    <TiltCard className="h-full">
      <motion.div
        className="group relative h-full p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all duration-500 spotlight"
        whileHover={{ y: -5 }}
        onMouseMove={handleSpotlight}
      >
        {useStyleA ? (
          <GradientBorderIcon icon={feature.icon} gradient={feature.gradient} />
        ) : (
          <FlatIcon icon={feature.icon} iconColor={feature.iconColor} />
        )}

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gradient transition-all">
          {feature.title}
        </h3>
        <p className="text-zinc-300 leading-relaxed">
          {feature.description}
        </p>

        <HoverReveal />
      </motion.div>
    </TiltCard>
  );
}

/** Hero feature card for features[0] -- spans 2 columns with mini bar chart visual */
function HeroFeatureCard({ feature }: { feature: (typeof features)[number] }) {
  return (
    <TiltCard className="h-full">
      <motion.div
        className="group relative h-full min-h-[280px] p-8 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-500/10 hover:border-indigo-500/20 transition-all duration-500 spotlight"
        whileHover={{ y: -5 }}
        onMouseMove={handleSpotlight}
      >
        <div className="flex flex-col sm:flex-row gap-8 h-full">
          {/* Text left */}
          <div className="flex-1 flex flex-col justify-center">
            <GradientBorderIcon icon={feature.icon} gradient={feature.gradient} />

            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gradient transition-all">
              {feature.title}
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              {feature.description}
            </p>

            <HoverReveal />
          </div>

          {/* Mini bar chart visual right */}
          <div className="flex items-end justify-center gap-3 sm:w-40 shrink-0 pb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 rounded-t-md bg-gradient-to-t from-indigo-500/40 to-indigo-400/20 h-14" />
              <span className="text-[11px] text-zinc-500">Starter</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 rounded-t-md bg-gradient-to-t from-indigo-500/60 to-indigo-400/30 h-24" />
              <span className="text-[11px] text-zinc-500">Premium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 rounded-t-md bg-gradient-to-t from-violet-500/80 to-indigo-400/40 h-36" />
              <span className="text-[11px] text-zinc-500">Business</span>
            </div>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" aria-label="Fonctionnalités" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeIn>
            <span className="text-sm font-semibold uppercase tracking-widest text-indigo-400 mb-4 block">
              Fonctionnalités
            </span>
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

        {/* Bento grid */}
        <StaggerChildren staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hero feature -- spans 2 cols */}
          <StaggerItem className="md:col-span-2 lg:col-span-2">
            <HeroFeatureCard feature={features[0]} />
          </StaggerItem>

          {/* Second feature -- 1 col beside hero */}
          <StaggerItem>
            <FeatureCard feature={features[1]} index={1} />
          </StaggerItem>

          {/* Remaining 4 features */}
          {features.slice(2).map((feature, i) => (
            <StaggerItem key={i + 2}>
              <FeatureCard feature={feature} index={i + 2} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
