"use client"

import { Settings2, Target, Zap, Shield } from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { HorizonMonths, ConfidenceInterval } from "@/types/preferences"
import { HORIZON_OPTIONS, CONFIDENCE_OPTIONS } from "@/types/preferences"

interface ForecastOptionsProps {
  horizonMonths: HorizonMonths
  onHorizonChange: (value: HorizonMonths) => void
  gatingEnabled: boolean
  onGatingChange: (value: boolean) => void
  confidenceInterval: ConfidenceInterval
  onConfidenceChange: (value: ConfidenceInterval) => void
}

export function ForecastOptions({
  horizonMonths,
  onHorizonChange,
  gatingEnabled,
  onGatingChange,
  confidenceInterval,
  onConfidenceChange,
}: ForecastOptionsProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="options"
        className="border-b-0 bg-white/5 rounded-lg border border-white/[0.08]"
      >
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <Settings2 size={16} className="text-zinc-500" />
            <span className="text-sm font-medium text-zinc-300">
              Options de calcul
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-0">
          <div className="space-y-0">
            {/* Horizon */}
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Target size={16} className="text-indigo-400" />
                <div>
                  <p className="text-sm text-zinc-300">Horizon de forecast</p>
                  <p className="text-xs text-zinc-500">
                    Nombre de mois à prédire
                  </p>
                </div>
              </div>
              <Select
                value={String(horizonMonths)}
                onValueChange={(v) => onHorizonChange(Number(v) as HorizonMonths)}
              >
                <SelectTrigger className="w-[110px] bg-white/5 border-white/[0.08] text-white text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HORIZON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gating */}
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Zap size={16} className="text-amber-400" />
                <div>
                  <p className="text-sm text-zinc-300">Gating (mode rapide)</p>
                  <p className="text-xs text-zinc-500">
                    Pré-filtre les modèles pour accélérer le calcul
                  </p>
                </div>
              </div>
              <Switch
                checked={gatingEnabled}
                onCheckedChange={onGatingChange}
                className="data-[state=checked]:bg-indigo-500"
              />
            </div>

            {/* Confiance */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-emerald-400" />
                <div>
                  <p className="text-sm text-zinc-300">
                    Intervalle de confiance
                  </p>
                  <p className="text-xs text-zinc-500">
                    Largeur des bornes de prévision
                  </p>
                </div>
              </div>
              <Select
                value={String(confidenceInterval)}
                onValueChange={(v) =>
                  onConfidenceChange(Number(v) as ConfidenceInterval)
                }
              >
                <SelectTrigger className="w-[90px] bg-white/5 border-white/[0.08] text-white text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONFIDENCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
