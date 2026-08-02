/*
  TEMPORARY BRIDGE — delete this file when the screener is rebuilt.

  The screener still uses its original ten domains; the program and the iceberg
  use the eight foundations from the PowerPoint. Until the screener is reworked
  the two don't line up, so a flagged screening domain would find no program
  content and quietly produce an empty program.

  This maps each old screening domain onto the foundation whose activities best
  address it. Several old domains collapse onto one foundation (hand strength
  and fine motor both point at Fine motor control), which is fine — we
  de-duplicate while keeping worst-first order.

  Sensory regulation and body awareness has no equivalent in the old screener,
  so it can never be selected until the rework. That's expected.
*/

const BRIDGE: Record<string, string> = {
  "postural-control": "postural-control",
  "bilateral-coordination": "bilateral-coordination",
  "midline-crossing": "bilateral-coordination",
  "fine-motor": "fine-motor-control",
  "hand-strength": "fine-motor-control",
  "hand-dominance": "fine-motor-control",
  "visual-perceptual": "visual-perception",
  "visual-motor": "visual-motor-integration",
  "classroom-readiness": "attention-executive-function",
  "early-writing": "language-letter-knowledge",
};

/**
 * Map flagged screening domain ids (worst-first) onto program foundation ids,
 * preserving order and dropping duplicates.
 */
export function toProgramDomainIds(flaggedDomainIds: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of flaggedDomainIds) {
    // Already a foundation id? Pass it through — this is what will happen for
    // every domain once the screener rework lands.
    const mapped = BRIDGE[id] ?? id;
    if (!seen.has(mapped)) {
      seen.add(mapped);
      out.push(mapped);
    }
  }
  return out;
}
