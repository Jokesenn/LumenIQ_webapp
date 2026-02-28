"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { faqItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const midpoint = Math.ceil(faqItems.length / 2);
  const leftColumn = faqItems.slice(0, midpoint);
  const rightColumn = faqItems.slice(midpoint);

  return (
    <section id="faq" aria-label="Questions frequentes" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-zinc-925" />
      <div className="absolute inset-0 bg-hex-pattern opacity-30" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="relative mb-16">
          <div className="absolute -top-8 right-0 section-number hidden lg:block">06</div>
          <div className="relative z-10 text-center">
            <FadeIn>
              <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                FAQ
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-[-0.03em]">
                <span className="text-gradient">Questions frequentes</span>
              </h2>
            </FadeIn>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {leftColumn.map((item, index) => (
              <FadeIn key={index} delay={0.05 * index}>
                <FAQItem id={item.id} question={item.question} answer={item.answer} />
              </FadeIn>
            ))}
          </div>
          <div className="space-y-3">
            {rightColumn.map((item, index) => (
              <FadeIn key={index} delay={0.05 * (index + midpoint)}>
                <FAQItem id={item.id} question={item.question} answer={item.answer} />
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Contact link */}
        <FadeIn delay={0.3}>
          <p className="text-center text-sm text-zinc-500 mt-12">
            Vous ne trouvez pas votre reponse ?{" "}
            <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 animated-underline">
              Contactez-nous
            </Link>
          </p>
        </FadeIn>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqItems.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.answer
                }
              }))
            })
          }}
        />
      </div>
    </section>
  );
}

interface FAQItemProps {
  id: string;
  question: string;
  answer: string;
}

function FAQItem({ id, question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      id={id}
      className={cn(
        "rounded-xl border overflow-hidden transition-all duration-300",
        open
          ? "border-indigo-500/20 bg-indigo-500/[0.03]"
          : "border-white/[0.04] bg-zinc-900/30 hover:border-white/[0.06] hover:bg-zinc-900/40"
      )}
      layout
    >
      <h3 className="m-0">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={`${id}-answer`}
          className="w-full p-5 flex justify-between items-center text-left gap-4"
        >
          <span className="text-sm font-semibold text-white">{question}</span>
          <motion.div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
              open ? "bg-indigo-500/15" : "bg-white/[0.04]"
            )}
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className={cn("w-3.5 h-3.5 transition-colors", open ? "text-indigo-400" : "text-zinc-500")} />
          </motion.div>
        </button>
      </h3>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div id={`${id}-answer`} role="region" aria-labelledby={id} className="px-5 pb-5">
              <p className="text-sm text-zinc-400 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
