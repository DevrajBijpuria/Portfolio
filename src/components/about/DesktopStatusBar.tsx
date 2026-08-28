"use client";

import { useEffect, useState, type ReactNode } from "react";

// The bar along the bottom of the tube. Start's real job here is shutting the
// machine down, which is also the desktop's accessible close; open windows show
// up beside it as task buttons, and the tray carries the state and the clock.
export function DesktopStatusBar({
  taskLabel,
  taskIcon,
  itemCount,
  onTask,
  onShutDown,
}: {
  taskLabel?: string;
  taskIcon?: ReactNode;
  itemCount: number;
  onTask: () => void;
  onShutDown: () => void;
}) {
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="crt-taskbar">
      <button
        type="button"
        onClick={onShutDown}
        className="crt-raise flex items-center gap-1.5 bg-[#2a2c22] px-2 py-[3px] text-[10px] font-bold uppercase tracking-[0.12em] text-[#ece5d4] outline-none focus-visible:ring-1 focus-visible:ring-[#A8AEF5]"
      >
        <span className="crt-led" data-on="true" aria-hidden="true" />
        shut down
      </button>

      {taskLabel && (
        <button
          type="button"
          onClick={onTask}
          className="crt-sink flex min-w-0 items-center gap-1.5 bg-[#1c1f14] px-2 py-[3px] text-[10px] text-[#d8d1bf] outline-none focus-visible:ring-1 focus-visible:ring-[#A8AEF5]"
        >
          {taskIcon}
          <span className="truncate">{taskLabel}</span>
        </button>
      )}

      <div
        className="crt-sink ml-auto flex shrink-0 items-center gap-2 px-2 py-[3px] text-[10px] uppercase tracking-[0.14em] text-[#9d9784]"
        aria-hidden="true"
      >
        <span className="hidden md:inline">&bull; System Ready</span>
        <span className="hidden sm:inline">{itemCount} items</span>
        <span className="tabular-nums">
          {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
        </span>
      </div>
    </div>
  );
}
