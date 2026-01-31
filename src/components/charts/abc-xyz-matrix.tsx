"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MatrixCell {
  abc: "A" | "B" | "C";
  xyz: "X" | "Y" | "Z";
  count: number;
  percentage: number;
}

interface AbcXyzMatrixProps {
  data: MatrixCell[];
  onCellClick?: (abc: string, xyz: string) => void;
  selectedCell?: { abc: string; xyz: string } | null;
  className?: string;
}

const cellColors: Record<string, Record<string, string>> = {
  A: {
    X: "bg-emerald-500/30 hover:bg-emerald-500/40 border-emerald-500/50",
    Y: "bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/30",
    Z: "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30",
  },
  B: {
    X: "bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/30",
    Y: "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30",
    Z: "bg-amber-500/30 hover:bg-amber-500/40 border-amber-500/50",
  },
  C: {
    X: "bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/20",
    Y: "bg-red-500/15 hover:bg-red-500/25 border-red-500/20",
    Z: "bg-red-500/25 hover:bg-red-500/35 border-red-500/40",
  },
};

const xyzLabels = {
  X: { label: "Stable", color: "text-emerald-400" },
  Y: { label: "Variable", color: "text-amber-400" },
  Z: { label: "Erratique", color: "text-red-400" },
};

const abcLabels = {
  A: { label: "Haute valeur", color: "text-emerald-400" },
  B: { label: "Moyenne", color: "text-amber-400" },
  C: { label: "Basse valeur", color: "text-red-400" },
};

export function AbcXyzMatrix({ data, onCellClick, selectedCell, className }: AbcXyzMatrixProps) {
  const getCell = (abc: "A" | "B" | "C", xyz: "X" | "Y" | "Z") => {
    return data.find((d) => d.abc === abc && d.xyz === xyz);
  };

  const abcRows: ("A" | "B" | "C")[] = ["A", "B", "C"];
  const xyzCols: ("X" | "Y" | "Z")[] = ["X", "Y", "Z"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("", className)}
    >
      {/* Header row - XYZ labels */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <div /> {/* Empty corner */}
        {xyzCols.map((xyz) => (
          <div key={xyz} className="text-center py-2">
            <span className={cn("text-sm font-semibold", xyzLabels[xyz].color)}>
              {xyz}
            </span>
            <p className="text-xs text-zinc-500">{xyzLabels[xyz].label}</p>
          </div>
        ))}
      </div>

      {/* Matrix rows */}
      {abcRows.map((abc, rowIndex) => (
        <div key={abc} className="grid grid-cols-4 gap-2 mb-2">
          {/* ABC label */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <span className={cn("text-sm font-semibold", abcLabels[abc].color)}>
                {abc}
              </span>
              <p className="text-xs text-zinc-500">{abcLabels[abc].label}</p>
            </div>
          </div>

          {/* Cells */}
          {xyzCols.map((xyz, colIndex) => {
            const cell = getCell(abc, xyz);
            const isSelected = selectedCell?.abc === abc && selectedCell?.xyz === xyz;

            return (
              <motion.button
                key={`${abc}-${xyz}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: (rowIndex * 3 + colIndex) * 0.05,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCellClick?.(abc, xyz)}
                className={cn(
                  "relative p-4 rounded-xl border transition-all duration-200",
                  cellColors[abc][xyz],
                  isSelected && "ring-2 ring-white/50 scale-105",
                  "cursor-pointer"
                )}
              >
                <div className="text-center">
                  <motion.span
                    className="text-2xl font-bold text-white block"
                    key={cell?.count}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {cell?.count || 0}
                  </motion.span>
                  <span className="text-xs text-zinc-300">
                    {(cell?.percentage ?? 0).toFixed(0)}%
                  </span>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-xl">
                  <span className="text-xs text-white font-medium">
                    {cell?.count || 0} séries
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500/30" />
          <span>Priorité haute</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500/30" />
          <span>Attention</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500/30" />
          <span>Risque</span>
        </div>
      </div>
    </motion.div>
  );
}
