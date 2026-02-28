"use client"

import { X } from "lucide-react"
import type { SeriesFilters } from "./series-filters-dropdown"
import { DEFAULT_FILTERS } from "./series-filters-dropdown"
import { CLUSTER_MAP } from "./portfolio-view"
import type { ClusterId } from "./portfolio-view"

const ABC_SHORT: Record<string, string> = {
  A: "Classe A",
  B: "Classe B",
  C: "Classe C",
}

const XYZ_SHORT: Record<string, string> = {
  X: "Classe X",
  Y: "Classe Y",
  Z: "Classe Z",
}

interface ActiveFiltersBarProps {
  filters: SeriesFilters
  onFiltersChange: (filters: SeriesFilters) => void
  selectedCell: { abc: string; xyz: string } | null
  onClearCell: () => void
  modelFilter: string | null
  onClearModel: () => void
}

export function ActiveFiltersBar({
  filters,
  onFiltersChange,
  selectedCell,
  onClearCell,
  modelFilter,
  onClearModel,
}: ActiveFiltersBarProps) {
  const hasDropdownFilters =
    filters.attention ||
    filters.modelChanged ||
    filters.abcClasses.length > 0 ||
    filters.xyzClasses.length > 0 ||
    !!filters.cluster
  const hasAny = hasDropdownFilters || !!selectedCell || !!modelFilter

  if (!hasAny) return null

  const clearAll = () => {
    onFiltersChange(DEFAULT_FILTERS)
    onClearCell()
    onClearModel()
  }

  return (
    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-white/5 rounded-lg flex-wrap">
      <span className="text-sm text-zinc-500">Filtres :</span>

      {selectedCell && (
        <FilterChip
          label={`${selectedCell.abc}-${selectedCell.xyz}`}
          onRemove={onClearCell}
        />
      )}

      {modelFilter && (
        <FilterChip label={modelFilter} onRemove={onClearModel} />
      )}

      {filters.attention && (
        <FilterChip
          label="Fiabilité faible"
          onRemove={() =>
            onFiltersChange({ ...filters, attention: false })
          }
        />
      )}

      {filters.modelChanged && (
        <FilterChip
          label="Méthode adaptée"
          onRemove={() =>
            onFiltersChange({ ...filters, modelChanged: false })
          }
        />
      )}

      {filters.abcClasses.map((cls) => (
        <FilterChip
          key={`abc-${cls}`}
          label={ABC_SHORT[cls] ?? cls}
          onRemove={() =>
            onFiltersChange({
              ...filters,
              abcClasses: filters.abcClasses.filter((c) => c !== cls),
            })
          }
        />
      ))}

      {filters.xyzClasses.map((cls) => (
        <FilterChip
          key={`xyz-${cls}`}
          label={XYZ_SHORT[cls] ?? cls}
          onRemove={() =>
            onFiltersChange({
              ...filters,
              xyzClasses: filters.xyzClasses.filter((c) => c !== cls),
            })
          }
        />
      ))}

      {filters.cluster && (
        <FilterChip
          label={CLUSTER_MAP.get(filters.cluster as ClusterId)?.label ?? filters.cluster}
          onRemove={() =>
            onFiltersChange({ ...filters, cluster: null })
          }
        />
      )}

      <button
        className="ml-auto text-xs text-zinc-500 hover:text-white transition-colors"
        onClick={clearAll}
      >
        Tout effacer
      </button>
    </div>
  )
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-white/10 text-zinc-300 rounded-md">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-white transition-colors"
        aria-label={`Retirer le filtre ${label}`}
      >
        <X className="size-3" />
      </button>
    </span>
  )
}
