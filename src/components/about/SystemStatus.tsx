"use client";

import { useEffect, useState } from "react";
import { systemStatus } from "@/data/desktop";

// The readout in the top-right corner. Small enough that you find it on the
// second look, not the first. Uptime counts from the moment the tube lit — the
// one number here that is actually true, which is what makes the rest read as
// true too.
function elapsed(fromMs: number) {
  const s = Math.max(0, Math.floor((Date.now() - fromMs) / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
}

export function SystemStatus({ bootedAt }: { bootedAt: number }) {
  const [uptime, setUptime] = useState(() => elapsed(bootedAt));

  useEffect(() => {
    const t = setInterval(() => setUptime(elapsed(bootedAt)), 1000);
    return () => clearInterval(t);
  }, [bootedAt]);

  return (
    <div className="crt-status-readout" aria-hidden="true">
      <div className="crt-status-readout__head">
        System Status
        <span className="crt-bloom"> {systemStatus.state}</span>
      </div>
      <dl>
        {systemStatus.rows.map((r) => (
          <div key={r.label}>
            <dt>{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
        <div>
          <dt>Uptime</dt>
          <dd className="tabular-nums">{uptime}</dd>
        </div>
      </dl>
    </div>
  );
}
