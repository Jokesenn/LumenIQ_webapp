"use client";

import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SynthesisAccordion } from "./synthesis-accordion";

interface Synthesis {
  type: string;
  title: string;
  content: string;
  created_at: string;
}

interface SynthesisCardProps {
  synthesis: Synthesis | null;
  jobId?: string;
  skuList?: string[];
  onRegenerate?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function SynthesisCard({
  synthesis,
  jobId,
  skuList,
  onRegenerate,
  isLoading = false,
  className,
}: SynthesisCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (synthesis?.content) {
      navigator.clipboard.writeText(synthesis.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Synthèse IA</h3>
            {synthesis && (
              <p className="text-xs text-zinc-500">
                Générée le {new Date(synthesis.created_at).toLocaleDateString("fr-FR")}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {synthesis && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-zinc-400 hover:text-white"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isLoading}
              className="text-zinc-400 hover:text-white"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {synthesis ? (
        <SynthesisAccordion
          content={synthesis.content}
          jobId={jobId}
          skuList={skuList}
        />
      ) : isLoading ? (
        <div className="space-y-3">
          <div className="h-4 bg-white/5 rounded animate-pulse" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-zinc-500 mb-4">Aucune synthèse disponible</p>
          {onRegenerate && (
            <Button
              onClick={onRegenerate}
              className="bg-indigo-500 hover:bg-indigo-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Générer une synthèse
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
