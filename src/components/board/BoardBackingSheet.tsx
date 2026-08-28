"use client";

import { motion } from "motion/react";
import { BOARD_ACCENT, GRAIN } from "./grain";

// The board's outer frame: a muted warm-grey printed sheet, rotated slightly and
// a touch larger so it reads as physical material the board is mounted on. Matte
// — grain, a soft inner edge shadow, no gloss or glow. Settles into its rotation
// after the board expands.
export function BoardBackingSheet() {
  return (
    <motion.div
      aria-hidden
      className="absolute overflow-hidden rounded-[6px]"
      style={{
        inset: "2px",
        background: BOARD_ACCENT,
        // ambient contact shadow + a darker printed edge, kept soft and analog
        boxShadow:
          "0 10px 26px rgba(0,0,0,0.46), 0 2px 5px rgba(0,0,0,0.36), inset 0 0 0 1px rgba(60,56,50,0.22), inset 0 -14px 26px rgba(60,56,50,0.16)",
      }}
      initial={false}
      animate={{ opacity: 1, rotate: -2, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* pressed-paper grain, so the frame is material rather than a flat swatch */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: GRAIN, backgroundSize: "120px 120px", opacity: 0.09 }}
      />
      {/* faint uneven tone across the sheet — printed stock is never perfectly even */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(148deg, rgba(255,252,246,0.10), transparent 42%, rgba(60,56,50,0.12))",
        }}
      />
    </motion.div>
  );
}
