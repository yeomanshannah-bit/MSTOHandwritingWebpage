"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import Link from "next/link";

/*
  Shown when a page throws at runtime. Without this file Next.js falls back to
  its own raw error screen, which is fine for developers and alarming for a
  teacher halfway through a screening.

  `unstable_retry` is Next 16's replacement for `reset`: it re-fetches and
  re-renders the failed segment, so a transient hiccup (a dropped database
  connection, say) recovers without losing the rest of the page.
*/
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-msot-navy">
        Something went wrong
      </h1>
      <p className="mt-4 leading-7 text-foreground/70">
        Sorry — that didn&apos;t load. Nothing you had already saved has been
        lost. Try again, and if it keeps happening, let us know what you were
        doing at the time.
      </p>

      {/* The digest is the only handle on a server error whose details are
          deliberately hidden from the browser, so surface it for support. */}
      {error.digest && (
        <p className="mt-3 font-mono text-xs text-foreground/40">
          Reference: {error.digest}
        </p>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => unstable_retry()}
          className="rounded-full bg-msot-blue px-6 py-3 font-medium text-white transition-colors hover:bg-msot-navy"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-black/10 px-6 py-3 font-medium text-msot-navy transition-colors hover:bg-black/[.03]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
