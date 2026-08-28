import { NB } from "@/data/notebook-pages";

// Central binding: two pages meeting at a crease — a soft inner shadow fanning to
// both sides (paper curving into the spine), a faint highlight on the left page's
// edge, a raised core, and a darker crease at the exact center. A physical crease,
// not a divider line.
export function NotebookSpine() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-[60] -translate-x-1/2">
      {/* wide two-sided shadow: paper curving toward the binding */}
      <div
        className="absolute inset-y-0 left-1/2 h-full w-[130px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0,0,0,0.07) 38%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.07) 62%, transparent)",
        }}
      />
      {/* faint highlight where the left page lifts toward the crease */}
      <div
        className="absolute inset-y-1 left-1/2 w-[3px] -translate-x-[7px]"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.35))" }}
      />
      {/* raised spine core */}
      <div
        className="absolute inset-y-1 left-1/2 w-[10px] -translate-x-1/2 rounded"
        style={{
          background: `linear-gradient(to right, ${NB.paperLo}, #C9BFA6 45%, #B7AC90 50%, #C9BFA6 55%, ${NB.paperLo})`,
          boxShadow: "0 0 2px rgba(0,0,0,0.20), inset 0 0 3px rgba(0,0,0,0.18)",
        }}
      />
      {/* darker crease at the exact center */}
      <div className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2" style={{ background: "rgba(0,0,0,0.24)" }} />
    </div>
  );
}
