import Link from "next/link";

/*
  Shown for any URL that doesn't exist, and wherever the code calls
  notFound() — a student id that isn't there, a screening that was deleted.
*/
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-sm font-semibold text-msot-blue">Page not found</p>
      <h1 className="mt-2 text-3xl font-bold text-msot-navy">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 leading-7 text-foreground/70">
        The link may be out of date, or the thing it pointed to may have been
        removed.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-msot-blue px-6 py-3 font-medium text-white transition-colors hover:bg-msot-navy"
        >
          Back to home
        </Link>
        <Link
          href="/students"
          className="rounded-full border border-black/10 px-6 py-3 font-medium text-msot-navy transition-colors hover:bg-black/[.03]"
        >
          My students
        </Link>
      </div>
    </div>
  );
}
