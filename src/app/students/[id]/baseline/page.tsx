import Link from "next/link";
import BackLink from "@/components/BackLink";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BaselineUpload from "@/components/BaselineUpload";
import { recordBaselinePhoto, deleteBaselinePhoto } from "./actions";
import { PROGRAMS_ENABLED } from "@/lib/beta";

/*
  Step 4: the baseline writing sample.

  We capture the same sample for every student so later photos can be compared
  against it: their name, then a pangram (a sentence using every letter of the
  alphabet), which shows every letter form in one short piece of writing.

  The photo is required before the program can be built — that's the point of
  a baseline. The "Build the Two Term program" button only appears once one has
  been taken.
*/

const WRITING_TASK = "The quick brown fox jumps over the lazy dog";

/** How many baseline images a student can have. */
const MAX_PHOTOS = 2;

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

  /*
    Two samples, not one: a name and a sentence rarely fit on one page in a
    way a phone can photograph legibly, and teachers often want a second
    angle or a second attempt. Oldest first, so the pair keeps the order it
    was captured in.
  */
  const { data: photoRows } = await supabase
    .from("baseline_photos")
    .select("id, storage_path, created_at")
    .eq("student_id", id)
    .order("created_at", { ascending: true })
    .limit(MAX_PHOTOS);

  const photos = photoRows ?? [];

  // The bucket is private, so we mint short-lived links to show the images.
  const signedPhotos = await Promise.all(
    photos.map(async (p) => {
      const { data: signed } = await supabase.storage
        .from("baselines")
        .createSignedUrl(p.storage_path, 60 * 60);
      return { ...p, url: signed?.signedUrl ?? null };
    }),
  );

  const hasPhoto = signedPhotos.length > 0;
  const roomForMore = signedPhotos.length < MAX_PHOTOS;

  async function handleUploaded(storagePath: string) {
    "use server";
    await recordBaselinePhoto(id, storagePath);
  }

  // Takes the id through the form, since there may now be more than one
  // photo on the page and each needs its own remove button.
  async function handleDelete(formData: FormData) {
    "use server";
    const photoId = String(formData.get("photoId") ?? "");
    if (photoId) await deleteBaselinePhoto(id, photoId);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <BackLink href={`/students/${id}`}>{student.initials}</BackLink>

      <p className="mt-4 text-sm font-medium text-msot-blue">
        Step 4 · Baseline
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-msot-navy">
        Baseline writing sample
      </h1>
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
            </span>
          </li>
        </ol>

        <p className="mt-6 rounded-xl bg-msot-cyan/10 px-4 py-3 text-sm leading-6 text-foreground/75">
          Please let your student copy this sentence with no corrections or
          prompts, to capture an accurate baseline.
        </p>
      </section>

      {/* Upload — up to MAX_PHOTOS samples */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-msot-navy">
          {hasPhoto ? "Baseline photos" : "Upload the photo"}
        </h2>
        <p className="mt-1 text-sm text-foreground/55">
          You can save up to {MAX_PHOTOS} — for example the name on one, the
          sentence on the other.
        </p>

        {hasPhoto && (
          <div className="mt-3 space-y-3">
            {signedPhotos.map((p, i) => (
              <div
                key={p.id}
                className="rounded-2xl border border-msot-teal/30 bg-msot-teal/[.05] p-4"
              >
                {p.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={p.url}
                    alt={`${student.initials}'s baseline writing sample ${i + 1}`}
                    className="mx-auto max-h-96 w-auto rounded-xl shadow-sm"
                  />
                ) : (
                  // The record exists but the file couldn't be signed for
                  // viewing — say so rather than showing nothing, which would
                  // look like the photo was never taken.
                  <p className="rounded-xl bg-msot-red/[.06] px-4 py-3 text-sm leading-6 text-foreground/75">
                    This image couldn&apos;t be loaded from storage. Remove it
                    and take it again.
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-foreground/60">
                    Photo {i + 1} · saved{" "}
                    {new Date(p.created_at).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <form action={handleDelete}>
                    <input type="hidden" name="photoId" value={p.id} />
                    <button
                      type="submit"
                      className="text-sm font-medium text-foreground/50 transition-colors hover:text-msot-red"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        {roomForMore && (
          <div className="mt-3">
            <BaselineUpload studentId={id} onUploaded={handleUploaded} />
          </div>
        )}
      </section>

      {/* Next step — only once a baseline exists */}
      <section className="mt-10">
        {hasPhoto ? (
          <div className="rounded-2xl bg-msot-teal/[.09] p-6 text-center">
            <h2 className="text-lg font-semibold text-msot-navy">
              {signedPhotos.length === 1 ? "Photo saved" : "Photos saved"}
            </h2>
            <p className="mx-auto mt-2 max-w-md leading-7 text-foreground/70">
              You can always come back to{" "}
              {signedPhotos.length === 1 ? "this" : "these"} — at the end of the
              program you&apos;ll compare {student.initials}&apos;s writing
              against it to see how far they&apos;ve come.
            </p>
            {/* During the beta this leads to the "coming soon" page rather
                than the program itself, so the label must not promise more
                than the next click delivers. See src/lib/beta.ts. */}
            <Link
              href={PROGRAMS_ENABLED ? `/students/${id}/program` : "/programs"}
              className="mt-5 inline-flex rounded-full bg-msot-teal px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              {PROGRAMS_ENABLED
                ? "Build the Two Term program →"
                : "About the Two Term program →"}
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/15 p-6 text-center">
            <p className="text-foreground/50">
              Add the baseline photo above to continue to the Two Term program.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
