"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";
import { faqItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const midpoint = Math.ceil(faqItems.length / 2);
  const leftColumn = faqItems.slice(0, midpoint);
  const rightColumn = faqItems.slice(midpoint);

  return (
    <section id="faq" aria-label="Questions fréquentes" className="relative py-20 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <FadeIn>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-zinc-300">FAQ</span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gradient">Questions fréquentes</span>
            </h2>
          </FadeIn>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid md:grid-cols-2 gap-4">
          <StaggerChildren staggerDelay={0.1} className="space-y-3">
            {leftColumn.map((item, index) => (
              <StaggerItem key={index}>
                <FAQItem id={item.id} question={item.question} answer={item.answer} />
              </StaggerItem>
            ))}
          </StaggerChildren>
          <StaggerChildren staggerDelay={0.1} className="space-y-3">
            {rightColumn.map((item, index) => (
              <StaggerItem key={index}>
                <FAQItem id={item.id} question={item.question} answer={item.answer} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>

        {/* Contact link */}
        <FadeIn delay={0.3}>
          <p className="text-center text-sm text-zinc-400 mt-10">
            Vous ne trouvez pas votre réponse ?{" "}
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
        "rounded-2xl border overflow-hidden transition-colors",
        open
          ? "border-indigo-500/30 border-l-2 border-l-indigo-500 bg-white/5"
          : "border-white/5 bg-zinc-900/50 hover:border-white/10"
      )}
      layout
    >
      <h3 className="m-0">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={`${id}-answer`}
          className="w-full p-5 flex justify-between items-center text-left"
        >
          <span className="text-sm font-semibold text-white pr-4">{question}</span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
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
              <p className="text-sm text-zinc-300 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
