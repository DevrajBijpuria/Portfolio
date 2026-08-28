"use client";

import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";
import { NB, projectMeta, type Spread } from "@/data/notebook-pages";
import { NotebookChart } from "./NotebookChart";

// React Flow is heavy — split its chunk so it loads only when a project spread
// actually renders (i.e. after the notebook opens), not with the landing bundle.
const NotebookDiagram = dynamic(
  () => import("./NotebookDiagram").then((m) => m.NotebookDiagram),
  {
    ssr: false,
    loading: () => (
      <div
        className="grid h-40 place-items-center rounded-md font-mono text-[11px]"
        style={{ background: "#EAE2CF", color: NB.inkSoft }}
      >
        loading diagram…
      </div>
    ),
  }
);
import { projectData } from "./project-data";
import CdcMdx from "@/content/cdc-connector.mdx";
import SpotifyMdx from "@/content/spotify-pipeline.mdx";

const hand = "font-[family-name:var(--font-hand)]";

const mdxComponents: MDXComponents = {
  p: (props) => (
    <p className="text-[13px] leading-relaxed" style={{ color: NB.inkSoft }} {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold" style={{ color: NB.accentDeep }} {...props} />
  ),
};

const projectMdx: Record<string, React.ComponentType<{ components?: MDXComponents }>> = {
  "cdc-connector": CdcMdx,
  "spotify-pipeline": SpotifyMdx,
};

function SectionTag({ n, title }: { n?: string; title: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-2">
      {n && (
        <span className="font-mono text-2xl font-bold leading-none" style={{ color: NB.accent }}>
          {n}
        </span>
      )}
      <span
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: NB.inkSoft }}
      >
        {title}
      </span>
    </div>
  );
}

function Labels({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="rounded px-1.5 py-0.5 font-mono text-[10px]"
          style={{ border: `1px solid ${NB.accent}`, color: NB.accentDeep }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function Hand({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`${hand} text-lg leading-tight ${className}`} style={{ color: NB.inkSoft }}>
      {children}
    </p>
  );
}

/* ---------------- COVER ---------------- */
function CoverRight() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: NB.inkSoft }}>
        Engineering Field Notebook
      </div>
      <h1 className="mt-3 text-4xl font-bold tracking-tight" style={{ color: NB.ink }}>
        Devraj Bijpuria
      </h1>
      <div className="mt-1 text-sm" style={{ color: NB.inkSoft }}>
        Data / ML Engineering
      </div>
      <div className="mt-8 h-px w-24" style={{ background: NB.accent }} />
      <Hand className="mt-8 text-xl" >turn the page →</Hand>
    </div>
  );
}

function CoverLeft() {
  return (
    <div className="flex h-full items-end justify-start p-2">
      <Hand>vol. 01 · 2025</Hand>
    </div>
  );
}

/* ---------------- ABOUT ---------------- */
function AboutLeft() {
  return (
    <div>
      <SectionTag n="01" title="Profile" />
      <Hand className="mb-4">
        notes to self — build things that stay correct at 3am.
      </Hand>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: NB.inkSoft }}>
        Toolkit
      </div>
      <div className="mb-5">
        <Labels items={["Airflow", "DuckDB", "AWS", "Python", "dbt", "SQL", "Athena", "Spark"]} />
      </div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: NB.inkSoft }}>
        Timeline
      </div>
      <ul className="space-y-1.5 text-[12px]" style={{ color: NB.inkSoft }}>
        <li><span style={{ color: NB.accentDeep }}>&apos;25</span> — Serverless AWS pipelines</li>
        <li><span style={{ color: NB.accentDeep }}>&apos;24</span> — CDC + SCD2 warehousing</li>
        <li><span style={{ color: NB.accentDeep }}>&apos;23</span> — dbt / analytics engineering</li>
      </ul>
    </div>
  );
}

function AboutRight() {
  return (
    <div>
      <SectionTag title="About" />
      <h2 className="mb-3 text-xl font-bold" style={{ color: NB.ink }}>
        Building reliable data systems
      </h2>
      <p className="text-[13px] leading-relaxed" style={{ color: NB.inkSoft }}>
        I design and ship data pipelines end to end — ingestion, transformation, and the
        metrics that prove they work. I care about correctness (exactly-once, full
        history), cost, and keeping systems legible for the people who run them.
      </p>
      <Hand className="mt-5">the next pages are the actual builds ↓</Hand>
    </div>
  );
}

/* ---------------- PROJECT ---------------- */
function ProjectLeft({ slug, number }: { slug: string; number?: string }) {
  const meta = projectMeta[slug];
  if (!meta) return null;
  return (
    <div>
      <SectionTag n={number} title="Engineering notes" />
      <ul className="mb-5 space-y-3">
        {meta.notes.map((note) => (
          <li key={note} className="flex gap-2">
            <span style={{ color: NB.accent }}>→</span>
            <span className={`${hand} text-[17px] leading-tight`} style={{ color: NB.ink }}>
              {note}
            </span>
          </li>
        ))}
      </ul>
      <Labels items={meta.labels} />
      <div className="mt-5 font-mono text-[10px]" style={{ color: NB.inkSoft }}>
        v1.2 · updated 2025
      </div>
    </div>
  );
}

function ProjectRight({ slug }: { slug: string }) {
  const meta = projectMeta[slug];
  const data = projectData[slug];
  const Mdx = projectMdx[slug];
  if (!meta || !data) return null;

  return (
    <div>
      <SectionTag title="Case Study" />
      <h2 className="text-xl font-bold leading-tight" style={{ color: NB.ink }}>
        {meta.title}
      </h2>
      <div className="mb-3 font-mono text-[11px]" style={{ color: NB.inkSoft }}>
        {meta.kicker}
      </div>

      <div className="relative">
        <NotebookDiagram nodes={data.nodes} edges={data.edges} />
        <span
          className={`${hand} absolute -top-1 right-1 text-base`}
          style={{ color: NB.accentDeep }}
        >
          click a stage ↴
        </span>
      </div>

      <div className="my-3 grid grid-cols-3 gap-2">
        {meta.stats.map((s) => (
          <div key={s.label} className="rounded-md px-2 py-1.5 text-center" style={{ background: "#EAE2CF" }}>
            <div className="font-mono text-sm font-bold" style={{ color: NB.ink }}>
              {s.value}
            </div>
            <div className="text-[9px] leading-tight" style={{ color: NB.inkSoft }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: NB.inkSoft }}>
        {data.chart.title}
      </div>
      <NotebookChart data={data.metrics} xKey={data.chart.xKey} series={data.chart.series} type={data.chart.type} />

      {Mdx && (
        <div className="mt-3">
          <Mdx components={mdxComponents} />
        </div>
      )}

      <Link
        href={`/case-studies/${slug}`}
        className="mt-3 inline-block font-mono text-[11px] font-semibold underline underline-offset-2"
        style={{ color: NB.accentDeep }}
      >
        Full case study →
      </Link>
    </div>
  );
}

/* ---------------- CONTACT ---------------- */
function ContactLeft() {
  return (
    <div className="flex h-full flex-col justify-center">
      <SectionTag n="04" title="Sign-off" />
      <Hand className="text-xl">
        thanks for paging through. let&apos;s build something that ships.
      </Hand>
    </div>
  );
}

function ContactRight() {
  return (
    <div className="flex h-full flex-col justify-center">
      <SectionTag title="Contact" />
      <h2 className="mb-4 text-xl font-bold" style={{ color: NB.ink }}>
        Let&apos;s talk pipelines
      </h2>
      <div className="space-y-2 text-[13px]" style={{ color: NB.ink }}>
        <a href="mailto:dbijpuria@gmail.com" className="block underline underline-offset-2">
          dbijpuria@gmail.com
        </a>
        <a href="https://github.com/" className="block underline underline-offset-2">
          github.com/devraj
        </a>
      </div>
      <div className="mt-6 h-px w-16" style={{ background: NB.accent }} />
    </div>
  );
}

export function SpreadSide({ spread, side }: { spread: Spread; side: "left" | "right" }) {
  switch (spread.kind) {
    case "cover":
      return side === "right" ? <CoverRight /> : <CoverLeft />;
    case "about":
      return side === "right" ? <AboutRight /> : <AboutLeft />;
    case "project":
      return side === "right" ? (
        <ProjectRight slug={spread.slug!} />
      ) : (
        <ProjectLeft slug={spread.slug!} number={spread.number} />
      );
    case "contact":
      return side === "right" ? <ContactRight /> : <ContactLeft />;
  }
}
