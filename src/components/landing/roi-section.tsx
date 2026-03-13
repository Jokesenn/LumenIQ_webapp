"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { FadeIn } from "@/components/animations";

const benefits = [
  {
    icon: Clock,
    highlight: "2",
    highlightSuffix: " jours/mois",
    title: "Gagnez du temps",
    description: "Automatisez vos prévisions. Éliminez les fichiers Excel. Récupérez 16 jours par an pour des tâches à plus forte valeur.",
    gradient: "from-blue-600 to-cyan-600",
    targetNumber: 16,
    numberSuffix: " jours/an",
  },
  {
    icon: TrendingDown,
    highlight: "-15",
    highlightSuffix: " à 30%",
    title: "Réduisez vos ruptures",
    description: "Prévisions fiables = moins de stock mort, moins de ventes perdues. Optimisez vos réapprovisionnements en confiance.",
    gradient: "from-[var(--color-success)] to-emerald-600",
    targetNumber: 30,
    numberSuffix: "% de ruptures",
  },
  {
    icon: TrendingUp,
    highlight: "+2",
    highlightSuffix: " à 5%",
    title: "Améliorez votre marge",
    description: "Moins de surstocks, moins de démarques. Chaque euro investi dans la prévision en rapporte 10 en optimisation.",
    gradient: "from-[var(--color-copper)] to-[var(--color-copper-dark)]",
    targetNumber: 10,
    numberSuffix: "x ROI",
  },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count, target]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return unsubscribe;
  }, [rounded]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

export function RoiSection() {
  return (
    <section id="roi" aria-label="ROI et bénéfices concrets" className="relative py-28 overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="relative mb-20">
          <div className="absolute -top-8 right-0 section-number hidden lg:block">04</div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <FadeIn>
              <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-[var(--color-copper)] mb-4">
                ROI mesurable
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-[-0.03em] leading-[1.05]">
                <span className="text-gradient">Des résultats concrets,</span>
                <br />
                <span className="text-[var(--color-text)]">dès le premier mois</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-[var(--color-text-secondary)] mt-6 font-light leading-relaxed">
                PREVYA ne promet pas, il prouve. Chaque prévision est validée sur votre historique.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Benefits — large typographic numbers */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 150 }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                </div>
              </div>

              {/* Large metric with gradient */}
              <p className={`text-6xl sm:text-7xl lg:text-8xl font-display font-800 mb-4 bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent tracking-[-0.04em] leading-none`}>
                {benefit.highlight}
                <span className="text-3xl sm:text-4xl">{benefit.highlightSuffix}</span>
              </p>

              <h3 className="text-xl font-display font-700 text-[var(--color-text)] mb-3">{benefit.title}</h3>

              {/* Decorative line */}
              <div className={`w-16 h-0.5 bg-gradient-to-r ${benefit.gradient} mx-auto mb-5 rounded-full opacity-40`} />

              <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-xs mx-auto text-sm font-light">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
