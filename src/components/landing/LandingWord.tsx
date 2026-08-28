"use client";

import { motion, useReducedMotion } from "motion/react";
import { PleaserText } from "@/components/loading/PleaserText";
import type { Section } from "@/data/loading-content";

// One landing line, doubling as the accordion header for its section. Fills the
// width at whatever height its band currently allows (fontSize + scaleX from the
// parent). Keeps the horizontal drift while idle; light hover / active brightness
// only. Click toggles the section open/closed.
//
// `handing` is the CRT handoff, and it is what makes the transition read as one
// surface rather than a page change: the moment a line is picked it presses in
// and brightens while every other line falls back and goes quiet. The picked
// line is the thing the machine then grows out of, so it has to stay the
// brightest object on screen right up to the moment the tube covers it.
type Props = {
  text: string;
  section: Section;
  index: number;
  direction: "ltr" | "rtl";
  drift: number;
  duration: number;
  driftEnabled: boolean;
  fontSize: number;
  scaleX: number;
  active: boolean;
  // null while idle; otherwise the section currently handing off to the CRT.
  handing: Section | null;
  onSelect: (s: Section, originY: number) => void;
};

export function LandingWord({
  text,
  section,
  index,
  direction,
  drift,
  duration,
  driftEnabled,
  fontSize,
  scaleX,
  active,
  handing,
  onSelect,
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const streamX = direction === "rtl" ? [0, -drift] : [0, drift];

  const picked = handing === section;
  const receding = handing !== null && !picked;

  return (
    <motion.button
      type="button"
      aria-label={text}
      aria-expanded={active}
      onClick={(e) => {
        // Hand the line's own vertical centre up as a 0–1 fraction of the
        // viewport: it is the anchor everything downstream scales about.
        const r = e.currentTarget.getBoundingClientRect();
        onSelect(section, (r.top + r.height / 2) / window.innerHeight);
      }}
      className="group flex w-full shrink-0 items-center justify-center overflow-hidden py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#A8AEF5]/60"
      // The picked line presses in a touch and holds; the rest fall back and
      // dim. Scale here, not opacity, so the letters stay solid while they move.
      animate={
        reduced
          ? { opacity: receding ? 0.12 : 1 }
          : { scale: picked ? 0.985 : 1, opacity: receding ? 0.12 : 1 }
      }
      transition={{ duration: reduced ? 0.15 : 0.34, ease: [0.4, 0, 0.2, 1] }}
      whileHover={reduced || handing !== null ? undefined : { scale: 1.02 }}
    >
      {/* Motion owns `transform` for the drift (translateX), so the fit-scale must
          live on a separate child — otherwise Motion drops the inline scaleX and
          the line renders at full natural width and overflows the viewport. */}
      <motion.span
        aria-hidden="true"
        className="inline-flex will-change-transform"
        animate={reduced || !driftEnabled ? { x: 0 } : { x: streamX }}
        transition={
          reduced || !driftEnabled
            ? { duration: 0.3 }
            : { duration, delay: (index % 4) * 0.1, ease: "linear", repeat: Infinity, repeatType: "mirror" }
        }
      >
        <span
          className={`inline-flex whitespace-nowrap leading-none transition-[filter] duration-300 ${picked ? "brightness-150" : active ? "brightness-125" : "brightness-90"} group-hover:brightness-125`}
          style={{ fontSize, transform: `scaleX(${scaleX})`, transformOrigin: "center" }}
        >
          <PleaserText text={text} />
        </span>
      </motion.span>
    </motion.button>
  );
}
