"use client";

import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { Badge } from "@/components/ui/badge";
import { MeasureNodes } from "@/components/flow-measure";

export type Stage = "extract" | "transform" | "load";

export type StageData = {
  label: string;
  tech: string;
  stage: Stage;
  description: string;
};

export type StageNodeType = Node<StageData>;

const stageStyles: Record<Stage, string> = {
  extract: "border-chart-1 bg-chart-1/10",
  transform: "border-chart-4 bg-chart-4/10",
  load: "border-chart-2 bg-chart-2/10",
};

function StageNode({ data, selected }: NodeProps<StageData>) {
  return (
    <div
      className={`w-44 rounded-lg border-2 px-3 py-2 text-left shadow-sm transition-shadow ${
        stageStyles[data.stage]
      } ${selected ? "ring-2 ring-ring" : ""}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground" />
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {data.stage}
      </div>
      <div className="text-sm font-semibold leading-tight">{data.label}</div>
      <div className="mt-0.5 font-mono text-xs text-muted-foreground">{data.tech}</div>
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground" />
    </div>
  );
}

const nodeTypes = { stage: StageNode };

export function PipelineDiagram({
  nodes,
  edges,
}: {
  nodes: StageNodeType[];
  edges: Edge[];
}) {
  const [selectedId, setSelectedId] = useState<string>(nodes[0]?.id ?? "");
  const selected = useMemo(
    () => nodes.find((n) => n.id === selectedId),
    [nodes, selectedId]
  );

  return (
    <div className="not-prose my-8 grid gap-4 md:grid-cols-[1fr_260px]">
      <div className="h-[380px] rounded-xl border bg-card">
        <ReactFlow
          nodes={nodes.map((n) => ({ ...n, selected: n.id === selectedId }))}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedId(node.id)}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
        >
          <MeasureNodes signature={String(nodes.length)} />
          <Background gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <aside className="rounded-xl border bg-card p-4">
        {selected ? (
          <>
            <Badge variant="secondary" className="mb-2 capitalize">
              {selected.data.stage}
            </Badge>
            <h4 className="text-base font-semibold">{selected.data.label}</h4>
            <p className="mb-3 font-mono text-xs text-muted-foreground">
              {selected.data.tech}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {selected.data.description}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Click a stage to inspect it.</p>
        )}
      </aside>
    </div>
  );
}
