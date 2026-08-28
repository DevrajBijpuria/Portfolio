// Content for the TUF+ to GitHub case study at /projects/tuf.
//
// CONTENT RULE: checked against the extension's source, not just its README.
// Where the brief and the code disagreed, the code won:
//   • the solution file is named after the problem SLUG, not "solution" —
//     background.js builds `${folder}/${p.slug}.${ext}`
//   • the root index is a markdown table (#, title, difficulty, language, date),
//     not a plain list
//   • the OAuth app is the user's own; the client ID is pasted into the popup
// No latency, throughput or percentage figures: the project publishes none, and
// there is nothing here worth measuring in those terms.

import type { FlowEdgeSpec, FlowNodeSpec } from "@/components/projects/ArchitectureFlow";
import type { Shot } from "@/components/projects/CodeShots";

// Submit to archived, as a serpentine: the page-side observation across the
// top, the decision in the middle, the GitHub writes along the bottom.
export const flowNodes: FlowNodeSpec[] = [
  {
    id: "problem",
    col: 0,
    row: 0,
    name: "TUF+ problem",
    category: "Page",
    symbol: "◎",
    purpose: "Where the work happens",
    detail:
      "The content script matches takeuforward.org and runs at document_start, so it is in place before the page's own scripts have made a single request. It caches the problem's scraped details while you are still reading it.",
    why: "Scraping at submit time is too late — the page may have navigated or re-rendered. Capturing while browsing means the details are already in hand when a verdict lands.",
  },
  {
    id: "submit",
    col: 1,
    row: 0,
    name: "Submit",
    category: "Trigger",
    symbol: "⚡",
    purpose: "The judge POST",
    detail:
      "Hitting Submit sends a POST to the judge endpoint carrying usercode, language and slug. That request body is the only place the submitted source exists in a form the extension can read.",
    why: "The code you wrote never appears in the DOM in a reliable form. The request that carries it to the judge is the honest place to read it from.",
  },
  {
    id: "intercept",
    col: 2,
    row: 0,
    name: "Interceptor",
    category: "Observe",
    symbol: "◈",
    purpose: "XHR hook, fetch fallback",
    detail:
      "A script injected into the page's MAIN world wraps XMLHttpRequest.open/send and window.fetch. It matches the judge paths, reads the submit body, and posts what it finds back to the content script over window.postMessage scoped to the page origin.",
    why: "TUF+ publishes no API. Observing the site's own calls from inside the page is the only way in that does not involve scraping or a second login.",
  },
  {
    id: "capture",
    col: 3,
    row: 0,
    name: "Capture",
    category: "Extract",
    symbol: "▤",
    purpose: "Code, language, slug",
    detail:
      "The submit body is parsed for usercode, language and slug, and ignored entirely if usercode is not a string — a guard against the other traffic that shares the judge prefix.",
    why: "Holding the payload before the verdict arrives means the archive step needs no second request once the answer is known.",
  },
  {
    id: "verdict",
    col: 3,
    row: 1,
    name: "Verdict polling",
    category: "Watch",
    symbol: "◷",
    purpose: "The site's own polling",
    detail:
      "The same hook watches the check-submit responses the site polls with while judging. Responses are skipped until data.completed is set, then read for status, test-case counts, time and memory.",
    why: "The site already polls for the result. Riding its polling means no timer of the extension's own, and no request the page was not going to make anyway.",
  },
  {
    id: "accepted",
    col: 2,
    row: 1,
    name: "Accepted?",
    category: "Gate",
    symbol: "≋",
    purpose: "The only trigger",
    detail:
      'The push fires on data.status === "Accepted" and on nothing else. A wrong answer, a timeout or a compile error is observed, reported to the content script, and then dropped.',
    why: "An archive of everything attempted is a log, not an archive. Gating on the accepted verdict is what makes the repository worth reading later.",
  },
  {
    id: "scrape",
    col: 1,
    row: 1,
    name: "DOM scrape",
    category: "Enrich",
    symbol: "▥",
    purpose: "Title, difficulty, statement",
    detail:
      "The problem title, its Easy/Medium/Hard chip and the statement blocks are read from the problem page. If any of it fails, the slug is title-cased as a fallback and the README notes the missing statement — the push still happens.",
    why: "Metadata is the part most likely to break when the site changes. Letting a failed scrape degrade the commit rather than cancel it keeps the solution safe.",
  },
  {
    id: "worker",
    col: 0,
    row: 1,
    name: "Service worker",
    category: "Background",
    symbol: "◐",
    purpose: "Holds the token",
    detail:
      "The background context owns the GitHub token and every API call. The content script sends it a message describing the accepted problem and receives back a result to show as a toast.",
    why: "A token in the page's world is a token any script on that page can read. Keeping GitHub entirely in the background context is the whole reason for the split.",
  },
  {
    id: "github",
    col: 0,
    row: 2,
    name: "Contents API",
    category: "Write",
    symbol: "▦",
    purpose: "Create or update",
    detail:
      "Each file is written through the GitHub contents API, reading the existing SHA first so a resubmission updates in place. If the configured repository does not exist it is created private on the first accepted push.",
    why: "Create-or-update is what stops a second attempt at the same problem from becoming a second folder. The SHA read is the price of that.",
  },
  {
    id: "folder",
    col: 1,
    row: 2,
    name: "Problem folder",
    category: "Output",
    symbol: "▧",
    purpose: "Solution + README",
    detail:
      "One folder per problem, named from the sanitised problem title, holding the solution file under the problem slug with the language's own extension, and a README carrying the statement and difficulty.",
    why: "A folder per problem is browsable a year later. A flat directory of files named by date is not.",
  },
  {
    id: "index",
    col: 2,
    row: 2,
    name: "Root index",
    category: "Output",
    symbol: "◱",
    purpose: "Rewritten each push",
    detail:
      "The repository's root README is regenerated as a table — number, linked title, difficulty, language and date solved — from the solved map kept in extension storage, and committed with the new total in the message.",
    why: "An index maintained by hand stops being maintained. Rewriting it from stored state on every push means it cannot drift from what is actually in the repository.",
  },
];

export const flowEdges: FlowEdgeSpec[] = [
  { from: "problem", to: "submit", label: "solve" },
  { from: "submit", to: "intercept", label: "POST" },
  { from: "intercept", to: "capture", label: "read body" },
  { from: "capture", to: "verdict", label: "hold" },
  { from: "verdict", to: "accepted", label: "completed" },
  { from: "accepted", to: "scrape", label: "yes" },
  { from: "scrape", to: "worker", label: "message" },
  { from: "worker", to: "github", label: "push" },
  { from: "github", to: "folder", label: "write" },
  { from: "folder", to: "index", label: "reindex" },
];

// ---- the parts, as an extension is actually built ----

export const components = [
  {
    n: "01",
    file: "content.js",
    role: "Content script",
    body: "Runs at document_start on takeuforward.org. Injects the interceptor into the page's MAIN world, caches scraped problem details while you browse, listens for the messages the interceptor posts back, and shows the success or failure toast.",
  },
  {
    n: "02",
    file: "interceptor.js",
    role: "Request interceptor",
    body: "Wraps XMLHttpRequest.open/send and window.fetch inside the page. Matches the judge submit and check-submit paths, parses the submit body and the verdict response, and posts both back over window.postMessage.",
  },
  {
    n: "03",
    file: "background.js",
    role: "Service worker",
    body: "Owns the GitHub token and every API call: the device-flow OAuth exchange and polling, the language-to-extension map, the create-or-update writes, and the regenerated root index.",
  },
  {
    n: "04",
    file: "popup.js · popup.html",
    role: "Popup",
    body: "One-time GitHub connection, the destination repository name, the archived count, and the last push. Nothing about the archiving flow needs the popup open.",
  },
  {
    n: "05",
    file: "manifest.json",
    role: "Manifest V3",
    body: "Storage permission, GitHub host permissions, the takeuforward.org content-script match, and the interceptor declared as a web-accessible resource so the page world can load it.",
  },
];

export const endpoints = [
  { method: "POST", path: "/api/v1/plus/judge/submit", body: "usercode · language · slug" },
  {
    method: "GET",
    path: "/api/v1/plus/judge/check-submit",
    body: "data.completed · data.status · passed / total",
  },
];

export const repoTree = [
  "tuf-plus-solutions/",
  "│",
  "├── Balanced-Parenthesis/",
  "│   ├── balanced-parenthesis.cpp",
  "│   └── README.md          <- statement + difficulty",
  "│",
  "├── Another-Problem/",
  "│   ├── another-problem.py",
  "│   └── README.md",
  "│",
  "└── README.md              <- regenerated index table",
];

export const features = [
  { title: "Automatic archiving", body: "Accepted submissions are pushed without a manual commit." },
  { title: "Language-aware files", body: "The solution is saved with the extension its language maps to." },
  { title: "Problem organisation", body: "Every problem gets its own folder, named from the problem title." },
  { title: "Automatic documentation", body: "The statement and difficulty are stored beside the solution." },
  { title: "Index maintenance", body: "The root README is regenerated as a table on every push." },
  { title: "Update support", body: "Resubmitting a solved problem updates its files instead of duplicating them." },
  { title: "Local token storage", body: "The GitHub token lives in extension storage and is used only for GitHub calls." },
  { title: "In-page feedback", body: "A green toast on success, red with the reason on failure, and a badge count on the icon." },
];

export const auth = {
  body: "Authentication uses GitHub's OAuth device flow against an OAuth app you create yourself — the client ID is pasted into the popup, the popup shows a short code, and you approve it at github.com/login/device.",
  chain: ["Paste client ID", "Show user code", "Approve on GitHub", "Poll for token", "Store locally"],
  note: "The token is requested with repo scope, kept in chrome.storage.local, and used for nothing but GitHub API requests. There is no backend and no server-side account.",
};

export const brittleness = {
  checked: "Checked live on 6 July 2026.",
  items: [
    {
      part: "Judge API paths",
      body: "Detection keys on the submit and check-submit paths under the judge prefix. If TUF+ renames them, submissions stop being detected — the visible symptom is that the toast never appears.",
    },
    {
      part: "Submit body field names",
      body: "usercode, language and slug. A rename means the capture silently reads nothing.",
    },
    {
      part: "Verdict response shape",
      body: "data.completed and data.status, plus the test-case counts, time and memory read for the README.",
    },
    {
      part: "Problem-page selectors",
      body: "The title heading, the statement blocks, and the difficulty chip matched on its exact text. This is the one that degrades rather than breaks — a failed scrape still pushes the solution.",
    },
  ],
  note: "None of these are published APIs. They are one site's current internals, and a frontend or backend change on TUF+ can require the extension to be updated.",
};

export const beforeAfter = {
  before: ["Solve", "Copy code", "Create folder", "Rename file", "Write README", "Commit"],
  after: ["Solve", "Submit", "Accepted", "Archived"],
};

export const popupShot: Shot = {
  src: "/projects/tuf/popup.png",
  file: "The popup",
  caption:
    "The whole interface: who you are connected as, how many problems have been archived, the destination repository, and what was pushed last. Everything else happens on the problem page without it being open.",
};
