"use client";

import { useState } from "react";
import Link from "next/link";
import { screeningDomains } from "@/lib/screening";
import { domainInfo } from "@/lib/domainInfo";

/*
  The "iceberg model": handwriting is the visible tip; the submerged mass is
  the foundational skills we screen for. Each domain label is a button — click
  it to open a "Learn more" panel (placeholder content in lib/domainInfo.ts).

  A Client Component because clicking a label opens a popup (needs state).
  The waterline sits at 30% down, matching the berg SVG's y=150 of 500.
*/

// Where each domain label sits, as % of the picture. `onIce` labels sit on the
// submerged iceberg; the others float in the surrounding water.
const layout: Record<string, { top: number; left: number; onIce: boolean }> = {
  "fine-motor": { top: 40, left: 50, onIce: true },
  "early-writing": { top: 47, left: 37, onIce: true },
  "visual-motor": { top: 47, left: 63, onIce: true },
  "hand-strength": { top: 55, left: 50, onIce: true },
  "midline-crossing": { top: 64, left: 40, onIce: true },
  "visual-perceptual": { top: 64, left: 62, onIce: true },
  "hand-dominance": { top: 41, left: 15, onIce: false },
  "postural-control": { top: 56, left: 84, onIce: false },
  "classroom-readiness": { top: 76, left: 21, onIce: false },
  "bilateral-coordination": { top: 79, left: 79, onIce: false },
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

export default function IcebergModel() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId
    ? { domain: screeningDomains.find((d) => d.id === openId), info: domainInfo[openId] }
    : null;

  return (
    <section className="mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-msot-blue">
          Why handwriting matters
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-msot-navy">
          The iceberg model
        </h2>
        <p className="mt-3 text-lg leading-8 text-foreground/70">
          What you see on the page — neat, legible handwriting — is just the
          tip. Beneath the surface sits a whole set of hidden skills that make
          it possible. Tap any skill below to learn more.
        </p>
      </div>

      {/* The iceberg picture */}
      <div className="relative mx-auto mt-10 h-[600px] max-w-xl overflow-hidden rounded-3xl border border-black/[.06] sm:h-[680px]">
        {/* sky + water */}
        <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-sky-100 to-cyan-50" />
        <div className="absolute inset-x-0 bottom-0 top-[30%] bg-gradient-to-b from-msot-cyan/40 via-msot-blue/50 to-msot-navy/90" />

        {/* clouds */}
        <Cloud className="absolute left-[10%] top-[8%] w-20 opacity-90" />
        <Cloud className="absolute right-[12%] top-[13%] w-14 opacity-80" />

        {/* light rays in the water */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[22%] top-[30%] h-[70%] w-10 -rotate-[18deg] bg-gradient-to-b from-white/15 to-transparent" />
          <div className="absolute left-[46%] top-[30%] h-[80%] w-16 -rotate-[14deg] bg-gradient-to-b from-white/12 to-transparent" />
          <div className="absolute left-[70%] top-[30%] h-[65%] w-8 -rotate-[20deg] bg-gradient-to-b from-white/10 to-transparent" />
        </div>

        {/* wavy waterline */}
        <svg
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-[30%] h-6 -translate-y-1/2"
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

        {/* faceted iceberg */}
        <svg
          viewBox="0 0 400 500"
          preserveAspectRatio="xMidYMid meet"
          className="absolute left-1/2 top-0 h-full -translate-x-1/2"
          aria-hidden
        >
          {/* submerged body — a few overlapping facets for a low-poly look */}
          <path
            d="M120,150 L280,150 L300,250 L262,340 L286,415 L228,472 L170,470 L120,405 L98,300 L126,214 Z"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            d="M120,150 L126,214 L98,300 L120,405 L170,470 L176,352 L150,258 Z"
            fill="white"
            fillOpacity="0.42"
          />
          <path
            d="M170,470 L176,352 L214,318 L228,472 Z"
            fill="white"
            fillOpacity="0.62"
          />
          <path
            d="M280,150 L300,250 L262,340 L286,415 L228,472 L214,318 L244,236 Z"
            fill="white"
            fillOpacity="0.4"
          />
          {/* above-water peak */}
          <path d="M155,150 L182,80 L196,110 L214,72 L236,150 Z" fill="#f8fcff" />
          <path d="M182,80 L196,110 L189,150 L168,150 Z" fill="#e3f1fd" />
          <path d="M214,72 L236,150 L212,150 L203,116 Z" fill="#eef7ff" />
        </svg>

        {/* HANDWRITING label on the tip */}
        <div className="absolute inset-x-0 top-[7%] flex justify-center">
          <span className="rounded-full bg-white px-5 py-2 text-base font-extrabold uppercase tracking-wide text-msot-navy shadow-lg sm:text-lg">
            Handwriting
          </span>
        </div>

        {/* domain labels — clickable */}
        {screeningDomains.map((d) => {
          const pos = layout[d.id];
          if (!pos) return null;
          return (
            <button
              key={d.id}
              onClick={() => setOpenId(d.id)}
              style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ring-1 transition-transform hover:scale-105 sm:text-sm ${
                pos.onIce
                  ? "bg-white/90 text-msot-navy ring-black/5"
                  : "bg-msot-navy/70 text-white ring-white/20 backdrop-blur"
              }`}
            >
              {d.title}
            </button>
          );
        })}
      </div>

      {/* Screener call-to-action */}
      <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-msot-blue p-8 text-center text-white">
        <h3 className="text-2xl font-bold">See what&apos;s below the surface</h3>
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

      {/* Learn-more popup */}
      {open?.domain && open.info && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpenId(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold text-msot-navy">
                {open.domain.title}
              </h3>
              <button
                onClick={() => setOpenId(null)}
                className="text-2xl leading-none text-foreground/40 hover:text-foreground/70"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="mt-1 font-medium text-msot-blue">{open.info.blurb}</p>
            <div className="mt-4 space-y-3">
              {open.info.paragraphs.map((p, i) => (
                <p key={i} className="leading-7 text-foreground/80">
                  {p}
                </p>
              ))}
            </div>
            <p className="mt-5 rounded-lg bg-msot-yellow/15 px-3 py-2 text-xs text-msot-navy">
              Placeholder content — to be replaced with the real explanation.
            </p>
          </div>
        </div>
      )}
    </section>
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
