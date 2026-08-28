// The project registry. One entry is both the card pinned to the engineering
// board and the content of its page at /projects/<id> — kept in one place so a
// project can be added, reordered or rewritten without touching a component.
//
// Every card routes internally to /projects/<id>; that page is where the links
// out to GitHub and to the full case study live. Cards never jump straight off
// the site.
//
// top/left/width place the card on the board (%), rotate is its individual tilt,
// z its stacking order. Laid out as a 3x2 scatter with deliberate imperfection;
// columns are spaced so no two cards overlap at rest, and the band between the
// rows stays clear for the annotations.
//
// Everything written here comes from the project's own README — keep it that
// way. If a README is thin, the page stays short rather than inventing detail.
export type BoardProject = {
  id: string;
  title: string;
  // Footer marking on the card. Not everything here is a pipeline.
  tag: string;
  // One line under the title on the project page — the shape of the thing.
  tagline: string;
  // Short form, used for the page description and metadata.
  summary: string;
  overview: string[];
  // Ordered walkthrough, rendered as a numbered list.
  flow?: { title: string; detail: string }[];
  highlights?: string[];
  stats?: { label: string; value: string }[];
  stack: string[];
  repo?: string;
  // Private repos get named, not linked — a dead link is worse than none.
  repoPrivate?: boolean;
  caseStudy?: string;
  top: string;
  left: string;
  width: string;
  rotate: number;
  z: number;
};

export const boardProjects: BoardProject[] = [
  {
    id: "spotify",
    title: "Spotify AWS Pipeline",
    tag: "PIPELINE",
    tagline: "Python → Lambda → S3 → Glue → Athena",
    summary:
      "Fully serverless pipeline for Spotify listening data — raw JSON into S3, normalised into songs, albums and artists, cataloged by Glue and queried with Athena.",
    overview: [
      "A pipeline with no servers in it anywhere. Extraction runs on a schedule in Lambda, everything lands in S3, a second Lambda normalises the payload into three tables, and Glue catalogs them so Athena can query in place.",
      "The point of building it this way is the cost profile: with nothing running between invocations, an idle day costs nothing at all.",
    ],
    highlights: [
      "Fully serverless — cost scales to zero when idle.",
      "Raw JSON kept in S3 and archived, never overwritten.",
      "One payload in, three deduplicated tables out — songs, albums, artists.",
    ],
    stack: ["AWS Lambda", "S3", "Glue", "Athena", "Python"],
    caseStudy: "/case-studies/spotify-pipeline",
    top: "5%",
    left: "3%",
    width: "25%",
    rotate: -2.5,
    z: 3,
  },
  {
    id: "realtime",
    title: "Real-Time Data Pipeline",
    tag: "SNOWFLAKE",
    tagline: "NiFi → S3 → Snowpipe → Snowflake (SCD1 & SCD2)",
    summary:
      "Near-real-time pipeline streaming synthetic customer data through NiFi into S3, auto-ingested by Snowpipe, with SCD Type 1 and Type 2 maintained by Snowflake Streams and Tasks.",
    overview: [
      "A near-real-time pipeline that runs itself once started. Synthetic customer records are generated, streamed through Apache NiFi into Amazon S3, and auto-ingested into Snowflake by Snowpipe.",
      "From there Snowflake does its own change data capture: a Stream tracks every insert, update and delete, and two scheduled Tasks keep a current-state table and a full-history table in sync — with no manual intervention in the loop.",
    ],
    flow: [
      {
        title: "Data generation",
        detail:
          "A Python script uses Faker to generate synthetic customer records and writes them out as CSV.",
      },
      {
        title: "Ingestion — EC2 + Docker + NiFi",
        detail:
          "Apache NiFi, containerised on an EC2 instance, picks the files up (ListFile → FetchFile) and pushes them to S3 with PutS3Object.",
      },
      {
        title: "Landing — S3",
        detail:
          "Files land in an S3 prefix registered as a Snowflake external stage.",
      },
      {
        title: "Auto-ingestion — Snowpipe",
        detail:
          "Snowpipe watches the bucket and loads new files into the customer_raw staging table automatically.",
      },
      {
        title: "Change capture — Snowflake Stream",
        detail:
          "A stream tracks inserts, updates and deletes against the customer table.",
      },
      {
        title: "Transformation — Snowflake Tasks",
        detail:
          "Two tasks run every minute: one merges staging into the current table (SCD Type 1, overwrite in place), the other merges change data into history (SCD Type 2, with start_time, end_time and is_current).",
      },
      {
        title: "Target tables",
        detail:
          "customer holds current state only; customer_history holds every change that ever happened.",
      },
    ],
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
    repo: "https://github.com/DevrajBijpuria/REAL-TIME-DATA-PIPELINE",
    top: "8%",
    left: "37.5%",
    width: "25%",
    rotate: 1.5,
    z: 2,
  },
  {
    id: "nnnids",
    title: "NNNIDS",
    tag: "AI / SECURITY",
    tagline: "Real-time detection. Automated response. Self-healing verification.",
    summary:
      "Full-stack intrusion detection platform combining signature rules, Isolation Forest anomaly detection and behavioural heuristics, with automated firewall response and a live dashboard.",
    overview: [
      "A full-stack, real-time network security platform that watches live traffic, detects intrusions with a hybrid AI pipeline, responds to threats automatically, and then verifies that its own mitigation actually worked.",
      "The interesting part is that last step. Most detection systems stop at the alert; this one blocks the offending IP at the OS firewall, then compares before-and-after traffic features to confirm the block had an effect, and recalculates a composite risk score from the result.",
    ],
    flow: [
      { title: "Capture", detail: "Packet sniffing via Scapy — live or replayed." },
      {
        title: "Features",
        detail: "Per-IP feature extraction: packet rate, SYN ratio, port entropy and more.",
      },
      {
        title: "Training",
        detail: "An Isolation Forest self-trains on the first window as an unsupervised baseline.",
      },
      {
        title: "Detection",
        detail: "Signature rules, ML anomaly scoring, behavioural heuristics and threat intel together.",
      },
      { title: "Diagnosis", detail: "Detections are enriched into structured, readable alert records." },
      { title: "Decision", detail: "Each alert maps to a recommended action — block, throttle or monitor." },
      {
        title: "Response & verify",
        detail:
          "OS-level firewall commands execute and are logged, then before/after traffic is compared to confirm the mitigation worked and the 0–100 risk score is recalculated.",
      },
    ],
    highlights: [
      "Layer 1 — signature rules catch port scans, SYN floods and DDoS.",
      "Layer 2 — Isolation Forest catches unknown threats that deviate from the learned baseline.",
      "Layer 3 — per-IP rolling baselines flag new devices, traffic spikes and odd-hour activity.",
      "Layer 4 — a CIDR/IP lookup catches known C2 servers and malicious ranges.",
    ],
    stack: [
      "Python",
      "FastAPI",
      "Scapy",
      "scikit-learn",
      "pandas",
      "SQLite",
      "React 19",
      "Vite",
      "Recharts",
      "Docker",
    ],
    repo: "https://github.com/NihalGeek/NNNIDS",
    top: "4%",
    left: "72%",
    width: "25%",
    rotate: -1.0,
    z: 4,
  },
  {
    id: "signal-desk",
    title: "Signal Desk",
    tag: "NEWS",
    tagline: "Rule-based story scoring, no model in the loop",
    summary:
      "A news-intelligence desk rendered as an 1890s broadsheet, scoring every story's legitimacy by rules rather than by a model, running at zero cost on Netlify's free tier.",
    overview: [
      "A personal news-intelligence desk rendered as an 1890s broadsheet newspaper. Four desks — Tech & AI, Geopolitics, India and Esports — with every item scored for legitimacy by rules, and the reason for the score printed on the story.",
      "No model anywhere in the loop, and no paid APIs, database or required keys. It runs at zero ongoing cost on Netlify's free tier; the optional layers are gated behind free credentials and skip cleanly when they are unset.",
    ],
    flow: [
      {
        title: "Scheduled sweep",
        detail:
          "A cron function runs four times a day: fetch, dedupe, score, tag. Every source fetch has its own 8–9 second timeout, so a slow or dead feed degrades the sweep instead of failing it.",
      },
      {
        title: "One stored blob",
        detail:
          "The whole sweep is written to a single Netlify Blob, edge-cached for five minutes.",
      },
      {
        title: "Page loads never touch a feed",
        detail:
          "Visitors read the stored sweep, so a page load is instant and free regardless of traffic.",
      },
      {
        title: "Seeded at deploy",
        detail:
          "The build command runs the same pipeline and writes a seed file, so a fresh deploy has data before the first cron tick.",
      },
    ],
    highlights: [
      "Rule-based legitimacy scoring — a source-tier map plus a corroboration bump, with the reason shown on every story.",
      "Cross-source framing — how differently each outlet worded the same headline, on clustered stories.",
      "Market wire — rule-derived market-impact notes on geopolitics items.",
      "Public Pulse — reader reaction from Bluesky, YouTube and Mastodon.",
      "YouTube commentary kept as a separate opinion category, never counted as news.",
    ],
    stack: ["JavaScript", "Node.js", "Netlify Functions", "Netlify Blobs", "WebGL"],
    repo: "https://github.com/DevrajBijpuria/signal-desk",
    top: "55%",
    left: "3.5%",
    width: "25%",
    rotate: 2.0,
    z: 1,
  },
  {
    id: "fitness",
    title: "Fitness Tracker",
    tag: "ML / SENSORS",
    tagline: "Sensor → Signal → Feature → Model",
    summary:
      "Barbell exercise classification from wrist accelerometer and gyroscope data — merging, cleaning, temporal and frequency features, and five classifiers compared across five feature sets.",
    overview: [
      "Data processing and machine learning for quantified self, working from motion data captured by MetaMotion wearable sensors during barbell training.",
      "The README is a single line, so the code is the description: two sensor streams merged onto one clock, cleaned with Chauvenet's criterion, turned into temporal and frequency features, and classified — with repetition counting solved separately by signal processing.",
    ],
    stack: ["Python", "pandas", "NumPy", "scikit-learn", "SciPy", "Matplotlib"],
    repo: "https://github.com/Dheeraj1771/Fitness-Tracker-Using-Machine-Learning",
    top: "58%",
    left: "37.5%",
    width: "25%",
    rotate: -1.5,
    z: 5,
  },
  {
    id: "tuf",
    title: "TUF+ to GitHub",
    tag: "EXTENSION",
    tagline: "Submit → Accepted → Archived",
    summary:
      "A Chrome extension that watches the TUF+ judge from inside the page and pushes every accepted submission to GitHub as its own documented folder.",
    overview: [
      "A Manifest V3 Chrome extension that turns solved coding problems into a structured GitHub repository without a commit after every one.",
      "TUF+ has no public API, so the extension hooks the site's own judge requests from inside the page: it captures the submitted code, waits for an accepted verdict, scrapes the problem details, and pushes a folder through the GitHub contents API.",
    ],
    stack: ["JavaScript", "Chrome Extensions", "Manifest V3", "GitHub API", "OAuth device flow"],
    repo: "https://github.com/DevrajBijpuria/tuf-to-github",
    top: "54%",
    left: "72%",
    width: "25%",
    rotate: 2.5,
    z: 6,
  },
];

export function getProject(id: string) {
  return boardProjects.find((p) => p.id === id);
}
