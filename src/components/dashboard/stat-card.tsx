"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { LucideIcon, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HelpTooltip } from "@/components/ui/help-tooltip";

interface StatCardProps {
  label: string;
  value: string | number;
  previousValue?: number;      // Pour calculer le trend automatiquement
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down";
    isGood?: boolean;          // true si "up" est positif (ex: revenue), false si "down" est positif (ex: errors)
  };
  href?: string;               // Lien vers détail
  variant?: "default" | "highlight" | "warning" | "success";
  helpKey?: string;
  delay?: number;
}

function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}

const variantStyles = {
  default: {
    border: "border-white/5 hover:border-white/10",
    iconBg: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  highlight: {
    border: "border-indigo-500/30 hover:border-indigo-500/50",
    iconBg: "bg-indigo-500/20 group-hover:bg-indigo-500/30",
    iconColor: "text-indigo-400",
  },
  warning: {
    border: "border-amber-500/30 hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 group-hover:bg-amber-500/20",
    iconColor: "text-amber-400",
  },
  success: {
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
};

export function StatCard({
  label,
  value,
  previousValue,
  subtitle,
  icon: Icon,
  trend,
  href,
  variant = "default",
  helpKey,
  delay = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
  const animatedValue = useAnimatedCounter(numericValue || 0);

  // Format display value
  const formatValue = (v: number) => {
    if (typeof value === "string") {
      if (value.includes("%")) return `${v.toFixed(1)}%`;
      if (value.includes("€")) return `${v.toFixed(0).toLocaleString()}€`;
      if (value.includes("min") || value.includes("m ")) return `${Math.floor(v)}m ${Math.round((v % 1) * 60)}s`;
      // Valeur décimale sans suffixe (ex: CV coefficient 0.26) → conserver les décimales
      if (value.includes(".")) {
        const decimals = (value.split(".")[1] || "").length;
        return v.toFixed(decimals);
      }
    }
    return Math.round(v).toLocaleString();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const styles = variantStyles[variant];

  const CardContent = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative p-4 sm:p-6 rounded-2xl dash-card border transition-all duration-300 spotlight overflow-hidden",
        styles.border,
        href && "cursor-pointer"
      )}
      onMouseMoveCapture={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const spotX = ((e.clientX - rect.left) / rect.width) * 100;
        const spotY = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty("--spotlight-x", `${spotX}%`);
        e.currentTarget.style.setProperty("--spotlight-y", `${spotY}%`);
      }}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className={cn("p-3 rounded-xl transition-colors", styles.iconBg)}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className={cn("w-5 h-5", styles.iconColor)} />
          </motion.div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isGood !== false
                  ? trend.direction === "up"
                    ? "text-emerald-400"
                    : "text-red-400"
                  : trend.direction === "down"
                    ? "text-emerald-400"
                    : "text-red-400"
              )}
            >
              {trend.direction === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {trend.value}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-sm text-zinc-400">{label}</p>
            {helpKey && <HelpTooltip termKey={helpKey} />}
          </div>
          <p
            className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums truncate"
            title={typeof value === "string" ? value : undefined}
          >
            {typeof value === "number" ||
            (typeof value === "string" && /^[\d.,€%]/.test(value))
              ? formatValue(animatedValue)
              : value}
          </p>
          {subtitle && (
            <p className="text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>

        {/* Link indicator */}
        {href && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4 text-zinc-500" />
          </div>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{CardContent}</Link>;
  }

  return CardContent;
}
