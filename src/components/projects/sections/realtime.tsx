import type { CaseStudyContent } from "../case-study";
import {
  architectureNotes,
  architectureShot,
  built,
  decisions,
  engineeringDetails,
  flowEdges,
  flowNodes,
  overview,
  problem,
  scdPanels,
  shots,
  whyInteresting,
  worthKnowing,
} from "@/data/projects/realtime";
import { CodeShots } from "../CodeShots";
import { Annotation, InView, SectionLabel, Surface, Tag } from "../notebook";

// The Snowflake pipeline's own sections. The SCD split is the point of the
// project, so it gets a section of its own rather than a line in a list.

const PROSE = "max-w-2xl";

function AsDrawn() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="As drawn" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          The diagram from the build, before any of it existed.
        </p>
      </div>
      <CodeShots shots={[architectureShot]} columns={1} />
    </section>
  );
}

function ScdSplit() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="SCD Type 1 + Type 2" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          One stream of changes, written two ways.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {scdPanels.map((p, i) => (
          <InView key={p.kind} delay={i * 0.08}>
            <Surface className="h-full px-5 py-6">
              <Tag>{p.kind}</Tag>
              <div className="mt-2 font-mono text-base text-foreground">{p.table}</div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{p.body}</p>
              <ul className="mt-4 space-y-1 border-t border-border/70 pt-3">
                {p.fields.map((f) => (
                  <li key={f} className="font-mono text-[11px] text-muted-foreground">
                    {f}
                  </li>
                ))}
              </ul>
            </Surface>
          </InView>
        ))}
      </div>
      <div className={`${PROSE} mt-6`}>
        <Annotation rotate={1}>overwrite the present, append the past</Annotation>
      </div>
    </section>
  );
}

function ArchitectureNotes() {
  return (
    <section className={PROSE}>
      <SectionLabel label="Architecture notes" />
      <InView>
        <Surface className="px-5 py-6">
          <ol>
            {architectureNotes.map((n, i) => (
              <li key={n.layer}>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {n.layer}
                </div>
                <div className="mt-0.5 font-mono text-[13px] text-foreground">{n.tech}</div>
                {i < architectureNotes.length - 1 && (
                  <div aria-hidden className="my-2 ml-[3px] h-5 w-px bg-border" />
                )}
              </li>
            ))}
          </ol>
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

export const realtime: CaseStudyContent = {
  category: "Snowflake",
  title: "Real-Time Data Pipeline",
  subtitle: "NiFi → S3 → Snowpipe → Snowflake → SCD1 / SCD2",
  description: overview,
  headerNote: "generate → land → ingest → capture → keep both answers.",

  snapshot: [
    { label: "Type", value: "Near-real-time pipeline" },
    { label: "Role", value: "Sole engineer" },
    { label: "Ingestion", value: "Apache NiFi" },
    { label: "Warehouse", value: "Snowflake" },
    { label: "Pattern", value: "CDC · SCD1 + SCD2" },
    { label: "Task interval", value: "1 min" },
  ],

  problem,

  architecture: {
    intro:
      "Ten stages, ending in a fork: the same change data feeds a current-state table and a history table. Select any stage to read what it does.",
    nodes: flowNodes,
    edges: flowEdges,
    note: "generate → land → ingest → capture → keep both answers",
  },

  processIntro: "Generation to two target tables, with nothing to press once it is running.",
  process: [
    ...built.map((b) => ({
      title: b.title,
      detail: b.body,
      meta: b.meta,
      metaValue: b.metaValue,
    })),
    {
      title: "SCD1 merge",
      detail:
        "A task merges customer_raw into customer on customer_id: matched rows are overwritten when any field differs and update_timestamp is refreshed, unmatched rows are inserted, and staging is truncated afterwards.",
      meta: "Runs",
      metaValue: "SCD1_TASK.sql",
    },
    {
      title: "SCD2 merge",
      detail:
        "A second task folds the stream's change data into customer_history through a view that uses LAG over update_timestamp per customer — closing the previous row and opening the new one with start_time, end_time and is_current.",
      meta: "Runs",
      metaValue: "SCD2_TASK.sql",
    },
  ],

  implementation: {
    intro: "The flow and the SQL, as they run.",
    note: "the part that actually runs →",
    shots,
    shotColumns: 2,
  },

  decisions,

  results: {
    intro:
      "The project publishes no throughput or latency figures, so this describes what the system does rather than how fast it did it.",
    facts: [
      { label: "Ingestion", value: "NiFi / Docker" },
      { label: "Landing", value: "Amazon S3" },
      { label: "Loading", value: "Snowpipe" },
      { label: "Change capture", value: "Streams" },
      { label: "Processing", value: "Tasks" },
      { label: "Targets", value: "SCD1 + SCD2" },
    ],
    outcomes: engineeringDetails,
    limitations: [
      "The source is synthetic — Faker output standing in for a real system of record.",
      "History grows without bound; there is no retention or pruning on customer_history.",
      "A file that fails to load is discovered after the fact, since Snowpipe loads asynchronously.",
    ],
  },

  learnings: {
    lead: whyInteresting.emphasis,
    body: [
      whyInteresting.lead,
      `${whyInteresting.body} ${whyInteresting.split.map((s) => `${s.kind} — ${s.question}`).join("  ")}`,
      whyInteresting.close,
    ],
    note: "two questions, two tables.",
  },

  stack: [
    "Python",
    "Faker",
    "Docker",
    "Apache NiFi",
    "AWS EC2",
    "Amazon S3",
    "Snowflake",
    "Snowpipe",
    "Streams",
    "Tasks",
    "SQL",
  ],

  slots: {
    afterArchitecture: <AsDrawn />,
    afterProcess: <ScdSplit />,
    afterDecisions: <ArchitectureNotes />,
    afterResults: <WorthKnowing />,
  },
};
