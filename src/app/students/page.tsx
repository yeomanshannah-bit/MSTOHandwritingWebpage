import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

/*
  The staff roster. A Server Component: it runs on the server, checks who's
  logged in, then reads THAT staff member's students from the database (Row
  Level Security guarantees they can't see anyone else's).
*/
export default async function StudentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: students } = await supabase
    .from("students")
    .select("id, initials, year_level, term, class_name, created_at")
    .order("created_at", { ascending: false });

  const hasStudents = students && students.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-msot-navy">
            Your students
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Signed in as {user.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      {hasStudents ? (
        <>
          <div className="mt-8 flex justify-end">
            <Link
              href="/students/new"
              className="rounded-full bg-msot-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-msot-navy"
            >
              + Add a student
            </Link>
          </div>

          <ul className="mt-4 space-y-3">
            {students.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/students/${s.id}`}
                  className="flex items-center gap-4 rounded-xl border border-black/[.06] bg-white/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-msot-cyan/15 font-bold text-msot-navy">
                    {s.initials}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-msot-navy">
                      {s.initials}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {/* Year level always shows; term and class only when
                          set, so older profiles don't render stray dots. */}
                      {[s.year_level, s.term, s.class_name]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span className="hidden text-xs text-foreground/40 sm:block">
                    Added{" "}
                    {new Date(s.created_at).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-foreground/40" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-msot-blue/30 bg-msot-blue/[.03] p-10 text-center">
          <p className="text-lg font-medium text-msot-navy">No students yet</p>
          <p className="mx-auto mt-2 max-w-sm text-foreground/60">
            Add a student to screen them across the handwriting skill areas and
            build their tailored 10-week program.
          </p>
          <Link
            href="/students/new"
            className="mt-6 inline-flex rounded-full bg-msot-blue px-5 py-2.5 font-medium text-white transition-colors hover:bg-msot-navy"
          >
            + Add a student
          </Link>
        </div>
      )}
    </div>
  );
}
