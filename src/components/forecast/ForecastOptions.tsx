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
        className="border-b-0 bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border)]"
      >
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <Settings2 size={16} className="text-[var(--color-text-tertiary)]" />
            <span className="text-sm font-medium text-[var(--color-text)]">
              Options de calcul
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-0">
          <div className="space-y-0">
            {/* Horizon */}
            <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <Target size={16} className="text-amber-700" />
                <div>
                  <p className="text-sm text-[var(--color-text)]">Horizon de prévision</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Nombre de périodes à prédire
                  </p>
                </div>
              </div>
              <Select
                value={String(horizonMonths)}
                onValueChange={(v) => onHorizonChange(Number(v) as HorizonMonths)}
              >
                <SelectTrigger className="w-[110px] bg-[var(--color-bg-surface)] border-[var(--color-border)] text-[var(--color-text)] text-sm h-8">
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
            <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <Zap size={16} className="text-amber-400" />
                <div>
                  <p className="text-sm text-[var(--color-text)]">Mode accéléré</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Pré-sélectionne les modèles les plus adaptés pour un calcul plus rapide
                  </p>
                </div>
              </div>
              <Switch
                checked={gatingEnabled}
                onCheckedChange={onGatingChange}
                className="data-[state=checked]:bg-[var(--color-copper)]"
              />
            </div>

            {/* Confiance */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-emerald-400" />
                <div>
                  <p className="text-sm text-[var(--color-text)]">
                    Intervalle de confiance
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
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
                <SelectTrigger className="w-[90px] bg-[var(--color-bg-surface)] border-[var(--color-border)] text-[var(--color-text)] text-sm h-8">
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
