interface LogoProps {
  size?: number;
  className?: string;
  variant?: "light" | "dark";
}

export function Logo({ size = 32, className = "", variant = "light" }: LogoProps) {
  const src = variant === "dark" ? "/logo-ascension-dark.svg" : "/logo-ascension.svg";
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="PREVYA"
        width={size}
        height={size}
      />
    </div>
  );
}

interface LogoWithTextProps {
  size?: number;
  className?: string;
  variant?: "light" | "dark";
}

export function LogoWithText({ size = 32, className = "", variant = "light" }: LogoWithTextProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={size} variant={variant} />
      <span className={`text-xl font-display font-black tracking-[-0.03em] ${variant === "dark" ? "text-white" : "text-[var(--color-text)]"}`}>
        PREVYA
      </span>
    </div>
  );
}
