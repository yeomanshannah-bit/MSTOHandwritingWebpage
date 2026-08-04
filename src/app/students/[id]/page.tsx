import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/*
  One student's hub page. The [id] folder name makes this a dynamic route:
  /students/<any-id> lands here, and `params` carries that id. In Next.js 16
  params arrives as a Promise, so we await it.
*/
export default async function StudentPage({
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
    .select("id, initials, year_level, term, class_name, created_at")
    .eq("id", id)
    .single();

  // No student (wrong id, or not ours — RLS hides other staff's students).
  if (!student) notFound();

  const { data: screenings } = await supabase
    .from("screenings")
    .select("id, created_at")
    .eq("student_id", id)
    .order("created_at", { ascending: false });

  const hasScreenings = screenings && screenings.length > 0;

  // The flow is screen → baseline → program, so the card below points at
  // whichever step is actually next.
  const { data: baseline } = await supabase
    .from("baseline_photos")
    .select("id")
    .eq("student_id", id)
    .limit(1)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/students"
        className="text-sm text-foreground/60 hover:text-msot-blue"
      >
        ← Back to students
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-msot-cyan/15 text-lg font-bold text-msot-navy">
          {student.initials}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-msot-navy">
            {student.initials}
          </h1>
          <p className="text-foreground/60">
            {[student.year_level, student.term, student.class_name]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="text-sm text-foreground/45">
            Profile created{" "}
            {new Date(student.created_at).toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <Link
        href={`/students/${id}/screen`}
        className="mt-8 flex items-center justify-between rounded-2xl bg-msot-blue p-6 text-white transition-colors hover:bg-msot-navy"
      >
        <div>
          <p className="text-lg font-semibold">
            {hasScreenings ? "Screen again" : "Start screening"}
          </p>
          <p className="text-sm text-white/80">
            Rate the handwriting skill areas to build a tailored program.
          </p>
        </div>
        <span aria-hidden className="text-2xl">
          →
        </span>
      </Link>

      <Link
        href={`/students/${id}/${baseline ? "program" : "baseline"}`}
        className="mt-3 flex items-center justify-between rounded-2xl border border-msot-teal/30 bg-msot-teal/[.07] p-6 transition-colors hover:bg-msot-teal/[.12]"
      >
        <div>
          <p className="text-lg font-semibold text-msot-navy">
            {baseline ? "10-week program" : "Baseline writing sample"}
          </p>
          <p className="text-sm text-foreground/65">
            {baseline
              ? "Work through one session a week, unlocking as you go."
              : "Capture a writing sample before the program starts."}
          </p>
        </div>
        <span aria-hidden className="text-2xl text-msot-teal">
          →
        </span>
      </Link>

      <h2 className="mt-10 text-lg font-semibold text-msot-navy">
        Past screenings
      </h2>
      {hasScreenings ? (
        <ul className="mt-3 space-y-2">
          {screenings.map((sc) => (
            <li key={sc.id}>
              <Link
                href={`/students/${id}/results/${sc.id}`}
                className="flex items-center justify-between rounded-xl border border-black/[.06] bg-white/70 px-4 py-3 hover:shadow-sm"
              >
                <span className="text-msot-navy">
                  {new Date(sc.created_at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-sm text-msot-blue">View results →</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-foreground/60">
          No screenings yet — start one above.
        </p>
      )}
    </div>
  );
}
