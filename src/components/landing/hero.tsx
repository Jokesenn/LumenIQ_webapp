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
import { FloatingParticles } from "@/components/backgrounds";
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
      <div className="text-4xl sm:text-5xl font-display font-800 tracking-tight text-white flex items-baseline gap-0.5">
        {prefix && <span className="text-indigo-400">{prefix}</span>}
        <span>{display}</span>
        {suffix && <span className="text-indigo-400">{suffix}</span>}
      </div>
      <div className="text-[13px] text-zinc-500 mt-2 tracking-wide uppercase font-medium">
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hexagonal decorative element                                       */
/* ------------------------------------------------------------------ */

function HexDecor({ className }: { className?: string }) {
  return (
    <svg
      width="120"
      height="140"
      viewBox="0 0 120 140"
      fill="none"
      className={className}
    >
      <polygon
        points="60,5 110,30 110,80 60,105 10,80 10,30"
        fill="none"
        stroke="rgba(99,102,241,0.08)"
        strokeWidth="1"
      />
      <polygon
        points="60,20 95,37.5 95,72.5 60,90 25,72.5 25,37.5"
        fill="none"
        stroke="rgba(99,102,241,0.05)"
        strokeWidth="0.5"
      />
    </svg>
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
      {/* Background layers */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-hex-pattern opacity-60" />
      <FloatingParticles count={15} className="z-0" />

      {/* Light beam from top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[800px] light-beam opacity-40" />

      {/* Decorative hexagons */}
      <HexDecor className="absolute top-20 right-[8%] opacity-30 hidden lg:block" />
      <HexDecor className="absolute bottom-32 left-[5%] opacity-20 hidden lg:block rotate-12 scale-75" />

      {/* ---- Main content grid ---- */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-8 pt-32 lg:pt-40 pb-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left column — Text content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/8 border border-indigo-500/15 mb-10 w-fit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </motion.div>
              <span className="text-sm text-zinc-300 font-medium">
                Nouveau — Claude analyse vos résultats en langage business
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
            </motion.div>

            {/* Headline — Display font with extreme weight contrast */}
            <div className="mb-8">
              <h1 className="font-display tracking-[-0.03em] leading-[0.95]">
                <motion.span
                  className="block text-[clamp(2.5rem,5.5vw,4.5rem)] font-300 text-zinc-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  Réduisez vos ruptures
                </motion.span>
                <motion.span
                  className="block text-[clamp(2.5rem,5.5vw,4.5rem)] font-800 text-white mt-1"
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
              <p className="text-lg sm:text-xl text-zinc-400 max-w-xl leading-relaxed font-light">
                Transformez vos données de vente en prévisions validées sur votre historique réel.
                <span className="text-zinc-300 font-medium"> Sans data scientist. Sans Excel.</span>
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.9}>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
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

            {/* Stats row */}
            <FadeIn delay={1.1}>
              <div className="mt-14 flex items-start gap-12 sm:gap-16">
                <div>
                  <div className="text-4xl sm:text-5xl font-display font-800 tracking-tight text-white">
                    5<span className="text-indigo-400 text-2xl ml-1">min</span>
                  </div>
                  <div className="text-[13px] text-zinc-500 mt-2 tracking-wide uppercase font-medium">
                    Setup rapide
                  </div>
                </div>

                <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                <AnimatedStat target={24} label="Méthodes de calcul" />

                <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden sm:block" />

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
                {/* Deep glow behind chart */}
                <div className="absolute -inset-8 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent blur-3xl rounded-3xl" />

                {/* Chart card */}
                <div className="relative glass-card p-5 sm:p-6 gradient-border">
                  <HeroChart />
                </div>

                {/* Floating alert card — top left */}
                <motion.div
                  className="absolute -top-6 -left-4 hidden lg:block glass rounded-xl px-3.5 py-2.5 border border-amber-500/20 max-w-[210px] shadow-lg shadow-black/20"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-amber-400">Alerte stock</p>
                      <p className="text-[11px] text-zinc-300 leading-snug">
                        Réapprovisionner SKU-2847 avant le 15 mars
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Reliability gauge — top right */}
                <motion.div
                  className="absolute -top-5 -right-3 hidden lg:block glass rounded-xl px-3.5 py-2.5 border border-emerald-500/20 shadow-lg shadow-black/20"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <div className="flex items-center gap-2.5">
                    <svg width="32" height="32" viewBox="0 0 36 36" className="shrink-0">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#27272a" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="14"
                        fill="none" stroke="#10b981" strokeWidth="3"
                        strokeDasharray="82.9 87.96"
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <div>
                      <p className="text-[10px] text-zinc-400">Fiabilité moy.</p>
                      <p className="text-sm font-bold text-white">
                        94.2<span className="text-zinc-500 text-[11px]">/100</span>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating badge — models tested */}
                <motion.div
                  className="absolute -bottom-3 -right-3 px-3 py-1.5 glass rounded-full text-xs font-medium text-amber-400 border border-amber-500/20"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  24 méthodes testées
                </motion.div>

                {/* Floating badge — series analyzed */}
                <motion.div
                  className="absolute -bottom-3 -left-3 px-3 py-1.5 glass rounded-full text-xs font-medium text-indigo-400 border border-indigo-500/20"
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
