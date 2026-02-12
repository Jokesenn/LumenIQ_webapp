"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground, FloatingParticles } from "@/components/backgrounds";
import { TextReveal, FadeIn, MagneticButton } from "@/components/animations";
import { HeroChart } from "./hero-chart";

/* ------------------------------------------------------------------ */
/*  Animated counter component                                        */
/* ------------------------------------------------------------------ */

function AnimatedStat({
  target,
  label,
  suffix = "",
}: {
  target: number;
  label: string;
  suffix?: string;
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
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold text-white flex items-center justify-center">
        <span>{display}</span>
        {suffix}
      </div>
      <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero section                                                      */
/* ------------------------------------------------------------------ */

export function Hero() {
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true);

  /* Fade out scroll indicator after 3 s */
  useEffect(() => {
    const timer = setTimeout(() => setScrollIndicatorVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      aria-label="Accueil"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <AnimatedBackground variant="hero" />
      <FloatingParticles count={20} className="z-0" />

      {/* ---- Centered content ---- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-12 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </motion.div>
          <span className="text-sm text-zinc-300">
            Nouveau — Claude analyse vos résultats en langage business
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
        </motion.div>

        {/* Headline */}
        <div className="mb-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
            <TextReveal
              text="Réduisez vos ruptures de stock et surstocks"
              className="text-white block"
              delay={0.15}
            />
            <TextReveal
              text="avec des prévisions fiables en 5 minutes"
              className="text-gradient-brand block mt-2"
              delay={0.35}
            />
          </h1>
        </div>

        {/* Subtitle */}
        <FadeIn delay={0.6}>
          <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Transformez vos données de vente en forecasts validés par backtesting.
            Sans data scientist. Sans Excel.
          </p>
        </FadeIn>

        {/* CTA Buttons */}
        <FadeIn delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

        {/* Animated Stats */}
        <FadeIn delay={1}>
          <div className="mt-10 flex items-center justify-center gap-10 sm:gap-14">
            {/* "5 min" kept as static text */}
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5 min</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">
                Setup rapide
              </div>
            </div>

            <div className="w-px h-10 bg-white/10" />

            <AnimatedStat
              target={24}
              label="Modèles disponibles"
            />

            <div className="w-px h-10 bg-white/10" />

            <AnimatedStat
              target={99}
              label="Zéro intervention manuelle"
              suffix="%"
            />
          </div>
        </FadeIn>

        {/* ---- Chart card (scroll-revealed, full-width) ---- */}
        <FadeIn delay={0.2} direction="up" className="mt-16 w-full max-w-4xl mx-auto">
          <div className="relative">
            {/* Glow behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-3xl" />

            {/* Dashboard card */}
            <div className="relative glass-card p-6 gradient-border">
              <HeroChart />
            </div>

            {/* Floating mini-card: Action preview */}
            <motion.div
              className="absolute -top-14 left-2 hidden lg:block glass rounded-xl px-3 py-2.5 border border-amber-500/20 max-w-[210px] shadow-lg"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-amber-400">
                    Alerte stock
                  </p>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    Réapprovisionner SKU-2847 avant le 15 mars
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating mini-card: Reliability gauge */}
            <motion.div
              className="absolute -top-12 right-6 hidden lg:block glass rounded-xl px-3 py-2.5 border border-emerald-500/20 shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <div className="flex items-center gap-2.5">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 36 36"
                  className="shrink-0"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="82.9 87.96"
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <div>
                  <p className="text-[10px] text-zinc-400">Fiabilité moy.</p>
                  <p className="text-sm font-bold text-white">
                    94.2
                    <span className="text-zinc-500 text-[11px]">/100</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating pill badges */}
            <motion.div
              className="absolute -top-4 -right-4 px-3 py-1.5 glass rounded-full text-xs font-medium text-amber-400 border border-amber-500/20"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              24 modèles testés
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 px-3 py-1.5 glass rounded-full text-xs font-medium text-indigo-400 border border-indigo-500/20"
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              847 séries analysées
            </motion.div>
          </div>
        </FadeIn>
      </div>

      {/* Scroll indicator with fade-out after 3s */}
      <motion.div
        animate={{
          opacity: scrollIndicatorVisible ? [0.5, 1, 0.5] : 0,
          y: scrollIndicatorVisible ? [0, 10, 0] : 10,
        }}
        transition={{
          duration: scrollIndicatorVisible ? 2 : 0.6,
          repeat: scrollIndicatorVisible ? Infinity : 0,
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={() =>
            document
              .getElementById("comparison")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Défiler vers le bas"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </button>
      </motion.div>
    </section>
  );
}
