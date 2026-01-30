"use client";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "hero" | "section" | "subtle";
}

export function AnimatedBackground({ variant = "hero" }: AnimatedBackgroundProps) {
  const orbs = variant === "hero"
    ? [
        { color: "bg-indigo-500/30", size: "w-[600px] h-[600px]", position: "top-[-200px] left-[-200px]", delay: 0 },
        { color: "bg-violet-500/20", size: "w-[500px] h-[500px]", position: "bottom-[-150px] right-[-150px]", delay: 2 },
        { color: "bg-cyan-500/10", size: "w-[400px] h-[400px]", position: "top-[40%] right-[-100px]", delay: 4 },
      ]
    : variant === "section"
    ? [
        { color: "bg-indigo-500/20", size: "w-[400px] h-[400px]", position: "top-[-100px] right-[-100px]", delay: 0 },
        { color: "bg-violet-500/10", size: "w-[300px] h-[300px]", position: "bottom-[-50px] left-[-50px]", delay: 1 },
      ]
    : [
        { color: "bg-indigo-500/10", size: "w-[300px] h-[300px]", position: "top-[-50px] left-[-50px]", delay: 0 },
      ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />

      {/* Animated orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute ${orb.size} ${orb.position} ${orb.color} rounded-full blur-[120px]`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}
