"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // -1 à 1, négatif = inverse, 0.5 = moitié vitesse
  className?: string;
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : speed * 200]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Version pour les backgrounds
interface ParallaxBackgroundProps {
  className?: string;
  speed?: number;
}

export function ParallaxBackground({ className, speed = 0.3 }: ParallaxBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : speed * 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, prefersReducedMotion ? 1 : 0.3]);

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ y, opacity }}
    />
  );
}
