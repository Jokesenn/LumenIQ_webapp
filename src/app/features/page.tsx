"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { Navbar, Footer } from "@/components/shared";
import { ArrowRight, Check, Brain, Shield, Target, FileText, Zap, Sparkles, TrendingUp, BarChart3, Cpu, Clock } from "lucide-react";
import Link from "next/link";
import { FadeIn, MagneticButton, TiltCard, StaggerChildren, StaggerItem, TextReveal, Parallax } from "@/components/animations";

/* ------------------------------------------------------------------ */
/*  Animated counter (scroll-triggered)                                */
/* ------------------------------------------------------------------ */

function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  className,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, count, target]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return unsubscribe;
  }, [rounded]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature data                                                       */
/* ------------------------------------------------------------------ */

const featureSections = [
  {
    icon: Target,
    title: "Routing ABC/XYZ Intelligent",
    description: "Allocation dynamique des ressources selon la valeur business de chaque produit. Classification automatique selon contribution CA (ABC) et régularité des ventes (XYZ).",
    benefits: [
      "Classe A (Top 20% CA) : jusqu'à 30 méthodes, 5 étapes de validation",
      "Classe B (30% suivants) : jusqu'à 20 méthodes, 3 étapes de validation",
      "Classe C (50% restants) : jusqu'à 10 méthodes, 2 étapes de validation",
      "Impact : ~60% réduction temps de calcul vs méthode classique",
    ],
    gradient: "from-rose-500 to-pink-500",
    metric: 60,
    metricSuffix: "%",
    metricLabel: "plus rapide",
    visual: "routing",
  },
  {
    icon: Brain,
    title: "Jusqu'à 24 méthodes de calcul en 3 packs",
    description: "Une bibliothèque complète organisée en 3 packs progressifs : Standard (17 méthodes statistiques), ML (+5 méthodes d'apprentissage), Premium (+IA avancée).",
    benefits: [
      "Standard : 17 méthodes statistiques éprouvées pour tout type de produit",
      "ML : méthodes d'apprentissage automatique (75% de précision sur ventes régulières)",
      "Premium : prévision IA avancée + combinaison automatique des meilleures approches",
      "Sélection automatique de la meilleure méthode par validation sur votre historique",
    ],
    gradient: "from-indigo-500 to-violet-500",
    metric: 24,
    metricSuffix: "",
    metricLabel: "méthodes",
    visual: "models",
  },
  {
    icon: Shield,
    title: "Validation multi-étapes sur historique",
    description: "Chaque prévision est validée par des tests progressifs sur votre historique réel (jusqu'à 5 étapes pour les produits stratégiques). Optimisation intelligente : évite de recalculer si vos données n'ont pas évolué.",
    benefits: [
      "Indicateurs : Score de fiabilité, Erreur pondérée, Erreur moyenne, Biais de prévision",
      "Optimisation intelligente : 60-70% plus rapide sur produits à ventes régulières",
      "Détection automatique des changements de tendance entre analyses",
      "Fourchette de prévision calibrée sur votre historique réel",
    ],
    gradient: "from-emerald-500 to-cyan-500",
    metric: 5,
    metricSuffix: "x",
    metricLabel: "validation",
    visual: "backtesting",
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
    metric: 6,
    metricSuffix: "",
    metricLabel: "fichiers",
    visual: "artifacts",
  },
];

const keyStats = [
  { value: 60, suffix: "%", label: "Réduction temps de calcul", icon: Clock },
  { value: 24, suffix: "", label: "Méthodes de calcul", icon: Cpu },
  { value: 5, suffix: "x", label: "Étapes de validation", icon: Shield },
  { value: 6, suffix: "", label: "Fichiers par analyse", icon: FileText },
];

/* ------------------------------------------------------------------ */
/*  Bento feature visual — animated mini diagrams                      */
/* ------------------------------------------------------------------ */

function FeatureVisual({ type, gradient }: { type: string; gradient: string }) {
  if (type === "routing") {
    /* ABC/XYZ routing matrix — shows compute budget allocation */
    const matrixCells = [
      /* row A (top revenue) */
      { abc: "A", xyz: "X", models: 30, folds: 5, intensity: 1.0 },
      { abc: "A", xyz: "Y", models: 30, folds: 5, intensity: 0.9 },
      { abc: "A", xyz: "Z", models: 30, folds: 5, intensity: 0.85 },
      /* row B */
      { abc: "B", xyz: "X", models: 20, folds: 3, intensity: 0.6 },
      { abc: "B", xyz: "Y", models: 20, folds: 3, intensity: 0.5 },
      { abc: "B", xyz: "Z", models: 20, folds: 3, intensity: 0.45 },
      /* row C (long tail) */
      { abc: "C", xyz: "X", models: 10, folds: 2, intensity: 0.3 },
      { abc: "C", xyz: "Y", models: 10, folds: 2, intensity: 0.25 },
      { abc: "C", xyz: "Z", models: 10, folds: 2, intensity: 0.2 },
    ];

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-1">
        {/* Column headers — XYZ (volatility) */}
        <div className="grid grid-cols-[28px_1fr_1fr_1fr] gap-1 w-full max-w-[220px]">
          <div />
          {["X", "Y", "Z"].map((col) => (
            <div key={col} className="text-center">
              <span className="text-[9px] font-display font-600 text-zinc-500 uppercase tracking-wider">{col}</span>
            </div>
          ))}
        </div>

        {/* Matrix grid */}
        {(["A", "B", "C"] as const).map((row, rowIdx) => (
          <div key={row} className="grid grid-cols-[28px_1fr_1fr_1fr] gap-1 w-full max-w-[220px]">
            {/* Row label */}
            <div className="flex items-center justify-center">
              <span className="text-[10px] font-display font-700 text-zinc-400">{row}</span>
            </div>
            {/* Cells */}
            {matrixCells
              .filter((c) => c.abc === row)
              .map((cell, colIdx) => (
                <motion.div
                  key={`${cell.abc}${cell.xyz}`}
                  className="relative aspect-square rounded-lg flex flex-col items-center justify-center cursor-default group/cell"
                  style={{
                    background: `rgba(244, 63, 94, ${cell.intensity * 0.35})`,
                    border: `1px solid rgba(244, 63, 94, ${cell.intensity * 0.25})`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + rowIdx * 0.12 + colIdx * 0.08,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  whileHover={{ scale: 1.08 }}
                >
                  <span className="text-[11px] font-display font-800 text-white leading-none">
                    {cell.models}
                  </span>
                  <span className="text-[7px] text-white/50 font-medium mt-0.5">
                    {cell.folds}‑fold
                  </span>
                </motion.div>
              ))}
          </div>
        ))}

        {/* Axis labels */}
        <div className="flex items-center justify-between w-full max-w-[220px] mt-1 px-7">
          <span className="text-[7px] text-zinc-600 font-display">Stable</span>
          <span className="text-[7px] text-zinc-600 font-display italic">Volatilité →</span>
          <span className="text-[7px] text-zinc-600 font-display">Erratique</span>
        </div>
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
          <span className="text-[7px] text-zinc-600 font-display italic">← Valeur CA</span>
        </div>
      </div>
    );
  }

  if (type === "models") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-6 h-6 rounded-md ${
                i < 17
                  ? "bg-zinc-500/40 border border-zinc-500/30"
                  : i < 22
                  ? "bg-indigo-500/40 border border-indigo-500/30"
                  : "bg-amber-500/40 border border-amber-500/30"
              }`}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.04, type: "spring", stiffness: 200 }}
            />
          ))}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 text-[10px]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-zinc-500/60" /> Stats</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-indigo-500/60" /> ML</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-500/60" /> Premium</span>
        </div>
      </div>
    );
  }

  if (type === "backtesting") {
    /* Temporal cross-validation — expanding window diagram */
    const folds = [
      { id: 1, trainPct: 40, testPct: 15 },
      { id: 2, trainPct: 50, testPct: 15 },
      { id: 3, trainPct: 60, testPct: 15 },
      { id: 4, trainPct: 70, testPct: 15 },
      { id: 5, trainPct: 80, testPct: 15 },
    ];

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-0">
        {/* Timeline arrow */}
        <div className="w-full max-w-[230px] flex items-center mb-2 px-1">
          <div className="flex-1 h-px bg-zinc-700" />
          <span className="text-[8px] text-zinc-500 font-display ml-1">temps →</span>
        </div>

        {/* Folds */}
        <div className="flex flex-col gap-[5px] w-full max-w-[230px]">
          {folds.map((fold) => (
            <div key={fold.id} className="flex items-center gap-1.5">
              {/* Fold label */}
              <span className="text-[8px] font-display font-600 text-zinc-500 w-5 shrink-0 text-right">
                F{fold.id}
              </span>

              {/* Train + Test bar */}
              <div className="flex-1 flex items-center h-[18px] rounded-md overflow-hidden bg-zinc-800/50">
                {/* Training portion — expanding */}
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600/60 to-emerald-500/40 flex items-center justify-center"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${fold.trainPct}%` }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + (fold.id - 1) * 0.12,
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                >
                  {fold.id >= 3 && (
                    <span className="text-[7px] text-emerald-200/70 font-display font-600 whitespace-nowrap">
                      Train
                    </span>
                  )}
                </motion.div>

                {/* Cutoff line */}
                <div className="w-px h-full bg-white/30 shrink-0" />

                {/* Test portion — fixed width */}
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500/50 to-cyan-400/30 flex items-center justify-center"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${fold.testPct}%` }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.5 + (fold.id - 1) * 0.12,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <span className="text-[7px] text-cyan-200/70 font-display font-600 whitespace-nowrap">
                    Test
                  </span>
                </motion.div>

                {/* Remaining (future) */}
                <div className="flex-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2.5">
          <span className="flex items-center gap-1.5 text-[8px] text-zinc-500 font-display">
            <span className="w-3 h-2 rounded-sm bg-emerald-500/50" />
            Historique (train)
          </span>
          <span className="flex items-center gap-1.5 text-[8px] text-zinc-500 font-display">
            <span className="w-3 h-2 rounded-sm bg-cyan-500/40" />
            Validation (test)
          </span>
        </div>
      </div>
    );
  }

  // artifacts
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-3 gap-2">
        {["CSV", "JSON", "REG", "INS", "MAN", "LLM"].map((label, i) => (
          <motion.div
            key={label}
            className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
          >
            <span className="text-[10px] font-display font-600 text-amber-400/80">{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-8%] w-[400px] h-[400px] rounded-full bg-violet-500/6 blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20">
        {/* ============================================ */}
        {/*  HERO — Immersive with TextReveal             */}
        {/* ============================================ */}
        <section className="relative py-28 md:py-36 px-6 overflow-hidden">
          {/* Gradient mesh */}
          <div className="absolute inset-0 gradient-mesh pointer-events-none" />
          {/* Light beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] light-beam opacity-30 pointer-events-none" />

          <div className="relative max-w-[1200px] mx-auto text-center">
            <FadeIn>
              <motion.div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/8 border border-indigo-500/15 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-zinc-300 font-medium">Fonctionnalités</span>
              </motion.div>
            </FadeIn>

            <h1 className="font-display tracking-[-0.03em] leading-[0.92] mb-8">
              <motion.span
                className="block text-5xl md:text-6xl lg:text-[5rem] font-300 text-zinc-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                Tout ce qu&apos;il faut
              </motion.span>
              <motion.span
                className="block text-5xl md:text-6xl lg:text-[5rem] font-800 text-gradient-brand mt-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                pour prévoir juste
              </motion.span>
            </h1>

            <FadeIn delay={0.5}>
              <p className="text-lg md:text-xl text-zinc-400 max-w-[680px] mx-auto font-light leading-relaxed">
                Une suite complète d&apos;outils de prévision professionnels,
                conçue pour les PME e-commerce qui veulent des résultats fiables.
              </p>
            </FadeIn>

            {/* Scroll hint */}
            <FadeIn delay={0.8}>
              <motion.div
                className="mt-16 flex justify-center"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-6 h-10 rounded-full border-2 border-white/15 flex justify-center pt-2">
                  <motion.div
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================ */}
        {/*  KEY STATS — Animated counters                */}
        {/* ============================================ */}
        <section className="relative py-20 px-6 section-glow-top">
          <div className="max-w-[1200px] mx-auto">
            <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {keyStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <StaggerItem key={stat.label}>
                    <div className="relative group p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500">
                      {/* Subtle glow on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-indigo-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                          <Icon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="text-4xl md:text-5xl font-display font-800 text-white tracking-[-0.04em] mb-2">
                          <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                        </div>
                        <p className="text-sm text-zinc-500 font-medium">{stat.label}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* ============================================ */}
        {/*  FEATURE BENTO GRID                           */}
        {/* ============================================ */}
        <section className="py-20 px-6">
          <div className="max-w-[1200px] mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                  En détail
                </p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-800 text-white tracking-[-0.03em]">
                  Quatre piliers, une précision
                </h2>
              </div>
            </FadeIn>

            <div className="space-y-12">
              {featureSections.map((feature, index) => {
                const Icon = feature.icon;
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    {/* Content card */}
                    <div className={`lg:col-span-7 ${!isEven ? "lg:order-2" : ""}`}>
                      <div className="relative h-full p-8 md:p-10 rounded-2xl bg-zinc-900/30 border border-white/[0.05] hover:border-white/[0.08] transition-all duration-500 group">
                        {/* Gradient accent line top */}
                        <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${feature.gradient} opacity-20`} />

                        {/* Section number watermark */}
                        <div className="absolute top-4 right-6 font-display text-7xl font-800 text-white/[0.02] select-none pointer-events-none leading-none">
                          0{index + 1}
                        </div>

                        <div className="relative">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-6`}>
                            <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-display font-800 text-white mb-4 tracking-tight">
                            {feature.title}
                          </h3>
                          <p className="text-zinc-400 leading-relaxed mb-8 font-light">
                            {feature.description}
                          </p>

                          <div className="space-y-3">
                            {feature.benefits.map((b, i) => (
                              <motion.div
                                key={i}
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                              >
                                <Check size={16} className="text-emerald-500 mt-1 shrink-0" />
                                <span className="text-sm text-zinc-400">{b}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual card */}
                    <div className={`lg:col-span-5 ${!isEven ? "lg:order-1" : ""}`}>
                      <TiltCard className="h-full">
                        <div className="relative h-full min-h-[300px] rounded-2xl bg-zinc-900/30 border border-white/[0.05] overflow-hidden flex items-center justify-center p-8">
                          {/* Background gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-[0.04]`} />

                          {/* Animated visual */}
                          <div className="relative w-full h-48">
                            <FeatureVisual type={feature.visual} gradient={feature.gradient} />
                          </div>

                          {/* Metric badge */}
                          <div className="absolute bottom-6 right-6">
                            <motion.div
                              className={`px-4 py-2 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 border border-white/[0.08]`}
                              initial={{ scale: 0.8, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                            >
                              <span className="text-2xl font-display font-800 text-white">
                                <AnimatedCounter target={feature.metric} suffix={feature.metricSuffix} />
                              </span>
                              <span className="text-xs text-zinc-400 ml-2 font-display font-600 uppercase tracking-wider">
                                {feature.metricLabel}
                              </span>
                            </motion.div>
                          </div>
                        </div>
                      </TiltCard>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/*  WORKFLOW SECTION                             */}
        {/* ============================================ */}
        <section className="relative py-24 px-6 section-glow-top overflow-hidden">
          <div className="absolute inset-0 bg-zinc-925 pointer-events-none" />
          <div className="relative max-w-[1200px] mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                  Comment ça marche
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-800 text-white tracking-[-0.03em]">
                  De l&apos;import à la prévision en 3 étapes
                </h2>
              </div>
            </FadeIn>

            <StaggerChildren className="grid md:grid-cols-3 gap-6" staggerDelay={0.15}>
              {[
                {
                  step: "01",
                  title: "Importez vos ventes",
                  desc: "Un simple CSV avec dates et quantités. Notre moteur détecte automatiquement le format, la fréquence et les séries.",
                  icon: TrendingUp,
                  gradient: "from-indigo-500 to-blue-500",
                },
                {
                  step: "02",
                  title: "Laissez tourner",
                  desc: "Le moteur teste jusqu'à 24 méthodes par produit, sélectionne la meilleure par validation sur historique et génère la synthèse IA.",
                  icon: Cpu,
                  gradient: "from-violet-500 to-purple-500",
                },
                {
                  step: "03",
                  title: "Agissez",
                  desc: "Consultez vos prévisions, alertes stock et recommandations. Exportez pour votre ERP ou partagez avec votre équipe.",
                  icon: BarChart3,
                  gradient: "from-emerald-500 to-teal-500",
                },
              ].map((step) => {
                const StepIcon = step.icon;
                return (
                  <StaggerItem key={step.step}>
                    <div className="relative group h-full p-8 rounded-2xl bg-zinc-900/30 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500">
                      <div className="absolute top-4 right-6 font-display text-6xl font-800 text-white/[0.03] select-none pointer-events-none leading-none">
                        {step.step}
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} p-[1px] mb-6`}>
                        <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center">
                          <StepIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-display font-700 text-white mb-3">{step.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed font-light">{step.desc}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* ============================================ */}
        {/*  CTA FINAL — Gradient mesh                    */}
        {/* ============================================ */}
        <section className="relative py-28 px-6 overflow-hidden">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 gradient-mesh pointer-events-none" />
          <div className="absolute inset-0 bg-hex-pattern opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

          <div className="relative max-w-[800px] mx-auto text-center">
            <FadeIn>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-800 text-white tracking-[-0.03em] leading-[0.95] mb-6">
                Prêt à améliorer
                <br />
                <span className="text-gradient-brand">vos prévisions ?</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-lg text-zinc-400 font-light mb-10 max-w-[500px] mx-auto">
                Essai gratuit 3 mois, sans engagement.
                Vos données restent les vôtres.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login?mode=signup">
                  <MagneticButton className="group px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold text-white glow-pulse shimmer transition-all">
                    <span className="flex items-center gap-2">
                      Essai gratuit 3 mois
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </span>
                  </MagneticButton>
                </Link>
                <Link href="/pricing">
                  <MagneticButton className="px-8 py-4 bg-white/[0.04] hover:bg-white/[0.07] rounded-xl font-semibold text-white border border-white/[0.08] transition-all">
                    Voir les tarifs
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
