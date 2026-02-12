"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import {
  Play,
  Upload,
  BarChart3,
  Sparkles,
  Download,
  ArrowRight,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  FileSpreadsheet,
  Brain,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Navbar, Footer } from "@/components/shared";
import { FadeIn, MagneticButton, TiltCard, StaggerChildren, StaggerItem, TextReveal } from "@/components/animations";

const highlights = [
  {
    icon: Upload,
    title: "Import instantane",
    description:
      "Glissez votre fichier CSV ou Excel. LumenIQ détecte automatiquement le format, la fréquence et les séries.",
    metric: "30s",
  },
  {
    icon: BarChart3,
    title: "21 modèles en competition",
    description:
      "Chaque série est analysee par jusqu\u2019a 21 modèles statistiques et ML. Le champion est selectionne par validation croisee.",
    metric: "21",
  },
  {
    icon: Sparkles,
    title: "Synthese intelligente",
    description:
      "Un rapport exécutif en français résumé vos résultats, identifie les alertes et propose des actions concrètes.",
    metric: "IA",
  },
  {
    icon: Download,
    title: "Export complet",
    description:
      "Téléchargez vos prévisions, métriques et rapports au format CSV et PDF, prêts pour votre ERP ou BI.",
    metric: "ZIP",
  },
];

/* ------------------------------------------------
   Product Tour steps
   ------------------------------------------------ */
const tourSteps = [
  {
    step: 1,
    icon: FileSpreadsheet,
    accentColor: "indigo",
    title: "Importez vos données",
    subtitle: "30 secondes",
    description:
      "Glissez-déposez votre fichier CSV ou Excel. LumenIQ détecte automatiquement le format, la fréquence et les séries temporelles. Aucune preparation préalable requise.",
    features: [
      "Detection automatique du format",
      "Support CSV, XLSX, XLS",
      "Validation instantanée des données",
    ],
    visual: "import",
  },
  {
    step: 2,
    icon: Brain,
    accentColor: "violet",
    title: "Analyse automatique",
    subtitle: "2-5 minutes",
    description:
      "21 modèles statistiques et ML sont mis en competition sur chaque série. Le meilleur champion est selectionne par backtesting et validation croisee.",
    features: [
      "21 modèles en competition",
      "Selection par backtesting",
      "Classification ABC/XYZ",
    ],
    visual: "analysis",
  },
  {
    step: 3,
    icon: Target,
    accentColor: "emerald",
    title: "Résultats détaillés",
    subtitle: "Instantane",
    description:
      "Consultez vos prévisions série par série avec scores de fiabilité, intervalles de confiance et alertes intelligentes. Un rapport de synthèse IA résumé les points clés.",
    features: [
      "Score de fiabilité par série",
      "Synthese IA en français",
      "Alertes et recommandations",
    ],
    visual: "results",
  },
  {
    step: 4,
    icon: Zap,
    accentColor: "amber",
    title: "Actions concrètes",
    subtitle: "Pret a agir",
    description:
      "LumenIQ genere des recommandations actionnables : reapprovisionnements urgents, alertes de stock, optimisations identifiees. Exportez tout en CSV et PDF.",
    features: [
      "Actions priorisees automatiquement",
      "Export CSV et PDF complet",
      "Integration ERP/BI possible",
    ],
    visual: "actions",
  },
];

/* ------------------------------------------------
   Step visual mockup component
   ------------------------------------------------ */
function StepVisual({ visual, accentColor }: { visual: string; accentColor: string }) {
  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    indigo: {
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      text: "text-indigo-400",
      glow: "bg-indigo-500/8",
    },
    violet: {
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      text: "text-violet-400",
      glow: "bg-violet-500/8",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      glow: "bg-emerald-500/8",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      glow: "bg-amber-500/8",
    },
  };

  const c = colorMap[accentColor] || colorMap.indigo;

  return (
    <div className="relative rounded-2xl border border-white/[0.05] bg-zinc-900/30 p-6 aspect-[4/3] overflow-hidden">
      {/* Background glow */}
      <div className={`absolute inset-0 ${c.glow} opacity-30 blur-3xl`} />
      <div className="absolute inset-0 bg-hex-pattern opacity-10" />

      {/* Visual content based on step */}
      <div className="relative z-10 h-full flex flex-col">
        {visual === "import" && (
          <>
            {/* File upload mockup */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                className="w-full max-w-[240px] border-2 border-dashed border-indigo-500/30 rounded-xl p-8 flex flex-col items-center gap-4"
                animate={{ borderColor: ["rgba(99,102,241,0.3)", "rgba(99,102,241,0.6)", "rgba(99,102,241,0.3)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Upload className="w-10 h-10 text-indigo-400/60" />
                </motion.div>
                <div className="text-center">
                  <p className="text-sm text-zinc-300 font-medium">ventes_2024.csv</p>
                  <p className="text-xs text-zinc-600 mt-1">847 lignes détectées</p>
                </div>
              </motion.div>
            </div>
            {/* Progress bar */}
            <div className="mt-auto">
              <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">Detection du format...</p>
            </div>
          </>
        )}

        {visual === "analysis" && (
          <>
            {/* Model competition mockup */}
            <div className="flex-1 space-y-3">
              {[
                { name: "Holt-Winters", score: 94, width: "94%", delay: 0.3 },
                { name: "ARIMA", score: 91, width: "91%", delay: 0.5 },
                { name: "ETS", score: 88, width: "88%", delay: 0.7 },
                { name: "Theta", score: 85, width: "85%", delay: 0.9 },
                { name: "Prophet", score: 82, width: "82%", delay: 1.1 },
              ].map((model) => (
                <motion.div
                  key={model.name}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: model.delay, duration: 0.4 }}
                >
                  <span className="text-xs text-zinc-400 w-24 shrink-0 font-mono">{model.name}</span>
                  <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500/60 to-violet-400/60"
                      initial={{ width: "0%" }}
                      whileInView={{ width: model.width }}
                      viewport={{ once: true }}
                      transition={{ delay: model.delay + 0.2, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-zinc-300 font-mono w-8 text-right">{model.score}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/8 border border-violet-500/15">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
              <span className="text-xs text-violet-300">Champion : Holt-Winters (94/100)</span>
            </div>
          </>
        )}

        {visual === "results" && (
          <>
            {/* Results dashboard mockup */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              <motion.div
                className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 flex flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Fiabilite</p>
                <p className="text-2xl font-display font-800 text-emerald-400 mt-2">94.2</p>
                <p className="text-[10px] text-zinc-600">/100</p>
              </motion.div>
              <motion.div
                className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 flex flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Series</p>
                <p className="text-2xl font-display font-800 text-white mt-2">847</p>
                <p className="text-[10px] text-zinc-600">analysees</p>
              </motion.div>
              <motion.div
                className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 flex flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Alertes</p>
                <p className="text-2xl font-display font-800 text-amber-400 mt-2">12</p>
                <p className="text-[10px] text-zinc-600">a surveiller</p>
              </motion.div>
              <motion.div
                className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 flex flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Modeles</p>
                <p className="text-2xl font-display font-800 text-indigo-400 mt-2">21</p>
                <p className="text-[10px] text-zinc-600">testes</p>
              </motion.div>
            </div>
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-300">Synthese IA generee</span>
            </div>
          </>
        )}

        {visual === "actions" && (
          <>
            {/* Actions list mockup */}
            <div className="flex-1 space-y-3">
              {[
                { priority: "urgent", text: "Reapprovisionner SKU-2847 avant le 15 mars", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/15" },
                { priority: "warning", text: "Stock excessif détecte sur 3 references", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/15" },
                { priority: "info", text: "Tendance haussiere sur la categorie A", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/15" },
              ].map((action, i) => (
                <motion.div
                  key={i}
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl ${action.bg} border ${action.border}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.2, duration: 0.4 }}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${action.color.replace("text-", "bg-")}`} />
                  <p className={`text-xs ${action.color} leading-relaxed`}>{action.text}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <div className="flex-1 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">Export CSV</span>
              </div>
              <div className="flex-1 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">Export PDF</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------
   Interactive timeline step
   ------------------------------------------------ */
function TimelineStep({
  step,
  isActive,
  onClick,
  accentColor,
}: {
  step: typeof tourSteps[0];
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
}) {
  const colorMap: Record<string, { active: string; ring: string; text: string }> = {
    indigo: { active: "bg-indigo-500", ring: "ring-indigo-500/30", text: "text-indigo-400" },
    violet: { active: "bg-violet-500", ring: "ring-violet-500/30", text: "text-violet-400" },
    emerald: { active: "bg-emerald-500", ring: "ring-emerald-500/30", text: "text-emerald-400" },
    amber: { active: "bg-amber-500", ring: "ring-amber-500/30", text: "text-amber-400" },
  };

  const c = colorMap[accentColor] || colorMap.indigo;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-300 text-left w-full ${
        isActive
          ? `bg-white/[0.04] border-white/[0.08] ring-2 ${c.ring}`
          : "bg-transparent border-transparent hover:bg-white/[0.02]"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
          isActive ? `${c.active} text-white shadow-lg` : "bg-white/[0.04] text-zinc-500"
        }`}
      >
        <span className="text-sm font-display font-800">{step.step}</span>
      </div>
      <div>
        <p className={`text-sm font-display font-700 transition-colors duration-300 ${isActive ? "text-white" : "text-zinc-400"}`}>
          {step.title}
        </p>
        <p className={`text-xs mt-0.5 transition-colors duration-300 ${isActive ? c.text : "text-zinc-600"}`}>
          {step.subtitle}
        </p>
      </div>
      <ChevronRight className={`w-4 h-4 ml-auto transition-all duration-300 ${isActive ? `${c.text} translate-x-1` : "text-zinc-700"}`} />
    </button>
  );
}

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const tourRef = useRef(null);
  const isTourInView = useInView(tourRef, { once: false, margin: "-200px" });

  // Auto-advance steps when in view
  useEffect(() => {
    if (!autoPlay || !isTourInView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % tourSteps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, isTourInView]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setAutoPlay(false);
  };

  const currentStep = tourSteps[activeStep];

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/6 blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20">
        {/* =============================================
            HERO SECTION
            ============================================= */}
        <section className="py-24 px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <FadeIn>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Play className="w-4 h-4 text-indigo-400" />
                </motion.div>
                <span className="text-sm text-zinc-300 font-display">Visite guidée du produit</span>
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-800 tracking-[-0.03em] leading-[0.95] text-white mb-6">
                Découvrez
                <br />
                <span className="text-gradient-brand">LumenIQ</span>
                <br />
                <span className="font-300 text-zinc-400">en action</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg text-zinc-400 max-w-[600px] mx-auto font-light leading-relaxed">
                De l&apos;import de votre fichier aux prévisions détaillées :
                voyez comment LumenIQ transforme vos données en decisions
                d&apos;approvisionnement fiables en quelques minutes.
              </p>
            </FadeIn>

            {/* Scroll indicator */}
            <FadeIn delay={0.4}>
              <motion.div
                className="mt-12 flex flex-col items-center gap-2"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs text-zinc-600 uppercase tracking-wider">Explorez le workflow</span>
                <div className="w-px h-8 bg-gradient-to-b from-indigo-500/40 to-transparent" />
              </motion.div>
            </FadeIn>
          </div>
        </section>

        {/* =============================================
            PRODUCT TOUR — Interactive Timeline
            ============================================= */}
        <section ref={tourRef} className="py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <FadeIn>
              <div className="mb-16 text-center">
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                  Product Tour
                </p>
                <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-[-0.03em] text-white">
                  4 étapes vers des prévisions fiables
                </h2>
                <p className="text-zinc-400 mt-4 max-w-[500px] mx-auto font-light">
                  Un workflow entièrement automatisé, de l&apos;import a l&apos;action.
                </p>
              </div>
            </FadeIn>

            {/* Interactive tour layout */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left — Timeline navigation */}
              <FadeIn delay={0.2} className="lg:col-span-4">
                <div className="space-y-2 lg:sticky lg:top-28">
                  {tourSteps.map((step, index) => (
                    <TimelineStep
                      key={step.step}
                      step={step}
                      isActive={activeStep === index}
                      onClick={() => handleStepClick(index)}
                      accentColor={step.accentColor}
                    />
                  ))}

                  {/* Progress indicator */}
                  <div className="mt-6 px-5">
                    <div className="flex gap-2">
                      {tourSteps.map((_, index) => (
                        <div key={index} className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          {index === activeStep && autoPlay ? (
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 5, ease: "linear" }}
                              key={`progress-${activeStep}-${Date.now()}`}
                            />
                          ) : (
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                index <= activeStep
                                  ? "w-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                  : "w-0"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {autoPlay && (
                      <button
                        onClick={() => setAutoPlay(false)}
                        className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mt-3"
                      >
                        Mettre en pause
                      </button>
                    )}
                    {!autoPlay && (
                      <button
                        onClick={() => setAutoPlay(true)}
                        className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mt-3"
                      >
                        Lecture auto
                      </button>
                    )}
                  </div>
                </div>
              </FadeIn>

              {/* Right — Content panel */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Visual mockup */}
                      <TiltCard>
                        <StepVisual visual={currentStep.visual} accentColor={currentStep.accentColor} />
                      </TiltCard>

                      {/* Text content */}
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            currentStep.accentColor === "indigo" ? "bg-indigo-500/15 text-indigo-400" :
                            currentStep.accentColor === "violet" ? "bg-violet-500/15 text-violet-400" :
                            currentStep.accentColor === "emerald" ? "bg-emerald-500/15 text-emerald-400" :
                            "bg-amber-500/15 text-amber-400"
                          }`}>
                            <currentStep.icon className="w-5 h-5" />
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span className="text-xs text-zinc-400">{currentStep.subtitle}</span>
                          </div>
                        </div>

                        <h3 className="font-display text-2xl font-800 text-white mb-4">
                          {currentStep.title}
                        </h3>

                        <p className="text-sm text-zinc-400 leading-relaxed font-light mb-6">
                          {currentStep.description}
                        </p>

                        <ul className="space-y-3">
                          {currentStep.features.map((feature, i) => (
                            <motion.li
                              key={feature}
                              className="flex items-center gap-3 text-sm"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + i * 0.1 }}
                            >
                              <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                                currentStep.accentColor === "indigo" ? "text-indigo-400" :
                                currentStep.accentColor === "violet" ? "text-violet-400" :
                                currentStep.accentColor === "emerald" ? "text-emerald-400" :
                                "text-amber-400"
                              }`} />
                              <span className="text-zinc-300">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================
            BENTO GRID — Creative highlights
            ============================================= */}
        <section className="py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <FadeIn>
              <div className="mb-16">
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                  Apercu
                </p>
                <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-[-0.03em] text-white">
                  Ce que vous verrez
                </h2>
                <p className="text-zinc-400 mt-4 max-w-[500px] font-light">
                  Quatre étapes clés qui transforment votre historique de ventes
                  en prévisions actionnables.
                </p>
              </div>
            </FadeIn>

            {/* Bento layout — asymmetric */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Card 1 — Large (spans 7 cols) */}
              <FadeIn delay={0.1} className="lg:col-span-7">
                <TiltCard className="h-full">
                  <motion.div
                    className="relative rounded-2xl border border-white/[0.05] bg-zinc-900/30 p-8 h-full group overflow-hidden min-h-[220px]"
                    whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.2)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="absolute top-4 right-6 text-6xl font-display font-800 text-white/[0.03] group-hover:text-indigo-500/[0.06] transition-colors duration-500">
                      {highlights[0].metric}
                    </div>
                    <div className="relative z-10 max-w-[400px]">
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 group-hover:bg-indigo-500/15 transition-colors">
                        <Upload className="w-5 h-5 text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-display font-700 text-white mb-3">
                        {highlights[0].title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed font-light">
                        {highlights[0].description}
                      </p>
                    </div>
                    {/* Decorative gradient corner */}
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-indigo-500/[0.06] to-transparent rounded-tl-[80px]" />
                  </motion.div>
                </TiltCard>
              </FadeIn>

              {/* Card 2 — Medium (spans 5 cols) */}
              <FadeIn delay={0.2} className="lg:col-span-5">
                <TiltCard className="h-full">
                  <motion.div
                    className="relative rounded-2xl border border-white/[0.05] bg-zinc-900/30 p-8 h-full group overflow-hidden min-h-[220px]"
                    whileHover={{ y: -4, borderColor: "rgba(139, 92, 246, 0.2)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="absolute top-4 right-6 text-6xl font-display font-800 text-white/[0.03] group-hover:text-violet-500/[0.06] transition-colors duration-500">
                      {highlights[1].metric}
                    </div>
                    <div className="relative z-10">
                      <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center mb-5 group-hover:bg-violet-500/15 transition-colors">
                        <BarChart3 className="w-5 h-5 text-violet-400" />
                      </div>
                      <h3 className="text-xl font-display font-700 text-white mb-3">
                        {highlights[1].title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed font-light">
                        {highlights[1].description}
                      </p>
                    </div>
                  </motion.div>
                </TiltCard>
              </FadeIn>

              {/* Card 3 — Medium (spans 5 cols) */}
              <FadeIn delay={0.3} className="lg:col-span-5">
                <TiltCard className="h-full">
                  <motion.div
                    className="relative rounded-2xl border border-white/[0.05] bg-zinc-900/30 p-8 h-full group overflow-hidden min-h-[220px]"
                    whileHover={{ y: -4, borderColor: "rgba(16, 185, 129, 0.2)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="absolute top-4 right-6 text-6xl font-display font-800 text-white/[0.03] group-hover:text-emerald-500/[0.06] transition-colors duration-500">
                      {highlights[2].metric}
                    </div>
                    <div className="relative z-10">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/15 transition-colors">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-display font-700 text-white mb-3">
                        {highlights[2].title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed font-light">
                        {highlights[2].description}
                      </p>
                    </div>
                  </motion.div>
                </TiltCard>
              </FadeIn>

              {/* Card 4 — Large (spans 7 cols) */}
              <FadeIn delay={0.4} className="lg:col-span-7">
                <TiltCard className="h-full">
                  <motion.div
                    className="relative rounded-2xl border border-white/[0.05] bg-zinc-900/30 p-8 h-full group overflow-hidden min-h-[220px]"
                    whileHover={{ y: -4, borderColor: "rgba(245, 158, 11, 0.2)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="absolute top-4 right-6 text-6xl font-display font-800 text-white/[0.03] group-hover:text-amber-500/[0.06] transition-colors duration-500">
                      {highlights[3].metric}
                    </div>
                    <div className="relative z-10 max-w-[400px]">
                      <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center mb-5 group-hover:bg-amber-500/15 transition-colors">
                        <Download className="w-5 h-5 text-amber-400" />
                      </div>
                      <h3 className="text-xl font-display font-700 text-white mb-3">
                        {highlights[3].title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed font-light">
                        {highlights[3].description}
                      </p>
                    </div>
                    {/* Decorative gradient corner */}
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-amber-500/[0.06] to-transparent rounded-tl-[80px]" />
                  </motion.div>
                </TiltCard>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* =============================================
            CTA SECTION — Dramatic gradient mesh
            ============================================= */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-indigo-950/20 to-zinc-950" />
            <div className="absolute inset-0 gradient-mesh opacity-80" />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/8 rounded-full blur-[160px]"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <div className="absolute inset-0 bg-hex-pattern opacity-20" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="font-display text-5xl sm:text-6xl font-800 tracking-[-0.03em] leading-[0.95] mb-8">
                <span className="text-white">Essayez</span>
                <br />
                <span className="text-gradient-brand">gratuitement</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-lg text-zinc-400 mb-10 max-w-[500px] mx-auto font-light">
                Essai gratuit 3 mois. Aucun engagement, aucune carte bancaire requise.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Link href="/login?mode=signup">
                <MagneticButton className="group inline-flex items-center gap-2 px-10 py-5 bg-white text-zinc-900 rounded-xl font-semibold text-base transition-all duration-300 hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]">
                  Creer mon compte gratuit
                  <motion.span className="group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </MagneticButton>
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
