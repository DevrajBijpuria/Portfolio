"use client";

import { motion, useReducedMotion } from "motion/react";

// Everything inside the tube is ordinary, selectable HTML — the CRT effects are
// inert overlay layers above it. Mono type + the existing lavender accent, so it
// reads as the portfolio's own voice rather than a terminal skin.

const ACCENT = "#A8AEF5";
const DIM = "#9d9784";

// The about copy, in the owner's own words. Rendered as plain paragraphs — this
// is the one place on the machine that speaks in the first person.
const BIO = [
  "I'm Devraj, a Computer Science student at Vellore Institute of Technology who likes building things with data, AI, and cloud tech.",
  "I got into data engineering after wondering what actually happens to data before it reaches an ML model. That rabbit hole led me into data pipelines, AWS, Snowflake, ETL/ELT, real-time systems, and analytics — and naturally, a bunch of side projects.",
  "I've built things like Spotify data pipelines, NNNIDS, Signal Desk, and a TUF-to-GitHub automation tool. Most of my learning happens the same way: find something interesting → go down the rabbit hole → build something with it.",
  "Outside tech, I love cooking and trying different cuisines, and I have a pretty strong creative side through art & craft.",
  "Basically, I like building, experimenting, and seeing where the next rabbit hole takes me.",
];

const RESUME_HREF = "/DEVRAJ_BIJPURIA_RESUME.pdf";

function Head({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: DIM }}>
      {children}
    </h3>
  );
}

export function CrtContent() {
  const reduced = useReducedMotion() ?? false;

  const group = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: reduced ? 0 : 0.08 } },
  };
  const item = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0.15 : 0.34, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <motion.div variants={group} initial="hidden" animate="show" className="font-mono">
      <motion.header variants={item} className="mb-5">
        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: DIM }}>
          sys/about
        </span>
        <h2 className="mt-3 text-[clamp(18px,3.2vw,34px)] font-bold uppercase leading-none tracking-[0.06em]">
          Devraj Bijpuria
        </h2>
        <p className="mt-1 text-[clamp(10px,1.3vw,13px)] uppercase tracking-[0.24em]" style={{ color: ACCENT }}>
          Data Engineering
        </p>
        <div className="mt-4 h-px w-full" style={{ background: "rgba(236,229,212,0.14)" }} />
      </motion.header>

      <motion.section variants={item} className="mb-6 space-y-3">
        {BIO.map((p) => (
          <p
            key={p}
            className="max-w-[62ch] text-[clamp(11px,1.35vw,14px)] leading-relaxed"
            style={{ color: "#d8d1bf" }}
          >
            {p}
          </p>
        ))}
      </motion.section>

      <motion.section variants={item}>
        <Head>Résumé</Head>
        <a
          href={RESUME_HREF}
          download
          className="inline-flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-[clamp(11px,1.3vw,13px)] outline-none transition-colors hover:bg-[rgba(168,174,245,0.12)] focus-visible:bg-[rgba(168,174,245,0.16)]"
          style={{ border: `1px solid rgba(168,174,245,0.4)`, color: ACCENT }}
        >
          <span aria-hidden>↓</span>
          Download résumé (PDF)
        </a>
      </motion.section>
    </motion.div>
  );
}
