import type { Metadata } from "next";
import Link from "next/link";
import ScreenAStudentLink from "@/components/ScreenAStudentLink";
import IcebergModel from "@/components/IcebergModel";
import { ArticleSections, type Section } from "@/components/ArticleBody";

export const metadata: Metadata = {
  title: "The Handwriting Iceberg — Making Sense OT",
  description:
    "Looking beneath what we see on the page: the eight foundations that sit under handwriting, what each looks like when it is tricky, and simple ways to help.",
};

/*
  The Handwriting Iceberg, ported from
  Content/Iceberg/The Handwriting Iceberg[82].docx.

  The page runs in three parts: the prose that sets up the idea (`opening`),
  the interactive picture, then the eight foundations one by one
  (`foundationDetail`) and the cautions that close the document (`closing`).
  The picture sits between the setup and the detail because it is what the
  eight sections below are a walk through — you meet the foundations on the
  iceberg first, then read them properly.
*/
const opening: Section[] = [
  {
    heading: "Looking beneath what we see on the page",
    blocks: [
      {
        kind: "p",
        text: "When a child's handwriting is slow, difficult to read, tiring or upsetting, it is natural to focus on the writing itself. We may notice poorly formed letters, inconsistent sizing, uneven spacing, difficulty staying on the line or work that is left unfinished. These are important observations — but they are only the visible part of the story.",
      },
      {
        kind: "p",
        text: "The Making Sense of Handwriting Iceberg helps us look beneath the surface. Handwriting is a complex task requiring many parts of the body and brain to work together. A child needs to maintain a stable position, coordinate both sides of the body, control the pencil, interpret visual information, connect what they see with how they move, remain attentive and remember what letters look like and represent.",
      },
      {
        kind: "p",
        text: "When one or more of these foundations is difficult, the effect may appear in the child's handwriting.",
      },
      {
        kind: "quote",
        text: "Handwriting difficulty is what we see on the page. The reason for that difficulty may lie beneath the surface.",
      },
      {
        kind: "p",
        text: "The iceberg encourages us to replace judgement with curiosity. Instead of assuming that a child is careless, rushing or not trying, we can ask:",
      },
      {
        kind: "quote",
        text: "What might be making writing harder for this child?",
      },
    ],
  },
  {
    heading: "The eight foundations beneath the iceberg",
    blocks: [
      {
        kind: "p",
        text: "The Making Sense of Handwriting Iceberg includes eight broad areas. These areas overlap and work together. The categories help us organise our observations, but a child does not experience them as separate systems.",
      },
      {
        kind: "p",
        text: "A child does not need to have difficulty in all eight areas. Some children have strong underlying foundations but have not yet received enough explicit instruction in letter formation. Others may know exactly how a letter should look but struggle to produce it efficiently because of physical, visual, sensory or attentional demands.",
      },
      {
        kind: "p",
        text: "The purpose of the iceberg is not to diagnose a child. It is to help teachers, school support staff and parents notice patterns and choose a more useful next step.",
      },
    ],
  },
];

/*
  The eight foundations in full. Each is three paragraphs in the source: what
  the foundation is, what it looks like when it is difficult, and what helps.
  Kept as its own array rather than as `Section`s so the numbering can be part
  of the presentation instead of being typed into every heading.
*/
const foundationDetail: { title: string; paragraphs: string[] }[] = [
  {
    title: "Postural control",
    paragraphs: [
      "Postural control is the ability to keep the body stable and supported while completing a task. At a desk, the child needs enough stability through the trunk and shoulders to sit comfortably and use the hands freely.",
      "When postural control is difficult, a child may slump, lean heavily on the desk, wrap their feet around the chair, frequently change position or hold their head very close to the page. They may tire quickly, prop their head in one hand or avoid longer writing tasks.",
      "Simple changes can help. Ensure the child's feet are supported, the desk and chair are an appropriate height and the paper is positioned comfortably. Brief movement or pushing activities before writing may also help some children feel more physically ready.",
    ],
  },
  {
    title: "Bilateral coordination",
    paragraphs: [
      "Bilateral coordination is the ability to use both sides of the body together in an organised way. During handwriting, one hand writes while the other stabilises and moves the paper. This area also includes crossing the midline — the ability to reach across the centre of the body without unnecessarily changing hands or repositioning the whole body.",
      "A child experiencing difficulty may forget to hold the page, constantly rotate or move it, swap hands during a task or avoid reaching across the page. Cutting, using a ruler, opening containers and managing clothing fasteners may also be challenging.",
      "Activities using both hands together — such as cutting, threading, construction play, ball games and drawing on a large vertical surface — can support this foundation. During writing, a simple reminder such as “helper hand on the page” may be enough.",
    ],
  },
  {
    title: "Fine motor control",
    paragraphs: [
      "Fine motor control allows the small muscles of the hands and fingers to make controlled and precise movements. Hand strength, dexterity, pencil control and endurance all contribute to this area.",
      "When fine motor control is difficult, a child may use excessive pressure, hold the pencil very tightly, make faint marks or rely on large movements from the shoulder rather than smaller finger movements. Their hand may become tired or sore, and writing may become less controlled as the task continues.",
      "Short activities involving pinching, squeezing, manipulating and building can help develop hand skills. The aim is not to insist on one “perfect” pencil grip. A functional grip is one that allows the child to control the pencil, see their work and write without unnecessary discomfort or fatigue.",
    ],
  },
  {
    title: "Sensory regulation",
    paragraphs: [
      "Sensory regulation is the ability to notice and respond to sensory information while remaining ready to participate. Writing involves touch, pressure, movement, sound and visual information, all within the sensory environment of the classroom.",
      "A child may be distracted by noise, movement or visual clutter. They may avoid the feeling of certain pencils or paper, press very heavily to gain more feedback, seek frequent movement or become overwhelmed during busy classroom activities. Another child may appear under-alert and have difficulty becoming ready to begin.",
      "Sensory support should be individual and purposeful. A quieter position, reduced visual clutter, a brief movement activity, an appropriate writing tool or planned opportunities to pause may help. Sensory strategies should prepare the child to participate in writing rather than replace the writing task.",
    ],
  },
  {
    title: "Visual perception",
    paragraphs: [
      "Visual perception is the brain's ability to notice, interpret and remember what the eyes see. It helps a child recognise shapes, identify differences between letters, understand position and direction, and find important information on a page.",
      "When visual perception is difficult, a child may confuse similar letters, lose their place when copying, have trouble finding a word on a busy worksheet or struggle to remember what a letter looks like. Letter size, spacing and orientation may also be inconsistent.",
      "Clear and uncluttered models can reduce the visual demand. It may help to place the model close to the child, highlight the writing line, reduce the amount copied at one time or explicitly draw attention to the distinctive features of similar letters.",
    ],
  },
  {
    title: "Visual-motor integration",
    paragraphs: [
      "Visual-motor integration is the ability to coordinate visual information with hand movement. It allows a child to reproduce what they see, guide the pencil along a path and organise letters and words within the available space.",
      "A child may be able to recognise a letter correctly but have difficulty drawing it. They may struggle to copy shapes, maintain consistent letter size, place letters on the line or space words appropriately. Copying from the board can be particularly demanding because the child must repeatedly look up, locate the information, remember it and reproduce it on the page.",
      "Starting with developmentally appropriate pre-writing shapes may be necessary before expecting accurate letter formation. Shorter copying distances, models placed on the desk and explicit instruction about starting points and movement patterns can also help.",
    ],
  },
  {
    title: "Attention and concentration",
    paragraphs: [
      "Handwriting requires a child to begin, maintain focus, monitor their work and remember several pieces of information at once. They may need to hold an idea in mind while also thinking about spelling, letter formation, spacing and punctuation.",
      "When attention and concentration are difficult, a child may begin before hearing the full instruction, lose their place, omit parts of words, produce inconsistent work or take a long time to get started. Their handwriting may be clear at first and then deteriorate as attention or mental energy decreases.",
      "Brief, clearly defined tasks are often more manageable than a full page of writing. A visual example, one instruction at a time, reduced copying and a clear finishing point can help. Short pauses may also allow the child to reset without removing the expectation to participate.",
    ],
  },
  {
    title: "Language and letter recognition",
    paragraphs: [
      "Handwriting is not only a motor task. Children must understand that letters are symbols that represent sounds and combine to form words. They need to recognise letters, remember their names and sounds, retrieve their shapes and connect them with the correct movement patterns.",
      "A child may form a letter when copying it but be unable to produce it from memory. They may confuse letter names or sounds, hesitate before beginning, rely heavily on an alphabet strip or struggle to remember the sequence of movements. Difficulties with spoken language, phonological awareness, spelling or vocabulary can add substantially to the demands of written work.",
      "Teaching should connect the letter's name, sound, appearance and movement. Teachers can use consistent language to describe where the letter begins and how it is formed, while providing repeated opportunities to retrieve and write the letter from memory. Language assessment and intervention may sit within the expertise of teachers and speech pathologists rather than occupational therapists. It remains part of the iceberg because it is fundamental to understanding why writing may be difficult.",
    ],
  },
];

const closing: Section[] = [
  {
    heading: "The iceberg is not the whole intervention",
    blocks: [
      {
        kind: "p",
        text: "Looking beneath the surface helps us choose useful supports, but there is an important caution:",
      },
      {
        kind: "quote",
        text: "Activities that support the foundations do not replace explicit handwriting instruction.",
      },
      {
        kind: "p",
        text: "Strengthening a child's hands will not teach them where to begin a letter. Improving posture will not teach the movement sequence for writing it. Attention strategies may help a child become ready to learn, but the letter still needs to be directly taught and practised.",
      },
      {
        kind: "p",
        text: "If handwriting is the skill we want to improve, children must spend some time actually handwriting. The Making Sense of Handwriting model therefore combines two approaches:",
      },
      {
        kind: "pillars",
        items: [
          "Support the foundations that make writing possible",
          "Explicitly teach and practise handwriting itself",
        ],
      },
      {
        kind: "p",
        text: "Sometimes the balance will be different for different children. One child may primarily need clearer letter instruction and practice. Another may need an environmental adjustment before they can participate comfortably. A third may need both targeted foundation activities and carefully graded handwriting teaching.",
      },
    ],
  },
  {
    heading: "What teachers are — and are not — being asked to do",
    blocks: [
      {
        kind: "p",
        text: "Teachers and school support staff are not expected to diagnose difficulties or provide therapy in the classroom. The iceberg is an observation and planning tool. It can help the team consider:",
      },
      {
        kind: "list",
        items: [
          "What does the child already do well?",
          "When and where is handwriting most difficult?",
          "Is the child having difficulty knowing how to form the letters, physically producing them, or both?",
          "Is there a simple classroom adjustment that may help?",
          "What is the next achievable skill to teach?",
          "Is further assessment or professional support needed?",
        ],
      },
      {
        kind: "p",
        text: "The most useful support is not always the longest or most complicated. A stable chair position, a nearby letter model, five minutes of correctly targeted practice or a reduction in unnecessary copying may make a meaningful difference.",
      },
    ],
  },
  {
    heading: "Looking beyond neatness",
    blocks: [
      {
        kind: "p",
        text: "The goal of understanding the Handwriting Iceberg is not to produce perfectly neat work. It is to help children write with enough comfort, fluency and confidence to participate in learning and communicate their ideas.",
      },
      {
        kind: "quote",
        text: "When we look only at the page, we see the errors. When we look beneath the surface, we begin to understand the child.",
      },
      {
        kind: "p",
        text: "The iceberg helps us identify what may be getting in the way, support what lies underneath and teach the handwriting skill the child is ready to learn next.",
      },
    ],
  },
];

export default function IcebergPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-14">
      {/* --- article header --- */}
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-msot-blue">
          Free education · No account needed
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-msot-navy sm:text-[2.75rem]">
          The Handwriting Iceberg
        </h1>
        <p className="mt-4 text-xl font-medium text-msot-teal">
          Looking beneath what we see on the page
        </p>

        <div className="mt-5 flex items-center gap-3 text-sm text-foreground/60">
          <span className="font-medium text-msot-navy">Making Sense OT</span>
          <span aria-hidden className="text-foreground/25">
            |
          </span>
          <span>10 min read</span>
        </div>
      </header>

      {/* Setup, then the picture. Full width rather than the article page's
          two-column grid, because the iceberg itself needs the room. */}
      <div className="mt-12 max-w-3xl">
        <ArticleSections sections={opening} />
      </div>

      {/* The same interactive iceberg as the home page, with its own heading
          and call to action switched off — this page supplies both. */}
      <IcebergModel intro={false} cta={false} />

      <p className="mx-auto mt-6 max-w-xl text-center text-base leading-7 text-foreground/60">
        Tap any foundation on the iceberg to open it, or read each one in full
        below.
      </p>

      {/* --- the eight, in detail --- */}
      <section className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-msot-navy">
          The eight foundations, one by one
        </h2>
        {foundationDetail.map((f, i) => (
          <div key={f.title} className="mt-10">
            <h3 className="flex items-baseline gap-3 text-xl font-bold text-msot-navy">
              <span className="flex size-8 shrink-0 items-center justify-center self-center rounded-full bg-msot-cyan/20 text-base font-bold text-msot-blue">
                {i + 1}
              </span>
              {f.title}
            </h3>
            {f.paragraphs.map((p) => (
              <p
                key={p.slice(0, 40)}
                className="mt-4 text-lg leading-8 text-foreground/75"
              >
                {p}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* --- cautions and close --- */}
      <div className="mx-auto mt-16 max-w-3xl">
        <ArticleSections sections={closing} />
      </div>

      {/* --- call to action --- */}
      <div className="mx-auto mt-16 max-w-xl rounded-2xl bg-msot-blue p-8 text-center text-white">
        <h2 className="text-2xl font-bold">See what&apos;s below the surface</h2>
        <p className="mx-auto mt-2 max-w-md text-white/85">
          Our screener works down the iceberg foundation by foundation and shows
          you exactly where a student needs support.
        </p>
        <ScreenAStudentLink className="mt-6" />
        <p className="mt-5 text-sm text-white/75">
          The iceberg is half the picture —{" "}
          <Link href="/the-handwriting-model" className="underline">
            read the full model
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
