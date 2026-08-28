// Subtle page-edge thickness behind the active spread: a few thin page-edge lines
// fanning just past the outer edges and the bottom — enough to read as a real
// paper block, not a slab. Static, sits behind the base paper, stable through
// turns. Cream shades only (no dark cap / cover), so it never reads as a card.

// Interpolate the top page's cream → a slightly deeper cream, edge lines only.
function shade(t: number): string {
  const a = [240, 234, 220];
  const b = [210, 198, 172];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

const SIDE_N = 7; // page-edge lines per side
const BOTTOM_N = 5;
const STEP = 1.25; // px outward per line → ~9px of subtle thickness

function SideEdges({ side }: { side: "left" | "right" }) {
  return (
    <>
      {Array.from({ length: SIDE_N }).map((_, i) => {
        const t = i / (SIDE_N - 1);
        const inset = 2.5 + i * 0.5;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: inset,
              bottom: inset,
              [side]: -(i + 1) * STEP,
              width: 4,
              background: shade(t),
              borderRadius: side === "right" ? "0 2px 2px 0" : "2px 0 0 2px",
              zIndex: SIDE_N - i,
            }}
          />
        );
      })}
    </>
  );
}

function BottomEdges({ single }: { single: boolean }) {
  return (
    <>
      {Array.from({ length: BOTTOM_N }).map((_, i) => {
        const t = i / (BOTTOM_N - 1);
        const inset = single ? 3 + i * 0.6 : 6 + i * 0.9;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: inset,
              right: inset,
              bottom: -(i + 1) * STEP,
              height: 4,
              background: shade(t),
              borderRadius: "0 0 3px 3px",
              zIndex: BOTTOM_N - i,
            }}
          />
        );
      })}
    </>
  );
}

export function PageStack({ single = false }: { single?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex: -10 }}>
      <SideEdges side="right" />
      {!single && <SideEdges side="left" />}
      <BottomEdges single={single} />
    </div>
  );
}
