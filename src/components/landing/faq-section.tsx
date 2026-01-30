"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";
import { faqItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function FAQSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="text-center mb-20">
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

        <StaggerChildren staggerDelay={0.1} className="space-y-3">
          {faqItems.map((item, index) => (
            <StaggerItem key={index}>
              <FAQItem question={item.question} answer={item.answer} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className={cn(
        "rounded-2xl border overflow-hidden transition-colors",
        open ? "border-indigo-500/30 bg-white/5" : "border-white/5 bg-zinc-900/50 hover:border-white/10"
      )}
      layout
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 flex justify-between items-center text-left"
      >
        <span className="text-[15px] font-semibold text-white pr-4">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <ChevronDown className="w-5 h-5 text-zinc-500 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="px-6 pb-6">
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
