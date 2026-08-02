/*
  Content for the "Making Sense of Handwriting Iceberg".

  Ported verbatim from Content/Iceberg/Handwriting_Iceberg_EDITABLEAugust1_2026.pptx
  — slide 1 supplies the two headings and the "what we see" list; slides 2-9
  supply the eight foundations and their three-part "learn more" panels.

  Note: these eight foundations are deliberately NOT the screener's domains
  (see lib/screening.ts). The screener will be brought into line separately.
*/

/** Slide 1, "WHAT WE SEE" — the visible tip of the iceberg. */
export const whatWeSee = [
  "Difficult-to-read handwriting",
  "Slow or effortful writing",
  "Poor letter formation",
  "Avoidance, fatigue or frustration",
  "Difficulty getting ideas onto paper",
];

export type Foundation = {
  id: string;
  /** 1-8, matching the numbering on the slides. */
  number: number;
  title: string;
  whatItIs: string;
  whenTricky: string;
  waysToHelp: string;
};

/** Slides 2-9, in slide order. */
export const foundations: Foundation[] = [
  {
    id: "postural-control",
    number: 1,
    title: "Postural control",
    whatItIs:
      "Postural control is the ability to keep the body stable and upright while writing. It provides a steady base so the shoulder, arm and hand can move with control.",
    whenTricky:
      "The child may slump, lean heavily on the desk, wrap their feet around the chair or support their head with one hand. They may frequently change position or become tired during writing tasks.",
    waysToHelp:
      "Make sure the child's chair and table are the right height, with their feet supported and forearms resting comfortably on the desk. Use brief movement breaks and short activities that strengthen the shoulders and upper body, such as wall pushes, climbing and animal walks.",
  },
  {
    id: "bilateral-coordination",
    number: 2,
    title: "Bilateral coordination",
    whatItIs:
      "Bilateral coordination is the ability to use both sides of the body together in a coordinated way. During writing, one hand holds and moves the pencil while the other stabilises and adjusts the paper.",
    whenTricky:
      "The child may forget to hold the paper, frequently swap hands or turn their whole body instead of reaching across the page. Cutting, ruling lines, opening containers and other two-handed classroom activities may also be difficult.",
    waysToHelp:
      "Remind the child to use a “writing hand” and a “helper hand,” and place a small sticker where the helper hand should rest. Include two-handed activities such as cutting, threading, rolling playdough, catching balls and drawing across large surfaces.",
  },
  {
    id: "fine-motor-control",
    number: 3,
    title: "Fine motor control",
    whatItIs:
      "Fine motor control is the ability to use the small muscles of the hands and fingers for precise movements. It includes pencil control, grasp, finger dexterity, hand strength and the endurance needed to keep writing.",
    whenTricky:
      "The child may use an awkward or very tight pencil grasp, press too hard or too lightly, and produce large or poorly controlled letters. Their hand may become tired or sore, and their handwriting may deteriorate as the task continues.",
    waysToHelp:
      "Provide short, regular opportunities to draw and write using comfortable pencils or crayons that suit the child's hand. Build hand control through playdough, construction toys, pegs, tweezers, tearing paper and other enjoyable finger activities.",
  },
  {
    id: "sensory-regulation",
    number: 4,
    title: "Sensory regulation and body awareness",
    whatItIs:
      "Sensory regulation is the ability to manage sensory information so the body is calm, alert and ready to write. Body awareness helps the child judge their position, movement and the amount of pressure to use.",
    whenTricky:
      "The child may be distracted by noise, touch or movement, seek constant movement, avoid certain materials or use too much or too little pencil pressure. They may not notice an uncomfortable position or recognise that their hand is becoming tired.",
    waysToHelp:
      "Reduce unnecessary distractions and provide a predictable writing space, while recognising that different children need different levels of movement and sensory input. Try a brief movement or “heavy work” activity before writing and teach the child to check their body, hand comfort and pencil pressure.",
  },
  {
    id: "visual-perception",
    number: 5,
    title: "Visual perception",
    whatItIs:
      "Visual perception is the brain's ability to notice, understand and remember what the eyes see. It helps children recognise letters, understand direction, judge spacing and find their place on a page.",
    whenTricky:
      "The child may confuse similar letters, reverse letters, lose their place when copying or have inconsistent spacing and letter placement. They may struggle to find information on a busy worksheet or remember what a letter looks like.",
    waysToHelp:
      "Use clear, uncluttered worksheets and visually highlight starting points, writing lines or spaces between words. Practise matching shapes and letters, spotting differences, completing simple puzzles and remembering short visual patterns.",
  },
  {
    id: "visual-motor-integration",
    number: 6,
    title: "Visual-motor integration",
    whatItIs:
      "Visual-motor integration is the ability to coordinate what the eyes see with what the hand produces. It supports copying shapes, forming letters and placing writing accurately on the page.",
    whenTricky:
      "The child may have difficulty copying pre-writing shapes, letters, patterns or information from the board. Letters may be poorly formed, unevenly sized or placed above and below the writing line.",
    waysToHelp:
      "Begin at the child's current level by practising pre-writing shapes, simple patterns or letters with clear starting points and movement cues. Use large movements first and then gradually move to smaller paper-and-pencil tasks while providing a close, uncluttered model.",
  },
  {
    id: "attention-executive-function",
    number: 7,
    title: "Attention and executive function",
    whatItIs:
      "Attention and executive function help a child begin, organise, remember and complete a writing task. These skills allow the child to follow instructions, sequence ideas, monitor their work and remain focused.",
    whenTricky:
      "The child may struggle to get started, forget instructions, lose materials or stop before the task is finished. They may know what they want to write but become overwhelmed by planning, spelling, letter formation and remembering all the steps at once.",
    waysToHelp:
      "Break writing tasks into small, clearly explained steps and show the child only one or two steps at a time. Use visual checklists, predictable routines, short writing periods and reduced copying demands to lower the load on attention and working memory.",
  },
  {
    id: "language-letter-knowledge",
    number: 8,
    title: "Language and letter knowledge",
    whatItIs:
      "Language and letter knowledge include understanding instructions, expressing ideas and knowing letter names, sounds and formation patterns. These skills help a child decide what to write and retrieve the letters needed to record it.",
    whenTricky:
      "The child may struggle to understand the task, generate a sentence, remember a letter or connect a sound with the correct written symbol. Their handwriting may appear slow because they are spending considerable effort deciding what to say, spell or write next.",
    waysToHelp:
      "Talk through the child's idea before writing and provide sentence starters, word banks or a simple visual plan when needed. Teach letter names, sounds and formation explicitly, and collaborate with the classroom teacher or speech pathologist when broader language or literacy difficulties are present.",
  },
];

/** Slide 1's closing line. */
export const closingLine =
  "Effective support addresses the whole child — while still explicitly teaching and practising handwriting.";
