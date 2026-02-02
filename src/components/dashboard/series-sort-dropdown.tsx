"use client";

import { ArrowDownAZ, TrendingUp, BarChart3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SeriesSortOption } from "@/types/forecast";

const SORT_OPTIONS: { value: SeriesSortOption; label: string; icon: typeof ArrowDownAZ }[] = [
  { value: "alpha", label: "Alphabétique", icon: ArrowDownAZ },
  { value: "smape", label: "Performance (SMAPE)", icon: TrendingUp },
  { value: "abc", label: "Classe ABC/XYZ", icon: BarChart3 },
];

interface SeriesSortDropdownProps {
  value: SeriesSortOption;
  onChange: (value: SeriesSortOption) => void;
}

export function SeriesSortDropdown({ value, onChange }: SeriesSortDropdownProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SeriesSortOption)}>
      <SelectTrigger className="w-[180px] bg-white/5 border-white/[0.08] text-zinc-300 h-9 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <SelectItem key={opt.value} value={opt.value}>
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-zinc-400" />
                <span>{opt.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
