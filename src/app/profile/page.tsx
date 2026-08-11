import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

/*
  The account portal. This is the page the green header button leads to once
  you're logged in — the place to come back to after being away, showing who
  you're signed in as and the ways on into your work.

  A Server Component, so the check for "who is this?" happens before any HTML
  is sent. The middleware already guards this path; the redirect here is the
  belt-and-braces second check.
*/
export default async function ProfilePage() {
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
            My profile
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
            <p className="font-semibold text-msot-navy">Screen a student</p>
            <p className="mt-0.5 text-sm text-foreground/60">
              Add a student and work through the screening tool
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
