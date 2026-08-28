import type { ReactNode } from "react";
import { NB } from "@/data/notebook-pages";
import { PaperTexture } from "./PaperTexture";

export type Imperfection = "crease" | "corner" | "stain";

// A single warm-paper page: grain texture, faint rules, spine-curve shadow, an
// optional restrained imperfection, a lavender page number, and content that
// scrolls if it overflows.
export function NotebookPage({
  children,
  pageNumber,
  spineSide,
  imperfections = [],
}: {
  children: ReactNode;
  pageNumber?: number;
  spineSide?: "left" | "right";
  imperfections?: Imperfection[];
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: NB.paper, color: NB.ink }}
    >
      <PaperTexture />

      {/* subtle ruled lines behind content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `repeating-linear-gradient(${NB.rule} 0 1px, transparent 1px 27px)`,
          backgroundPosition: "0 52px",
        }}
      />

      {/* page curves gently toward the spine — subtle gutter shadow */}
      {spineSide && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-16"
          style={{
            [spineSide]: 0,
            background:
              spineSide === "left"
                ? "linear-gradient(to right, rgba(0,0,0,0.19), rgba(0,0,0,0.06) 40%, transparent)"
                : "linear-gradient(to left, rgba(0,0,0,0.19), rgba(0,0,0,0.06) 40%, transparent)",
          }}
        />
      )}

      {imperfections.includes("stain") && (
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            right: "14%",
            top: "22%",
            width: 90,
            height: 70,
            background:
              "radial-gradient(ellipse at center, rgba(150,120,60,0.10), transparent 70%)",
          }}
        />
      )}
      {imperfections.includes("crease") && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 0 62%, rgba(0,0,0,0.05) 62.4%, rgba(255,255,255,0.5) 63%, transparent 63.6%)",
          }}
        />
      )}
      {imperfections.includes("corner") && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0"
          style={{
            width: 26,
            height: 26,
            background: `linear-gradient(135deg, transparent 50%, ${NB.paperLo} 50%)`,
            boxShadow: "-1px -1px 2px rgba(0,0,0,0.10) inset",
          }}
        />
      )}

      <div className="relative h-full overflow-auto px-6 py-6 sm:px-8 sm:py-7">
        {children}
      </div>

      {pageNumber != null && (
        <div
          className="absolute bottom-2.5 right-3.5 font-mono text-[10px]"
          style={{ color: NB.accentDeep }}
        >
          {String(pageNumber).padStart(2, "0")}
        </div>
      )}
    </div>
  );
}
