"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground, FloatingParticles } from "@/components/backgrounds";
import { TextReveal, FadeIn, MagneticButton, Parallax } from "@/components/animations";
import { HeroChart } from "./hero-chart";

export function Hero() {
  return (
    <section id="hero" aria-label="Accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background animé */}
      <AnimatedBackground variant="hero" />
      <FloatingParticles count={40} className="z-0" />

      {/* Logo arrière-plan avec pulsation */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] z-0 pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="w-full h-full"
        >
          {/* Hexagone externe */}
          <polygon
            points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Hexagone milieu */}
          <polygon
            points="50,20 78.7,35 78.7,65 50,80 21.3,65 21.3,35"
            fill="white"
            opacity="0.3"
          />
          {/* Hexagone interne */}
          <polygon
            points="50,35 64.4,42.5 64.4,57.5 50,65 35.6,57.5 35.6,42.5"
            fill="white"
          />
        </svg>
      </motion.div>

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
                  Nouveau — Synthèse IA de vos résultats
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
                  className="text-gradient-animated block"
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
                  { value: "24", label: "Modèles disponibles" },
                  { value: "99%", label: "Automatisé" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-zinc-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right content - Dashboard preview */}
          <FadeIn delay={0.5} direction="left">
            <Parallax speed={-0.1}>
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
                <Parallax speed={0.15} className="absolute -top-4 -right-4">
                  <motion.div
                    className="px-3 py-1.5 glass rounded-full text-xs font-medium text-amber-400 border border-amber-500/20"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    24 modèles testés
                  </motion.div>
                </Parallax>

                <Parallax speed={0.25} className="absolute -bottom-4 -left-4">
                  <motion.div
                    className="px-3 py-1.5 glass rounded-full text-xs font-medium text-indigo-400 border border-indigo-500/20"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    847 séries analysées
                  </motion.div>
                </Parallax>
              </motion.div>
            </Parallax>
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Défiler vers le bas"
      >
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
      </button>
    </section>
  );
}
