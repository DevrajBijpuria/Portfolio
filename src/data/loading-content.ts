// Loader copy — one line per equal band of the viewport (each scaled to fill).
// First line is the name; the rest are the sections, each opening its own.
export const loadingLines = [
  "DEVRAJ BIJPURIA",
  "SKILL SETS",
  "PROJECTSSSS",
  "CONTACT",
];

// Each landing line maps to what it opens. "about" and "stack" hand off to the
// CRT rather than the notebook; "projects" opens the board; "contact" opens its
// notebook spread (index into `notebookSpreads`).
export type Section = "about" | "stack" | "projects" | "contact";

export const lineSections: Section[] = ["about", "stack", "projects", "contact"];

export const sectionSpread: Record<Section, number> = {
  about: 1,
  stack: 1,
  projects: 2,
  contact: 4,
};
