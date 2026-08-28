"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { notebookSpreads } from "@/data/notebook-pages";
import { NotebookSpread } from "./NotebookSpread";
import { NotebookPage } from "./NotebookPage";
import { SpreadSide } from "./pages";

// One open notebook spread that "pops" into view when its landing line is
// expanded. Reuses the physical depth (NotebookSpread) and the exact page content
// (SpreadSide) — interactive (React Flow / Recharts / links all work). Only the
// active section renders one of these, so at most one heavy diagram mounts.
const rise: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

export function NotebookPreview({ spreadIndex }: { spreadIndex: number }) {
  const reduced = useReducedMotion() ?? false;
  const [single, setSingle] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setSingle(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const spread = notebookSpreads[spreadIndex];

  return (
    <motion.div
      // Fills the expanded band's height; width derives from the aspect ratio and
      // is capped so it never overflows the viewport.
      className="relative mx-auto [transform-style:preserve-3d]"
      style={{
        height: "100%",
        aspectRatio: single ? "3 / 4" : "3 / 2",
        maxWidth: "92vw",
        perspective: 1600,
        transformPerspective: 1600,
      }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 26, rotateX: 2 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.5, ease: rise }}
    >
      <div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ transform: single ? undefined : "rotateX(1deg) rotateY(-0.5deg)" }}
      >
        <NotebookSpread single={single} />

        {single ? (
          <div className="absolute inset-0">
            <NotebookPage pageNumber={2 * spreadIndex + 1}>
              <SpreadSide spread={spread} side="right" />
            </NotebookPage>
          </div>
        ) : (
          <>
            <div className="absolute inset-y-0 left-0 w-1/2">
              <NotebookPage spineSide="right" pageNumber={2 * spreadIndex}>
                <SpreadSide spread={spread} side="left" />
              </NotebookPage>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2">
              <NotebookPage spineSide="left" pageNumber={2 * spreadIndex + 1}>
                <SpreadSide spread={spread} side="right" />
              </NotebookPage>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
