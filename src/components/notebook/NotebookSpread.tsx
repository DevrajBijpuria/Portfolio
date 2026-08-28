import { NB } from "@/data/notebook-pages";
import { PageStack } from "./PageStack";
import { NotebookSpine } from "./NotebookSpine";

// Soft contact shadow — the notebook sitting ON the desk. Darkest just under the
// book, fading outward, extending slightly past the bottom/sides. Low opacity, no
// hard edge. Scales/fades with the notebook during the landing rise, so it grows in.
function NotebookShadow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: "-4%", right: "-4%", top: "16%", bottom: "-5%", zIndex: -30 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 100% at 50% 100%, rgba(0,0,0,0.30), rgba(0,0,0,0.14) 46%, rgba(0,0,0,0.04) 68%, transparent 80%)",
          filter: "blur(22px)",
        }}
      />
    </div>
  );
}

// Static backdrop behind the flipping leaves: soft contact shadow, subtle fanned
// page edges, the base cream paper (gentle elevation + edge highlights), and the
// central spine/gutter. All depth lives here so it stays stable through page turns
// (the leaves flip above it, untouched). No dark cover slab — cream paper only.
export function NotebookSpread({ single = false }: { single?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0">
      <NotebookShadow />

      <PageStack single={single} />

      {/* base paper: matte cream, gentle elevation, edge highlights, faint underside */}
      <div
        className="absolute inset-0 rounded-[5px]"
        style={{
          background: NB.paper,
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.5)", // top edge highlight
            "inset 1px 0 0 rgba(255,255,255,0.18)", // left edge highlight
            "inset -1px 0 0 rgba(255,255,255,0.18)", // right edge highlight
            "inset 0 -2px 5px rgba(0,0,0,0.12)", // faint bottom underside
            "0 3px 4px rgba(0,0,0,0.20)", // tight contact (below)
            "0 14px 24px rgba(0,0,0,0.20)", // mid depth (below)
            "0 34px 46px rgba(0,0,0,0.16)", // soft ambient elevation (below)
          ].join(", "),
        }}
      />

      {!single && <NotebookSpine />}
    </div>
  );
}
