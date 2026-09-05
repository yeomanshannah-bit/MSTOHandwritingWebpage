import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import NavMenu, { type NavMenuItem } from "@/components/NavMenu";

/*
  The supporting reading, in the order it appears under "Learn More".

  Two things are deliberately not in here. The model keeps its own pill — it
  is the approach the whole site is built on. Screen a Student keeps its own
  button because it is an action, not something to read: the bar shows what
  you can *do*, and groups what you can read behind one pill.
*/
const learnItems: NavMenuItem[] = [
  {
    href: "/why-handwriting-matters",
    label: "Why Handwriting Matters",
    blurb: "The case for handwriting in a digital age.",
  },
  {
    href: "/iceberg",
    label: "The Iceberg",
    blurb: "The eight foundations that sit beneath handwriting.",
  },
  {
    href: "/the-evidence-base",
    label: "The Evidence Base",
    blurb: "The research behind the model.",
  },
  {
    href: "/programs",
    label: "Programs",
    blurb: "Check out a preview of our programs coming soon!",
  },
];

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
      {/*
        Full-bleed rather than capped at the page's max-w-5xl: the logo sits
        hard left and the nav hard right, using the whole width of the screen.
        Padding grows on wider viewports so neither end is jammed against the
        edge of the glass.
      */}
      <div className="flex w-full items-center justify-between gap-4 px-6 py-3 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/making-sense-together-header.png"
            alt="Making Sense Together — support, connect, grow"
            width={1010}
            height={837}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        {/* `flex-wrap` so a narrow window drops items onto a second row
            instead of overflowing the bar. */}
        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm font-medium">
          <Link href="/the-handwriting-model" className={outlinePill}>
            The Handwriting Model
          </Link>
          {/*
            The supporting articles live behind one pill so the bar does not
            grow a tab per page.
          */}
          <NavMenu
            label="Learn More"
            className={outlinePill}
            items={learnItems}
          />
          {/*
            Screen a Student points at the roster. Logged-out visitors are
            bounced to /login by the proxy, so this one link works for
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
            sign-up portal; logged in it is the way back to the dashboard —
            the one home for a signed-in teacher.
          */}
          <Link
            href={user ? "/dashboard" : "/login"}
            className="rounded-full bg-msot-teal px-4 py-2 text-white transition-colors hover:bg-msot-teal/85"
          >
            {user ? "My Dashboard" : "Log In"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
