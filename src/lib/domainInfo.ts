/*
  "Learn more" content for each screener domain, shown when a label on the
  iceberg is clicked. This is PLACEHOLDER copy — Hannah will replace each
  `blurb` and `paragraphs` with the real explanation. Keyed by the domain ids
  from screening.ts so the two always line up.
*/

export type DomainInfo = {
  blurb: string;
  paragraphs: string[];
};

export const domainInfo: Record<string, DomainInfo> = {
  "early-writing": {
    blurb: "The visible writing skills — letters, spacing, and legibility.",
    paragraphs: [
      "Placeholder: explain what early writing skills are and why they sit near the surface of the iceberg.",
      "Placeholder: what to look for in the classroom, and how difficulties here often trace back to the skills below.",
    ],
  },
  "fine-motor": {
    blurb: "The small, precise finger and hand movements writing relies on.",
    paragraphs: [
      "Placeholder: what fine motor control means for handwriting — grip, pencil control, using tools.",
      "Placeholder: everyday signs of fine-motor difficulty and simple ways to support it.",
    ],
  },
  "hand-dominance": {
    blurb: "A settled, consistent preferred hand for writing and drawing.",
    paragraphs: [
      "Placeholder: why a clear hand preference matters for building skill.",
      "Placeholder: what an unsettled hand preference can look like and when to be curious about it.",
    ],
  },
  "hand-strength": {
    blurb: "The strength and endurance behind a steady, comfortable pencil.",
    paragraphs: [
      "Placeholder: how hand strength affects pencil pressure and fatigue.",
      "Placeholder: playful ways to build the small muscles of the hand.",
    ],
  },
  "postural-control": {
    blurb: "A stable, upright body that frees the hands to write.",
    paragraphs: [
      "Placeholder: why posture and core stability underpin handwriting.",
      "Placeholder: seating and set-up tips that support writing.",
    ],
  },
  "midline-crossing": {
    blurb: "Comfortably working across the middle of the body.",
    paragraphs: [
      "Placeholder: what crossing the midline is and why it matters for smooth writing.",
      "Placeholder: signs a child avoids the midline, and movement activities that help.",
    ],
  },
  "visual-perceptual": {
    blurb: "Making sense of letters, spacing, and direction on the page.",
    paragraphs: [
      "Placeholder: what visual perception covers — recognising letters, spacing, direction.",
      "Placeholder: how visual-perceptual difficulties show up in written work.",
    ],
  },
  "visual-motor": {
    blurb: "Connecting what the eyes see with what the hand does.",
    paragraphs: [
      "Placeholder: what visual-motor integration means — copying shapes, letters, and board work.",
      "Placeholder: how to support hand–eye coordination for writing.",
    ],
  },
  "classroom-readiness": {
    blurb: "Attention, participation, and following classroom tasks.",
    paragraphs: [
      "Placeholder: how classroom-readiness skills affect a child's ability to access writing tasks.",
      "Placeholder: strategies that help a child engage and persist.",
    ],
  },
  "bilateral-coordination": {
    blurb: "Two hands working together — one writes, one steadies the page.",
    paragraphs: [
      "Placeholder: what bilateral coordination is and the role of the 'helper hand'.",
      "Placeholder: activities that build both sides of the body working together.",
    ],
  },
};
