"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0">
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      <div className="bg-zinc-900/30 backdrop-blur-xl p-4 flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 resize-none outline-none leading-relaxed disabled:opacity-50 rounded-lg px-0 py-0 ring-0 focus:ring-1 focus:ring-indigo-500/30 transition-shadow duration-300"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={cn(
            "h-8 w-8 p-0 shrink-0 transition-all duration-200",
            value.trim() && !disabled
              ? "text-violet-300 bg-indigo-500/20 hover:bg-indigo-500/30 hover:shadow-[0_0_12px_rgba(139,92,246,0.3)]"
              : "text-violet-400/50 hover:text-violet-300 hover:bg-violet-500/10"
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
