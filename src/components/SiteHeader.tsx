import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

/*
  SiteHeader — the brand bar shown on every page. `Link` is Next.js's version
  of an <a> tag: it navigates between pages instantly without a full reload.
  `Image` is Next.js's optimised <img>: it serves correctly sized, fast-loading
  versions of the logo automatically.

  This is an async Server Component: it runs on the server for every request,
  so it can ask Supabase who is logged in and swap the last button between
  "Log In" and "My Profile" accordingly.
*/
export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The two outlined nav pills share one long list of classes, so they live
  // in a constant rather than being repeated (and drifting apart later).
  const outlinePill =
    "rounded-full px-4 py-2 text-msot-blue ring-2 ring-inset ring-msot-blue/60 transition-colors hover:bg-msot-blue/[.08] hover:ring-msot-blue";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[.06] bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/msot-logo.png"
            alt="Making Sense — Occupational Therapy"
            width={912}
            height={298}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link href="/why-handwriting-matters" className={outlinePill}>
            Why Handwriting Matters
          </Link>
          <Link href="/programs" className={outlinePill}>
            Programs
          </Link>
          {/*
            Screen a Student points at the roster. Logged-out visitors are
            bounced to /login by the middleware, so this one link works for
            everyone without the header having to branch.
          */}
          <Link
            href="/students"
            className="rounded-full bg-msot-blue px-4 py-2 text-white transition-colors hover:bg-msot-navy"
          >
            Screen a Student
          </Link>
          {/*
            The account button never moves. Logged out it opens the login and
            sign-up portal; logged in it becomes the way back to your profile.
          */}
          <Link
            href={user ? "/profile" : "/login"}
            className="rounded-full bg-msot-teal px-4 py-2 text-white transition-colors hover:bg-msot-teal/85"
          >
            {user ? "My Profile" : "Log In"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
