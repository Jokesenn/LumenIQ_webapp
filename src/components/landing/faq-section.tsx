"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/lib/mock-data";

export function FAQSection() {
  return (
    <section className="py-[120px] px-6 bg-zinc-950/50">
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-3xl md:text-[40px] font-bold mb-16 text-center tracking-[-0.01em] text-gradient">
          Questions fréquentes
        </h2>

        <div className="space-y-3">
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
    <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-white/5 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-white/10 transition-colors duration-200"
      >
        <span className="text-[15px] font-semibold text-white pr-4">{question}</span>
        <ChevronDown
          size={20}
          className={`text-zinc-500 transition-transform duration-200 shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-zinc-400 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
