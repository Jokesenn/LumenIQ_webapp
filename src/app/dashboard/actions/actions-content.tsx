"use client";

import { FadeIn } from "@/components/animations";
import { Zap } from "lucide-react";
import { ActionsBoard } from "@/components/dashboard/actions-board";

export function ActionsPageContent() {
  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="dash-page-title">Actions</h1>
            <p className="text-sm text-zinc-400">
              Recommandations issues de vos prévisions
            </p>
          </div>
        </div>

        <ActionsBoard mode="page" />
      </div>
    </FadeIn>
  );
}
