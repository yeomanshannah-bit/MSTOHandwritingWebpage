import Link from "next/link";
import Image from "next/image";
import IcebergModel from "@/components/IcebergModel";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      {/* Hero */}
      <section className="flex items-center justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-msot-navy sm:text-5xl">
            Helping every child build confident handwriting.
          </h1>
          <p className="mt-5 text-lg leading-8 text-foreground/70">
            Evidence-based guidance on why handwriting matters, a screening
            tool, and a tailored 10-week program to support the students in
            your care.
          </p>
          <p className="mt-4 text-lg leading-8 text-foreground/70">
            Built on the foundation of 20 years of childhood occupational
            therapy.
          </p>
        </div>

        {/* Brand confetti mark — hidden on small screens so it never crowds
            the text; shown alongside the headline on wider screens. */}
        <Image
          src="/brand/msot-mark.png"
          alt=""
          width={350}
          height={414}
          priority
          className="hidden h-44 w-auto shrink-0 lg:block"
        />
      </section>

      {/* Two entry points */}
      <section className="mt-14 grid gap-6 sm:grid-cols-2">
        <EntryCard
          href="/why-handwriting-matters"
          accent="msot-blue"
          eyebrow="Free · No account needed"
          title="Why handwriting matters"
          body="The case for handwriting — academic benefits, brain & memory, literacy links, and confidence."
          cta="Read the guide"
        />
        <EntryCard
          href="/login"
          accent="msot-teal"
          eyebrow="For school support staff"
          title="Screen a student"
          body="Log in to screen a student across the foundational skill areas, then follow a personalised 10-week program."
          cta="Log in to start"
        />
      </section>

      {/* Scroll cue into the education section */}
      <p className="mt-14 text-center text-sm text-foreground/50">
        Scroll to learn why handwriting matters ↓
      </p>

      {/* Education: the iceberg model */}
      <IcebergModel />
    </div>
  );
}

/*
  EntryCard — a small reusable card. Defining it in the same file keeps step 1
  simple; we can move it to its own file later if we reuse it elsewhere.
  `accent` is a brand colour name so each card can carry a different tone.
*/
function EntryCard({
  href,
  accent,
  eyebrow,
  title,
  body,
  cta,
}: {
  href: string;
  accent: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-black/[.06] bg-white/70 p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: `var(--color-${accent})` }}
      >
        {eyebrow}
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-msot-navy">{title}</h2>
      <p className="mt-3 flex-1 leading-7 text-foreground/70">{body}</p>
      <span
        className="mt-6 inline-flex items-center gap-1 font-medium transition-transform group-hover:translate-x-0.5"
        style={{ color: `var(--color-${accent})` }}
      >
        {cta} <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
