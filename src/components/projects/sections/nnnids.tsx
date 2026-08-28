import type { ReactNode } from "react";
import type { CaseStudyContent } from "../case-study";
import {
  built,
  cards,
  dashboardPanels,
  decisions,
  decisionSeverities,
  decisionTable,
  detectionLayers,
  engineeringDetails,
  featureFields,
  flowEdges,
  flowNodes,
  overview,
  problem,
  responseModes,
  responsePlatforms,
  risk,
  safetyNote,
  shots,
  stackGroups,
  verification,
  whyInteresting,
  worthKnowing,
  wsEvents,
} from "@/data/projects/nnnids";
import { Annotation, Chain, InView, SectionLabel, Surface, Tag } from "../notebook";

// NNNIDS's own sections. The detection layers, the decision table and the
// verification loop are the substance of this project, so each gets room.

const PROSE = "max-w-2xl";

// Restrained state colours, used only where a state is being named. Everything
// else on the page is the portfolio's own accent.
const THREAT = "text-[#d98b83]";
const VERIFIED = "text-[#8fbf9f]";

function Field({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`rounded-[3px] border border-border/70 px-2 py-1 font-mono text-[11px] ${className}`}
    >
      {children}
    </span>
  );
}

function FeatureFrame() {
  return (
    <section className={PROSE}>
      <SectionLabel label="Per-IP feature frame" />
      <p className="-mt-2 mb-4 text-sm leading-6 text-muted-foreground">
        Packets are grouped by source address and reduced to one row each. This frame is the only
        thing any detector ever sees.
      </p>
      <InView>
        <Surface className="px-5 py-5">
          <Tag>src_ip → one row</Tag>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {featureFields.map((f) => (
              <Field
                key={f.name}
                className={f.ml ? "border-primary/40 text-primary" : "text-muted-foreground"}
              >
                {f.name}
              </Field>
            ))}
          </div>
          <p className="mt-4 border-t border-border/70 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="text-primary">Highlighted</span> — the six the model is fitted on
          </p>
        </Surface>
      </InView>
    </section>
  );
}

function DetectionLayers() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Hybrid detection" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          Four layers read the same feature frame. Each contributes its own signal; the engine
          collects them.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {detectionLayers.map((l, i) => (
          <InView key={l.n} delay={i * 0.06}>
            <Surface className="h-full px-5 py-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-primary">{l.n}</span>
                <Tag>{l.title}</Tag>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{l.body}</p>
              <p className="mt-3 border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
                {l.example}
              </p>
            </Surface>
          </InView>
        ))}
      </div>
      <InView delay={0.1}>
        <div className="mt-3 flex flex-col items-center">
          <span aria-hidden className="font-mono text-xs text-primary/60">
            ↓ ↓ ↓ ↓
          </span>
          <Surface grid={false} className="mt-2 w-full px-5 py-4 text-center sm:w-auto sm:px-10">
            <Tag>Detection engine</Tag>
            <p className="mt-1 font-mono text-sm text-foreground">
              local + trusted ranges excluded first
            </p>
          </Surface>
        </div>
      </InView>
    </section>
  );
}

function DecisionTable() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Decision table" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          Attack type and severity in, one action out. Fixed, deterministic, and anything not in the
          table falls through to MONITOR.
        </p>
      </div>
      <InView>
        <Surface grid={false} className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/70">
                <th className="px-4 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground">
                  Attack type
                </th>
                {decisionSeverities.map((s) => (
                  <th
                    key={s}
                    className="px-4 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decisionTable.map((row) => (
                <tr key={row.type} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-2.5 font-mono text-[11px] text-foreground">{row.type}</td>
                  {decisionSeverities.map((s) => {
                    const action = row.by[s];
                    return (
                      <td
                        key={s}
                        className={`px-4 py-2.5 font-mono text-[11px] ${
                          action === "BLOCK_IP"
                            ? THREAT
                            : action
                              ? "text-primary"
                              : "text-muted-foreground/40"
                        }`}
                      >
                        {action ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      </InView>
      <div className={`${PROSE} mt-5`}>
        <Annotation rotate={1}>critical and high execute themselves; the rest are advice</Annotation>
      </div>
    </section>
  );
}

function Response() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Automated response" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          The action becomes an operating-system firewall command — or a line in a log, depending on
          the mode.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {responsePlatforms.map((p, i) => (
          <InView key={p.os} delay={i * 0.06}>
            <Surface className="h-full px-5 py-5">
              <Tag>{p.os}</Tag>
              <div className="mt-2 font-mono text-sm text-foreground">{p.command}</div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.note}</p>
            </Surface>
          </InView>
        ))}
        {responseModes.map((m, i) => (
          <InView key={m.mode} delay={0.12 + i * 0.06}>
            <Surface grid={false} className="h-full px-5 py-5">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full ${
                    m.mode === "Live" ? "bg-[#d98b83]" : "bg-[#8fbf9f]"
                  }`}
                />
                <Tag>{m.mode} mode</Tag>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{m.body}</p>
            </Surface>
          </InView>
        ))}
      </div>
    </section>
  );
}

function Verification() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Self-healing verification" />
        <InView>
          <p className="text-lg leading-8 text-foreground">{verification.lead}</p>
        </InView>
        <InView delay={0.06}>
          <p className="mt-4 leading-7 text-muted-foreground">{verification.body}</p>
        </InView>
      </div>

      <InView delay={0.1}>
        <Surface className="mt-6 px-5 py-6">
          <Chain steps={verification.chain} accent={VERIFIED} />
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
            <span aria-hidden className="font-mono text-xs text-primary/60">
              ⟳
            </span>
            <Tag>Compared per IP</Tag>
            {verification.metrics.map((m) => (
              <Field key={m} className="text-muted-foreground">
                {m}
              </Field>
            ))}
          </div>
        </Surface>
      </InView>

      <div className={`${PROSE} mt-6`}>
        <InView>
          <p className="leading-7 text-muted-foreground">{verification.close}</p>
        </InView>
      </div>
    </section>
  );
}

function RiskEngine() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Dynamic risk" />
        <InView>
          <p className="leading-7 text-muted-foreground">{risk.body}</p>
        </InView>
      </div>
      <InView delay={0.06}>
        <Surface className="mt-6 px-5 py-6">
          <Tag>Risk =</Tag>
          <dl className="mt-3 grid gap-px overflow-hidden rounded-[3px] border border-border/70 bg-border/70 sm:grid-cols-4">
            {risk.components.map((c) => (
              <div key={c.name} className="bg-background/40 px-4 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {c.name}
                </dt>
                <dd className="mt-1 font-mono text-sm text-primary">{c.range}</dd>
                <dd className="mt-1 text-[11px] leading-4 text-muted-foreground">{c.note}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
            <Tag>Trend over last 5 windows</Tag>
            {risk.trends.map((t) => (
              <Field
                key={t}
                className={
                  t === "Increasing"
                    ? THREAT
                    : t === "Decreasing"
                      ? VERIFIED
                      : "text-muted-foreground"
                }
              >
                {t.toUpperCase()}
              </Field>
            ))}
          </div>
        </Surface>
      </InView>
      <div className={`${PROSE} mt-6`}>
        <InView>
          <p className="leading-7 text-muted-foreground">{risk.close}</p>
        </InView>
      </div>
    </section>
  );
}

function LiveOperations() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Live operations" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          A React 19 + Vite dashboard connected to the FastAPI backend over REST and WebSockets.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardPanels.map((p, i) => (
          <InView key={p.name} delay={i * 0.05}>
            <Surface className="h-full px-5 py-5">
              <div className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-primary/70" />
                <Tag>{p.name}</Tag>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.body}</p>
            </Surface>
          </InView>
        ))}
      </div>

      <div className={`${PROSE}`}>
        <SectionLabel label="Real-time event flow" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          The dashboard receives pipeline progress, detections, mitigation actions, verification
          results and risk updates without relying solely on page refreshes.
        </p>
      </div>
      <InView>
        <Surface className="px-5 py-6">
          <Chain steps={["Backend", "WebSocket", "Frontend"]} />
          <ul className="mt-5 grid gap-x-6 gap-y-2 border-t border-border/70 pt-4 sm:grid-cols-2">
            {wsEvents.map((e) => (
              <li key={e.name} className="flex items-baseline gap-3">
                <span className="w-[104px] shrink-0 font-mono text-[11px] text-primary">
                  {e.name}
                </span>
                <span className="text-[12px] leading-5 text-muted-foreground">{e.body}</span>
              </li>
            ))}
          </ul>
        </Surface>
      </InView>
    </section>
  );
}

function WorthKnowing() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Worth knowing" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {worthKnowing.map((w, i) => (
          <InView key={w.title} delay={i * 0.06}>
            <Surface className="h-full px-5 py-5">
              <Tag>{w.title}</Tag>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{w.body}</p>
            </Surface>
          </InView>
        ))}
      </div>
    </section>
  );
}

export const nnnids: CaseStudyContent = {
  category: "AI / Security",
  title: "NNNIDS",
  subtitle: "Capture → Features → Detect → Decide → Respond → Verify → Risk",
  description: [
    "Neural Network Network Intrusion Detection System — it monitors network traffic, extracts per-IP behavioural features, detects suspicious activity through multiple detection layers, and can automatically mitigate threats through the operating system firewall.",
    ...overview.slice(1),
  ],
  headerNote: "detection is only half of the system.",

  snapshot: [
    { label: "Type", value: "Detection platform" },
    { label: "Role", value: "Sole engineer" },
    { label: "Backend", value: "FastAPI · Python" },
    { label: "Frontend", value: "React 19 · Vite" },
    { label: "Detection", value: "4 layers" },
    { label: "Response", value: "OS firewall" },
  ],

  problem,

  architecture: {
    intro:
      "Seven pipeline stages, then verification and risk, then the dashboard. Select any stage to read what it does.",
    nodes: flowNodes,
    edges: flowEdges,
    note: "traffic → detect → decide → respond → verify",
  },

  processIntro: "One monitoring window, from packets on the wire to a number on the dashboard.",
  process: built.map((b) => ({
    title: b.title,
    detail: b.body,
    meta: b.meta,
    metaValue: b.metaValue,
  })),

  implementation: {
    intro: "The dashboard while the pipeline is running.",
    note: "the part that actually runs →",
    shots,
    // Full-width console captures, unreadable at half column width.
    shotColumns: 1,
  },

  decisions,

  results: {
    intro:
      "The project publishes no accuracy, throughput or detection-count figures, so this describes what the system is and what it does.",
    facts: cards.map((c) => ({ label: c.value, value: c.label })),
    outcomes: engineeringDetails,
    limitations: [
      "The model self-trains on the first window, so a network already under attack when monitoring starts becomes the baseline.",
      "Simulated actions report EXECUTED, so verification records full effectiveness for a dry run.",
      "Threat intelligence is only as current as the tables committed to the repository.",
      "Live capture and live firewall changes need Administrator on Windows or root on Linux.",
    ],
  },

  learnings: {
    lead: whyInteresting.emphasis,
    body: [
      whyInteresting.lead,
      whyInteresting.chain.join(" → "),
      whyInteresting.body,
    ],
    note: "a threat isn't flagged and forgotten.",
  },

  stack: stackGroups.flatMap((g) => g.items),
  footnote: safetyNote,

  slots: {
    afterProcess: (
      <>
        <FeatureFrame />
        <DetectionLayers />
        <DecisionTable />
        <Response />
      </>
    ),
    afterImplementation: (
      <>
        <Verification />
        <RiskEngine />
        <LiveOperations />
      </>
    ),
    afterResults: <WorthKnowing />,
  },
};
