import { letterAspect } from "@/data/pleaser-metrics";

// Renders a string in the "People Pleaser" character font by mapping each letter
// to its cropped SVG in /public/pleaser. The glyphs are recolored art — red body,
// black eye/outline detail, cream highlights — so they render as images (not a
// flat mask) to keep that detail. Single-case font, so input is lowercased.
const LETTER = /[a-z]/;

export function PleaserText({ text }: { text: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ display: "inline-flex", alignItems: "flex-end", gap: "0.04em" }}
    >
      {[...text.toLowerCase()].map((ch, i) => {
        if (ch === " ")
          return <span key={i} style={{ width: "0.3em", flexShrink: 0 }} />;
        if (!LETTER.test(ch)) return null;
        return (
          <img
            key={i}
            src={`/pleaser/${ch}.svg`}
            alt=""
            draggable={false}
            decoding="sync"
            style={{
              height: "1em",
              width: `${letterAspect[ch] ?? 0.9}em`,
              display: "block",
              flexShrink: 0,
            }}
          />
        );
      })}
    </span>
  );
}
