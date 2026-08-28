// Notebook is organized as spreads (a left "field notes" page + a right "main"
// page), kept separate from rendering so sections can be reordered freely.
export type SpreadKind = "cover" | "about" | "project" | "contact";

export type Spread = {
  id: string;
  kind: SpreadKind;
  slug?: string; // for project spreads
  number?: string; // section number shown as a field-note label
};

export const notebookSpreads: Spread[] = [
  { id: "cover", kind: "cover" },
  { id: "about", kind: "about", number: "01" },
  { id: "cdc", kind: "project", slug: "cdc-connector", number: "02" },
  { id: "spotify", kind: "project", slug: "spotify-pipeline", number: "03" },
  { id: "contact", kind: "contact", number: "04" },
];

// Notebook palette — a warm-paper island on the site's dark charcoal.
export const NB = {
  paper: "#F3EEE2",
  paperHi: "#F8F4EA", // lighter page toward the light
  paperLo: "#E9E1CE", // deeper cream for page-stack edges
  edge: "#DCD2BB",
  rule: "#E2D9C6",
  ink: "#242430",
  inkSoft: "#5C5C68",
  accent: "#A8AEF5", // lavender — controlled accent only (spec)
  accentDeep: "#6E64C6", // readable lavender for small text / 2nd chart series
  outer: "#1F1F1F",
} as const;

// Concise metrics + engineering notes for the flagship project spreads.
export const projectMeta: Record<
  string,
  {
    title: string;
    kicker: string;
    stats: { label: string; value: string }[];
    labels: string[];
    notes: string[];
  }
> = {
  "cdc-connector": {
    title: "CDC Connector",
    kicker: "PostgreSQL → Airflow → DuckDB → SCD Type 2",
    stats: [
      { label: "Rows captured", value: "182,940" },
      { label: "Versions created", value: "176,221" },
      { label: "Latency", value: "970 ms" },
    ],
    labels: ["CDC", "WAL", "SCD2", "SQL"],
    notes: [
      "Log-based capture — read the WAL, never poll the tables.",
      "DuckDB stages + dedupes in-process; no warehouse needed.",
      "SCD2 merge = full history, time-travel to any point.",
    ],
  },
  "spotify-pipeline": {
    title: "Spotify AWS Pipeline",
    kicker: "Python → Lambda → S3 → Glue → Athena",
    stats: [
      { label: "Daily records", value: "42,821" },
      { label: "Avg query latency", value: "1.8 s" },
      { label: "Serverless", value: "100%" },
    ],
    labels: ["AWS", "Lambda", "Glue", "Athena"],
    notes: [
      "Fully serverless — cost scales to zero when idle.",
      "Raw JSON in S3, curated to partitioned Parquet by Glue.",
      "Partition pruning keeps Athena queries fast.",
    ],
  },
};
