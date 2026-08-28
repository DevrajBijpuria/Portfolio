import type { CaseStudyContent } from "@/components/projects/case-study";
import type { BoardProject } from "@/data/board-projects";
import { spotify } from "@/components/projects/sections/spotify";
import { realtime } from "@/components/projects/sections/realtime";
import { nnnids } from "@/components/projects/sections/nnnids";
import { signalDesk } from "@/components/projects/sections/signal-desk";
import { tuf } from "@/components/projects/sections/tuf";
import { fitness } from "@/components/projects/sections/fitness";

// Which projects have written case studies. A project not listed here still gets
// a page — it is built from its board registry entry instead, which keeps the
// page honest: a project with a thin README gets a short page rather than a long
// one padded out with furniture.
const written: Record<string, CaseStudyContent> = {
  spotify,
  realtime,
  nnnids,
  "signal-desk": signalDesk,
  tuf,
  fitness,
};

// The fallback: everything the board already knows about a project, arranged
// into the same spine. Nothing is invented — a field the registry does not have
// is a section that does not render.
function fromBoardProject(p: BoardProject): CaseStudyContent {
  return {
    category: p.tag,
    title: p.title,
    subtitle: p.tagline,
    description: p.overview,
    process: p.flow?.map((f) => ({ title: f.title, detail: f.detail })),
    results:
      p.stats || p.highlights
        ? { facts: p.stats, outcomes: p.highlights }
        : undefined,
    stack: p.stack,
  };
}

export function getCaseStudy(p: BoardProject): CaseStudyContent {
  return written[p.id] ?? fromBoardProject(p);
}
