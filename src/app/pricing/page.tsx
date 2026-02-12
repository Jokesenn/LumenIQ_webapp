"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar, Footer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { BarChart3, Cpu, Brain, Check, X, Mail, Crown, Zap, Sparkles, ChevronDown, ArrowRight, Shield, HelpCircle } from "lucide-react";
import Link from "next/link";
import { PLANS_LIST as pricingPlans, TRIAL_DURATION_MONTHS, type PricingPlan } from "@/lib/pricing-config";
import { FadeIn, MagneticButton, TiltCard, StaggerChildren, StaggerItem } from "@/components/animations";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Standard: Zap,
  ML: Sparkles,
  Premium: Crown,
};

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */

const faqItems = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis les paramètres de votre compte. Le changement prend effet au prochain cycle de facturation.",
  },
  {
    question: "Comment fonctionne l’essai gratuit ?",
    answer: `L’essai gratuit dure ${TRIAL_DURATION_MONTHS} mois avec un accès complet au plan ML. Aucune carte bancaire n’est requise. À la fin de l’essai, vous choisissez le plan qui vous convient.`,
  },
  {
    question: "Mes données sont-elles en sécurité ?",
    answer: "Vos données sont chiffrées en transit et au repos. Elles sont stockées en Europe (AWS eu-west). Nous ne partageons jamais vos données avec des tiers. Vous pouvez supprimer vos données à tout moment.",
  },
  {
    question: "Que se passe-t-il si je dépasse mon quota de séries ?",
    answer: "Vous recevrez une notification quand vous approchez de votre limite. Les séries supplémentaires ne seront pas traitées, mais vos prévisions existantes restent accessibles. Vous pouvez upgrader votre plan pour obtenir plus de capacité.",
  },
];

/* ------------------------------------------------------------------ */
/*  Comparison table data                                              */
/* ------------------------------------------------------------------ */

const comparisonRows = [
  { feature: "Séries / mois", values: ["50", "150", "300"], type: "text" as const },
  { feature: "Modèles disponibles", values: ["17 stats", "22 (+ ML)", "24+ (+ Premium)"], type: "text" as const },
  { feature: "Ridge / LightGBM", values: [false, true, true], type: "bool" as const },
  { feature: "TimeGPT", values: [false, false, true], type: "bool" as const },
  { feature: "EnsembleTop2", values: [false, false, true], type: "bool" as const },
  { feature: "Accès API", values: [false, false, true], type: "bool" as const },
  { feature: "Historique", values: ["30 jours", "60 jours", "90 jours"], type: "text" as const },
  { feature: "Support", values: ["Email 48h", "Email 24h", "Prioritaire 4h"], type: "text" as const },
];

/* ------------------------------------------------------------------ */
/*  FAQ Accordion Item                                                 */
/* ------------------------------------------------------------------ */

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.05] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-zinc-400 font-light leading-relaxed pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing Card                                                       */
/* ------------------------------------------------------------------ */

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const isML = plan.popular || plan.badge === "PLUS POPULAIRE";
  const isPremium = plan.badge === "PREMIUM";
  const Icon = iconMap[plan.name] || Zap;

  return (
    <TiltCard className="h-full">
      <motion.div
        className={cn(
          "relative rounded-2xl p-8 flex flex-col h-full transition-all duration-500",
          isML
            ? "border-2 border-indigo-500/40 bg-gradient-to-b from-indigo-500/[0.08] via-indigo-500/[0.03] to-transparent shadow-[0_0_80px_rgba(99,102,241,0.1)] scale-[1.02] lg:scale-105 z-10"
            : isPremium
            ? "border-2 border-amber-500/30 bg-gradient-to-b from-amber-500/[0.05] to-transparent"
            : "border border-white/[0.06] bg-zinc-900/40 hover:border-white/[0.1]"
        )}
        whileHover={{ y: isML ? -4 : -8 }}
      >
        {/* Background glow for ML card */}
        {isML && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/[0.04] to-transparent pointer-events-none" />
        )}

        {/* Badge */}
        {(plan.popular || plan.badge) && (
          <motion.div
            className={cn(
              "absolute top-[-14px] left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap text-white tracking-wide",
              isPremium
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-indigo-500 to-violet-500"
            )}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          >
            {/* Shimmer effect on popular badge */}
            {isML && (
              <span className="absolute inset-0 rounded-full shimmer pointer-events-none" />
            )}
            <span className="relative z-10">{plan.badge || "PLUS POPULAIRE"}</span>
          </motion.div>
        )}

        <div className="relative">
          {/* Icon + name */}
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center",
              isPremium
                ? "bg-amber-500/10 text-amber-400"
                : isML
                ? "bg-indigo-500/15 text-indigo-400"
                : "bg-zinc-800 text-zinc-400"
            )}>
              <Icon size={20} />
            </div>
            <h3 className="text-2xl font-display font-800 text-white">{plan.name}</h3>
          </div>

          <p className="text-sm text-zinc-500 mb-6 min-h-[42px]">{plan.description}</p>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-800 text-white tracking-[-0.04em]">{plan.price}</span>
              <span className="text-base text-zinc-500">EUR</span>
            </div>
            <span className="text-sm text-zinc-600">/ mois</span>
          </div>

          {/* CTA */}
          <Link href="/login?mode=signup" className="block mb-8">
            <MagneticButton
              className={cn(
                "w-full py-3.5 rounded-xl font-semibold transition-all text-sm",
                isML
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white glow-pulse"
                  : isPremium
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  : "bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/[0.08]"
              )}
            >
              Essai gratuit {TRIAL_DURATION_MONTHS} mois
            </MagneticButton>
          </Link>

          {/* Features list */}
          <div className="space-y-3 flex-1">
            {plan.features.map((f, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2.5"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
              >
                <Check size={14} className={cn(
                  "shrink-0",
                  isPremium ? "text-amber-400" : isML ? "text-indigo-400" : "text-emerald-500"
                )} />
                <span className="text-sm text-zinc-400">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/6 blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20">
        {/* ============================================ */}
        {/*  HERO                                         */}
        {/* ============================================ */}
        <section className="relative py-24 md:py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 gradient-mesh pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] light-beam opacity-25 pointer-events-none" />

          <div className="relative max-w-[1200px] mx-auto text-center">
            <FadeIn>
              <motion.div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/8 border border-indigo-500/15 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-zinc-300 font-medium">Tarification transparente</span>
              </motion.div>
            </FadeIn>

            <h1 className="font-display tracking-[-0.03em] leading-[0.92] mb-6">
              <motion.span
                className="block text-5xl md:text-6xl lg:text-[5rem] font-300 text-zinc-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                Simple, transparent,
              </motion.span>
              <motion.span
                className="block text-5xl md:text-6xl lg:text-[5rem] font-800 text-gradient-brand mt-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                sans engagement
              </motion.span>
            </h1>

            <FadeIn delay={0.5}>
              <p className="text-lg text-zinc-400 font-light max-w-[500px] mx-auto">
                Essai gratuit {TRIAL_DURATION_MONTHS} mois. Aucun engagement. Annulez à tout moment.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ============================================ */}
        {/*  PRICING CARDS                                */}
        {/* ============================================ */}
        <section className="px-6 pb-20">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-4 items-start">
              {pricingPlans.map((plan, i) => (
                <FadeIn key={plan.name} delay={0.1 * i}>
                  <PricingCard plan={plan} index={i} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/*  COMPARISON TABLE — Premium style             */}
        {/* ============================================ */}
        <section className="relative py-20 px-6 section-glow-top">
          <div className="absolute inset-0 bg-zinc-925 pointer-events-none" />
          <div className="relative max-w-[1000px] mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                  Comparaison
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-800 text-white tracking-[-0.03em]">
                  Comparaison détaillée
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 bg-zinc-900/60">
                  <div className="p-5 text-sm text-zinc-500 font-medium">Fonctionnalité</div>
                  <div className="p-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Zap size={14} className="text-zinc-400" />
                      <span className="text-sm font-display font-600 text-white">Standard</span>
                    </div>
                  </div>
                  <div className="p-5 text-center relative">
                    <div className="absolute inset-0 bg-indigo-500/[0.06]" />
                    <div className="relative flex items-center justify-center gap-2">
                      <Sparkles size={14} className="text-indigo-400" />
                      <span className="text-sm font-display font-600 text-indigo-300">ML</span>
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Crown size={14} className="text-amber-400" />
                      <span className="text-sm font-display font-600 text-amber-300">Premium</span>
                    </div>
                  </div>
                </div>

                {/* Rows */}
                {comparisonRows.map((row, i) => (
                  <motion.div
                    key={i}
                    className="grid grid-cols-4 border-t border-white/[0.04] hover:bg-white/[0.01] transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.03 * i, duration: 0.3 }}
                  >
                    <div className="p-4 text-sm text-zinc-400">{row.feature}</div>
                    {row.values.map((val, j) => (
                      <div
                        key={j}
                        className={cn(
                          "p-4 text-center text-sm",
                          j === 1 && "bg-indigo-500/[0.04]"
                        )}
                      >
                        {row.type === "bool" ? (
                          val ? (
                            <Check size={16} className="mx-auto text-emerald-500" />
                          ) : (
                            <X size={16} className="mx-auto text-zinc-600" />
                          )
                        ) : (
                          <span className="text-zinc-300">{val as string}</span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================ */}
        {/*  FAQ                                          */}
        {/* ============================================ */}
        <section className="py-20 px-6">
          <div className="max-w-[700px] mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-800 text-white tracking-[-0.02em]">
                  Questions fréquentes
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-2xl bg-zinc-900/30 border border-white/[0.05] p-6 md:p-8">
                {faqItems.map((item, i) => (
                  <FAQItem key={i} question={item.question} answer={item.answer} />
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================ */}
        {/*  ENTERPRISE CTA                               */}
        {/* ============================================ */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 gradient-mesh pointer-events-none" />
          <div className="absolute inset-0 bg-hex-pattern opacity-15 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[140px] pointer-events-none" />

          <div className="relative max-w-[800px] mx-auto">
            <FadeIn>
              <div className="relative rounded-2xl border border-white/[0.08] p-10 md:p-14 text-center overflow-hidden">
                {/* Gradient border animation */}
                <div className="absolute inset-0 rounded-2xl gradient-border pointer-events-none" />
                <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl rounded-2xl" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-[1px] mx-auto mb-6">
                    <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-800 text-white mb-4 tracking-tight">
                    Besoin d&apos;un volume supérieur ?
                  </h3>
                  <p className="text-zinc-400 mb-8 font-light text-sm max-w-[500px] mx-auto leading-relaxed">
                    Pour les entreprises avec plus de 500 séries/mois ou des besoins spécifiques
                    (on-premise, intégrations custom, SLA), contactez-nous pour un devis personnalisé.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <MagneticButton className="group px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold text-white glow-pulse transition-all">
                        <span className="flex items-center gap-2">
                          <Mail size={16} />
                          Contacter l&apos;équipe
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </MagneticButton>
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
