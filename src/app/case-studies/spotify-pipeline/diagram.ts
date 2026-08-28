import type { Edge } from "reactflow";
import type { StageNodeType } from "@/components/pipeline-diagram";

export const nodes: StageNodeType[] = [
  {
    id: "extractor",
    type: "stage",
    position: { x: 0, y: 40 },
    data: {
      label: "Python extractor",
      tech: "python · spotipy",
      stage: "extract",
      description:
        "A Python client hits the Spotify Web API for recently-played tracks, handling OAuth token refresh and pagination. Runs on a schedule and pushes the raw JSON payload downstream.",
    },
  },
  {
    id: "lambda",
    type: "stage",
    position: { x: 240, y: 40 },
    data: {
      label: "AWS Lambda",
      tech: "lambda · eventbridge",
      stage: "extract",
      description:
        "EventBridge triggers the extractor as a Lambda on a cron schedule — fully serverless, no host to manage. Lambda validates the payload and writes it to the raw S3 zone.",
    },
  },
  {
    id: "s3",
    type: "stage",
    position: { x: 480, y: 40 },
    data: {
      label: "S3 data lake",
      tech: "s3 · parquet",
      stage: "load",
      description:
        "Raw JSON lands in a partitioned S3 bucket (raw/ then curated/). The curated zone stores Parquet partitioned by date for cheap, fast scans.",
    },
  },
  {
    id: "glue",
    type: "stage",
    position: { x: 720, y: 40 },
    data: {
      label: "Glue crawler + ETL",
      tech: "glue · pyspark",
      stage: "transform",
      description:
        "A Glue crawler infers the schema and registers tables in the Data Catalog. A Glue job flattens the nested JSON, deduplicates plays, and writes curated Parquet.",
    },
  },
  {
    id: "athena",
    type: "stage",
    position: { x: 960, y: 40 },
    data: {
      label: "Athena",
      tech: "athena · sql",
      stage: "load",
      description:
        "Analysts query the curated tables directly in Athena — serverless SQL over S3. Partition pruning keeps most queries under two seconds and costs per-query only.",
    },
  },
];

export const edges: Edge[] = [
  { id: "e1", source: "extractor", target: "lambda", animated: true },
  { id: "e2", source: "lambda", target: "s3", animated: true },
  { id: "e3", source: "s3", target: "glue", animated: true },
  { id: "e4", source: "glue", target: "athena", animated: true },
];
