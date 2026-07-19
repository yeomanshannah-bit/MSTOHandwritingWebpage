/*
  The screening tool's content, as data (ported from Hannah's "Webform
  Screening Tool Questions" doc). Keeping it here — separate from any UI —
  means we can render it, score it, and tweak wording in one place.

  Each domain is a heading; each skill under it is rated on a traffic light:
    green  = age-appropriate
    yellow = emerging (sometimes present)
    red    = not present
*/

export type Rating = "green" | "yellow" | "red";

/** The three traffic-light options, shown for every skill. `concern` is the
    hidden weight used later to work out the areas of most difficulty. */
export const ratingOptions: {
  value: Rating;
  label: string;
  short: string;
  concern: number;
}[] = [
  { value: "green", label: "Age-appropriate", short: "Age-appropriate", concern: 0 },
  { value: "yellow", label: "Emerging — sometimes present", short: "Emerging", concern: 1 },
  { value: "red", label: "Not present", short: "Not present", concern: 2 },
];

export type Skill = { id: string; label: string };
export type Domain = { id: string; title: string; skills: Skill[] };

/** Small helper so each skill gets a stable id like "fine-motor-3". */
function domain(id: string, title: string, skills: string[]): Domain {
  return {
    id,
    title,
    skills: skills.map((label, i) => ({ id: `${id}-${i + 1}`, label })),
  };
}

/** The 10 domains, in the order teachers see them. */
export const screeningDomains: Domain[] = [
  domain("early-writing", "Early Writing Skills", [
    "Writes own name",
    "Forms upper and lower case letters correctly",
    "Uses left-to-right direction",
    "Uses appropriate spacing between words",
    "Produces legible writing",
    "Colours in the lines",
  ]),
  domain("fine-motor", "Fine Motor Skills", [
    "Uses pencils effectively",
    "Colours with control",
    "Uses scissors successfully",
    "Manipulates small objects",
    "Opens lunch box effectively",
  ]),
  domain("hand-dominance", "Hand Dominance", [
    "Demonstrates clear hand preference when writing/drawing",
  ]),
  domain("hand-strength", "Hand Strength", [
    "Uses appropriate pressure on pencil for the task",
    "Does not fatigue easily with writing/drawing",
  ]),
  domain("postural-control", "Postural Control", [
    "Sits upright during writing tasks",
    "Maintains seated position",
    "Keeps feet supported",
    "Appears physically comfortable when writing",
  ]),
  domain("midline-crossing", "Midline Crossing", [
    "Colours across page using one hand",
    "Draws across page without switching hands",
    "Participates in cross-body movements",
  ]),
  domain("visual-perceptual", "Visual Perceptual Skills", [
    "Recognises letters accurately",
    "Distinguishes between similar letters (b/d, p/q)",
    "Finds place on page easily",
    "Organises work on the page to the left or right based on instruction",
  ]),
  domain("visual-motor", "Visual Motor Integration", [
    "Copies shapes accurately",
    "Copies letters accurately",
    "Copies work from the board",
    "Demonstrates good eye-hand coordination",
  ]),
  domain("classroom-readiness", "Classroom Readiness", [
    "Participates in table activities",
    "Attends to teacher-directed tasks",
    "Follows 2-step instructions",
    "Persists when tasks become challenging",
    "Completes classroom activities similar to peers",
  ]),
  domain("bilateral-coordination", "Bilateral Coordination", [
    "Uses helper hand effectively",
  ]),
];

/** Every skill id, handy for checking a screening is fully answered. */
export const allSkillIds = screeningDomains.flatMap((d) =>
  d.skills.map((s) => s.id),
);

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

// ── Scoring ──────────────────────────────────────────────────────
// A completed screening is a map of skill id → rating.
export type Responses = Record<string, Rating>;

/** How many "emerging" (yellow) skills in a domain counts as a repeated
    pattern worth flagging. Tunable in one place. */
export const REPEATED_YELLOW = 2;

/** How each domain scored, used for the results page and (later) the program. */
export type DomainScore = {
  id: string;
  title: string;
  green: number;
  yellow: number;
  red: number;
  /** Total concern weight (yellow = 1, red = 2) — used only for ordering. */
  concern: number;
  /** True when this domain needs support: any red, or repeated yellow. */
  flagged: boolean;
};

export type ScreeningResult = {
  domains: DomainScore[];
  totals: { green: number; yellow: number; red: number };
  /** Every flagged domain, worst first — these become the program's focus. */
  flaggedDomains: DomainScore[];
  /** True when nothing was flagged (skills look age-appropriate throughout). */
  onTrack: boolean;
};

const concernOf: Record<Rating, number> = { green: 0, yellow: 1, red: 2 };

/**
 * Turn raw responses into per-domain scores and the list of areas that need
 * support. A domain is flagged when it has any red ("not present") skill, or
 * REPEATED_YELLOW+ "emerging" skills. Flagged domains are ordered worst-first
 * (most reds, then most yellows). No year-level adjustment yet — treated as
 * Year 1.
 */
export function scoreScreening(responses: Responses): ScreeningResult {
  const totals = { green: 0, yellow: 0, red: 0 };

  const domains: DomainScore[] = screeningDomains.map((d) => {
    let green = 0,
      yellow = 0,
      red = 0,
      concern = 0;

    for (const skill of d.skills) {
      const rating = responses[skill.id];
      if (!rating) continue;
      if (rating === "green") green++;
      else if (rating === "yellow") yellow++;
      else red++;
      concern += concernOf[rating];
    }

    totals.green += green;
    totals.yellow += yellow;
    totals.red += red;

    const flagged = red >= 1 || yellow >= REPEATED_YELLOW;
    return { id: d.id, title: d.title, green, yellow, red, concern, flagged };
  });

  const flaggedDomains = domains
    .filter((d) => d.flagged)
    .sort((a, b) => b.red - a.red || b.yellow - a.yellow || b.concern - a.concern);

  return {
    domains,
    totals,
    flaggedDomains,
    onTrack: flaggedDomains.length === 0,
  };
}
