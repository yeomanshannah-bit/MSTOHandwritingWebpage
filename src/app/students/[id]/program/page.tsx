import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  scoreScreening,
  getForm,
  suggestLetters,
  type Responses,
  type Shapes,
} from "@/lib/screening";
import { buildProgram } from "@/lib/programBuilder";
import {
  philosophy,
  howToUse,
  sessionShape,
  progressMonitoring,
  endOfProgramReflection,
  CONTENT_VERSION,
} from "@/lib/programContent";
import ProgramTimeline from "@/components/ProgramTimeline";
import { completeWeek, reopenWeek } from "./actions";

/** Small timer, shown beside each step's duration. */
function TimerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 10v3.5l2 1.5" />
      <path d="M9.5 2.5h5" />
    </svg>
  );
}

/*
  A student's 20-week program.

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
      .select("id, responses, form_id")
      .eq("student_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // The screener's foundation ids ARE the program's domain ids, so the
    // flagged list feeds straight in — worst first.
    const flagged = screening
      ? scoreScreening(
          screening.responses as Responses,
          getForm(screening.form_id as string | null),
        ).flaggedFoundations
      : [];
    const domainIds = flagged.map((f) => f.id);
    const preview = buildProgram(domainIds);

    /*
      There is no confirm-then-build step. Arriving here having screened and
      taken a baseline, a teacher has already said yes twice — a third button
      restating what they just chose only delayed the program. The reasoning
      that used to live on that screen now opens the program itself.

      Written inline rather than through createProgram(): server actions call
      revalidatePath, which cannot run while a page is rendering.
    */
    if (screening && preview.domains.length > 0) {
      const { error: createError } = await supabase.from("programs").insert({
        student_id: id,
        staff_id: user.id,
        screening_id: screening.id,
        domain_ids: domainIds,
        content_version: CONTENT_VERSION,
      });
      // On failure fall through to the states below rather than redirecting
      // into a loop that would try, and fail, all over again.
      if (!createError) redirect(`/students/${id}/program`);
    }

    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        {backLink}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-msot-navy">
          20-week program
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
          // Only reached if the insert above failed.
          <div className="mt-6 rounded-2xl border border-msot-red/30 bg-msot-red/[.06] p-6">
            <p className="leading-7 text-foreground/75">
              The program couldn&apos;t be created just now. Refresh the page to
              try again.
            </p>
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

  /*
    Which letters to teach first, carried over from the screening's
    pre-writing shape check. It belongs here rather than on the results page:
    it isn't a finding about the child, it's the first teaching decision of
    the program, so it opens the twenty weeks.
  */
  const { data: sourceScreening } = program.screening_id
    ? await supabase
        .from("screenings")
        .select("shapes")
        .eq("id", program.screening_id)
        .maybeSingle()
    : { data: null };
  const suggestion = suggestLetters((sourceScreening?.shapes ?? {}) as Shapes);

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

      <p className="mt-4 text-sm font-medium text-msot-blue">20-week program</p>
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


      {/* Before you start — how a session runs, and why the order is what it is */}
      <div className="mt-8 rounded-2xl border border-black/[.08] px-5 py-5">
        <h2 className="font-semibold text-msot-navy">Before you start</h2>
        <p className="mt-1.5 text-sm leading-6 text-foreground/65">{howToUse}</p>

        <p className="mt-5 text-sm font-semibold text-msot-navy">
          {sessionShape.headline}
        </p>
        <ol className="mt-3 space-y-2.5">
          {sessionShape.steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-xl bg-msot-blue/[.04] px-4 py-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-msot-blue text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-msot-navy">
                  {step.title}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-foreground/60">
                  <TimerIcon className="h-4 w-4 text-msot-blue" />
                  {step.timing}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-6 text-foreground/70">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-xl border-l-4 border-msot-teal bg-msot-teal/[.07] px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-msot-teal">
            {philosophy.title}
          </p>
          <p className="mt-1 text-sm leading-6 text-foreground/80">
            {philosophy.body}
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
          draftKey={program.id}
          weekOneIntro={
            suggestion.ready && suggestion.groups.length > 0 ? (
              <div className="mb-5 rounded-xl border border-msot-orange/25 bg-msot-orange/[.06] p-4">
                <p className="font-semibold text-msot-navy">
                  Letters to introduce first
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground/70">
                  Built from the pre-writing shapes {student.initials} can
                  already make — start here rather than at &ldquo;A&rdquo;.
                </p>
                <ul className="mt-3 space-y-3">
                  {suggestion.groups.map((g) => (
                    <li key={g.letters}>
                      <p className="font-mono text-lg tracking-wider text-msot-navy">
                        {g.letters}
                      </p>
                      <p className="text-xs text-foreground/60">{g.because}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          }
        />
      </div>

      {/* Monitoring + safety */}
      <details className="mt-8 rounded-2xl border border-black/[.08] px-5 py-4">
        <summary className="cursor-pointer font-semibold text-msot-navy">
          Prompts for your observation notes
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
