"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGaugeProps {
  value: number;           // 0-100 (pourcentage)
  maxValue?: number;       // Pour calculer le % si value n'est pas un %
  label: string;
  unit?: string;           // "%", "€", "min", etc.
  size?: "sm" | "md" | "lg";
  thresholds?: {
    good: number;          // En dessous = vert
    warning: number;       // En dessous = orange, au dessus = rouge
  };
  showTrend?: {
    value: string;
    direction: "up" | "down";
  };
  className?: string;
}

const sizes = {
  sm: { width: 80, stroke: 6, text: "text-lg" },
  md: { width: 120, stroke: 8, text: "text-2xl" },
  lg: { width: 160, stroke: 10, text: "text-3xl" },
};

export function AnimatedGauge({
  value,
  maxValue = 100,
  label,
  unit = "%",
  size = "md",
  thresholds = { good: 10, warning: 20 },
  showTrend,
  className,
}: AnimatedGaugeProps) {
  const { width, stroke, text } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * 2 * Math.PI;

  const percentage = maxValue !== 100 ? (value / maxValue) * 100 : value;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Animation du pourcentage
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(spring, (v) => Math.round(v * 10) / 10);
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    spring.set(clampedPercentage);
    return displayValue.on("change", (v) => setDisplayedValue(v));
  }, [clampedPercentage, spring, displayValue]);

  // Couleur basée sur les seuils (en %)
  const getColor = () => {
    if (clampedPercentage <= thresholds.good) return { stroke: "stroke-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500" };
    if (clampedPercentage <= thresholds.warning) return { stroke: "stroke-amber-500", text: "text-amber-400", bg: "bg-amber-500" };
    return { stroke: "stroke-red-500", text: "text-red-400", bg: "bg-red-500" };
  };

  const colors = getColor();
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width, height: width }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={width} height={width}>
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-white/5"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            className={colors.stroke}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("font-bold tabular-nums", text, colors.text)}
          >
            {displayedValue.toFixed(1)}{unit}
          </motion.span>
        </div>

        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-20",
            colors.bg
          )}
        />
      </div>

      {/* Label */}
      <span className="mt-3 text-sm text-zinc-400">{label}</span>

      {/* Trend */}
      {showTrend && (
        <div className={cn(
          "flex items-center gap-1 text-xs mt-1",
          showTrend.direction === "down" ? "text-emerald-400" : "text-red-400"
        )}>
          <span>{showTrend.direction === "down" ? "↓" : "↑"}</span>
          <span>{showTrend.value}</span>
        </div>
      )}
    </div>
  );
}
