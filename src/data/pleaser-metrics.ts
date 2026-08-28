// Per-letter aspect ratio (width / height) of each People Pleaser glyph, taken
// from the cropped SVG viewBoxes. Lets us size a line analytically (its width in
// em = sum of letter aspects + gaps) so each line can be scaled to fill its band
// without measuring the DOM. Regenerate if the glyph SVGs are re-cropped.
export const letterAspect: Record<string, number> = {
  a: 0.986, b: 0.986, c: 0.986, d: 0.986, e: 0.986, f: 0.99, g: 0.99,
  h: 0.986, i: 0.499, j: 0.986, k: 0.986, l: 0.986, m: 0.986, n: 0.986,
  o: 1.036, p: 1.01, q: 1.026, r: 0.986, s: 0.986, t: 0.986, u: 0.981,
  v: 1.008, w: 0.986, x: 0.986, y: 0.986, z: 0.986,
};

export const GAP_EM = 0.04; // gap between letters (matches PleaserText)
export const SPACE_EM = 0.3; // width of a word space (matches PleaserText)

// Total width of a line in em units at font-size 1 (height = 1em).
export function lineWidthEm(text: string): number {
  const chars = [...text.toLowerCase()];
  let w = 0;
  let n = 0;
  for (const ch of chars) {
    if (ch === " ") {
      w += SPACE_EM;
    } else if (letterAspect[ch] != null) {
      w += letterAspect[ch];
      n++;
    }
  }
  return w + GAP_EM * Math.max(0, n - 1);
}
