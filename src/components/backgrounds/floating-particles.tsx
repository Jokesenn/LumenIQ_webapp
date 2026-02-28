"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  xOffset: number;
}

interface GlowParticle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
  delay: number;
}

export function FloatingParticles({ count = 50, className }: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [glowParticles, setGlowParticles] = useState<GlowParticle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Générer les particules uniquement côté client
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.1,
        xOffset: Math.random() * 20 - 10,
      }))
    );

    setGlowParticles(
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        width: Math.random() * 6 + 4,
        height: Math.random() * 6 + 4,
        duration: Math.random() * 15 + 25,
        delay: Math.random() * 3,
      }))
    );
  }, [count]);

  // Ne rien rendre côté serveur pour éviter l'hydratation mismatch
  if (!mounted) {
    return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-indigo-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xOffset, 0],
            opacity: [particle.opacity, particle.opacity * 2, particle.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Quelques particules plus grandes et plus lumineuses */}
      {glowParticles.map((glow) => (
        <motion.div
          key={`glow-${glow.id}`}
          className="absolute rounded-full bg-indigo-400/30 blur-sm"
          style={{
            left: `${glow.x}%`,
            top: `${glow.y}%`,
            width: glow.width,
            height: glow.height,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: glow.duration,
            delay: glow.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
