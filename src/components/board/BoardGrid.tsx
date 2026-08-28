"use client";

import { motion } from "motion/react";

// Drafting grid printed onto the board: a coarse rule plus a finer subdivision,
// both hairline-thin and very low contrast in the warm accent tone. The pitch is
// deliberately off-round and the whole layer is masked so it fades unevenly
// toward the edges — a printed grid, not a UI overlay. A low-contrast monospace
// row-number column runs down the left edge. Fades in after the board expands.
const FADE =
  "radial-gradient(120% 108% at 42% 38%, rgba(0,0,0,0.95), rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.22) 100%)";

export function BoardGrid({ rows = 12 }: { rows?: number }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ WebkitMaskImage: FADE, maskImage: FADE }}
    >
      {/* coarse rule — off-round pitch so it never lines up perfectly */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(184,177,165,0.055) 0 1px, transparent 1px 33.6px), repeating-linear-gradient(90deg, rgba(184,177,165,0.05) 0 1px, transparent 1px 34.4px)",
          backgroundPosition: "0.5px 0.5px",
        }}
      />
      {/* fine subdivision */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(184,177,165,0.022) 0 1px, transparent 1px 8.4px), repeating-linear-gradient(90deg, rgba(184,177,165,0.02) 0 1px, transparent 1px 8.6px)",
        }}
      />
      {/* row numbers down the left edge */}
      <div
        className="absolute left-1.5 top-1.5 flex flex-col font-mono text-[7px] leading-none"
        style={{ color: "rgba(184,177,165,0.22)", gap: "26.6px" }}
      >
        {Array.from({ length: rows }, (_, i) => (
          <span key={i}>{String(i + 1).padStart(2, "0")}</span>
        ))}
      </div>
    </motion.div>
  );
}
