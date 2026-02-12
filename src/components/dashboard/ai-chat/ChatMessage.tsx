"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/dashboard/markdown-renderer";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "./types";

interface ChatMessageProps {
  message: ChatMessageType;
  onRetry?: () => void;
}

export function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] px-4 py-2.5",
          isUser
            ? "bg-gradient-to-br from-violet-500/20 to-indigo-500/10 text-white rounded-2xl rounded-br-md"
            : isError
              ? "bg-red-500/10 border border-red-500/30 text-white rounded-2xl rounded-bl-md backdrop-blur-sm"
              : "bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] text-white rounded-2xl rounded-bl-md"
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <MarkdownRenderer content={message.content} className="text-sm" />
        )}

        {isError && onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="mt-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 h-auto px-2 py-1 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1.5" />
            Réessayer
          </Button>
        )}
      </div>
    </motion.div>
  );
}
