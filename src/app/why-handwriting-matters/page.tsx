import type { Metadata } from "next";
import Link from "next/link";
import ScreenAStudentLink from "@/components/ScreenAStudentLink";
import Image from "next/image";
import { ArticleSections, type Section } from "@/components/ArticleBody";

export const metadata: Metadata = {
  title: "Why handwriting still matters in a digital age",
  description:
    "Children will type most of the words they ever write. The case for handwriting anyway: how forming letters builds literacy, and when to reach for a keyboard instead.",
};

/*
  Ported from Content/Why handwriting matters digital age.docx.

  This article and /the-handwriting-model were split apart in Aug 2026: the
  general case for handwriting lives here, and the model page is now only the
  model. Words live in `article` as data so the copy can be edited without
  touching layout; the block types live in components/ArticleBody, shared with
  the model and iceberg pages.
*/
const article: Section[] = [
  {
    heading: "Handwriting is part of how children learn to read and write",
    blocks: [
      {
        kind: "p",
        text: "Learning to form letters is not simply an old-fashioned way of recording words. It is part of how children develop literacy itself.",
      },
      {
        kind: "p",
        text: "When a child writes a letter by hand, the brain coordinates vision, movement, touch, attention and memory all at once. The child must recall the letter's shape, decide where to begin, plan the direction of movement and monitor what appears on the page. At the same time, they are learning to connect that shape with the letter's name and its sound.",
      },
      {
        kind: "p",
        text: "Pressing a key is also a valuable skill, but it is a different learning experience. Every handwritten letter has its own movement pattern. Forming a b and forming a d, for example, require different starting points and different movements. Feeling and producing those differences helps children build stronger, more detailed knowledge of letters. A keyboard, by contrast, makes every letter the same physical action.",
      },
    ],
  },
  {
    heading: "The right tool for the moment",
    blocks: [
      {
        kind: "p",
        text: "Handwriting, keyboarding and assistive technology all have an important place in modern education. The real question is not whether classrooms should use paper or screens. It is:",
      },
      {
        kind: "quote",
        text: "Which tool will best support the learning taking place at this moment?",
      },
      {
        kind: "p",
        text: "For a child learning letter shapes, sounds and spelling patterns, pencil and paper may offer an essential physical learning experience. For drafting, editing, researching or reducing the load of extended written work, technology may be exactly the right choice. A balanced classroom protects opportunities for both.",
      },
    ],
  },
  {
    heading: "When handwriting becomes a tool for thinking",
    blocks: [
      {
        kind: "p",
        text: "In the early stages of learning, handwriting demands real mental effort. A beginning writer may be juggling all of this at once:",
      },
      {
        kind: "list",
        items: [
          "Where do I start this letter?",
          "Which direction does it go?",
          "How do I hold my pencil?",
          "Does it sit on the line?",
          "What sound am I writing?",
          "What was I trying to say?",
        ],
      },
      {
        kind: "p",
        text: "Attention and working memory are limited. If a child must pour most of that capacity into forming individual letters, there is little left for spelling, vocabulary, sentence construction and organising ideas.",
      },
      {
        kind: "p",
        text: "With explicit teaching and purposeful practice, letter formation gradually becomes more automatic. The child no longer plans every movement consciously, and handwriting shifts from being the task itself to becoming a tool for learning and communication.",
      },
      {
        kind: "quote",
        text: "When handwriting becomes automatic, children can stop thinking so much about how to write and start thinking about what they want to say.",
      },
      {
        kind: "p",
        text: "This is one reason children with slow or effortful handwriting often produce far less on the page than they can explain out loud. They do not have fewer ideas. Too many of those ideas are simply lost while they wrestle with the physical and mental demands of getting them down.",
      },
    ],
  },
  {
    heading: "Balance, not either-or",
    blocks: [
      {
        kind: "p",
        text: "Predictions that technology would make handwriting obsolete have not held up. Instead, we are learning that handwriting and technology serve different purposes, and that children are best served when they have access to both at the right times.",
      },
      {
        kind: "p",
        text: "Protecting handwriting is not about returning education to the past or resisting useful tools. It is about recognising that forming letters by hand is one of the ways children come to understand written language — and making sure that important learning experience is not lost in the rush to go digital.",
      },
      {
        kind: "quote",
        text: "The goal has never been perfect penmanship. It is to help handwriting become a comfortable, efficient tool that lets children participate, express their ideas and show what they truly know.",
      },
    ],
  },
];

export default function WhyHandwritingMattersPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-14">
      {/* --- article header --- */}
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-msot-blue">
          Free education · No account needed
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-msot-navy sm:text-[2.75rem]">
          Why handwriting still matters in a digital age
        </h1>

        <div className="mt-5 flex items-center gap-3 text-sm text-foreground/60">
          <span className="font-medium text-msot-navy">Making Sense Together</span>
          <span aria-hidden className="text-foreground/25">
            |
          </span>
          <span>5 min read</span>
        </div>
      </header>

      {/* Hero photo. `priority` because it sits at the top of the article —
          Next will preload it rather than lazy-loading it into view. */}
      <Image
        src="/blog/child-writing.png"
        alt="A child at a classroom desk, head resting on one arm, looking down at a worksheet headed “Write your name” on which they have written their name several times."
        width={1402}
        height={1122}
        priority
        sizes="(max-width: 768px) 100vw, 768px"
        className="mt-8 h-auto w-full max-w-3xl rounded-3xl"
      />

      {/* --- lede --- */}
      <p className="mt-10 max-w-3xl text-xl leading-9 text-foreground/80">
        For many years, some people predicted that handwriting would fade in
        importance as computers, tablets and voice technology became part of
        everyday life. Why spend valuable classroom time on letter formation
        when children today will almost certainly type more words across their
        lifetime than they will ever write by hand?
      </p>

      <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground/75">
        It is a fair question. But recent research and educational trends point
        to a clear answer: handwriting remains an important foundation for
        literacy, learning and academic participation. Several countries,
        including Sweden, have recently renewed their focus on printed books,
        handwriting and explicit literacy instruction after concerns about
        falling student outcomes. This does not mean technology is unhelpful. It
        highlights the importance of finding the right balance between
        traditional and digital learning.
      </p>

      {/*
        Body and call-to-action share a two-column grid that starts here,
        below the header, hero and lede. Starting the grid at the first
        section is what puts the sticky panel level with the first heading
        rather than up alongside the title.
      */}
      <div className="mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
        <div className="max-w-3xl">
          <ArticleSections sections={article} />
        </div>

        {/*
        Bridge into the screening tool. On desktop this rides alongside the
        article in a second column and sticks to the viewport as you scroll,
        so the call to action is never more than a glance away. On mobile
        there is no room for a column, so it drops to the end of the article
        and behaves like an ordinary closing panel.

        The <aside> itself stretches to the full height of the grid row —
        that is what gives the inner sticky element room to travel.
      */}
        <aside className="mt-16 lg:mt-0">
          {/* top-24 clears the sticky site header (~65px) plus breathing room */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-msot-blue/25 bg-msot-blue/[.06] p-6">
              <h2 className="text-lg font-semibold leading-snug text-msot-navy">
                How the model works
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-foreground/70">
                Support the foundations that make writing possible, and
                explicitly teach handwriting itself — meeting each child where
                they are.
              </p>
              <Link
                href="/the-handwriting-model"
                className="mt-5 inline-flex rounded-full bg-msot-blue px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-msot-navy"
              >
                Read the model →
              </Link>
            </div>

            <div className="rounded-2xl border border-msot-teal/25 bg-msot-teal/[.06] p-6">
              <h2 className="text-lg font-semibold leading-snug text-msot-navy">
                Concerned about a particular student?
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-foreground/70">
                Our screening tool checks the eight foundations that sit beneath
                handwriting and builds a tailored Two Term program around what it
                finds.
              </p>
              <ScreenAStudentLink />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
