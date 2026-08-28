"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./crt.css";
import { CrtDesk } from "./CrtDesk";
import { CrtShell } from "./CrtShell";

// Clicking a landing line turns the typography into an old engineering computer
// that powers on with the workstation inside it. One explicit phase drives
// everything — no scattered animation booleans.
//
//   opening (typography compresses) → forming (shell rises)
//     → powering (flicker/static → illumination) → active
//     → closing (reverse) → onClose(), which unmounts this component
export type CrtPhase = "opening" | "forming" | "powering" | "active" | "closing";

// What the tube is showing. The computer itself is identical either way.
export type CrtVariant = "about" | "skills" | "contact";

const LABEL: Record<CrtVariant, string> = {
  about: "About Devraj Bijpuria",
  skills: "Skill sets",
  contact: "Contact Devraj Bijpuria",
};

// phase → [next phase, ms]. Absent phases are terminal (they wait for input).
const SEQUENCE: Partial<Record<CrtPhase, [CrtPhase | "done", number]>> = {
  opening: ["forming", 260],
  forming: ["powering", 520],
  powering: ["active", 720],
  closing: ["done", 420],
};

// Mounted only while the experience is open; `onClose` fires at the END of the
// closing animation, so the landing typography springs back exactly as the CRT
// finishes shrinking away.
export function CrtAbout({
  variant,
  originY = 0.5,
  onClose,
}: {
  variant: CrtVariant;
  // Vertical centre of the landing line this was opened from, 0–1 of the
  // viewport. The shell grows out of that point instead of the screen's middle,
  // which is what keeps the handoff reading as one continuous surface.
  originY?: number;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<CrtPhase>("opening");
  const reduced = useReducedMotion() ?? false;
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Remember what opened us, and hand focus back on unmount. The cleanup is a
  // passive effect, so it runs after the commit that drops `inert` from the
  // typography — a timer or rAF would race that (and stall in a hidden tab).
  useEffect(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    return () => returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    const step = SEQUENCE[phase];
    if (!step) return;
    const [next, ms] = step;
    const t = setTimeout(
      () => {
        if (next === "done") {
          onClose();
          return;
        }
        setPhase(next);
      },
      reduced ? 0 : ms
    );
    return () => clearTimeout(t);
  }, [phase, reduced, onClose]);

  const requestClose = useCallback(() => {
    setPhase((p) => (p === "closing" ? p : "closing"));
  }, []);

  // Escape during boot and teardown. Once the tube is lit the desktop owns the
  // key instead, so it can close an open window before powering the machine off
  // — two live listeners would race, so this one stands down.
  useEffect(() => {
    if (phase === "active") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, requestClose]);

  // Move focus into the tube once it is lit, so keyboard users land on the copy.
  useEffect(() => {
    if (phase === "active") dialogRef.current?.focus();
  }, [phase]);

  const shown = phase === "forming" || phase === "powering" || phase === "active";

  return (
    // Full-screen, and the size container the shell measures itself against.
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={LABEL[variant]}
      tabIndex={-1}
      className="crt-band outline-none"
    >
      {/* Deliberately translucent: the halftone print stays visible around the
          computer so it reads as placed inside the existing world. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% ${originY * 100}%, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.72) 100%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: reduced ? 0.15 : 0.45 }}
        onClick={requestClose}
      />

      {/* The desk the machine is standing on. Before the stage in DOM order, so
          the object occludes whatever it is sitting over. */}
      <CrtDesk shown={shown} />

      {/* Perspective lives on the stage so Motion keeps sole ownership of the
          shell's own transform — the tilt sits on .crt-tilt in between. */}
      <div className="crt-stage">
        <motion.div
          className="crt-shell relative"
          // Rises from the picked line rather than the screen centre: the origin
          // is that line's height, and the initial offset is however far the
          // stage centre sits from it. Small scale, no y-drop — the object grows
          // out of the type instead of sliding in over it.
          style={{ transformOrigin: `50% ${originY * 100}%` }}
          initial={{ opacity: 0, scale: 0.82, y: (originY - 0.5) * 120 }}
          animate={
            shown
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.82, y: (originY - 0.5) * 120 }
          }
          transition={reduced ? { duration: 0.18 } : { duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
        >
          <CrtShell phase={phase} reduced={reduced} variant={variant} onClose={requestClose} />
        </motion.div>
      </div>
    </div>
  );
}
