"use client";

import type { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GLOSSARY } from "@/lib/glossary";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  /** Key into the GLOSSARY record, or pass `content` directly */
  termKey?: string;
  /** Inline content (takes priority over termKey) */
  content?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function HelpTooltip({ termKey, content, side = "top", className }: HelpTooltipProps) {
  const tooltipContent = content ?? (termKey ? GLOSSARY[termKey] : null);
  if (!tooltipContent) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center text-white/40 hover:text-white/70 transition-colors",
            className
          )}
          aria-label="Aide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={8}
        className="max-w-xs bg-[#1e1e2e] border border-white/10 text-white p-3"
      >
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}
