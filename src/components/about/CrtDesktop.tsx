"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  dataFiles,
  docFiles,
  PROJECTS_FOLDER,
  STACK_FOLDER,
  type DesktopFile,
} from "@/data/desktop";
import type { CrtVariant } from "./CrtAbout";
import { AboutWindow } from "./AboutWindow";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopStatusBar } from "./DesktopStatusBar";
import { ContactWindow } from "./ContactWindow";
import { FileWindow } from "./FileWindow";
import { FolderWindow } from "./FolderWindow";
import { ProjectsWindow } from "./ProjectsWindow";
import { SystemStatus } from "./SystemStatus";
import { FileIcon, FolderIcon, PointerIcon } from "./desktop-icons";

// Devraj's workstation. Folders and files down the left, a readout top-right,
// and a lot of deliberate empty desk in between — the black is doing as much
// work here as the objects are.
//
// Boot runs once, in stages, then stops: icons land, the chrome fades up, and a
// pointer walks over to select whatever the machine was opened for — ABOUT.TXT
// from the name line, skill_stack from SKILL SETS. Nothing loops afterwards
// except the caret and the uptime clock.
type Stage = "icons" | "chrome" | "pointer" | "ready";

const STAGE_NEXT: Partial<Record<Stage, [Stage, number]>> = {
  icons: ["chrome", 450],
  chrome: ["pointer", 480],
  pointer: ["ready", 900],
};

type OpenWindow =
  | { kind: "stack" }
  | { kind: "projects" }
  | { kind: "contact" }
  | { kind: "file"; file: DesktopFile };

export function CrtDesktop({ intent, onClose }: { intent: CrtVariant; onClose: () => void }) {
  const reduced = useReducedMotion() ?? false;
  // CONTACT comes in with its window already open — the line asked for an
  // address, not a desktop to hunt through.
  const [win, setWin] = useState<OpenWindow | null>(
    intent === "contact" ? { kind: "contact" } : null
  );
  const [stage, setStage] = useState<Stage>(reduced ? "ready" : "icons");
  const [bootedAt] = useState(() => Date.now());

  const deskRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLButtonElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  // Each entry points the cursor at the thing it was opened for.
  const attractStack = intent === "skills";
  const attractId = intent === "contact" ? "contact" : "about";

  useEffect(() => {
    const step = STAGE_NEXT[stage];
    if (!step) return;
    const [next, ms] = step;
    const t = setTimeout(() => setStage(next), reduced ? 0 : ms);
    return () => clearTimeout(t);
  }, [stage, reduced]);

  // Walk the pointer to the attract target. Written straight to the DOM rather
  // than held in state: the element is already parked at its CSS start position,
  // so setting a transform is what actually starts its CSS transition.
  useEffect(() => {
    if (stage !== "pointer") return;
    const desk = deskRef.current;
    const about = targetRef.current;
    const ptr = pointerRef.current;
    if (!desk || !about || !ptr) return;

    const d = desk.getBoundingClientRect();
    const a = about.getBoundingClientRect();
    const p = ptr.getBoundingClientRect();
    const dx = a.left - d.left + a.width * 0.5 - (p.left - d.left);
    const dy = a.top - d.top + a.height * 0.42 - (p.top - d.top);
    ptr.style.transform = `translate(${Math.round(dx)}px, ${Math.round(dy)}px)`;
  }, [stage]);

  // While the desktop is up it owns Escape outright — CrtAbout stands its own
  // handler down for exactly this phase, so there is never a race between two
  // listeners. Escape closes the top window first and only powers off once the
  // desk is clear.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (win) setWin(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [win, onClose]);

  const openFile = (file: DesktopFile) =>
    setWin(file.id === "contact" ? { kind: "contact" } : { kind: "file", file });
  const closeWindow = () => setWin(null);

  const group = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.08 } },
  };
  const column = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.05 } },
  };
  const icon = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 6 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.15 : 0.28, ease: [0.22, 1, 0.36, 1] as const },
    },
  };
  const taskLabel =
    win?.kind === "stack"
      ? STACK_FOLDER.label
      : win?.kind === "projects"
        ? PROJECTS_FOLDER.label
        : win?.kind === "contact"
          ? "CONTACT.TXT"
          : win?.kind === "file"
            ? win.file.name
            : undefined;
  const taskIcon =
    win?.kind === "stack" || win?.kind === "projects" ? (
      <FolderIcon open className="h-3 w-4" />
    ) : win?.kind === "contact" ? (
      <FileIcon kind="txt" className="h-3 w-2.5" />
    ) : win?.kind === "file" ? (
      <FileIcon kind={win.file.kind} className="h-3 w-2.5" />
    ) : undefined;

  return (
    <div className="flex h-full flex-col font-mono">
      <h2 className="sr-only">Devraj Bijpuria — workstation desktop</h2>

      <div ref={deskRef} className="crt-desktop">
        <motion.div variants={group} initial="hidden" animate="show" className="crt-icon-field">
          <motion.ul variants={column} className="crt-icons">
            <motion.li variants={icon}>
              <DesktopIcon
                ref={attractStack ? targetRef : undefined}
                label={STACK_FOLDER.label}
                title={STACK_FOLDER.name}
                icon={<FolderIcon />}
                highlighted={attractStack && stage === "ready" && !win}
                onOpen={() => setWin({ kind: "stack" })}
              />
            </motion.li>
            <motion.li variants={icon}>
              <DesktopIcon
                label={PROJECTS_FOLDER.label}
                title={PROJECTS_FOLDER.name}
                icon={<FolderIcon />}
                onOpen={() => setWin({ kind: "projects" })}
              />
            </motion.li>
            {docFiles.map((f) => (
              <motion.li key={f.id} variants={icon}>
                <DesktopIcon
                  ref={!attractStack && f.id === attractId ? targetRef : undefined}
                  label={f.name}
                  title={f.name}
                  icon={<FileIcon kind={f.kind} className="h-7 w-6" />}
                  highlighted={!attractStack && stage === "ready" && !win && f.id === attractId}
                  onOpen={() => openFile(f)}
                />
              </motion.li>
            ))}
          </motion.ul>

          <motion.ul variants={column} className="crt-icons crt-icons--data">
            {dataFiles.map((f) => (
              <motion.li key={f.id} variants={icon}>
                <DesktopIcon
                  label={f.name}
                  title={f.name}
                  icon={<FileIcon kind={f.kind} className="h-7 w-6" />}
                  onOpen={() => openFile(f)}
                />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* The readout arrives after the icons have landed. It fades in with a
            one-shot CSS animation rather than a Motion wrapper — it is
            absolutely positioned, and a wrapper would only be there to hold an
            opacity. */}
        {stage !== "icons" && <SystemStatus bootedAt={bootedAt} />}

        {!reduced && stage !== "icons" && (
          <div ref={pointerRef} className="crt-pointer" data-visible={stage !== "chrome"}>
            <PointerIcon />
          </div>
        )}

        {win?.kind === "stack" && <FolderWindow onCloseWindow={closeWindow} />}
        {win?.kind === "projects" && <ProjectsWindow onCloseWindow={closeWindow} />}
        {win?.kind === "contact" && <ContactWindow onCloseWindow={closeWindow} />}
        {win?.kind === "file" && win.file.id === "about" && (
          <AboutWindow onCloseWindow={closeWindow} />
        )}
        {win?.kind === "file" && win.file.id !== "about" && (
          <FileWindow file={win.file} onCloseWindow={closeWindow} />
        )}
      </div>

      <DesktopStatusBar
        taskLabel={taskLabel}
        taskIcon={taskIcon}
        itemCount={2 + docFiles.length + dataFiles.length}
        onTask={closeWindow}
        onShutDown={onClose}
      />
    </div>
  );
}
