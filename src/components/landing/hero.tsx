"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useScroll,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Play, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextReveal, FadeIn, MagneticButton } from "@/components/animations";
import { HeroChart } from "./hero-chart";

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

function AnimatedStat({
  target,
  label,
  suffix = "",
  prefix = "",
}: {
  target: number;
  label: string;
  suffix?: string;
  prefix?: string;
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
    <div ref={ref} className="group">
      <div className="text-4xl sm:text-5xl font-display font-800 tracking-tight text-[var(--color-text)] flex items-baseline gap-0.5">
        {prefix && <span className="text-[var(--color-copper)]">{prefix}</span>}
        <span>{display}</span>
        {suffix && <span className="text-[var(--color-copper)]">{suffix}</span>}
      </div>
      <div className="text-[13px] text-[var(--color-text-tertiary)] mt-2 tracking-wide uppercase font-medium">
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero section                                                       */
/* ------------------------------------------------------------------ */

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yChart = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), {
    stiffness: 100,
    damping: 30,
  });

  const opacityScroll = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="Accueil"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Subtle dot pattern background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />

      {/* ---- Main content grid ---- */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-8 pt-32 lg:pt-40 pb-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left column — Text content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--color-copper-bg)] border border-[var(--color-border)] mb-10 w-fit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 text-[var(--color-copper)]" />
              </motion.div>
              <span className="text-sm text-[var(--color-text-secondary)] font-medium">
                Nouveau — Claude analyse vos résultats en langage business
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-copper)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-copper)]" />
              </span>
            </motion.div>

            {/* Headline — Display font with extreme weight contrast */}
            <div className="mb-8">
              <h1 className="font-display tracking-[-0.03em] leading-[0.95]">
                <motion.span
                  className="block text-[clamp(2.5rem,5.5vw,4.5rem)] font-300 text-[var(--color-text-secondary)]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  Réduisez vos ruptures
                </motion.span>
                <motion.span
                  className="block text-[clamp(2.5rem,5.5vw,4.5rem)] font-800 text-[var(--color-text)] mt-1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  de stock et surstocks
                </motion.span>
                <motion.span
                  className="block text-[clamp(2.5rem,5.5vw,4.5rem)] font-800 text-gradient-brand mt-1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  en 5 minutes.
                </motion.span>
              </h1>
            </div>

            {/* Subtitle */}
            <FadeIn delay={0.7}>
              <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed font-light">
                Transformez vos données de vente en prévisions validées sur votre historique réel.
                <span className="text-[var(--color-text)] font-medium"> Sans data scientist. Sans Excel.</span>
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.9}>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="/login?mode=signup">
                  <MagneticButton className="group relative px-8 py-4 btn-copper rounded-xl font-semibold text-white transition-all duration-300">
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
                    className="group px-8 py-4 btn-copper-outline rounded-xl"
                  >
                    <Play className="w-4 h-4 mr-2 text-[var(--color-copper)] group-hover:text-[var(--color-copper-hover)]" />
                    Voir la démo
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Stats row */}
            <FadeIn delay={1.1}>
              <div className="mt-14 flex items-start gap-12 sm:gap-16">
                <div>
                  <div className="text-4xl sm:text-5xl font-display font-800 tracking-tight text-[var(--color-text)]">
                    5<span className="text-[var(--color-copper)] text-2xl ml-1">min</span>
                  </div>
                  <div className="text-[13px] text-[var(--color-text-tertiary)] mt-2 tracking-wide uppercase font-medium">
                    Setup rapide
                  </div>
                </div>

                <div className="w-px h-14 bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent" />

                <AnimatedStat target={24} label="Méthodes de calcul" />

                <div className="w-px h-14 bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent hidden sm:block" />

                <div className="hidden sm:block">
                  <AnimatedStat target={99} label="Zéro intervention" suffix="%" />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right column — Chart visualization (5 cols) */}
          <motion.div
            className="lg:col-span-5 relative mt-4 lg:mt-8"
            style={{ y: yChart }}
          >
            <FadeIn delay={0.4} direction="up">
              <div className="relative">
                {/* Chart card */}
                <div className="relative card-signal p-5 sm:p-6">
                  <HeroChart />
                </div>

                {/* Floating alert card — top left */}
                <motion.div
                  className="absolute -top-6 -left-4 hidden lg:block card-signal rounded-xl px-3.5 py-2.5 max-w-[210px]"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-warning)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-[var(--color-warning)]">Alerte stock</p>
                      <p className="text-[11px] text-[var(--color-text-secondary)] leading-snug">
                        Réapprovisionner SKU-2847 avant le 15 mars
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Reliability gauge — top right */}
                <motion.div
                  className="absolute -top-5 -right-3 hidden lg:block card-signal rounded-xl px-3.5 py-2.5"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <div className="flex items-center gap-2.5">
                    <svg width="32" height="32" viewBox="0 0 36 36" className="shrink-0">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-border)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="14"
                        fill="none" stroke="var(--color-success)" strokeWidth="3"
                        strokeDasharray="82.9 87.96"
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <div>
                      <p className="text-[10px] text-[var(--color-text-tertiary)]">Fiabilité moy.</p>
                      <p className="text-sm font-bold text-[var(--color-text)]">
                        94.2<span className="text-[var(--color-text-tertiary)] text-[11px]">/100</span>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating badge — models tested */}
                <motion.div
                  className="absolute -bottom-3 -right-3 px-3 py-1.5 card-signal rounded-full text-xs font-medium text-[var(--color-copper)]"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  24 méthodes testées
                </motion.div>

                {/* Floating badge — series analyzed */}
                <motion.div
                  className="absolute -bottom-3 -left-3 px-3 py-1.5 card-signal rounded-full text-xs font-medium text-[var(--color-copper)]"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  847 séries analysées
                </motion.div>
              </div>
            </FadeIn>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: opacityScroll }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <button
          onClick={() =>
            document.getElementById("comparison")?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Défiler vers le bas"
        >
          <div className="w-6 h-10 rounded-full border-2 border-[var(--color-border-med)] flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-[var(--color-text-tertiary)] rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </button>
      </motion.div>
    </section>
  );
}
