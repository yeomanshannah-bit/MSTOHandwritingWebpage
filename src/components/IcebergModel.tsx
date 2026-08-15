"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  foundations,
  whatWeSee,
  closingLine,
  type Foundation,
} from "@/lib/icebergContent";

/*
  The "Making Sense of Handwriting Iceberg": handwriting is the visible tip;
  the submerged mass is the eight foundations beneath it. Content comes from
  lib/icebergContent.ts (ported from the PowerPoint). Each foundation is a
  button — click it to open its "learn more" panel.

  A Client Component because clicking a label opens a popup (needs state).
  The waterline sits at 38% down, matching the berg SVG's y=190 of 500.
*/

// Where each foundation sits, as % of the picture. `onIce` labels sit on the
// submerged iceberg; the others float in the surrounding water.
const layout: Record<string, { top: number; left: number; onIce: boolean }> = {
  "postural-control": { top: 44.5, left: 50, onIce: true },
  "bilateral-coordination": { top: 52, left: 26, onIce: false },
  "fine-motor-control": { top: 52, left: 71, onIce: true },
  "sensory-regulation": { top: 60, left: 48, onIce: true },
  "visual-perception": { top: 68, left: 24, onIce: false },
  "visual-motor-integration": { top: 68, left: 71, onIce: true },
  "attention-executive-function": { top: 77, left: 46, onIce: true },
  "language-letter-knowledge": { top: 86, left: 50, onIce: true },
};

function Cloud({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 100 44" className={className} aria-hidden>
      <g fill="white">
        <circle cx="30" cy="28" r="15" />
        <circle cx="52" cy="20" r="20" />
        <circle cx="74" cy="28" r="15" />
        <rect x="30" y="26" width="44" height="16" rx="8" />
      </g>
    </svg>
  );
}

/*
  `intro` and `cta` let the /iceberg page embed just the picture. That page
  already carries its own title and closing call to action, so repeating the
  component's heading and CTA there would say everything twice. The home page
  passes neither prop and keeps the full block.
*/
export default function IcebergModel({
  intro = true,
  cta = true,
}: {
  intro?: boolean;
  cta?: boolean;
} = {}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open: Foundation | undefined = foundations.find((f) => f.id === openId);
  const openPos = open ? layout[open.id] : undefined;
  // Bubbles in the lower half open upwards so they stay inside the picture.
  const above = openPos ? openPos.top > 55 : false;

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  // `id` so other pages can deep-link straight to the iceberg via /#iceberg.
  // `scroll-mt-24` keeps the heading clear of the sticky site header when the
  // browser jumps here.
  return (
    <section id="iceberg" className="mt-24 scroll-mt-24">
      {intro && (
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-msot-navy">
            Handwriting is the Tip of the Iceberg
          </h2>
          <p className="mt-3 text-lg leading-8 text-foreground/70">
            On the surface we see poor handwriting. Beneath the surface are
            eight foundations that impact a child&apos;s handwriting. Tap any
            foundation to learn more.
          </p>
        </div>
      )}

      {/* The iceberg picture. The outer box does NOT clip, so speech bubbles
          can sit above the artwork; the inner box clips the scenery. */}
      <div className="relative mx-auto mt-10 h-[700px] max-w-xl sm:h-[880px]">
        <div className="absolute inset-0 overflow-hidden rounded-3xl border border-black/[.06]">
        {/* sky + water */}
        <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-sky-100 to-cyan-50" />
        <div className="absolute inset-x-0 bottom-0 top-[38%] bg-gradient-to-b from-msot-cyan/40 via-msot-blue/50 to-msot-navy/90" />

        {/* clouds */}
        <Cloud className="absolute left-[4%] top-[4%] w-16 opacity-80" />
        <Cloud className="absolute right-[5%] top-[8%] w-12 opacity-70" />

        {/* light rays in the water */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[22%] top-[38%] h-[62%] w-10 -rotate-[18deg] bg-gradient-to-b from-white/15 to-transparent" />
          <div className="absolute left-[46%] top-[38%] h-[62%] w-16 -rotate-[14deg] bg-gradient-to-b from-white/12 to-transparent" />
          <div className="absolute left-[70%] top-[38%] h-[58%] w-8 -rotate-[20deg] bg-gradient-to-b from-white/10 to-transparent" />
        </div>

        {/* wavy waterline */}
        <svg
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-[38%] h-6 -translate-y-1/2"
          aria-hidden
        >
          <path
            d={wavePath(1200, 40, 16)}
            fill="none"
            stroke="white"
            strokeOpacity="0.8"
            strokeWidth="4"
          />
        </svg>

        {/* faceted iceberg — waterline at y=190 of 500 */}
        <svg
          viewBox="0 0 400 500"
          preserveAspectRatio="xMidYMid meet"
          className="absolute left-1/2 top-0 h-full -translate-x-1/2"
          aria-hidden
        >
          {/* submerged body — a few overlapping facets for a low-poly look */}
          <path
            d="M105,190 L295,190 L300,281 L262,362 L286,430 L228,482 L170,480 L120,421 L98,326 L126,248 Z"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            d="M105,190 L126,248 L98,326 L120,421 L170,480 L176,373 L150,288 Z"
            fill="white"
            fillOpacity="0.42"
          />
          <path
            d="M170,480 L176,373 L214,342 L228,482 Z"
            fill="white"
            fillOpacity="0.62"
          />
          <path
            d="M295,190 L300,281 L262,362 L286,430 L228,482 L214,342 L244,268 Z"
            fill="white"
            fillOpacity="0.4"
          />
          {/* above-water peak — kept wide so the "what we see" list sits over it */}
          <path d="M105,190 L152,124 L178,152 L216,108 L295,190 Z" fill="#f8fcff" />
          <path d="M152,124 L178,152 L170,190 L130,190 Z" fill="#e3f1fd" />
          <path d="M216,108 L295,190 L258,190 L240,146 Z" fill="#eef7ff" />
        </svg>

        {/* WHAT WE SEE — heading sits high in the sky; the list is anchored
            just above the waterline, over the tip of the iceberg (slide 1) */}
        <div className="absolute inset-x-0 top-[11%] px-4 text-center">
          <p className="text-lg font-extrabold uppercase tracking-[0.2em] text-msot-navy/80 sm:text-xl">
            What we see
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-[63%] flex flex-col items-center px-4">
          <ul className="flex flex-col items-center gap-1.5">
            {whatWeSee.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-msot-orange shadow-sm ring-1 ring-msot-orange/20 backdrop-blur-sm sm:text-xs"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-msot-red"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* WHAT LIES BENEATH heading, just under the waterline */}
        <div className="absolute inset-x-0 top-[40%] text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/80">
            What lies beneath
          </p>
        </div>
        </div>

        {/* Click-away catcher — sits under the labels so you can jump
            straight from one bubble to another. */}
        {open && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenId(null)}
            aria-hidden
          />
        )}

        {/* foundation labels — clickable */}
        {foundations.map((f) => {
          const pos = layout[f.id];
          if (!pos) return null;
          const isOpen = openId === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setOpenId(isOpen ? null : f.id)}
              aria-expanded={isOpen}
              style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
              className={`absolute z-50 flex max-w-[46%] -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-left text-[11px] font-semibold leading-tight shadow-sm ring-1 transition duration-200 ease-out hover:-translate-y-[calc(50%+2px)] hover:scale-105 hover:shadow-lg active:scale-95 ${
                pos.onIce
                  ? "bg-white text-msot-navy ring-black/5"
                  : "bg-msot-navy/75 text-white ring-white/20 backdrop-blur"
              } ${isOpen ? "scale-105 shadow-lg ring-2 ring-msot-yellow" : ""}`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-200 ${
                  pos.onIce
                    ? "bg-msot-blue text-white"
                    : "bg-white/90 text-msot-navy"
                }`}
              >
                {f.number}
              </span>
              {f.title}
            </button>
          );
        })}

        {/* Speech bubble — grows out of the label that was clicked */}
        {open && openPos && (
          <>
            {/* tail: a rotated square straddling the bubble's edge */}
            <div
              className="pointer-events-none absolute z-50 h-3 w-3 bg-white shadow-sm"
              style={{
                left: `${openPos.left}%`,
                [above ? "bottom" : "top"]: `calc(${
                  above ? 100 - openPos.top : openPos.top
                }% + 20px)`,
                transform: `translate(-50%, ${above ? "50%" : "-50%"}) rotate(45deg)`,
              }}
              aria-hidden
            />
            <div
              className="absolute z-50 left-1/2 w-[94%] max-w-[540px] -translate-x-1/2"
              style={{
                [above ? "bottom" : "top"]: `calc(${
                  above ? 100 - openPos.top : openPos.top
                }% + 20px)`,
              }}
            >
              <div
                role="dialog"
                aria-label={open.title}
                className="bubble-pop max-h-[360px] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 sm:max-h-[460px] sm:p-5"
                style={{ transformOrigin: `50% ${above ? "100%" : "0%"}` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-msot-blue text-xs font-bold text-white">
                      {open.number}
                    </span>
                    <div>
                      <h3 className="text-base font-bold leading-tight text-msot-navy">
                        {open.title}
                      </h3>
                      <p className="text-[11px] font-medium text-msot-blue">
                        A handwriting foundation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenId(null)}
                    className="-mt-1 text-2xl leading-none text-foreground/30 transition-colors hover:text-foreground/70"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-3 space-y-2.5">
                  <Detail heading="What it is" body={open.whatItIs} />
                  <Detail
                    heading={"What it looks like when it's tricky"}
                    body={open.whenTricky}
                  />
                  <Detail heading="Simple ways to help" body={open.waysToHelp} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <p className="mx-auto mt-6 max-w-xl text-center text-base leading-7 text-foreground/70">
        {closingLine}
      </p>

      {/* Screener call-to-action */}
      {cta && (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-msot-blue p-8 text-center text-white">
          <h3 className="text-2xl font-bold">
            See what&apos;s below the surface
          </h3>
          <p className="mx-auto mt-2 max-w-md text-white/85">
            Our screener checks each of these foundational skill areas and shows
            you exactly where a student needs support.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-white px-7 py-3 text-lg font-semibold text-msot-blue transition-transform hover:scale-[1.03]"
          >
            Screen a student →
          </Link>
        </div>
      )}

    </section>
  );
}

function Detail({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="rounded-xl bg-msot-cyan/10 px-3.5 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-msot-blue">
        {heading}
      </p>
      <p className="mt-1 text-[13px] leading-[1.55] text-foreground/80">
        {body}
      </p>
    </div>
  );
}

/** Build a scalloped wave path across the given width. */
function wavePath(width: number, height: number, humps: number): string {
  const step = width / humps;
  const mid = height / 2;
  let d = `M0,${mid}`;
  for (let i = 0; i < humps; i++) {
    d += ` q ${step / 2} -${mid} ${step} 0`;
  }
  return d;
}
