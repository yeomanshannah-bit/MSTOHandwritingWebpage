import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { scoreScreening, type Responses } from "@/lib/screening";

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
    .select("initials, year_level")
    .eq("id", id)
    .single();

  const { data: screening } = await supabase
    .from("screenings")
    .select("responses, created_at")
    .eq("id", screeningId)
    .single();

  if (!student || !screening) notFound();

  // Recompute the summary from the stored answers (one source of truth).
  const result = scoreScreening(screening.responses as Responses);
  const { flaggedDomains, totals, domains, onTrack } = result;

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
        {student.initials} · {student.year_level}
      </h1>

      {/* Overall tally */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Tally color="bg-msot-teal" n={totals.green} label="Age-appropriate" />
        <Tally color="bg-msot-yellow" n={totals.yellow} label="Emerging" />
        <Tally color="bg-msot-red" n={totals.red} label="Not present" />
      </div>

      {/* Priority areas — every flagged domain, worst first */}
      <h2 className="mt-10 text-xl font-semibold text-msot-navy">
        Areas to focus on
      </h2>
      {!onTrack ? (
        <>
          <p className="mt-1 text-sm text-foreground/60">
            {flaggedDomains.length} area
            {flaggedDomains.length > 1 ? "s" : ""} flagged (any &ldquo;not
            present&rdquo;, or 2+ &ldquo;emerging&rdquo; skills).
          </p>
          <div className="mt-3 space-y-3">
            {flaggedDomains.map((d, i) => (
              <div
                key={d.id}
                className="rounded-xl border border-msot-blue/15 bg-msot-blue/[.04] p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-msot-blue text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-msot-navy">
                    {d.title}
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground/70">
                  {[
                    d.red > 0 &&
                      `${d.red} not present`,
                    d.yellow > 0 && `${d.yellow} emerging`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  {" — will be a focus of the program."}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-3 rounded-xl bg-msot-teal/[.08] p-4 text-foreground/80">
          No areas flagged — skills look age-appropriate across the board. 🎉
        </p>
      )}

      {/* Full breakdown */}
      <h2 className="mt-10 text-xl font-semibold text-msot-navy">
        Full breakdown
      </h2>
      <div className="mt-3 space-y-3">
        {domains.map((d) => {
          const totalSkills = d.green + d.yellow + d.red || 1;
          const pct = (n: number) => `${(n / totalSkills) * 100}%`;
          return (
            <div key={d.id}>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/80">{d.title}</span>
                <span className="text-foreground/50">
                  {d.green + d.yellow + d.red} skills
                </span>
              </div>
              <div className="mt-1 flex h-2.5 overflow-hidden rounded-full bg-black/5">
                <span className="bg-msot-teal" style={{ width: pct(d.green) }} />
                <span
                  className="bg-msot-yellow"
                  style={{ width: pct(d.yellow) }}
                />
                <span className="bg-msot-red" style={{ width: pct(d.red) }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Next step → baseline photo, then program (built next) */}
      <div className="mt-12 rounded-2xl bg-msot-teal/[.08] p-6">
        <h2 className="text-lg font-semibold text-msot-navy">Next step</h2>
        <p className="mt-2 text-foreground/70">
          Upload a baseline photo of {student.initials} writing the alphabet, so
          you can track progress across the 10-week program.
        </p>
        <Link
          href={`/students/${id}/baseline`}
          className="mt-4 inline-flex rounded-full bg-msot-teal px-5 py-2.5 font-medium text-white transition-colors hover:brightness-95"
        >
          Continue to baseline photo →
        </Link>
      </div>
    </div>
  );
}

function Tally({
  color,
  n,
  label,
}: {
  color: string;
  n: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-black/[.06] bg-white/70 p-4 text-center">
      <div className={`mx-auto h-3 w-3 rounded-full ${color}`} />
      <p className="mt-2 text-2xl font-bold text-msot-navy">{n}</p>
      <p className="text-xs text-foreground/60">{label}</p>
    </div>
  );
}
