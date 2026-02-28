"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { FadeIn, TiltCard, MagneticButton } from "@/components/animations";
import { AnimatedBackground } from "@/components/backgrounds";
import { PLANS_LIST, TRIAL_DURATION_MONTHS } from "@/lib/pricing-config";
import { cn } from "@/lib/utils";

const iconMap = { Zap, Sparkles, Crown } as const;

export function PricingSection() {
  return (
    <section id="pricing" aria-label="Tarifs" className="relative py-28 overflow-hidden">
      <AnimatedBackground variant="subtle" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="relative mb-20">
          <div className="absolute -top-8 left-0 section-number">05</div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <FadeIn>
              <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                Tarification simple
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-[-0.03em] leading-[1.05]">
                <span className="text-white">Un plan pour chaque</span>
                <br />
                <span className="text-gradient">étape de croissance</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-zinc-400 mt-6 font-light">
                Essai gratuit {TRIAL_DURATION_MONTHS} mois, sans engagement. Annulable à tout moment.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {PLANS_LIST.map((plan, i) => {
            const Icon = iconMap[plan.icon];
            const isPopular = "popular" in plan && plan.popular;
            const inheritedFeatureIndex = plan.features.findIndex(
              (f) => f.startsWith("Tout ") && f.includes("inclus")
            );

            return (
              <FadeIn key={i} delay={0.1 * i}>
                <TiltCard className="h-full">
                  <motion.div
                    className={cn(
                      "relative h-full p-8 rounded-2xl transition-all duration-500",
                      isPopular
                        ? "bg-gradient-to-b from-indigo-500/[0.08] to-violet-500/[0.03] border-2 border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.08)]"
                        : "bg-zinc-900/40 border border-white/[0.05] hover:border-white/[0.08]"
                    )}
                    whileHover={{ y: -10 }}
                  >
                    {/* Popular badge */}
                    {isPopular && (
                      <motion.div
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-xs font-semibold text-white mb-5"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Plus populaire
                      </motion.div>
                    )}

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} p-[1px] mb-6`}>
                      <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-display font-700 text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-zinc-500 mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-2">
                      <span className="text-6xl font-display font-800 text-white tracking-[-0.04em]">
                        {plan.price}
                      </span>
                      <span className="text-zinc-500 ml-2 text-sm">EUR/mois</span>
                    </div>
                    <p className="text-xs text-zinc-600 mb-8">
                      Essai gratuit {TRIAL_DURATION_MONTHS} mois
                    </p>

                    {/* Features */}
                    <ul className="space-y-3.5 mb-8">
                      {plan.features.map((feature, j) => {
                        const isInheritedSeparator = j === inheritedFeatureIndex;
                        return (
                          <li key={j}>
                            {isInheritedSeparator ? (
                              <div className="flex items-center gap-3 pb-3 mb-1 border-b border-white/[0.04]">
                                <span className="text-sm text-zinc-500 italic">{feature}, plus :</span>
                              </div>
                            ) : (
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                  isPopular ? "bg-indigo-500/15" : "bg-white/[0.04]"
                                )}>
                                  <Check className={cn(
                                    "w-3 h-3",
                                    isPopular ? "text-indigo-400" : "text-zinc-500"
                                  )} />
                                </div>
                                <span className="text-zinc-300 text-sm">{feature}</span>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    {/* CTA */}
                    <Link href="/login?mode=signup" className="block">
                      <MagneticButton
                        className={cn(
                          "w-full py-3.5 rounded-xl font-semibold transition-all text-sm",
                          isPopular
                            ? "bg-indigo-500 hover:bg-indigo-600 text-white glow-pulse"
                            : "bg-white/[0.04] hover:bg-white/[0.07] text-white border border-white/[0.06]"
                        )}
                      >
                        Essai gratuit {TRIAL_DURATION_MONTHS} mois
                      </MagneticButton>
                    </Link>
                  </motion.div>
                </TiltCard>
              </FadeIn>
            );
          })}
        </div>

        {/* Enterprise CTA */}
        <FadeIn delay={0.5}>
          <motion.div
            className="mt-16 text-center p-8 rounded-2xl glass gradient-border"
            whileHover={{ scale: 1.005 }}
          >
            <h3 className="text-xl font-display font-700 text-white mb-2">
              Besoin d&apos;une solution sur-mesure ?
            </h3>
            <p className="text-zinc-400 mb-6 text-sm">
              Plus de 300 séries/mois ou besoins spécifiques ? Contactez-nous.
            </p>
            <Link href="/contact">
              <MagneticButton className="px-6 py-3 bg-white/[0.04] hover:bg-white/[0.07] rounded-xl font-medium text-white border border-white/[0.06] text-sm">
                Contacter l&apos;équipe
              </MagneticButton>
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
