import Link from "next/link";

/*
  Placeholder for step 4 (baseline photo upload). Keeps the "Continue to
  baseline" link working; we'll build real photo upload here next.
*/
export default async function BaselinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-msot-navy">Baseline photo</h1>
      <p className="mt-3 leading-7 text-foreground/70">
        This is where you&apos;ll upload a photo of the student writing the
        alphabet, then start their 10-week program.
      </p>
      <span className="mt-6 inline-block rounded-full bg-msot-yellow/20 px-4 py-1.5 text-sm font-medium text-msot-navy">
        Step 4 · coming next
      </span>
      <div className="mt-8">
        <Link
          href={`/students/${id}`}
          className="text-sm text-foreground/60 hover:text-msot-blue"
        >
          ← Back to student
        </Link>
      </div>
    </div>
  );
}
