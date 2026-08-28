// Content for the Signal Desk case study at /projects/signal-desk.
//
// CONTENT RULE: every claim here is checked against the repository, and where
// the brief and the code disagreed, the code won. Specifically:
//   • importance ranking runs in public/app.js at render time, not in the
//     sweep — the blob stores scored stories, the frontend decides the layout
//   • corroboration is the tier-1 bump inside scoreItem(), not a separate pass
//   • "Miranda" is the style reference in design/DESIGN.md, not the paper's
//     name — the masthead reads SIGNAL DESK
//   • Mastodon is World-only (pulseConfig sets mastodon: false for India)
//   • the rumor → Low rule is real, but it lives in pipeline.mjs
//     (applyRumorRule) and applies to the esports desk only
// No throughput, latency or accuracy figures: the project publishes none.

import type { FlowEdgeSpec, FlowNodeSpec } from "@/components/projects/ArchitectureFlow";

// The news path, as a serpentine: collection across the top, the judgement
// stages back along the middle, then storage and the paper.
export const flowNodes: FlowNodeSpec[] = [
  {
    id: "sources",
    col: 0,
    row: 0,
    name: "News sources",
    category: "Input",
    symbol: "◎",
    purpose: "Feeds and APIs, four desks",
    detail:
      "RSS and Atom feeds plus a few APIs across Tech & AI, World, India and Esports — wires, national outlets, Hacker News, arXiv and Liquipedia among them. Each feed is registered with its own id, name and item cap.",
    why: "Any single outlet is one editorial view. Reading many is the only way the later stages have something to compare a story against.",
  },
  {
    id: "fetch",
    col: 1,
    row: 0,
    name: "Fetch",
    category: "Collect",
    symbol: "⚡",
    purpose: "Per-source timeout",
    detail:
      "Every source fetch carries its own timeout and is recorded in sourceStats as ok or not. A slow or dead feed degrades the sweep rather than failing it, and the run stays inside the scheduled function's time budget.",
    why: "One unreachable feed should cost you that feed's stories, not the edition. Isolating the timeout per source is what makes a partial sweep still worth printing.",
  },
  {
    id: "normalize",
    col: 2,
    row: 0,
    name: "Normalize",
    category: "Shape",
    symbol: "▤",
    purpose: "One record shape",
    detail:
      "Feed entries become one common record — title, url, summary, publishedAt, and a sources array carrying each outlet's name and domain. Text is cleaned and dates are pushed to ISO.",
    why: "Everything downstream compares stories to each other. That is only possible once a Liquipedia page and a Reuters item are the same shape.",
  },
  {
    id: "dedupe",
    col: 3,
    row: 0,
    name: "Deduplicate",
    category: "Merge",
    symbol: "◈",
    purpose: "One story, many outlets",
    detail:
      "Canonical URL first, then title similarity: stopwords stripped, tokens compared by Jaccard overlap with a containment fallback, because same-story headlines share most of the shorter title's meaningful words without ever scoring high on Jaccard alone. Merging keeps every outlet's own headline and the earliest publish time.",
    why: "Corroboration is the whole point of the scoring layer, and it cannot be counted until the same story reported five times is one item with five sources.",
  },
  {
    id: "scoring",
    col: 3,
    row: 1,
    name: "Legitimacy scoring",
    category: "Judge",
    symbol: "▥",
    purpose: "Source tiers, no model",
    detail:
      "A domain map sorts every source into three tiers — wires, government and official company blogs at tier 1; single reputable outlets, arXiv and Liquipedia at tier 2; anything unmapped at tier 3. The best tier present sets High, Medium or Low, and a written reason is attached to the story.",
    why: "A rating nobody can inspect is not a rating. A domain map is a table you can read, argue with, and edit — and it gives the same answer twice.",
  },
  {
    id: "corroborate",
    col: 2,
    row: 1,
    name: "Corroboration",
    category: "Judge",
    symbol: "≋",
    purpose: "Independent agreement",
    detail:
      "Inside the same scoring pass, sources are deduplicated by domain before being counted, and two or more independent tier-1 sources produce a corroborated rating that names them. Reasons distinguish 'corroborated by N tier-1 sources' from 'single reputable outlet, not yet confirmed'.",
    why: "Two outlets that copied the same wire are not two confirmations. Counting distinct domains is the cheapest available approximation of independence.",
  },
  {
    id: "framing",
    col: 1,
    row: 1,
    name: "Framing analysis",
    category: "Compare",
    symbol: "◷",
    purpose: "How each outlet worded it",
    detail:
      "Each retained per-source headline is scored on the AFINN-165 lexicon and bucketed as Critical, Skeptical, Neutral, Measured or Favorable. Stories with fewer than two per-source headlines get no framing field at all, and commentary is never framed.",
    why: "Framing describes word choice, nothing more. It is kept on its own axis so a sharply worded headline from a wire never drags that wire's trust rating down.",
  },
  {
    id: "enrich",
    col: 0,
    row: 1,
    name: "Enrich",
    category: "Annotate",
    symbol: "◐",
    purpose: "Market notes, rumors, pulse",
    detail:
      "Rule-matched market-impact notes on World items, the esports rumor rule that forces an unconfirmed transfer report to Low, YouTube commentary attached as its own kind, and Public Pulse reader reaction on World and India. Each layer returns nothing rather than inventing a link.",
    why: "These are the signals that need a rule with a clear mechanism behind them. Where no rule matches, the correct output is silence — an invented market link is worse than none.",
  },
  {
    id: "blobs",
    col: 0,
    row: 2,
    name: "Netlify Blobs",
    category: "Storage",
    symbol: "▦",
    purpose: "One edition, stored",
    detail:
      "The whole processed sweep is written as a single JSON blob under the key 'latest'. The previous sweep is read back first, so already-matched Public Pulse posts are re-fetched directly instead of being searched for again.",
    why: "The system only ever needs the latest processed edition. That is one document, not a database — and a blob write is the entire persistence layer.",
  },
  {
    id: "api",
    col: 1,
    row: 2,
    name: "/api/news",
    category: "Serving",
    symbol: "▷",
    purpose: "One blob read, edge-cached",
    detail:
      "A function that reads the stored blob and returns it with a five-minute cache header. If no sweep has run yet on a fresh deploy it returns 404 and the frontend falls back to the seed written at build time.",
    why: "A page load must never trigger a feed fetch. Putting a single cached read between the reader and the pipeline is what makes traffic free and the page instant.",
  },
  {
    id: "paper",
    col: 2,
    row: 2,
    name: "The broadsheet",
    category: "Render",
    symbol: "◱",
    purpose: "Importance decides footprint",
    detail:
      "The static frontend ranks stories at render time from signals the pipeline already produced — legitimacy, corroboration count, market note, live status, recency, whether the wire sent real copy, rumor flag — and that score picks the slot: lead well, secondary row, columns, or the briefs rail.",
    why: "Ranking belongs where the layout is decided. Keeping it in the frontend means the stored edition stays a record of what was found, not of how it happened to be arranged.",
  },
];

export const flowEdges: FlowEdgeSpec[] = [
  { from: "sources", to: "fetch", label: "pull" },
  { from: "fetch", to: "normalize", label: "parse" },
  { from: "normalize", to: "dedupe", label: "compare" },
  { from: "dedupe", to: "scoring", label: "one item" },
  { from: "scoring", to: "corroborate", label: "tier" },
  { from: "corroborate", to: "framing", label: "headlines" },
  { from: "framing", to: "enrich", label: "annotate" },
  { from: "enrich", to: "blobs", label: "store" },
  { from: "blobs", to: "api", label: "read" },
  { from: "api", to: "paper", label: "render" },
];

// ---- the two optional branches, drawn apart from the news path ----

export const optionalBranches = [
  {
    name: "Tavily discovery",
    kind: "Optional · search",
    chain: ["Tavily", "One query per desk", "Merge / corroborate", "Same tier scoring"],
    body: "One broad topical query per section per run, at basic search depth. Results are merged into the existing items and scored by exactly the same tier rules — the layer scores nothing itself. Spend is capped by a credit ledger kept in Blobs against a monthly ceiling.",
    absent:
      "With TAVILY_API_KEY unset, or the ledger unreachable, the layer skips and the desk runs on feeds alone.",
  },
  {
    name: "Public Pulse",
    kind: "Optional · reader reaction",
    chain: ["Bluesky / YouTube / Mastodon", "Match to story", "Reaction tone", "Framing alignment"],
    body: "Runs on World and India only, after scoring and before the blob write. It searches for posts discussing a story, keeps the most engaged match rather than the most similar one — headline-mirror bots win on similarity and say nothing — and scores sampled replies on the same lexicon.",
    absent: "It is reader reaction, never a news source. Nothing it produces can add a story or change a legitimacy tier.",
  },
];

// ---- legitimacy, the central idea ----

export const trustLevels = [
  {
    level: "High",
    rule: "Tier-1 source present",
    example: "Corroborated by 2 independent tier-1 sources (Reuters, AP).",
  },
  {
    level: "Medium",
    rule: "Best available source is tier 2",
    example: "Single reputable outlet (TechCrunch); not yet confirmed by a wire or primary source.",
  },
  {
    level: "Low",
    rule: "Source outside the map",
    example: "Single unrecognized source (example.com). Treat as unconfirmed.",
  },
  {
    level: "Rumor → Low",
    rule: "Esports desk, unconfirmed transfer",
    example:
      "Transfer rumor — single unconfirmed report. Not corroborated by an official channel or a confirmed Liquipedia entry.",
  },
];

export const tiers = [
  {
    tier: "Tier 1",
    body: "Wire services, government domains, official company and lab blogs, peer-reviewed journals.",
  },
  {
    tier: "Tier 2",
    body: "Single reputable outlets, arXiv preprints, Liquipedia — each carrying its own note where the generic wording would mislead.",
  },
  { tier: "Tier 3", body: "Anything outside the map. Treated as unconfirmed by default." },
];

// The two axes, deliberately never mixed.
export const axes = {
  legitimacy: {
    axis: "Legitimacy",
    value: "High",
    body: "Who reported it, and how many independent tier-1 sources agree.",
  },
  framing: {
    axis: "Framing",
    value: "Skeptical",
    body: "How this particular outlet worded its own headline. Not a bias detector, and never an input to the tier.",
  },
  labels: ["Critical", "Skeptical", "Neutral", "Measured", "Favorable"],
};

// ---- the press schedule ----

export const press = {
  cron: "0 1,7,13,19 * * *",
  zone: "UTC",
  runs: ["01:00", "07:00", "13:00", "19:00"],
  chain: ["Fetch", "Dedupe", "Score", "Tag", "Store"],
  seed: "The build command runs the same pipeline and writes public/data/seed.json, so a fresh deploy has an edition on the stand before the first scheduled run fires.",
};

// ---- the paper ----

export const broadsheetParts = [
  { part: "Dateline topbar", body: "Edition number, date, last press run, and how many wires came back ok." },
  { part: "Masthead", body: "SIGNAL DESK, set full-bleed in the display face." },
  { part: "Section index", body: "Tech & AI, World, India, Esports — and the control to resync the presses." },
  { part: "Desk banner", body: "The section name at banner scale, with the desk's own one-line brief." },
  { part: "Lead well", body: "The highest-importance story, given the width." },
  { part: "Column grid", body: "Secondary stories set in rules-separated columns." },
  { part: "Briefs rail", body: "Lowest-importance items, stacked down the right." },
  { part: "Source stamps", body: "A struck rubber stamp per story — verified, reported, or unconfirmed." },
];

export const pageCurl = {
  lead: "A newspaper should turn like one.",
  body: "The section switch is not a CSS transform. The outgoing page is rasterized to a texture and mapped onto a subdivided Three.js plane, and a custom vertex shader wraps every vertex past a moving curl line around a cylinder — θ = d / R, x′ = curl + R·sin θ, z′ = R·(1 − cos θ).",
  effects: [
    "curl radius that grows through the turn, so a tight corner becomes a loose roll",
    "a tilted curl line, so the top-right corner lifts first",
    "directional turning — the whole curl mirrors for a backward page",
    "fold shading, a specular ridge along the roll, and ambient occlusion in the fold",
    "a darker verso, and a soft shadow band tracking the curl across the page beneath",
  ],
  reuse: "The same engine drives the per-story Opinion card flip, scoped to the card's own bounds rather than the viewport.",
  fallback:
    "Under prefers-reduced-motion, or where WebGL is unavailable, the curl is skipped and the faces swap instantly.",
};

// ---- what the files do ----

export const files = [
  {
    file: "src/scoring.mjs",
    body: "The source-tier map and the legitimacy calculation. Sorts domains into three tiers, picks the best one present, applies the corroboration rule, and writes the human-readable reason onto the story.",
  },
  {
    file: "src/dedupe.mjs",
    body: "Canonical-URL and title-similarity matching, plus the merge that keeps each outlet's own headline. Its token and similarity helpers are exported so 'same story' means one thing everywhere in the codebase.",
  },
  {
    file: "src/framing.mjs",
    body: "Headline framing classification. Thresholds live in an exported config object rather than in the logic, and the field is omitted entirely below two per-source headlines.",
  },
  {
    file: "src/pipeline.mjs",
    body: "The sweep itself: feed registry, fetch orchestration, and the order the stages run in — including the esports rumor rule that forces an unconfirmed transfer report to Low.",
  },
  {
    file: "src/pulse.mjs · pulseConfig.mjs",
    body: "Public Pulse: story-to-post matching, reaction tone, and framing alignment. All tuning — desks, caps, similarity threshold, minimum engagement — is data in the config file, kept out of the logic.",
  },
  {
    file: "src/tavily.mjs",
    body: "Optional discovery search, with the monthly credit ledger that decides how much a given run may spend and rolls unused allowance forward.",
  },
  {
    file: "netlify/functions/refresh-news.mjs",
    body: "The scheduled sweep. Reads the previous edition for Pulse continuity, runs the pipeline, enriches World and India, writes one blob, and logs how many sources came back ok.",
  },
  {
    file: "netlify/functions/news.mjs",
    body: "Serves the stored edition at /api/news as a single cached blob read, with a 404 that tells the frontend to fall back to the build-time seed.",
  },
  {
    file: "public/app.js",
    body: "Importance ranking, board layout, and the WebGL page curl — the shaders, the flip engine, and the reduced-motion path.",
  },
];

export const improvements = [
  "Expand the source-tier map — every domain outside it currently reads as unconfirmed, which is safe but blunt.",
  "Widen source coverage, particularly outside English-language outlets.",
  "Refine the framing thresholds against a larger sample of scored headlines.",
  "Improve reader-reaction matching; the current rule finds discussion but misses paraphrased posts.",
  "Extend the editorial ranking model beyond the signals the pipeline already emits.",
  "Keep past editions rather than only the latest, so the desk can show how a story's rating changed.",
];

// ---- the running paper ----
//
// Captures of the deployed desk. Nothing in them is quoted as a figure anywhere
// on the page: the captions describe what each part of the interface IS, and the
// legitimacy reasons visible in them are the verbatim strings scoring.mjs writes.
import type { Shot } from "@/components/projects/CodeShots";

export const frontPage: Shot = {
  src: "/projects/signal-desk/front-page.png",
  file: "The front page",
  caption:
    "Dateline topbar, masthead, section index and desk banner. The topbar carries the edition number, when the presses last ran and how many source fetches came back ok — and the rule under the index is the stale-edition notice, shown here because the last scheduled run was well over a day old.",
};

export const deskShots: Shot[] = [
  {
    src: "/projects/signal-desk/tech-desk.png",
    file: "Tech & AI",
    caption:
      "Lead well, two secondary columns and the briefs rail, with a struck stamp per story. The line under the lead is the scoring output verbatim: \u201cSingle reputable outlet (TechCrunch); not yet confirmed by a wire or primary source.\u201d A tier-2 source, and the reader is told exactly why.",
  },
  {
    src: "/projects/signal-desk/world-desk.png",
    file: "World",
    caption:
      "Both axes at once. The lead is VERIFIED on a tier-1 wire — \u201cTier-1 source: Reuters (wire/primary source). No second tier-1 confirmation yet\u201d — while its per-source framing reads Reuters (neutral) and Al Jazeera (skeptical). High legitimacy, differing wording, and the two never collapse into one number. The market wire panels underneath are the rule-matched notes.",
  },
  {
    src: "/projects/signal-desk/india-desk.png",
    file: "India",
    caption:
      "PIB scores tier-1 as a government primary source, so a routine ministry release leads on legitimacy rather than on drama. The right-hand rail is From the States, and the same reason line appears under the headline.",
  },
  {
    src: "/projects/signal-desk/esports-desk.png",
    file: "Esports",
    caption:
      "Liquipedia carries its own special-cased reason — \u201ccommunity-maintained wiki, actively moderated\u201d — rather than the generic tier-2 wording. Below the fixtures, On the channels keeps YouTube commentary as its own kind, filed apart from the news it discusses.",
  },
];
