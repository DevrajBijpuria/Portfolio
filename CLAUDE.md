@AGENTS.md

# Data Engineering Portfolio

Portfolio site that proves data-engineering skill through interactive pipeline
architecture and real metrics — not visual spectacle. Audience: ML/DE hiring
managers scanning fast.

## Stack (do not swap these out)

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (`src/components/ui/`) — base-nova preset
- **MDX** for case-study content (`@next/mdx`, configured in `next.config.ts`)
- **React Flow** (`reactflow` v11) for pipeline architecture diagrams
- **Recharts** (v3) for metrics charts, fed by static JSON
- **Motion** (`motion/react` v13) for hover/reveal micro-interactions only
- Deploy target: **Vercel**

Explicitly excluded (out of scope, don't add): GSAP/ScrollTrigger, Three.js/R3F,
GLSL, Lenis, Clerk/Auth.js, Postgres+Prisma as an app DB.

## Layout

```
src/
  app/
    layout.tsx                 # nav + footer shell, fonts
    page.tsx                   # home (placeholder — full landing is a later task)
    globals.css                # theme tokens; chart-1..5 overridden for legible viz
    case-studies/
      layout.tsx               # shared container + back link
      <slug>/
        page.mdx               # writeup; imports the diagram + chart + local data
        diagram.ts             # React Flow nodes/edges (typed via StageNodeType)
        metrics.json           # chart data
  components/
    pipeline-diagram.tsx       # React Flow, click-a-node → description panel ("use client")
    metrics-chart.tsx          # Recharts line/bar, JSON-fed ("use client")
    case-study-card.tsx        # home grid card (Motion hover)
    reveal.tsx                 # Motion staggered reveal wrapper
    site-nav.tsx               # top nav
    ui/                        # shadcn primitives (card, table, tabs, badge, button)
  lib/case-studies.ts          # manual registry of case studies (slug/title/stack/metric)
  mdx-components.tsx           # MDX prose styling (required by Next MDX)
```

## Adding a case study

1. Add an entry to `caseStudies` in `src/lib/case-studies.ts`.
2. Create `src/app/case-studies/<slug>/` with `page.mdx`, `diagram.ts`, `metrics.json`.
3. In `diagram.ts`, type nodes as `StageNodeType[]`; each node's `data.stage` is
   `"extract" | "transform" | "load"` (drives node color, mapped to chart-1/4/2).
4. `page.mdx` imports `PipelineDiagram`, `MetricsChart`, and the local data.

## Conventions

- Interactive components (diagram, chart, anything with Motion/hooks) need
  `"use client"`; MDX pages and everything else stay server components.
- Chart series colors come from `var(--chart-1..5)` CSS tokens — never hardcode hex.
- Motion is for hover, tab, and reveal transitions only. No scroll-jacking.
- Keep the UI neutral; the data viz is where color lives.

## Commands

```bash
npm run dev     # local dev (Turbopack)
npm run build   # production build + typecheck
npm run lint
```
