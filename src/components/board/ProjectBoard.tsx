"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { boardProjects } from "@/data/board-projects";
import { BoardBackingSheet } from "./BoardBackingSheet";
import { BoardGrid } from "./BoardGrid";
import { ProjectPin } from "./ProjectPin";
import { BoardAnnotation } from "./BoardAnnotation";
import { GRAIN } from "./grain";
import "../about/crt.css";

// The Projects content: a physical engineering workboard. Back to front — a
// muted warm-grey printed frame, a matte charcoal gridded board, printed project
// cards, sparse handwritten notes.
//
// Reveal is the CRT power-on used by the name and SKILL SETS lines: the board
// arrives dark (forming), a static/sweep/filament boot plays over it (powering),
// and the cards illuminate once it is warm (active) — the same phases and the
// same boot layers the tube uses, reused straight from crt.css.
//
// The board's own arrival — the rise out of the clicked line and the scrim over
// the typography — belongs to BoardOverlay, which stages this the way CrtAbout
// stages the tube. Nothing here animates position.
type Phase = "forming" | "powering" | "active";
// phase → ms until the next one. `active` is terminal.
const SEQUENCE: Record<Exclude<Phase, "active">, number> = { forming: 300, powering: 700 };

export function ProjectBoard() {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>(reduced ? "active" : "forming");

  // Walk forming → powering → active once on mount. Reduced motion lands on
  // `active` immediately, so nothing boots.
  useEffect(() => {
    if (reduced) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        setPhase("powering");
        timers.push(setTimeout(() => setPhase("active"), SEQUENCE.powering));
      }, SEQUENCE.forming)
    );
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  const lit = phase === "active";
  const booting = phase === "powering";

  return (
    <div className="relative h-full min-h-[320px] w-full">
      <BoardBackingSheet />

      {/* the board itself — the "screen" that powers on */}
      <div
        className="absolute overflow-hidden rounded-[5px]"
        style={{
          inset: "12px",
          // matte charcoal, a hair translucent so the halftone reads through
          background:
            "linear-gradient(168deg, rgba(26,25,23,0.94) 0%, rgba(19,18,17,0.95) 48%, rgba(14,13,12,0.96) 100%)",
          border: "1px solid rgba(184,177,165,0.14)",
          // soft ambient depth + a restrained inner shadow; no dramatic drop
          boxShadow:
            "0 12px 30px rgba(0,0,0,0.44), 0 3px 7px rgba(0,0,0,0.34), inset 0 0 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(184,177,165,0.07)",
        }}
      >
        {/* board material grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: GRAIN, backgroundSize: "120px 120px", opacity: 0.05 }}
        />
        <BoardGrid rows={16} />
        {/* edge shading, so the surface darkens into its frame instead of ending flat */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(115% 105% at 45% 40%, transparent 52%, rgba(0,0,0,0.34) 100%)",
          }}
        />

        {/* screen power state: a near-black tube with a faint warm centre, sitting
            over the panel before it powers on and lifting as the boot warms it.
            The opacity transition is what makes it brighten rather than cut. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "radial-gradient(ellipse 92% 74% at 50% 45%, #0b0d0a 0%, #060704 68%, #040503 100%)",
            transition: "opacity 640ms ease",
            opacity: phase === "forming" ? 1 : booting ? 0.22 : 0,
          }}
        />

        {/* the tube's own boot layers, reused from the CRT: noise, the filament
            line and its dim bloom, and a sweep down the glass. Play once during
            `powering`, then remove themselves. */}
        {booting && !reduced && (
          <>
            <div aria-hidden className="crt-static" />
            <div aria-hidden className="crt-sweep" />
            <div aria-hidden className="crt-boot" />
            <div aria-hidden className="crt-line" />
          </>
        )}
      </div>

      {/* cards + notes — appear once the tube is lit, fading up under the settling
          glow rather than dropping in one by one. Not clipped, so a hovered card
          can lift past the board edge. */}
      {lit && (
        <motion.div
          className="absolute"
          style={{ inset: "12px" }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
        >
          {boardProjects.map((p, i) => (
            <ProjectPin key={p.id} project={p} index={i} />
          ))}

          <BoardAnnotation
            rotate={-4}
            color="rgba(184,177,165,0.82)"
            style={{ top: "46%", left: "3%", fontSize: "17px" }}
          >
            everything you do, do it with care
          </BoardAnnotation>
          <BoardAnnotation
            rotate={3}
            color="rgba(218,213,202,0.62)"
            style={{ top: "47.5%", left: "41%", fontSize: "15px" }}
          >
            raw → stg → mart
          </BoardAnnotation>
          <BoardAnnotation
            rotate={-2}
            color="rgba(184,177,165,0.68)"
            style={{ top: "46%", right: "3%", fontSize: "15px" }}
          >
            CDC → SCD2
          </BoardAnnotation>
        </motion.div>
      )}
    </div>
  );
}
