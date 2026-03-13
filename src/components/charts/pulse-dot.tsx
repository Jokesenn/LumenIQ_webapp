"use client";

interface PulseDotProps {
  cx?: number;
  cy?: number;
  index?: number;
  lastIndex?: number;
  fill?: string;
}

export function PulseDot({ cx, cy, index, lastIndex, fill }: PulseDotProps) {
  if (cx == null || cy == null) return null;

  const isLast = index === lastIndex;

  if (!isLast) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={2.5}
        fill={fill || "var(--color-chart-actual)"}
        stroke="none"
      />
    );
  }

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="var(--color-copper)"
        opacity={0.12}
      />
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="var(--color-copper)"
      />
    </g>
  );
}
