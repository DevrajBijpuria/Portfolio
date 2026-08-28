"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";

// A sparse handwritten note in the board hand font, in the muted warm accent,
// positioned independently of any screenshot. Composed at rest — the board
// reveals as one object, so the note has no entrance of its own.
export function BoardAnnotation({
  children,
  style,
  rotate = 0,
  color = "rgba(184,177,165,0.75)",
}: {
  children: ReactNode;
  style?: CSSProperties;
  rotate?: number;
  color?: string;
}) {
  return (
    <motion.div
      aria-hidden
      className="absolute font-[family-name:var(--font-hand)] leading-tight"
      style={{ color, ...style }}
      initial={false}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
