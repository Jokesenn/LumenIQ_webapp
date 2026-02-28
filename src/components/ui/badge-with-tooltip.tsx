"use client";

import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BadgeWithTooltipProps {
  children: ReactNode;
  tooltip: ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function BadgeWithTooltip({
  children,
  tooltip,
  className,
  side = "top",
}: BadgeWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("cursor-help", className)}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={8}
        className="max-w-xs bg-[#1e1e2e] border border-white/10 text-white p-3"
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
