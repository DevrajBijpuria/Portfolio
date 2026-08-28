import type { ReactNode } from "react";
import type { FlowEdgeSpec, FlowNodeSpec } from "./ArchitectureFlow";
import type { Shot } from "./CodeShots";

// The shape of a project page. One of these per project, rendered by <CaseStudy>.
//
// The rule the whole system turns on: CONTENT IS DATA, LAYOUT IS COMPONENTS.
// Nothing in here is project-specific structure — a project that has no code to
// show simply omits `implementation`, and that section does not render. Only the
// header and the onward links are required.
//
// Where a project needs a visual the spine does not have — a decision table, a
// verification loop, a format comparison — it supplies it through `slots`, which
// hang extra sections off named points in the spine. That keeps the reading order
// the same across every project while letting the middle of each page be its own
// thing.

export type SnapshotItem = { label: string; value: string };

export type ProblemSection = {
  // Short paragraphs, not one block.
  body: string[];
  // What the solution had to satisfy — rendered as a checklist, not prose.
  constraints?: string[];
  note?: string;
};

export type ArchitectureSection = {
  intro?: string;
  nodes: FlowNodeSpec[];
  edges: FlowEdgeSpec[];
  note?: string;
};

// One beat of "how it works". Numbered by position, so a project with three
// steps gets 01–03 and nothing has to agree on a count.
export type ProcessStep = {
  title: string;
  detail: string;
  meta?: string;
  metaValue?: string;
};

export type ImplementationSection = {
  intro?: string;
  note?: string;
  // Screenshots of the real thing — source, dashboards, terminal output.
  shots?: Shot[];
  shotColumns?: 1 | 2;
  // Prose blocks tied to a filename, for implementation detail that is not an
  // image. Either half can be omitted; a project with neither omits the section.
  blocks?: { file: string; body: string; lines?: string[] }[];
};

// The section that carries the actual thinking. `reason` is the point of it;
// `tradeoff` is what the decision cost, and is what stops the section reading
// like a list of things that all happened to be perfect.
export type Decision = {
  title: string;
  decision: string;
  reason: string;
  tradeoff?: string;
};

// Deliberately not "metrics". A project that has measured nothing has qualitative
// results and no numbers, and the template must make that the easy path rather
// than leaving a stat grid begging to be filled with invention.
export type ResultsSection = {
  intro?: string;
  // Only ever values verifiable from the repository — what the system IS.
  facts?: SnapshotItem[];
  outcomes?: string[];
  limitations?: string[];
  note?: string;
};

export type LearningsSection = {
  // The one-line statement the section is built around.
  lead: string;
  body: string[];
  note?: string;
};

// Named hanging points in the spine. A project's own visuals attach here.
export type SlotName =
  | "afterSnapshot"
  | "afterProblem"
  | "afterArchitecture"
  | "afterProcess"
  | "afterImplementation"
  | "afterDecisions"
  | "afterResults"
  | "afterLearnings";

export type CaseStudyContent = {
  // 01 — header
  category: string;
  title: string;
  // The architecture line: "Python → Lambda → S3 → Glue → Athena".
  subtitle?: string;
  description: string[];
  // The handwritten line under the description. One per page, at most.
  headerNote?: string;

  // 02 — snapshot. Fields are per-project; there is no fixed set.
  snapshot?: SnapshotItem[];

  problem?: ProblemSection;
  architecture?: ArchitectureSection;
  process?: ProcessStep[];
  processIntro?: string;
  implementation?: ImplementationSection;
  decisions?: Decision[];
  results?: ResultsSection;
  learnings?: LearningsSection;

  // Stack badges, shown with the onward links.
  stack?: string[];
  // A footnote that has to be on the page — permissions, safety, scope.
  footnote?: string;

  // Project-specific sections, keyed by where they hang off the spine.
  slots?: Partial<Record<SlotName, ReactNode>>;
};
