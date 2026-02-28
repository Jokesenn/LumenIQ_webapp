"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface SparklineProps {
  history?: number[] | null
  forecast?: number[] | null
  width?: number
  height?: number
  className?: string
}

export function Sparkline({
  history,
  forecast,
  width = 80,
  height = 24,
  className,
}: SparklineProps) {
  const paths = useMemo(() => {
    const historyData = history ?? []
    const forecastData = forecast ?? []
    const allValues = [...historyData, ...forecastData]

    if (allValues.length < 2) return null

    const min = Math.min(...allValues)
    const max = Math.max(...allValues)
    const range = max - min || 1

    const padding = 2
    const drawWidth = width - padding * 2
    const drawHeight = height - padding * 2

    const toX = (i: number) =>
      padding + (i / (allValues.length - 1)) * drawWidth
    const toY = (v: number) =>
      padding + drawHeight - ((v - min) / range) * drawHeight

    // History polyline
    let historyPath = ""
    if (historyData.length >= 2) {
      historyPath = historyData
        .map(
          (v, i) =>
            `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`
        )
        .join(" ")
    }

    // Forecast polyline — starts from last history point for continuity
    let forecastPath = ""
    let forecastAreaPath = ""
    if (forecastData.length >= 1) {
      const startIndex =
        historyData.length > 0 ? historyData.length - 1 : 0
      const startValue =
        historyData.length > 0
          ? historyData[historyData.length - 1]
          : forecastData[0]

      const points = [
        { x: toX(startIndex), y: toY(startValue) },
        ...forecastData.map((v, i) => ({
          x: toX(historyData.length + i),
          y: toY(v),
        })),
      ]

      forecastPath = points
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`
        )
        .join(" ")

      // Area fill: close path along the bottom
      const bottomY = height - padding
      forecastAreaPath =
        forecastPath +
        ` L${points[points.length - 1].x.toFixed(1)},${bottomY}` +
        ` L${points[0].x.toFixed(1)},${bottomY} Z`
    }

    return { historyPath, forecastPath, forecastAreaPath }
  }, [history, forecast, width, height])

  if (!paths) {
    return (
      <span
        className={cn(
          "text-xs text-zinc-600 inline-flex items-center justify-center",
          className
        )}
        style={{ width, height }}
      >
        —
      </span>
    )
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Sparkline"
    >
      {paths.forecastAreaPath && (
        <path
          d={paths.forecastAreaPath}
          fill="rgba(139, 92, 246, 0.15)"
          stroke="none"
        />
      )}
      {paths.historyPath && (
        <path
          d={paths.historyPath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      {paths.forecastPath && (
        <path
          d={paths.forecastPath}
          fill="none"
          stroke="rgba(139, 92, 246, 0.6)"
          strokeWidth={1.5}
          strokeDasharray="3 2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
