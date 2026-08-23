"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ShapeGlyph from "@/components/ShapeGlyph";
import {
  preWritingShapes,
  shapeOptions,
  ratingOptions,
  scoreScreening,
  statusLabel,
  confidenceNote,
  screenerForms,
  getForm,
  formForYearLevel,
  SHAPE_CHECK_AFTER,
  type Rating,
  type Responses,
  type ShapeRating,
  type Shapes,
  type Item,
  type FormId,
} from "@/lib/screening";

/*
  The screener reads as the iceberg does — you descend it. Part 1 is the tip
  above the waterline, Part 2 is the eight foundations below it, Part 3 is the
  thread running through the whole thing. The waterline is a real divider on
  the page, not just a heading.
*/

// Each option keeps its colour at all times so the scale reads at a glance:
// calm for "rarely", warm for "often", brand cyan/navy for "not sure" — a
// deliberate blue so it never reads as a mild version of "rarely".
const idleStyle: Record<Rating, string> = {
  rarely: "border-msot-teal/40 bg-msot-teal/10 text-msot-teal hover:bg-msot-teal/20",
  sometimes:
    "border-msot-yellow/60 bg-msot-yellow/15 text-msot-navy hover:bg-msot-yellow/25",
  often: "border-msot-red/40 bg-msot-red/10 text-msot-red hover:bg-msot-red/20",
  unsure:
    "border-msot-cyan/50 bg-msot-cyan/15 text-msot-navy hover:bg-msot-cyan/25",
};
const chosenStyle: Record<Rating, string> = {
  rarely: "border-msot-teal bg-msot-teal text-white ring-2 ring-msot-teal/30",
  sometimes:
    "border-msot-yellow bg-msot-yellow text-msot-navy ring-2 ring-msot-yellow/40",
  often: "border-msot-red bg-msot-red text-white ring-2 ring-msot-red/30",
  // Navy rather than cyan: cyan is too light to carry white text, and a solid
  // fill is what makes the chosen option obvious against the white card.
  unsure: "border-msot-navy bg-msot-navy text-white ring-2 ring-msot-navy/30",
};
const dotStyle: Record<Rating, string> = {
  rarely: "bg-msot-teal",
  sometimes: "bg-msot-yellow",
  often: "bg-msot-red",
  unsure: "bg-msot-cyan",
};

/** Respects the OS "reduce motion" setting — smooth scrolling can make some
    people feel unwell, and this page scrolls on almost every click. */
function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/*
  One rateable statement. Defined at module level, not inside ScreenPage —
  a component declared inside another is a brand-new type on every render,
  which makes React tear down and rebuild all 53 rows on each keystroke.
*/
function ItemRow({
  item,
  chosen,
  onChoose,
  showGap,
}: {
  item: Item;
  chosen: Rating | undefined;
  onChoose: (rating: Rating) => void;
  showGap: boolean;
}) {
  // Only unrated rows light up, and only once the teacher has asked where
  // the gaps are — the form shouldn't scold you before you've finished.
  const gap = showGap && !chosen;
  return (
    <div
      id={`item-${item.id}`}
      className={`scroll-mt-24 rounded-xl border p-4 transition-colors ${
        gap
          ? "border-msot-red bg-msot-red/[.06]"
          : "border-black/[.06] bg-white/70"
      }`}
    >
      <p className="text-foreground/90">{item.label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {ratingOptions.map((o) => {
          const isChosen = chosen === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChoose(o.value)}
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

export default function ScreenForm({
  yearLevel,
}: {
  yearLevel: string | null;
}) {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  /*
    Which form this screening is being completed on. Null until the teacher
    picks one — a child working below or above their year level should be
    rated against the expectations that actually fit them, so this is a
    deliberate choice rather than something derived from their year level.
  */
  const [formId, setFormId] = useState<FormId | null>(null);



  // `responses` remembers every frequency choice: { "postural-control-2": "often" }
  const [responses, setResponses] = useState<Responses>({});
  // The shape check is a different scale, so it's kept separately.
  const [shapes, setShapes] = useState<Shapes>({});
  const [strengths, setStrengths] = useState("");
  const [comments, setComments] = useState("");
  const [showGaps, setShowGaps] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
    A screening is long, and teachers get interrupted. Work in progress is
    kept in the browser under a key unique to this student, so leaving the
    page — or closing the laptop — doesn't lose it.

    Browser-local by design for now: it needs no database column and works
    offline. The trade-off is that a draft doesn't follow you to another
    device. Moving it to Supabase later is a contained change.
  */
  const draftKey = `msot:screening-draft:${id}`;
  // Guards the autosave effect: without it, the first render would write
  // empty state over a saved draft before the load effect had run.
  const loaded = useRef(false);
  const [restored, setRestored] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  /*
    Restore any draft for this student, once, on first render.

    eslint-disable below: the rule warns against setState inside an effect,
    and it is right to in general. This is the exception it allows for —
    pulling state in from an external system. It cannot be a useState
    initialiser instead, because this component is server-rendered first and
    localStorage does not exist there; reading it during render would throw
    on the server and desync hydration on the client.
  */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(draftKey);
      if (raw) {
        const d = JSON.parse(raw);
        // An older draft predates the form picker; those were all Year 1.
        setFormId(d.formId ?? "year-1");
        setResponses(d.responses ?? {});
        setShapes(d.shapes ?? {});
        setStrengths(d.strengths ?? "");
        setComments(d.comments ?? "");
        if (Object.keys(d.responses ?? {}).length > 0) setRestored(true);
      }
    } catch {
      // A corrupt or unreadable draft should never block screening.
    }
    loaded.current = true;
  }, [draftKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const saveDraft = useCallback(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(
        draftKey,
        JSON.stringify({ formId, responses, shapes, strengths, comments }),
      );
      setSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    } catch {
      // Private browsing or a full quota — the explicit Save button below
      // surfaces the problem; autosave stays silent.
    }
  }, [draftKey, formId, responses, shapes, strengths, comments]);

  // Autosave, so an unsaved draft is never lost to a closed tab. The
  // explicit Save button exists for reassurance, not because it is the
  // only thing that persists.
  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(saveDraft, 600);
    return () => clearTimeout(t);
  }, [saveDraft]);

  /*
    The active form. `getForm` falls back to Year 1 for an unknown id, which
    also keeps this safe while `formId` is still null — the picker is showing
    then, so none of the derived values below are on screen yet.
  */
  const form = getForm(formId);
  /** Which form matches the year level on this student's profile, if any. */
  const suggestedForm = formForYearLevel(yearLevel);
  const { noticeItems, foundations, confidenceItems, allItemIds } = form;

  const answered = Object.keys(responses).length;
  const total = allItemIds.length;
  const remaining = allItemIds.filter((i) => !responses[i]);
  const complete = remaining.length === 0;

  /*
    Which sections still have unrated statements. Reporting gaps by section
    rather than as one number tells a teacher where to go — "12 still to
    rate" is a scolding; "Part 1, Fine Motor Control and Part 3" is an
    instruction. Each entry keeps the id of its first gap so the name can be
    clicked to jump straight there.
  */
  const sections: { label: string; ids: string[] }[] = [
    { label: "Part 1 · What you can see", ids: noticeItems.map((i) => i.id) },
    ...foundations.map((f) => ({
      label: `${f.number}. ${f.title}`,
      ids: f.items.map((i) => i.id),
    })),
    {
      label: "Part 3 · Writing confidence",
      ids: confidenceItems.map((i) => i.id),
    },
  ];

  const missingSections = sections
    .map((s) => {
      const gaps = s.ids.filter((i) => !responses[i]);
      return { label: s.label, count: gaps.length, firstId: gaps[0] };
    })
    .filter((s) => s.count > 0);

  /** How many statements are unrated in one section — drives the red headings. */
  const missingIn = (list: Item[]) =>
    list.filter((i) => !responses[i.id]).length;

  // Live scoring drives the Part 1 gate.
  const result = scoreScreening(responses, form);

  const noticeAnswered = noticeItems.every((i) => responses[i.id]);

  /*
    Rating a statement scrolls the next one into view, so a teacher can work
    down 53 statements without reaching for the scrollbar between each one.

    Two deliberate limits:

    - It only advances the FIRST time a statement is rated. Changing an
      earlier answer leaves the page where it is; nothing is more annoying
      than a form that yanks you away while you are correcting something.
    - It stops at the end of the list, and it never scrolls past the shape
      check — those are a hands-on task, not a tap-through.
  */
  function choose(itemId: string, rating: Rating) {
    const isFirstAnswer = !responses[itemId];
    setResponses((prev) => ({ ...prev, [itemId]: rating }));
    if (isFirstAnswer) advanceFrom(itemId);
  }

  function advanceFrom(itemId: string) {
    const at = allItemIds.indexOf(itemId);
    const next = allItemIds[at + 1];
    if (at === -1 || !next) return;
    // Wait for the click's own re-render so the scroll lands accurately.
    requestAnimationFrame(() => {
      document.getElementById(`item-${next}`)?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
    });
  }

  function chooseShape(shapeId: string, rating: ShapeRating) {
    setShapes((prev) => ({ ...prev, [shapeId]: rating }));
  }

  /** Reveal the unrated statements and jump to one of them. */
  function goToGap(itemId?: string) {
    setShowGaps(true);
    const first = itemId ?? remaining[0];
    if (!first) return;
    // Wait a frame so the row is already showing its red state when it lands.
    requestAnimationFrame(() => {
      document.getElementById(`item-${first}`)?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
    });
  }

  async function handleSubmit() {
    // The screening cannot be submitted until every statement is rated. The
    // button is never dead, though: it turns into "show me which ones",
    // raising the alert and jumping to the first gap rather than refusing
    // silently.
    if (!complete) {
      goToGap();
      return;
    }

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
    const results = scoreScreening(responses, form);
    const { data, error } = await supabase
      .from("screenings")
      .insert({
        student_id: id,
        staff_id: user.id,
        // Item ids differ between forms, so the results page cannot score
        // these answers without knowing which form produced them.
        form_id: form.id,
        responses,
        results,
        shapes,
        reflection: {
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

    // The screening is safely in the database now, so the local draft has
    // done its job — leaving it would offer to restore a finished screening.
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      /* nothing to clean up */
    }

    router.push(`/students/${id}/results/${data.id}`);
    router.refresh();
  }

  /** Renders a list of statements, wired to state. */
  function rows(list: Item[]) {
    return list.map((item) => (
      <ItemRow
        key={item.id}
        item={item}
        chosen={responses[item.id]}
        onChoose={(r) => choose(item.id, r)}
        showGap={showGaps}
      />
    ));
  }

  /*
    Nothing is rated until a form is chosen. Swapping form mid-screening would
    strand every answer already given — the two forms ask different numbers of
    statements under different ids — so the choice is made once, up front, and
    changing it later is an explicit reset.
  */
  function changeForm() {
    if (answered > 0 && !window.confirm(
      "Changing the year level clears the answers you have already given. Continue?",
    )) {
      return;
    }
    setResponses({});
    setShapes({});
    setShowGaps(false);
    setFormId(null);
  }

  if (!formId) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
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
          Which year level?
        </h1>
        <p className="mt-3 text-foreground/70">
          Every statement is rated against what is typical for a year level, so
          pick the expectations that fit this child — not necessarily the year
          they are enrolled in.
        </p>

        {/*
          The year level recorded on the student's profile, surfaced so the
          teacher does not have to remember it. A child who has moved up a year
          since they were added should be screened on the newer form, so this
          points rather than decides.
        */}
        {yearLevel && (
          <p className="mt-4 rounded-xl bg-msot-cyan/[.09] px-4 py-3 text-sm text-foreground/80">
            {suggestedForm ? (
              <>
                This student is registered as{" "}
                <span className="font-semibold text-msot-navy">
                  {yearLevel}
                </span>
                , so the {getForm(suggestedForm).label} form is highlighted
                below. Choose a different one if it fits them better.
              </>
            ) : (
              <>
                This student is registered as{" "}
                <span className="font-semibold text-msot-navy">
                  {yearLevel}
                </span>
                . There is no form for that year yet — pick whichever
                expectations fit them best.
              </>
            )}
          </p>
        )}

        <div className="mt-8 space-y-3">
          {screenerForms.map((f) => {
            const suggested = f.id === suggestedForm;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormId(f.id)}
                className={`block w-full rounded-2xl border px-5 py-4 text-left transition-colors ${
                  suggested
                    ? "border-msot-blue bg-msot-blue/[.06] ring-2 ring-msot-blue/30 hover:bg-msot-blue/[.10]"
                    : "border-black/[.08] bg-white hover:border-msot-blue hover:bg-msot-blue/[.04]"
                }`}
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-msot-navy">
                    {f.label}
                  </span>
                  {suggested && (
                    <span className="rounded-full bg-msot-blue px-2.5 py-0.5 text-xs font-semibold text-white">
                      Matches this student
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm text-foreground/70">
                  {f.blurb}
                </span>
                <span className="mt-2 block text-xs text-foreground/50">
                  {f.allItemIds.length} statements · anchor{" "}
                  <span className="font-mono">{f.curriculumAnchor}</span>
                </span>
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

      <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-foreground/70">
        <span className="rounded-full bg-msot-blue/[.10] px-3 py-1 font-medium text-msot-navy">
          {form.label} form
        </span>
        <button
          type="button"
          onClick={changeForm}
          className="text-msot-blue underline underline-offset-2 hover:text-msot-navy"
        >
          Change
        </button>
      </p>

      {restored && (
        <p className="mt-4 rounded-xl bg-msot-teal/[.09] px-4 py-3 text-sm text-foreground/80">
          Picked up where you left off — your saved answers have been restored.
        </p>
      )}

      <div className="mt-6 space-y-3 rounded-xl bg-black/[.03] px-4 py-3.5 text-sm">
        <p className="text-foreground/80">{form.ratingGuidance}</p>
        <p className="text-xs text-foreground/55">
          Australian Curriculum anchor:{" "}
          <span className="font-mono">{form.curriculumAnchor}</span>.
        </p>
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
      </div>

      {/* ── PART 1 · NOTICE — above the waterline ───────────────── */}
      <PartHeading
        eyebrow="Part 1 · Notice"
        title="Is handwriting affecting participation?"
        caption="the tip of the iceberg"
        missing={showGaps ? missingIn(noticeItems) : 0}
      />
      <div className="mt-4 space-y-3">{rows(noticeItems)}</div>

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
        eyebrow="Part 2 · Understand"
        title="What may be contributing?"
        caption="the eight foundations beneath the surface"
      />

      <div className="mt-4 space-y-10">
        {foundations.map((f) => {
          const score = result.foundations.find((s) => s.id === f.id)!;
          // How many statements have been touched at all — including "Not
          // sure", which counts as answered here even though it is left out
          // of the score itself.
          const answered = f.items.filter((i) => responses[i.id]).length;
          return (
            <section key={f.id}>
              <div className="flex items-baseline gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-msot-navy text-sm font-bold text-white">
                  {f.number}
                </span>
                <h2 className="flex-1 text-lg font-semibold text-msot-navy">
                  {f.title}
                </h2>
                {/* Once every statement has been answered, show the verdict
                    the results page will give — same labels, same rule. While
                    gaps are revealed, an unfinished foundation says so in red
                    instead. */}
                {showGaps && answered < f.items.length ? (
                  <span className="shrink-0 rounded-full bg-msot-red/10 px-2.5 py-1 text-xs font-semibold text-msot-red">
                    {f.items.length - answered} to rate
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-foreground/50">
                    {answered === f.items.length
                      ? statusLabel[score.status]
                      : `${answered} of ${f.items.length} rated`}
                  </span>
                )}
              </div>
              {(f.anchor || f.note) && (
                <p className="ml-11 mt-1 text-xs text-foreground/55">
                  {f.anchor && (
                    <>
                      Australian Curriculum anchor:{" "}
                      <span className="font-mono">{f.anchor}</span>
                      {f.note ? " — " : "."}
                    </>
                  )}
                  {f.note}
                </p>
              )}

              <div className="mt-3 space-y-3">{rows(f.items)}</div>

              {/* The shape check belongs to visual-motor integration — it's a
                  direct task, so it sits inside that foundation rather than
                  becoming a section of its own. */}
              {f.id === SHAPE_CHECK_AFTER && (
                <div className="mt-5 rounded-2xl border border-msot-orange/25 bg-msot-orange/[.05] p-5">
                  <h3 className="font-semibold text-msot-navy">
                    Pre-writing shape check
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-foreground/70">
                    {form.shapeCheckIntro}
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

                  {/*
                    The letter suggestion deliberately does NOT appear here.
                    While screening, the teacher is observing — showing them
                    which letters to teach mid-observation invites them to
                    start planning instead of rating. It belongs on the
                    results page and in the program, where it already is.
                  */}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* ── PART 3 · CONFIDENCE — the thread ────────────────────── */}
      <PartHeading
        eyebrow="Part 3 · Confidence"
        title="How the child feels about writing"
        caption="the thread through every foundation"
        missing={showGaps ? missingIn(confidenceItems) : 0}
      />
      <p className="mt-3 rounded-xl bg-msot-pink/[.07] p-4 text-sm leading-6 text-foreground/75">
        {confidenceNote}
      </p>
      <div className="mt-4 space-y-3">{rows(confidenceItems)}</div>

      {/* ── The teacher's own words ─────────────────────────────── */}
      <div className="mt-12 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-msot-navy">
            Strengths observed{" "}
            <span className="font-normal text-foreground/50">(optional)</span>
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
            Additional comments{" "}
            <span className="font-normal text-foreground/50">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-4 py-2.5 outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
          />
        </div>
      </div>

      {/* The "not a standardised assessment" note lives on the results page,
          where a teacher is reading findings and the caveat actually bears on
          what they do next. Mid-screening it was just one more thing to read. */}

      {error && (
        <p className="mt-6 rounded-lg bg-msot-red/10 px-4 py-2.5 text-sm text-msot-red">
          {error}
        </p>
      )}

      {/* Sticky bottom bar: the alert (once raised), then progress + submit */}
      <div className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-white/95 backdrop-blur">
        {/*
          Raised only after a teacher tries to submit — the form shouldn't
          scold anyone who is simply still working. It names the sections
          rather than a bare count, and each name jumps to its first gap.
          Capped in height so a screening barely started doesn't bury the
          page under a list of all ten sections.
        */}
        {showGaps && !complete && (
          <div
            role="alert"
            className="border-b border-msot-red/20 bg-msot-red/[.06]"
          >
            <div className="mx-auto max-w-2xl px-6 py-3">
              <p className="text-sm font-semibold text-msot-red">
                Not finished — {remaining.length} statement
                {remaining.length > 1 ? "s" : ""} still to rate
              </p>
              <p className="mt-0.5 text-xs text-foreground/70">
                Every statement must be rated before you can see results. The
                sections below are outlined in red — tap one to jump there.
              </p>
              <div className="mt-2 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
                {missingSections.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => goToGap(s.firstId)}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-msot-red ring-1 ring-inset ring-msot-red/40 transition-colors hover:bg-msot-red/10"
                  >
                    {s.label} ({s.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-3">
          <div className="text-sm">
            <p className="text-foreground/70">
              {answered} of {total} rated
            </p>
            {!complete && (
              <button
                type="button"
                onClick={() => goToGap()}
                className="text-msot-blue underline underline-offset-2 hover:text-msot-navy"
              >
                {remaining.length} still to rate — show me
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={saveDraft}
            className="shrink-0 rounded-full px-5 py-2.5 font-medium text-msot-blue ring-2 ring-inset ring-msot-blue/40 transition-colors hover:bg-msot-blue/[.06]"
          >
            {savedAt ? `Saved ${savedAt}` : "Save"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={busy}
            className={`shrink-0 rounded-full px-6 py-2.5 font-medium transition-colors disabled:opacity-50 ${
              complete
                ? "bg-msot-blue text-white hover:bg-msot-navy"
                : "bg-msot-orange/15 text-msot-navy hover:bg-msot-orange/25"
            }`}
          >
            {busy ? "Saving…" : complete ? "See results" : "Show what's left"}
          </button>
        </div>
      </div>
    </div>
  );
}

/*
  The banner that opens each of the three parts. No step number: the eyebrow
  already says "Part 1", and the eight foundations below carry numbered
  badges of their own. Two numbering systems on one screen made the page
  read as far more numbered than it is — the foundations keep theirs.
*/
function PartHeading({
  eyebrow,
  title,
  caption,
  missing = 0,
}: {
  eyebrow: string;
  title: string;
  caption: string;
  /** Unrated statements in this part — shown only once gaps are revealed. */
  missing?: number;
}) {
  return (
    <div className="mt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-msot-blue">
        {eyebrow}
      </p>
      <div className="flex items-baseline gap-3">
        <h2 className="flex-1 text-xl font-bold text-msot-navy">{title}</h2>
        {missing > 0 && (
          <span className="shrink-0 rounded-full bg-msot-red/10 px-2.5 py-1 text-xs font-semibold text-msot-red">
            {missing} to rate
          </span>
        )}
      </div>
      <p className="text-sm text-foreground/55">{caption}</p>
    </div>
  );
}
