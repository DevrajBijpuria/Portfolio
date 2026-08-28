"use client";

import { CrtScreen } from "./CrtScreen";
import type { CrtPhase, CrtVariant } from "./CrtAbout";

// The physical object: matte casing, recessed bezel, vented chin with a power
// lamp, stand and contact shadow. All gradients and box-shadows — no assets, no
// filters. The tilt lives here (desktop only) so Motion keeps sole ownership of
// the shell's own transform on the parent.
export function CrtShell({
  phase,
  reduced,
  variant,
  onClose,
}: {
  phase: CrtPhase;
  reduced: boolean;
  variant: CrtVariant;
  onClose: () => void;
}) {
  const lit = phase === "active";

  return (
    <div className="crt-tilt" data-lit={lit}>
      {/* Ambient bounce: the light the lit tube throws back into the room,
          behind the object. Sits under everything and only exists once the tube
          is on. */}
      <div className="crt-ambient" aria-hidden="true" />

      <div className="crt-case" data-lit={lit}>
        <div className="crt-bezel" data-lit={lit}>
          <CrtScreen phase={phase} reduced={reduced} variant={variant} onClose={onClose} />
        </div>

        <div className="crt-chin">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6d675b]"
            aria-hidden="true"
          >
            DVJ&nbsp;·&nbsp;MODEL&nbsp;01
          </span>
          <span className="crt-vents" aria-hidden="true" />
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8b8574] outline-none transition-colors hover:text-[#ece5d4] focus-visible:ring-2 focus-visible:ring-[#A8AEF5]/70"
          >
            <span className="crt-led" data-on={lit} aria-hidden="true" />
            power
          </button>
        </div>
      </div>

      <div className="crt-stand" aria-hidden="true" />
      <div className="crt-foot" aria-hidden="true" />
      <div className="crt-shadow" aria-hidden="true" />
    </div>
  );
}
