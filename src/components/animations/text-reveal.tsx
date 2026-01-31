"use client";
import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  const words = text.split(" ");

  // Detect if className contains text-gradient to apply it to each word
  // This is necessary because bg-clip-text doesn't propagate to child elements
  const hasTextGradient = className?.includes('text-gradient');
  const containerClassName = hasTextGradient 
    ? className?.replace('text-gradient', '').trim() 
    : className;
  const wordClassName = hasTextGradient 
    ? 'inline-block mr-[0.25em] text-gradient' 
    : 'inline-block mr-[0.25em]';

  return (
    <motion.span className={containerClassName}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.05,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className={wordClassName}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
