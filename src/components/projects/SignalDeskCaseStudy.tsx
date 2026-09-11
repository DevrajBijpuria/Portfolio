"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { frontPage, deskShots, tiers, improvements } from "@/data/projects/signal-desk";
import { signalDesk } from "@/components/projects/sections/signal-desk";
import { CodeShots } from "@/components/projects/CodeShots";
import {
  Annotation,
  Chain,
  InView,
  MetaStrip,
  SectionLabel,
  Surface,
  Tag,
  Ground,
} from "@/components/projects/notebook";

// The Product-Management view of Signal Desk. A companion to the technical
// notebook at /projects/signal-desk, not a replacement — it reuses the same
// screenshots, the same decisions and trade-offs, the same components and theme,
// and adds only the product framing around them.
//
// HONESTY RULE (mirrors the technical page): no user research was run and the
// project publishes no metrics, so everything user- or outcome-facing is labelled
// as a hypothesis, a proposed KPI, or a proposed experiment. Nothing is presented
// as a measured result.

const TECH_PATH = "/projects/signal-desk";
const REPO = "https://github.com/DevrajBijpuria/signal-desk";
const PROSE = "max-w-2xl";

const snapshot = [
  { label: "Discipline", value: "Product + engineering" },
  { label: "Role", value: "Sole PM & builder" },
  { label: "Stage", value: "Built & deployed" },
  { label: "Research", value: "None yet — hypotheses" },
  { label: "Metrics", value: "Proposed KPIs" },
  { label: "Cost", value: "Free tier" },
];

// The insight the whole product is organised around — three questions a reader
// asks of any story.
const questions = [
  { q: "What happened?", a: "Discovery and deduplication surface the event once, from many outlets." },
  { q: "Can I trust it?", a: "A rule-based legitimacy signal, with the reason printed next to the story." },
  { q: "How are people reacting?", a: "Public Pulse carries reader reaction as context, never as a source." },
];

// User + pain points. Explicitly a hypothesis — there is no research behind it.
const userHypothesis =
  "No formal user research has been run, so this is a stated assumption, not a finding. The product is designed for a reader who follows several beats at once — tech, world, India, esports — reads across many outlets, and wants to judge how much to trust a story without leaving the page.";

const painPoints = [
  "Judging trust means manually checking who else reported the same story.",
  "Corroboration is invisible in a feed — a single blog and a wire report look identical.",
  "Reaction lives on other platforms, so gauging response means leaving the article.",
  "The same event, reported by ten outlets, arrives as ten items and buries the signal.",
];

// Before / after. The "before" is hypothesised current behaviour, not an observed
// baseline — labelled as such so it is never read as data.
const beforeFlow = [
  "Discover story",
  "Open article",
  "Search other sources",
  "Check credibility by hand",
  "Search social platforms",
  "Form an opinion",
];
const afterFlow = [
  "Discover story",
  "Read story",
  "Evaluate credibility inline",
  "Compare framing",
  "See public sentiment",
  "Form an informed view",
];

// The core user journey, and the product capability that carries each step.
const journey = [
  { step: "Discover", support: "Four desks aggregate feeds and APIs into one scan." },
  { step: "Select a story", support: "Importance ranking decides the lead and the layout." },
  { step: "Read", support: "The broadsheet renders the story in its full context." },
  { step: "Verify", support: "A legitimacy tier and its written reason sit on the story." },
  { step: "Understand context", support: "Corroboration count and per-source framing, side by side." },
  { step: "View public opinion", support: "Public Pulse reader reaction on the World and India desks." },
  { step: "Form a view", support: "Trust, framing and reaction are kept apart, never averaged." },
];

// Six product capabilities, each answering what / why / user value. Drawn from
// the real feature set on the technical page.
const features = [
  {
    name: "News discovery",
    what: "Aggregation across four desks from RSS/Atom feeds and a few APIs, with an optional search layer.",
    why: "Any single outlet is one editorial view of an event.",
    value: "One place to scan many beats instead of ten open tabs.",
  },
  {
    name: "Source credibility",
    what: "A rule-based legitimacy signal from a source-tier map plus corroboration, with the reason printed on the story.",
    why: "A headline alone gives a reader nothing to judge trust with.",
    value: "Assess how much confidence a story deserves, inline, in a glance.",
  },
  {
    name: "Public sentiment",
    what: "Public Pulse pulls reader reaction from Bluesky, YouTube and Mastodon on the World and India desks.",
    why: "How people are reacting is part of understanding a story.",
    value: "Gauge the response without leaving for another platform.",
  },
  {
    name: "Story deduplication",
    what: "The same event from many outlets is merged into one item that keeps every outlet's own headline.",
    why: "Duplicate coverage clutters the feed and hides corroboration.",
    value: "One clean item, plus visible evidence of independent coverage.",
  },
  {
    name: "Newspaper reading experience",
    what: "An 1890s broadsheet where a story's importance decides its footprint on the page.",
    why: "A paper is forced to decide what the lead is; a feed never is.",
    value: "Visual hierarchy tells the reader what matters before they read a word.",
  },
  {
    name: "Scheduled, cached intelligence",
    what: "Four press runs a day write one stored edition; page loads read a single cached blob.",
    why: "Opening the page should never trigger a fetch against thirty feeds.",
    value: "Instant, always-available reading at zero ongoing cost.",
  },
];

// The simplified product + system view. Same architecture as the technical
// diagram, drawn for a product reader — no technologies added that the project
// does not actually use.
const systemLayers = [
  { layer: "News sources", note: "Feeds & APIs, four desks" },
  { layer: "Discovery / aggregation", note: "Fetch, normalise" },
  { layer: "Processing", note: "Deduplicate to one item" },
  { layer: "Credibility + sentiment", note: "Rules score trust, framing, reaction" },
  { layer: "Deduplication / storage", note: "One edition, stored & cached" },
  { layer: "Signal Desk experience", note: "The broadsheet a reader opens" },
];

// Metrics, as a hierarchy. There is no analytics data behind any of these — each
// is a metric the product would be judged on, labelled proposed. Every entry
// answers one question: what decision does this metric help us make?
const northStar = {
  name: "Meaningful news sessions",
  definition:
    "A session in which a reader meaningfully consumes a story and/or explores its context — not a bounce, not a headline skim.",
  decision:
    "Tells us whether the desk is doing its real job — helping people read and understand — rather than just earning clicks.",
};

const metricGroups = [
  {
    group: "Primary metrics",
    items: [
      { name: "Story engagement", decision: "Are readers actually reading, or scrolling past?" },
      { name: "Discovery", decision: "Is the desk broadening what a reader sees beyond one outlet?" },
      { name: "Context usage", decision: "Do readers use the trust / context layer at all?" },
    ],
  },
  {
    group: "Trust / quality",
    items: [
      { name: "Credibility-signal interaction", decision: "Is the legitimacy signal noticed and used?" },
      { name: "Duplicate-story rate", decision: "Is the deduplication layer keeping the edition clean?" },
    ],
  },
  {
    group: "Retention",
    items: [
      { name: "Returning readers / repeat sessions", decision: "Does the desk earn a habit past the first visit?" },
    ],
  },
  {
    group: "Guardrails",
    items: [
      { name: "Bounce rate", decision: "Is the front page failing to earn a first read?" },
      { name: "Misleading-story reports", decision: "Is scoring ever surfacing something it should not trust?" },
      { name: "Sentiment misinterpretation", decision: "Are readers mistaking public reaction for fact?" },
    ],
  },
];

// Proposed experiments to validate the hypotheses above. None have been run.
const experiments = [
  {
    name: "Credibility-signal visibility",
    hypothesis: "Showing the written reason increases how often readers engage with trust context.",
    test: "Show vs. hide the reason line under a headline; read against the context-usage KPI.",
  },
  {
    name: "Framing display",
    hypothesis: "Per-source headlines help readers judge coverage more than a single merged headline.",
    test: "Per-source framing vs. one headline on clustered stories; read against engagement.",
  },
  {
    name: "Ranking signals",
    hypothesis: "The importance formula changes which stories readers open first.",
    test: "Vary the inputs to the render-time ranking; read against discovery and story engagement.",
  },
];

// ---- user research & validation (planned, not conducted) ----
const researchObjectives = [
  "Discovering relevant news across beats",
  "Evaluating whether a source is credible",
  "Handling duplicate coverage of one event",
  "Understanding how differently outlets cover the same story",
  "Reading and interpreting public reaction",
  "Switching between platforms to build enough context to trust a story",
];

const interviewQuestions = [
  "How do you usually discover news?",
  "How many sources do you check for an important story?",
  "How do you decide whether a source is trustworthy?",
  "Do you ever compare multiple articles about the same story?",
  "Do you look at social-media reactions to a story?",
  "What makes you distrust a news story?",
  "What information would make you feel more confident about a story?",
];

// HYPOTHESIS → RESEARCH QUESTION → EVIDENCE → DECISION. Evidence and decision are
// deliberately unfilled: the point is that decisions move once evidence exists.
const validationRows = [
  {
    hypothesis: "Readers cross-check several sources to judge trust.",
    question: "How many sources do you check, and why?",
  },
  {
    hypothesis: "Credibility is hard to assess from a headline alone.",
    question: "How do you decide a source is trustworthy?",
  },
  {
    hypothesis: "Duplicate coverage adds friction, not value.",
    question: "Do repeated versions of a story help or annoy you?",
  },
  {
    hypothesis: "Public reaction is context readers want — but not proof.",
    question: "Do you read reactions, and do they change your view?",
  },
];

// ---- a compact PRD for one representative feature ----
const prd = {
  feature: "Story Context",
  userStory:
    "As a reader, I want to understand the credibility and broader context of a story without leaving the article, so I can make a more informed judgment.",
  problem:
    "To evaluate a story today, a reader may have to switch between several sources and social platforms. (Product hypothesis — to be validated by research.)",
  functional: [
    "Show the credibility signal.",
    "Explain why the signal was assigned.",
    "Show corroborating coverage.",
    "Show per-source framing.",
    "Keep public reaction separate from credibility.",
    "Allow users to inspect the underlying sources.",
  ],
  nonGoals: [
    "Determine whether a story is objectively true.",
    "Treat public sentiment as factual evidence.",
    "Combine credibility, framing and sentiment into one score.",
  ],
  acceptance: [
    "Understandable without technical knowledge.",
    "Lets the reader inspect the supporting sources.",
    "Clearly distinguishes factual reporting from public opinion.",
    "Never presents sentiment as evidence.",
    "Preserves the reader's control over what to trust.",
  ],
};

// ---- prioritization: Impact × Effort × Confidence. Current product judgment,
// not validated by user data. Priority is the resulting call (P0 / P1 / P2). ----
const priorities = [
  { initiative: "Expand source-tier map", impact: "High", effort: "Low", confidence: "High", priority: "P0" },
  { initiative: "Improve reader-reaction matching", impact: "High", effort: "Medium", confidence: "Medium", priority: "P0" },
  { initiative: "Refine framing thresholds", impact: "Medium", effort: "Low", confidence: "Medium", priority: "P1" },
  { initiative: "Keep historical editions", impact: "Medium", effort: "Medium", confidence: "High", priority: "P1" },
  { initiative: "Extend editorial ranking", impact: "High", effort: "High", confidence: "Medium", priority: "P2" },
];

// Extra framing for the decisions reused from the technical page, keyed by title.
// problem/options are honest reconstructions of the real choice — no new facts;
// decision/reason/tradeoff still come from the shared signalDesk source.
const decisionFraming: Record<string, { problem: string; options: string[] }> = {
  "Why rules instead of an LLM": {
    problem: "The credibility judgment has to be something a reader can trust, question, and get the same answer from twice.",
    options: ["An LLM that scores each story", "A rule-based source-tier map with a written reason"],
  },
  "Why Netlify Blobs": {
    problem: "The processed edition has to persist between the scheduled sweep and the reader.",
    options: ["Run a hosted database", "Store one JSON edition as a single blob"],
  },
  "Why a static frontend": {
    problem: "A page load must never depend on fetching thirty live news feeds.",
    options: ["Fetch and process on every request", "Serve a pre-processed, edge-cached edition"],
  },
  "Why legitimacy and framing are separate": {
    problem: "Trust and tone both describe a story, and the tempting move is to average them into one number.",
    options: ["One blended credibility + tone score", "Two independent axes that never mix"],
  },
  "Why every credential is optional": {
    problem: "The desk has to work as a news system even with no paid API keys present.",
    options: ["Require keys for the optional layers", "Degrade each optional layer to nothing when unset"],
  },
};

// ---- transferable product thinking ----
const transferableSkills = [
  "Discovery",
  "Ranking",
  "Information quality",
  "Trust signals",
  "User context",
  "Personalization concepts",
  "Experimentation",
  "Product metrics",
  "Trade-offs",
];

export function SignalDeskCaseStudy() {
  const reduced = useReducedMotion() ?? false;

  const enter = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0.2 : 0.5,
      delay: reduced ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <div>
      <Ground mark="Signal Desk · product case study" path="/projects/signal-desk-case-study" />

      {/* 01 — hero */}
      <motion.header {...enter(0)} className={PROSE}>
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Case study · Product management
        </div>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          Signal Desk
        </h1>
        <p className="mt-3 max-w-xl text-lg leading-8 text-foreground">
          A news-intelligence platform built around discovery, trust and public opinion.
        </p>
      </motion.header>

      <motion.div {...enter(0.1)} className={`${PROSE} mt-7`}>
        <p className="leading-7 text-muted-foreground">
          The technical page shows how Signal Desk works. This one is about the product thinking
          behind it — the problem it targets, who it is for, the decisions and their trade-offs, how
          success would be measured, and why it was built the way it was.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={TECH_PATH}
            className="group inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:bg-accent"
          >
            View technical implementation
            <ArrowRight className="size-4 -translate-x-0.5 opacity-60 transition-transform group-hover:translate-x-0" />
          </Link>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Source on GitHub
            <ArrowUpRight className="size-4 opacity-60" />
          </a>
        </div>
      </motion.div>

      <motion.div {...enter(0.16)} className={`${PROSE} mt-8`}>
        <MetaStrip items={snapshot} />
      </motion.div>

      {/* 02 — product thesis */}
      <section>
        <SectionLabel label="Product thesis" />
        <InView>
          <p className="max-w-3xl text-2xl font-medium leading-[1.3] tracking-tight text-foreground sm:text-3xl">
            Information is abundant. Deciding what matters — and what to trust — is not.
          </p>
        </InView>
        <div className={`${PROSE} mt-6`}>
          <Annotation rotate={-1}>more sources is not more signal.</Annotation>
        </div>
      </section>

      {/* 03 — the problem */}
      <section className={PROSE}>
        <SectionLabel label="The problem" />
        <InView>
          <p className="leading-7 text-foreground">
            Modern aggregation gives a reader more information without giving them more signal. The
            hard part was never finding news — it was deciding what deserved attention, and how much
            of it to believe.
          </p>
        </InView>
        <InView delay={0.05}>
          <p className="mt-4 leading-7 text-muted-foreground">
            So the product lives in the processing layer between the feed and the reader — the part
            most aggregators skip: showing why a story can be trusted, how independently it was
            corroborated, and how differently outlets worded the same event.
          </p>
        </InView>
      </section>

      {/* 04 — user */}
      <section className={PROSE}>
        <SectionLabel label="Who it is for" />
        <InView>
          <div className="flex items-center gap-2">
            <Tag>Assumed primary user</Tag>
            <Hypothesis />
          </div>
        </InView>
        <InView delay={0.05}>
          <p className="mt-3 leading-7 text-muted-foreground">{userHypothesis}</p>
        </InView>
      </section>

      {/* 05 — pain points */}
      <section className={PROSE}>
        <SectionLabel label="Pain points" />
        <InView>
          <div className="mb-4">
            <Tag>Hypothesised friction · not yet validated</Tag>
          </div>
        </InView>
        <ul className="space-y-0">
          {painPoints.map((p, i) => (
            <InView key={p} delay={i * 0.05}>
              <li className="flex gap-4 border-t border-border py-4">
                <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm leading-6 text-muted-foreground">{p}</span>
              </li>
            </InView>
          ))}
        </ul>
      </section>

      {/* 05b — user research & validation (planned, honest) */}
      <section>
        <div className={PROSE}>
          <SectionLabel label="User research & validation" />
          <InView>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Tag>Research status</Tag>
              <Hypothesis text="research plan" />
            </div>
          </InView>
          <InView delay={0.04}>
            <p className="leading-7 text-foreground">
              Formal user research has not yet been conducted. The plan below is designed to validate
              the product hypotheses on this page before they are treated as product assumptions.
            </p>
          </InView>
        </div>

        <div className={`${PROSE} mt-8`}>
          <InView>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Research objectives
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Validate whether readers actually struggle with:
            </p>
          </InView>
          <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {researchObjectives.map((o, i) => (
              <InView key={o} delay={i * 0.03}>
                <li className="flex items-baseline gap-2 text-sm leading-6 text-muted-foreground">
                  <span className="text-primary">•</span>
                  {o}
                </li>
              </InView>
            ))}
          </ul>
        </div>

        <InView delay={0.06}>
          <Surface className="mt-6 px-5 py-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Interview questions
            </span>
            <ol className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
              {interviewQuestions.map((q, i) => (
                <li key={q} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="font-mono text-[11px] text-primary/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          </Surface>
        </InView>

        <div className={`${PROSE} mt-8`}>
          <InView>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Validation framework
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Each hypothesis moves to a decision only once evidence exists — so the product changes
              with the research, not around it.
            </p>
          </InView>
        </div>
        <InView delay={0.06}>
          <Surface grid={false} className="mt-4">
            <div className="hidden grid-cols-[1.4fr_1.2fr_0.8fr_0.9fr] gap-4 border-b border-border/70 px-4 py-2.5 md:grid">
              {["Hypothesis", "Research question", "Evidence", "Decision"].map((h) => (
                <Tag key={h}>{h}</Tag>
              ))}
            </div>
            {validationRows.map((r, i) => (
              <div
                key={r.hypothesis}
                className={`grid gap-2 px-4 py-3.5 md:grid-cols-[1.4fr_1.2fr_0.8fr_0.9fr] md:gap-4 ${
                  i > 0 ? "border-t border-border/40" : ""
                }`}
              >
                <p className="text-sm leading-6 text-foreground">{r.hypothesis}</p>
                <p className="text-sm leading-6 text-muted-foreground">{r.question}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70">
                  To be gathered
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary/70">
                  Keep / revise / drop
                </p>
              </div>
            ))}
          </Surface>
        </InView>
        <div className={`${PROSE} mt-6`}>
          <Annotation rotate={-1}>a hypothesis is not a finding until the research says so.</Annotation>
        </div>
      </section>

      {/* 06 — product insight */}
      <section>
        <div className={PROSE}>
          <SectionLabel label="Product insight" />
          <InView>
            <p className="leading-7 text-foreground">
              A reader asks three questions of any story. Signal Desk is organised around answering
              all three on the page, instead of leaving the reader to answer them in ten tabs.
            </p>
          </InView>
        </div>
        <InView delay={0.08}>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {questions.map((q) => (
              <Surface key={q.q} className="h-full px-5 py-6">
                <p className="text-lg font-medium leading-snug text-foreground">{q.q}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{q.a}</p>
              </Surface>
            ))}
          </div>
        </InView>
      </section>

      {/* 06b — feature spec: Story Context (compact PRD) */}
      <section>
        <div className={PROSE}>
          <SectionLabel label="Feature spec — Story Context" />
          <InView>
            <p className="leading-7 text-muted-foreground">
              One representative feature as a compact spec — the reasoning that turns the product
              thesis into something buildable.
            </p>
          </InView>
        </div>
        <InView delay={0.06}>
          <Surface grid={false} className="mt-6 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-black/25 px-4 py-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground">
                PRD · {prd.feature}
              </span>
              <Tag>v0 · draft</Tag>
            </div>
            <div className="px-5 py-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                User story
              </p>
              <p className="mt-2 border-l-2 border-primary/40 pl-4 text-base leading-7 text-foreground">
                {prd.userStory}
              </p>

              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    Problem
                  </p>
                  <Hypothesis />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{prd.problem}</p>
              </div>

              <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    Requirements
                  </p>
                  <ul className="mt-3 space-y-2">
                    {prd.functional.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm leading-6 text-foreground/90">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary/60" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    Non-goals
                  </p>
                  <ul className="mt-3 space-y-2">
                    {prd.nonGoals.map((g) => (
                      <li key={g} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                        <span aria-hidden className="mt-0.5 shrink-0 font-mono text-xs text-muted-foreground/60">
                          ✕
                        </span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Surface>
        </InView>
      </section>

      {/* 07 — before / after */}
      <section>
        <div className={PROSE}>
          <SectionLabel label="Before / after" />
          <InView>
            <p className="leading-7 text-muted-foreground">
              The value proposition, drawn as a flow. The &ldquo;before&rdquo; is hypothesised current
              behaviour, not a measured baseline.
            </p>
          </InView>
        </div>
        <InView delay={0.06}>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <FlowColumn label="Current · hypothesised" tone="muted" steps={beforeFlow} />
            <FlowColumn label="With Signal Desk" tone="primary" steps={afterFlow} />
          </div>
        </InView>
      </section>

      {/* 08 — solution / product experience (screenshots as evidence) */}
      <section>
        <div className={PROSE}>
          <SectionLabel label="The product experience" />
          <InView>
            <p className="leading-7 text-muted-foreground">
              The interface is the argument. These are captures of the deployed desk — the same
              screenshots as the technical page, read here as product evidence. Every reason line
              under a headline is the string the scorer actually wrote.
            </p>
          </InView>
        </div>

        {/* annotated hero shot — the front page, with product callouts */}
        <InView delay={0.06}>
          <AnnotatedShot
            src={frontPage.src}
            alt={frontPage.file}
            callouts={[
              { label: "Discovery", note: "Four desks in one masthead — scan many beats at once." },
              { label: "Trust at a glance", note: "Source stamps mark each story verified, reported or unconfirmed." },
              { label: "Hierarchy", note: "Importance decides the lead; the layout tells you what matters." },
            ]}
          />
        </InView>

        <div className={`${PROSE} mt-8`}>
          <InView>
            <p className="text-sm leading-6 text-muted-foreground">
              The four desks each surface a different part of the credibility and framing layer:
            </p>
          </InView>
        </div>
        <div className="mt-4">
          <CodeShots shots={deskShots} columns={1} />
        </div>
      </section>

      {/* 09 — user journey */}
      <section>
        <div className={PROSE}>
          <SectionLabel label="The user journey" />
          <InView>
            <p className="leading-7 text-muted-foreground">
              One journey, and the capability that carries each step. No step sends the reader off the
              page to answer a question the desk could answer for them.
            </p>
          </InView>
        </div>
        <InView delay={0.06}>
          <Surface className="mt-6 px-5 py-6">
            <ol className="space-y-0">
              {journey.map((j, i) => (
                <li
                  key={j.step}
                  className={`grid gap-2 py-4 sm:grid-cols-[180px_1fr] sm:gap-6 ${
                    i > 0 ? "border-t border-border/50" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground">
                      {j.step}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{j.support}</p>
                </li>
              ))}
            </ol>
          </Surface>
        </InView>
      </section>

      {/* 10 — feature callouts */}
      <section>
        <div className={PROSE}>
          <SectionLabel label="Core capabilities" />
          <InView>
            <p className="leading-7 text-muted-foreground">
              What each capability is, why it exists, and the value it gives the reader.
            </p>
          </InView>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {features.map((f, i) => (
            <InView key={f.name} delay={(i % 2) * 0.06}>
              <Surface className="h-full px-5 py-6">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                  {f.name}
                </h3>
                <dl className="mt-4 space-y-3">
                  <Detail term="What" text={f.what} />
                  <Detail term="Why" text={f.why} />
                  <Detail term="User value" text={f.value} accent />
                </dl>
              </Surface>
            </InView>
          ))}
        </div>
      </section>

      {/* 11 — simplified product + system architecture */}
      <section>
        <div className={PROSE}>
          <SectionLabel label="Product + system view" />
          <InView>
            <p className="leading-7 text-muted-foreground">
              The same architecture as the technical page, drawn for product: what happens between a
              news source and the reader. The point is that the product decisions sit on a system
              that was actually built.
            </p>
          </InView>
        </div>
        <InView delay={0.06}>
          <Surface className="mt-6 px-5 py-8 sm:px-8">
            <ol className="mx-auto max-w-md space-y-0">
              {systemLayers.map((l, i) => (
                <li key={l.layer}>
                  <div className="rounded-[4px] border border-border/70 px-4 py-3 text-center">
                    <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-foreground">
                      {l.layer}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{l.note}</div>
                  </div>
                  {i < systemLayers.length - 1 && (
                    <div aria-hidden className="mx-auto my-1.5 h-4 w-px bg-primary/40" />
                  )}
                </li>
              ))}
            </ol>
          </Surface>
        </InView>
        <div className={`${PROSE} mt-5`}>
          <Link
            href={TECH_PATH}
            className="group inline-flex items-center gap-2 text-sm text-primary"
          >
            See the full technical architecture
            <ArrowRight className="size-4 -translate-x-0.5 opacity-70 transition-transform group-hover:translate-x-0" />
          </Link>
        </div>
      </section>

      {/* 12 — product decisions (expandable, reused from the technical page) */}
      <section className={PROSE}>
        <SectionLabel label="Product decisions" />
        <InView>
          <p className="leading-7 text-muted-foreground">
            The decisions that shaped the product — each read as problem, options weighed, decision,
            why, and what it cost. These are the same choices as the technical page, framed here for
            their product reasoning. Expand any one.
          </p>
        </InView>
        <div className="mt-6 space-y-2">
          {signalDesk.decisions?.map((d) => {
            const framing = decisionFraming[d.title];
            return (
              <InView key={d.title}>
                <details className="group rounded-md border border-border bg-card/40 open:bg-card/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground">
                      {d.title}
                    </span>
                    <Plus className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
                  </summary>
                  <div className="space-y-4 border-t border-border px-4 py-4">
                    {framing && (
                      <>
                        <DecisionField label="Problem">
                          <span className="text-muted-foreground">{framing.problem}</span>
                        </DecisionField>
                        <DecisionField label="Options weighed">
                          <span className="flex flex-wrap gap-2">
                            {framing.options.map((o, i) => {
                              const chosen = i === framing.options.length - 1;
                              return (
                                <span
                                  key={o}
                                  className={`rounded-[3px] border px-2 py-1 font-mono text-[11px] ${
                                    chosen
                                      ? "border-primary/50 text-primary"
                                      : "border-border/70 text-muted-foreground/70 line-through decoration-muted-foreground/40"
                                  }`}
                                >
                                  {o}
                                </span>
                              );
                            })}
                          </span>
                        </DecisionField>
                      </>
                    )}
                    <DecisionField label="Decision">
                      <span className="text-foreground">{d.decision}</span>
                    </DecisionField>
                    <DecisionField label="Why">
                      <span className="text-muted-foreground">{d.reason}</span>
                    </DecisionField>
                    {d.tradeoff && (
                      <DecisionField label="Trade-off">
                        <span className="block border-l border-border pl-3 text-muted-foreground">
                          {d.tradeoff}
                        </span>
                      </DecisionField>
                    )}
                  </div>
                </details>
              </InView>
            );
          })}
        </div>
      </section>

      {/* 13 — metrics, as a hierarchy */}
      <section>
        <div className={PROSE}>
          <SectionLabel label="How success would be measured" />
          <InView>
            <div className="flex flex-wrap items-center gap-2">
              <Tag>Metric hierarchy</Tag>
              <Hypothesis text="no analytics data yet" />
            </div>
          </InView>
          <InView delay={0.05}>
            <p className="mt-3 leading-7 text-muted-foreground">
              The project publishes no usage figures, so there are no results to report — only the
              metrics the product would be judged on, arranged from the one that matters most down to
              the guardrails that keep it honest. Each answers one question: what decision does it help
              us make?
            </p>
          </InView>
        </div>

        {/* north star */}
        <InView delay={0.06}>
          <Surface className="mt-6 px-6 py-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                North star metric
              </span>
              <span className="rounded-[3px] border border-primary/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-primary/80">
                Proposed
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              {northStar.name}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {northStar.definition}
            </p>
            <p className="mt-4 border-t border-border/50 pt-3 text-sm leading-6 text-foreground/90">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Decision it drives —{" "}
              </span>
              {northStar.decision}
            </p>
          </Surface>
        </InView>

        {/* supporting tiers */}
        <div className="mt-8 space-y-8">
          {metricGroups.map((g) => (
            <div key={g.group}>
              <InView>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {g.group}
                </p>
              </InView>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((m, i) => (
                  <InView key={m.name} delay={(i % 3) * 0.04}>
                    <Surface className="h-full px-5 py-5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
                          {m.name}
                        </span>
                        <span className="rounded-[3px] border border-primary/30 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-primary/70">
                          Proposed
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/80">
                          Helps decide —{" "}
                        </span>
                        {m.decision}
                      </p>
                    </Surface>
                  </InView>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`${PROSE} mt-6`}>
          <p className="text-sm leading-6 text-muted-foreground">
            Labels stay honest: everything here is <span className="text-primary/80">Proposed</span> or
            a hypothesis. An{" "}
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
              Actual result
            </span>{" "}
            label would appear only once real usage data exists.
          </p>
        </div>
      </section>

      {/* 14 — experimentation */}
      <section className={PROSE}>
        <SectionLabel label="How the hypotheses would be tested" />
        <InView>
          <div className="mb-4">
            <Tag>Proposed experiments · not yet run</Tag>
          </div>
        </InView>
        <div className="space-y-0">
          {experiments.map((e, i) => (
            <InView key={e.name} delay={i * 0.05}>
              <div className="border-t border-border py-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                  {e.name}
                </div>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  <span className="text-muted-foreground">Hypothesis — </span>
                  {e.hypothesis}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
                    Test:{" "}
                  </span>
                  {e.test}
                </p>
              </div>
            </InView>
          ))}
        </div>
      </section>

      {/* 15 — technical execution */}
      <section className={PROSE}>
        <SectionLabel label="Execution" />
        <InView>
          <p className="leading-7 text-foreground">
            This is not a mockup. Signal Desk is a deployed, working system — the product decisions
            above were made against something real, and then built.
          </p>
        </InView>
        <InView delay={0.05}>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {signalDesk.stack?.map((t) => (
              <span
                key={t}
                className="rounded-[3px] border border-border/70 px-2 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </InView>
        <InView delay={0.08}>
          <Link
            href={TECH_PATH}
            className="group mt-6 inline-flex items-center gap-2 rounded-md border border-border px-4 py-3 text-sm transition-colors hover:bg-accent"
          >
            View technical implementation
            <ArrowRight className="size-4 -translate-x-1 opacity-60 transition-transform group-hover:translate-x-0" />
          </Link>
        </InView>
      </section>

      {/* 16 — trade-offs (limitations, real) */}
      {signalDesk.results?.limitations && (
        <section className={PROSE}>
          <SectionLabel label="Trade-offs it accepts" />
          <InView>
            <p className="leading-7 text-muted-foreground">
              Every product decision cost something. These are the limits the current product lives
              with, stated plainly.
            </p>
          </InView>
          <ul className="mt-5 space-y-2">
            {signalDesk.results.limitations.map((l) => (
              <InView key={l}>
                <li className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="text-muted-foreground/50">—</span>
                  <span>{l}</span>
                </li>
              </InView>
            ))}
          </ul>
        </section>
      )}

      {/* 16b — prioritization (Impact × Effort) */}
      <section>
        <div className={PROSE}>
          <SectionLabel label="Prioritization" />
          <InView>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Tag>Impact × Effort × Confidence</Tag>
              <Hypothesis text="current prioritization judgment — to be validated with user research and product data" />
            </div>
          </InView>
          <InView delay={0.04}>
            <p className="leading-7 text-muted-foreground">
              Product management is not just generating features — it is choosing which ones earn the
              next unit of effort. This is my current product judgment, not a ranking validated by user
              data.
            </p>
          </InView>
        </div>

        <InView delay={0.06}>
          <Surface grid={false} className="mt-6">
            {/* header — desktop only */}
            <div className="hidden gap-4 border-b border-border/70 px-4 py-2.5 md:grid md:grid-cols-[1.7fr_repeat(3,0.8fr)_0.7fr]">
              {["Initiative", "Impact", "Effort", "Confidence", "Priority"].map((h) => (
                <Tag key={h}>{h}</Tag>
              ))}
            </div>
            {priorities.map((row, i) => (
              <div
                key={row.initiative}
                className={`grid gap-x-4 gap-y-1.5 px-4 py-3.5 md:grid-cols-[1.7fr_repeat(3,0.8fr)_0.7fr] md:items-center ${
                  i > 0 ? "border-t border-border/40" : ""
                }`}
              >
                <div className="text-sm font-medium text-foreground">{row.initiative}</div>
                <PriorityStat label="Impact" value={row.impact} />
                <PriorityStat label="Effort" value={row.effort} />
                <PriorityStat label="Confidence" value={row.confidence} />
                <div className="mt-1 md:mt-0">
                  <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70 md:hidden">
                    Priority
                  </span>
                  <span
                    className={`inline-flex rounded-[3px] border px-2 py-0.5 font-mono text-[11px] tracking-[0.08em] ${
                      row.priority === "P0"
                        ? "border-primary/50 text-primary"
                        : row.priority === "P1"
                          ? "border-border text-foreground/80"
                          : "border-border/60 text-muted-foreground/70"
                    }`}
                  >
                    {row.priority}
                  </span>
                </div>
              </div>
            ))}
          </Surface>
        </InView>

        <div className={`${PROSE} mt-6`}>
          <InView>
            <p className="text-sm leading-6 text-muted-foreground">
              Credibility and context improvements come first (P0): they sit directly on Signal
              Desk&rsquo;s core thesis — helping a reader judge a story — with high confidence and far
              less scope than full personalization or a conversational assistant (P2). This ranking
              would be revised after user research and usage data.
            </p>
          </InView>
        </div>
      </section>

      {/* 17 — roadmap (real "what I would improve") */}
      <section className={PROSE}>
        <SectionLabel label="Roadmap" />
        <InView>
          <p className="leading-7 text-muted-foreground">
            Where the product goes next. None of this is built — it is the prioritised next work.
          </p>
        </InView>
        <ol className="mt-5 space-y-0">
          {improvements.map((r, i) => (
            <InView key={r} delay={i * 0.04}>
              <li className="flex gap-4 border-t border-border py-4">
                <span className="font-mono text-xs text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm leading-6 text-muted-foreground">{r}</span>
              </li>
            </InView>
          ))}
        </ol>
      </section>

      {/* 18 — learnings (real) */}
      {signalDesk.learnings && (
        <section className="max-w-xl">
          <SectionLabel label="What I learned" />
          <InView>
            <p className="text-2xl font-medium leading-[1.35] tracking-tight text-foreground">
              {signalDesk.learnings.lead}
            </p>
          </InView>
          <div className="mt-6 space-y-5 border-l border-border pl-5">
            {signalDesk.learnings.body.map((p, i) => (
              <InView key={p} delay={0.06 + i * 0.06}>
                <p className="leading-7 text-muted-foreground">{p}</p>
              </InView>
            ))}
          </div>
          {signalDesk.learnings.note && (
            <Annotation className="mt-7" rotate={1}>
              {signalDesk.learnings.note}
            </Annotation>
          )}
        </section>
      )}

      {/* 18b — transferable product thinking */}
      <section className={PROSE}>
        <SectionLabel label="Product thinking beyond Signal Desk" />
        <InView>
          <p className="leading-7 text-muted-foreground">
            Building this developed product experience that is not specific to news:
          </p>
        </InView>
        <InView delay={0.05}>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {transferableSkills.map((s) => (
              <span
                key={s}
                className="rounded-[3px] border border-border/70 px-2 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </InView>
        <InView delay={0.1}>
          <p className="mt-6 border-l-2 border-primary/40 pl-4 text-lg leading-8 text-foreground">
            The same product principles apply across domains: helping users navigate large information
            spaces, evaluate alternatives, reduce decision friction, and make more confident decisions.
          </p>
        </InView>
      </section>

      {/* 19 — CTA */}
      <section className={PROSE}>
        <SectionLabel label="Where to go next" />
        <InView className="flex flex-col gap-2">
          <Link
            href={TECH_PATH}
            className="group inline-flex items-center justify-between gap-3 rounded-md border border-border px-4 py-3 text-sm transition-colors hover:bg-accent"
          >
            <span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Technical project
              </span>
              <span className="mt-0.5 block">How it works — architecture, code, deployment</span>
            </span>
            <ArrowRight className="size-4 -translate-x-1 opacity-60 transition-transform group-hover:translate-x-0" />
          </Link>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-md border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            View the source on GitHub
            <ArrowUpRight className="size-4 opacity-60" />
          </a>
        </InView>
      </section>
    </div>
  );
}

// A small "hypothesis" flag, so an unvalidated claim can never be mistaken for a
// measured one.
function Hypothesis({ text = "not validated" }: { text?: string }) {
  return (
    <span className="inline-flex items-center rounded-[3px] border border-primary/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-primary/80">
      {text}
    </span>
  );
}

// One attribute cell in the prioritization table. The label shows only on mobile,
// where the table collapses from columns into stacked rows.
function PriorityStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm text-muted-foreground">
      <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70 md:hidden">
        {label}
      </span>
      {value}
    </div>
  );
}

// One labelled step inside an expanded product decision (problem / options /
// decision / why / trade-off).
function DecisionField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm leading-6">{children}</div>
    </div>
  );
}

// One what/why/value line inside a feature callout.
function Detail({ term, text, accent = false }: { term: string; text: string; accent?: boolean }) {
  return (
    <div>
      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {term}
      </dt>
      <dd className={`mt-0.5 text-sm leading-6 ${accent ? "text-foreground" : "text-muted-foreground"}`}>
        {text}
      </dd>
    </div>
  );
}

// A single column of a before/after flow, steps chained top to bottom.
function FlowColumn({
  label,
  tone,
  steps,
}: {
  label: string;
  tone: "muted" | "primary";
  steps: string[];
}) {
  return (
    <Surface className="h-full px-5 py-6">
      <Tag className={tone === "primary" ? "text-primary" : undefined}>{label}</Tag>
      <ol className="mt-4 space-y-0">
        {steps.map((s, i) => (
          <li key={s}>
            <div
              className={`font-mono text-[12px] leading-5 ${
                tone === "primary" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {i < steps.length - 1 && (
              <div
                aria-hidden
                className={`my-1 ml-[3px] h-3 w-px ${tone === "primary" ? "bg-primary/40" : "bg-border"}`}
              />
            )}
          </li>
        ))}
      </ol>
    </Surface>
  );
}

// A screenshot with subtle product callouts listed beneath it, so the annotation
// never covers the interface. Reuses the real capture from the technical page.
function AnnotatedShot({
  src,
  alt,
  callouts,
}: {
  src: string;
  alt: string;
  callouts: { label: string; note: string }[];
}) {
  return (
    <figure>
      <Surface grid={false} className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/70 px-3 py-1.5">
          <Tag>{alt}</Tag>
          <Tag>the deployed desk</Tag>
        </div>
        <Image
          src={src}
          alt={alt}
          width={1280}
          height={800}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
        />
      </Surface>
      <figcaption className="mt-3 grid gap-3 sm:grid-cols-3">
        {callouts.map((c) => (
          <div key={c.label} className="border-t border-primary/30 pt-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
              {c.label}
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{c.note}</p>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
