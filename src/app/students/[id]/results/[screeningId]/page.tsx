import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PaperPencilMark from "@/components/PaperPencilMark";
import {
  scoreScreening,
  statusLabel,
  closingNote,
  confidenceNote,
  type Responses,
  type FoundationStatus,
} from "@/lib/screening";

/*
  The results read in the same order as the screener: what was noticed at the
  surface, then the eight foundations beneath it, then the confidence thread.
*/

/*
  The four status colours, fixed by the scoring rule:
    red    above 50%  — needs support
    yellow at 50%     — monitor
    green  below 50%  — age appropriate
    blue   too few answers — not assessed
*/
const statusStyle: Record<FoundationStatus, string> = {
  support: "bg-msot-red/10 text-msot-red",
  monitor: "bg-msot-yellow/25 text-msot-navy",
  clear: "bg-msot-teal/15 text-msot-teal",
  "not-assessed": "bg-msot-blue/10 text-msot-blue",
};

type Reflection = {
  recommendations?: string[];
  strengths?: string;
  comments?: string;
};

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string; screeningId: string }>;
}) {
  const { id, screeningId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("initials, year_level, term, class_name")
    .eq("id", id)
    .single();

  const { data: screening } = await supabase
    .from("screenings")
    .select("responses, reflection, created_at")
    .eq("id", screeningId)
    .single();

  if (!student || !screening) notFound();

  // Recompute the summary from the stored answers (one source of truth).
  const result = scoreScreening(screening.responses as Responses);
  const {
    notice,
    foundations,
    flaggedFoundations,
    confidence,
    notAssessedFoundations,
    onTrack,
  } = result;

  const reflection = (screening.reflection ?? {}) as Reflection;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/students/${id}`}
        className="text-sm text-foreground/60 hover:text-msot-blue"
      >
        ← Back to {student.initials}
      </Link>

      <p className="mt-4 text-sm font-medium text-msot-blue">
        Screening results
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-msot-navy">
        {student.initials}
      </h1>
      <p className="mt-1 text-foreground/60">
        {[student.year_level, student.term, student.class_name]
          .filter(Boolean)
          .join(" · ")}
        {" · screened "}
        {new Date(screening.created_at).toLocaleDateString(undefined, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      {/* ── Part 1 · the tip ─────────────────────────────────────── */}
      <h2 className="mt-10 text-xl font-semibold text-msot-navy">
        What you can see
      </h2>
      <div
        className={`mt-3 rounded-2xl p-5 ${
          notice.affectingParticipation
            ? "bg-msot-blue/[.06]"
            : "bg-msot-teal/[.08]"
        }`}
      >
        <p className="font-medium text-msot-navy">
          {notice.affectingParticipation
            ? "Handwriting appears to be affecting participation."
            : "Handwriting does not currently appear to be affecting participation."}
        </p>
        <p className="mt-1.5 text-sm text-foreground/70">
          {notice.often} often · {notice.sometimes} sometimes ·{" "}
          {notice.rarely} rarely
          {notice.unsure > 0 && ` · ${notice.unsure} not sure`}
        </p>
        {/*
          Part 1 trips on a single "sometimes", so the panel says how firmly.
          Without this, one occasional observation and eight persistent ones
          would read identically — true in both cases, but not the same news.
        */}
        {notice.affectingParticipation && (
          <p className="mt-2 text-sm leading-6 text-foreground/70">
            {notice.often === 0
              ? "This is an early signal — nothing was rated “often”, but any impact on participation is worth looking underneath for."
              : `Handwriting is persistently affecting participation: ${notice.often} statement${notice.often > 1 ? "s were" : " was"} rated “often”.`}
          </p>
        )}
      </div>

      {/* ── Part 2 · the foundations ─────────────────────────────── */}
      <h2 className="mt-10 text-xl font-semibold text-msot-navy">
        Foundation areas
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[26rem] text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-foreground/50">
              <th className="py-2 pr-2 font-semibold">Foundation</th>
              <th className="px-2 py-2 text-center font-semibold">Score</th>
              <th className="px-2 py-2 text-center font-semibold">Answered</th>
              <th className="py-2 pl-2 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {foundations.map((f) => (
              <tr key={f.id} className="border-b border-black/[.05]">
                <td className="py-2.5 pr-2 text-foreground/85">
                  <span className="text-foreground/40">{f.number}. </span>
                  {f.title}
                </td>
                <td className="px-2 py-2.5 text-center tabular-nums text-foreground/70">
                  {/* Rounded for reading; the status itself is decided on the
                      exact value, so a 50% shown here is a true 50%. */}
                  {f.percent === null ? "—" : `${Math.round(f.percent)}%`}
                </td>
                <td className="px-2 py-2.5 text-center tabular-nums text-foreground/70">
                  {f.rated} of {f.total}
                </td>
                <td className="py-2.5 pl-2 text-right">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[f.status]}`}
                  >
                    {statusLabel[f.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* The rule, stated plainly, so the colours never need decoding. Each
          swatch matches the pill in the row above it. */}
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-foreground/60">
        {[
          ["bg-msot-red", "Above 50% — needs support"],
          ["bg-msot-yellow", "50% — monitor"],
          ["bg-msot-teal", "Below 50% — age appropriate"],
          ["bg-msot-blue", "Too few answers — not assessed"],
        ].map(([dot, text]) => (
          <li key={text} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />
            {text}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs leading-5 text-foreground/50">
        A score is the concern rated in that foundation as a percentage of the
        most its answered statements could carry (&ldquo;often&rdquo; counts
        double &ldquo;sometimes&rdquo;). &ldquo;Not sure&rdquo; is left out of
        both sides, so skipping a statement neither helps nor hurts the score.
      </p>

      {/* Priority areas — every flagged foundation, worst first */}
      <h2 className="mt-10 text-xl font-semibold text-msot-navy">
        Areas to focus on
      </h2>
      {!onTrack ? (
        <>
          <p className="mt-1 text-sm text-foreground/60">
            {flaggedFoundations.length} foundation
            {flaggedFoundations.length > 1 ? "s" : ""} flagged. The program
            draws on these, most-affected first.
          </p>
          <div className="mt-3 space-y-3">
            {flaggedFoundations.map((f, i) => (
              <div
                key={f.id}
                className="rounded-xl border border-msot-blue/15 bg-msot-blue/[.04] p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-msot-blue text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-msot-navy">
                    {f.title}
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground/70">
                  {f.percent === null ? "" : `${Math.round(f.percent)}% — `}
                  {statusLabel[f.status].toLowerCase()}
                  {" ("}
                  {[
                    f.often > 0 && `${f.often} often`,
                    f.sometimes > 0 && `${f.sometimes} sometimes`,
                    f.rarely > 0 && `${f.rarely} rarely`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  {")."}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-3 rounded-xl bg-msot-teal/[.08] p-4 text-foreground/80">
          Every foundation scored below 50% — nothing beneath the surface stood
          out. 🎉
        </p>
      )}

      {/*
        Not-assessed foundations are reported separately from the flagged ones.
        They are not a finding either way, and saying so matters most when
        nothing was flagged — a quiet result on a half-finished screener is not
        the same as a child on track.
      */}
      {notAssessedFoundations.length > 0 && (
        <p className="mt-3 rounded-xl bg-msot-blue/[.06] p-4 text-sm leading-6 text-foreground/75">
          <span className="font-medium text-msot-navy">
            {notAssessedFoundations.length} foundation
            {notAssessedFoundations.length > 1 ? "s were" : " was"} not
            assessed
          </span>{" "}
          — {notAssessedFoundations.map((f) => f.title).join(", ")}. Fewer than
          half the statements were rated, so there is no score either way.
          Screen again once you have watched for these in class.
        </p>
      )}

      {/* "Letters to introduce first" is not shown here. It is a teaching
          decision, not a screening finding — it now opens the program. */}

      {/* ── Part 3 · confidence ──────────────────────────────────── */}
      <h2 className="mt-10 text-xl font-semibold text-msot-navy">
        Writing confidence
      </h2>
      <div className="mt-3 rounded-2xl bg-msot-pink/[.07] p-5">
        {/*
          Graded the same way as Part 1: a firm line when something was seen
          persistently, a softer one when it was only occasional. A child with
          two passing wobbles shouldn't read like a child who says "I can't
          write" every day.
        */}
        <p className="font-medium text-msot-navy">
          {confidence.often >= 1
            ? "How this child feels about writing needs attention alongside the foundations."
            : confidence.raised
              ? "Some early signs of frustration or reluctance — worth watching."
              : "No particular concerns about how this child feels about writing."}
        </p>
        <p className="mt-1.5 text-sm text-foreground/70">
          {confidence.often} often · {confidence.sometimes} sometimes
        </p>

        {/*
          The verdict says what to think; this says what was actually seen.
          Part 3 is here to get staff thinking about the distress handwriting
          can cause, and the specifics do that work — a label doesn't.
        */}
        {confidence.noticed.length > 0 && (
          <>
            <p className="mt-4 text-sm font-medium text-msot-navy">
              What you noticed about {student.initials}
            </p>
            <ul className="mt-2 space-y-1.5">
              {confidence.noticed.map((n) => (
                <li
                  key={n.label}
                  className="flex items-baseline gap-2 text-sm leading-6 text-foreground/75"
                >
                  <span className="text-msot-pink" aria-hidden>
                    •
                  </span>
                  <span className="flex-1">{n.label}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      n.rating === "often"
                        ? "bg-msot-red/10 text-msot-red"
                        : "bg-msot-yellow/25 text-msot-navy"
                    }`}
                  >
                    {n.rating}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-4 text-sm leading-6 text-foreground/60">
          {confidenceNote}
        </p>
      </div>

      {/* ── The teacher's own read ───────────────────────────────── */}
      {(reflection.recommendations?.length ||
        reflection.strengths ||
        reflection.comments) && (
        <>
          <h2 className="mt-10 text-xl font-semibold text-msot-navy">
            Teacher notes
          </h2>
          {/* The recommendation checklist was retired from the screener, but
              older screenings may still carry one — so it's rendered if present
              rather than dropped. */}
          {reflection.recommendations?.length ? (
            <ul className="mt-3 space-y-2">
              {reflection.recommendations.map((r) => (
                <li
                  key={r}
                  className="rounded-xl border border-black/[.08] bg-white/70 px-4 py-3 text-sm text-foreground/80"
                >
                  {r}
                </li>
              ))}
            </ul>
          ) : null}
          {reflection.strengths && (
            <div className="mt-4">
              <p className="text-sm font-medium text-msot-navy">
                Strengths observed
              </p>
              <p className="mt-1 whitespace-pre-line text-foreground/75">
                {reflection.strengths}
              </p>
            </div>
          )}
          {reflection.comments && (
            <div className="mt-4">
              <p className="text-sm font-medium text-msot-navy">
                Additional comments
              </p>
              <p className="mt-1 whitespace-pre-line text-foreground/75">
                {reflection.comments}
              </p>
            </div>
          )}
        </>
      )}

      {/*
        The turn from findings to action, in the platform's standard green
        panel — the same treatment as "Concerned about a particular student?"
        on the article, so an offer to take the next step always looks the
        same wherever it appears.

        The baseline photo is not mentioned here; it is explained on the page
        the button leads to.

        `relative` so the mark can sit in the bottom-right corner.
      */}
      <div className="relative mt-12 rounded-2xl border border-msot-teal/25 bg-msot-teal/[.06] p-7">
        <h2 className="text-2xl font-bold leading-snug text-msot-navy">
          Let&apos;s build {student.initials} a program
        </h2>
        <p className="mt-2 max-w-lg leading-7 text-foreground/70">
          A self-paced 10-week program with strategies specific to your
          student&apos;s needs.
        </p>
        <Link
          href={`/students/${id}/baseline`}
          className="mt-6 inline-flex rounded-full bg-msot-teal px-6 py-3 font-medium text-white transition-colors hover:brightness-95"
        >
          Build a program →
        </Link>

        <PaperPencilMark className="pointer-events-none absolute bottom-6 right-6 h-14 w-14" />
      </div>

      {/* Plain closing note — a caveat, not a callout. No panel, no tint. */}
      <p className="mt-14 max-w-2xl text-sm leading-6 text-foreground/60">
        {closingNote}
      </p>
    </div>
  );
}
