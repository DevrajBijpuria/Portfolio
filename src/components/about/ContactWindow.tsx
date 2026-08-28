"use client";

import { siGithub, siGmail } from "simple-icons";
import { contactLinks, type ContactLink } from "@/data/desktop";
import { CrtWindow } from "./CrtWindow";
import { FileIcon } from "./desktop-icons";
import { logoColor } from "./skill-icons";

// CONTACT.TXT, opened. One line saying so, then a row per channel: the brand
// mark, what it is, and the address itself as the link.
//
// LinkedIn has no mark here for the same reason AWS has none in the skill rows —
// simple-icons does not carry it, its owner does not permit redistribution, and
// a lookalike drawn from memory would be worse than an honest neutral glyph.

function Mark({ mark }: { mark: ContactLink["mark"] }) {
  if (mark === "link") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" role="img" aria-label="Link">
        <path
          d="M10.6 13.4a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1.5 1.5M13.4 10.6a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.5-1.5"
          fill="none"
          stroke="#a8aef5"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  const logo = mark === "github" ? siGithub : siGmail;
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" role="img" aria-label={logo.title}>
      <path d={logo.path} fill={logoColor(logo.hex)} />
    </svg>
  );
}

export function ContactWindow({ onCloseWindow }: { onCloseWindow: () => void }) {
  return (
    <CrtWindow
      title="CONTACT.TXT"
      icon={<FileIcon kind="txt" className="h-4 w-3" />}
      status={`${contactLinks.length} channel(s)`}
      onClose={onCloseWindow}
    >
      <p className="px-1 pb-3 pt-1 text-[clamp(11px,1.4vw,14px)] text-[#e3e9d8]">
        You can contact me —
      </p>

      <ul>
        {contactLinks.map((c) => (
          <li key={c.id}>
            <a
              href={c.href}
              target={c.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={c.href.startsWith("mailto:") ? undefined : "noreferrer"}
              className="group flex w-full items-center gap-2 px-1 py-[4px] text-left outline-none"
            >
              <Mark mark={c.mark} />
              <span className="w-[62px] shrink-0 text-[9px] uppercase tracking-[0.16em] text-[#9d9784]">
                {c.label}
              </span>
              <span className="crt-row-label min-w-0 truncate px-1 text-[clamp(10px,1.25vw,13px)] underline decoration-dotted underline-offset-2">
                {c.value}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </CrtWindow>
  );
}
