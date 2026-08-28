import {
  siCplusplus,
  siPandas,
  siPostgresql,
  siPython,
  siScikitlearn,
  siSnowflake,
  type SimpleIcon,
} from "simple-icons";

// Real brand marks for the skill rows, keyed on the exact string in
// src/data/skills.ts — an explicit map rather than fuzzy matching, so nothing
// gets mis-tagged (e.g. "SQL" picking up a database vendor it has nothing to
// do with). Anything not listed falls back to the generic file icon.
//
// Deliberately absent: AWS, Oracle / OCI, dbt and XGBoost. simple-icons does
// not carry those marks because their owners do not permit redistribution, and
// a lookalike drawn from memory would be worse than an honest file icon. To use
// one, drop the official SVG in /public and reference it here.
export const skillLogos: Record<string, SimpleIcon> = {
  Python: siPython,
  "C++": siCplusplus,
  "Snowflake SQL": siSnowflake,
  "Streamlined Data Ingestion with pandas": siPandas,
  PostgreSQL: siPostgresql,
  "scikit-learn": siScikitlearn,
  "Importing Data in Python": siPython,
  "APIs in Python": siPython,
};

// Brand colours are picked for white backgrounds; on the near-black phosphor
// ground pandas (#150458) and friends disappear. Lift lightness to a floor
// while keeping hue and saturation, so the mark stays recognisably itself and
// stays visible. Colours already above the floor are returned untouched.
export function logoColor(hex: string, floor = 0.58) {
  const n = Number.parseInt(hex, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (l >= floor) return `#${hex}`;

  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  return `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(floor * 100)}%)`;
}
