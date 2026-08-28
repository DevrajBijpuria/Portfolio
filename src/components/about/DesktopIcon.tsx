"use client";

import { forwardRef, type ReactNode } from "react";

// One desktop icon: art above a label. Folders and files are the same widget
// with different art, so they select and focus identically — a real desktop
// makes no distinction either.
//
// `highlighted` is the attract state the boot sequence puts on ABOUT.TXT; it
// renders the same selection the pointer would leave behind.
export const DesktopIcon = forwardRef<
  HTMLButtonElement,
  {
    label: string;
    title: string;
    icon: ReactNode;
    highlighted?: boolean;
    onOpen: () => void;
  }
>(function DesktopIcon({ label, title, icon, highlighted = false, onOpen }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-label={`Open ${title}`}
      data-highlighted={highlighted || undefined}
      className="crt-desktop-icon group flex w-full flex-col items-center gap-1 px-1 py-1 text-center outline-none"
    >
      {icon}
      {/* the label is the selectable part, as on a real desktop */}
      <span className="crt-desktop-icon__label break-all px-1 text-[clamp(8px,2cqw,10px)] leading-tight">
        {label}
      </span>
    </button>
  );
});
