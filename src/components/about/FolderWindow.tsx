"use client";

import { useState } from "react";
import { STACK_FOLDER } from "@/data/desktop";
import { skillFolders, type SkillFolder } from "@/data/skills";
import { CrtWindow } from "./CrtWindow";
import { FileIcon, FolderIcon } from "./desktop-icons";
import { logoColor, skillLogos } from "./skill-icons";

// skill_stack/ browsed in place: the window opens on the six area folders and
// descends into one when you pick it, with a `..` row back up — one window that
// navigates, the way a file manager of this vintage worked, rather than a second
// window stacking on the desk.

// A skill row shows its real brand mark where one exists and is redistributable,
// and the generic file icon otherwise — see skill-icons.ts for what is missing
// and why. Brand marks keep their own colour, lifted to stay legible on the tube.
function SkillIcon({ name }: { name: string }) {
  const logo = skillLogos[name];
  if (!logo) return <FileIcon />;
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" role="img" aria-label={logo.title}>
      <path d={logo.path} fill={logoColor(logo.hex)} />
    </svg>
  );
}

export function FolderWindow({ onCloseWindow }: { onCloseWindow: () => void }) {
  const [inside, setInside] = useState<SkillFolder | null>(null);

  return (
    <CrtWindow
      title={inside ? `${STACK_FOLDER.name} / ${inside.name}` : STACK_FOLDER.name}
      icon={<FolderIcon open className="h-4 w-5" />}
      status={
        inside ? `${inside.items.length} item(s)` : `${skillFolders.length} folder(s)`
      }
      onClose={onCloseWindow}
    >
      {inside ? (
        <ul>
          <li>
            <button
              type="button"
              onClick={() => setInside(null)}
              aria-label={`Up to ${STACK_FOLDER.name}`}
              className="group flex w-full items-center gap-2 px-1 py-[3px] text-left outline-none"
            >
              <FolderIcon open className="h-4 w-5" />
              <span className="crt-row-label px-1 text-[clamp(10px,1.25vw,13px)]">..</span>
            </button>
          </li>
          {inside.items.map((skill) => (
            <li key={skill}>
              {/* selection highlight on hover, the way a listing row does it */}
              <span className="group flex cursor-default items-center gap-2 px-1 py-[3px]">
                <SkillIcon name={skill} />
                <span className="crt-row-label px-1 text-[clamp(10px,1.25vw,13px)]">{skill}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          {skillFolders.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => setInside(f)}
                aria-label={`Open ${f.name}`}
                className="group flex w-full items-center gap-2 px-1 py-[3px] text-left outline-none"
              >
                <FolderIcon className="h-4 w-5" />
                <span className="crt-row-label px-1 text-[clamp(10px,1.25vw,13px)]">
                  {f.label}
                </span>
                <span className="ml-auto shrink-0 pr-1 text-[9px] uppercase tracking-[0.16em] text-[#9d9784]">
                  {f.items.length} items
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </CrtWindow>
  );
}
