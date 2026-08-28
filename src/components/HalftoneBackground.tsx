"use client";

import { useEffect, useRef } from "react";

// Monochrome halftone print with extremely subtle motion.
//
// The field is the "Halftone Flow" warp: the sample point is rotated and pushed
// through three turbulence passes, which folds the plane into large flowing
// ribbons (rather than the regular lattice a plain sum of sines gives). Each cell
// of a fixed dot grid then draws a circle whose radius + lightness track that
// field, so bright bands read as dense near-white dots and dark areas fall to
// pure black — a printed halftone rather than a particle field.
//
// Canvas 2D only — no WebGL / Three.js / GSAP / GLSL.
//
// Performance: the warp costs 7 trig calls per sample, so it is evaluated on a
// coarse lattice (every FIELD_STEP dots) and bilinearly interpolated onto the
// full dot grid — ~4x less math for a field this smooth, with no visible
// difference. The per-frame rotation is computed once, nothing is allocated per
// frame, dots are batched by tone so each grey is a single fill(), and the loop
// is capped well below 60fps because the motion is far too slow to need it.
//
// TUNING:
//  - forms too small   -> lower FLOW_FREQ / SHAPE_X / SHAPE_Y (lower freq = bigger)
//  - too smooth/grey   -> raise GAMMA (more halftone contrast)
//  - too bright        -> lower MAX_R, or pass a lower `opacity`
//  - too static/fast   -> the `speed` prop (units/sec). At 0.45 roughly 69% of
//    dots change tone each second, so the field visibly flows; it is never static.

type Props = {
  opacity?: number;
  speed?: number;
  className?: string;
};

const SPACING = 6; // px between dots (~31% fewer dots than 5px, same look)
const MIN_R = 0.15; // px
const MAX_R = 2; // px
const THRESHOLD = 0.14; // below this the cell is pure black
const GAMMA = 1.8; // halftone contrast curve
const LEVELS = 6; // tone buckets (batched fills)
const TAU = Math.PI * 2;
const PASSES = 3; // turbulence passes — what turns the plane into ribbons
const FLOW_FREQ = 0.62; // spatial scale of the warp; lower = larger forms
const WARP = 0.5; // how far each pass pushes the sample point
const SHAPE_X = 2.0; // final band frequency
const SHAPE_Y = 3.0;
const FIELD_STEP = 2; // evaluate the warp every Nth dot, interpolate between
const MIN_DT = 0.042; // ~24fps cap — the drift is slow, and every repaint costs
                      // the compositor a full re-blend of whatever sits above

export function HalftoneBackground({ opacity = 1, speed = 0.45, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(speed);

  // Keep the live speed available to the animation loop without restarting it.
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return undefined;

    // grey palette #BDBDBD..#FFFFFF, one tone per bucket
    const grey: string[] = [];
    for (let b = 0; b < LEVELS; b++) {
      const g = Math.round(189 + ((b + 0.5) / LEVELS) * (255 - 189));
      grey.push(`rgb(${g}, ${g}, ${g})`);
    }

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    // coarse field lattice (rebuilt only on resize)
    let fCols = 0;
    let fRows = 0;
    let coarseX = new Float32Array(0); // aspect-corrected, pre-scaled sample point
    let coarseY = new Float32Array(0);
    let field = new Float32Array(0);
    // tone-bucket scratch buffers (reused every frame — no per-frame alloc)
    let bx: Float32Array[] = [];
    let by: Float32Array[] = [];
    let br: Float32Array[] = [];
    let bn = new Uint32Array(LEVELS);
    let vignette: CanvasGradient | null = null;
    let time = 0;

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / SPACING) + 1;
      rows = Math.ceil(height / SPACING) + 1;
      fCols = Math.ceil(cols / FIELD_STEP) + 1;
      fRows = Math.ceil(rows / FIELD_STEP) + 1;

      coarseX = new Float32Array(fCols);
      coarseY = new Float32Array(fRows);
      field = new Float32Array(fCols * fRows);
      const aspect = width / height;
      for (let gc = 0; gc < fCols; gc++) {
        const x = gc * FIELD_STEP * SPACING;
        coarseX[gc] = ((x / width) * 2 - 1) * aspect * FLOW_FREQ;
      }
      for (let gr = 0; gr < fRows; gr++) {
        const y = gr * FIELD_STEP * SPACING;
        coarseY[gr] = ((y / height) * 2 - 1) * FLOW_FREQ;
      }

      const cap = cols * rows;
      bx = [];
      by = [];
      br = [];
      for (let b = 0; b < LEVELS; b++) {
        bx.push(new Float32Array(cap));
        by.push(new Float32Array(cap));
        br.push(new Float32Array(cap));
      }
      bn = new Uint32Array(LEVELS);

      const cx = width / 2;
      const cy = height / 2;
      const rad = Math.hypot(cx, cy);
      vignette = ctx.createRadialGradient(cx, cy, rad * 0.55, cx, cy, rad);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.55)");
    };

    const draw = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
      bn.fill(0);

      // 1. the warp, on the coarse lattice. The rotation depends only on time,
      //    so its sin/cos are computed once rather than per sample.
      const a = time * 0.1;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const tBack = time * 0.8;
      for (let gr = 0; gr < fRows; gr++) {
        const y0 = coarseY[gr];
        const rowOff = gr * fCols;
        for (let gc = 0; gc < fCols; gc++) {
          let fx = coarseX[gc];
          let fy = y0;
          // rotate, push x by a sine of y, push y by a cosine of the new x —
          // three passes fold the plane into large flowing ribbons
          for (let p = 1; p <= PASSES; p++) {
            const rx = fx * ca - fy * sa;
            const ry = fx * sa + fy * ca;
            fx = rx + Math.sin(ry * 2 * p + time) * WARP;
            fy = ry + Math.cos(fx * 1.5 * p - tBack) * WARP;
          }
          field[rowOff + gc] = Math.sin(fx * SHAPE_X + fy * SHAPE_Y) * 0.5 + 0.5;
        }
      }

      // 2. every dot samples that field bilinearly, then becomes a sized,
      //    toned circle — or pure black below the threshold.
      const invThr = 1 / (1 - THRESHOLD);
      const invStep = 1 / FIELD_STEP;
      for (let r = 0; r < rows; r++) {
        const gyf = r * invStep;
        const gy = gyf | 0;
        const ty = gyf - gy;
        const rowA = gy * fCols;
        const rowB = rowA + fCols;
        const y = r * SPACING;
        for (let c = 0; c < cols; c++) {
          const gxf = c * invStep;
          const gx = gxf | 0;
          const tx = gxf - gx;
          const f00 = field[rowA + gx];
          const f10 = field[rowA + gx + 1];
          const f01 = field[rowB + gx];
          const f11 = field[rowB + gx + 1];
          const top = f00 + (f10 - f00) * tx;
          const bot = f01 + (f11 - f01) * tx;
          const norm = top + (bot - top) * ty;
          const intensity = norm <= 0 ? 0 : Math.pow(norm, GAMMA);
          if (intensity < THRESHOLD) continue;
          let b = ((intensity - THRESHOLD) * invThr * LEVELS) | 0;
          if (b < 0) b = 0;
          else if (b >= LEVELS) b = LEVELS - 1;
          const idx = bn[b]++;
          bx[b][idx] = c * SPACING;
          by[b][idx] = y;
          br[b][idx] = MIN_R + intensity * MAX_R;
        }
      }

      // 3. one path per tone
      for (let b = 0; b < LEVELS; b++) {
        const n = bn[b];
        if (!n) continue;
        ctx.fillStyle = grey[b];
        ctx.beginPath();
        const X = bx[b];
        const Y = by[b];
        const R = br[b];
        for (let j = 0; j < n; j++) {
          ctx.moveTo(X[j] + R[j], Y[j]);
          ctx.arc(X[j], Y[j], R[j], 0, TAU);
        }
        ctx.fill();
      }

      if (vignette) {
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
      }
    };

    let frame = 0;
    let visible = true;
    let last = 0;
    const tick = (now: number) => {
      // frame-rate independent clock, capped so the CPU is not burned redrawing
      // a field that moves this slowly
      const dt = last ? Math.min(0.25, (now - last) / 1000) : 0;
      if (!last || dt >= MIN_DT) {
        last = now;
        time += dt * speedRef.current;
        draw();
      }
      frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (!frame && visible && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    rebuild();
    draw();
    const resizeObserver = new ResizeObserver(() => {
      rebuild();
      draw();
    });
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
      else stop();
    });
    intersection.observe(canvas);
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}

export default HalftoneBackground;
