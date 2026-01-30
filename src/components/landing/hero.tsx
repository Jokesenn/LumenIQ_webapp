"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/backgrounds";
import { TextReveal, FadeIn, MagneticButton } from "@/components/animations";
import { HeroChart } from "./hero-chart";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background animé */}
      <AnimatedBackground variant="hero" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            {/* Badge animé */}
            <FadeIn delay={0.1}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 gradient-border"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </motion.div>
                <span className="text-sm text-zinc-300">
                  Forecast Engine v2.0 — 15 modèles ML
                </span>
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              </motion.div>
            </FadeIn>

            {/* Titre avec text reveal */}
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                <TextReveal
                  text="Prévisions professionnelles"
                  className="text-gradient block"
                  delay={0.2}
                />
                <TextReveal
                  text="en 5 minutes"
                  className="text-indigo-400 block mt-2"
                  delay={0.5}
                />
              </h1>
            </div>

            {/* Description */}
            <FadeIn delay={0.8}>
              <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Transformez vos données de vente en forecasts validés par backtesting.
                <span className="text-zinc-300"> Sans data scientist.</span>
                <span className="text-zinc-300"> Sans Excel.</span>
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={1}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login?mode=signup">
                  <MagneticButton className="group relative px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold text-white transition-all duration-300 glow-pulse shimmer">
                    <span className="flex items-center gap-2">
                      Essayer gratuitement
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </span>
                  </MagneticButton>
                </Link>

                <Link href="/demo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group px-8 py-4 border-white/10 hover:bg-white/5 hover:border-white/20 rounded-xl"
                  >
                    <Play className="w-4 h-4 mr-2 text-indigo-400 group-hover:text-indigo-300" />
                    Voir la démo
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Trust badges */}
            <FadeIn delay={1.2}>
              <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
                {[
                  { value: "5 min", label: "Setup rapide" },
                  { value: "15", label: "Modèles ML" },
                  { value: "70%", label: "Économie compute" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right content - Dashboard preview */}
          <FadeIn delay={0.5} direction="left">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            >
              {/* Glow behind */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-3xl" />

              {/* Dashboard card */}
              <div className="relative glass-card p-6 gradient-border">
                <HeroChart />
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 px-3 py-1.5 glass rounded-full text-xs font-medium text-emerald-400 border border-emerald-500/20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                WAPE: 8.2%
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 px-3 py-1.5 glass rounded-full text-xs font-medium text-indigo-400 border border-indigo-500/20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                847 séries analysées
              </motion.div>
            </motion.div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
