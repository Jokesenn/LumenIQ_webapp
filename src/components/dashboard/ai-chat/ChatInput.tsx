"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="border-t border-white/10 bg-zinc-900/50 p-4 flex gap-3 items-end shrink-0">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Posez votre question..."
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 resize-none outline-none leading-relaxed disabled:opacity-50"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 h-8 w-8 p-0 shrink-0"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
