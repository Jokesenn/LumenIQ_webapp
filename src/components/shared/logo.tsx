interface LogoProps {
  size?: number;
  className?: string;
  variant?: "default" | "glow";
}

export function Logo({ size = 32, className = "", variant = "default" }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl ${
        variant === "glow" ? "glow-accent" : ""
      }`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className={`drop-shadow-[0_0_8px_rgba(99,102,241,0.3)] ${className}`}
      >
        {/* Outer hexagon — stroke only */}
        <polygon
          points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
          fill="none"
          stroke="#6366f1"
          strokeWidth="5"
          strokeLinejoin="round"
          opacity="0.8"
        />
        {/* Mid hexagon — translucent fill */}
        <polygon
          points="50,20 78.7,35 78.7,65 50,80 21.3,65 21.3,35"
          fill="#6366f1"
          opacity="0.15"
        />
        {/* Inner hexagon — solid accent */}
        <polygon
          points="50,35 64.4,42.5 64.4,57.5 50,65 35.6,57.5 35.6,42.5"
          fill="#6366f1"
        />
      </svg>
    </div>
  );
}

interface LogoWithTextProps {
  size?: number;
  className?: string;
  variant?: "default" | "glow";
}

export function LogoWithText({ size = 32, className = "", variant = "default" }: LogoWithTextProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={size} variant={variant} />
      <span className="text-xl font-bold tracking-tight text-gradient">
        LumenIQ
      </span>
    </div>
  );
}
