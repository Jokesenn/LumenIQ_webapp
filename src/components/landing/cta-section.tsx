"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Server, Lock, Clock } from "lucide-react";
import { FadeIn, MagneticButton } from "@/components/animations";

export function CTASection() {
  return (
    <section id="cta" aria-label="Appel à l'action" className="relative py-32 overflow-hidden">
      {/* Dramatic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-indigo-950/20 to-zinc-950" />
        <div className="absolute inset-0 gradient-mesh opacity-80" />

        {/* Animated central glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-indigo-500/8 rounded-full blur-[200px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Vertical light beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-full light-beam opacity-20" />

        {/* Hex pattern */}
        <div className="absolute inset-0 bg-hex-pattern opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <FadeIn>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] mb-10"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </motion.div>
            <span className="text-sm text-zinc-300">Prêt à transformer vos prévisions ?</span>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 tracking-[-0.04em] leading-[0.95] mb-8">
            <span className="text-white">Commencez</span>
            <br />
            <span className="text-gradient-brand">gratuitement</span>
            <br />
            <span className="text-white">aujourd&apos;hui</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Des previsions fiables pour piloter vos stocks et anticiper vos ventes.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?mode=signup">
              <MagneticButton className="group px-10 py-5 bg-white text-zinc-900 rounded-xl font-semibold text-base transition-all duration-300 hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]">
                <span className="flex items-center gap-2">
                  Essayer LumenIQ gratuitement
                  <motion.span className="group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </MagneticButton>
            </Link>

            <Link href="/demo">
              <MagneticButton className="px-10 py-5 bg-white/[0.04] rounded-xl font-semibold text-base text-white hover:bg-white/[0.07] transition-all border border-white/[0.06]">
                Voir la demo
              </MagneticButton>
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-500">Aucune carte bancaire requise</p>
        </FadeIn>

        {/* Trust elements */}
        <FadeIn delay={0.4}>
          <div className="mt-20 pt-8 border-t border-white/[0.04]">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: Shield, label: "Conforme RGPD" },
                { icon: Server, label: "Heberge en UE" },
                { icon: Lock, label: "Donnees chiffrees" },
                { icon: Clock, label: "Essai gratuit 3 mois" },
              ].map(({ icon: TrustIcon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.04] text-sm text-zinc-400"
                >
                  <TrustIcon className="w-4 h-4 text-indigo-400/70" />
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
