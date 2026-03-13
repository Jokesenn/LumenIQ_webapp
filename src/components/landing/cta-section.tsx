"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Server, Lock, Clock } from "lucide-react";
import { FadeIn, MagneticButton } from "@/components/animations";

export function CTASection() {
  return (
    <section id="cta" aria-label="Appel à l'action" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--color-bg-surface)]" />
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <FadeIn>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-copper-bg)] border border-[var(--color-border)] mb-10"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-[var(--color-copper)]" />
            </motion.div>
            <span className="text-sm text-[var(--color-text-secondary)]">Prêt à transformer vos prévisions ?</span>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 tracking-[-0.04em] leading-[0.95] mb-8">
            <span className="text-[var(--color-text)]">Commencez</span>
            <br />
            <span className="text-gradient-brand">gratuitement</span>
            <br />
            <span className="text-[var(--color-text)]">aujourd&apos;hui</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Des previsions fiables pour piloter vos stocks et anticiper vos ventes.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?mode=signup">
              <MagneticButton className="group px-10 py-5 btn-copper rounded-xl font-semibold text-base text-white transition-all duration-300">
                <span className="flex items-center gap-2">
                  Essayer PREVYA gratuitement
                  <motion.span className="group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </MagneticButton>
            </Link>

            <Link href="/demo">
              <MagneticButton className="px-10 py-5 btn-copper-outline rounded-xl font-semibold text-base transition-all">
                Voir la demo
              </MagneticButton>
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--color-text-tertiary)]">Aucune carte bancaire requise</p>
        </FadeIn>

        {/* Trust elements */}
        <FadeIn delay={0.4}>
          <div className="mt-20 pt-8 border-t border-[var(--color-border)]">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: Shield, label: "Conforme RGPD" },
                { icon: Server, label: "Heberge en UE" },
                { icon: Lock, label: "Donnees chiffrees" },
                { icon: Clock, label: "Essai gratuit 3 mois" },
              ].map(({ icon: TrustIcon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]"
                >
                  <TrustIcon className="w-4 h-4 text-[var(--color-copper)]" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
