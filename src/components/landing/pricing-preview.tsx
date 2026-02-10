"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerChildren, StaggerItem, TiltCard, MagneticButton } from "@/components/animations";
import { AnimatedBackground } from "@/components/backgrounds";
import { PLANS_LIST, TRIAL_DURATION_MONTHS } from "@/lib/pricing-config";
import { cn } from "@/lib/utils";

const iconMap = {
  Zap,
  Sparkles,
  Crown,
} as const;

export function PricingSection() {
  return (
    <section id="pricing" aria-label="Tarifs" className="relative py-20 overflow-hidden">
      <AnimatedBackground variant="subtle" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeIn>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-zinc-300">Tarification simple</span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Un plan pour chaque</span>
              <br />
              <span className="text-gradient">étape de croissance</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Essai gratuit {TRIAL_DURATION_MONTHS} mois, sans engagement.
              Annulable à tout moment.
            </p>
          </FadeIn>
        </div>

        {/* Pricing cards */}
        <StaggerChildren staggerDelay={0.15} className="grid md:grid-cols-3 gap-8 items-start">
          {PLANS_LIST.map((plan, i) => {
            const Icon = iconMap[plan.icon];
            const isPopular = "popular" in plan && plan.popular;

            return (
              <StaggerItem key={i}>
                <TiltCard className="h-full">
                  <motion.div
                    className={cn(
                      "relative h-full p-8 rounded-3xl transition-all duration-500",
                      isPopular
                        ? "bg-gradient-to-b from-indigo-500/10 to-violet-500/5 border-2 border-indigo-500/50"
                        : "bg-zinc-900/50 border border-white/5 hover:border-white/10"
                    )}
                    whileHover={{ y: -10 }}
                  >
                    {/* Popular badge */}
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <motion.div
                          className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-xs font-semibold text-white"
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Plus populaire
                        </motion.div>
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} p-[1px] mb-6`}>
                      <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Plan name */}
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-zinc-400 mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-2">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-zinc-400 ml-2">€/mois</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-8">
                      Essai gratuit {TRIAL_DURATION_MONTHS} mois
                    </p>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                            isPopular ? "bg-indigo-500/20" : "bg-white/5"
                          )}>
                            <Check className={cn(
                              "w-3 h-3",
                              isPopular ? "text-indigo-400" : "text-zinc-400"
                            )} />
                          </div>
                          <span className="text-zinc-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link href="/login?mode=signup" className="block">
                      <MagneticButton
                        className={cn(
                          "w-full py-3 rounded-xl font-semibold transition-all",
                          isPopular
                            ? "bg-indigo-500 hover:bg-indigo-600 text-white glow-pulse"
                            : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        )}
                      >
                        Essai gratuit {TRIAL_DURATION_MONTHS} mois
                      </MagneticButton>
                    </Link>
                  </motion.div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* Enterprise CTA */}
        <FadeIn delay={0.6}>
          <motion.div
            className="mt-16 text-center p-8 rounded-2xl glass gradient-border"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2">Besoin d&apos;une solution sur-mesure ?</h3>
            <p className="text-zinc-400 mb-6">Plus de 300 séries/mois ou besoins spécifiques ? Contactez-nous.</p>
            <Link href="/contact">
              <MagneticButton className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium text-white border border-white/10">
                Contacter l&apos;équipe
              </MagneticButton>
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
