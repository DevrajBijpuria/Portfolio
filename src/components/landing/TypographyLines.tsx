"use client";

import { useEffect, useMemo, useState } from "react";
import { loadingLines, lineSections, type Section } from "@/data/loading-content";
import { lineWidthEm } from "@/data/pleaser-metrics";
import { LandingWord } from "./LandingWord";

const DEFAULT = { w: 1280, h: 800 };

// Stretch a line to fill the width at a given font size (the oversized, edge-to-
// edge treatment, at whatever height the accordion state calls for).
//
// The drift has to be paid for out of the width. Every line also translates
// horizontally by up to `drift` px, so a line scaled to fill the full viewport
// slides its leading letter off the edge and gets clipped by the row's
// overflow — which is what was cutting the S off SKILL SETS. Reserving the
// travel on both sides keeps the line inside the frame at every point of the
// sweep, at the cost of a few per cent of width.
function fillScaleX(text: string, w: number, fontSize: number, drift: number) {
  const usable = Math.max(w * 0.4, w - drift * 2);
  return (usable * 0.99) / (fontSize * lineWidthEm(text));
}

function lineParams(i: number) {
  return {
    direction: (i % 2 === 0 ? "ltr" : "rtl") as "ltr" | "rtl",
    drift: 55 + ((i * 17) % 40),
    duration: 1.3 + (i % 3) * 0.3,
  };
}

// The line stack: equal full-screen bands, always at rest. Clicking one hands off
// to the object it opens (the CRT, or the projects board), which arrives over the
// top of the type — nothing expands in here, so the stack only ever compresses as
// a whole while a handoff is in flight.
export function TypographyLines({
  handing,
  onToggle,
}: {
  handing: Section | null;
  onToggle: (s: Section, originY: number) => void;
}) {
  const [dims, setDims] = useState(DEFAULT);
  useEffect(() => {
    const measure = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const n = loadingLines.length;
  const fullFs = Math.floor((dims.h / n) * 0.98); // one of n equal bands

  const sizeFor = useMemo(
    () => (i: number) => {
      const text = loadingLines[i];
      return {
        fontSize: fullFs,
        scaleX: fillScaleX(loadingLines[i], dims.w, fullFs, lineParams(i).drift),
        text,
      };
    },
    [dims.w, fullFs]
  );

  return (
    <div className="flex h-full flex-col">
      {loadingLines.map((text, i) => {
        const sec = lineSections[i];
        const p = lineParams(i);
        const sz = sizeFor(i);
        return (
          <div
            key={text}
            className="relative flex min-h-0 flex-1 flex-col justify-center overflow-hidden"
            style={{ flexBasis: 0 }}
          >
            <LandingWord
              text={text}
              section={sec}
              index={i}
              direction={p.direction}
              drift={p.drift}
              duration={p.duration}
              driftEnabled // keep the lines drifting even while a section is open
              fontSize={sz.fontSize}
              scaleX={sz.scaleX}
              active={false}
              handing={handing}
              onSelect={onToggle}
            />
          </div>
        );
      })}
    </div>
  );
}
