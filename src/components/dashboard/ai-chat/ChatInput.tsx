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
      <div className="bg-white border-t border-[var(--color-border)] p-4 flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-[var(--color-text)] text-sm placeholder-[var(--color-text-tertiary)] resize-none outline-none leading-relaxed disabled:opacity-50 rounded-lg px-0 py-0 ring-0 focus:ring-1 focus:ring-[var(--color-copper)]/30 transition-shadow duration-300"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={cn(
            "h-8 w-8 p-0 shrink-0 transition-all duration-200",
            value.trim() && !disabled
              ? "text-[var(--color-copper)] bg-[var(--color-copper-bg)] hover:bg-[var(--color-copper-bg)] hover:shadow-[0_0_12px_rgba(180,83,9,0.3)]"
              : "text-[var(--color-copper)]/50 hover:text-[var(--color-copper)] hover:bg-[var(--color-copper-bg)]"
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
