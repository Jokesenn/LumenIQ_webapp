"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { FadeIn, MagneticButton } from "@/components/animations";

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-indigo-950/20 to-zinc-950" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </motion.div>
            <span className="text-sm text-zinc-300">Prêt à transformer vos prévisions ?</span>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Commencez</span>
            <br />
            <span className="text-gradient-brand">gratuitement aujourd&apos;hui</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Rejoignez les PME qui font confiance à LumenIQ pour leurs décisions
            d&apos;approvisionnement et de planification.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?mode=signup">
              <MagneticButton className="group px-8 py-4 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-all">
                <span className="flex items-center gap-2">
                  Créer mon compte gratuit
                  <motion.span
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </span>
              </MagneticButton>
            </Link>

            <Link href="/demo">
              <MagneticButton className="px-8 py-4 glass rounded-xl font-semibold text-white hover:bg-white/10 transition-all border border-white/10">
                Voir la démo
              </MagneticButton>
            </Link>
          </div>
        </FadeIn>

        {/* Trust elements */}
        <FadeIn delay={0.5}>
          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-sm text-zinc-500 mb-4">Ils nous font confiance</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {/* Placeholder logos - replace with real ones */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-24 h-8 bg-white/10 rounded" />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
