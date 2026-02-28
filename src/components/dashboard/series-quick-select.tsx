"use client";

import { useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { SeriesListItem } from "@/types/forecast";

const classColors: Record<string, string> = {
  A: "bg-emerald-500/20 text-emerald-400",
  B: "bg-amber-500/20 text-amber-400",
  C: "bg-red-500/20 text-red-400",
};

interface SeriesQuickSelectProps {
  series: SeriesListItem[];
  currentSeriesId: string;
  onSelect: (seriesId: string) => void;
}

export function SeriesQuickSelect({
  series,
  currentSeriesId,
  onSelect,
}: SeriesQuickSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white gap-1.5 h-8"
        >
          <ChevronsUpDown className="size-4" />
          <span className="hidden sm:inline">Aller à...</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 bg-zinc-900 border-white/[0.08] backdrop-blur-xl" align="end">
        <Command>
          <CommandInput placeholder="Rechercher une série..." />
          <CommandEmpty>Aucune série trouvée</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {series.map((s) => {
                const isCurrent = s.series_id === currentSeriesId;
                const scoreDisplay =
                  s.champion_score != null
                    ? s.champion_score.toFixed(1)
                    : "—";

                return (
                  <CommandItem
                    key={s.series_id}
                    value={s.series_id}
                    onSelect={() => {
                      onSelect(s.series_id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between",
                      isCurrent && "bg-indigo-500/10"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isCurrent ? (
                        <Check className="size-4 text-indigo-400 shrink-0" />
                      ) : (
                        <div className="size-4 shrink-0" />
                      )}
                      <span
                        className={cn(
                          "font-medium truncate",
                          isCurrent ? "text-indigo-400" : "text-white"
                        )}
                      >
                        {s.series_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs shrink-0 ml-2">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded",
                          classColors[s.abc_class] ?? "bg-zinc-500/20 text-zinc-400"
                        )}
                      >
                        {s.abc_class}
                      </span>
                      <span className="text-zinc-500 tabular-nums w-12 text-right">
                        {scoreDisplay}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
