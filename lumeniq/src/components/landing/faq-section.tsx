"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/lib/mock-data";

export function FAQSection() {
  return (
    <section className="py-[120px] px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-3xl md:text-[40px] font-bold mb-16 text-center tracking-[-0.01em]">
          Questions fréquentes
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
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
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-[var(--bg-hover)] transition-colors"
      >
        <span className="text-[15px] font-semibold pr-4">{question}</span>
        <ChevronDown
          size={20}
          className={`text-[var(--text-muted)] transition-transform shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
