"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

export interface SeriesFilters {
  attention: boolean
  modelChanged: boolean
  abcClasses: ("A" | "B" | "C")[]
  xyzClasses: ("X" | "Y" | "Z")[]
}

export const DEFAULT_FILTERS: SeriesFilters = {
  attention: false,
  modelChanged: false,
  abcClasses: [],
  xyzClasses: [],
}

export interface SeriesFilterCounts {
  attention: number
  modelChanged: number
  abc: Record<string, number>
  xyz: Record<string, number>
}

const ABC_LABELS: Record<string, string> = {
  A: "A - Haute",
  B: "B - Moyenne",
  C: "C - Basse",
}

const XYZ_LABELS: Record<string, string> = {
  X: "X - Stable",
  Y: "Y - Variable",
  Z: "Z - Erratique",
}

interface SeriesFiltersDropdownProps {
  filters: SeriesFilters
  onFiltersChange: (filters: SeriesFilters) => void
  counts: SeriesFilterCounts
}

export function SeriesFiltersDropdown({
  filters,
  onFiltersChange,
  counts,
}: SeriesFiltersDropdownProps) {
  const activeCount =
    (filters.attention ? 1 : 0) +
    (filters.modelChanged ? 1 : 0) +
    filters.abcClasses.length +
    filters.xyzClasses.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 bg-white/5 border-white/[0.08] text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          <Filter className="size-4" />
          Filtres
          {activeCount > 0 && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold bg-indigo-500 text-white rounded-full">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 bg-zinc-900 border-white/[0.08] backdrop-blur-xl"
        align="end"
      >
        <div className="p-3 space-y-3">
          {/* Statut */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Statut
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={filters.attention}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, attention: !!checked })
                  }
                />
                <span className="text-sm text-zinc-300 group-hover:text-white">
                  Fiabilité faible
                </span>
                <span className="ml-auto text-xs text-zinc-500">
                  ({counts.attention})
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={filters.modelChanged}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, modelChanged: !!checked })
                  }
                />
                <span className="text-sm text-zinc-300 group-hover:text-white">
                  Méthode adaptée
                </span>
                <span className="ml-auto text-xs text-zinc-500">
                  ({counts.modelChanged})
                </span>
              </label>
            </div>
          </div>

          <div className="border-t border-white/[0.06]" />

          {/* Classe ABC */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Classe ABC
            </h4>
            <div className="space-y-2">
              {(["A", "B", "C"] as const).map((cls) => (
                <label
                  key={cls}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.abcClasses.includes(cls)}
                    onCheckedChange={(checked) => {
                      const newClasses = checked
                        ? [...filters.abcClasses, cls]
                        : filters.abcClasses.filter((c) => c !== cls)
                      onFiltersChange({ ...filters, abcClasses: newClasses })
                    }}
                  />
                  <span className="text-sm text-zinc-300 group-hover:text-white">
                    {ABC_LABELS[cls]}
                  </span>
                  <span className="ml-auto text-xs text-zinc-500">
                    ({counts.abc[cls] ?? 0})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.06]" />

          {/* Classe XYZ */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Classe XYZ
            </h4>
            <div className="space-y-2">
              {(["X", "Y", "Z"] as const).map((cls) => (
                <label
                  key={cls}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.xyzClasses.includes(cls)}
                    onCheckedChange={(checked) => {
                      const newClasses = checked
                        ? [...filters.xyzClasses, cls]
                        : filters.xyzClasses.filter((c) => c !== cls)
                      onFiltersChange({ ...filters, xyzClasses: newClasses })
                    }}
                  />
                  <span className="text-sm text-zinc-300 group-hover:text-white">
                    {XYZ_LABELS[cls]}
                  </span>
                  <span className="ml-auto text-xs text-zinc-500">
                    ({counts.xyz[cls] ?? 0})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Réinitialiser */}
          {activeCount > 0 && (
            <>
              <div className="border-t border-white/[0.06]" />
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-zinc-500 hover:text-white"
                onClick={() => onFiltersChange(DEFAULT_FILTERS)}
              >
                Réinitialiser
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
