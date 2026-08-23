import type { Metadata } from "next";
import ScreenAStudentLink from "@/components/ScreenAStudentLink";
import { buildProgram, sessionCounts, MAX_DOMAINS } from "@/lib/programBuilder";
import PaperPencilMark from "@/components/PaperPencilMark";
import {
  philosophy,
  howToUse,
  sessionShape,
} from "@/lib/programContent";

export const metadata: Metadata = {
  title: "Handwriting programs — Making Sense OT",
  description:
    "A worked example of the tailored 20-week handwriting intervention program.",
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
  screenedOn: "in an example screening",
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

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-semibold text-msot-blue">
        Handwriting programs
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-msot-navy sm:text-4xl">
        A tailored 20-week program
      </h1>
      <p className="mt-4 text-lg leading-8 text-foreground/70">
        Once a student has been screened, their flagged foundations become a
        weekly program: one short session a week, for twenty weeks. Below is a
        worked example so you can see exactly what a teacher would receive.
      </p>

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
            Flagged in {program.domains.length} foundations{" "}
            {demoStudent.screenedOn}. The program focuses on the {MAX_DOMAINS}{" "}
            areas of greatest need, with the most-affected area coming round
            most often.
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

      {/* The twenty weeks, shown as a screenshot rather than something to use */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-msot-navy">The twenty weeks</h2>
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
                  {demoStudent.initials} · 20-week program
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

                {/* the weeks */}
                <ol className="mt-3 space-y-1.5">
                  {program.weeks.map((w) => (
                    <li
                      key={w.week}
                      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 ${
                        w.week === 1
                          ? "border-msot-blue/30 bg-white"
                          : "border-black/[.07] bg-black/[.02]"
                      }`}
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                          w.week === 1
                            ? "bg-msot-blue text-white"
                            : "bg-black/[.06] text-foreground/40"
                        }`}
                      >
                        {w.week}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[9px] font-semibold uppercase tracking-wide ${
                            w.week === 1
                              ? "text-msot-blue"
                              : "text-foreground/35"
                          }`}
                        >
                          {w.domain.title}
                        </span>
                        <span
                          className={`block truncate text-xs font-semibold ${
                            w.week === 1
                              ? "text-msot-navy"
                              : "text-foreground/40"
                          }`}
                        >
                          {w.week === 1 ? w.session.title : "Locked"}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* laptop base */}
            <div className="mx-auto h-3 rounded-b-lg bg-msot-navy" />
            <div className="mx-auto h-1.5 w-1/3 rounded-b-xl bg-msot-navy/60" />
          </div>
          <figcaption className="mt-4 text-center text-sm text-foreground/50">
            How the program looks once a student has been screened.
          </figcaption>
        </figure>
      </section>

      {/*
        The one thing to do from this page. Monitoring guidance, safety
        principles and the end-of-program reflection all used to sit here —
        they belong inside a real program, where a teacher is actually running
        sessions, not on the page that explains what a program is.
      */}
      <div className="relative mt-12 rounded-2xl border border-msot-teal/25 bg-msot-teal/[.06] p-7">
        <h2 className="text-2xl font-bold leading-snug text-msot-navy">
          Screen a student now and build a program
        </h2>
        <p className="mt-2 max-w-lg leading-7 text-foreground/70">
          Screen a student across the eight foundations and their 20-week
          program is built from the areas that need support.
        </p>
        <ScreenAStudentLink className="mt-6" />

        <PaperPencilMark className="pointer-events-none absolute bottom-6 right-6 h-14 w-14" />
      </div>
    </div>
  );
}
