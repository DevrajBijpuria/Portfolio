"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { notebookSpreads, NB, type Spread } from "@/data/notebook-pages";
import { NotebookSpread } from "./NotebookSpread";
import { NotebookPage, type Imperfection } from "./NotebookPage";
import { PageTurn } from "./PageTurn";
import { SpreadSide } from "./pages";

type FlipOpts = {
  duration: number;
  ease: [number, number, number, number];
  onComplete?: () => void;
};
type LeafHandle = { set: (d: number) => void; get: () => number; to: (d: number, o: FlipOpts) => void };

const Leaf = forwardRef<
  LeafHandle,
  { front: React.ReactNode; back: React.ReactNode; zIndex: number; initial?: number }
>(function Leaf({ front, back, zIndex, initial = 0 }, ref) {
  // Start turned (-180) for leaves before the opening spread, so opening mid-book
  // matches the physical state and Prev/Next animate correctly from there.
  const rot = useMotionValue(initial);
  useImperativeHandle(
    ref,
    () => ({ set: (d) => rot.set(d), get: () => rot.get(), to: (d, o) => { animate(rot, d, o); } }),
    [rot]
  );
  return <PageTurn front={front} back={back} rotation={rot} zIndex={zIndex} />;
});

// Page number in reading order (cover-right = 1; then 2 per section).
function pageNo(s: number, side: "left" | "right"): number | undefined {
  if (s === 0) return side === "right" ? 1 : undefined;
  return side === "left" ? 2 * s : 2 * s + 1;
}

// Restrained imperfections on selected pages only.
function imperfectionsFor(id: string, side: "left" | "right"): Imperfection[] {
  if (id === "about" && side === "left") return ["corner"];
  if (id === "cdc" && side === "left") return ["crease"];
  if (id === "spotify" && side === "right") return ["stain"];
  return [];
}

function Side({ spread, s, side }: { spread: Spread; s: number; side: "left" | "right" }) {
  return (
    <NotebookPage
      spineSide={side === "left" ? "right" : "left"}
      pageNumber={pageNo(s, side)}
      imperfections={imperfectionsFor(spread.id, side)}
    >
      <SpreadSide spread={spread} side={side} />
    </NotebookPage>
  );
}

type MobileFlip = { dir: "next" | "prev"; fromIdx: number; toIdx: number } | null;

export function Notebook({
  initialSpread = 0,
  openOnEnter = false,
}: {
  initialSpread?: number;
  openOnEnter?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState(false);

  // When entering from the landing transition, don't appear already open: start
  // one spread back and play a single real page-turn into the target spread so
  // the book "opens" (reuses the existing turn engine — no second animation
  // system). Reduced motion skips this and shows the target directly.
  const enterOpen = openOnEnter && !reduced;
  const startSpread = enterOpen ? Math.max(0, initialSpread - 1) : initialSpread;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const spreads = notebookSpreads;
  const nSpreads = spreads.length;
  const nLeaves = nSpreads;

  // Flat page list for mobile (one side at a time; cover has no left).
  const mobilePages = useMemo(() => {
    const out: { spread: Spread; s: number; side: "left" | "right" }[] = [];
    spreads.forEach((sp, s) => {
      if (sp.kind !== "cover") out.push({ spread: sp, s, side: "left" });
      out.push({ spread: sp, s, side: "right" });
    });
    // cover: keep only its right (the cover face) at the front
    return out.filter((p) => !(p.spread.kind === "cover" && p.side === "left"));
  }, [spreads]);

  const [current, setCurrent] = useState(startSpread); // visible spread index
  const [flipIndex, setFlipIndex] = useState(-1);
  const [animating, setAnimating] = useState(false);
  const leafRefs = useRef<(LeafHandle | null)[]>([]);
  const bookRef = useRef<HTMLDivElement>(null);

  const [mobileIdx, setMobileIdx] = useState(0);
  const [mflip, setMflip] = useState<MobileFlip>(null);
  const mobileRot = useMotionValue(0);

  // Mobile: open straight to the requested spread's main page (desktop uses
  // `current` + each leaf's declarative initial rotation). Runs once on mount.
  useEffect(() => {
    if (initialSpread <= 0) return;
    const mi = mobilePages.findIndex(
      (p) => p.s === initialSpread && p.side === "right"
    );
    if (mi >= 0) setMobileIdx(mi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flipOpts = (d = 0.8): FlipOpts => ({ duration: reduced ? 0 : d, ease: [0.42, 0, 0.28, 1] });
  const unlock = () => {
    setAnimating(false);
    setFlipIndex(-1);
  };

  const dNext = () => {
    if (animating || current >= nSpreads - 1) return;
    setAnimating(true);
    setFlipIndex(current);
    leafRefs.current[current]?.to(-180, { ...flipOpts(), onComplete: () => { setCurrent((c) => c + 1); unlock(); } });
  };
  const dPrev = () => {
    if (animating || current <= 0) return;
    setAnimating(true);
    setFlipIndex(current - 1);
    leafRefs.current[current - 1]?.to(0, { ...flipOpts(), onComplete: () => { setCurrent((c) => c - 1); unlock(); } });
  };

  // Entrance "opening": once the book has risen, play the single reveal turn from
  // startSpread into the target spread (desktop only — mobile shows the target
  // page directly via mobileIdx). Timed to overlap the rise so there's no pause.
  const dNextRef = useRef(dNext);
  dNextRef.current = dNext;
  const currentRef = useRef(current);
  currentRef.current = current;
  useEffect(() => {
    if (!enterOpen || initialSpread <= startSpread) return;
    let fallback = 0;
    const t = window.setTimeout(() => {
      if (window.matchMedia("(max-width: 767px)").matches) return;
      dNextRef.current();
      // Safety net: if the reveal turn couldn't complete, snap to the target so
      // the correct spread is always shown.
      fallback = window.setTimeout(() => {
        if (currentRef.current === startSpread) {
          for (let k = startSpread; k < initialSpread; k++) leafRefs.current[k]?.set(-180);
          setCurrent(initialSpread);
          setAnimating(false);
          setFlipIndex(-1);
        }
      }, 1000);
    }, 560);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mNext = () => {
    if (animating || mobileIdx >= mobilePages.length - 1) return;
    setAnimating(true);
    setMflip({ dir: "next", fromIdx: mobileIdx, toIdx: mobileIdx + 1 });
  };
  const mPrev = () => {
    if (animating || mobileIdx <= 0) return;
    setAnimating(true);
    setMflip({ dir: "prev", fromIdx: mobileIdx, toIdx: mobileIdx - 1 });
  };
  useEffect(() => {
    if (!mflip) return;
    mobileRot.set(mflip.dir === "next" ? 0 : -180);
    const controls = animate(mobileRot, mflip.dir === "next" ? -180 : 0, {
      ...flipOpts(0.6),
      onComplete: () => { setMobileIdx(mflip.toIdx); setMflip(null); setAnimating(false); },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mflip]);

  const next = () => (isMobile ? mNext() : dNext());
  const prev = () => (isMobile ? mPrev() : dPrev());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // drag / swipe
  const dragRef = useRef<
    | { mobile: true; startX: number; startY: number }
    | { mobile: false; idx: number; dir: "next" | "prev"; startX: number; half: number }
    | null
  >(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (animating) return;
    const el = e.target as HTMLElement;
    if (el.closest("a,button,.react-flow")) return;
    const rect = bookRef.current!.getBoundingClientRect();
    if (isMobile) {
      dragRef.current = { mobile: true, startX: e.clientX, startY: e.clientY };
      return;
    }
    const x = e.clientX - rect.left;
    const half = rect.width / 2;
    if (x >= half && current < nSpreads - 1) {
      dragRef.current = { mobile: false, idx: current, dir: "next", startX: e.clientX, half };
      setFlipIndex(current);
    } else if (x < half && current > 0) {
      dragRef.current = { mobile: false, idx: current - 1, dir: "prev", startX: e.clientX, half };
      setFlipIndex(current - 1);
    } else return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.mobile) return;
    const frac = (e.clientX - d.startX) / d.half;
    const mv = leafRefs.current[d.idx];
    if (!mv) return;
    if (d.dir === "next") mv.set(Math.max(-180, Math.min(0, 180 * frac)));
    else mv.set(Math.min(0, Math.max(-180, -180 + 180 * frac)));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    if (d.mobile) {
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? mNext() : mPrev());
      return;
    }
    const mv = leafRefs.current[d.idx];
    if (!mv) return;
    const progressed = d.dir === "next" ? mv.get() < -90 : mv.get() > -90;
    setAnimating(true);
    if (progressed) {
      mv.to(d.dir === "next" ? -180 : 0, {
        ...flipOpts(0.4),
        onComplete: () => { setCurrent(d.dir === "next" ? d.idx + 1 : d.idx); unlock(); },
      });
    } else {
      mv.to(d.dir === "next" ? 0 : -180, { ...flipOpts(0.4), onComplete: unlock });
    }
  };

  const bookStyle = isMobile
    ? { width: "min(92vw, 420px)", aspectRatio: "3 / 4" }
    : { width: "min(80vw, 1120px)", aspectRatio: "3 / 2" };

  const baseIdx = mflip ? (mflip.dir === "next" ? mflip.toIdx : mflip.fromIdx) : mobileIdx;
  const frontIdx = mflip ? (mflip.dir === "next" ? mflip.fromIdx : mflip.toIdx) : mobileIdx;
  const mp = mobilePages;

  return (
    <div className="flex flex-col items-center">
      <div
        ref={bookRef}
        className="relative mx-auto touch-pan-y select-none"
        style={{ ...bookStyle, perspective: 1800 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="relative h-full w-full [transform-style:preserve-3d]"
          style={{ transform: isMobile ? undefined : "rotateX(1deg) rotateY(-0.5deg)" }}
        >
          <NotebookSpread single={isMobile} />

          {isMobile ? (
            <>
              <div className="absolute inset-0">
                <NotebookPage
                  pageNumber={pageNo(mp[baseIdx].s, mp[baseIdx].side)}
                  imperfections={imperfectionsFor(mp[baseIdx].spread.id, mp[baseIdx].side)}
                >
                  <SpreadSide spread={mp[baseIdx].spread} side={mp[baseIdx].side} />
                </NotebookPage>
              </div>
              {mflip && (
                <PageTurn
                  full
                  rotation={mobileRot}
                  zIndex={200}
                  front={
                    <NotebookPage
                      pageNumber={pageNo(mp[frontIdx].s, mp[frontIdx].side)}
                      imperfections={imperfectionsFor(mp[frontIdx].spread.id, mp[frontIdx].side)}
                    >
                      <SpreadSide spread={mp[frontIdx].spread} side={mp[frontIdx].side} />
                    </NotebookPage>
                  }
                  back={<div className="h-full w-full" style={{ background: NB.paper }} />}
                />
              )}
            </>
          ) : (
            <>
              {/* base left page (inside front cover), visible at the start */}
              <div className="absolute inset-y-0 left-0 w-1/2">
                <Side spread={spreads[0]} s={0} side="left" />
              </div>

              {spreads.map((sp, k) => {
                const turned = k < current;
                const z = k === flipIndex ? 200 : turned ? k : 100 - k;
                const backSpread = spreads[k + 1];
                return (
                  <Leaf
                    key={sp.id}
                    ref={(h) => { leafRefs.current[k] = h; }}
                    zIndex={z}
                    initial={k < startSpread ? -180 : 0}
                    front={<Side spread={sp} s={k} side="right" />}
                    back={
                      backSpread ? (
                        <Side spread={backSpread} s={k + 1} side="left" />
                      ) : (
                        <div className="h-full w-full" style={{ background: NB.paper }} />
                      )
                    }
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
