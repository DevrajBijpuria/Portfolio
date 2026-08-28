"use client";

import "./crt.css";
import { CrtDesktop } from "./CrtDesktop";
import type { CrtPhase, CrtVariant } from "./CrtAbout";

// The tube. Ground → desktop → scanlines → noise → flicker → warp →
// misconvergence → vignette → glass → breathe. The effect layers sit above the
// desktop on purpose (that is what sells CRT) but they are all
// `pointer-events: none` at low opacity, so the text stays fully readable,
// selectable and clickable through them.
//
// Both entries land on the same desktop; `variant` only decides whether the boot
// walks a pointer over to ABOUT.TXT.
export function CrtScreen({
  phase,
  reduced,
  variant,
  onClose,
}: {
  phase: CrtPhase;
  reduced: boolean;
  variant: CrtVariant;
  onClose: () => void;
}) {
  const lit = phase === "active";
  const booting = phase === "powering";

  return (
    <div className="crt-screen" data-lit={lit} data-warm={booting || lit}>
      {lit && (
        <div className="crt-content crt-content--desktop">
          <CrtDesktop intent={variant} onClose={onClose} />
        </div>
      )}

      <div className="crt-scanlines" />
      <div className="crt-noise" />
      {lit && !reduced && (
        <>
          <div className="crt-flicker" />
          <div className="crt-warp" />
        </>
      )}
      {/* Misconvergence at the extreme edges only, where a real tube's guns
          fall out of alignment. No animation — a moving fringe reads as a
          glitch effect, which is the opposite of old hardware. */}
      <div className="crt-converge" />
      <div className="crt-vignette" />
      <div className="crt-glass" />
      {lit && !reduced && <div className="crt-breathe" />}

      {/* Boot layers exist only during `powering`, so nothing animates at rest.
          The order is the sequence: noise, the sweep down the tube, the dim
          bloom, and the filament line on top of it. */}
      {booting && !reduced && (
        <>
          <div className="crt-static" />
          <div className="crt-sweep" />
          <div className="crt-boot" />
          <div className="crt-line" />
        </>
      )}
    </div>
  );
}
