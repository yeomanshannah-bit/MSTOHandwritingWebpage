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

/*
  Year 2 asks more statements than Year 1 and, in Visual-Motor Integration,
  adds one at the TOP of the list. If both forms numbered their items the same
  way, "visual-motor-integration-1" would mean a different statement depending
  on which form was used — and a saved screening is just a map of item id to
  rating, so old records would silently be read against the wrong statements.
  Year 2 ids therefore carry a prefix. Year 1 keeps its bare ids exactly as
  they were, so every screening saved before this change still scores.
*/
const ITEM_PREFIX = { "year-1": "", "year-2": "y2-" } as const;

// ── Guidance shown at the top ────────────────────────────────────
// One statement rather than two: the screener already asks a lot of a
// teacher before they rate anything, so the framing is kept to a single
// paragraph they can take in at a glance. Each form carries its own, because
// what counts as age-appropriate is exactly what changes between years.

const year1Guidance =
  "Rate each statement on what you have noticed across several classroom activities. Rate against typical Year 1 expectations. Please note letter reversals remain developmentally normal until approximately 7 years of age.";

const year1Anchor = "AC9E1LY08";
const year2Anchor = "AC9E2LY08";

const year2Guidance =
  "Rate each statement on what you have noticed across several classroom activities, not a single difficult writing lesson. Rate against typical Year 2 expectations (the third year of school), where legible, unjoined upper- and lower-case letters with growing fluency and speed are expected. By this stage letter reversals should be resolving — flag the reversal item only if reversals are frequent or persistent.";

// ── PART 1 · NOTICE — the tip of the iceberg ─────────────────────

const year1Notice: Item[] = items("notice", [
  "The child's handwriting is difficult to read.",
  "Letters are formed incorrectly or inconsistently.",
  "Letter size, spacing or placement on the line is inconsistent.",
  "Writing is noticeably slower or more effortful than expected.",
  "The child has difficulty completing an appropriate amount of written work.",
  "Handwriting quality deteriorates as the task continues.",
  "The child reports hand pain, discomfort or tiredness.",
  "The child avoids, resists or becomes distressed by writing.",
]);

/*
  Year 2 differs in two statements: slowness is judged against the child's own
  ideas rather than in the abstract, and the amount of work is judged against
  the time available. Both reflect the Year 2 expectation of growing fluency
  and speed.
*/
const year2Notice: Item[] = items("y2-notice", [
  "The child's handwriting is difficult to read.",
  "Letters are formed incorrectly or inconsistently.",
  "Letter size, spacing or placement on the line is inconsistent.",
  "Writing is noticeably slower or more effortful than expected, and does not keep pace with the child's ideas.",
  "The child has difficulty completing an appropriate amount of written work in the time available.",
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
  /** Optional line shown under the heading. */
  note?: string;
  /** Optional Australian Curriculum code, rendered before the note. */
  anchor?: string;
  items: Item[];
};

/*
  `id` is the domain id, shared across every form — programContent.ts and
  programBuilder.ts look sessions up by it, so a foundation flagged on the
  Year 2 form builds the same program as one flagged on Year 1. Only the
  ITEM ids are namespaced per form.
*/
function foundation(
  form: FormId,
  number: number,
  id: string,
  title: string,
  labels: string[],
  note?: string,
  anchor?: string,
): Foundation {
  return {
    id,
    number,
    title,
    note,
    anchor,
    items: items(`${ITEM_PREFIX[form]}${id}`, labels),
  };
}

/**
 * The eight foundations, in iceberg order (top of the submerged mass down).
 * These ids are shared with lib/icebergContent.ts and lib/programContent.ts —
 * a flagged foundation here looks up its program sessions by the same id, so
 * they must never drift apart.
 */
const year1Foundations: Foundation[] = [
  foundation("year-1", 1, "postural-control", "Postural Control", [
    "The child slumps, leans heavily on the desk or supports their head while writing.",
    "The child has difficulty keeping their feet and body stable.",
    "The child frequently changes position or leaves their seat during writing.",
    "The child appears physically tired during longer writing activities.",
  ]),
  foundation("year-1", 2, "bilateral-coordination", "Bilateral Coordination", [
    "The child does not consistently use their other hand to hold the paper.",
    "The child frequently swaps the pencil between hands.",
    "The child has difficulty moving smoothly across the page from left to right.",
    "The child also finds two-handed classroom activities, such as cutting, ruling or opening containers, difficult.",
  ]),
  foundation("year-1", 3, "fine-motor-control", "Fine Motor Control", [
    "The child has difficulty making small, controlled pencil movements.",
    "The child holds the pencil very tightly, awkwardly or with more fingers than appear necessary for control.",
    "The child presses extremely hard or produces marks that are unusually faint.",
    "The child's hand becomes tired, sore or shaky during writing.",
    "Letter formation and pencil control deteriorate as the task continues.",
  ]),
  foundation("year-1", 4, "sensory-regulation", "Sensory Regulation & Body Awareness", [
    "The child has difficulty settling their body and becoming ready to write.",
    "The child is easily distracted or distressed by ordinary classroom noise, touch or movement.",
    "The child frequently seeks movement, pressure or tactile input during writing.",
    "The child appears unaware of how much pressure they are using with the pencil.",
  ]),
  foundation("year-1", 5, "visual-perception", "Visual Perception", [
    "The child confuses letters or shapes that look similar.",
    "The child frequently reverses letters beyond what would be expected for their age and stage of learning.",
    "The child has difficulty judging spaces between letters or words.",
    "The child loses their place when reading, copying or moving across a worksheet.",
    "The child has difficulty remembering the visual appearance of familiar letters.",
  ]),
  foundation("year-1", 6, "visual-motor-integration", "Visual-Motor Integration", [
    "The child has difficulty copying simple patterns, drawings or letters.",
    "Letters are uneven in size or poorly positioned on the writing line.",
    "The child finds copying from the board more difficult than copying from a nearby model.",
    "What the child produces on paper does not closely resemble the model, even when they appear to understand the task.",
  ]),
  foundation("year-1", 7, "attention-executive-function", "Attention & Executive Function", [
    "The child has difficulty beginning a writing task, even when they understand what to do.",
    "The child loses focus before completing a short, appropriate writing activity.",
    "The child forgets instructions or loses track of the next step.",
    "The child has difficulty organising their materials, ideas or space on the page.",
    "The child becomes overwhelmed when required to think of ideas, spell and form letters at the same time.",
  ]),
  foundation("year-1", 8,
    "language-letter-knowledge",
    "Language & Letter Knowledge",
    [
      "The child has difficulty understanding the language used in writing instructions.",
      "The child has difficulty expressing their idea verbally before writing.",
      "The child does not consistently recognise or name letters expected for their stage of learning.",
      "The child has difficulty connecting letters with their corresponding sounds.",
      "The child cannot readily recall how to form familiar letters without copying a model.",
    ],
    "write words using unjoined lower-case and upper-case letters",
    year1Anchor,
  ),
];

/*
  Year 2. The eight foundations and their domain ids are identical — what
  changes is the statements. Four foundations gain a fifth statement that only
  makes sense once a child has had another year of writing:
    1 · shoulder rather than finger movement
    2 · turning the body or paper instead of reaching across it
    4 · not noticing discomfort or fatigue
    6 · copying pre-writing shapes, listed FIRST because it is the most basic
        check in that foundation and reads oddly anywhere else
*/
const year2Foundations: Foundation[] = [
  foundation("year-2", 1, "postural-control", "Postural Control", [
    "The child slumps, leans heavily on the desk or supports their head while writing.",
    "The child has difficulty keeping their feet and body stable.",
    "The child frequently changes position or leaves their seat during writing.",
    "The child appears physically tired during longer writing activities.",
    "The child uses large movements from the shoulder rather than controlled movements of the hand and fingers.",
  ]),
  foundation("year-2", 2, "bilateral-coordination", "Bilateral Coordination", [
    "The child does not consistently use their other hand to hold or steady the paper.",
    "The child frequently swaps the pencil between hands.",
    "The child turns their body or paper excessively instead of reaching across the page.",
    "The child has difficulty moving smoothly across the page from left to right.",
    "The child also finds two-handed classroom activities, such as cutting, ruling or opening containers, difficult.",
  ]),
  foundation("year-2", 3, "fine-motor-control", "Fine Motor Control", [
    "The child has difficulty making small, controlled pencil movements.",
    "The child holds the pencil very tightly, awkwardly or with more fingers than appear necessary for control.",
    "The child presses extremely hard or produces marks that are unusually faint.",
    "The child's hand becomes tired, sore or shaky during writing.",
    "Letter formation and pencil control deteriorate as the task continues.",
  ]),
  foundation(
    "year-2",
    4,
    "sensory-regulation",
    "Sensory Regulation & Body Awareness",
    [
      "The child has difficulty settling their body and becoming ready to write.",
      "The child is easily distracted or distressed by ordinary classroom noise, touch or movement.",
      "The child frequently seeks movement, pressure or tactile input during writing.",
      "The child appears unaware of how much pressure they are using with the pencil.",
      "The child does not readily notice when their position is uncomfortable or their hand is becoming tired.",
    ],
  ),
  foundation("year-2", 5, "visual-perception", "Visual Perception", [
    "The child confuses letters or shapes that look similar.",
    "The child frequently reverses letters beyond what would be expected for their age and stage of learning.",
    "The child has difficulty judging spaces between letters or words.",
    "The child loses their place when reading, copying or moving across a worksheet.",
    "The child has difficulty remembering the visual appearance of familiar letters.",
  ]),
  foundation(
    "year-2",
    6,
    "visual-motor-integration",
    "Visual-Motor Integration",
    [
      "The child has difficulty copying pre-writing shapes expected for their developmental level.",
      "The child has difficulty copying simple patterns, drawings or letters.",
      "Letters are uneven in size or poorly positioned on the writing line.",
      "The child finds copying from the board more difficult than copying from a nearby model.",
      "What the child produces on paper does not closely resemble the model, even when they appear to understand the task.",
    ],
  ),
  foundation(
    "year-2",
    7,
    "attention-executive-function",
    "Attention & Executive Function",
    [
      "The child has difficulty beginning a writing task, even when they understand what to do.",
      "The child loses focus before completing a short, appropriate writing activity.",
      "The child forgets instructions or loses track of the next step.",
      "The child has difficulty organising their materials, ideas or space on the page.",
      "The child becomes overwhelmed when required to think of ideas, spell and form letters at the same time.",
    ],
  ),
  foundation(
    "year-2",
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
    "write words legibly and with growing fluency using unjoined upper-case and lower-case letters",
    year2Anchor,
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

const year1ShapeIntro =
  "Ask the child to copy each shape. This helps decide which letters to introduce first — the shapes are the movements that build letters.";

const year2ShapeIntro =
  "Ask the child to copy each shape. By Year 2 most children copy these easily — if letters are still poorly formed, this confirms the underlying movements are secure and helps decide which letters to revisit first.";

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

const confidenceLabels = [
  "The child says things such as “I can't write” or “I'm bad at writing.”",
  "The child avoids or resists writing activities.",
  "The child becomes anxious, upset or frustrated when asked to write.",
  "The child gives up quickly or requires frequent reassurance.",
  "The child participates more successfully when the amount, time pressure or copying demand is reduced.",
];

// Identical wording in both forms — how a child feels about writing doesn't
// change with the year level. Only the ids differ, so each form's answers
// stay distinguishable.
const year1Confidence: Item[] = items("confidence", confidenceLabels);
const year2Confidence: Item[] = items("y2-confidence", confidenceLabels);

export const confidenceNote =
  "Emotional distress is often a consequence of handwriting being persistently difficult, rather than the original cause.";

// The doc's "Teacher recommendation" checklist is deliberately left out for
// now — the screener already asks a lot, and the results page says what to
// focus on. The results page still renders `reflection.recommendations` if a
// screening happens to carry them, so nothing already saved is lost.

export const closingNote =
  "A foundation difficulty should guide the support provided — but it should not delay explicit letter teaching and actual handwriting practice. This is a teacher screening tool, not a standardised assessment, so it does not produce a diagnostic total score.";

// ── The forms ────────────────────────────────────────────────────

export type FormId = "year-1" | "year-2";

/*
  One screener form. Everything that differs between year levels lives here;
  everything shared (the rating scale, the shape list, the scoring rules, the
  eight domain ids) stays outside it.
*/
export type ScreenerForm = {
  id: FormId;
  /** Shown on the picker and on the saved results. */
  label: string;
  /** One line on the picker, so the teacher can tell them apart. */
  blurb: string;
  ratingGuidance: string;
  curriculumAnchor: string;
  shapeCheckIntro: string;
  noticeItems: Item[];
  foundations: Foundation[];
  confidenceItems: Item[];
  noticeItemIds: string[];
  confidenceItemIds: string[];
  /** Everything rated on the frequency scale, in the order it appears. */
  allItemIds: string[];
};

function buildForm(
  id: FormId,
  label: string,
  blurb: string,
  ratingGuidance: string,
  curriculumAnchor: string,
  shapeCheckIntro: string,
  noticeItems: Item[],
  foundations: Foundation[],
  confidenceItems: Item[],
): ScreenerForm {
  const noticeItemIds = noticeItems.map((i) => i.id);
  const confidenceItemIds = confidenceItems.map((i) => i.id);
  return {
    id,
    label,
    blurb,
    ratingGuidance,
    curriculumAnchor,
    shapeCheckIntro,
    noticeItems,
    foundations,
    confidenceItems,
    noticeItemIds,
    confidenceItemIds,
    allItemIds: [
      ...noticeItemIds,
      ...foundations.flatMap((f) => f.items.map((i) => i.id)),
      ...confidenceItemIds,
    ],
  };
}

export const year1Form = buildForm(
  "year-1",
  "Year 1",
  "The second year of school. Letter reversals are still developmentally normal.",
  year1Guidance,
  year1Anchor,
  year1ShapeIntro,
  year1Notice,
  year1Foundations,
  year1Confidence,
);

export const year2Form = buildForm(
  "year-2",
  "Year 2",
  "The third year of school. Legible unjoined letters with growing fluency and speed are expected.",
  year2Guidance,
  year2Anchor,
  year2ShapeIntro,
  year2Notice,
  year2Foundations,
  year2Confidence,
);

/** Every form a teacher can choose, in the order they appear on the picker. */
export const screenerForms: ScreenerForm[] = [year1Form, year2Form];

/**
 * The form a saved screening was completed on. Screenings written before Year 2
 * existed carry no form id, and every one of them was the Year 1 form — so an
 * unknown or missing value falls back to Year 1 rather than failing to render.
 */
export function getForm(id: string | null | undefined): ScreenerForm {
  return screenerForms.find((f) => f.id === id) ?? year1Form;
}

// ── Scoring ──────────────────────────────────────────────────────

/** A completed screening is a map of item id → rating. */
export type Responses = Record<string, Rating>;

/**
 * How a foundation came out. `status` drives the summary table; `flagged`
 * (support OR monitor) is what the program builder draws on, worst first.
 */
export type FoundationStatus =
  | "support"
  | "monitor"
  | "clear"
  | "not-assessed";

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
  /** Statements answered on the frequency scale ("Not sure" doesn't count). */
  rated: number;
  /** Statements in this foundation, rated or not. */
  total: number;
  /** Concern as a percentage of the most that could be scored on the rated
   *  statements, 0-100. `null` when too little was rated to say. */
  percent: number | null;
  status: FoundationStatus;
  flagged: boolean;
};

export const statusLabel: Record<FoundationStatus, string> = {
  support: "Needs support",
  monitor: "Monitor",
  clear: "Age appropriate",
  "not-assessed": "Not assessed",
};

/**
 * How much of a section has to be answered before a percentage means
 * anything. Half the statements, rounded up — below that we say "not
 * assessed" rather than scoring a fragment. "Not sure" is not an answer here:
 * it's an explicit "I haven't seen this", so it never counts toward this.
 */
function enoughAnswered(rated: number, total: number): boolean {
  return rated >= Math.ceil(total / 2);
}

/**
 * A section's score as a percentage. The denominator is the most concern the
 * ANSWERED statements could carry (2 points each, for "often"), so skipping a
 * statement as "Not sure" neither helps nor hurts the child's percentage.
 */
function percentOf(concern: number, rated: number): number {
  return rated === 0 ? 0 : (concern / (rated * 2)) * 100;
}

/**
 * The rule for a section's status, as a percentage of the concern possible:
 *
 *   above 50%   needs support   (red)
 *   exactly 50% monitor         (yellow)
 *   below 50%   age appropriate (green)
 *   too few answers             not assessed (blue)
 *
 * Tunable in one place — everything downstream reads the status, not the
 * numbers behind it.
 */
export function statusFor(
  concern: number,
  rated: number,
  total: number,
): FoundationStatus {
  if (!enoughAnswered(rated, total)) return "not-assessed";
  const percent = percentOf(concern, rated);
  if (percent > 50) return "support";
  if (percent === 50) return "monitor";
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
  /**
   * The statements the teacher actually noticed, "often" first. Part 3 is
   * there to get staff thinking about the distress handwriting can cause, so
   * the results hand these back rather than only reporting a verdict — the
   * specifics are what prompt a teacher, not the label.
   */
  noticed: { label: string; rating: Rating }[];
};

export type ScreeningResult = {
  notice: NoticeScore;
  foundations: FoundationScore[];
  /** Every flagged foundation, worst first — these become the program's focus. */
  flaggedFoundations: FoundationScore[];
  confidence: ConfidenceScore;
  /** Foundations left "not assessed" — too little was answered to score them. */
  notAssessedFoundations: FoundationScore[];
  /** True when nothing that WAS assessed came out at or above the halfway
   *  mark. Read it alongside `notAssessedFoundations`: no flags on a mostly
   *  unanswered screener is not the same as a child on track. */
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
 * then most "sometimes").
 *
 * `form` must be the form the screening was actually completed on — the item
 * ids differ between forms, so scoring Year 2 answers against the Year 1 form
 * would find nothing. Callers reading a saved screening should pass
 * `getForm(screening.form_id)`.
 *
 * The thresholds themselves are deliberately identical across forms: what
 * changes with the year level is what a teacher is rating against, not where
 * the line for "needs support" sits.
 */
export function scoreScreening(
  responses: Responses,
  form: ScreenerForm = year1Form,
): ScreeningResult {
  const n = tally(form.noticeItemIds, responses);
  const notice: NoticeScore = {
    ...n,
    // Deliberately the most sensitive rule in the tool: ANY statement rated
    // above "rarely" counts. Part 1 is a gate, not a finding — it only asks
    // whether it's worth looking underneath. A child whose handwriting
    // affects participation even sometimes is worth looking at, and the cost
    // of looking is low. The percentage rule that governs the foundations is
    // deliberately NOT used here; the foundations decide where help is
    // needed, this only decides whether to ask the question.
    affectingParticipation: n.often >= 1 || n.sometimes >= 1,
  };

  const scored: FoundationScore[] = form.foundations.map((f) => {
    const t = tally(
      f.items.map((i) => i.id),
      responses,
    );
    // "Not sure" and unanswered statements are both excluded from the
    // percentage — only the frequency ratings count.
    const rated = t.often + t.sometimes + t.rarely;
    const total = f.items.length;
    const status = statusFor(t.concern, rated, total);
    return {
      id: f.id,
      number: f.number,
      title: f.title,
      ...t,
      rated,
      total,
      percent: status === "not-assessed" ? null : percentOf(t.concern, rated),
      status,
      // A foundation only drives the program when it was actually assessed
      // and came out at or above the halfway mark.
      flagged: status === "support" || status === "monitor",
    };
  });

  // Worst first, by percentage — a section scoring 75% on four answered
  // statements outranks one scoring 60% on five, however the raw counts fall.
  const flaggedFoundations = scored
    .filter((f) => f.flagged)
    .sort(
      (a, b) =>
        (b.percent ?? 0) - (a.percent ?? 0) ||
        b.often - a.often ||
        b.concern - a.concern,
    );

  const c = tally(form.confidenceItemIds, responses);
  const confidence: ConfidenceScore = {
    often: c.often,
    sometimes: c.sometimes,
    concern: c.concern,
    raised: c.often >= 1 || c.sometimes >= 2,
    // Listed even when the verdict stays quiet — a single "sometimes" doesn't
    // reach the threshold, but it is still something the teacher saw and is
    // worth handing back to them.
    noticed: form.confidenceItems
      .map((i) => ({ label: i.label, rating: responses[i.id] }))
      .filter(
        (n): n is { label: string; rating: Rating } =>
          n.rating === "often" || n.rating === "sometimes",
      )
      .sort((a, b) => (a.rating === b.rating ? 0 : a.rating === "often" ? -1 : 1)),
  };

  return {
    notice,
    foundations: scored,
    flaggedFoundations,
    confidence,
    notAssessedFoundations: scored.filter((f) => f.status === "not-assessed"),
    onTrack: flaggedFoundations.length === 0,
  };
}

// ── Student profile options ──────────────────────────────────────

/**
 * The school years staff can pick when adding a student.
 *
 * The first year of school is called different things in different states —
 * Foundation in the national curriculum, Reception in SA — so it carries both
 * names. Students added before this read "Foundation" alone; nothing depends
 * on the exact wording, so both are left as they are.
 */
export const yearLevels = [
  "Foundation/Reception",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
];

/**
 * The form that matches a student's registered year level, or null when there
 * isn't one — only Year 1 and Year 2 forms exist, so a Foundation or Year 3-6
 * student has no exact match and the teacher picks the closest fit themselves.
 *
 * This only ever suggests. A child working well below or above their year
 * should be rated against the expectations that actually fit them, so the
 * choice stays with the teacher.
 */
export function formForYearLevel(
  yearLevel: string | null | undefined,
): FormId | null {
  if (yearLevel === "Year 1") return "year-1";
  if (yearLevel === "Year 2") return "year-2";
  return null;
}

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
