import Link from "next/link";

/*
  The consistent way back up a level.

  Every signed-in page gets one of these in the same place, pointing at the
  page above it, so there is always an obvious way back to the dashboard
  without reaching for the browser's back button.
*/
export default function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-msot-blue"
    >
      <span aria-hidden>←</span>
      {children}
    </Link>
  );
}
