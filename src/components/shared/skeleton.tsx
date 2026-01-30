"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      className={cn(
        "bg-zinc-800/50 rounded-lg overflow-hidden relative",
        className
      )}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-24 h-4 rounded" />
      <Skeleton className="w-32 h-8 rounded" />
      <Skeleton className="w-20 h-3 rounded" />
    </div>
  );
}
