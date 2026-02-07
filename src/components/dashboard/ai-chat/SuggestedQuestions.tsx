"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { JobSummarySnapshot, SuggestedQuestion } from "./types";

interface SuggestedQuestionsProps {
  summary: JobSummarySnapshot | null;
  xyzZCount: number;
  onSelect: (question: string) => void;
  visible: boolean;
}

function buildSuggestions(
  summary: JobSummarySnapshot | null,
  xyzZCount: number
): SuggestedQuestion[] {
  if (!summary) return [];

  const suggestions: SuggestedQuestion[] = [];

  // WAPE > 15% (stored as ratio 0-1 in DB)
  if (summary.global_wape != null && summary.global_wape > 0.15) {
    suggestions.push({
      label: "Pourquoi la précision est faible ?",
      question: "Pourquoi la précision est faible ?",
    });
  }

  // Bias > 10%
  if (
    summary.global_bias_pct != null &&
    Math.abs(summary.global_bias_pct) > 0.10
  ) {
    suggestions.push({
      label: "Pourquoi le biais est élevé ?",
      question: "Pourquoi le biais est élevé ?",
    });
  }

  // Z-class series
  if (xyzZCount > 0) {
    suggestions.push({
      label: "Comment améliorer les séries Z ?",
      question: "Comment améliorer les séries Z ?",
    });
  }

  // Multiple champion models = model changes
  if (
    summary.winner_models &&
    Object.keys(summary.winner_models).length > 1
  ) {
    suggestions.push({
      label: "Pourquoi certains modèles ont changé ?",
      question: "Pourquoi certains modèles ont changé ?",
    });
  }

  // Fallback: always fill up to 3
  const fallback: SuggestedQuestion = {
    label: "Quels SKUs surveiller en priorité ?",
    question: "Quels SKUs surveiller en priorité ?",
  };

  if (suggestions.length < 3) {
    suggestions.push(fallback);
  }

  return suggestions.slice(0, 3);
}

export function SuggestedQuestions({
  summary,
  xyzZCount,
  onSelect,
  visible,
}: SuggestedQuestionsProps) {
  const suggestions = useMemo(
    () => buildSuggestions(summary, xyzZCount),
    [summary, xyzZCount]
  );

  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-2 px-6 py-3">
            {suggestions.map((s) => (
              <Button
                key={s.question}
                variant="outline"
                size="sm"
                onClick={() => onSelect(s.question)}
                className="text-xs text-white/70 border-white/10 hover:bg-white/5 hover:text-white h-auto py-1.5 px-3"
              >
                {s.label}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
