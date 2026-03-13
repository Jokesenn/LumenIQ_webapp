"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUrgentCount } from "@/hooks/use-actions";

interface ActionsFabProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ActionsFab({ onClick, isOpen }: ActionsFabProps) {
  const urgentCount = useUrgentCount();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={onClick}
          className={cn(
            "fixed bottom-[88px] right-6 z-50",
            "flex items-center justify-center",
            "w-14 h-14 rounded-full",
            "bg-[var(--color-copper)] hover:bg-[var(--color-copper-hover)]",
            "text-white shadow-lg shadow-[var(--color-copper)]/25",
            "transition-colors cursor-pointer"
          )}
          aria-label="Ouvrir les actions"
        >
          <Zap className="w-6 h-6" />

          {/* Badge counter */}
          {urgentCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold rounded-full bg-red-500 text-white ring-2 ring-[var(--color-bg)]">
              {urgentCount}
            </span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
