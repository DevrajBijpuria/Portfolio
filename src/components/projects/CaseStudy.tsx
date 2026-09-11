"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { BoardProject } from "@/data/board-projects";
import type { CaseStudyContent, SlotName } from "./case-study";
import { ArchitectureFlow } from "./ArchitectureFlow";
import { CodeShots } from "./CodeShots";
import { Annotation, Ground, InView, MetaStrip, SectionLabel, Surface, Tag } from "./notebook";

// One page of the notebook. Every project route renders this; what differs
// between them is the content object and whatever visuals a project hangs in its
// slots — never the layout.
//
// The spine, in order:
//   01 header · 02 snapshot · 03 problem · 04 architecture · 05 how it works
//   06 implementation · 07 engineering decisions · 08 results · 09 what I learned
//   10 next project
//
// Every middle section is optional and renders only when the project has content
// for it, so a project with a one-line README gets a short honest page rather
// than a long one full of empty furniture.

// The reading column. Full-width compositions (the diagram, the screenshots) sit
// outside it deliberately — that alternation is what stops the page reading as a
// stack of cards.
const PROSE = "max-w-2xl";

export function CaseStudy({
  content,
  project,
  next,
  previous,
}: {
  content: CaseStudyContent;
  project: BoardProject;
  next?: BoardProject;
  previous?: BoardProject;
}) {
  const reduced = useReducedMotion() ?? false;
  const slot = (name: SlotName) => content.slots?.[name] ?? null;

  // The three header blocks arrive with the page rather than on scroll — they
  // are already in view, and animating them in would only delay the title.
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
      <Ground mark={`${content.title} · /projects/${project.id}`} path={`/projects/${project.id}`} />

      {/* 01 — header. The title is the loudest thing on the page; everything
          around it is a label. */}
      <motion.header {...enter(0)} className={PROSE}>
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          {content.category}
        </div>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          {content.title}
        </h1>
        {content.subtitle && (
          <p className="mt-3 font-mono text-sm text-primary">{content.subtitle}</p>
        )}
      </motion.header>

      <motion.div {...enter(0.1)} className={`${PROSE} mt-7 space-y-4`}>
        {content.description.map((p) => (
          <p key={p} className="leading-7 text-muted-foreground">
            {p}
          </p>
        ))}
        {content.headerNote && (
          <Annotation className="!mt-6" rotate={-1.5}>
            {content.headerNote}
          </Annotation>
        )}
      </motion.div>

      {/* 02 — snapshot: the header block of the drawing, not a stat row */}
      {content.snapshot && content.snapshot.length > 0 && (
        <motion.div {...enter(0.16)} className={`${PROSE} mt-8`}>
          <MetaStrip items={content.snapshot} />
        </motion.div>
      )}

      {slot("afterSnapshot")}

      {/* 03 — the problem */}
      {content.problem && (
        <section className={PROSE}>
          <SectionLabel label="The problem" />
          <div className="space-y-4">
            {content.problem.body.map((p, i) => (
              <InView key={p} delay={i * 0.05}>
                <p className={i === 0 ? "leading-7 text-foreground" : "leading-7 text-muted-foreground"}>
                  {p}
                </p>
              </InView>
            ))}
          </div>
          {content.problem.constraints && (
            <InView delay={0.08}>
              <ul className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {content.problem.constraints.map((c) => (
                  <li key={c} className="flex items-baseline gap-2 text-sm text-muted-foreground">
                    <span className="text-primary">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </InView>
          )}
          {content.problem.note && (
            <Annotation className="mt-7" rotate={-1}>
              {content.problem.note}
            </Annotation>
          )}
        </section>
      )}

      {slot("afterProblem")}

      {/* 04 — architecture, the primary visual of every page. Breaks the reading
          column on purpose: this is the widest thing here. */}
      {content.architecture && (
        <section>
          <div className={PROSE}>
            <SectionLabel label="Architecture" />
            {content.architecture.intro && (
              <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
                {content.architecture.intro}
              </p>
            )}
          </div>
          <InView>
            <ArchitectureFlow
              spec={content.architecture.nodes}
              edges={content.architecture.edges}
            />
          </InView>
          {content.architecture.note && (
            <div className={`${PROSE} mt-5`}>
              <Annotation>{content.architecture.note}</Annotation>
            </div>
          )}
        </section>
      )}

      {slot("afterArchitecture")}

      {/* 05 — how it works. However many steps the project has. */}
      {content.process && content.process.length > 0 && (
        <section className={PROSE}>
          <SectionLabel label="How it works" />
          {content.processIntro && (
            <p className="-mt-2 mb-4 text-sm leading-6 text-muted-foreground">
              {content.processIntro}
            </p>
          )}
          <dl className="space-y-0">
            {content.process.map((step, i) => (
              <InView key={step.title} delay={i * 0.05}>
                <div className="border-t border-border py-5">
                  <dt className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                      {step.title}
                    </span>
                  </dt>
                  <dd className="mt-2 pl-8">
                    <p className="text-sm leading-6 text-muted-foreground">{step.detail}</p>
                    {step.meta && (
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {step.meta}: <span className="text-primary">{step.metaValue}</span>
                      </p>
                    )}
                  </dd>
                </div>
              </InView>
            ))}
          </dl>
        </section>
      )}

      {slot("afterProcess")}

      {/* 06 — implementation. Renders only the halves the project actually has. */}
      {content.implementation &&
        (content.implementation.shots?.length || content.implementation.blocks?.length) && (
          <section>
            <div className={PROSE}>
              <SectionLabel label="Implementation" />
              {content.implementation.intro && (
                <p className="-mt-2 text-sm leading-6 text-muted-foreground">
                  {content.implementation.intro}
                </p>
              )}
              {content.implementation.note && (
                <Annotation className="mb-6 mt-3" rotate={-1}>
                  {content.implementation.note}
                </Annotation>
              )}
            </div>

            {content.implementation.blocks && content.implementation.blocks.length > 0 && (
              <div className="mb-4 grid gap-3 md:grid-cols-2">
                {content.implementation.blocks.map((b, i) => (
                  <InView key={b.file} delay={i * 0.06}>
                    <Surface grid={false} className="h-full">
                      <div className="flex items-center gap-2 border-b border-border/70 bg-black/25 px-3 py-2">
                        <span aria-hidden className="size-1 rounded-full bg-primary/50" />
                        <span className="font-mono text-[11px] text-foreground/90">{b.file}</span>
                      </div>
                      <div className="px-4 py-4">
                        {b.lines && (
                          <pre className="pj-terminal mb-3 overflow-x-auto">
                            {b.lines.join("\n")}
                          </pre>
                        )}
                        <p className="text-sm leading-6 text-muted-foreground">{b.body}</p>
                      </div>
                    </Surface>
                  </InView>
                ))}
              </div>
            )}

            {content.implementation.shots && content.implementation.shots.length > 0 && (
              <CodeShots
                shots={content.implementation.shots}
                columns={content.implementation.shotColumns ?? 2}
              />
            )}
          </section>
        )}

      {slot("afterImplementation")}

      {/* 07 — engineering decisions. The reason the page exists: what was chosen,
          why, and what it cost. */}
      {content.decisions && content.decisions.length > 0 && (
        <section className={PROSE}>
          <SectionLabel label="Engineering decisions" />
          <dl className="space-y-0">
            {content.decisions.map((d, i) => (
              <InView key={d.title} delay={i * 0.05}>
                <div className="border-t border-border py-5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                    {d.title}
                  </dt>
                  <dd>
                    <p className="mt-2 leading-6 text-foreground">{d.decision}</p>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{d.reason}</p>
                    {d.tradeoff && (
                      <p className="mt-3 border-l border-border pl-3 text-sm leading-6 text-muted-foreground">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                          Trade-off
                        </span>
                        <br />
                        {d.tradeoff}
                      </p>
                    )}
                  </dd>
                </div>
              </InView>
            ))}
          </dl>
        </section>
      )}

      {slot("afterDecisions")}

      {/* 08 — results. Facts, outcomes and limits — never a metric the project
          cannot back up. */}
      {content.results && (
        <section className={PROSE}>
          <SectionLabel label="Results" />
          {content.results.intro && (
            <InView>
              <p className="-mt-2 mb-6 leading-7 text-muted-foreground">{content.results.intro}</p>
            </InView>
          )}
          {content.results.facts && content.results.facts.length > 0 && (
            <InView>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
                {content.results.facts.map((f) => (
                  <div key={f.label} className="bg-background px-4 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {f.label}
                    </dt>
                    <dd className="mt-1 font-mono text-sm text-primary">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </InView>
          )}
          {content.results.outcomes && (
            <InView delay={0.05}>
              <ul className="mt-6 space-y-2">
                {content.results.outcomes.map((o) => (
                  <li key={o} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </InView>
          )}
          {content.results.limitations && (
            <InView delay={0.08}>
              <div className="mt-7">
                <Tag>What it does not do</Tag>
                <ul className="mt-2 space-y-2">
                  {content.results.limitations.map((l) => (
                    <li key={l} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                      <span className="text-muted-foreground/50">—</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </InView>
          )}
          {content.results.note && (
            <InView delay={0.1}>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">{content.results.note}</p>
            </InView>
          )}
        </section>
      )}

      {slot("afterResults")}

      {/* 09 — what I learned. Narrower than everything else, set like a written
          page: the opening line is the statement, the rest supports it. */}
      {content.learnings && (
        <section className="max-w-xl">
          <SectionLabel label="What I learned" />
          <InView>
            <p className="text-2xl font-medium leading-[1.35] tracking-tight text-foreground">
              {content.learnings.lead}
            </p>
          </InView>
          {content.learnings.body.length > 0 && (
            <div className="mt-6 space-y-5 border-l border-border pl-5">
              {content.learnings.body.map((p, i) => (
                <InView key={p} delay={0.07 + i * 0.07}>
                  <p className="leading-7 text-muted-foreground">{p}</p>
                </InView>
              ))}
            </div>
          )}
          {content.learnings.note && (
            <Annotation className="mt-7" rotate={1}>
              {content.learnings.note}
            </Annotation>
          )}
        </section>
      )}

      {slot("afterLearnings")}

      {/* stack */}
      {content.stack && content.stack.length > 0 && (
        <section className={PROSE}>
          <SectionLabel label="Stack" />
          <div className="flex flex-wrap gap-1.5">
            {content.stack.map((t) => (
              <span
                key={t}
                className="rounded-[3px] border border-border/70 px-2 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {content.footnote && (
        <p
          className={`${PROSE} mt-10 border-t border-border pt-4 text-xs leading-5 text-muted-foreground`}
        >
          {content.footnote}
        </p>
      )}

      {/* 10 — onward. Turning a page, not leaving the notebook. */}
      <section className={PROSE}>
        <SectionLabel label="Where to go next" />
        <InView className="flex flex-col gap-2">
          {project.repo && !project.repoPrivate && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-md border border-border px-4 py-3 text-sm transition-colors hover:bg-accent"
            >
              View the source on GitHub
              <ArrowUpRight className="size-4 opacity-60" />
            </a>
          )}
          {/* A private repo is named rather than linked — sending a visitor to a
              404 is worse than telling them it is not open. */}
          {project.repoPrivate && (
            <p className="inline-flex items-center gap-2 rounded-md border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              <Lock className="size-4 shrink-0 opacity-60" />
              The repository for this one is private.
            </p>
          )}
          {project.caseStudy && (
            <Link
              href={project.caseStudy}
              className="group inline-flex items-center gap-2 rounded-md border border-border px-4 py-3 text-sm transition-colors hover:bg-accent"
            >
              View product case study
              <ArrowRight className="size-4 -translate-x-1 opacity-60 transition-transform group-hover:translate-x-0" />
            </Link>
          )}

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {previous && (
              <Link
                href={`/projects/${previous.id}`}
                className="group inline-flex items-center gap-3 rounded-md border border-border px-4 py-3 text-sm transition-colors hover:bg-accent"
              >
                <ArrowRight className="size-4 rotate-180 opacity-60 transition-transform group-hover:-translate-x-1" />
                <span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Previous
                  </span>
                  <span className="mt-0.5 block">{previous.title}</span>
                </span>
              </Link>
            )}
            {next && (
              <Link
                href={`/projects/${next.id}`}
                className={`group inline-flex items-center justify-between gap-3 rounded-md border border-border px-4 py-3 text-sm transition-colors hover:bg-accent ${
                  previous ? "" : "sm:col-start-2"
                }`}
              >
                <span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Next project
                  </span>
                  <span className="mt-0.5 block">{next.title}</span>
                </span>
                <ArrowRight className="size-4 -translate-x-1 opacity-60 transition-transform group-hover:translate-x-0" />
              </Link>
            )}
          </div>
        </InView>
      </section>
    </div>
  );
}
