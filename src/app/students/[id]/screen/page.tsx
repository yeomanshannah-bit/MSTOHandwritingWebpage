"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ShapeGlyph from "@/components/ShapeGlyph";
import {
  noticeItems,
  foundations,
  confidenceItems,
  preWritingShapes,
  shapeOptions,
  ratingOptions,
  allItemIds,
  scoreScreening,
  suggestLetters,
  senseIntro,
  ratingGuidance,
  yearOneGuidance,
  shapeCheckIntro,
  shapeCheckHint,
  confidenceNote,
  recommendationOptions,
  closingNote,
  SHAPE_CHECK_AFTER,
  type Rating,
  type Responses,
  type ShapeRating,
  type Shapes,
  type Item,
} from "@/lib/screening";

/*
  The screener reads as the iceberg does — you descend it. Part 1 is the tip
  above the waterline, Part 2 is the eight foundations below it, Part 3 is the
  thread running through the whole thing. The waterline is a real divider on
  the page, not just a heading.
*/

// Each option keeps its colour at all times so the scale reads at a glance:
// calm for "rarely", warm for "often". `idle` is the soft tint, `chosen` the
// filled state.
const idleStyle: Record<Rating, string> = {
  rarely: "border-msot-teal/40 bg-msot-teal/10 text-msot-teal hover:bg-msot-teal/20",
  sometimes:
    "border-msot-yellow/60 bg-msot-yellow/15 text-msot-navy hover:bg-msot-yellow/25",
  often: "border-msot-red/40 bg-msot-red/10 text-msot-red hover:bg-msot-red/20",
  unsure:
    "border-black/15 bg-black/[.03] text-foreground/55 hover:bg-black/[.06]",
};
const chosenStyle: Record<Rating, string> = {
  rarely: "border-msot-teal bg-msot-teal text-white ring-2 ring-msot-teal/30",
  sometimes:
    "border-msot-yellow bg-msot-yellow text-msot-navy ring-2 ring-msot-yellow/40",
  often: "border-msot-red bg-msot-red text-white ring-2 ring-msot-red/30",
  unsure:
    "border-foreground/50 bg-foreground/60 text-white ring-2 ring-foreground/20",
};
const dotStyle: Record<Rating, string> = {
  rarely: "bg-msot-teal",
  sometimes: "bg-msot-yellow",
  often: "bg-msot-red",
  unsure: "bg-foreground/40",
};

export default function ScreenPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  // `responses` remembers every frequency choice: { "postural-control-2": "often" }
  const [responses, setResponses] = useState<Responses>({});
  // The shape check is a different scale, so it's kept separately.
  const [shapes, setShapes] = useState<Shapes>({});
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [strengths, setStrengths] = useState("");
  const [comments, setComments] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answered = Object.keys(responses).length;
  const total = allItemIds.length;
  const complete = answered === total;

  // Live scoring drives the Part 1 gate and the shape suggestion.
  const result = scoreScreening(responses);
  const suggestion = suggestLetters(shapes);

  const noticeAnswered = noticeItems.every((i) => responses[i.id]);

  function choose(itemId: string, rating: Rating) {
    setResponses((prev) => ({ ...prev, [itemId]: rating }));
  }

  function chooseShape(shapeId: string, rating: ShapeRating) {
    setShapes((prev) => ({ ...prev, [shapeId]: rating }));
  }

  function toggleRecommendation(value: string) {
    setRecommendations((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value],
    );
  }

  async function handleSubmit() {
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Work out the results now, and store the answers alongside the summary.
    const results = scoreScreening(responses);
    const { data, error } = await supabase
      .from("screenings")
      .insert({
        student_id: id,
        staff_id: user.id,
        responses,
        results,
        shapes,
        reflection: {
          recommendations,
          strengths: strengths.trim(),
          comments: comments.trim(),
        },
      })
      .select("id")
      .single();

    if (error || !data) {
      setError(error?.message ?? "Could not save the screening.");
      setBusy(false);
      return;
    }

    router.push(`/students/${id}/results/${data.id}`);
    router.refresh();
  }

  /** One rateable statement with its four frequency buttons. */
  function ItemRow({ item }: { item: Item }) {
    return (
      <div className="rounded-xl border border-black/[.06] bg-white/70 p-4">
        <p className="text-foreground/90">{item.label}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ratingOptions.map((o) => {
            const isChosen = responses[item.id] === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => choose(item.id, o.value)}
                aria-pressed={isChosen}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isChosen ? chosenStyle[o.value] : idleStyle[o.value]
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 pb-28">
      <Link
        href={`/students/${id}`}
        className="text-sm text-foreground/60 hover:text-msot-blue"
      >
        ← Back to student
      </Link>

      <p className="mt-4 text-sm font-medium text-msot-blue">
        The Handwriting Iceberg Screener
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-msot-navy">
        Screening
      </h1>

      {/* Sense sets up the iceberg frame. Text-only for now — his artwork
          replaces the badge when the assets land. */}
      <div className="mt-6 flex gap-4 rounded-2xl border border-msot-cyan/25 bg-msot-cyan/[.07] p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-msot-cyan/25 text-xs font-bold text-msot-navy">
          Sense
        </span>
        <p className="text-sm leading-6 text-foreground/80">{senseIntro}</p>
      </div>

      <div className="mt-5 space-y-3 rounded-xl bg-black/[.03] px-4 py-3.5 text-sm">
        <p className="text-foreground/80">{ratingGuidance}</p>
        {/* Legend so the scale is unambiguous */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {ratingOptions.map((o) => (
            <span key={o.value} className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${dotStyle[o.value]}`} />
              <span className="text-foreground/80">
                {o.label}
                {o.hint && (
                  <span className="text-foreground/50"> — {o.hint}</span>
                )}
              </span>
            </span>
          ))}
        </div>
        <p className="border-t border-black/[.06] pt-3 text-foreground/70">
          {yearOneGuidance}
        </p>
      </div>

      {/* ── PART 1 · NOTICE — above the waterline ───────────────── */}
      <PartHeading
        step={1}
        eyebrow="Part 1 · Notice"
        title="Is handwriting affecting participation?"
        caption="the tip of the iceberg"
      />
      <div className="mt-4 space-y-3">
        {noticeItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* The waterline. Everything below it is the submerged mass. */}
      <div className="mt-10" aria-hidden>
        <div className="h-px bg-gradient-to-r from-transparent via-msot-blue/50 to-transparent" />
        <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-msot-blue/70">
          Beneath the surface
        </p>
      </div>

      {/* Part 1 decides whether the foundations are worth completing — we say
          so rather than hiding them, since a teacher may want to fill them in
          regardless. */}
      {noticeAnswered && (
        <p
          className={`mt-4 rounded-xl p-4 text-sm ${
            result.notice.affectingParticipation
              ? "bg-msot-blue/[.06] text-foreground/80"
              : "bg-msot-teal/[.08] text-foreground/80"
          }`}
        >
          {result.notice.affectingParticipation
            ? "Handwriting does appear to be affecting participation — complete the eight foundations below to see what may be contributing."
            : "Part 1 suggests handwriting isn't currently affecting participation. You can still complete the foundations below if you'd like a fuller picture."}
        </p>
      )}

      {/* ── PART 2 · UNDERSTAND — the eight foundations ─────────── */}
      <PartHeading
        step={2}
        eyebrow="Part 2 · Understand"
        title="What may be contributing?"
        caption="the eight foundations beneath the surface"
      />

      <div className="mt-4 space-y-10">
        {foundations.map((f) => {
          const score = result.foundations.find((s) => s.id === f.id)!;
          const rated = f.items.filter((i) => responses[i.id]).length;
          return (
            <section key={f.id}>
              <div className="flex items-baseline gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-msot-navy text-sm font-bold text-white">
                  {f.number}
                </span>
                <h2 className="flex-1 text-lg font-semibold text-msot-navy">
                  {f.title}
                </h2>
                <span className="shrink-0 text-xs text-foreground/50">
                  {rated === f.items.length
                    ? score.status === "clear"
                      ? "No concerns"
                      : score.status === "monitor"
                        ? "Monitor"
                        : "Needs support"
                    : "Not rated"}
                </span>
              </div>
              {f.note && (
                <p className="ml-11 mt-1 text-xs text-foreground/55">{f.note}</p>
              )}

              <div className="mt-3 space-y-3">
                {f.items.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>

              {/* The shape check belongs to visual-motor integration — it's a
                  direct task, so it sits inside that foundation rather than
                  becoming a section of its own. */}
              {f.id === SHAPE_CHECK_AFTER && (
                <div className="mt-5 rounded-2xl border border-msot-orange/25 bg-msot-orange/[.05] p-5">
                  <h3 className="font-semibold text-msot-navy">
                    Pre-writing shape check
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-foreground/70">
                    {shapeCheckIntro}
                  </p>

                  <div className="mt-4 space-y-3">
                    {preWritingShapes.map((shape) => (
                      <div
                        key={shape.id}
                        className="rounded-xl border border-black/[.06] bg-white/80 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <ShapeGlyph
                            shape={shape.id}
                            className="h-10 w-10 shrink-0 text-msot-navy"
                          />
                          <p className="font-medium text-foreground/90">
                            {shape.label}
                          </p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {shapeOptions.map((o) => {
                            const isChosen = shapes[shape.id] === o.value;
                            return (
                              <button
                                key={o.value}
                                type="button"
                                onClick={() => chooseShape(shape.id, o.value)}
                                aria-pressed={isChosen}
                                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                                  isChosen
                                    ? "border-msot-navy bg-msot-navy text-white ring-2 ring-msot-navy/20"
                                    : "border-black/15 bg-white text-foreground/70 hover:bg-black/[.04]"
                                }`}
                              >
                                {o.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {suggestion.ready && suggestion.groups.length > 0 ? (
                    <div className="mt-4 rounded-xl bg-white/80 p-4">
                      <p className="text-sm font-semibold text-msot-navy">
                        Sense suggests introducing these letters first
                      </p>
                      <ul className="mt-2 space-y-2">
                        {suggestion.groups.map((g) => (
                          <li key={g.letters}>
                            <p className="font-mono text-base tracking-wider text-msot-navy">
                              {g.letters}
                            </p>
                            <p className="text-xs text-foreground/60">
                              {g.because}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-foreground/60">
                      {suggestion.ready
                        ? "No letter groups yet — the shapes those letters are built from aren't available."
                        : shapeCheckHint}
                    </p>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* ── PART 3 · CONFIDENCE — the thread ────────────────────── */}
      <PartHeading
        step={3}
        eyebrow="Part 3 · Confidence"
        title="How the child feels about writing"
        caption="the thread through every foundation"
      />
      <p className="mt-3 rounded-xl bg-msot-pink/[.07] p-4 text-sm leading-6 text-foreground/75">
        {confidenceNote}
      </p>
      <div className="mt-4 space-y-3">
        {confidenceItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* ── Teacher's own read ──────────────────────────────────── */}
      <h2 className="mt-12 text-xl font-semibold text-msot-navy">
        Teacher recommendation
      </h2>
      <p className="mt-1 text-sm text-foreground/60">
        Choose any that apply.
      </p>
      <div className="mt-3 space-y-2">
        {recommendationOptions.map((o) => {
          const isChosen = recommendations.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => toggleRecommendation(o)}
              aria-pressed={isChosen}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                isChosen
                  ? "border-msot-blue bg-msot-blue/[.08] text-msot-navy"
                  : "border-black/[.08] bg-white/70 text-foreground/80 hover:bg-black/[.02]"
              }`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-xs ${
                  isChosen
                    ? "border-msot-blue bg-msot-blue text-white"
                    : "border-black/20"
                }`}
                aria-hidden
              >
                {isChosen ? "✓" : ""}
              </span>
              {o}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-msot-navy">
            Strengths observed
          </label>
          <textarea
            rows={3}
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-4 py-2.5 outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
            placeholder="What is this child doing well?"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-msot-navy">
            Additional comments
          </label>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-4 py-2.5 outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
          />
        </div>
      </div>

      <p className="mt-8 rounded-xl bg-black/[.03] p-4 text-sm leading-6 text-foreground/70">
        {closingNote}
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-msot-red/10 px-4 py-2.5 text-sm text-msot-red">
          {error}
        </p>
      )}

      {/* Sticky bottom bar: progress + submit */}
      <div className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-3">
          <span className="text-sm text-foreground/70">
            {answered} of {total} rated
          </span>
          <button
            onClick={handleSubmit}
            disabled={!complete || busy}
            className="rounded-full bg-msot-blue px-6 py-2.5 font-medium text-white transition-colors hover:bg-msot-navy disabled:opacity-50"
          >
            {busy
              ? "Saving…"
              : complete
                ? "See results"
                : "Rate every statement to finish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** The banner that opens each of the three parts. */
function PartHeading({
  step,
  eyebrow,
  title,
  caption,
}: {
  step: number;
  eyebrow: string;
  title: string;
  caption: string;
}) {
  return (
    <div className="mt-12 flex items-center gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-msot-blue text-lg font-bold text-white">
        {step}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-msot-blue">
          {eyebrow}
        </p>
        <h2 className="text-xl font-bold text-msot-navy">{title}</h2>
        <p className="text-sm text-foreground/55">{caption}</p>
      </div>
    </div>
  );
}
