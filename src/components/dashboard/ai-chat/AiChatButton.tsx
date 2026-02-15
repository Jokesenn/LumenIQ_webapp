"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AiChatButton({ onClick, isOpen }: AiChatButtonProps) {
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
            "fixed bottom-6 right-6 z-50",
            "flex items-center justify-center",
            "w-14 h-14 rounded-full",
            "bg-violet-600 hover:bg-violet-500",
            "text-white shadow-lg shadow-violet-500/25",
            "transition-colors cursor-pointer",
            "ai-fab-pulse"
          )}
          aria-label="Ouvrir l'assistant IA"
        >
          <motion.span
            whileHover={{ rotate: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
