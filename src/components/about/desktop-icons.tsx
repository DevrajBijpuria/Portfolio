import type { FileKind } from "@/data/desktop";

// Pixel icon set for the desktop. Everything is drawn on a coarse integer grid
// with shape-rendering="crispEdges", so edges stay hard the way a 16-bit icon
// does instead of softening into modern vector art.
//
// The folder keeps its manila; file types get a muted, low-contrast tint each,
// enough to tell a .sql from a .py at a glance without turning the desktop into
// a colour chart.

const F = { edge: "#6d4f16", back: "#a97f2c", front: "#d9ae55", hi: "#efd190" };

const PAPER = "rgba(236,229,212,0.88)";
const INK = "rgba(109,103,91,0.9)";
const RULE = "rgba(60,58,52,0.6)";

// Muted, desaturated tints — the fold flash that identifies the type.
const TINT: Record<FileKind, string> = {
  txt: "#b9b2a0",
  csv: "#9fae94",
  py: "#bfae87",
  sql: "#93a7b0",
  yaml: "#b39d8c",
  prj: "#a9a3c4",
};

export function FolderIcon({
  open = false,
  className = "h-8 w-10",
}: {
  open?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 26"
      shapeRendering="crispEdges"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      {/* back panel + the tab that sticks up on the left */}
      <path d="M1 5h11l2.5 2.5H31V22H1Z" fill={F.back} stroke={F.edge} strokeWidth="1" />
      {open ? (
        // front flap swung down and away — skewed, so it reads as opened
        <path d="M1 11h30l-4.5 11H1Z" fill={F.front} stroke={F.edge} strokeWidth="1" />
      ) : (
        <path d="M1 10h30v12H1Z" fill={F.front} stroke={F.edge} strokeWidth="1" />
      )}
      <path d={open ? "M2 12h28" : "M2 11h28"} stroke={F.hi} strokeWidth="1" />
    </svg>
  );
}

// Per-type marking inside the page. Deliberately motifs rather than lettering —
// at 16px an "SQL" caption is mud, but a cylinder still reads as a database.
function TypeMark({ kind }: { kind: FileKind }) {
  switch (kind) {
    case "csv":
      // a little table
      return (
        <g stroke={RULE} strokeWidth="1">
          <path d="M5 12h10M5 15h10M5 18h10" />
          <path d="M8.5 11v8M11.5 11v8" />
        </g>
      );
    case "sql":
      // database cylinder
      return (
        <g stroke={RULE} strokeWidth="1" fill="none">
          <path d="M6 12h8v7H6Z" />
          <path d="M6 12c0-1 1.8-1.6 4-1.6s4 .6 4 1.6-1.8 1.6-4 1.6-4-.6-4-1.6Z" />
          <path d="M6 15.5c0 1 1.8 1.6 4 1.6s4-.6 4-1.6" />
        </g>
      );
    case "py":
      // two interlocking blocks
      return (
        <g stroke={RULE} strokeWidth="1" fill="none">
          <path d="M5 11h5v4H7v4" />
          <path d="M15 19h-5v-4h3v-4" />
        </g>
      );
    case "yaml":
      // key: value pairs
      return (
        <g stroke={RULE} strokeWidth="1">
          <path d="M5 12h1M5 15h1M5 18h1" />
          <path d="M8 12h7M8 15h5M8 18h7" />
        </g>
      );
    default:
      // plain ruled text
      return (
        <g stroke={RULE} strokeWidth="1">
          <path d="M5 12h10M5 15h10M5 18h7" />
        </g>
      );
  }
}

export function FileIcon({
  kind = "txt",
  className = "h-4 w-3.5",
}: {
  kind?: FileKind;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 24"
      shapeRendering="crispEdges"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      {/* page with the corner folded back */}
      <path d="M2 1h10l6 6v16H2Z" fill={PAPER} stroke={INK} strokeWidth="1" />
      <path d="M12 1v6h6" fill={TINT[kind]} stroke={INK} strokeWidth="1" />
      <TypeMark kind={kind} />
    </svg>
  );
}

// The mouse pointer that walks to ABOUT.TXT on the DEVRAJ boot.
export function PointerIcon({ className = "h-4 w-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 18"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1 1v13l3.2-3.2L6.6 16l2.2-1-2.4-5.1H11Z"
        fill="#ece5d4"
        stroke="#14150f"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
