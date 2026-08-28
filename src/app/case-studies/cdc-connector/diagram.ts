import type { Edge } from "reactflow";
import type { StageNodeType } from "@/components/pipeline-diagram";

export const nodes: StageNodeType[] = [
  {
    id: "source",
    type: "stage",
    position: { x: 0, y: 40 },
    data: {
      label: "Source Postgres",
      tech: "postgres · wal2json",
      stage: "extract",
      description:
        "Operational Postgres with logical replication enabled. A replication slot streams the write-ahead log so every insert/update/delete is captured without polling the tables.",
    },
  },
  {
    id: "airflow",
    type: "stage",
    position: { x: 240, y: 40 },
    data: {
      label: "Airflow DAG",
      tech: "airflow · python",
      stage: "extract",
      description:
        "A scheduled Airflow DAG consumes the replication slot in micro-batches, decodes the WAL into row-level change events, and lands them as raw change files with an ingestion timestamp.",
    },
  },
  {
    id: "staging",
    type: "stage",
    position: { x: 480, y: 40 },
    data: {
      label: "DuckDB staging",
      tech: "duckdb",
      stage: "transform",
      description:
        "Change events are loaded into a DuckDB staging table. Deduplication and type casting happen here in-process — no external warehouse needed for the transform step.",
    },
  },
  {
    id: "scd",
    type: "stage",
    position: { x: 720, y: 40 },
    data: {
      label: "SCD Type 2 merge",
      tech: "sql · merge",
      stage: "transform",
      description:
        "A MERGE closes the current row (sets valid_to, is_current = false) and opens a new version for every changed key. Full history is preserved as slowly-changing-dimension Type 2.",
    },
  },
  {
    id: "mart",
    type: "stage",
    position: { x: 960, y: 40 },
    data: {
      label: "Analytics table",
      tech: "duckdb",
      stage: "load",
      description:
        "The versioned dimension is published for downstream queries. Analysts can time-travel to any point by filtering on valid_from / valid_to.",
    },
  },
];

export const edges: Edge[] = [
  { id: "e1", source: "source", target: "airflow", animated: true },
  { id: "e2", source: "airflow", target: "staging", animated: true },
  { id: "e3", source: "staging", target: "scd", animated: true },
  { id: "e4", source: "scd", target: "mart", animated: true },
];
