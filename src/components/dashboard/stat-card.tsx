"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  delay?: number;
}

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}

export function StatCard({ label, value, subtitle, icon: Icon, trend, delay = 0 }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  // Parse numeric value for animation
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const animatedValue = useAnimatedCounter(numericValue || 0);
  const displayValue = typeof value === 'string' && value.includes('%')
    ? `${animatedValue}%`
    : typeof value === 'string' && value.includes('€')
    ? `${animatedValue}€`
    : animatedValue.toString();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all duration-300 spotlight overflow-hidden"
      onMouseMoveCapture={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const spotX = ((e.clientX - rect.left) / rect.width) * 100;
        const spotY = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty('--spotlight-x', `${spotX}%`);
        e.currentTarget.style.setProperty('--spotlight-y', `${spotY}%`);
      }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="p-3 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className="w-5 h-5 text-indigo-400" />
          </motion.div>

          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.direction === "up" ? "text-emerald-400" : "text-red-400"
            )}>
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
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="text-3xl font-bold text-white tabular-nums">
            {typeof value === 'number' || (typeof value === 'string' && /^\d/.test(value))
              ? displayValue
              : value
            }
          </p>
          {subtitle && (
            <p className="text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
