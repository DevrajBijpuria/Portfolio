"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

// One rotating sheet: front + back faces around a spine hinge (transform-origin
// left edge). Rotation is driven by a MotionValue owned by the parent, so button
// flips (imperative animate) and drag (direct set) share one path. A soft shadow
// peaks mid-turn and settles on land.
export function PageTurn({
  front,
  back,
  rotation,
  zIndex,
  full = false,
}: {
  front: ReactNode;
  back: ReactNode;
  rotation: MotionValue<number>;
  zIndex: number;
  full?: boolean; // full-width sheet (mobile) vs right-half sheet (desktop spread)
}) {
  const shadow = useTransform(rotation, (v) => {
    const a = Math.abs(v);
    const t = a <= 90 ? a / 90 : (180 - a) / 90;
    return t * 0.45;
  });

  const faceBase =
    "absolute inset-0 h-full w-full overflow-hidden [backface-visibility:hidden]";

  return (
    <motion.div
      className={`absolute inset-y-0 [transform-style:preserve-3d] ${
        full ? "left-0 w-full" : "left-1/2 w-1/2"
      }`}
      style={{ rotateY: rotation, transformOrigin: "left center", zIndex }}
    >
      <div className={faceBase} style={{ transform: "rotateY(0deg)" }}>
        {front}
      </div>
      <div className={faceBase} style={{ transform: "rotateY(180deg)" }}>
        {back}
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: shadow, background: "rgba(0,0,0,1)" }}
      />
    </motion.div>
  );
}
