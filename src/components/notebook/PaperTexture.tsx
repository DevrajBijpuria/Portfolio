// Subtle seamless paper grain: an SVG fractal-noise tile at very low opacity plus
// a few faint speckles. Sits above the paper fill but below page content, so text
// and diagrams stay perfectly sharp.
const noise =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
  );

export function PaperTexture() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage: `url("${noise}")`,
          backgroundSize: "140px 140px",
          opacity: 0.05,
        }}
      />
      {/* a gentle, centered top sheen — even across both pages, not a corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 100% at 50% 6%, rgba(255,255,255,0.4), transparent 66%)",
          opacity: 0.18,
        }}
      />
    </>
  );
}
