// Shared paper/print grain for the board and its cards — a fractal-noise tile
// used at very low opacity so surfaces read as printed matte stock rather than
// flat digital fills. Desaturated in the filter so it needs no blend mode — blend
// modes force the compositor to re-blend on every canvas repaint underneath.
export const GRAIN =
  'url("data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
  ) +
  '")';

// The board's muted warm-grey printed accent.
export const BOARD_ACCENT = "#B8B1A5";
