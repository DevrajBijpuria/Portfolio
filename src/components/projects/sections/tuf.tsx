import type { CaseStudyContent } from "../case-study";
import {
  auth,
  beforeAfter,
  brittleness,
  components,
  endpoints,
  features,
  flowEdges,
  flowNodes,
  popupShot,
  repoTree,
} from "@/data/projects/tuf";
import { CodeShots } from "../CodeShots";
import { Annotation, Chain, InView, SectionLabel, Surface, Tag } from "../notebook";

// TUF+ to GitHub's own sections. The project is a browser extension, so its
// visuals borrow from that world — request paths, a file tree, a popup — while
// the page around them stays the same engineering notebook.

const PROSE = "max-w-2xl";

// The two endpoints the whole thing hangs off, printed as what they are.
function Endpoints() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="The two requests" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          The extension does not talk to TUF+. It listens to two calls the site was already making.
        </p>
      </div>
      <InView>
        <Surface grid={false}>
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
            <Tag>Observed from inside the page</Tag>
            <Tag>XHR · fetch fallback</Tag>
          </div>
          <dl>
            {endpoints.map((e, i) => (
              <div key={e.path} className={`px-4 py-3 ${i > 0 ? "border-t border-border/40" : ""}`}>
                <dt className="flex flex-wrap items-baseline gap-2">
                  <span className="rounded-[3px] border border-primary/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                    {e.method}
                  </span>
                  <span className="break-all font-mono text-[12px] text-foreground">{e.path}</span>
                </dt>
                <dd className="mt-1.5 font-mono text-[11px] text-muted-foreground">{e.body}</dd>
              </div>
            ))}
          </dl>
        </Surface>
      </InView>
      <div className={`${PROSE} mt-5`}>
        <Annotation rotate={-1}>no public API — so listen to the site&rsquo;s own.</Annotation>
      </div>
    </section>
  );
}

// The extension, part by part.
function Components() {
  return (
    <section className={PROSE}>
      <SectionLabel label="The parts" />
      <p className="-mt-2 mb-2 text-sm leading-6 text-muted-foreground">
        Five files, and the split between them is the design.
      </p>
      <dl className="space-y-0">
        {components.map((c, i) => (
          <InView key={c.file} delay={i * 0.05}>
            <div className="border-t border-border py-5">
              <dt className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs text-primary">{c.n}</span>
                <span className="font-mono text-[13px] text-foreground">{c.file}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {c.role}
                </span>
              </dt>
              <dd className="mt-2 pl-8 text-sm leading-6 text-muted-foreground">{c.body}</dd>
            </div>
          </InView>
        ))}
      </dl>
    </section>
  );
}

// What lands in the repository.
function RepoShape() {
  return (
    <section className={PROSE}>
      <SectionLabel label="What lands in the repo" />
      <InView>
        <Surface grid={false} className="px-5 py-4">
          <pre className="pj-terminal overflow-x-auto">{repoTree.join("\n")}</pre>
        </Surface>
      </InView>
      <InView delay={0.05}>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          One folder per problem, named from the problem title. The solution file takes the problem
          slug and the extension its language maps to, and the folder README carries the statement
          and difficulty. The root README is regenerated on every push as a table of everything
          solved — number, linked title, difficulty, language, date.
        </p>
      </InView>
      <Annotation className="mt-5" rotate={1}>
        an index nobody maintains is an index nobody trusts.
      </Annotation>
    </section>
  );
}

// The one-time connection.
function Auth() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="GitHub integration" />
        <InView>
          <p className="leading-7 text-muted-foreground">{auth.body}</p>
        </InView>
      </div>
      <InView delay={0.06}>
        <Surface className="mt-6 px-5 py-6">
          <Chain steps={auth.chain} accent="text-primary" />
          <p className="mt-5 border-t border-border/70 pt-4 text-sm leading-6 text-muted-foreground">
            {auth.note}
          </p>
        </Surface>
      </InView>
      <div className="mt-4">
        <CodeShots shots={[popupShot]} columns={1} />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="What it does" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {features.map((f, i) => (
          <InView key={f.title} delay={i * 0.05}>
            <Surface className="h-full px-5 py-5">
              <Tag>{f.title}</Tag>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.body}</p>
            </Surface>
          </InView>
        ))}
      </div>
    </section>
  );
}

// The honest section: this is built on someone else's internals.
function WhatCanBreak() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="What can break" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          {brittleness.note} <span className="text-muted-foreground/70">{brittleness.checked}</span>
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {brittleness.items.map((b, i) => (
          <InView key={b.part} delay={i * 0.06}>
            <Surface className="h-full px-5 py-5">
              <div className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-[#d98b83]" />
                <Tag>{b.part}</Tag>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b.body}</p>
            </Surface>
          </InView>
        ))}
      </div>
    </section>
  );
}

// The point of the whole thing, as two chains.
function BeforeAfter() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="The result" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          The same work, with the repetitive half removed.
        </p>
      </div>
      <div className="space-y-5">
        <InView>
          <div>
            <Tag className="mb-2 block">Before</Tag>
            <Chain steps={beforeAfter.before} />
          </div>
        </InView>
        <InView delay={0.08}>
          <div>
            <Tag className="mb-2 block">After</Tag>
            <Chain steps={beforeAfter.after} accent="text-primary" />
          </div>
        </InView>
      </div>
      <div className={`${PROSE} mt-6`}>
        <Annotation rotate={-1}>solve it once, file it never.</Annotation>
      </div>
    </section>
  );
}

export const tuf: CaseStudyContent = {
  category: "Browser extension / Developer tool",
  title: "TUF+ to GitHub",
  subtitle: "Submit → Accepted → Archived",
  description: [
    "A Chrome extension that automatically pushes accepted TUF+ submissions to GitHub, turning solved coding problems into a structured, searchable repository.",
    "When a submission is accepted, the extension detects the verdict, captures the code and problem information it has already seen, and creates or updates the matching folder on GitHub — so the archive maintains itself instead of needing a commit after every problem.",
  ],
  headerNote: "solving is half the workflow. filing is the other half.",

  snapshot: [
    { label: "Type", value: "Chrome extension" },
    { label: "Role", value: "Sole engineer" },
    { label: "Platform", value: "Manifest V3" },
    { label: "Trigger", value: "Accepted verdict" },
    { label: "Auth", value: "OAuth device flow" },
    { label: "Output", value: "GitHub repository" },
    { label: "Backend", value: "None" },
  ],

  problem: {
    body: [
      "Solving the problem is only half of the workflow.",
      "After every accepted submission comes the same sequence: copy the solution out, make a folder, name the file correctly, write down the problem statement, commit, and update the index of what has been solved. Done once it is trivial. Done sixty times it is the reason the archive stops being kept.",
      "TUF+ exposes no public API for any of this, so an extension cannot ask the site for a submission. It has to work with the judge requests the page already makes.",
    ],
    constraints: [
      "no public API to build against",
      "archive accepted work only",
      "no backend and no server-side account",
      "the GitHub token must never sit in the page",
      "a resubmission must update, not duplicate",
      "a failed scrape must not lose the solution",
    ],
    note: "the archive that needs maintaining is the archive that rots.",
  },

  architecture: {
    intro:
      "Eleven stages from the problem page to a committed folder. Select any of them to read what it does — and why it is in the chain at all.",
    nodes: flowNodes,
    edges: flowEdges,
    note: "observe → gate → enrich → push",
  },

  processIntro: "One accepted submission, end to end.",
  process: [
    { title: "Browse", detail: "The content script caches the problem's title, difficulty and statement from the page while you are still working on it." },
    { title: "Submit", detail: "Hitting Submit sends the judge POST carrying usercode, language and slug." },
    { title: "Intercept", detail: "The injected interceptor reads that request body from inside the page and posts it back to the content script." },
    { title: "Watch the verdict", detail: "The same hook reads the site's own check-submit polling responses, ignoring them until the judge reports the run complete." },
    { title: "Gate on Accepted", detail: "Only an accepted status continues. Everything else is observed and dropped." },
    { title: "Assemble", detail: "The cached problem details are combined with the captured code, falling back to a title-cased slug if the scrape came back empty." },
    { title: "Hand to the worker", detail: "The content script messages the background service worker, which is the only context holding the GitHub token." },
    { title: "Write", detail: "The solution file and the problem README are written through the contents API, reading the existing SHA first so a repeat submission updates in place." },
    { title: "Reindex", detail: "The root README is regenerated from the solved map in extension storage and committed with the new total, and the page shows a toast either way." },
  ],

  implementation: {
    intro: "Where each responsibility lives, and why the split is where it is.",
    note: "the part that actually runs →",
    blocks: [
      {
        file: "interceptor.js — MAIN world",
        body: "Wraps XHR and fetch, matches the judge paths, and posts what it reads back over window.postMessage scoped to the page origin. It never touches GitHub and never sees a token.",
      },
      {
        file: "background.js — service worker",
        body: "The device-flow exchange and its polling, the language-to-extension map, create-or-update writes against the contents API, and the regenerated index. The only context with the token.",
      },
    ],
  },

  decisions: [
    {
      title: "Why network interception",
      decision: "Hook the site's own judge requests from inside the page rather than scraping a result.",
      reason:
        "TUF+ publishes no API, and the submitted source does not exist anywhere in the DOM in a form worth reading. The request that carries it to the judge does.",
      tradeoff:
        "The extension is now coupled to one site's internal request shapes. A rename on their side breaks detection silently — the only symptom is a toast that stops appearing.",
    },
    {
      title: "Why wait for Accepted",
      decision: "Fire the push on the accepted verdict alone.",
      reason:
        "The point is an archive of solved problems. Pushing every attempt would fill the repository with wrong answers and make the index useless.",
      tradeoff:
        "A solution that was correct but timed out on the last test case is never archived, even though it may have been the more interesting attempt.",
    },
    {
      title: "Why a background service worker",
      decision: "Keep every GitHub call, and the token, out of the page's world entirely.",
      reason:
        "Anything running in the page can read what the page can read. Confining the token to the extension's background context means a compromised or hostile script on the site never has access to it.",
      tradeoff: "Every push becomes a message round-trip, and errors have to be marshalled back to be shown as a toast.",
    },
    {
      title: "Why local storage and no backend",
      decision: "Persist the token, repository name and solved map in chrome.storage.local.",
      reason:
        "The extension needs state between sessions, not a service. No backend means nothing to host, no account to create, and nothing of yours leaving the machine except the GitHub calls themselves.",
      tradeoff:
        "State is per-install. Reinstalling resets the counter and the index it regenerates, even though the folders already pushed are untouched.",
    },
    {
      title: "Why update instead of append",
      decision: "Read the existing file SHA and update in place when a problem is solved again.",
      reason:
        "A second attempt at a problem is a better answer to the same question, not a new one. Updating keeps one folder per problem and the count honest.",
      tradeoff:
        "The previous attempt is overwritten — the repository holds the latest solution, not the history of how it got there.",
    },
  ],

  results: {
    intro:
      "There is nothing here worth measuring in requests per second. What the project produces is a workflow that no longer needs you in the middle of it.",
    facts: [
      { label: "Automation", value: "End-to-end" },
      { label: "Trigger", value: "Accepted only" },
      { label: "Output", value: "GitHub repo" },
      { label: "Auth", value: "Device flow" },
    ],
    outcomes: [
      "An accepted submission becomes a committed folder with no manual step in between.",
      "Each solution is saved under its own problem folder with the right file extension for its language.",
      "The problem statement and difficulty are stored alongside the code rather than lost with the tab.",
      "The root index is regenerated from stored state on every push, so it cannot drift from the repository.",
      "A resubmission updates the existing files instead of creating a second folder.",
      "The destination repository is created private on the first accepted push if it does not exist.",
      "The token stays in extension storage and is used for nothing but GitHub API requests.",
    ],
    limitations: [
      "It works on one site, against internals that site never promised to keep.",
      "Only the latest solution to a problem survives; earlier attempts are overwritten.",
      "The solved count and root index live per-install, so a reinstall resets both.",
      "Connecting requires creating your own GitHub OAuth app with device flow enabled.",
    ],
  },

  learnings: {
    lead: "Building on someone else's internals is a decision you keep paying for, and it is still sometimes the right one.",
    body: [
      "There was no version of this that used a supported interface, because there isn't one. So the real question became how to fail: which parts should break loudly, which should degrade quietly, and which should never take the solution down with them. A missing statement writes a README that says so. A renamed endpoint stops the toast appearing. Both are recoverable; losing the code would not have been.",
      "The other thing that stuck was where to keep the token. It would have been easier to do the GitHub calls from the content script, and it would have put a repo-scoped token inside a page I do not control. Splitting the extension across two worlds costs a message round-trip and is worth every bit of it.",
      "Mostly it taught me that the boring half of a workflow is the half worth automating. Solving the problem was never the tedious part.",
    ],
    note: "decide how it breaks before you decide how it works.",
  },

  stack: [
    "JavaScript",
    "Chrome Extensions",
    "Manifest V3",
    "Service worker",
    "Chrome Storage API",
    "GitHub OAuth device flow",
    "GitHub Contents API",
    "XHR / fetch interception",
    "DOM scraping",
  ],

  slots: {
    afterArchitecture: <Endpoints />,
    afterProcess: (
      <>
        <Components />
        <RepoShape />
      </>
    ),
    afterImplementation: (
      <>
        <Auth />
        <Features />
      </>
    ),
    afterResults: (
      <>
        <WhatCanBreak />
        <BeforeAfter />
      </>
    ),
  },
};
