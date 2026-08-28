"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type Section } from "@/data/loading-content";
import { Landing } from "@/components/landing/Landing";
import { HalftoneBackground } from "@/components/HalftoneBackground";
import { CrtAbout, type CrtVariant } from "@/components/about/CrtAbout";
import { BoardOverlay } from "@/components/board/BoardOverlay";

// Every line hands off the same way: the typography compresses and the object it
// asked for arrives over the top of it. The name line, SKILL SETS and CONTACT
// bring up a vintage computer that powers on with the workstation inside its
// screen; PROJECTS brings up the engineering board, which powers on the same way.
// Neither expands a band inside the type stack — the type always stays behind.
//
// The handoff is deliberately staged rather than a cut. Three things happen in
// order, all anchored to the line that was clicked:
//
//   1. the line presses in and brightens, the others fall back   (REACT_MS)
//   2. the ground deepens and the stack gathers toward that line
//   3. the machine grows out of the same spot
//
// `originY` — the clicked line's centre as a fraction of the viewport — is what
// ties all three together. Everything scales about it, so nothing ever reads as
// one screen being swapped for another.
const REACT_MS = 170;

export function LandingToNotebook() {
  const [crt, setCrt] = useState<CrtVariant | null>(null);
  const [board, setBoard] = useState(false);
  // The section that has been picked but whose machine has not arrived yet.
  const [handing, setHanding] = useState<Section | null>(null);
  const [originY, setOriginY] = useState(0.5);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onToggle = useCallback((s: Section, y: number) => {
    setOriginY(y);
    // Mark the line first and let it respond; the object follows a beat later.
    setHanding(s);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (s === "projects") setBoard(true);
      else setCrt(s === "stack" ? "skills" : s === "contact" ? "contact" : "about");
    }, REACT_MS);
  }, []);

  const closeCrt = useCallback(() => {
    setCrt(null);
    setBoard(false);
    setHanding(null);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ background: "#000000" }}>
      {/* Animated halftone-print canvas background (behind the typography). */}
      <HalftoneBackground opacity={1} speed={0.45} />

      {/* The ground deepens as soon as a line is picked — before the machine
          arrives — so the type is already sitting in a darker room by the time
          the tube rises out of it. Centred on the picked line, not the screen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-[420ms] ease-out"
        style={{
          opacity: handing ? 1 : 0,
          background: `radial-gradient(ellipse at 50% ${originY * 100}%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.78) 70%)`,
        }}
      />

      <Landing
        handing={handing}
        originY={originY}
        onToggle={onToggle}
        compressed={handing !== null}
      />
      {crt && <CrtAbout variant={crt} originY={originY} onClose={closeCrt} />}
      {board && <BoardOverlay originY={originY} onClose={closeCrt} />}
    </section>
  );
}
