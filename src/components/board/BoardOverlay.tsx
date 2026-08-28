"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ProjectBoard } from "./ProjectBoard";

// The projects board staged the same way the CRT is: it comes over the whole
// screen with the typography compressed behind it, rather than expanding a band
// inside the type stack. Same scrim, same rise out of the clicked line — the only
// difference is that the object arriving is a board instead of a tube.
export function BoardOverlay({
  originY = 0.5,
  onClose,
}: {
  // Vertical centre of the landing line this was opened from, 0–1 of the
  // viewport, so the board grows out of that point rather than the screen's.
  originY?: number;
  onClose: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Remember what opened us and hand focus back on unmount, the same way the
  // tube does — the passive cleanup runs after `inert` is dropped from the type.
  useEffect(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const stop = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Projects"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center outline-none"
    >
      {/* Translucent, like the tube's: the halftone print stays visible around
          the board so it reads as placed inside the existing world. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% ${originY * 100}%, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.72) 100%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.45 }}
        onClick={onClose}
      />

      <motion.div
        className="relative"
        style={{
          width: "min(96vw, 1600px)",
          aspectRatio: "16 / 9",
          maxHeight: "86vh",
          transformOrigin: `50% ${originY * 100}%`,
        }}
        initial={
          reduced ? { opacity: 0 } : { opacity: 0, scale: 0.82, y: (originY - 0.5) * 120 }
        }
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        transition={reduced ? { duration: 0.18 } : { duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
        onClick={stop}
      >
        <ProjectBoard />
      </motion.div>

      {/* Escape and the scrim both close; this is the visible way out, set in the
          same small mono the rest of the machine's chrome uses. */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8b8574] outline-none transition-colors hover:text-[#ece5d4] focus-visible:ring-2 focus-visible:ring-[#A8AEF5]/70"
      >
        close
      </button>
    </div>
  );
}
