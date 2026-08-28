"use client";

import type { CSSProperties, ReactNode } from "react";

// What is lying on the desk around the monitor. Line drawings only — no fills,
// no assets — at the same hairline weight and stone colour the rest of the
// portfolio draws technical marks in.
//
// Two rules govern the placement, and both matter more than the drawings:
//
//   1. Everything hugs an edge. The middle band is left empty so the tube stays
//      the only thing competing for attention there.
//   2. Most pieces run off the edge of the screen rather than sitting neatly
//      inside it. A note fully in frame reads as decoration placed for you; one
//      cropped by the edge reads as something that was already on the desk.
//
// Inert and hidden from assistive tech: this is atmosphere, and the click that
// lands here belongs to the overlay underneath, which closes the machine.

const STROKE = "rgba(184,177,165,0.55)";

function Prop({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`crt-prop ${className}`} style={style}>
      {children}
    </div>
  );
}

// A torn-off sheet with a sketch and a couple of ruled lines of "writing".
function NotePage() {
  return (
    <svg viewBox="0 0 120 150" fill="none" stroke={STROKE} strokeWidth="1">
      <path d="M6 4h100l10 10v132H6z" />
      <path d="M106 4v10h10" />
      {/* a small flow sketch */}
      <rect x="20" y="26" width="30" height="16" />
      <rect x="70" y="26" width="30" height="16" />
      <path d="M50 34h20M64 30l6 4-6 4" />
      <rect x="45" y="60" width="30" height="16" />
      <path d="M35 42v18h10M85 42v18H75" />
      {/* handwriting, as rules */}
      <path d="M20 96h80M20 106h80M20 116h54" strokeOpacity="0.5" />
    </svg>
  );
}

// A fragment of a larger schematic, cropped by the edge of the screen.
function Schematic() {
  return (
    <svg viewBox="0 0 180 120" fill="none" stroke={STROKE} strokeWidth="1">
      <path d="M0 20h44M0 58h30M0 96h60" />
      <rect x="44" y="8" width="34" height="24" />
      <rect x="30" y="46" width="34" height="24" />
      <path d="M78 20h26v38H64M64 96h40V70" />
      <circle cx="104" cy="20" r="4" />
      <circle cx="104" cy="96" r="4" />
      <path d="M108 20h48M108 96h34" />
      {/* ground symbol */}
      <path d="M142 96v10M136 106h12M138 110h8M140 114h4" />
      <path d="M156 12v16M150 20h12" strokeOpacity="0.6" />
    </svg>
  );
}

// A dimension line with ticks — the measurement of something off-screen.
function Measure() {
  return (
    <svg viewBox="0 0 200 46" fill="none" stroke={STROKE} strokeWidth="1">
      <path d="M4 30h192M4 22v16M196 22v16" />
      <path d="M10 30l8-4M10 30l8 4M190 30l-8-4M190 30l-8 4" />
      <path d="M60 24v12M120 24v12" strokeOpacity="0.5" />
      <text x="86" y="14" fill={STROKE} stroke="none" fontSize="11" fontFamily="monospace">
        140.0
      </text>
    </svg>
  );
}

// A pencil, lying at an angle.
function Pencil() {
  return (
    <svg viewBox="0 0 160 22" fill="none" stroke={STROKE} strokeWidth="1">
      <path d="M28 5h116v12H28z" />
      <path d="M28 5L10 11l18 6" />
      <path d="M16 8.5l0 5" strokeOpacity="0.7" />
      <path d="M144 5h12v12h-12z" />
      <path d="M40 5v12M52 5v12" strokeOpacity="0.4" />
    </svg>
  );
}

// A USB stick, cap off.
function UsbStick() {
  return (
    <svg viewBox="0 0 110 40" fill="none" stroke={STROKE} strokeWidth="1">
      <rect x="34" y="8" width="60" height="24" rx="3" />
      <rect x="14" y="13" width="20" height="14" />
      <path d="M18 17h12M18 23h12" strokeOpacity="0.55" />
      <circle cx="84" cy="20" r="3" strokeOpacity="0.7" />
      <path d="M44 14h26M44 26h26" strokeOpacity="0.35" />
    </svg>
  );
}

// Loose components — a chip, a resistor, a couple of pin headers.
function Components() {
  return (
    <svg viewBox="0 0 150 70" fill="none" stroke={STROKE} strokeWidth="1">
      <rect x="10" y="14" width="42" height="30" />
      <path d="M10 20h-6M10 28h-6M10 36h-6M52 20h6M52 28h6M52 36h6" />
      <path d="M16 20h6" strokeOpacity="0.7" />
      {/* resistor */}
      <path d="M74 30h10M110 30h10" />
      <rect x="84" y="24" width="26" height="12" rx="2" />
      <path d="M90 24v12M96 24v12M102 24v12" strokeOpacity="0.45" />
      {/* pin header */}
      <rect x="20" y="54" width="44" height="8" />
      <path d="M26 54v8M34 54v8M42 54v8M50 54v8M58 54v8" strokeOpacity="0.5" />
    </svg>
  );
}

// A cable running off the edge, with a connector at the near end.
function Cable() {
  return (
    <svg viewBox="0 0 220 140" fill="none" stroke={STROKE} strokeWidth="1">
      <path d="M216 6c-70 0-52 62-96 76S30 96 18 118c-8 15-6 20-6 22" />
      <rect x="2" y="120" width="20" height="18" rx="2" />
      <path d="M7 124v10M12 124v10M17 124v10" strokeOpacity="0.5" />
      <path d="M120 82c8 6 8 10 6 16" strokeOpacity="0.35" />
    </svg>
  );
}

// A corner tick with a coordinate, the way a drawing sheet is registered.
function Registration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 90 40" fill="none" stroke={STROKE} strokeWidth="1">
      <path d="M2 2v14M2 2h14" />
      <text x="22" y="14" fill={STROKE} stroke="none" fontSize="10" fontFamily="monospace">
        {label}
      </text>
      <path d="M2 26h60" strokeOpacity="0.4" />
    </svg>
  );
}

export function CrtDesk({ shown }: { shown: boolean }) {
  return (
    <div className="crt-desk" data-shown={shown} aria-hidden="true">
      {/* --- left edge --- */}
      <Prop className="crt-prop--schematic" style={{ left: "-3%", top: "12%", width: "clamp(150px, 15vw, 230px)" }}>
        <Schematic />
      </Prop>
      <Prop className="crt-prop--pencil" style={{ left: "3%", top: "58%", width: "clamp(110px, 11vw, 170px)", transform: "rotate(-24deg)" }}>
        <Pencil />
      </Prop>
      <Prop className="crt-prop--note" style={{ left: "1.5%", bottom: "-8%", width: "clamp(80px, 8vw, 118px)", transform: "rotate(6deg)" }}>
        <NotePage />
      </Prop>

      {/* --- right edge --- */}
      <Prop className="crt-prop--measure" style={{ right: "-2%", top: "16%", width: "clamp(140px, 14vw, 210px)" }}>
        <Measure />
      </Prop>
      <Prop className="crt-prop--usb" style={{ right: "5%", top: "48%", width: "clamp(74px, 7.5vw, 112px)", transform: "rotate(14deg)" }}>
        <UsbStick />
      </Prop>
      <Prop className="crt-prop--cable" style={{ right: "-4%", bottom: "-6%", width: "clamp(130px, 14vw, 215px)" }}>
        <Cable />
      </Prop>

      {/* --- lower corners --- */}
      <Prop className="crt-prop--components" style={{ left: "8%", top: "34%", width: "clamp(96px, 9.5vw, 145px)", transform: "rotate(-8deg)" }}>
        <Components />
      </Prop>
      <Prop className="crt-prop--reg" style={{ left: "2%", top: "4%", width: "clamp(70px, 7vw, 90px)" }}>
        <Registration label="A-01" />
      </Prop>
      <Prop className="crt-prop--reg" style={{ right: "3%", bottom: "6%", width: "clamp(70px, 7vw, 90px)" }}>
        <Registration label="REV 3" />
      </Prop>
    </div>
  );
}
