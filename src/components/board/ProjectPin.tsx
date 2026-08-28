"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { BoardProject } from "@/data/board-projects";
import { GRAIN } from "./grain";

// A project pinned to the board as a piece of printed engineering material:
// matte charcoal stock with paper grain, a hairline technical border, an
// understated ruled grid, corner crop marks and a small index, and the title set
// in off-white. No gloss, glass, metallic fill, glow or blur.
//
// Board behaviour is unchanged — placed at its data position, individually
// tilted, dropped in staggered by index, and clickable. Hover is physical: a
// tiny lift, a slight straightening of the tilt, and a deeper contact shadow.

// Cards route internally to the project's own page, so this is a Link (client
// nav + prefetch) wearing all of ProjectPin's motion rather than a bare anchor.
const MotionLink = motion.create(Link);

const MARK = "1px solid rgba(184,177,165,0.30)";

// corner crop marks — each is an L drawn with two borders
const CORNERS: CSSProperties[] = [
  { top: 6, left: 6, borderTop: MARK, borderLeft: MARK },
  { top: 6, right: 6, borderTop: MARK, borderRight: MARK },
  { bottom: 6, left: 6, borderBottom: MARK, borderLeft: MARK },
  { bottom: 6, right: 6, borderBottom: MARK, borderRight: MARK },
];

export function ProjectPin({
  project,
  index,
}: {
  project: BoardProject;
  index: number;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <MotionLink
      href={`/projects/${project.id}`}
      aria-label={project.title}
      className="group absolute block outline-none"
      style={{ top: project.top, left: project.left, width: project.width, zIndex: project.z, aspectRatio: "6 / 5" }}
      // No entrance of its own — the board reveals as one object (ProjectBoard),
      // the card just sits at its resting tilt.
      initial={false}
      animate={{ rotate: project.rotate }}
      // physical hover: lifts a few px, straightens slightly, no flashy scaling
      whileHover={reduced ? undefined : { scale: 1.02, y: -4, rotate: project.rotate * 0.55, zIndex: 50 }}
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden rounded-[3px] transition-shadow duration-300 group-hover:shadow-[0_3px_6px_rgba(0,0,0,0.5),0_14px_26px_rgba(0,0,0,0.42)]"
        style={{
          // matte stock with a barely-there tonal shift, not a gradient panel
          background: "linear-gradient(163deg, #1E1D1A 0%, #171614 55%, #121110 100%)",
          border: "1px solid rgba(184,177,165,0.17)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.44), 0 9px 18px rgba(0,0,0,0.32), inset 0 0 24px rgba(0,0,0,0.35)",
        }}
      >
        {/* paper grain */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: GRAIN, backgroundSize: "120px 120px", opacity: 0.06 }}
        />
        {/* understated ruled grid printed on the card */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(184,177,165,0.035) 0 1px, transparent 1px 14.6px), repeating-linear-gradient(90deg, rgba(184,177,165,0.028) 0 1px, transparent 1px 14.2px)",
          }}
        />
        {/* corner crop marks */}
        {CORNERS.map((c, i) => (
          <span
            key={i}
            aria-hidden
            className="pointer-events-none absolute"
            style={{ width: 9, height: 9, ...c }}
          />
        ))}

        {/* small engineering index, top-left */}
        <span
          aria-hidden
          className="absolute left-[7%] top-[8%] font-mono text-[9px] tracking-[0.18em]"
          style={{ color: "rgba(184,177,165,0.42)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* title — off-white on the dark stock, never pure white */}
        <span className="relative flex flex-1 items-center justify-center px-3">
          <span
            className="text-center font-semibold leading-tight tracking-tight"
            style={{ fontSize: "clamp(0.78rem, 1.95vw, 1.3rem)", color: "#DAD5CA" }}
          >
            {project.title}
          </span>
        </span>

        {/* hairline rule + a small technical footer marking */}
        <span aria-hidden className="relative mx-[7%] block h-px" style={{ background: "rgba(184,177,165,0.16)" }} />
        <span
          aria-hidden
          className="relative flex items-center justify-between px-[7%] pb-[6%] pt-[3%] font-mono text-[8px] tracking-[0.16em]"
          style={{ color: "rgba(184,177,165,0.34)" }}
        >
          <span>{project.tag}</span>
          <span>REV.02</span>
        </span>
      </div>
    </MotionLink>
  );
}
