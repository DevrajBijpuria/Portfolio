"use client";

import { useEffect } from "react";
import { useReactFlow, useStoreApi } from "reactflow";

// React Flow 11 measures its nodes through a ResizeObserver created inside
// NodeRenderer. Under React 19 that observation never lands, so node width and
// height never reach the store — and getNodeData() then marks every node
// invalid, at which point the edge renderer silently draws nothing and fitView
// never runs (the viewport stays at scale 1).
//
// Symptom: a diagram of unconnected boxes, no arrows, no auto-fit. It affects
// every React Flow diagram in the project, not just one.
//
// Fix: run the measurement pass ourselves, once, from inside the store's
// provider. Rendered as a child of <ReactFlow> so the hooks resolve.
//
// ponytail: this is a workaround for a library/runtime mismatch. Delete it when
// React Flow ships a React 19-compatible release and the observer works again.
export function MeasureNodes({ signature }: { signature: string }) {
  const store = useStoreApi();
  const { fitView } = useReactFlow();

  useEffect(() => {
    // Timers, not requestAnimationFrame: rAF never fires in a backgrounded or
    // non-compositing tab, which is exactly where a diagram that has never been
    // measured would stay broken.
    let fit: ReturnType<typeof setTimeout>;
    const measure = setTimeout(() => {
      const { domNode, updateNodeDimensions } = store.getState();
      const els = domNode?.querySelectorAll<HTMLDivElement>(".react-flow__node");
      if (!els?.length) return;

      updateNodeDimensions(
        Array.from(els).map((el) => ({
          id: el.getAttribute("data-id") ?? "",
          nodeElement: el,
          forceUpdate: true,
        }))
      );

      // fit only once the dimensions have been committed
      fit = setTimeout(() => fitView({ padding: 0.12 }), 0);
    }, 0);

    return () => {
      clearTimeout(measure);
      clearTimeout(fit);
    };
  }, [signature, store, fitView]);

  return null;
}
