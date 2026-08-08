/*
  The screening tool's content, as data (ported from Hannah's "Screener word
  modified" doc). Keeping it here — separate from any UI — means we can render
  it, score it, and tweak wording in one place.

  The tool mirrors the iceberg, top to bottom:

    PART 1 · NOTICE      the tip — is handwriting affecting participation?
    PART 2 · UNDERSTAND  the eight foundations beneath the surface
                         (with a pre-writing shape check inside visual-motor)
    PART 3 · CONFIDENCE  the thread running through all of it

  Part 3 is deliberately NOT a ninth foundation: distress is usually a
  consequence of writing being hard, not the original cause, so it is reported
  alongside the foundations and never drives the program.
*/

// ── Rating scale ─────────────────────────────────────────────────
// Frequency, not quality: teachers rate how often they notice something
// across several activities, not how good the child is. Higher = more
// concern, which is the opposite of the old "age-appropriate" scale.
export type Rating = "rarely" | "sometimes" | "often" | "unsure";

/**
 * The four options shown for every statement. `concern` is the hidden weight
 * used to work out which foundations need support — `null` for "Not sure",
 * which is an explicit "I haven't seen this" and is left out of scoring
 * entirely rather than being counted as no concern.
 */
export const ratingOptions: {
  value: Rating;
  label: string;
  hint?: string;
  concern: number | null;
}[] = [
  { value: "rarely", label: "Rarely", hint: "not observed / rarely", concern: 0 },
  { value: "sometimes", label: "Sometimes", concern: 1 },
  { value: "often", label: "Often", concern: 2 },
  { value: "unsure", label: "Not sure", hint: "not observed in class", concern: null },
];

export const concernOf: Record<Rating, number | null> = {
  rarely: 0,
  sometimes: 1,
  often: 2,
  unsure: null,
};

export type Item = { id: string; label: string };

/** Small helper so each statement gets a stable id like "fine-motor-control-3". */
function items(prefix: string, labels: string[]): Item[] {
  return labels.map((label, i) => ({ id: `${prefix}-${i + 1}`, label }));
}

// ── Guidance shown at the top ────────────────────────────────────

export const senseIntro =
  "Hi, I'm Sense. Handwriting sits at the tip of an iceberg. This tool mirrors the iceberg exactly — first we notice whether handwriting is affecting participation, then we look underneath at the eight foundations, and we keep an eye on how the child feels about writing. Let's make sense of it together.";

// One statement rather than two: the screener already asks a lot of a
// teacher before they rate anything, so the framing is kept to a single
// paragraph they can take in at a glance.
export const ratingGuidance =
  "Rate each statement on what you have noticed across several classroom activities. Rate against typical Year 1 expectations. Please note letter reversals remain developmentally normal until approximately 7 years of age.";

export const curriculumAnchor = "AC9E1LY08";

// ── PART 1 · NOTICE — the tip of the iceberg ─────────────────────

export const noticeItems: Item[] = items("notice", [
  "The child's handwriting is difficult to read.",
  "Letters are formed incorrectly or inconsistently.",
  "Letter size, spacing or placement on the line is inconsistent.",
  "Writing is noticeably slower or more effortful than expected.",
  "The child has difficulty completing an appropriate amount of written work.",
  "Handwriting quality deteriorates as the task continues.",
  "The child reports hand pain, discomfort or tiredness.",
  "The child avoids, resists or becomes distressed by writing.",
]);

// ── PART 2 · UNDERSTAND — the eight foundations ──────────────────

export type Foundation = {
  id: string;
  /** 1-8, matching the numbering on the iceberg. */
  number: number;
  title: string;
  /** Optional line shown under the heading (e.g. a curriculum anchor). */
  note?: string;
  items: Item[];
};

function foundation(
  number: number,
  id: string,
  title: string,
  labels: string[],
  note?: string,
): Foundation {
  return { id, number, title, note, items: items(id, labels) };
}

/**
 * The eight foundations, in iceberg order (top of the submerged mass down).
 * These ids are shared with lib/icebergContent.ts and lib/programContent.ts —
 * a flagged foundation here looks up its program sessions by the same id, so
 * they must never drift apart.
 */
export const foundations: Foundation[] = [
  foundation(1, "postural-control", "Postural Control", [
    "The child slumps, leans heavily on the desk or supports their head while writing.",
    "The child has difficulty keeping their feet and body stable.",
    "The child frequently changes position or leaves their seat during writing.",
    "The child appears physically tired during longer writing activities.",
    "The child uses large movements from the shoulder rather than controlled movements of the hand and fingers.",
  ]),
  foundation(2, "bilateral-coordination", "Bilateral Coordination", [
    "The child does not consistently use their other hand to hold the paper.",
    "The child frequently swaps the pencil between hands.",
    "The child turns their body or paper excessively instead of reaching across the page.",
    "The child has difficulty moving smoothly across the page from left to right.",
    "The child also finds two-handed classroom activities, such as cutting, ruling or opening containers, difficult.",
  ]),
  foundation(3, "fine-motor-control", "Fine Motor Control", [
    "The child has difficulty making small, controlled pencil movements.",
    "The child holds the pencil very tightly, awkwardly or with more fingers than appear necessary for control.",
    "The child presses extremely hard or produces marks that are unusually faint.",
    "The child's hand becomes tired, sore or shaky during writing.",
    "Letter formation and pencil control deteriorate as the task continues.",
  ]),
  foundation(4, "sensory-regulation", "Sensory Regulation & Body Awareness", [
    "The child has difficulty settling their body and becoming ready to write.",
    "The child is easily distracted or distressed by ordinary classroom noise, touch or movement.",
    "The child frequently seeks movement, pressure or tactile input during writing.",
    "The child appears unaware of how much pressure they are using with the pencil.",
    "The child does not readily notice when their position is uncomfortable or their hand is becoming tired.",
  ]),
  foundation(5, "visual-perception", "Visual Perception", [
    "The child confuses letters or shapes that look similar.",
    "The child frequently reverses letters beyond what would be expected for their age and stage of learning.",
    "The child has difficulty judging spaces between letters or words.",
    "The child loses their place when reading, copying or moving across a worksheet.",
    "The child has difficulty remembering the visual appearance of familiar letters.",
  ]),
  foundation(6, "visual-motor-integration", "Visual-Motor Integration", [
    "The child has difficulty copying pre-writing shapes expected for their developmental level.",
    "The child has difficulty copying simple patterns, drawings or letters.",
    "Letters are uneven in size or poorly positioned on the writing line.",
    "The child finds copying from the board more difficult than copying from a nearby model.",
    "What the child produces on paper does not closely resemble the model, even when they appear to understand the task.",
  ]),
  foundation(7, "attention-executive-function", "Attention & Executive Function", [
    "The child has difficulty beginning a writing task, even when they understand what to do.",
    "The child loses focus before completing a short, appropriate writing activity.",
    "The child forgets instructions or loses track of the next step.",
    "The child has difficulty organising their materials, ideas or space on the page.",
    "The child becomes overwhelmed when required to think of ideas, spell and form letters at the same time.",
  ]),
  foundation(
    8,
    "language-letter-knowledge",
    "Language & Letter Knowledge",
    [
      "The child has difficulty understanding the language used in writing instructions.",
      "The child has difficulty expressing their idea verbally before writing.",
      "The child does not consistently recognise or name letters expected for their stage of learning.",
      "The child has difficulty connecting letters with their corresponding sounds.",
      "The child cannot readily recall how to form familiar letters without copying a model.",
    ],
  ),
];

/** The foundation the pre-writing shape check sits inside. */
export const SHAPE_CHECK_AFTER = "visual-motor-integration";

// ── Pre-writing shape check ──────────────────────────────────────
// A direct task rather than an observation: the teacher asks the child to
// copy each shape. Shapes are the movements letters are built from, so this
// is what decides which letters to introduce first.

export type ShapeRating =
  | "independent"
  | "with-demo"
  | "not-yet"
  | "not-assessed";

export const shapeOptions: { value: ShapeRating; label: string }[] = [
  { value: "independent", label: "Independently" },
  { value: "with-demo", label: "With demo" },
  { value: "not-yet", label: "Not yet" },
  { value: "not-assessed", label: "Not assessed" },
];

/** `glyph` names the drawing in components/ShapeGlyph.tsx. */
export type PreWritingShape = { id: string; label: string };

export const preWritingShapes: PreWritingShape[] = [
  { id: "vertical", label: "Vertical line" },
  { id: "horizontal", label: "Horizontal line" },
  { id: "circle", label: "Circle" },
  { id: "cross", label: "Cross" },
  { id: "square", label: "Square" },
  { id: "diagonal", label: "Diagonal lines" },
  // Labelled in words like every other shape — the glyph beside it is
  // already a large X, so a bare "X" here read as a duplicate.
  { id: "x", label: "Diagonal cross" },
  { id: "triangle", label: "Triangle" },
  { id: "diamond", label: "Diamond" },
];

export const shapeCheckIntro =
  "Ask the child to copy each shape. This helps decide which letters to introduce first — the shapes are the movements that build letters.";

export const shapeCheckHint =
  "Rate at least the vertical, horizontal and circle shapes and Sense will suggest which letters to introduce first.";

/** The three shapes that must be rated before a letter suggestion is offered. */
export const SHAPE_SUGGESTION_REQUIRES = ["vertical", "horizontal", "circle"];

export type Shapes = Record<string, ShapeRating>;

/**
 * Which letters to introduce first, based on the shapes the child can already
 * make. A shape counts as available when it's copied independently or with a
 * demo — "with demo" means the movement is there and just needs teaching.
 *
 * PLACEHOLDER GROUPING — the letter sets follow the usual shape-to-letter
 * progression, but Hannah should confirm them against the program before this
 * is relied on clinically.
 */
export function suggestLetters(shapes: Shapes): {
  ready: boolean;
  groups: { letters: string; because: string }[];
} {
  const has = (id: string) =>
    shapes[id] === "independent" || shapes[id] === "with-demo";

  const rated = SHAPE_SUGGESTION_REQUIRES.every(
    (id) => shapes[id] && shapes[id] !== "not-assessed",
  );
  if (!rated) return { ready: false, groups: [] };

  const groups: { letters: string; because: string }[] = [];

  if (has("vertical") && has("horizontal")) {
    groups.push({
      letters: "L  T  I  E  F  H",
      because: "built from vertical and horizontal lines",
    });
  }
  if (has("circle")) {
    groups.push({
      letters: "O  C  o  c  a  d  g  q",
      because: "built from the circle",
    });
  }
  if (has("circle") && has("vertical")) {
    groups.push({
      letters: "b  p  D  P  B",
      because: "a circle joined to a vertical line",
    });
  }
  if (has("diagonal") || has("x")) {
    groups.push({
      letters: "V  A  W  X  Y  K  N  M  Z",
      because: "built from diagonal lines",
    });
  }

  return { ready: true, groups };
}

// ── PART 3 · CONFIDENCE ──────────────────────────────────────────

export const confidenceItems: Item[] = items("confidence", [
  "The child says things such as “I can't write” or “I'm bad at writing.”",
  "The child avoids or resists writing activities.",
  "The child becomes anxious, upset or frustrated when asked to write.",
  "The child gives up quickly or requires frequent reassurance.",
  "The child participates more successfully when the amount, time pressure or copying demand is reduced.",
]);

export const confidenceNote =
  "Emotional distress is often a consequence of handwriting being persistently difficult, rather than the original cause. This is a short section alongside the eight foundations — not a ninth foundation.";

// The doc's "Teacher recommendation" checklist is deliberately left out for
// now — the screener already asks a lot, and the results page says what to
// focus on. The results page still renders `reflection.recommendations` if a
// screening happens to carry them, so nothing already saved is lost.

export const closingNote =
  "A foundation difficulty should guide the support provided — but it should not delay explicit letter teaching and actual handwriting practice. This is a teacher screening tool, not a standardised assessment, so it does not produce a diagnostic total score.";

// ── Item id helpers ──────────────────────────────────────────────

export const noticeItemIds = noticeItems.map((i) => i.id);
export const foundationItemIds = foundations.flatMap((f) =>
  f.items.map((i) => i.id),
);
export const confidenceItemIds = confidenceItems.map((i) => i.id);

/** Everything rated on the frequency scale, in the order it appears. */
export const allItemIds = [
  ...noticeItemIds,
  ...foundationItemIds,
  ...confidenceItemIds,
];

// ── Scoring ──────────────────────────────────────────────────────

/** A completed screening is a map of item id → rating. */
export type Responses = Record<string, Rating>;

/**
 * How a foundation came out. `status` drives the summary table; `flagged`
 * (support OR monitor) is what the program builder draws on, worst first.
 */
export type FoundationStatus = "support" | "monitor" | "clear";

export type FoundationScore = {
  id: string;
  number: number;
  title: string;
  often: number;
  sometimes: number;
  rarely: number;
  unsure: number;
  /** Total concern weight (sometimes = 1, often = 2) — used for ordering. */
  concern: number;
  status: FoundationStatus;
  flagged: boolean;
};

export const statusLabel: Record<FoundationStatus, string> = {
  support: "Needs support",
  monitor: "Monitor",
  clear: "—",
};

/**
 * The rule for a foundation's status. Two "often"s, or one "often" backed by
 * repeated "sometimes", is a pattern worth acting on; a single "often" or
 * repeated "sometimes" on its own is worth watching. Tunable in one place.
 */
function statusFor(often: number, sometimes: number): FoundationStatus {
  if (often >= 2 || (often >= 1 && sometimes >= 2)) return "support";
  if (often >= 1 || sometimes >= 2) return "monitor";
  return "clear";
}

/** How Part 1 came out — the gate for whether the foundations matter. */
export type NoticeScore = {
  often: number;
  sometimes: number;
  rarely: number;
  unsure: number;
  concern: number;
  /** True when handwriting does appear to be affecting participation. */
  affectingParticipation: boolean;
};

export type ConfidenceScore = {
  often: number;
  sometimes: number;
  concern: number;
  /** True when the child's feelings about writing warrant a mention. */
  raised: boolean;
};

export type ScreeningResult = {
  notice: NoticeScore;
  foundations: FoundationScore[];
  /** Every flagged foundation, worst first — these become the program's focus. */
  flaggedFoundations: FoundationScore[];
  confidence: ConfidenceScore;
  /** True when nothing at all was flagged beneath the surface. */
  onTrack: boolean;
};

function tally(ids: string[], responses: Responses) {
  let often = 0,
    sometimes = 0,
    rarely = 0,
    unsure = 0,
    concern = 0;
  for (const id of ids) {
    const rating = responses[id];
    if (!rating) continue;
    if (rating === "often") often++;
    else if (rating === "sometimes") sometimes++;
    else if (rating === "rarely") rarely++;
    else unsure++;
    concern += concernOf[rating] ?? 0;
  }
  return { often, sometimes, rarely, unsure, concern };
}

/**
 * Turn raw responses into per-part scores and the list of foundations that
 * need support. Flagged foundations are ordered worst-first (most "often",
 * then most "sometimes"). No year-level adjustment yet — treated as Year 1.
 */
export function scoreScreening(responses: Responses): ScreeningResult {
  const n = tally(noticeItemIds, responses);
  const notice: NoticeScore = {
    ...n,
    // The same threshold as a foundation: one clear "often", or a repeated
    // "sometimes" pattern, means handwriting is affecting participation.
    affectingParticipation: n.often >= 1 || n.sometimes >= 2,
  };

  const scored: FoundationScore[] = foundations.map((f) => {
    const t = tally(
      f.items.map((i) => i.id),
      responses,
    );
    const status = statusFor(t.often, t.sometimes);
    return {
      id: f.id,
      number: f.number,
      title: f.title,
      ...t,
      status,
      flagged: status !== "clear",
    };
  });

  const flaggedFoundations = scored
    .filter((f) => f.flagged)
    .sort(
      (a, b) =>
        b.often - a.often || b.sometimes - a.sometimes || b.concern - a.concern,
    );

  const c = tally(confidenceItemIds, responses);
  const confidence: ConfidenceScore = {
    often: c.often,
    sometimes: c.sometimes,
    concern: c.concern,
    raised: c.often >= 1 || c.sometimes >= 2,
  };

  return {
    notice,
    foundations: scored,
    flaggedFoundations,
    confidence,
    onTrack: flaggedFoundations.length === 0,
  };
}

// ── Student profile options ──────────────────────────────────────

/** The school years staff can pick when adding a student. */
export const yearLevels = [
  "Foundation",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
];

/** The four school terms staff can pick when adding a student. */
export const terms = ["Term 1", "Term 2", "Term 3", "Term 4"];

/**
 * A sensible default term for the "add a student" form, based on today's
 * month. Australian school terms run roughly Feb–Apr, Apr–Jun, Jul–Sep,
 * Oct–Dec. This is only a starting guess — staff can always change it, and
 * exact term dates shift year to year and state to state.
 */
export function currentTerm(today: Date = new Date()): string {
  const month = today.getMonth(); // 0 = January
  if (month <= 2) return "Term 1"; // Jan–Mar
  if (month <= 5) return "Term 2"; // Apr–Jun
  if (month <= 8) return "Term 3"; // Jul–Sep
  return "Term 4"; // Oct–Dec
}
