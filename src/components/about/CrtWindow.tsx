"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

// Shared window chrome: title bar, close box, sunken body, status strip. Every
// window on the desktop — folder listings, file viewers, About — is this shell
// with a different body, so they all belong to the same operating system.
export function CrtWindow({
  title,
  icon,
  status,
  wide = false,
  onClose,
  children,
}: {
  title: string;
  icon?: ReactNode;
  status?: string;
  wide?: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={`crt-window crt-raise${wide ? " crt-window--wide" : ""}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: reduced ? 0.14 : 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="crt-titlebar">
        {icon}
        <span className="flex-1 truncate text-[clamp(10px,1.15vw,12px)] font-bold">{title}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="crt-raise grid h-4 w-4 place-items-center bg-[#2a2c22] text-[10px] leading-none text-[#ece5d4] outline-none focus-visible:ring-1 focus-visible:ring-[#0c0d09]"
        >
          &times;
        </button>
      </div>

      {/* Keyed on the title so navigating inside a window — projects/ into a
          project, skill_stack/ into an area — redraws the pane rather than
          swapping its contents instantly. */}
      <div key={title} className="crt-window-body crt-sink">
        {children}
      </div>

      {status && (
        <div className="crt-sink shrink-0 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-[#9d9784]">
          {status}
        </div>
      )}
    </motion.div>
  );
}
