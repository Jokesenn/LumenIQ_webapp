"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Workflow, ArrowRight } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, MagneticButton } from "@/components/animations";

const steps = [
  {
    number: 1,
    title: "Upload CSV",
    description: "Glissez votre fichier historique. Détection automatique des colonnes dates et valeurs.",
  },
  {
    number: 2,
    title: "Configuration auto",
    description: "Fréquence, saisonnalité, classification ABC/XYZ détectées sans intervention.",
  },
  {
    number: 3,
    title: "Calcul (2-5 min)",
    description: "Jusqu'à 24 modèles en compétition, validation automatique sur votre historique, sélection du meilleur pour chaque produit.",
  },
  {
    number: 4,
    title: "Résultats",
    description: "Dashboard interactif, scores de précision par produit, export ZIP complet (Excel + PDF).",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-label="Comment ça marche" className="relative py-20 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <FadeIn>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <Workflow className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-zinc-300">Comment ça marche</span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gradient">De l&apos;upload au forecast :</span>
              <br />
              <span className="text-white">5 minutes chrono</span>
            </h2>
          </FadeIn>
        </div>

        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-white/10" />

          <StaggerChildren staggerDelay={0.15} className="grid md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <StaggerItem key={step.number}>
                <motion.div
                  className="relative text-center group"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-indigo-500/10 group-hover:bg-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-400 mx-auto mb-6 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
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
