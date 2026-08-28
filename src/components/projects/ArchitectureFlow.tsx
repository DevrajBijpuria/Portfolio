"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import ReactFlow, {
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import "./projects.css";
import { motion, useReducedMotion } from "motion/react";
import { MeasureNodes } from "@/components/flow-measure";
import { Surface, Tag } from "./notebook";

// The architecture, as an interactive diagram rather than a picture of one.
// Shared by every project case study; each one supplies its own nodes and edges.
//
// Layout comes from the data as (col, row) grid coordinates, so a page can lay
// its pipeline out as a serpentine, a fork, or anything else without this
// component knowing the shape. Edge handles are derived from the two nodes'
// relative positions — same row joins horizontally, different rows join
// vertically — so the data never has to name a handle. Under 760px everything
// collapses to a single column in array order.
//
// Nodes are real <button>s inside the React Flow node, so they tab, focus and
// activate on Enter/Space without React Flow's own focus handling.

export type FlowNodeSpec = {
  id: string;
  name: string;
  category: string;
  symbol: string;
  purpose: string;
  detail: string;
  // The engineering reason the stage is there at all, as opposed to what it is.
  // Optional: a page that has not written them simply does not show the block.
  why?: string;
  col: number;
  row: number;
};

export type FlowEdgeSpec = { from: string; to: string; label?: string };

type NodeData = FlowNodeSpec & {
  vertical: boolean;
  // Position in the chain, 1-based — printed on the node so the reading order
  // is unambiguous even where the layout doubles back on itself.
  index: number;
};

// Selection travels through context, never through node.data. Rebuilding the
// nodes array is what React Flow reacts to, and a rebuilt node arrives with no
// width or height — which under the React 19 mismatch (see flow-measure.tsx)
// means the store drops the dimensions and the edge renderer draws nothing. So
// selecting a stage used to erase every arrow on the diagram.
//
// Keeping the array stable and passing selection down separately means a click
// re-renders the node's own styling and nothing else.
const SelectionContext = createContext<{
  selectedId: string;
  onSelect: (id: string) => void;
}>({ selectedId: "", onSelect: () => {} });

const COL = 250;
const ROW = 200;

function useIsNarrow() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(max-width: 760px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 760px)").matches,
    () => false,
  );
}

function PipelineNode({ data }: NodeProps<NodeData>) {
  const { vertical } = data;
  const { selectedId, onSelect } = useContext(SelectionContext);
  const selected = data.id === selectedId;
  // Invisible connection points — nothing is user-connectable, these only tell
  // React Flow where an edge should meet the box.
  const hidden = {
    opacity: 0,
    width: 1,
    height: 1,
    minWidth: 1,
    minHeight: 1,
    border: 0,
  };

  return (
    <div className="relative">
      <Handle id="t-l" type="target" position={Position.Left} style={hidden} />
      <Handle id="t-r" type="target" position={Position.Right} style={hidden} />
      <Handle id="t-t" type="target" position={Position.Top} style={hidden} />
      <Handle id="s-l" type="source" position={Position.Left} style={hidden} />
      <Handle id="s-r" type="source" position={Position.Right} style={hidden} />
      <Handle
        id="s-b"
        type="source"
        position={Position.Bottom}
        style={hidden}
      />

      <button
        type="button"
        onClick={() => onSelect(data.id)}
        aria-pressed={selected}
        aria-label={`${data.name} — ${data.category}. ${data.purpose}`}
        className="crt-flow-node group block text-left"
        data-selected={selected || undefined}
        style={{ width: vertical ? 210 : 200 }}
      >
        <span className="flex items-start gap-2">
          <span aria-hidden className="crt-flow-node__symbol">
            {data.symbol}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="crt-flow-node__index">
                {String(data.index).padStart(2, "0")}
              </span>
              <span className="truncate">{data.category}</span>
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-foreground">
              {data.name}
            </span>
          </span>
        </span>
        <span className="crt-flow-node__purpose mt-2 block text-[11px] leading-snug text-muted-foreground">
          {data.purpose}
        </span>
      </button>
    </div>
  );
}

const nodeTypes = { pipeline: PipelineNode };

export function ArchitectureFlow({
  spec,
  edges: edgeSpecs,
}: {
  spec: FlowNodeSpec[];
  edges: FlowEdgeSpec[];
}) {
  const [selectedId, setSelectedId] = useState<string>(spec[0].id);
  const vertical = useIsNarrow();
  const reduced = useReducedMotion() ?? false;
  const onSelect = useCallback((id: string) => setSelectedId(id), []);

  const rows = useMemo(() => Math.max(...spec.map((n) => n.row)) + 1, [spec]);

  const nodes = useMemo<Node<NodeData>[]>(
    () =>
      spec.map((n, i) => ({
        id: n.id,
        type: "pipeline",
        draggable: false,
        connectable: false,
        position: vertical
          ? { x: 0, y: i * 128 }
          : { x: n.col * COL, y: n.row * ROW },
        data: { ...n, vertical, index: i + 1 },
      })),
    [spec, vertical],
  );

  const edges = useMemo<Edge[]>(
    () =>
      edgeSpecs.map(({ from, to, label }) => {
        // An edge that touches the selected stage is drawn in the accent, so
        // selecting a node also says what it is connected to.
        const lit = from === selectedId || to === selectedId;
        const a = spec.find((n) => n.id === from);
        const b = spec.find((n) => n.id === to);

        let sourceHandle = "s-b";
        let targetHandle = "t-t";
        if (!vertical && a && b && a.row === b.row) {
          // same row: join in whichever direction the columns run
          const rightwards = b.col > a.col;
          sourceHandle = rightwards ? "s-r" : "s-l";
          targetHandle = rightwards ? "t-l" : "t-r";
        }
        // different rows keep the vertical default, which also covers a fork

        return {
          id: `${from}-${to}`,
          source: from,
          target: to,
          sourceHandle,
          targetHandle,
          type: "smoothstep",
          label,
          labelShowBg: false,
          labelStyle: {
            fill: lit ? "rgba(174,182,255,0.8)" : "rgba(184,177,165,0.62)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          },
          style: {
            stroke: lit ? "rgba(174,182,255,0.55)" : "rgba(184,177,165,0.28)",
            strokeWidth: 1,
            transition: "stroke 180ms ease",
          },
        } satisfies Edge;
      }),
    [edgeSpecs, spec, vertical, selectedId],
  );

  const selected = spec.find((n) => n.id === selectedId) ?? spec[0];
  const selection = useMemo(
    () => ({ selectedId, onSelect }),
    [selectedId, onSelect],
  );

  return (
    <SelectionContext.Provider value={selection}>
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Surface className="crt-flow">
          <div
            style={{
              height: vertical ? spec.length * 128 + 40 : rows * ROW + 120,
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.12 }}
              proOptions={{ hideAttribution: true }}
              nodesDraggable={false}
              nodesConnectable={false}
              nodesFocusable={false}
              edgesFocusable={false}
              elementsSelectable={false}
              panOnDrag={!vertical}
              zoomOnScroll={false}
              preventScrolling={false}
            >
              <MeasureNodes
                signature={`${vertical ? "v" : "h"}-${spec.length}`}
              />
            </ReactFlow>
          </div>
        </Surface>

        <Surface grid={false} className="p-4">
          <Tag>Stage detail</Tag>
          {/* Keyed on the stage, so the content is replaced the instant the
            selection changes and the new text fades up. Deliberately not an
            AnimatePresence swap: waiting for an exit animation before showing
            the answer makes a click feel unanswered. */}
          <motion.div
            key={selected.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0.12 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3 className="mt-2 text-base font-semibold">{selected.name}</h3>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
              {selected.category}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {selected.detail}
            </p>
            {selected.why && (
              <div className="mt-4 border-t border-border/70 pt-3">
                <Tag>Why it exists</Tag>
                <p className="mt-1.5 text-sm leading-6 text-foreground/85">
                  {selected.why}
                </p>
              </div>
            )}
          </motion.div>
          <p className="mt-4 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Select any stage
          </p>
        </Surface>
      </div>
    </SelectionContext.Provider>
  );
}
