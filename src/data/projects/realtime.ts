// Content for the Real-Time Data Pipeline case study at /projects/realtime.
//
// CONTENT RULE: everything here comes from the repository's README, its SQL, or
// the project's own screenshots. No throughput figures, no latency numbers, no
// record counts — the project publishes none, so the page states what the system
// IS instead. The only number on the page is the Snowflake task interval, which
// is set in the project's own SQL.

import type { FlowEdgeSpec, FlowNodeSpec } from "@/components/projects/ArchitectureFlow";
import type { Shot } from "@/components/projects/CodeShots";

export const overview = [
  "A near-real-time pipeline that automatically moves customer data from generation to S3, ingests it into Snowflake, and maintains both current state and complete historical changes.",
  "Apache NiFi runs in Docker on an EC2 instance and moves incoming CSV files into S3. Snowpipe loads them into a raw staging layer, and Snowflake Streams and Tasks take it from there — no manual step anywhere in the chain once it is running.",
];

// Conceptual, not benchmarked. The interval is the task schedule in the SQL.
export const cards = [
  { label: "SCD Type 1", value: "Current state" },
  { label: "SCD Type 2", value: "Full history" },
  { label: "Task interval", value: "1 min" },
];

// Laid out as a 4x3 grid: across the top, back along the middle, then a fork.
export const flowNodes: FlowNodeSpec[] = [
  {
    id: "faker",
    name: "Python / Faker",
    category: "Generate",
    symbol: "◎",
    purpose: "Synthetic customer records",
    detail:
      "A notebook uses Faker to generate synthetic customer records — customer_id, name, email, street, city, state, country — and writes them out as a timestamped CSV. It stands in for a source system so the rest of the pipeline has something real to move.",
    col: 0,
    row: 0,
  },
  {
    id: "csv",
    name: "Customer CSV",
    category: "File",
    symbol: "▤",
    purpose: "Timestamped drop file",
    detail:
      "Each run writes customer_<timestamp>.csv into the watched directory. The filename carries the run time, so files never collide and the pickup order is obvious.",
    col: 1,
    row: 0,
  },
  {
    id: "nifi",
    name: "Apache NiFi",
    category: "Ingest",
    symbol: "⚡",
    purpose: "Detect, read, deliver",
    detail:
      "Three processors do the whole job: ListFile notices a new file, FetchFile reads its contents, PutS3Object delivers it. NiFi runs containerised on an EC2 instance, in a process group named snowflake-db-pipeline.",
    col: 2,
    row: 0,
  },
  {
    id: "s3",
    name: "Amazon S3",
    category: "Storage",
    symbol: "▦",
    purpose: "Landing zone",
    detail:
      "S3 is the boundary between the ingestion system and the warehouse. NiFi's job ends when the object lands; Snowflake's begins there. Neither needs to know anything about the other.",
    col: 3,
    row: 0,
  },
  {
    id: "snowpipe",
    name: "Snowpipe",
    category: "Auto-ingest",
    symbol: "◈",
    purpose: "Loads without asking",
    detail:
      "Snowpipe watches the configured S3 location and loads new files as they arrive, which removes the manual COPY INTO step a batch loader would need. The external stage and pipe are defined in EXTERNAL_STAGE_PIPE.sql.",
    col: 3,
    row: 1,
  },
  {
    id: "raw",
    name: "customer_raw",
    category: "Staging",
    symbol: "▤",
    purpose: "Raw landing table",
    detail:
      "The staging table that receives everything Snowpipe loads. It is truncated at the end of each SCD1 run, so it only ever holds work that has not been merged yet.",
    col: 2,
    row: 1,
  },
  {
    id: "stream",
    name: "Snowflake Stream",
    category: "Change capture",
    symbol: "≋",
    purpose: "Tracks what changed",
    detail:
      "customer_table_changes is a stream on the customer table. It exposes the inserts and updates as change rows with METADATA$ACTION and METADATA$ISUPDATE, which is what the history logic reads rather than diffing tables itself.",
    col: 1,
    row: 1,
  },
  {
    id: "task",
    name: "Snowflake Tasks",
    category: "Processing",
    symbol: "◷",
    purpose: "Runs every minute",
    detail:
      "Two scheduled tasks do the transformation: one merges staging into the current table, the other folds the stream's change data into history. Both run on a one-minute schedule, so the warehouse maintains itself.",
    col: 0,
    row: 1,
  },
  {
    id: "scd1",
    name: "customer",
    category: "SCD Type 1",
    symbol: "▣",
    purpose: "Latest state only",
    detail:
      "A MERGE from customer_raw on customer_id: matched rows are overwritten when any field differs and update_timestamp is refreshed; unmatched rows are inserted. One row per customer, always current.",
    col: 0,
    row: 2,
  },
  {
    id: "scd2",
    name: "customer_history",
    category: "SCD Type 2",
    symbol: "▥",
    purpose: "Every version kept",
    detail:
      "Built from the stream through the v_customer_change_data view, which uses LAG over update_timestamp per customer to close the previous row and open the new one — start_time, end_time and is_current, with open rows carried to 9999-12-31.",
    col: 1,
    row: 2,
  },
];

export const flowEdges: FlowEdgeSpec[] = [
  { from: "faker", to: "csv", label: "write" },
  { from: "csv", to: "nifi", label: "detect" },
  { from: "nifi", to: "s3", label: "put" },
  { from: "s3", to: "snowpipe", label: "auto-ingest" },
  { from: "snowpipe", to: "raw", label: "load" },
  { from: "raw", to: "stream", label: "capture" },
  { from: "stream", to: "task", label: "process" },
  { from: "task", to: "scd1", label: "overwrite" },
  { from: "task", to: "scd2", label: "append" },
];

export const built = [
  {
    n: "01",
    title: "Data generation",
    body: "Python and Faker are used to generate synthetic customer records and write them as timestamped CSV files.",
    meta: "Tools",
    metaValue: "Python · Faker",
  },
  {
    n: "02",
    title: "Ingestion",
    body: "Apache NiFi runs inside Docker on an AWS EC2 instance. The ingestion flow detects incoming files, reads them and pushes them into the S3 landing zone.",
    meta: "Flow",
    metaValue: "ListFile → FetchFile → PutS3Object",
  },
  {
    n: "03",
    title: "Cloud landing",
    body: "Amazon S3 acts as the landing layer between the ingestion system and Snowflake. New files arriving in the configured S3 location become available for automatic ingestion.",
  },
  {
    n: "04",
    title: "Automatic ingestion",
    body: "Snowpipe automatically loads new files from the S3 landing location into the customer_raw staging layer, removing the need for a manual COPY INTO workflow.",
  },
  {
    n: "05",
    title: "Change data capture",
    body: "A Snowflake Stream tracks changes to customer data and provides the change information required for downstream processing.",
  },
];

export const scdPanels = [
  {
    kind: "SCD Type 1",
    table: "customer",
    body: "Maintains the latest version of each customer record. Previous values are overwritten rather than retained.",
    fields: ["customer_id", "…attributes", "update_timestamp"],
  },
  {
    kind: "SCD Type 2",
    table: "customer_history",
    body: "Maintains customer history by preserving different versions of a record with start_time, end_time and is_current fields.",
    fields: ["customer_id", "…attributes", "start_time", "end_time", "is_current"],
  },
];

// The system as a stack of layers, read top to bottom.
export const architectureNotes = [
  { layer: "Data generation", tech: "Python + Faker" },
  { layer: "Ingestion", tech: "Apache NiFi · Docker / EC2" },
  { layer: "Storage", tech: "Amazon S3" },
  { layer: "Auto ingestion", tech: "Snowpipe" },
  { layer: "Warehouse", tech: "Snowflake" },
  { layer: "Change capture", tech: "Snowflake Streams" },
  { layer: "Processing", tech: "Snowflake Tasks" },
  { layer: "Serving", tech: "SCD1 + SCD2 tables" },
];

export const whyInteresting = {
  lead: "The interesting part isn't simply moving CSV files from one system to another.",
  emphasis: "It's the automatic change-management layer.",
  body: "The same incoming data is used to maintain two different representations:",
  split: [
    { kind: "SCD1", question: "What does the customer look like now?" },
    { kind: "SCD2", question: "What has happened to this customer over time?" },
  ],
  close:
    "That makes the pipeline useful for demonstrating cloud ingestion, automation, CDC and dimensional-history patterns in one system.",
};

export const engineeringDetails = [
  "NiFi ingestion is containerized with Docker Compose.",
  "Snowpipe handles automatic file ingestion.",
  "Snowflake Streams provide change capture.",
  "Snowflake Tasks execute the transformation workflow every minute.",
  "SCD1 maintains the current customer state.",
  "SCD2 preserves historical versions.",
  "AWS credentials are not committed to the repository.",
];

export const worthKnowing = [
  {
    title: "Fully automated ingestion",
    body: "New files move from the generation layer through NiFi and S3 into Snowflake automatically.",
  },
  {
    title: "Two views of the same data",
    body: "SCD1 answers the current-state question while SCD2 preserves historical changes.",
  },
  {
    title: "Cloud-native ingestion pattern",
    body: "S3 acts as the landing layer and Snowpipe handles automatic loading.",
  },
  {
    title: "Containerized ingestion",
    body: "NiFi, ZooKeeper and JupyterLab are defined through Docker Compose.",
  },
];

// The project's own screenshots. Files live in public/projects/realtime/.
export const architectureShot: Shot = {
  src: "/projects/realtime/architecture.jpg",
  file: "architecture",
  caption:
    "The system as drawn during the build: NiFi and EC2 in Docker on the left, S3 → Snowpipe → staging table in the middle, then the Stream and Task feeding two target tables.",
};

export const shots: Shot[] = [
  {
    src: "/projects/realtime/nifi-flow.png",
    file: "NiFi — snowflake-db-pipeline",
    caption:
      "The running flow: ListFile → FetchFile → PutS3Object, three processors and two success relationships.",
  },
  {
    src: "/projects/realtime/data-generation.png",
    file: "Data Generation.ipynb",
    caption:
      "Faker writing customer_<timestamp>.csv with customer_id, name, email and address fields.",
  },
  {
    src: "/projects/realtime/database-setup.png",
    file: "DATABASE_SETUP.sql",
    caption:
      "customer_raw as the staging table, and customer as the SCD1 table with its update_timestamp default.",
  },
  {
    src: "/projects/realtime/scd1-task.png",
    file: "SCD1_TASK.sql",
    caption:
      "The SCD1 merge: update on any changed field, insert when unmatched, then truncate staging.",
  },
  {
    src: "/projects/realtime/scd2-task.png",
    file: "SCD2_TASK.sql",
    caption:
      "v_customer_change_data reads the stream and uses LAG to derive start_time, end_time and is_current.",
  },
];

// ---- added for the generic case-study template ----

export const problem = {
  body: [
    "A warehouse table that only holds current state can answer what a customer looks like now, and nothing else. The moment someone asks what changed last week, the answer is gone — it was overwritten.",
    "Keeping both answers usually means writing and scheduling the change-tracking yourself. The point of this build was to see how much of that the warehouse will do on its own.",
  ],
  constraints: [
    "no manual step once running",
    "files land continuously, not in one batch",
    "current state must stay queryable",
    "every historical version preserved",
    "change capture inside the warehouse",
  ],
  note: "overwrite the present, append the past.",
};

export const decisions = [
  {
    title: "Why NiFi",
    decision: "Move files with a three-processor NiFi flow instead of a script on a timer.",
    reason:
      "ListFile → FetchFile → PutS3Object gives file detection, backpressure and retry as configuration rather than code, and the flow is visible while it runs.",
    tradeoff:
      "A whole containerised runtime on an EC2 instance to move CSVs — heavy for this volume, and something that has to be kept alive.",
  },
  {
    title: "Why S3 as the landing zone",
    decision: "Put object storage between the ingestion system and the warehouse.",
    reason:
      "NiFi's job ends when the object lands and Snowflake's begins there, so neither side needs to know anything about the other.",
    tradeoff: "One more hop, and files that exist in two places until something cleans them up.",
  },
  {
    title: "Why Snowpipe",
    decision: "Let Snowpipe watch the stage rather than scheduling a COPY INTO.",
    reason:
      "New files load as they arrive, which removes the manual load step a batch loader would need and keeps the staging table close to current.",
    tradeoff: "Loading is now asynchronous — you find out a file failed after the fact, not at the call site.",
  },
  {
    title: "Why Streams and Tasks",
    decision: "Do the change capture inside Snowflake instead of diffing tables in an external job.",
    reason:
      "A stream exposes inserts and updates as change rows with METADATA$ACTION and METADATA$ISUPDATE, so the history logic reads what changed instead of working it out.",
    tradeoff:
      "The transformation logic now lives in the warehouse as SQL objects, where it is harder to test and version than application code.",
  },
  {
    title: "Why both SCD1 and SCD2",
    decision: "Maintain a current-state table and a full-history table from the same change feed.",
    reason:
      "They answer different questions. Collapsing them into one table means either losing history or making every current-state query filter for it.",
    tradeoff: "Two write paths to keep correct, and history that grows without bound.",
  },
];
