interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-ascension.svg"
        alt="LumenIQ"
        width={size}
        height={size}
      />
    </div>
  );
}

interface LogoWithTextProps {
  size?: number;
  className?: string;
}

export function LogoWithText({ size = 32, className = "" }: LogoWithTextProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={size} />
      <span className="text-xl font-display font-black tracking-[-0.03em] text-[var(--color-text)]">
        LumenIQ
      </span>
    </div>
  );
}
