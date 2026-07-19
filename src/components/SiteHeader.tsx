import Link from "next/link";
import Image from "next/image";

/*
  SiteHeader — the brand bar shown on every page. `Link` is Next.js's version
  of an <a> tag: it navigates between pages instantly without a full reload.
  `Image` is Next.js's optimised <img>: it serves correctly sized, fast-loading
  versions of the logo automatically.
*/
export default function SiteHeader() {
  return (
    <header className="w-full border-b border-black/[.06] bg-white/80 backdrop-blur">
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

        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link
            href="/why-handwriting-matters"
            className="text-foreground/70 transition-colors hover:text-msot-blue"
          >
            Why it matters
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-msot-blue px-4 py-2 text-white transition-colors hover:bg-msot-navy"
          >
            Screen a student
          </Link>
        </nav>
      </div>
    </header>
  );
}
