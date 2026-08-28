"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GRAIN } from "@/components/board/grain";
import "./projects.css";

// Shared notebook furniture for the project case studies. Small pieces only —
// the page-specific sections live with their page.

// Section marker: a rule, a mono label, then the heading. Reads as a divider in
// a ruled notebook rather than a SaaS section header.
export function SectionLabel({
  label,
  title,
  children,
}: {
  label: string;
  title?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mt-20 mb-6">
      <div className="mb-3 h-px w-full bg-border" />
      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </div>
      {title && (
        <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      )}
      {children}
    </header>
  );
}

// A note written onto the page in the notebook hand, in the muted accent. Used
// sparingly — five or six across the whole page, never as decoration for its
// own sake.
export function Annotation({
  children,
  className = "",
  style,
  rotate = -1.5,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  rotate?: number;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.p
      className={`font-[family-name:var(--font-hand)] text-lg leading-tight text-primary/70 ${className}`}
      style={{ ...style }}
      initial={reduced ? { opacity: 0, rotate } : { opacity: 0, y: 6, rotate }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.p>
  );
}

// Fade + small rise as a block enters the viewport. No scroll-jacking, no
// parallax: one short move, once, then it stays put.
export function InView({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduced ? 0.2 : 0.45, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// A charcoal panel with the board's print grain and a faint engineering grid —
// the surface every diagram on this page is drawn on, so they read as one
// material rather than a stack of cards.
export function Surface({
  children,
  className = "",
  grid = true,
}: {
  children: ReactNode;
  className?: string;
  grid?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-border/70 ${className}`}
      style={{
        background:
          "linear-gradient(168deg, rgba(26,25,23,0.94) 0%, rgba(19,18,17,0.95) 48%, rgba(14,13,12,0.96) 100%)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: GRAIN, backgroundSize: "120px 120px", opacity: 0.05 }}
      />
      {grid && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(184,177,165,0.035) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(184,177,165,0.028) 0 1px, transparent 1px 22px)",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

// Small caps mono tag used for the labels inside diagrams.
export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}

// The sheet the whole case study is printed on: a fixed drafting grid that fades
// out down the page, plus a couple of corner coordinates. Purely decorative and
// behind everything — content always wins.
//
// `path` also lights a small ambient system readout in the opposite corner —
// the one piece of the CRT desktop that follows you onto the page, so a project
// reads as a document open *inside* the machine rather than a page beside it.
export function Ground({ mark, path }: { mark?: string; path?: string }) {
  return (
    <>
      <span aria-hidden className="pj-ground" />
      {mark && (
        <span
          aria-hidden
          className="pointer-events-none fixed left-4 top-4 hidden font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground/25 lg:block"
        >
          {mark}
        </span>
      )}
      {path && <SystemReadout path={path} />}
      <span
        aria-hidden
        className="pointer-events-none fixed bottom-4 left-4 hidden font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground/20 lg:block"
      >
        SHEET 01 · A—A
      </span>
    </>
  );
}

// The system readout carried over from the CRT desktop, redrawn in the muted
// engineering hand instead of phosphor green. Everything here is true: the clock
// ticks, READ is the real scroll position through the document. That honesty is
// what keeps it from reading as decoration. Fixed, aria-hidden, behind
// everything and hidden on small screens where it would crowd the text.
function SystemReadout({ path }: { path: string }) {
  const [clock, setClock] = useState("");
  const [read, setRead] = useState(0);

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    tick();
    const t = setInterval(tick, 30_000);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setRead(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearInterval(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <dl className="pj-readout" aria-hidden="true">
      <div className="pj-readout__head">
        <span className="pj-readout__led" />
        NOTEBOOK · ONLINE
      </div>
      <div>
        <dt>PATH</dt>
        <dd>{path}</dd>
      </div>
      <div>
        <dt>READ</dt>
        <dd className="tabular-nums">{String(read).padStart(3, "0")}%</dd>
      </div>
      <div>
        <dt>CLK</dt>
        <dd className="tabular-nums">{clock || "--:--"}</dd>
      </div>
    </dl>
  );
}

// A row of small technical labels — the header block of a drawing, not a set of
// stat cards. Wraps rather than scrolls on a narrow screen.
export function MetaStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-4 border-y border-border py-4">
      {items.map((m) => (
        <div key={m.label}>
          <dt className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            {m.label}
          </dt>
          <dd className="mt-1 font-mono text-[13px] text-foreground">{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// A left-to-right run of steps that becomes a vertical run on a narrow screen.
// Each step can carry a second line; the last one can be given the accent.
export function Chain({
  steps,
  accent,
}: {
  steps: (string | { label: string; note?: string })[];
  accent?: string;
}) {
  const items = steps.map((s) => (typeof s === "string" ? { label: s, note: undefined } : s));
  return (
    <ol className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-stretch">
      {items.map((s, i) => (
        <li key={s.label} className="flex items-center gap-2 sm:flex-1">
          <span
            className={`flex-1 self-stretch rounded-[3px] border border-border/70 px-3 py-2 text-center ${
              accent && i === items.length - 1 ? accent : "text-muted-foreground"
            }`}
          >
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em]">
              {s.label}
            </span>
            {s.note && (
              <span className="mt-1 block font-mono text-[11px] text-muted-foreground/70">
                {s.note}
              </span>
            )}
          </span>
          {i < items.length - 1 && (
            <span aria-hidden className="shrink-0 font-mono text-xs text-primary/60">
              <span className="sm:hidden">↓</span>
              <span className="hidden sm:inline">→</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
