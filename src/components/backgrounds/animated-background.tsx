"use client";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dot pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />

      {/* Grain texture */}
      <div className="absolute inset-0 grain" />
    </div>
  );
}
