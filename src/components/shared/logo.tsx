interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none"
      className={className}
    >
      <polygon
        points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-[var(--accent)]"
      />
      <polygon
        points="50,20 78.7,35 78.7,65 50,80 21.3,65 21.3,35"
        fill="currentColor"
        opacity="0.3"
        className="text-[var(--accent)]"
      />
      <polygon
        points="50,35 64.4,42.5 64.4,57.5 50,65 35.6,57.5 35.6,42.5"
        fill="currentColor"
        className="text-[var(--accent)]"
      />
    </svg>
  );
}

export function LogoWithText({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <Logo size={size} />
      <span className="text-xl font-bold tracking-tight">LumenIQ</span>
    </div>
  );
}
