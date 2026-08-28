"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { NB } from "@/data/notebook-pages";

export type Series = { key: string; label: string };

// Compact, paper-styled chart for a notebook page (ink axes, accent series).
export function NotebookChart({
  data,
  xKey,
  series,
  type = "line",
  height = 150,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  series: Series[];
  type?: "line" | "bar";
  height?: number;
}) {
  const colors = [NB.accentDeep, NB.accent];
  const axis = { fontSize: 10, fill: NB.inkSoft };
  const grid = "#D9D0BC";

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
            <CartesianGrid strokeDasharray="2 3" stroke={grid} vertical={false} />
            <XAxis dataKey={xKey} tick={axis} tickLine={false} axisLine={{ stroke: grid }} interval={2} />
            <YAxis tick={axis} tickLine={false} axisLine={false} width={44} />
            {series.map((s, i) => (
              <Bar key={s.key} dataKey={s.key} fill={colors[i % colors.length]} radius={[2, 2, 0, 0]} />
            ))}
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
            <CartesianGrid strokeDasharray="2 3" stroke={grid} vertical={false} />
            <XAxis dataKey={xKey} tick={axis} tickLine={false} axisLine={{ stroke: grid }} interval={2} />
            <YAxis tick={axis} tickLine={false} axisLine={false} width={44} />
            {series.map((s, i) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
