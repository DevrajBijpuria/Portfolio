// Content for the Spotify AWS Pipeline case study at /projects/spotify.
//
// Layout lives in <CaseStudy>; this file is only what the page says. The visuals
// that are specific to this project (the layer split, the sample table, the
// storage tree, the format comparison, the serverless contrast, the failure
// modes) are assembled in components/projects/sections/spotify.tsx and hung off
// the spine through `slots`.
//
// CONTENT RULE: nothing here asserts a measured number. The pipeline's shape is
// documented in the project's own README and its two Lambdas; anything
// illustrative (the sample query result) is labelled as such in the UI.

import type { FlowEdgeSpec, FlowNodeSpec } from "@/components/projects/ArchitectureFlow";

// The chain, laid out as a serpentine: four across the top, then four back
// along the bottom. Grid coordinates only — ArchitectureFlow turns them into
// positions and works out the edge handles.
export const flowNodes: FlowNodeSpec[] = [
  {
    id: "api",
    col: 0,
    row: 0,
    name: "Spotify API",
    category: "Source",
    symbol: "◎",
    purpose: "External data source",
    detail:
      "The playlist endpoint, reached with an OAuth refresh-token flow. It is the only part of the system not under my control, which is why everything downstream treats its response as untrusted input.",
    why: "Nothing else in the system can produce this data, so the pipeline has to start at a boundary it does not own — and that boundary is the one thing most likely to change without warning.",
  },
  {
    id: "extractor",
    col: 1,
    row: 0,
    name: "Python Extractor",
    category: "Code",
    symbol: "λ",
    purpose: "Authenticates and pulls",
    detail:
      "extract.py authenticates with the refresh token, pulls the latest playlist items and hands the raw response straight on without reshaping it. Extraction does one job: get the bytes, unchanged.",
    why: "Keeping authentication and fetching in one small script means the only thing that has to be correct here is getting the bytes. Anything that reshapes data belongs downstream, where it can be re-run.",
  },
  {
    id: "lambda",
    col: 2,
    row: 0,
    name: "AWS Lambda",
    category: "Compute",
    symbol: "⚡",
    purpose: "Scheduled extraction",
    detail:
      "Runs the extraction workload without a continuously running server. A CloudWatch schedule invokes it; between invocations there is nothing to pay for and nothing to patch.",
    why: "Extraction only needs compute when a scheduled run occurs, so there is no always-on server to maintain, patch or pay for between runs.",
  },
  {
    id: "s3",
    col: 3,
    row: 0,
    name: "Amazon S3",
    category: "Storage",
    symbol: "▤",
    purpose: "Raw data layer",
    detail:
      "Raw JSON lands under raw_data/to_processed/ and is archived to raw_data/processed/ once handled. The object landing here is also the event that triggers the transform — the storage layer is the message bus.",
    why: "The raw layer has to survive every mistake made downstream. Writing the untouched response first means a bad transform costs a re-run, not the data.",
  },
  {
    id: "glue",
    col: 3,
    row: 1,
    name: "AWS Glue",
    category: "Transform",
    symbol: "◈",
    purpose: "ETL and cataloging",
    detail:
      "A crawler scans transformed_data/, infers the schema for each table and registers them in the Data Catalog as spotify_db. Managed cataloging, with no processing cluster to keep alive.",
    why: "The schema is discovered rather than declared, so a new column in the source does not require a deployment before the data can be queried.",
  },
  {
    id: "csv",
    col: 2,
    row: 1,
    name: "Clean CSVs",
    category: "Format",
    symbol: "▦",
    purpose: "Normalised output tables",
    detail:
      "transform.py splits each raw payload into three normalised tables — songs, albums and artists — deduplicates them on their id columns and writes each as CSV under transformed_data/. Written once, read many times.",
    why: "Splitting one payload into three tables lets each deduplicate on its own id. Repeating an album row for every track on it would make every later query pay for the duplication.",
  },
  {
    id: "athena",
    col: 1,
    row: 1,
    name: "Amazon Athena",
    category: "Query",
    symbol: "▷",
    purpose: "Serverless SQL",
    detail:
      "SQL directly over the objects in S3, with no database server to provision. Cost and speed both track how much data a query has to scan, which is what makes the storage decisions upstream matter.",
    why: "Querying the objects where they already sit removes a whole class of work — no server to size, no load step, and nothing to keep running between questions.",
  },
  {
    id: "analytics",
    col: 0,
    row: 1,
    name: "Analytics",
    category: "Output",
    symbol: "◱",
    purpose: "What the data is for",
    detail:
      "The reason the rest exists. Every decision upstream — partitioning, format, keeping raw untouched — is made in service of questions asked at this end.",
    why: "This end is what justifies the rest. If nothing is ever asked of the data, every decision upstream is cost without a return.",
  },
];

export const flowEdges: FlowEdgeSpec[] = [
  { from: "api", to: "extractor", label: "extract" },
  { from: "extractor", to: "lambda", label: "run" },
  { from: "lambda", to: "s3", label: "store raw" },
  { from: "s3", to: "glue", label: "transform" },
  { from: "glue", to: "csv", label: "write" },
  { from: "csv", to: "athena", label: "catalog" },
  { from: "athena", to: "analytics", label: "query" },
];

// ---- content used by this project's own sections ----

// The three layers the system is built in — a different idea from the step
// sequence: what the data IS at each depth, not what happens next.
export const layers = [
  { label: "Raw", steps: ["Spotify API", "Python", "JSON", "S3 / raw"] },
  {
    label: "Transform",
    steps: ["S3 raw JSON", "Transform Lambda", "songs / albums / artists", "S3 / clean CSV"],
  },
  { label: "Query", steps: ["Glue Crawler", "spotify_db catalog", "Athena SQL", "Analytics"] },
];

// The whole chain in five beats — the recap written at the foot of the page once
// the implementation has been read, not a second architecture diagram.
export const flowSummary = [
  { label: "Extract", note: "Spotify API" },
  { label: "Store", note: "raw JSON → S3" },
  { label: "Transform", note: "Glue" },
  { label: "Format", note: "CSV tables" },
  { label: "Query", note: "Athena" },
];

// The real songs table, as built by song() in transform.py. Column names are
// exact; the row values are illustrative, since the project publishes no data.
export const sampleColumns = [
  "song_id",
  "song_name",
  "song_duration",
  "song_popularity",
  "song_added",
  "album_id",
  "artist_id",
];
export const sampleRows = [
  ["4uLU6hMCjMI75M1A", "Weird Fishes", "273000", "78", "2026-08-14 09:12:04", "6ofEQubaL265rIW6", "4Z8W4fKeB5YxbusR"],
  ["7ouMYWpwJ422jRcD", "Roygbiv", "182000", "64", "2026-08-14 09:16:37", "1lPoRKSgZHQAYXxz", "1nJvji2KIlWSseXR"],
  ["1301WleyT98MSxVH", "Xtal", "294000", "71", "2026-08-14 09:21:45", "7cwWKUZTdJZi0Uzs", "6kBDZFXuLrZgHnvm"],
];

export const storageTree = [
  "data-pipeline-devraj-bijpuriaaa/",
  "│",
  "├── raw_data/",
  "│   ├── to_processed/",
  "│   │   └── sptify_raw_YYYYmmdd_HHMMSS.json",
  "│   └── processed/          <- archived after transform",
  "│",
  "└── transformed_data/",
  "    ├── songs_data/",
  "    │   └── song_transformed<ts>.csv",
  "    ├── albums_data/",
  "    │   └── album_transformed<ts>.csv",
  "    └── artists_data/",
  "        └── artist_transformed<ts>.csv",
];

// What the pipeline actually does today: one nested JSON payload in, three flat
// tables out. Parquet is the obvious next move for the analytics layer, but the
// code writes CSV, so the page says CSV.
export const formatComparison = {
  left: {
    name: "JSON",
    role: "Raw",
    points: [
      "nested and flexible",
      "human-readable",
      "one payload, every entity",
      "source representation",
    ],
  },
  right: {
    name: "CSV",
    role: "Transformed",
    points: [
      "flat and tabular",
      "one file per entity",
      "deduplicated on id",
      "crawler-friendly",
    ],
  },
};

export const nextStep =
  "Parquet is the natural next step for the analytics layer — columnar and compressed, so a query reads only the columns it touches. Today the transform writes CSV, which is what the Crawler catalogs.";

export const failureModes = [
  {
    mode: "API failure",
    what: "The Spotify API request fails or returns a partial response.",
    fix: "Retries with backoff, and validation before anything is written.",
  },
  {
    mode: "Schema change",
    what: "The source structure changes underneath the pipeline.",
    fix: "Schema validation and controlled transformation rather than blind mapping.",
  },
  {
    mode: "Duplicate ingestion",
    what: "The same data arrives more than once.",
    fix: "Deterministic identifiers and deduplication during transformation.",
  },
  {
    mode: "Data growth",
    what: "Queries scan an increasingly large dataset.",
    fix: "Partitioned prefixes today; a columnar format is the next lever if scans grow.",
  },
];

// Screenshots of the actual Lambda source, shown as evidence rather than
// decoration. Files live in public/projects/spotify/.
export const codeShots = [
  {
    src: "/projects/spotify/extract-lambda.jpg",
    file: "extract.py",
    caption:
      "The extract Lambda: refresh-token auth, one playlist request, raw response straight to raw_data/to_processed/ with no reshaping.",
  },
  {
    src: "/projects/spotify/transform-parsers.jpg",
    file: "transform.py — parsers",
    caption:
      "Release dates arrive at year, month or day precision, so parsing is explicit per precision rather than assumed.",
  },
  {
    src: "/projects/spotify/transform-handler.jpg",
    file: "transform.py — handler",
    caption:
      "One payload becomes three DataFrames, each deduplicated on its own id before anything is written.",
  },
  {
    src: "/projects/spotify/transform-write.jpg",
    file: "transform.py — write & archive",
    caption:
      "Each table is written as CSV, then the raw object is copied to raw_data/processed/ and deleted — the source layer moves, it never disappears.",
  },
];
