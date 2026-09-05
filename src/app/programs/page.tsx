import type { Metadata } from "next";
import Image from "next/image";
import ScreenAStudentLink from "@/components/ScreenAStudentLink";
import { buildProgram, sessionCounts, MAX_DOMAINS } from "@/lib/programBuilder";
import PaperPencilMark from "@/components/PaperPencilMark";
import {
  philosophy,
  howToUse,
  sessionShape,
} from "@/lib/programContent";

export const metadata: Metadata = {
  title: "Two Term Program: Coming Soon",
  description:
    "A preview of the tailored Two Term handwriting program, coming soon.",
};

/*
  PLACEHOLDER PAGE. This shows a worked example of a program for an invented
  student so the shape of the thing can be reviewed before any of it is wired
  to the database. Nothing here is saved and no login is required.

  When programs go live, this page becomes the signed-out explainer and the
  real thing lives under /students/[id]/program.
*/

// An invented student, flagged in four domains by an imagined screening.
const demoStudent = {
  initials: "A.B.",
  yearLevel: "Year 2",
  flagged: [
    "postural-control",
    "fine-motor-control",
    "visual-motor-integration",
    "attention-executive-function",
  ],
};

export default function ProgramsPage() {
  const program = buildProgram(demoStudent.flagged);
  const counts = sessionCounts(program);

  // The mock-up shows week 1 in full and the next two locked; the rest of the
  // twenty fade out below.
  const [firstWeek, ...rest] = program.weeks;
  const nextWeeks = rest.slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-semibold text-msot-blue">
        Handwriting programs
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-msot-navy sm:text-4xl">
        Two Term Program: Coming Soon
      </h1>

      {/*
        The heading carries the "coming soon" on its own, so the lead is left
        plain — a loud banner underneath would only say the same thing twice.

        Sense stands beside the lead with his feet on the top edge of the
        yellow panel below. `-bottom-10` is exactly the panel's `mt-10`, so he
        lands on the edge rather than crossing it. The paragraphs carry
        matching right padding so the text never runs beneath him.

        The source is 650px wide for a slot at most 128px: a decorative figure
        still has to hold up on a retina screen, where that slot is 256 real
        pixels.
      */}
      <div className="relative">
        <Image
          src="/brand/sense-mascot.webp"
          alt=""
          aria-hidden
          width={650}
          height={1163}
          priority
          className="pointer-events-none absolute -bottom-10 right-0 hidden w-24 select-none sm:block lg:w-32"
        />

        <p className="mt-5 text-lg font-medium leading-8 text-msot-navy sm:pr-36 lg:pr-44">
          Here is a preview of what is coming.
        </p>

        <p className="mt-4 text-lg leading-8 text-foreground/70 sm:pr-36 lg:pr-44">
          Once a student has been screened, their flagged foundations become a
          weekly program: short sessions run a few times a week, across two
          school terms.
          Below is a worked example so you can see exactly what a teacher would
          receive.
        </p>
      </div>

      {/*
        The example program and the shape of a session share one yellow panel.
        Scaled down deliberately — this is a look at the product, not the
        product itself, so it reads as a sample rather than something to work
        through.
      */}
      <section className="mt-10 rounded-2xl border border-msot-yellow/50 bg-msot-yellow/10 p-5 sm:p-6">
        <div className="rounded-xl bg-msot-blue px-5 py-4 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70">
            Program for
          </p>
          <h2 className="mt-0.5 text-lg font-bold">
            {demoStudent.initials} · {demoStudent.yearLevel}
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-white/85">
            Flagged are {program.domains.length} foundations your student
            needs the most assistance with to improve their handwriting. The
            program focuses on these {MAX_DOMAINS}, with the most-affected area
            coming round most often.
          </p>

          <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {counts.map(({ domain, count }, i) => (
              <li
                key={domain.id}
                className="flex items-center gap-2.5 rounded-lg bg-white/10 px-2.5 py-2"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-[10px] font-bold text-msot-blue">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 text-xs font-medium">
                  {domain.title}
                </span>
                <span className="shrink-0 text-[10px] text-white/70">
                  {count} {count === 1 ? "session" : "sessions"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* How a session runs */}
        <div className="mt-5">
          <h2 className="font-bold text-msot-navy">How every session runs</h2>
          <p className="mt-1.5 text-sm leading-6 text-foreground/70">
            {howToUse}
          </p>

          <p className="mt-4 text-sm font-semibold text-msot-navy">
            {sessionShape.headline}
          </p>
          <ol className="mt-2.5 space-y-2">
            {sessionShape.steps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-lg bg-white/70 px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-msot-blue text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-semibold text-msot-navy">
                    {step.title}
                  </span>
                  <span className="shrink-0 text-xs font-medium text-foreground/60">
                    {step.timing}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-foreground/70">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-lg border-l-4 border-msot-teal bg-msot-teal/[.09] px-3.5 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-msot-teal">
              {philosophy.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-foreground/80">
              {philosophy.body}
            </p>
          </div>
        </div>
      </section>

      {/* The program itself, shown as a screenshot rather than something to use */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-msot-navy">The Two Term program</h2>
        <p className="mt-2 leading-7 text-foreground/70">
          Weeks unlock one at a time: each session opens only once the week
          before it has been completed, so the program is worked through as a
          progression rather than dipped into.
        </p>

        {/*
          A laptop mock-up. Everything inside is static markup, not the real
          ProgramTimeline — on a public page there is nothing to tick off and
          nothing to save, so a visitor should never find something that looks
          clickable and isn't. `select-none` and `pointer-events-none` make
          that literal.
        */}
        <figure className="mt-6">
          <div className="mx-auto max-w-2xl">
            {/* screen */}
            <div className="rounded-t-xl border-[10px] border-b-[6px] border-msot-navy bg-white shadow-xl">
              {/* window chrome */}
              <div className="flex items-center gap-1.5 border-b border-black/[.07] bg-black/[.03] px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-msot-red/50" />
                <span className="h-2 w-2 rounded-full bg-msot-yellow" />
                <span className="h-2 w-2 rounded-full bg-msot-teal/70" />
                <span className="ml-2 truncate text-[10px] text-foreground/40">
                  {demoStudent.initials} · Two Term program
                </span>
              </div>

              <div className="pointer-events-none select-none px-4 py-4">
                {/* progress bar */}
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-semibold text-msot-navy">
                    Week 1 of {program.weeks.length}
                  </p>
                  <p className="text-[10px] text-foreground/50">0 completed</p>
                </div>
                <div className="mt-1.5 flex h-1.5 gap-1">
                  {program.weeks.map((w) => (
                    <span
                      key={w.week}
                      className={`flex-1 rounded-full ${
                        w.week === 1 ? "bg-msot-blue/40" : "bg-black/[.07]"
                      }`}
                    />
                  ))}
                </div>

                {/*
                  Only the first three weeks, and only week 1 opened out.
                  Twenty locked rows made the program look like a wall of
                  work; showing one real session and letting the rest fade
                  says "a short weekly session" instead. The count below the
                  mock-up carries the fact that there are twenty.
                */}
                <div className="relative mt-3">
                  <ol className="space-y-1.5">
                    {/* Week 1, opened out — a real session from the content. */}
                    <li className="rounded-lg border border-msot-blue/30 bg-white px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-msot-blue text-[10px] font-bold text-white">
                          1
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[9px] font-semibold uppercase tracking-wide text-msot-blue">
                            {firstWeek.domain.title}
                          </span>
                          <span className="block truncate text-xs font-semibold text-msot-navy">
                            {firstWeek.session.title}
                          </span>
                        </span>
                      </div>

                      <div className="mt-2.5 border-t border-black/[.06] pt-2.5 pl-8">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground/45">
                          You&apos;ll need
                        </p>
                        <p className="mt-0.5 text-[11px] leading-5 text-foreground/70">
                          {firstWeek.session.youNeed}
                        </p>

                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-foreground/45">
                          What to do
                        </p>
                        <ol className="mt-1 space-y-1">
                          {firstWeek.session.whatToDo.map((step, i) => (
                            <li key={step} className="flex gap-2">
                              <span className="mt-0.5 text-[10px] font-bold text-msot-blue">
                                {i + 1}
                              </span>
                              <span className="text-[11px] leading-5 text-foreground/70">
                                {step}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </li>

                    {/* Weeks 2 and 3, locked — enough to show it continues. */}
                    {nextWeeks.map((w) => (
                      <li
                        key={w.week}
                        className="flex items-center gap-2.5 rounded-lg border border-black/[.07] bg-black/[.02] px-3 py-2"
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-black/[.06] text-[10px] font-bold text-foreground/40">
                          {w.week}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[9px] font-semibold uppercase tracking-wide text-foreground/35">
                            {w.domain.title}
                          </span>
                          <span className="block truncate text-xs font-semibold text-foreground/40">
                            Locked
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  {/*
                    Fades the last row into the page so the list reads as cut
                    short rather than finished. Purely decorative.
                  */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -bottom-4 h-16 bg-gradient-to-b from-transparent to-white"
                  />
                </div>
              </div>
            </div>

            {/* laptop base */}
            <div className="mx-auto h-3 rounded-b-lg bg-msot-navy" />
            <div className="mx-auto h-1.5 w-1/3 rounded-b-xl bg-msot-navy/60" />
          </div>
        </figure>
      </section>

      {/* The printable worksheets, previewed as two real pages side by side. */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-msot-navy">
          The printable worksheets
        </h2>
        <p className="mt-2 leading-7 text-foreground/70">
          Each session comes with a printable practice sheet built on one
          movement at a time. Two pages from the first set are shown below.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {[
            {
              src: "/worksheets/worksheet-1.webp",
              // Kept for the alt text only: the visible captions were removed,
              // but a screen reader still needs to know which sheet is which.
              label: "Page 1 — how to use a practice sheet",
            },
            {
              src: "/worksheets/worksheet-2.webp",
              label: "Page 2 — Building Block 1, straight lines",
            },
          ].map((sheet) => (
            <figure key={sheet.src}>
              {/*
                A plain framed page rather than a device mock-up: these are
                printed on paper, so anything screen-shaped would misdescribe
                them. Not clickable, because there is nothing to download yet.
              */}
              <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <Image
                  src={sheet.src}
                  alt={`Worksheet preview: ${sheet.label}`}
                  width={1100}
                  height={1213}
                  className="h-auto w-full select-none"
                />
              </div>
            </figure>
          ))}
        </div>

        <p className="mt-5 rounded-xl bg-msot-yellow/10 px-5 py-4 text-sm leading-6 text-foreground/70">
          These sheets are part of the program and are not available to
          download yet.
        </p>
      </section>

      {/*
        The one thing to do from this page. Monitoring guidance, safety
        principles and the end-of-program reflection all used to sit here —
        they belong inside a real program, where a teacher is actually running
        sessions, not on the page that explains what a program is.
      */}
      <div className="relative mt-12 rounded-2xl border border-msot-teal/25 bg-msot-teal/[.06] p-7">
        <h2 className="text-2xl font-bold leading-snug text-msot-navy">
          Screen a student now
        </h2>
        <p className="mt-2 max-w-lg leading-7 text-foreground/70">
          Screening takes a few minutes and gives you a result you can use
          today. It is also what the Two Term program will be built from, so
          screening now is the way to be ready when it opens.
        </p>
        <ScreenAStudentLink className="mt-6" />

        <PaperPencilMark className="pointer-events-none absolute bottom-6 right-6 h-14 w-14" />
      </div>
    </div>
  );
}
