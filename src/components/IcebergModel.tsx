"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ScreenAStudentLink from "@/components/ScreenAStudentLink";
import { foundationIcons } from "@/components/IcebergIcons";
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

  A Client Component because clicking a card opens a popup (needs state).

  The picture is built rather than dropped in as a flat image so that every
  foundation stays clickable, the text stays selectable and readable to screen
  readers, and the whole thing reflows on a phone. The only raster is the
  mascot, which is decorative.

  Layout note: the sky and the water are two stacked blocks in normal flow, so
  the panel grows with its content instead of relying on a fixed height. The
  iceberg SVG is stretched across both as a backdrop.
*/

function Cloud({ className, id }: { className: string; id: string }) {
  // The puffs are drawn twice: once shaded, then again slightly higher in near
  // white. The offset sliver of the lower copy reads as the shadowed underside,
  // which is what gives a flat silhouette its volume.
  const puffs = (
    <>
      <circle cx="30" cy="28" r="15" />
      <circle cx="52" cy="20" r="20" />
      <circle cx="74" cy="28" r="15" />
      <rect x="30" y="26" width="44" height="16" rx="8" />
    </>
  );
  return (
    <svg viewBox="0 0 100 50" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-lit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f2f6fa" />
        </linearGradient>
        <filter id={`${id}-cast`} x="-25%" y="-25%" width="150%" height="160%">
          <feDropShadow
            dx="0"
            dy="2.5"
            stdDeviation="2.4"
            floodColor="#8aa7bd"
            floodOpacity="0.4"
          />
        </filter>
      </defs>
      <g filter={`url(#${id}-cast)`}>
        <g fill="#d8e4ee">{puffs}</g>
        <g fill={`url(#${id}-lit)`} transform="translate(0,-2.5)">
          {puffs}
        </g>
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

      <div className="relative mx-auto mt-10 max-w-xl overflow-hidden rounded-3xl border border-black/[.06] shadow-sm">
        {/* ── Above the surface ───────────────────────────────────────── */}
        <div className="relative bg-[#faf6ec] px-5 pb-14 pt-9 sm:px-8">
          {/* The peak is drawn inside the sky rather than across the whole
              panel: each half owns its share of the berg, so neither has to
              guess where the other's flowed content ends. */}
          <svg
            viewBox="0 0 400 300"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              {/* Light falls from the upper left, so faces turned that way are
                  near white and the right flank sits in shade. */}
              <linearGradient id="peak-body" x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#eef6fd" />
                <stop offset="100%" stopColor="#d8e8f5" />
              </linearGradient>
              <filter id="peak-cast" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="3" dy="4" stdDeviation="5" floodColor="#8fb0c6" floodOpacity="0.35" />
              </filter>
            </defs>
            <g filter="url(#peak-cast)">
              <path d="M44,300 L104,150 L140,182 L190,52 L232,132 L262,104 L300,168 L356,300 Z" fill="url(#peak-body)" />
              {/* Facets. Each is a flat plane catching a different amount of
                  light — the tonal steps between them are what read as edges. */}
              <path d="M44,300 L104,150 L132,204 L118,300 Z" fill="#c7dcee" />
              <path d="M104,150 L140,182 L132,204 Z" fill="#e8f2fa" />
              <path d="M132,204 L166,300 L118,300 Z" fill="#d6e7f4" />
              <path d="M190,52 L140,182 L166,300 L200,300 Z" fill="#fcfeff" />
              <path d="M190,52 L200,300 L216,300 L232,132 Z" fill="#e9f3fb" />
              <path d="M232,132 L262,104 L276,190 L252,300 L216,300 Z" fill="#d9e8f5" />
              <path d="M262,104 L300,168 L276,190 Z" fill="#f5fafe" />
              <path d="M276,190 L300,168 L356,300 L288,300 Z" fill="#c2d9ec" />
              <path d="M288,300 L276,190 L252,300 Z" fill="#cfe1f0" />
              {/* The lit ridge running down from the summit. */}
              <path d="M190,52 L198,120 L182,300 L172,300 Z" fill="#ffffff" fillOpacity="0.75" />
            </g>
          </svg>

          <Cloud id="cloud-a" className="absolute left-[6%] top-[7%] w-16 opacity-95" />
          <Cloud id="cloud-b" className="absolute right-[6%] top-[12%] w-12 opacity-90" />

          <div className="relative text-center">
            <p className="text-base font-extrabold uppercase tracking-[0.22em] text-[#2f7d6d] sm:text-lg">
              What we see
            </p>
            <span className="mx-auto mt-2 block h-[2px] w-32 rounded-full bg-msot-pink" />
          </div>

          <ul className="relative mx-auto mt-6 max-w-[19rem]">
            {whatWeSee.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 py-1.5 text-[13px] font-medium text-msot-navy sm:text-[15px]"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-msot-pink"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── The water's surface ─────────────────────────────────────
            Layered rather than a single line: a far swell, the near surface
            over it, then foam along the crest and a scatter of broken foam
            behind. Real water reads as depth stacked up, and each layer runs
            at its own wavelength so no two crests line up. */}
        <svg
          viewBox="0 0 1200 70"
          preserveAspectRatio="none"
          className="relative -mt-10 block h-20 w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="water-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bcdeef" />
              <stop offset="100%" stopColor="#9ecde5" />
            </linearGradient>
          </defs>

          {/* the swell behind, sitting lower and paler */}
          <path d={waveArea(1200, 70, 26, 3, 17, 0.4)} fill="#cfe7f3" fillOpacity="0.85" />
          {/* the near surface */}
          <path d={waveArea(1200, 70, 41, 5, 11, 2.1)} fill="url(#water-near)" />
          {/* foam: a bright crest line, then softer broken foam under it */}
          <path
            d={waveLine(1200, 41, 5, 11, 2.1)}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.92"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d={waveLine(1200, 49, 5, 11, 2.1)}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="14 30"
          />
          <path
            d={waveLine(1200, 26, 3, 17, 0.4)}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.45"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="26 44"
          />
        </svg>

        {/* ── Below the surface ───────────────────────────────────────── */}
        <div className="relative bg-gradient-to-b from-[#9ecde5] via-[#7fbcda] to-[#5fa3c6] px-5 pb-14 pt-4 sm:px-8 sm:pb-16">
          {/* The submerged mass, filling the water behind the cards. */}
          <svg
            viewBox="0 0 400 600"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              {/* Light reaching the mass falls off with depth, so the body
                  fades into the water rather than ending flatly. */}
              <linearGradient id="berg-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.78" />
                <stop offset="55%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#cfe4f2" stopOpacity="0.46" />
              </linearGradient>
              <radialGradient id="berg-floor" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#25a7d" stopOpacity="0.62" />
                <stop offset="100%" stopColor="#255a7d" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* The mass sits on something: a soft pool of shadow under the
                base, which is what stops it floating in flat blue. */}
            <ellipse cx="200" cy="592" rx="175" ry="32" fill="url(#berg-floor)" />
            <ellipse cx="192" cy="588" rx="96" ry="18" fill="url(#berg-floor)" />
            <path d="M44,0 L104,16 L176,2 L248,18 L316,4 L356,0 L372,180 L308,392 L350,516 L236,588 L146,584 L68,486 L34,286 Z" fill="url(#berg-body)" />
            {/* Facets, lit from the upper left as above the surface. */}
            <path d="M44,0 L104,16 L92,140 L34,286 L68,486 L146,584 L160,372 L106,178 Z" fill="#ffffff" fillOpacity="0.42" />
            <path d="M44,0 L104,16 L106,178 L92,140 Z" fill="#ffffff" fillOpacity="0.66" />
            <path d="M34,286 L68,486 L104,470 L88,300 Z" fill="#255a7d" fillOpacity="0.2" />
            <path d="M146,584 L160,372 L216,318 L236,588 Z" fill="#ffffff" fillOpacity="0.8" />
            <path d="M160,372 L216,318 L206,214 L150,266 Z" fill="#ffffff" fillOpacity="0.6" />
            <path d="M316,4 L356,0 L372,180 L308,392 L350,516 L236,588 L216,318 L272,150 Z" fill="#255a7d" fillOpacity="0.17" />
            <path d="M272,150 L248,18 L316,4 L356,0 L372,180 L316,246 Z" fill="#ffffff" fillOpacity="0.38" />
            <path d="M308,392 L350,516 L236,588 L268,430 Z" fill="#255a7d" fillOpacity="0.26" />
            {/* The base narrows to a keel. Facets converging on it keep the
                bottom from reading as one flat plate. */}
            <path d="M146,584 L188,502 L236,588 Z" fill="#ffffff" fillOpacity="0.66" />
            <path d="M146,584 L188,502 L160,372 L118,516 Z" fill="#255a7d" fillOpacity="0.1" />
            <path d="M236,588 L188,502 L216,318 L272,464 Z" fill="#255a7d" fillOpacity="0.15" />
            <path d="M188,502 L216,318 L206,470 Z" fill="#ffffff" fillOpacity="0.3" />
            {/* Facets running down from the surface, so the widest part of the
                mass is broken up rather than reading as one pale slab. */}
            <path d="M104,16 L176,2 L192,150 L124,196 Z" fill="#ffffff" fillOpacity="0.26" />
            <path d="M176,2 L248,18 L236,168 L192,150 Z" fill="#255a7d" fillOpacity="0.07" />
          </svg>

          {/* Sunlight breaking through the surface, and a few bubbles rising.
              Both are what sell water as water rather than a blue panel. */}
          <svg
            viewBox="0 0 400 600"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            <g fill="#ffffff">
              <polygon points="66,0 96,0 150,600 108,600" opacity="0.07" />
              <polygon points="182,0 198,0 232,600 208,600" opacity="0.05" />
              <polygon points="286,0 318,0 300,600 262,600" opacity="0.06" />
            </g>
            <g fill="#ffffff">
              <circle cx="46" cy="118" r="4" opacity="0.3" />
              <circle cx="58" cy="176" r="2.6" opacity="0.22" />
              <circle cx="36" cy="248" r="3.2" opacity="0.18" />
              <circle cx="360" cy="96" r="3.6" opacity="0.28" />
              <circle cx="376" cy="164" r="2.4" opacity="0.2" />
              <circle cx="348" cy="232" r="4.2" opacity="0.16" />
              <circle cx="368" cy="318" r="2.8" opacity="0.14" />
            </g>
          </svg>

          <div className="relative flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-[#1b5a7d]/45" aria-hidden />
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#1b5a7d] sm:text-base">
              What lies beneath
            </p>
            <span className="h-px w-6 bg-[#1b5a7d]/45" aria-hidden />
          </div>
          <p className="relative mt-4 text-center text-sm font-extrabold uppercase tracking-[0.14em] text-[#26685c] sm:text-base">
            Handwriting foundations
          </p>

          {/* The eight foundations. A plain grid rather than labels scattered
              across the berg: it reads far more clearly, and nothing collides
              as the text reflows. */}
          <ul className="relative mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
            {foundations.map((f) => {
              const Icon = foundationIcons[f.id];
              const isOpen = openId === f.id;
              return (
                <li key={f.id}>
                  <button
                    onClick={() => setOpenId(isOpen ? null : f.id)}
                    aria-expanded={isOpen}
                    className={`flex h-full w-full items-center gap-3 rounded-2xl bg-white/95 px-3 py-3.5 text-left shadow-sm ring-1 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-lg active:scale-[0.98] sm:gap-3.5 sm:px-3.5 sm:py-4 ${
                      isOpen ? "ring-2 ring-msot-yellow" : "ring-black/5"
                    }`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#2f7d6d] ring-[1.5px] ring-[#2f7d6d]/70 sm:h-14 sm:w-14">
                      {/* The glyph nearly fills its ring, as on the poster —
                          at small sizes a timid icon just reads as a smudge. */}
                      {Icon ? <Icon className="h-8 w-8 sm:h-10 sm:w-10" /> : null}
                    </span>
                    {/* Capped width so titles stack into two or three short
                        lines instead of running the width of the card. It
                        makes each tile chunky rather than long, and keeps the
                        two columns the same shape whatever the title length. */}
                    <span className="max-w-[6rem] text-[13px] font-semibold leading-snug text-msot-navy sm:max-w-[6.5rem] sm:text-[15px]">
                      {f.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* The closing line is the point the whole picture is making, so it
              gets said out loud — as the mascot's speech bubble rather than a
              caption sitting under the panel. The right margin keeps the text
              clear of him; he is free to overlap the cards above. */}
          <div className="relative mt-10 mr-28 sm:mr-36">
            {/* Tail: a rotated square behind the bubble, so only the half that
                points at the mascot shows. */}
            <span
              className="absolute -right-1.5 bottom-3 z-0 h-5 w-5 rotate-45 rounded-[3px] bg-[#faf6ec]"
              aria-hidden
            />
            <p className="relative z-10 rounded-2xl bg-[#faf6ec] px-4 py-3.5 text-[13px] font-semibold leading-relaxed text-msot-navy shadow-lg ring-1 ring-black/5 sm:px-5 sm:py-4 sm:text-[15px]">
              {closingLine}
            </p>
          </div>

          {/* Decorative only: the mascot has no role in the model, so it is
              hidden from screen readers and never intercepts a card click. */}
          <Image
            src="/brand/iceberg-mascot.png"
            alt=""
            width={243}
            height={395}
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-2 z-10 w-28 sm:right-4 sm:w-32"
          />
        </div>

        {/* Click-away catcher, under the panel but over the cards, so you can
            jump straight from one foundation to another. */}
        {open && (
          <div
            className="absolute inset-0 z-40"
            onClick={() => setOpenId(null)}
            aria-hidden
          />
        )}

        {/* The "learn more" panel, centred over the picture. */}
        {open && (
          <div className="absolute left-1/2 top-1/2 z-50 w-[94%] max-w-[540px] -translate-x-1/2 -translate-y-1/2">
            <div
              role="dialog"
              aria-label={open.title}
              className="bubble-pop max-h-[420px] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 sm:max-h-[480px] sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#2f7d6d] ring-[1.5px] ring-[#2f7d6d]/70">
                    {(() => {
                      const Icon = foundationIcons[open.id];
                      return Icon ? <Icon className="h-7 w-7" /> : null;
                    })()}
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
        )}
      </div>

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
          <ScreenAStudentLink className="mt-6" />
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

/*
  A water surface across `width`, sitting at `baseline`.

  Each cycle is one S-curve, so the line stays smooth where segments meet
  rather than breaking into the scallops a run of arcs would give. Crest
  height is modulated by an irrational-ish multiplier, which keeps successive
  crests from repeating while staying entirely deterministic — the server and
  the browser must draw the identical path or React reports a mismatch.
*/
function waveLine(
  width: number,
  baseline: number,
  cycles: number,
  amp: number,
  phase: number,
): string {
  const step = width / cycles;
  let d = `M0,${baseline}`;
  for (let i = 0; i < cycles; i++) {
    const a = amp * (0.6 + 0.4 * Math.sin(i * 1.9 + phase));
    const skew = 0.18 * Math.sin(i * 0.7 + phase);
    d += ` c ${step * (0.28 + skew)},${-a} ${step * (0.72 + skew)},${a} ${step},0`;
  }
  return d;
}

/** The same surface, closed off at the bottom so it can be filled. */
function waveArea(
  width: number,
  height: number,
  baseline: number,
  cycles: number,
  amp: number,
  phase: number,
): string {
  return `${waveLine(width, baseline, cycles, amp, phase)} L${width},${height} L0,${height} Z`;
}
