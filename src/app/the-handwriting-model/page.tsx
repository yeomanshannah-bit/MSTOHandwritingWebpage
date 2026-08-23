import type { Metadata } from "next";
import Link from "next/link";
import ScreenAStudentLink from "@/components/ScreenAStudentLink";
import { ArticleSections, type Section } from "@/components/ArticleBody";

export const metadata: Metadata = {
  title: "The Making Sense of Handwriting Model — Making Sense OT",
  description:
    "A practical and balanced approach for busy classrooms: support the foundations that make writing possible, and explicitly teach and practise handwriting itself.",
};

/*
  The model explained in full, ported from
  Content/The Making Sense of Handwriting Model.docx.

  The source document was cut back sharply in Aug 2026: the sections arguing
  the general case for handwriting ("Why does handwriting still matter?",
  "When handwriting becomes a tool for thinking") moved out to their own
  article, /why-handwriting-matters, so this page is now only the model.

  Words live in `article` as data so the copy can be edited without touching
  layout; the block types and their presentation live in components/ArticleBody,
  shared with the iceberg page.
*/
const article: Section[] = [
  {
    heading: "The heart of the model",
    blocks: [
      {
        kind: "p",
        text: "The Making Sense of Handwriting model brings two essential elements together:",
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
        text: "Neither element should stand alone. Foundational activities without handwriting instruction may help a child develop the capacity to write without teaching them how to form letters. Repeated writing practice without considering the foundations may leave a child repeatedly attempting a task that is physically, visually or cognitively too difficult.",
      },
      {
        kind: "p",
        text: "Effective support begins at the child's current developmental level — not simply at the point their age or year level suggests they should have reached. For one child, the next step may be learning to draw vertical and horizontal lines. For another, it may be correcting an inefficient letter pattern. An older student may need support to develop fluency, endurance or access to keyboarding and assistive technology for longer tasks.",
      },
      {
        kind: "quote",
        text: "Meeting a child where they are does not mean lowering expectations. It means identifying the next achievable step that will help them progress.",
      },
    ],
  },
  {
    heading: "This does not need to become another large program",
    blocks: [
      {
        kind: "p",
        text: "Teachers are not expected to assess or treat every skill beneath the iceberg. Nor do children necessarily need long handwriting sessions.",
      },
      {
        kind: "p",
        text: "A short period of correctly targeted instruction and practice can be more useful than repeatedly asking a child to complete work that is currently beyond their capacity. Small adjustments can be incorporated into existing literacy lessons, transitions, individual support time or classroom routines.",
      },
      {
        kind: "p",
        text: "The Making Sense of Handwriting screener and practical activities are intended to help teachers and school support staff decide:",
      },
      {
        kind: "list",
        items: [
          "What is the child currently able to do?",
          "What may be making handwriting difficult?",
          "Does the child need an environmental adjustment, support for a foundation skill, explicit letter instruction — or a combination?",
          "What is the most useful next step?",
        ],
      },
    ],
  },
  {
    heading: "Bringing experience, evidence and classroom reality together",
    blocks: [
      {
        kind: "p",
        text: "For forty years, occupational therapist Anne Basedow has worked alongside children, families and schools. During that time, requests for help with handwriting have remained among the most common concerns raised by teachers and parents.",
      },
      {
        kind: "p",
        text: "The Making Sense of Handwriting model brings this clinical experience together with current research and a deep respect for the realities of classrooms.",
      },
      {
        kind: "p",
        text: "It is not about returning education to the past or asking teachers to do more with less. It is about protecting an important learning experience, understanding why children struggle and using the time available as purposefully as possible.",
      },
      {
        kind: "quote",
        text: "Handwriting develops when we support the foundations and teach the skill itself — meeting each child where they are and helping them take the next achievable step.",
      },
    ],
  },
];

export default function TheHandwritingModelPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-14">
      {/* --- article header --- */}
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-msot-blue">
          Free education · No account needed
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-msot-navy sm:text-[2.75rem]">
          The Making Sense of Handwriting Model
        </h1>
        <p className="mt-4 text-xl font-medium text-msot-teal">
          A practical and balanced approach for busy classrooms
        </p>

        <div className="mt-5 flex items-center gap-3 text-sm text-foreground/60">
          <span className="font-medium text-msot-navy">Making Sense OT</span>
          <span aria-hidden className="text-foreground/25">
            |
          </span>
          <span>4 min read</span>
        </div>
      </header>

      {/* --- lede --- */}
      <p className="mt-10 max-w-3xl text-xl leading-9 text-foreground/80">
        Teachers are being asked to fit an extraordinary amount into every
        school day. Alongside teaching the curriculum, they are responding to
        increasingly diverse learning needs, supporting children&rsquo;s
        wellbeing, managing behaviour, completing assessments and communicating
        with families and other professionals. Handwriting support cannot simply
        become another lengthy program or responsibility added to this already
        demanding workload.
      </p>

      {/*
        Body and call-to-action share a two-column grid that starts below the
        header and lede, so the sticky panel lines up with the first heading
        rather than the title. Same arrangement as the article page.
      */}
      <div className="mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
        <div className="max-w-3xl">
          <ArticleSections sections={article} />
        </div>

        <aside className="mt-16 lg:mt-0">
          {/* top-24 clears the sticky site header (~65px) plus breathing room */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-msot-blue/25 bg-msot-blue/[.06] p-6">
              <h2 className="text-lg font-semibold leading-snug text-msot-navy">
                See the iceberg
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-foreground/70">
                The eight foundations beneath handwriting, each one explained —
                what it is, when it is tricky, and ways to help.
              </p>
              <Link
                href="/iceberg"
                className="mt-5 inline-flex rounded-full bg-msot-blue px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-msot-navy"
              >
                Explore the iceberg →
              </Link>
            </div>

            <div className="rounded-2xl border border-msot-teal/25 bg-msot-teal/[.06] p-6">
              <h2 className="text-lg font-semibold leading-snug text-msot-navy">
                Put the model to work
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-foreground/70">
                The screener asks what the child can currently do and what may
                be making handwriting difficult, then points to the most useful
                next step.
              </p>
              <ScreenAStudentLink />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
