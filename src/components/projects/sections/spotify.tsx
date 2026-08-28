import type { CaseStudyContent } from "../case-study";
import {
  codeShots,
  failureModes,
  flowEdges,
  flowNodes,
  flowSummary,
  formatComparison,
  layers,
  nextStep,
  sampleColumns,
  sampleRows,
  storageTree,
} from "@/data/projects/spotify";
import { Annotation, Chain, InView, SectionLabel, Surface, Tag } from "../notebook";

// The Spotify pipeline's own sections — the parts of the page that only make
// sense for a cloud data pipeline. Everything else on the page comes from the
// shared spine in <CaseStudy>.

const PROSE = "max-w-2xl";

// The three layers, drawn as chains rather than carded.
function Layers() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Layers" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          Not three steps — three depths. What the data is at each one.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {layers.map((layer, i) => (
          <InView key={layer.label} delay={i * 0.08}>
            <Surface className="h-full px-5 py-6">
              <Tag>{layer.label}</Tag>
              <ol className="mt-4 space-y-0">
                {layer.steps.map((step, j) => (
                  <li key={step}>
                    <div className="font-mono text-[13px] text-foreground">{step}</div>
                    {j < layer.steps.length - 1 && (
                      <div aria-hidden className="my-1 ml-[3px] h-4 w-px bg-border" />
                    )}
                  </li>
                ))}
              </ol>
            </Surface>
          </InView>
        ))}
      </div>
      <div className={`${PROSE} mt-6`}>
        <p className="text-sm leading-6 text-muted-foreground">
          Raw data stays raw. Transformations happen downstream. Queries never touch the extraction
          layer.
        </p>
      </div>
    </section>
  );
}

// What comes out: the column shape of the songs table, drawn as a query window.
function TheData() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="The data" />
      </div>
      <InView>
        <Surface grid={false} className="pj-scan">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
            <Tag>Query result</Tag>
            <Tag>raw → structured → queryable</Tag>
          </div>
          <div className="overflow-x-auto px-4 py-3">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr>
                  {sampleColumns.map((c) => (
                    <th
                      key={c}
                      scope="col"
                      className="border-b border-border/70 pb-2 pr-6 font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className="whitespace-nowrap py-1.5 pr-6 font-mono text-[12px] text-[#cfc8b4]"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* The project publishes no dataset, so this is shape, not output. */}
          <p className="border-t border-border/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Illustrative rows — column shape only, not output from a real run
          </p>
        </Surface>
      </InView>

      <div className={`${PROSE}`}>
        <SectionLabel label="Storage" />
        <InView>
          <Surface grid={false} className="px-5 py-4">
            <pre className="pj-terminal overflow-x-auto">{storageTree.join("\n")}</pre>
          </Surface>
        </InView>
        <InView delay={0.05}>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Raw JSON is retained as the source layer while the processed tables provide a compact
            representation for analytics.
          </p>
        </InView>
        <Annotation className="mt-5" rotate={1}>
          keep the source layer untouched.
        </Annotation>
      </div>
    </section>
  );
}

// One format in, another out, and the thing in the middle that does it.
function Format() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Format" title="JSON → CSV" />
      </div>
      <InView>
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
          {[formatComparison.left, formatComparison.right].map((side, i) => (
            <div key={side.name} className={i === 1 ? "md:order-3" : ""}>
              <Surface className="h-full px-5 py-6">
                <Tag>{side.role}</Tag>
                <div className="mt-2 font-mono text-lg text-foreground">{side.name}</div>
                <ul className="mt-4 space-y-1.5">
                  {side.points.map((p) => (
                    <li key={p} className="text-sm text-muted-foreground">
                      — {p}
                    </li>
                  ))}
                </ul>
              </Surface>
            </div>
          ))}
          <div className="flex items-center justify-center md:order-2 md:px-2">
            <div className="text-center">
              <div aria-hidden className="mx-auto mb-2 hidden h-10 w-px bg-border md:block" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                AWS Glue
              </span>
              <div aria-hidden className="mx-auto mt-2 hidden h-10 w-px bg-border md:block" />
            </div>
          </div>
        </div>
      </InView>
      <div className={`${PROSE} mt-6`}>
        <p className="font-mono text-[11px] uppercase leading-loose tracking-[0.2em] text-muted-foreground">
          raw
          <br />↓ transform once
          <br />↓ query many times
        </p>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{nextStep}</p>
        <Annotation className="mt-5" rotate={-1}>
          this is where cost starts to matter.
        </Annotation>
      </div>
    </section>
  );
}

// The argument for the execution model, drawn as the two shapes side by side.
function WhyServerless() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Execution" title="Why serverless?" />
      </div>
      <InView>
        <div className="grid gap-3 md:grid-cols-2">
          <Surface className="px-5 py-6">
            <Tag>Always-running server</Tag>
            <div
              aria-hidden
              className="mt-4 font-mono text-[13px] leading-relaxed text-muted-foreground"
            >
              [ SERVER ]
              <br />
              <span className="text-[#4a4740]">████████████</span>
              <br />
              24 / 7
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Paid for continuously, whether or not there is anything to process.
            </p>
          </Surface>
          <Surface className="px-5 py-6">
            <Tag>Serverless</Tag>
            <ol className="mt-4 space-y-0">
              {["invocation", "Lambda executes", "work completes", "compute stops"].map(
                (step, j, arr) => (
                  <li key={step}>
                    <div className="font-mono text-[13px] text-foreground">{step}</div>
                    {j < arr.length - 1 && (
                      <div aria-hidden className="my-1 ml-[3px] h-4 w-px bg-border" />
                    )}
                  </li>
                )
              )}
            </ol>
          </Surface>
        </div>
      </InView>
      <div className={`${PROSE} mt-6`}>
        <p className="leading-7 text-muted-foreground">
          The extraction workload is intermittent, so keeping infrastructure running continuously
          would introduce unnecessary cost.
        </p>
        <Annotation className="mt-5" rotate={1.5}>
          no execution = no compute
        </Annotation>
      </div>
    </section>
  );
}

function FailureModes() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="What could break?" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {failureModes.map((f, i) => (
          <InView key={f.mode} delay={i * 0.06}>
            <Surface className="h-full px-5 py-5">
              <Tag>{f.mode}</Tag>
              <p className="mt-2 text-sm leading-6 text-foreground">{f.what}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                Mitigation
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{f.fix}</p>
            </Surface>
          </InView>
        ))}
      </div>
      <div className={`${PROSE} mt-6`}>
        <Annotation rotate={-1}>query only what you need</Annotation>
      </div>
    </section>
  );
}

// The whole chain in five beats, written small.
function FlowSummary() {
  return (
    <div className="mt-16">
      <div className={PROSE}>
        <div className="mb-3 flex items-baseline justify-between">
          <Tag>Flow summary</Tag>
          <Tag>extract → query</Tag>
        </div>
      </div>
      <InView>
        <Chain steps={flowSummary} accent="text-primary" />
      </InView>
      <div className={`${PROSE} mt-4`}>
        <Annotation rotate={-1}>raw first, transform later.</Annotation>
      </div>
    </div>
  );
}

export const spotify: CaseStudyContent = {
  category: "Pipeline",
  title: "Spotify AWS Pipeline",
  subtitle: "Python → Lambda → S3 → Glue → Athena",
  description: [
    "A serverless data pipeline that extracts Spotify data, stores raw events in S3, transforms them into normalised tables, and makes them queryable through Athena.",
    "The goal was simple: collect useful data without keeping infrastructure running when there was nothing to process.",
  ],
  headerNote: "built to disappear when nothing is running.",

  snapshot: [
    { label: "Type", value: "Serverless pipeline" },
    { label: "Role", value: "Sole engineer" },
    { label: "Source", value: "Spotify API" },
    { label: "Compute", value: "AWS Lambda" },
    { label: "Storage", value: "Amazon S3" },
    { label: "Query", value: "Athena" },
  ],

  problem: {
    body: [
      "Spotify data is useful only when it can be collected consistently and turned into something that can actually be queried.",
      "A single script run by hand gives you one snapshot and no history. A server that polls the API gives you history and a bill that arrives whether or not anything was listened to.",
    ],
    constraints: [
      "automatic extraction",
      "no continuously running server",
      "durable raw storage",
      "analytics-ready transformation",
      "partitioned data",
      "SQL access",
      "low operating cost",
    ],
    note: "the pipeline should do nothing when there is nothing to process.",
  },

  architecture: {
    intro:
      "Eight stages, each doing one thing. Select any of them to read what it does — and why it is in the chain at all.",
    nodes: flowNodes,
    edges: flowEdges,
    note: "raw → transform → query",
  },

  processIntro: "One pass through the system, from the API call to the answer.",
  process: [
    {
      title: "Extract",
      detail:
        "A CloudWatch schedule invokes the extract Lambda. It exchanges the refresh token for an access token, requests the playlist items, and does nothing else to the response.",
      meta: "Runs",
      metaValue: "extract.py",
    },
    {
      title: "Land raw",
      detail:
        "The untouched JSON is written to raw_data/to_processed/ with a timestamped key, so every run is its own object and nothing overwrites anything.",
    },
    {
      title: "Transform",
      detail:
        "The object landing in S3 triggers the transform Lambda, which splits the payload into songs, albums and artists, parses release dates at whichever precision they arrived in, and deduplicates each table on its own id.",
      meta: "Runs",
      metaValue: "transform.py",
    },
    {
      title: "Archive the source",
      detail:
        "Once the tables are written, the raw object is copied to raw_data/processed/ and removed from the inbox. The source layer moves; it never disappears.",
    },
    {
      title: "Catalog",
      detail:
        "A Glue crawler scans transformed_data/, infers each table's schema and registers them in the Data Catalog as spotify_db.",
    },
    {
      title: "Query",
      detail:
        "Athena reads the cataloged tables directly from S3. No load step, no database server, and nothing running between questions.",
    },
  ],

  implementation: {
    intro: "The two Lambdas, as they are deployed.",
    note: "the part that actually runs →",
    shots: codeShots,
    shotColumns: 2,
  },

  decisions: [
    {
      title: "Why serverless",
      decision: "Run extraction on Lambda against a schedule instead of a hosted worker.",
      reason:
        "The workload is intermittent and event- or schedule-driven, so no infrastructure needs to remain active between executions.",
      tradeoff:
        "Cold starts and a hard execution ceiling. Fine for one API call; the wrong shape entirely if the extraction ever grows into a long-running job.",
    },
    {
      title: "Why S3 for the raw layer",
      decision: "Write the untouched API response to object storage before anything reads it.",
      reason:
        "Durable, inexpensive storage of the source representation means a bad transform costs a re-run rather than the data itself.",
      tradeoff: "Storage of data that is mostly never read again — the cost of being able to rebuild.",
    },
    {
      title: "Why three tables",
      decision: "Split each payload into songs, albums and artists rather than one flat table.",
      reason:
        "They have different grain. Splitting them lets each deduplicate on its own id instead of repeating an album row for every track on it.",
      tradeoff: "Any question that spans entities now needs a join.",
    },
    {
      title: "Why Glue",
      decision: "Let a crawler infer and register the schema instead of declaring it.",
      reason:
        "Managed cataloging without maintaining processing infrastructure, and a new column in the source does not require a deployment before it can be queried.",
      tradeoff: "Schema inference is a guess. A column that arrives empty gets typed by whatever it looked like on the day the crawler ran.",
    },
    {
      title: "Why Athena",
      decision: "Query the objects in place rather than loading them into a database.",
      reason:
        "SQL analysis over S3 with no server to provision, size or keep running between questions.",
      tradeoff:
        "Cost and speed both track bytes scanned, which pushes the real work upstream into how the data is stored.",
    },
  ],

  results: {
    intro:
      "The project publishes no benchmark figures, so what follows describes what the system is rather than how fast it ran on a particular day.",
    facts: [
      { label: "Extraction", value: "Python" },
      { label: "Execution", value: "Serverless" },
      { label: "Storage", value: "Amazon S3" },
      { label: "Record format", value: "CSV" },
      { label: "Query model", value: "SQL" },
      { label: "Orchestration", value: "Event-driven" },
    ],
    outcomes: [
      "Extraction runs on a schedule with no machine to keep alive between runs.",
      "Every raw payload is retained and archived rather than overwritten, so the tables can be rebuilt from source.",
      "One nested payload becomes three deduplicated tables, each keyed on its own id.",
      "The output is queryable with plain SQL through the Glue catalog, with no database to operate.",
    ],
    limitations: [
      "The transform writes CSV, not a columnar format — every query still reads whole rows.",
      "Partitioning is by prefix only; there is no partition projection registered in the catalog.",
      "There is no alerting: a failed run is visible in logs, not announced.",
    ],
  },

  learnings: {
    lead: "Building the pipeline made one thing clear: data engineering isn't just moving data from A to B.",
    body: [
      "The important decisions happen around reliability, storage format, execution model, cost, and how the data will eventually be consumed.",
      "The biggest takeaway was learning to separate ingestion from transformation and analytics instead of treating the pipeline as one large process.",
    ],
    note: "separate the layers and each one gets simpler.",
  },

  stack: ["Python", "AWS Lambda", "Amazon S3", "AWS Glue", "Amazon Athena", "SQL", "CloudWatch"],

  slots: {
    afterProcess: (
      <>
        <Layers />
        <FlowSummary />
      </>
    ),
    afterImplementation: (
      <>
        <TheData />
        <Format />
      </>
    ),
    afterDecisions: <WhyServerless />,
    afterResults: <FailureModes />,
  },
};
