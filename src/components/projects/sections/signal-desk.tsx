import type { CaseStudyContent } from "../case-study";
import {
  axes,
  broadsheetParts,
  deskShots,
  frontPage,
  files,
  flowEdges,
  flowNodes,
  improvements,
  optionalBranches,
  pageCurl,
  press,
  tiers,
  trustLevels,
} from "@/data/projects/signal-desk";
import { CodeShots } from "../CodeShots";
import { Annotation, Chain, InView, SectionLabel, Surface, Tag } from "../notebook";

// Signal Desk's own sections. The project is a newspaper, so its visuals borrow
// from print — rules, columns, stamps, a press schedule — while the page around
// them stays the engineering notebook every other project uses.

const PROSE = "max-w-2xl";

// The two layers that are not the news path, drawn apart from it so neither can
// be mistaken for a source of stories.
function OptionalBranches() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Optional branches" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          Two layers hang off the pipeline without being part of it. Neither is required, and both
          disappear cleanly when their credentials are missing.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {optionalBranches.map((b, i) => (
          <InView key={b.name} delay={i * 0.08}>
            <Surface className="h-full px-5 py-6">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-sm text-foreground">{b.name}</span>
                <Tag>{b.kind}</Tag>
              </div>
              <ol className="mt-4 space-y-0">
                {b.chain.map((step, j) => (
                  <li key={step}>
                    <div className="font-mono text-[12px] text-muted-foreground">{step}</div>
                    {j < b.chain.length - 1 && (
                      <div aria-hidden className="my-1 ml-[3px] h-3.5 w-px bg-border" />
                    )}
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground">
                {b.body}
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground/85">{b.absent}</p>
            </Surface>
          </InView>
        ))}
      </div>
      <div className={`${PROSE} mt-6`}>
        <Annotation rotate={-1}>reader reaction is not a source.</Annotation>
      </div>
    </section>
  );
}

// The central engineering idea, given the room it deserves.
function Legitimacy() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="The core idea" />
        <InView>
          <p className="text-2xl font-medium leading-[1.3] tracking-tight text-foreground">
            Legitimacy without an LLM.
          </p>
        </InView>
        <InView delay={0.06}>
          <p className="mt-4 leading-7 text-muted-foreground">
            Every story gets a tier from the source map, and the system prints the reason behind the
            rating alongside it. Nothing about the judgement is hidden inside a model, which means it
            can be read, argued with, and edited — and it gives the same answer twice.
          </p>
        </InView>
      </div>

      <InView delay={0.1}>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {tiers.map((t) => (
            <Surface key={t.tier} className="h-full px-5 py-5">
              <Tag>{t.tier}</Tag>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.body}</p>
            </Surface>
          ))}
        </div>
      </InView>

      {/* the ratings as they are actually printed, reason and all */}
      <InView delay={0.14}>
        <Surface grid={false} className="mt-3">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
            <Tag>Rating</Tag>
            <Tag>as printed on the story</Tag>
          </div>
          <dl>
            {trustLevels.map((t, i) => (
              <div
                key={t.level}
                className={`px-4 py-3 sm:grid sm:grid-cols-[120px_1fr] sm:gap-5 ${
                  i > 0 ? "border-t border-border/40" : ""
                }`}
              >
                <dt>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                    {t.level}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t.rule}
                  </span>
                </dt>
                <dd className="mt-1.5 text-sm italic leading-6 text-muted-foreground sm:mt-0">
                  &ldquo;{t.example}&rdquo;
                </dd>
              </div>
            ))}
          </dl>
        </Surface>
      </InView>

      <div className={`${PROSE} mt-6`}>
        <Annotation rotate={1}>print the reason, not just the rating.</Annotation>
      </div>
    </section>
  );
}

// Two axes that must never be allowed to collapse into one.
function TwoAxes() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Cross-source framing" />
        <InView>
          <p className="text-lg leading-8 text-foreground">Same story. Different headline.</p>
        </InView>
        <InView delay={0.06}>
          <p className="mt-4 leading-7 text-muted-foreground">
            When several outlets cover one story, each keeps its own headline through the merge. A
            separate rule-based pass then scores that wording on its own — and stops there.
          </p>
        </InView>
      </div>

      <InView delay={0.1}>
        <div className="mt-6 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
          {[axes.legitimacy, axes.framing].map((a, i) => (
            <div key={a.axis} className={i === 1 ? "md:order-3" : ""}>
              <Surface className="h-full px-5 py-6">
                <Tag>{a.axis}</Tag>
                <div className="mt-2 font-mono text-lg uppercase tracking-[0.06em] text-primary">
                  {a.value}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{a.body}</p>
              </Surface>
            </div>
          ))}
          <div className="flex items-center justify-center md:order-2 md:px-2">
            <div className="text-center">
              <div aria-hidden className="mx-auto mb-2 hidden h-8 w-px bg-border md:block" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                never mixed
              </span>
              <div aria-hidden className="mx-auto mt-2 hidden h-8 w-px bg-border md:block" />
            </div>
          </div>
        </div>
      </InView>

      <div className={`${PROSE} mt-5`}>
        <div className="flex flex-wrap items-center gap-2">
          <Tag>Buckets</Tag>
          {axes.labels.map((l) => (
            <span
              key={l}
              className="rounded-[3px] border border-border/70 px-2 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {l}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          A sharply worded headline from a wire is a Critical framing on a High-legitimacy story.
          Collapsing the two would let word choice decide whether a source can be trusted.
        </p>
      </div>
    </section>
  );
}

// The cron, set as a press schedule rather than a config card.
function PressSchedule() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="The press run" />
        <InView>
          <p className="text-lg leading-8 text-foreground">
            The paper gets printed four times a day.
          </p>
        </InView>
      </div>
      <InView delay={0.06}>
        <Surface className="mt-6 px-5 py-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border/70 pb-4">
            <Tag>Press schedule</Tag>
            <span className="font-mono text-[13px] text-primary">
              {press.cron}
              <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {press.zone}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-border/70 py-4">
            {press.runs.map((r) => (
              <div key={r} className="flex items-baseline gap-2">
                <span aria-hidden className="size-1 rounded-full bg-primary/60" />
                <span className="font-mono text-[13px] text-foreground">{r}</span>
              </div>
            ))}
          </div>
          <div className="pt-5">
            <Chain steps={press.chain} accent="text-primary" />
          </div>
        </Surface>
      </InView>
      <div className={`${PROSE} mt-5`}>
        <p className="text-sm leading-6 text-muted-foreground">{press.seed}</p>
        <Annotation className="mt-5" rotate={-1}>
          the stand is never empty.
        </Annotation>
      </div>
    </section>
  );
}

// The paper itself, laid out as its own anatomy.
function TheBroadsheet() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="The interface" />
        <InView>
          <p className="text-lg leading-8 text-foreground">The interface is part of the experiment.</p>
        </InView>
        <InView delay={0.06}>
          <p className="mt-4 leading-7 text-muted-foreground">
            The frontend deliberately avoids looking like a news dashboard. It is an old-world
            broadsheet — warm paper, ink-black structure, one restrained accent — and the processed
            data is what fills it.
          </p>
        </InView>
      </div>
      <InView delay={0.1}>
        <Surface className="mt-6 px-5 py-6">
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {broadsheetParts.map((p) => (
              <div key={p.part} className="border-t border-border/50 pt-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  {p.part}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">{p.body}</dd>
              </div>
            ))}
          </dl>
        </Surface>
      </InView>
      {/* one per row — full-width captures of the deployed paper */}
      <div className="mt-4">
        <CodeShots shots={[frontPage]} columns={1} />
      </div>
      <div className={`${PROSE} mt-6`}>
        <Annotation rotate={1}>the data decides the layout, not the other way round.</Annotation>
      </div>
    </section>
  );
}

// The four desks, each showing a different part of the scoring layer as it
// actually prints. The captions are where the evidence is.
function TheDesks() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="The four desks" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          Same pipeline, four beats. Each desk surfaces a different part of the rule set — and every
          reason line below a headline is the string the scorer wrote.
        </p>
      </div>
      <CodeShots shots={deskShots} columns={1} />
    </section>
  );
}

// The page curl — the strongest piece of frontend engineering in the project.
function PageCurl() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="The page turn" />
        <InView>
          <p className="text-lg leading-8 text-foreground">{pageCurl.lead}</p>
        </InView>
        <InView delay={0.06}>
          <p className="mt-4 leading-7 text-muted-foreground">{pageCurl.body}</p>
        </InView>
      </div>
      <InView delay={0.1}>
        <Surface className="mt-6 px-5 py-6">
          <Chain steps={["Rasterize page", "Map to mesh", "Curl in shader", "Settle"]} />
          <ul className="mt-5 space-y-2 border-t border-border/70 pt-4">
            {pageCurl.effects.map((e) => (
              <li key={e} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <span className="text-primary">•</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </Surface>
      </InView>
      <div className={`${PROSE} mt-5 space-y-3`}>
        <p className="text-sm leading-6 text-muted-foreground">{pageCurl.reuse}</p>
        <p className="text-sm leading-6 text-foreground/85">{pageCurl.fallback}</p>
        <Annotation className="!mt-6" rotate={1}>
          the paper should behave like paper.
        </Annotation>
      </div>
    </section>
  );
}

function Improvements() {
  return (
    <section className={PROSE}>
      <SectionLabel label="What I would improve" />
      <p className="-mt-2 mb-4 text-sm leading-6 text-muted-foreground">
        None of this is built — it is where the next work would go.
      </p>
      <ul className="space-y-2">
        {improvements.map((i) => (
          <li key={i} className="flex gap-3 text-sm leading-6 text-muted-foreground">
            <span className="text-muted-foreground/50">—</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const signalDesk: CaseStudyContent = {
  category: "News intelligence / Data engineering",
  title: "Signal Desk",
  subtitle: "Fetch → Dedupe → Score → Frame → Store → Print",
  description: [
    "A personal news-intelligence desk that collects stories across four desks — Tech & AI, World, India and Esports — then deduplicates, scores, frames and ranks them, and presents the result as a living 1890s broadsheet.",
    "The judgement layer is deterministic. Source legitimacy, corroboration, headline framing, market notes and reader reaction are all decided by rules you can read, with no model anywhere in the scoring loop.",
  ],
  headerNote: "more sources is not more signal.",

  snapshot: [
    { label: "Type", value: "News intelligence / pipeline" },
    { label: "Role", value: "Sole engineer" },
    { label: "Approach", value: "Rule-based" },
    { label: "Compute", value: "Netlify Functions" },
    { label: "Storage", value: "Netlify Blobs" },
    { label: "Frontend", value: "Static broadsheet" },
    { label: "Optional", value: "Tavily · Bluesky · YouTube · Mastodon" },
    { label: "Cost", value: "Free tier" },
  ],

  problem: {
    body: [
      "The problem was never finding news. It was deciding what deserved attention.",
      "Modern aggregation gives you more information without giving you more signal. Signal Desk was built around a different question: can a desk collect from many sources while still showing why a story should be trusted, how independently it was corroborated, and how differently outlets worded the same event?",
      "So the work sits in the processing layer between the feed and the reader — the part most aggregators skip.",
    ],
    constraints: [
      "explainable, inspectable judgement",
      "no model in the scoring loop",
      "independent corroboration counted, not assumed",
      "framing kept off the trust axis",
      "commentary never counted as news",
      "optional services fail silently",
      "zero ongoing cost",
    ],
    note: "show the reasoning, not just the ranking.",
  },

  architecture: {
    intro:
      "Eleven stages from feed to front page. Select any of them to read what it does — and why it is in the chain at all.",
    nodes: flowNodes,
    edges: flowEdges,
    note: "collect → judge → store → print",
  },

  processIntro: "One sweep, from the first fetch to a printed edition.",
  process: [
    { title: "Collect", detail: "Pull stories from every registered feed and API across the four desks, each fetch on its own timeout." },
    { title: "Normalize", detail: "Clean and standardise the incoming records into one shape, with each outlet carried in the story's sources array." },
    { title: "Deduplicate", detail: "Collapse the same story reported by several outlets into one item by canonical URL and title similarity, keeping every outlet's own headline." },
    { title: "Score", detail: "Assign a legitimacy level from the source-tier map and attach the written reason for it." },
    { title: "Corroborate", detail: "Count independent tier-1 sources by distinct domain and raise the confidence — and the wording of the reason — when more than one agrees." },
    { title: "Frame", detail: "Score each retained headline on the AFINN-165 lexicon and bucket it, for stories that kept at least two per-source headlines." },
    { title: "Enrich", detail: "Attach rule-matched market notes, the esports rumor rule, YouTube commentary as its own kind, and Public Pulse reader reaction on World and India." },
    { title: "Store", detail: "Write the whole processed edition to Netlify Blobs as a single JSON document under one key." },
    { title: "Render", detail: "The static frontend reads the stored edition, ranks it by importance, and sets it as a newspaper." },
  ],

  implementation: {
    intro: "What each part of the repository is responsible for.",
    note: "the part that actually runs →",
    blocks: files,
  },

  decisions: [
    {
      title: "Why rules instead of an LLM",
      decision: "Keep every scoring and framing judgement in deterministic code.",
      reason:
        "The core logic has to be inspectable and explainable — the desk prints the reason next to the rating, and that reason has to be the actual rule that fired. It also gives the same answer twice, which a model does not.",
      tradeoff:
        "A domain map cannot judge a source it has never seen. Everything outside it reads as unconfirmed, which is safe but blunt, and the map needs maintaining by hand.",
    },
    {
      title: "Why Netlify Blobs",
      decision: "Store one JSON edition under a single key instead of running a database.",
      reason:
        "The system only ever needs the latest processed edition. That is one document — a blob write is the entire persistence layer, and it costs nothing on the free tier.",
      tradeoff:
        "There is no history. Every sweep overwrites the last, so the desk cannot show how a story's rating changed over time.",
    },
    {
      title: "Why a static frontend",
      decision: "Serve readers an already-processed snapshot through one cached endpoint.",
      reason:
        "A page load should never trigger a fetch against thirty news sources. Reading a single edge-cached blob makes the page instant and the traffic free regardless of how many people open it.",
      tradeoff: "The edition is only as fresh as the last press run — up to six hours old between sweeps.",
    },
    {
      title: "Why legitimacy and framing are separate",
      decision: "Score who reported a story and how they worded it on two axes that never touch.",
      reason:
        "A headline's wording says nothing about whether its source is trustworthy. Merging them would let a sharply worded wire report read as untrustworthy, which is exactly backwards.",
      tradeoff:
        "Two numbers to explain instead of one, and a reader has to be told what each means before either is useful.",
    },
    {
      title: "Why every credential is optional",
      decision: "Make Tavily, Bluesky, YouTube and Mastodon skip cleanly when their keys are unset.",
      reason:
        "The desk has to work as a news system without any paid API. Each optional layer degrades to nothing rather than failing the sweep, so the core is never hostage to a service.",
      tradeoff:
        "Two code paths through every optional layer, and a deployment whose output depends on which keys happen to be present.",
    },
  ],

  results: {
    intro:
      "The project publishes no performance figures, so what follows is what the system produces rather than how fast it produced it.",
    outcomes: [
      "A collection of independent feeds becomes one structured daily edition.",
      "Every story carries a legitimacy level and the written reason behind it.",
      "Independent corroboration is counted by distinct domain and named in the rating.",
      "Each outlet's own headline survives the merge and is framed on its own axis.",
      "Rule-matched market notes appear only where a mechanism is clear, and nowhere else.",
      "Reader reaction and YouTube commentary are carried as separate kinds, never as news.",
      "Importance decides the layout — lead well, columns, or the briefs rail.",
      "Four scheduled press runs a day, with a build-time seed so a fresh deploy is never blank.",
      "The whole thing runs on a free tier with no database and no required keys.",
    ],
    limitations: [
      "Only the latest edition is stored; nothing is kept for historical comparison.",
      "The sentiment lexicon is English-only, so Hindi replies on the India desk score neutral by default.",
      "Any domain outside the tier map reads as unconfirmed, however reputable it is.",
      "Public Pulse finds discussion but misses posts that paraphrase a headline rather than echo it.",
    ],
  },

  learnings: {
    lead: "The interesting part wasn't collecting the news. It was deciding what deserved to survive the pipeline.",
    body: [
      "Collecting is the easy half — feeds are feeds. The judgement is where the actual engineering is, and the thing that made it tractable was refusing to let a model make it. A rule I can print next to the story is one I can defend; a score out of a model is one I can only hope about.",
      "The other lesson was about keeping signals apart. Legitimacy, framing and reader reaction all describe a story, and it is very tempting to average them into one number. Every time I tried, the result got less useful — a sharply worded wire report came out looking untrustworthy. Three honest axes beat one confident one.",
      "Designing around a free tier turned out to be a design constraint rather than a limitation. No database meant one stored edition; no always-on server meant a scheduled sweep and a static read. Both of those made the system simpler than the version I would have built with a budget.",
      "And building it as a newspaper forced a kind of clarity I would not have got from a dashboard. A broadsheet has to decide what the lead is. That single requirement is what pushed the ranking to come out of signals the pipeline already produced, rather than a new score invented to fill a layout.",
    ],
    note: "graceful degradation is a feature, not a fallback.",
  },

  stack: [
    "JavaScript (ESM)",
    "Node 20",
    "Netlify Functions",
    "Netlify Blobs",
    "fast-xml-parser",
    "sentiment (AFINN-165)",
    "Three.js",
    "WebGL / GLSL",
    "modern-screenshot",
  ],

  slots: {
    afterArchitecture: <OptionalBranches />,
    afterProcess: (
      <>
        <Legitimacy />
        <TwoAxes />
      </>
    ),
    afterImplementation: (
      <>
        <PressSchedule />
        <TheBroadsheet />
        <TheDesks />
        <PageCurl />
      </>
    ),
    afterResults: <Improvements />,
  },
};
