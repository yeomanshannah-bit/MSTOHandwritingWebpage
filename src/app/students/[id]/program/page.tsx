import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { scoreScreening, type Responses } from "@/lib/screening";
import { toProgramDomainIds } from "@/lib/screeningToProgram";
import { buildProgram, sessionCounts, MAX_DOMAINS } from "@/lib/programBuilder";
import {
  essentialRule,
  howToUse,
  sessionShape,
  progressMonitoring,
  safetyPrinciples,
  endOfProgramReflection,
} from "@/lib/programContent";
import ProgramTimeline from "@/components/ProgramTimeline";
import { createProgram, completeWeek, reopenWeek } from "./actions";

/*
  A student's 10-week program.

  If they have no program yet we offer to build one from their most recent
  screening. Once it exists, the weeks are shown as a timeline that unlocks one
  session at a time.
*/
export default async function StudentProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("id, initials, year_level")
    .eq("id", id)
    .single();
  if (!student) notFound();

  const { data: program } = await supabase
    .from("programs")
    .select("id, domain_ids, started_on, screening_id")
    .eq("student_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const backLink = (
    <Link
      href={`/students/${id}`}
      className="text-sm text-foreground/60 hover:text-msot-blue"
    >
      ← Back to {student.initials}
    </Link>
  );

  // ── No program yet: offer to build one from the latest screening ──
  if (!program) {
    // A baseline comes first — that's the point of a baseline. Only enforced
    // before the program exists; an existing program is always viewable.
    const { data: baseline } = await supabase
      .from("baseline_photos")
      .select("id")
      .eq("student_id", id)
      .limit(1)
      .maybeSingle();
    if (!baseline) redirect(`/students/${id}/baseline`);

    const { data: screening } = await supabase
      .from("screenings")
      .select("id, responses")
      .eq("student_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const flagged = screening
      ? scoreScreening(screening.responses as Responses).flaggedDomains
      : [];
    const domainIds = toProgramDomainIds(flagged.map((d) => d.id));
    const preview = buildProgram(domainIds);

    async function build() {
      "use server";
      await createProgram(id, screening?.id ?? null, domainIds);
    }

    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        {backLink}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-msot-navy">
          10-week program
        </h1>

        {!screening ? (
          <div className="mt-6 rounded-2xl bg-msot-blue/[.06] p-6">
            <p className="leading-7 text-foreground/75">
              {student.initials} hasn&apos;t been screened yet. The program is
              built from the foundations a screening flags, so start there.
            </p>
            <Link
              href={`/students/${id}/screen`}
              className="mt-4 inline-flex rounded-full bg-msot-blue px-5 py-2.5 font-medium text-white transition-colors hover:bg-msot-navy"
            >
              Start screening →
            </Link>
          </div>
        ) : preview.domains.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-msot-teal/[.08] p-6">
            <p className="leading-7 text-foreground/75">
              {student.initials}&apos;s screening didn&apos;t flag any
              foundations — skills looked age-appropriate throughout, so
              there&apos;s no program to build. Screen again later if things
              change.
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-black/[.08] p-6">
            <p className="leading-7 text-foreground/75">
              Their screening flagged {flagged.length} area
              {flagged.length === 1 ? "" : "s"}. The program will focus on the{" "}
              {preview.domains.length === 1
                ? "one that needs it most"
                : `top ${preview.domains.length}`}
              , with the most-affected coming round most often.
            </p>
            <ul className="mt-4 space-y-2">
              {sessionCounts(preview).map(({ domain, count }, i) => (
                <li
                  key={domain.id}
                  className="flex items-center gap-3 rounded-xl bg-msot-blue/[.05] px-3 py-2.5"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-msot-blue text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-msot-navy">
                    {domain.title}
                  </span>
                  <span className="shrink-0 text-xs text-foreground/50">
                    {count} {count === 1 ? "session" : "sessions"}
                  </span>
                </li>
              ))}
            </ul>
            {preview.deferred.length > 0 && (
              <p className="mt-3 text-sm text-foreground/55">
                Also flagged, held back so the child isn&apos;t working on too
                much at once (max {MAX_DOMAINS}):{" "}
                {preview.deferred.map((d) => d.title).join(", ")}.
              </p>
            )}
            <form action={build}>
              <button
                type="submit"
                className="mt-5 w-full rounded-full bg-msot-teal py-3 font-semibold text-white transition-colors hover:brightness-95"
              >
                Build the 10-week program →
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  // ── Program exists: show the timeline ──
  const { data: sessions } = await supabase
    .from("program_sessions")
    .select("week, observation")
    .eq("program_id", program.id)
    .order("week");

  const completedWeeks = (sessions ?? []).map((s) => s.week as number);
  const observations = Object.fromEntries(
    (sessions ?? []).map((s) => [s.week as number, s.observation as string | null]),
  );

  const built = buildProgram(program.domain_ids as string[]);
  const timelineWeeks = built.weeks.map((w) => ({
    week: w.week,
    domainTitle: w.domain.title,
    session: w.session,
  }));

  async function onComplete(week: number, observation: string) {
    "use server";
    await completeWeek(id, program!.id, week, observation);
  }
  async function onReopen(week: number) {
    "use server";
    await reopenWeek(id, program!.id, week);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {backLink}

      <p className="mt-4 text-sm font-medium text-msot-blue">10-week program</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-msot-navy">
        {student.initials} · {student.year_level}
      </h1>
      <p className="mt-2 text-foreground/60">
        Started{" "}
        {new Date(program.started_on).toLocaleDateString(undefined, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      {/* Focus areas */}
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {sessionCounts(built).map(({ domain, count }, i) => (
          <li
            key={domain.id}
            className="flex items-center gap-3 rounded-xl bg-msot-blue/[.05] px-3 py-2.5"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-msot-blue text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium text-msot-navy">
              {domain.title}
            </span>
            <span className="shrink-0 text-xs text-foreground/50">{count}</span>
          </li>
        ))}
      </ul>

      {/* How a session runs */}
      <div className="mt-8 rounded-2xl border border-black/[.08] px-5 py-5">
        <h2 className="font-semibold text-msot-navy">Every session</h2>
        <p className="mt-1.5 text-sm leading-6 text-foreground/65">{howToUse}</p>
        <p className="mt-3 rounded-xl bg-msot-cyan/10 px-3 py-2.5 text-center text-sm font-semibold text-msot-navy">
          {sessionShape.headline}
        </p>
        <ol className="mt-3 space-y-1.5">
          {sessionShape.steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm leading-6 text-foreground/75"
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-msot-blue/10 text-[10px] font-bold text-msot-blue">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-xl border-l-4 border-msot-red bg-msot-red/[.06] px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-msot-red">
            The essential rule
          </p>
          <p className="mt-1 text-sm leading-6 text-foreground/80">
            {essentialRule}
          </p>
        </div>
      </div>

      {/* The timeline */}
      <div className="mt-8">
        <ProgramTimeline
          weeks={timelineWeeks}
          completedWeeks={completedWeeks}
          observations={observations}
          onComplete={onComplete}
          onReopen={onReopen}
        />
      </div>

      {/* Monitoring + safety */}
      <details className="mt-8 rounded-2xl border border-black/[.08] px-5 py-4">
        <summary className="cursor-pointer font-semibold text-msot-navy">
          What to record, and staying safe
        </summary>
        <div className="mt-4 space-y-3">
          {progressMonitoring.map((row) => (
            <div key={row.record} className="rounded-xl bg-black/[.02] px-4 py-3">
              <p className="text-sm font-semibold text-msot-navy">
                {row.record}
              </p>
              <p className="mt-0.5 text-sm leading-6 text-foreground/70">
                {row.examples}
              </p>
              <p className="mt-1 text-xs italic text-foreground/50">
                {row.manageable}
              </p>
            </div>
          ))}
        </div>
        <ul className="mt-4 space-y-2">
          {safetyPrinciples.map((p, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm leading-6 text-foreground/75"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-msot-red" />
              {p}
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-6 rounded-2xl bg-msot-cyan/10 px-5 py-5">
        <h2 className="font-semibold text-msot-navy">
          End-of-program reflection
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-foreground/75">
          {endOfProgramReflection}
        </p>
      </div>
    </div>
  );
}
