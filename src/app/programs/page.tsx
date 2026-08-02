import type { Metadata } from "next";
import Link from "next/link";
import ProgramTimeline from "@/components/ProgramTimeline";
import { buildProgram, sessionCounts, MAX_DOMAINS } from "@/lib/programBuilder";
import {
  essentialRule,
  howToUse,
  sessionShape,
  safetyPrinciples,
  progressMonitoring,
  endOfProgramReflection,
} from "@/lib/programContent";

export const metadata: Metadata = {
  title: "Handwriting programs — Making Sense OT",
  description:
    "A worked example of the tailored 10-week handwriting intervention program.",
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
        A tailored 10-week program
      </h1>
      <p className="mt-4 text-lg leading-8 text-foreground/70">
        Once a student has been screened, their flagged foundations become a
        weekly program: one short session a week, for ten weeks. Below is a
        worked example so you can see exactly what a teacher would receive.
      </p>

      {/* Example banner — this page is not real student data */}
      <div className="mt-8 rounded-2xl border border-msot-yellow/50 bg-msot-yellow/10 px-5 py-4">
        <p className="text-sm font-bold uppercase tracking-wide text-msot-navy">
          Example only
        </p>
        <p className="mt-1 leading-7 text-foreground/75">
          This program is for an invented student and nothing on this page is
          saved. Ticking a week off is just a preview of how it will feel.
        </p>
      </div>

      {/* The student this program is for */}
      <section className="mt-10 rounded-2xl bg-msot-blue p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
          Program for
        </p>
        <h2 className="mt-1 text-2xl font-bold">
          {demoStudent.initials} · {demoStudent.yearLevel}
        </h2>
        <p className="mt-2 leading-7 text-white/85">
          Flagged in {program.domains.length} foundations {demoStudent.screenedOn}.
          The program focuses on the {MAX_DOMAINS} areas of greatest need, with
          the most-affected area coming round most often.
        </p>

        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {counts.map(({ domain, count }, i) => (
            <li
              key={domain.id}
              className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-msot-blue">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium">
                {domain.title}
              </span>
              <span className="shrink-0 text-xs text-white/70">
                {count} {count === 1 ? "session" : "sessions"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* How a session runs */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-msot-navy">
          How every session runs
        </h2>
        <p className="mt-2 leading-7 text-foreground/70">{howToUse}</p>

        <p className="mt-5 rounded-xl bg-msot-cyan/10 px-4 py-3 text-center text-sm font-semibold text-msot-navy">
          {sessionShape.headline}
        </p>

        <ol className="mt-4 space-y-2">
          {sessionShape.steps.map((step, i) => (
            <li key={i} className="flex gap-3 leading-7 text-foreground/80">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-msot-blue/10 text-xs font-bold text-msot-blue">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-2xl border-l-4 border-msot-red bg-msot-red/[.06] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-msot-red">
            The essential rule
          </p>
          <p className="mt-1.5 leading-7 text-foreground/80">{essentialRule}</p>
        </div>
      </section>

      {/* The ten weeks */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-msot-navy">The ten weeks</h2>
        <p className="mt-2 leading-7 text-foreground/70">
          Weeks unlock one at a time: each session opens only once the week
          before it has been completed, so the program is worked through as a
          progression rather than dipped into.
        </p>
        <div className="mt-5">
          <ProgramTimeline
            weeks={program.weeks.map((w) => ({
              week: w.week,
              domainTitle: w.domain.title,
              session: w.session,
            }))}
            completedWeeks={[]}
          />
        </div>
      </section>

      {/* Progress monitoring */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-msot-navy">
          Simple progress monitoring
        </h2>
        <div className="mt-4 space-y-3">
          {progressMonitoring.map((row) => (
            <div
              key={row.record}
              className="rounded-2xl border border-black/[.08] px-5 py-4"
            >
              <p className="font-semibold text-msot-navy">{row.record}</p>
              <p className="mt-1 leading-7 text-foreground/75">{row.examples}</p>
              <p className="mt-2 text-sm italic text-foreground/55">
                {row.manageable}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-msot-navy">
          Principles for safe, useful intervention
        </h2>
        <ul className="mt-4 space-y-2.5">
          {safetyPrinciples.map((principle, i) => (
            <li key={i} className="flex gap-3 leading-7 text-foreground/80">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-msot-red" />
              {principle}
            </li>
          ))}
        </ul>
      </section>

      {/* End of program */}
      <section className="mt-12 rounded-2xl bg-msot-cyan/10 px-6 py-6">
        <h2 className="text-lg font-bold text-msot-navy">
          End-of-program reflection
        </h2>
        <p className="mt-2 leading-7 text-foreground/80">
          {endOfProgramReflection}
        </p>
      </section>

      {/* CTA */}
      <div className="mt-12 rounded-2xl bg-msot-navy p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Build one for your student</h2>
        <p className="mx-auto mt-2 max-w-md text-white/85">
          Screen a student across the eight foundations and their program is
          built from the areas that need support.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-full bg-white px-7 py-3 text-lg font-semibold text-msot-navy transition-transform hover:scale-[1.03]"
        >
          Log in to get started →
        </Link>
      </div>
    </div>
  );
}
