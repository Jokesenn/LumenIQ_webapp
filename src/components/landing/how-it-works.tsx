"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Upload, Settings, Cpu, BarChart3 } from "lucide-react";
import { FadeIn, MagneticButton } from "@/components/animations";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Upload CSV",
    description: "Glissez votre fichier historique. Détection automatique des colonnes dates et valeurs.",
    icon: Upload,
    duration: "30 sec",
  },
  {
    number: 2,
    title: "Configuration auto",
    description: "Fréquence, saisonnalité, classification ABC/XYZ détectées sans intervention.",
    icon: Settings,
    duration: "Instant",
  },
  {
    number: 3,
    title: "Calcul",
    description: "Jusqu'à 24 modèles en compétition, validation automatique, sélection du meilleur pour chaque produit.",
    icon: Cpu,
    duration: "2-5 min",
  },
  {
    number: 4,
    title: "Résultats",
    description: "Dashboard interactif, scores de précision par produit, export ZIP complet (Excel + PDF).",
    icon: BarChart3,
    duration: "Prêt",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-label="Comment ça marche"
      className="relative py-28 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[var(--color-bg-surface)]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        {/* Section header */}
        <div className="relative mb-20">
          <div className="absolute -top-8 left-0 section-number">03</div>
          <div className="relative z-10 max-w-2xl">
            <FadeIn>
              <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-[var(--color-copper)] mb-4">
                Processus
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-[-0.03em] leading-[1.05]">
                <span className="text-gradient">De l&apos;upload au forecast :</span>
                <br />
                <span className="text-[var(--color-text)]">5 minutes chrono</span>
              </h2>
            </FadeIn>
          </div>
        </div>

        {/* Vertical alternating timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central vertical line */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-[var(--color-border)] hidden md:block">
            <motion.div
              className="w-full bg-[var(--color-copper)] origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{ height: "100%" }}
            />
          </div>

          <div className="space-y-16 md:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  className={`relative md:grid md:grid-cols-2 md:gap-16 ${i > 0 ? "md:mt-20" : ""}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  {/* Node on the center line */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-4 z-10">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-white border-2 border-[var(--color-border)] flex items-center justify-center"
                      whileInView={{ borderColor: "var(--color-copper)", backgroundColor: "var(--color-copper-bg)" }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.3 }}
                    >
                      <span className="text-lg font-display font-800 text-[var(--color-copper)]">{step.number}</span>
                    </motion.div>
                  </div>

                  {/* Content — alternates sides */}
                  <div className={cn(
                    "relative",
                    isLeft ? "md:text-right md:pr-16" : "md:col-start-2 md:pl-16"
                  )}>
                    {/* Mobile step number */}
                    <div className="md:hidden flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-copper-bg)] border border-[var(--color-border)] flex items-center justify-center">
                        <span className="text-sm font-display font-800 text-[var(--color-copper)]">{step.number}</span>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-copper)]/20 to-transparent" />
                    </div>

                    <div className={`${isLeft ? "md:ml-auto" : ""} max-w-sm`}>
                      {/* Duration badge */}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium text-[var(--color-copper)] bg-[var(--color-copper-bg)] border border-[var(--color-border)] mb-4">
                        {step.duration}
                      </span>

                      <div className={`w-10 h-10 rounded-xl bg-[var(--color-copper-bg)] flex items-center justify-center mb-4 ${isLeft ? "md:ml-auto" : ""}`}>
                        <step.icon className="w-5 h-5 text-[var(--color-copper)]" />
                      </div>

                      <h3 className="text-xl font-display font-700 text-[var(--color-text)] mb-2">{step.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <FadeIn delay={0.5}>
          <div className="mt-20 text-center">
            <Link href="/login?mode=signup">
              <MagneticButton className="group px-8 py-4 btn-copper rounded-xl font-semibold text-white transition-all duration-300">
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
            <p className="mt-4 text-sm text-[var(--color-text-tertiary)]">
              Aucune carte bancaire requise
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
