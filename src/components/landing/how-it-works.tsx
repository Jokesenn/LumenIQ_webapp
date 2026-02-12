"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Upload, Settings, Cpu, BarChart3 } from "lucide-react";
import { FadeIn, MagneticButton } from "@/components/animations";
import type { LucideIcon } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Upload CSV",
    description:
      "Glissez votre fichier historique. Détection automatique des colonnes dates et valeurs.",
    icon: Upload,
  },
  {
    number: 2,
    title: "Configuration auto",
    description:
      "Fréquence, saisonnalité, classification ABC/XYZ détectées sans intervention.",
    icon: Settings,
  },
  {
    number: 3,
    title: "Calcul (2-5 min)",
    description:
      "Jusqu'à 24 modèles en compétition, validation automatique sur votre historique, sélection du meilleur pour chaque produit.",
    icon: Cpu,
  },
  {
    number: 4,
    title: "Résultats",
    description:
      "Dashboard interactif, scores de précision par produit, export ZIP complet (Excel + PDF).",
    icon: BarChart3,
  },
];

function TimelineStep({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      className="relative flex flex-col items-center text-center group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.3, duration: 0.5 }}
    >
      {/* Circle node */}
      <motion.div
        className="relative z-10 w-12 h-12 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-6"
        whileInView={{ borderColor: "#6366f1" }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.3 + 0.5 }}
      >
        <span className="text-lg font-bold text-indigo-400">{step.number}</span>
      </motion.div>

      {/* Step icon */}
      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
        <step.icon className="w-5 h-5 text-indigo-400" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed max-w-[220px]">
        {step.description}
      </p>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-label="Comment ça marche"
      className="relative py-24 overflow-hidden bg-zinc-925 section-glow-top"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header with numbered pattern */}
        <div className="text-center mb-14">
          <FadeIn>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-7xl font-bold text-indigo-500/10 select-none">
                03
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gradient">
                De l&apos;upload au forecast :
              </span>
              <br />
              <span className="text-white">5 minutes chrono</span>
            </h2>
          </FadeIn>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-zinc-800 rounded-full">
            {/* Animated fill that progresses when section enters view */}
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 origin-left rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <TimelineStep key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* CTA après les étapes */}
        <FadeIn delay={0.7}>
          <div className="mt-12 text-center">
            <Link href="/login?mode=signup">
              <MagneticButton className="group px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold text-white transition-all duration-300 glow-pulse shimmer">
                <span className="flex items-center gap-2">
                  Lancer mon premier forecast
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </span>
              </MagneticButton>
            </Link>
            <p className="mt-3 text-sm text-zinc-300">
              Aucune carte bancaire requise · Essai gratuit 3 mois
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
