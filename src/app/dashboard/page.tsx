import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

/*
  The dashboard — home for a signed-in teacher.

  There is deliberately exactly one of these. It used to be called "my
  profile", which left two pages competing to be home: the profile and the
  student roster, both headed "Your students". A teacher who typo'd their
  email landed on the empty one and reasonably concluded their work was gone.
  So this is now plainly the dashboard, every signed-in page has a link back
  to it, and the roster is one card on it rather than a rival front door.

  A Server Component, so the check for "who is this?" happens before any HTML
  is sent. The proxy already guards this path; the redirect here is the
  belt-and-braces second check.
*/
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // How many students this account has, to show on the card below. Row Level
  // Security means this only ever counts your own.
  const { count } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true });

  const { data: feedback } = await supabase
    .from("teacher_feedback")
    .select("submitted_at")
    .eq("staff_id", user.id)
    .maybeSingle();
  const feedbackGiven = Boolean(feedback?.submitted_at);

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-msot-navy">
            Dashboard
          </h1>
          <p className="mt-1 text-foreground/70">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
          {memberSince && (
            <p className="mt-0.5 text-sm text-foreground/50">
              Account created {memberSince}
            </p>
          )}
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 space-y-3">
        <Link
          href="/students"
          className="flex items-center gap-4 rounded-xl border border-black/[.06] bg-white/70 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex-1">
            <p className="font-semibold text-msot-navy">Your students</p>
            <p className="mt-0.5 text-sm text-foreground/60">
              {count
                ? `${count} student${count === 1 ? "" : "s"} on your roster`
                : "No students yet — add your first one"}
            </p>
          </div>
          <span className="text-foreground/40" aria-hidden>
            →
          </span>
        </Link>

        <Link
          href="/students/new"
          className="flex items-center gap-4 rounded-xl border border-black/[.06] bg-white/70 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex-1">
            <p className="font-semibold text-msot-navy">
              Screen another student
            </p>
            <p className="mt-0.5 text-sm text-foreground/60">
              Add a student and work through the screening tool
            </p>
          </div>
          <span className="text-foreground/40" aria-hidden>
            →
          </span>
        </Link>

        {/* Kept on the profile as well as after a screening, so a teacher who
            put it off has somewhere obvious to come back to. */}
        <Link
          href="/feedback"
          className="flex items-center gap-4 rounded-xl border border-msot-pink/40 bg-msot-pink/[.10] p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex-1">
            <p className="font-semibold text-msot-navy">
              {feedbackGiven
                ? "Your feedback on the screener"
                : "Two-minute feedback on the screener"}
            </p>
            <p className="mt-0.5 text-sm text-foreground/60">
              {feedbackGiven
                ? "Thank you — you can still change your answers"
                : "Six quick questions that shape the next version"}
            </p>
          </div>
          <span className="text-foreground/40" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
