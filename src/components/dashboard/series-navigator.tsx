"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeriesSortDropdown } from "./series-sort-dropdown";
import { SeriesQuickSelect } from "./series-quick-select";
import type { SeriesListItem, SeriesSortOption } from "@/types/forecast";

interface SeriesNavigatorProps {
  sortedSeries: SeriesListItem[];
  currentSeriesId: string;
  sortOption: SeriesSortOption;
  onSortChange: (option: SeriesSortOption) => void;
  hasPrevious: boolean;
  hasNext: boolean;
  previousSeries: SeriesListItem | null;
  nextSeries: SeriesListItem | null;
  onPrevious: () => void;
  onNext: () => void;
  onSelectSeries: (seriesId: string) => void;
  currentIndex: number;
}

export function SeriesNavigator({
  sortedSeries,
  currentSeriesId,
  sortOption,
  onSortChange,
  hasPrevious,
  hasNext,
  previousSeries,
  nextSeries,
  onPrevious,
  onNext,
  onSelectSeries,
  currentIndex,
}: SeriesNavigatorProps) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Prev / Position / Next */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onPrevious}
        disabled={!hasPrevious}
        title={previousSeries ? `Précédent : ${previousSeries.series_id}` : undefined}
        className="text-zinc-400 hover:text-white disabled:opacity-30"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <span className="text-xs text-zinc-500 tabular-nums min-w-[3.5rem] text-center">
        {currentIndex >= 0 ? `${currentIndex + 1} / ${sortedSeries.length}` : "—"}
      </span>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onNext}
        disabled={!hasNext}
        title={nextSeries ? `Suivant : ${nextSeries.series_id}` : undefined}
        className="text-zinc-400 hover:text-white disabled:opacity-30"
      >
        <ChevronRight className="size-4" />
      </Button>

      {/* Separator */}
      <div className="w-px h-5 bg-white/10 mx-1" />

      {/* Quick Select */}
      <SeriesQuickSelect
        series={sortedSeries}
        currentSeriesId={currentSeriesId}
        onSelect={onSelectSeries}
      />

      {/* Sort Dropdown */}
      <SeriesSortDropdown value={sortOption} onChange={onSortChange} />
    </div>
  );
}
