"use client";

import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Handle,
  Position,
  type Edge,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { NB } from "@/data/notebook-pages";
import type { StageData, StageNodeType } from "@/components/pipeline-diagram";

// Compact, paper-styled pipeline diagram. Clicking a node shows its explanation
// in a strip below (no side panel — fits a notebook page). Reuses the case-study
// node/edge data.
function PaperNode({ data, selected }: NodeProps<StageData>) {
  return (
    <div
      className="w-[116px] rounded-md px-2 py-1.5 text-left"
      style={{
        background: "#FBF8EF",
        border: `1.5px solid ${selected ? NB.accent : "#CFC7B4"}`,
        color: NB.ink,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: "#CFC7B4", width: 5, height: 5 }} />
      <div className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: NB.accent }}>
        {data.stage}
      </div>
      <div className="text-[11px] font-semibold leading-tight">{data.label}</div>
      <div className="font-mono text-[9px]" style={{ color: NB.inkSoft }}>
        {data.tech}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: "#CFC7B4", width: 5, height: 5 }} />
    </div>
  );
}

const nodeTypes = { stage: PaperNode };

export function NotebookDiagram({
  nodes,
  edges,
  height = 176,
}: {
  nodes: StageNodeType[];
  edges: Edge[];
  height?: number;
}) {
  const [selectedId, setSelectedId] = useState(nodes[0]?.id ?? "");
  const selected = useMemo(() => nodes.find((n) => n.id === selectedId), [nodes, selectedId]);

  return (
    <div>
      <div
        className="rounded-lg overflow-hidden"
        style={{ height, background: "#F7F2E6", border: "1px solid #DED5C1" }}
      >
        <ReactFlow
          nodes={nodes.map((n) => ({ ...n, selected: n.id === selectedId }))}
          edges={edges.map((e) => ({ ...e, style: { stroke: NB.accentDeep, strokeWidth: 1.5 } }))}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedId(node.id)}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch
          preventScrolling={false}
        >
          <Background gap={14} color="#E0D7C3" />
        </ReactFlow>
      </div>
      {selected && (
        <p className="mt-2 text-[11px] leading-snug" style={{ color: NB.inkSoft }}>
          <span className="font-semibold" style={{ color: NB.ink }}>
            {selected.data.label}:
          </span>{" "}
          {selected.data.description}
        </p>
      )}
    </div>
  );
}
