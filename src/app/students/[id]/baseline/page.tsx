import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BaselineUpload from "@/components/BaselineUpload";
import { recordBaselinePhoto, deleteBaselinePhoto } from "./actions";

/*
  Step 4: the baseline writing sample.

  We capture the same sample for every student so later photos can be compared
  against it: their name, then a pangram (a sentence using every letter of the
  alphabet), which shows every letter form in one short piece of writing.

  The photo is required before the program can be built — that's the point of
  a baseline. The "Build the 10-week program" button only appears once one has
  been taken.
*/

const WRITING_TASK = "The quick brown fox jumps over the lazy dog";

export default async function BaselinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("id, initials, year_level")
    .eq("id", id)
    .single();
  if (!student) notFound();

  const { data: photo } = await supabase
    .from("baseline_photos")
    .select("id, storage_path, created_at")
    .eq("student_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // The bucket is private, so we mint a short-lived link to show the image.
  let photoUrl: string | null = null;
  if (photo) {
    const { data: signed } = await supabase.storage
      .from("baselines")
      .createSignedUrl(photo.storage_path, 60 * 60);
    photoUrl = signed?.signedUrl ?? null;
  }

  async function handleUploaded(storagePath: string) {
    "use server";
    await recordBaselinePhoto(id, storagePath);
  }

  async function handleDelete() {
    "use server";
    if (photo) await deleteBaselinePhoto(id, photo.id);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/students/${id}`}
        className="text-sm text-foreground/60 hover:text-msot-blue"
      >
        ← Back to {student.initials}
      </Link>

      <p className="mt-4 text-sm font-medium text-msot-blue">
        Step 4 · Baseline
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-msot-navy">
        Baseline writing sample
      </h1>
      <p className="mt-3 text-lg leading-8 text-foreground/70">
        Take one short sample of {student.initials}&apos;s handwriting before
        the program starts. In ten weeks you&apos;ll have something concrete to
        compare against.
      </p>

      {/* Instructions */}
      <section className="mt-8 rounded-2xl border border-black/[.08] p-6">
        <h2 className="font-semibold text-msot-navy">You&apos;ll need</h2>
        <ul className="mt-3 space-y-2">
          {["A piece of paper — lined if possible", "A pen or pencil"].map(
            (item) => (
              <li
                key={item}
                className="flex gap-3 leading-7 text-foreground/80"
              >
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-msot-cyan" />
                {item}
              </li>
            ),
          )}
        </ul>

        <h2 className="mt-6 font-semibold text-msot-navy">
          Ask your student to
        </h2>
        <ol className="mt-3 space-y-3">
          <li className="flex gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-msot-blue text-xs font-bold text-white">
              1
            </span>
            <span className="leading-7 text-foreground/80">
              Write their name
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-msot-blue text-xs font-bold text-white">
              2
            </span>
            <span className="leading-7 text-foreground/80">
              Write the sentence:
              <span className="mt-2 block rounded-xl bg-msot-yellow/15 px-4 py-3 text-lg font-medium text-msot-navy">
                &ldquo;{WRITING_TASK}&rdquo;
              </span>
              <span className="mt-2 block text-sm text-foreground/55">
                This sentence uses every letter of the alphabet, so one line
                shows you every letter form.
              </span>
            </span>
          </li>
        </ol>

        <p className="mt-6 rounded-xl bg-msot-cyan/10 px-4 py-3 text-sm leading-6 text-foreground/75">
          Let them write it their own way — no corrections, prompts or
          practice runs first. The point is to capture where they are today.
        </p>
      </section>

      {/* Upload */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-msot-navy">
          {photo ? "Baseline photo" : "Upload the photo"}
        </h2>

        {photo && photoUrl ? (
          <div className="mt-3 rounded-2xl border border-msot-teal/30 bg-msot-teal/[.05] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={`${student.initials}'s baseline writing sample`}
              className="mx-auto max-h-96 w-auto rounded-xl shadow-sm"
            />
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-foreground/60">
                Saved{" "}
                {new Date(photo.created_at).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <form action={handleDelete}>
                <button
                  type="submit"
                  className="text-sm font-medium text-foreground/50 transition-colors hover:text-msot-red"
                >
                  Replace photo
                </button>
              </form>
            </div>
          </div>
        ) : photo ? (
          // The record exists but the file couldn't be signed for viewing —
          // say so rather than showing an empty upload box, which would look
          // like the photo was never taken.
          <div className="mt-3 rounded-2xl border border-msot-red/30 bg-msot-red/[.06] p-5">
            <p className="font-semibold text-msot-navy">
              This photo can&apos;t be displayed
            </p>
            <p className="mt-1.5 leading-7 text-foreground/75">
              A baseline was saved for {student.initials}, but the image file
              couldn&apos;t be loaded from storage. Replace it to try again.
            </p>
            <form action={handleDelete}>
              <button
                type="submit"
                className="mt-4 rounded-full border border-msot-red/40 px-5 py-2 text-sm font-medium text-msot-red transition-colors hover:bg-msot-red/10"
              >
                Remove and re-take
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-3">
            <BaselineUpload studentId={id} onUploaded={handleUploaded} />
          </div>
        )}
      </section>

      {/* Next step — only once a baseline exists */}
      <section className="mt-10">
        {photo ? (
          <div className="rounded-2xl bg-msot-teal/[.09] p-6 text-center">
            <h2 className="text-lg font-semibold text-msot-navy">
              Baseline captured
            </h2>
            <p className="mx-auto mt-2 max-w-md leading-7 text-foreground/70">
              You&apos;re ready to start. The program is built from the
              foundations {student.initials}&apos;s screening flagged.
            </p>
            <Link
              href={`/students/${id}/program`}
              className="mt-5 inline-flex rounded-full bg-msot-teal px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Build the 10-week program →
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/15 p-6 text-center">
            <p className="text-foreground/50">
              Add the baseline photo above to continue to the 10-week program.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
