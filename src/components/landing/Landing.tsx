"use client";

import { motion, useReducedMotion } from "motion/react";
import { TypographyLines } from "./TypographyLines";
import type { Section } from "@/data/loading-content";

// Full-screen typography landing that doubles as a click accordion: each line
// expands in place to pop its notebook spread open. Transparent over the section's
// dark ground; the engineering desk (behind, in LandingToNotebook) reveals as a
// section opens.
//
// `compressed` is the CRT handoff: the type stack draws down while the computer
// is on screen. It contracts about `originY` — the vertical centre of the line
// that was picked — so that line holds its position while the others gather
// toward it, and the machine then grows out of the same spot. Scaling about the
// viewport centre instead is what used to make this read as a page change.
export function Landing({
  handing,
  originY,
  onToggle,
  compressed = false,
}: {
  handing: Section | null;
  originY: number;
  onToggle: (s: Section, originY: number) => void;
  compressed?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <span role="status" className="sr-only">
        Devraj Bijpuria — data engineering portfolio. Select a line to open its section.
      </span>
      <motion.div
        className="h-full will-change-transform"
        // Scale only. Per-line opacity lives in LandingWord so the picked line
        // can stay lit while the rest recede — one opacity on the stack would
        // flatten them all together and lose the anchor.
        animate={{ scale: compressed && !reduced ? 0.9 : 1 }}
        // Held back a beat: the line's own press-in lands first, then the stack
        // gathers toward it.
        transition={{
          duration: reduced ? 0.18 : 0.62,
          delay: compressed && !reduced ? 0.1 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          transformOrigin: `50% ${originY * 100}%`,
          pointerEvents: compressed ? "none" : "auto",
        }}
        inert={compressed || undefined}
      >
        <TypographyLines handing={handing} onToggle={onToggle} />
      </motion.div>
    </div>
  );
}
