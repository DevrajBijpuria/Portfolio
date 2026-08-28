// Maps a project slug to its diagram + chart data, reusing the existing
// case-study data files (no duplication).
import { nodes as cdcNodes, edges as cdcEdges } from "@/app/case-studies/cdc-connector/diagram";
import cdcMetrics from "@/app/case-studies/cdc-connector/metrics.json";
import { nodes as spNodes, edges as spEdges } from "@/app/case-studies/spotify-pipeline/diagram";
import spMetrics from "@/app/case-studies/spotify-pipeline/metrics.json";
import type { Edge } from "reactflow";
import type { StageNodeType } from "@/components/pipeline-diagram";
import type { Series } from "@/components/notebook/NotebookChart";

type ProjectData = {
  nodes: StageNodeType[];
  edges: Edge[];
  metrics: Record<string, string | number>[];
  chart: { title: string; type: "line" | "bar"; xKey: string; series: Series[] };
};

export const projectData: Record<string, ProjectData> = {
  "cdc-connector": {
    nodes: cdcNodes,
    edges: cdcEdges,
    metrics: cdcMetrics,
    chart: {
      title: "Rows captured vs. SCD versions (daily)",
      type: "line",
      xKey: "date",
      series: [
        { key: "captured", label: "Captured" },
        { key: "versioned", label: "Versions" },
      ],
    },
  },
  "spotify-pipeline": {
    nodes: spNodes,
    edges: spEdges,
    metrics: spMetrics,
    chart: {
      title: "Daily tracks extracted",
      type: "bar",
      xKey: "date",
      series: [{ key: "tracks", label: "Tracks/day" }],
    },
  },
};
