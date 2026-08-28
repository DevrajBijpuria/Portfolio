"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { InView, Surface, Tag } from "./notebook";

// Project evidence: screenshots of the real thing, shown as a grid that opens
// full size in place. Shared by every case study — the images are unreadable at
// column width, and sending someone to a raw file loses the page.

export type Shot = { src: string; file: string; caption: string };

export function CodeShots({ shots, columns = 2 }: { shots: Shot[]; columns?: 1 | 2 }) {
  const reduced = useReducedMotion() ?? false;
  const [zoomed, setZoomed] = useState<Shot | null>(null);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  return (
    <>
      <div className={`grid gap-4 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
        {shots.map((shot, i) => (
          <InView key={shot.src} delay={i * 0.06}>
            <figure className="h-full">
              <button
                type="button"
                onClick={() => setZoomed(shot)}
                aria-label={`View ${shot.file} full size`}
                className="group/shot block w-full cursor-zoom-in text-left outline-none"
              >
                <Surface
                  grid={false}
                  className="overflow-hidden transition-colors group-hover/shot:border-primary/50 group-focus-visible/shot:border-primary/50"
                >
                  <div className="flex items-center justify-between border-b border-border/70 px-3 py-1.5">
                    <Tag>{shot.file}</Tag>
                    <Tag className="opacity-0 transition-opacity group-hover/shot:opacity-100 group-focus-visible/shot:opacity-100">
                      view
                    </Tag>
                  </div>
                  <Image
                    src={shot.src}
                    alt={`${shot.file} — ${shot.caption}`}
                    width={1280}
                    height={800}
                    className="h-auto w-full"
                    sizes={columns === 2 ? "(max-width: 768px) 100vw, 50vw" : "100vw"}
                  />
                </Surface>
              </button>
              <figcaption className="mt-2 text-xs leading-5 text-muted-foreground">
                {shot.caption}
              </figcaption>
            </figure>
          </InView>
        ))}
      </div>

      <AnimatePresence>
        {zoomed && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${zoomed.file}, full size`}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/85 p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.2 }}
            onClick={() => setZoomed(null)}
          >
            <motion.figure
              className="relative max-w-5xl"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: reduced ? 0.12 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <Tag>{zoomed.file}</Tag>
                <button
                  type="button"
                  onClick={() => setZoomed(null)}
                  aria-label="Close"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  <X className="size-3.5" />
                  esc
                </button>
              </div>
              <Image
                src={zoomed.src}
                alt={`${zoomed.file} — ${zoomed.caption}`}
                width={1920}
                height={1200}
                className="h-auto w-full rounded-md border border-border"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
              <figcaption className="mt-2 text-xs leading-5 text-muted-foreground">
                {zoomed.caption}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
