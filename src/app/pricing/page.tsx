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
    <div className="border-b border-[var(--color-border)] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-copper)] transition-colors pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-[var(--color-text-tertiary)] shrink-0" />
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
            <p className="text-sm text-[var(--color-text-secondary)] font-light leading-relaxed pb-5">
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
            ? "border-2 border-[var(--color-copper)]/40 bg-white shadow-lg scale-[1.02] lg:scale-105 z-10"
            : isPremium
            ? "border-2 border-[var(--color-copper)]/30 bg-white"
            : "border border-[var(--color-border)] bg-white hover:border-[var(--color-border-hover)]"
        )}
        whileHover={{ y: isML ? -4 : -8 }}
      >

        {/* Badge */}
        {(plan.popular || plan.badge) && (
          <motion.div
            className={cn(
              "absolute top-[-14px] left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap text-white tracking-wide",
              "btn-copper"
            )}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          >
            {plan.badge || "PLUS POPULAIRE"}
          </motion.div>
        )}

        <div className="relative">
          {/* Icon + name */}
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center",
              isPremium
                ? "bg-[var(--color-copper)]/10 text-[var(--color-copper)]"
                : isML
                ? "bg-[var(--color-copper)]/15 text-[var(--color-copper)]"
                : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]"
            )}>
              <Icon size={20} />
            </div>
            <h3 className="text-2xl font-display font-800 text-[var(--color-text)]">{plan.name}</h3>
          </div>

          <p className="text-sm text-[var(--color-text-tertiary)] mb-6 min-h-[42px]">{plan.description}</p>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-800 text-[var(--color-text)] tracking-[-0.04em]">{plan.price}</span>
              <span className="text-base text-[var(--color-text-tertiary)]">EUR</span>
            </div>
            <span className="text-sm text-[var(--color-text-tertiary)]">/ mois</span>
          </div>

          {/* CTA */}
          <Link href="/login?mode=signup" className="block mb-8">
            <MagneticButton
              className={cn(
                "w-full py-3.5 rounded-xl font-semibold transition-all text-sm",
                isML || isPremium
                  ? "btn-copper"
                  : "bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)]"
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
                  isPremium ? "text-[var(--color-copper)]" : isML ? "text-[var(--color-copper)]" : "text-emerald-500"
                )} />
                <span className="text-sm text-[var(--color-text-secondary)]">{f}</span>
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
    <div className="relative min-h-screen bg-[var(--color-bg)] overflow-hidden">

      <Navbar />

      <main className="relative z-10 pt-20">
        {/* ============================================ */}
        {/*  HERO                                         */}
        {/* ============================================ */}
        <section className="relative py-24 md:py-32 px-6 overflow-hidden">
          <div className="relative max-w-[1200px] mx-auto text-center">
            <FadeIn>
              <motion.div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--color-copper)]/8 border border-[var(--color-copper)]/15 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Shield className="w-4 h-4 text-[var(--color-copper)]" />
                <span className="text-sm text-[var(--color-text-secondary)] font-medium">Tarification transparente</span>
              </motion.div>
            </FadeIn>

            <h1 className="font-display tracking-[-0.03em] leading-[0.92] mb-6">
              <motion.span
                className="block text-5xl md:text-6xl lg:text-[5rem] font-300 text-[var(--color-text-secondary)]"
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
              <p className="text-lg text-[var(--color-text-secondary)] font-light max-w-[500px] mx-auto">
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
        <section className="relative py-20 px-6">
          <div className="absolute inset-0 bg-[var(--color-bg-surface)] pointer-events-none" />
          <div className="relative max-w-[1000px] mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-[var(--color-copper)] mb-4">
                  Comparaison
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-800 text-[var(--color-text)] tracking-[-0.03em]">
                  Comparaison détaillée
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden bg-white">
                {/* Header */}
                <div className="grid grid-cols-4 bg-[var(--color-bg-surface)]">
                  <div className="p-5 text-sm text-[var(--color-text-tertiary)] font-medium">Fonctionnalité</div>
                  <div className="p-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Zap size={14} className="text-[var(--color-text-secondary)]" />
                      <span className="text-sm font-display font-600 text-[var(--color-text)]">Standard</span>
                    </div>
                  </div>
                  <div className="p-5 text-center relative">
                    <div className="absolute inset-0 bg-[var(--color-copper)]/[0.06]" />
                    <div className="relative flex items-center justify-center gap-2">
                      <Sparkles size={14} className="text-[var(--color-copper)]" />
                      <span className="text-sm font-display font-600 text-[var(--color-copper)]">ML</span>
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Crown size={14} className="text-[var(--color-copper)]" />
                      <span className="text-sm font-display font-600 text-[var(--color-copper)]">Premium</span>
                    </div>
                  </div>
                </div>

                {/* Rows */}
                {comparisonRows.map((row, i) => (
                  <motion.div
                    key={i}
                    className="grid grid-cols-4 border-t border-[var(--color-border)] hover:bg-[var(--color-bg-surface)]/50 transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.03 * i, duration: 0.3 }}
                  >
                    <div className="p-4 text-sm text-[var(--color-text-secondary)]">{row.feature}</div>
                    {row.values.map((val, j) => (
                      <div
                        key={j}
                        className={cn(
                          "p-4 text-center text-sm",
                          j === 1 && "bg-[var(--color-copper)]/[0.04]"
                        )}
                      >
                        {row.type === "bool" ? (
                          val ? (
                            <Check size={16} className="mx-auto text-emerald-500" />
                          ) : (
                            <X size={16} className="mx-auto text-[var(--color-text-tertiary)]" />
                          )
                        ) : (
                          <span className="text-[var(--color-text-secondary)]">{val as string}</span>
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
                <div className="w-10 h-10 rounded-xl bg-[var(--color-copper)]/10 flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-5 h-5 text-[var(--color-copper)]" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-800 text-[var(--color-text)] tracking-[-0.02em]">
                  Questions fréquentes
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="card-signal p-6 md:p-8">
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
          <div className="relative max-w-[800px] mx-auto">
            <FadeIn>
              <div className="card-signal p-10 md:p-14 text-center overflow-hidden">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-copper)]/10 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-5 h-5 text-[var(--color-copper)]" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-800 text-[var(--color-text)] mb-4 tracking-tight">
                    Besoin d&apos;un volume supérieur ?
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-8 font-light text-sm max-w-[500px] mx-auto leading-relaxed">
                    Pour les entreprises avec plus de 500 séries/mois ou des besoins spécifiques
                    (on-premise, intégrations custom, SLA), contactez-nous pour un devis personnalisé.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <MagneticButton className="btn-copper group px-8 py-4 rounded-xl font-semibold transition-all">
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
