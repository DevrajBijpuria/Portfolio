"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Staggered fade/rise for card grids. Wrap items; pass index for stagger.
export function Reveal({ children, index = 0 }: { children: ReactNode; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
