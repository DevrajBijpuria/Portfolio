"use client";

import { useState } from "react";
import Link from "next/link";
import { boardProjects, type BoardProject } from "@/data/board-projects";
import { PROJECTS_FOLDER } from "@/data/desktop";
import { CrtWindow } from "./CrtWindow";
import { FileIcon, FolderIcon } from "./desktop-icons";

// projects/ browsed in place, the same way skill_stack/ is: the window opens on
// the list of projects and descends into one when you pick it, with a `..` row
// back up — one window that navigates, the way a file manager of this vintage
// worked, rather than a second window stacking on the desk.
//
// The list comes from the board registry, so a project added there appears here
// without a second list to keep in step.

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 px-1 py-[2px] text-[clamp(10px,1.25vw,13px)]">
      <span className="w-[52px] shrink-0 uppercase tracking-[0.12em] text-[#9d9784]">{label}</span>
      <span className="min-w-0 text-[#cfc8b4]">{value}</span>
    </div>
  );
}

// The detail view: what the project is, what it is built from, and the way
// through to its own page. Deliberately short — the desk shows what is on it,
// the project page is where the writing lives.
function Detail({ project }: { project: BoardProject }) {
  return (
    <div className="pb-1">
      <p className="px-1 pb-2 text-[clamp(11px,1.4vw,14px)] text-[#e3e9d8]">{project.title}</p>
      <Row label="tag" value={project.tag} />
      <Row label="flow" value={project.tagline} />
      <Row label="stack" value={project.stack.join(" · ")} />
      <p className="px-1 pb-1 pt-2 text-[clamp(10px,1.25vw,13px)] leading-relaxed text-[#a9a396]">
        {project.summary}
      </p>
      <Link
        href={`/projects/${project.id}`}
        className="crt-row-label mt-1 inline-flex items-center gap-1.5 px-1 py-[3px] text-[clamp(10px,1.25vw,13px)] text-[#cfe0c0] underline decoration-dotted underline-offset-2 outline-none"
      >
        open /projects/{project.id}
        <span aria-hidden>&rsaquo;</span>
      </Link>
    </div>
  );
}

export function ProjectsWindow({ onCloseWindow }: { onCloseWindow: () => void }) {
  const [inside, setInside] = useState<BoardProject | null>(null);

  return (
    <CrtWindow
      title={inside ? `${PROJECTS_FOLDER.name} / ${inside.id}` : PROJECTS_FOLDER.name}
      icon={<FolderIcon open className="h-4 w-5" />}
      status={inside ? `${inside.tag.toLowerCase()} · read only` : `${boardProjects.length} item(s)`}
      onClose={onCloseWindow}
    >
      {inside ? (
        <div>
          <button
            type="button"
            onClick={() => setInside(null)}
            aria-label={`Up to ${PROJECTS_FOLDER.name}`}
            className="group flex w-full items-center gap-2 px-1 py-[3px] text-left outline-none"
          >
            <FolderIcon open className="h-4 w-5" />
            <span className="crt-row-label px-1 text-[clamp(10px,1.25vw,13px)]">..</span>
          </button>
          <Detail project={inside} />
        </div>
      ) : (
        <ul>
          {boardProjects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setInside(p)}
                aria-label={`Open ${p.title}`}
                className="group flex w-full items-center gap-2 px-1 py-[3px] text-left outline-none"
              >
                <FileIcon kind="prj" className="h-4 w-3.5" />
                <span className="crt-row-label truncate px-1 text-[clamp(10px,1.25vw,13px)]">
                  {p.id}.prj
                </span>
                <span className="ml-auto shrink-0 pr-1 text-[9px] uppercase tracking-[0.16em] text-[#9d9784]">
                  {p.tag}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </CrtWindow>
  );
}
