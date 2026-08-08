import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Why handwriting matters in a digital age — Making Sense OT",
  description:
    "Screens are everywhere and handwriting still matters. The case for it: academic benefits, brain and memory, literacy links, and confidence.",
};

/*
  A long-form article rather than the previous accordion. Handwriting is the
  argument this page has to make, and an argument reads better as continuous
  prose than as four collapsed boxes a reader has to opt into.

  The words live in `article` as data so copy can be edited without touching
  layout. Each section is a heading plus paragraphs; `pullQuote` optionally
  lifts one line out after the section.
*/
const article: {
  heading: string;
  paragraphs: string[];
  pullQuote?: string;
}[] = [
  {
    heading: "The skill that makes room for thinking",
    paragraphs: [
      "There is a moment, somewhere in the first years of school, when handwriting stops being the task and becomes the tool. Before that moment, forming an 'a' is the whole job — the child is thinking about where the pencil starts, which way the curve goes, how hard to press. After it, the letters simply arrive, and the child is free to think about what they actually want to say.",
      "Everything in this article turns on that shift. Children who develop strong handwriting skills are better able to focus on the content of their writing rather than the mechanics, and that frees up cognitive resources for higher-order thinking, creativity, and expression. Attention is finite. Every scrap of it spent on letter formation is a scrap not spent on the idea.",
      "This is why fluent writers tend to produce longer, richer written work than children who struggle with the physical act of writing. It is rarely that they have more to say. It is that less of what they have to say is lost on the way to the page.",
    ],
    pullQuote:
      "When handwriting becomes automatic, a child stops thinking about how to write and starts thinking about what to write.",
  },
  {
    heading: "What the hand teaches the brain",
    paragraphs: [
      "The most common argument against handwriting is that a keyboard does the same job faster. For getting words onto a screen, that is often true. For building the brain that produces the words, it is not.",
      "When children write by hand, they engage regions of the brain linked to reading, memory, and language processing — and typing does not activate those same regions to the same degree. The difference appears to lie in the movement itself. Every letter formed by hand is a small, specific motor sequence, different from every other letter, produced by the child rather than selected from a keyboard.",
      "Typing collapses that variety. The motor act of pressing 'b' is identical to the motor act of pressing 'd' — same finger movement, different location. By hand, 'b' and 'd' are genuinely different journeys, and that difference is exactly what a child who confuses them needs to feel.",
      "So handwriting practice is not really about penmanship. It is a cognitive activity that helps build the brain's literacy networks, and the child is doing far more than making the page look tidy.",
    ],
  },
  {
    heading: "Handwriting and reading are the same story",
    paragraphs: [
      "Teachers often treat handwriting and reading as separate parts of the timetable. Children's brains do not.",
      "Forming a letter by hand reinforces the link between the letter's shape, its name, and its sound — the three-way connection that phonological awareness is built on. A child who has drawn the letter has encoded it in a way that recognising it on a screen does not replicate. This is why explicit handwriting instruction tends to show up as improvement not only in writing, but in reading and spelling too.",
      "The relationship runs in the difficult direction as well. Children who struggle with handwriting frequently also experience difficulties with reading and written expression. That co-occurrence is one of the strongest practical arguments for looking closely and early: handwriting is visible in a way that a quiet reading difficulty often is not, which makes it a useful early signal that something underneath needs support.",
    ],
  },
  {
    heading: "The cost that does not show up in the marking",
    paragraphs: [
      "Ask a teacher about a child with handwriting difficulties and they will usually describe the work. Ask the child, and you tend to hear about something else entirely.",
      "When writing is slow, effortful, or produces results the child can see are messier than everyone else's, the response is rarely to try harder. It is to write less. Children avoid writing tasks, produce the shortest acceptable answer, volunteer for anything that isn't writing, or become frustrated and disengage from the lesson altogether. The work that gets handed in understates what the child knows, and over time both the teacher's expectations and the child's own quietly adjust downward.",
      "That is the real damage — not untidy books, but a child who has concluded that writing is something they are bad at, and who arranges their school life around avoiding it. Developing fluent, automatic handwriting removes that barrier and lets children participate fully and confidently in the classroom.",
    ],
    pullQuote:
      "The lasting cost of handwriting difficulty is rarely the handwriting. It is a child who stops putting their ideas on the page at all.",
  },
  {
    heading: "So what does this mean in a digital classroom?",
    paragraphs: [
      "None of this is an argument against technology. Children will type most of the words they ever write, assistive tools are genuinely liberating for some students, and no one benefits from nostalgia about fountain pens.",
      "The argument is narrower and harder to dismiss: the years in which handwriting builds literacy are the primary years, and they do not come back. A child who reaches the end of primary school without automatic handwriting has not simply missed a skill — they have spent several years doing their thinking with less attention available for it than their classmates had.",
      "Which is why, when a child's handwriting is a struggle, the useful question is not how to make the letters neater. It is what, underneath, is making writing so hard — and that is what the screener on this site is for.",
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
          Why handwriting matters in a digital age
        </h1>

        <div className="mt-5 flex items-center gap-3 text-sm text-foreground/60">
          <span className="font-medium text-msot-navy">Making Sense OT</span>
          <span aria-hidden className="text-foreground/25">
            |
          </span>
          <span>8 min read</span>
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
        Children today will type most of the words they ever write. It is a fair
        question, then, why handwriting should still take up so much of the
        primary school day. The answer is that handwriting was never only a way
        of recording words — it is one of the ways children learn to read,
        remember, and think.
      </p>

      {/*
        Body and call-to-action share a two-column grid that starts here,
        below the header, hero and lede. Starting the grid at the first
        section is what puts the sticky panel level with the first heading
        rather than up alongside the title.
      */}
      <div className="mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
        <div className="max-w-3xl">
          {article.map((section, i) => (
            <section key={section.heading} className={i === 0 ? "" : "mt-12"}>
              <h2 className="text-2xl font-bold tracking-tight text-msot-navy">
                {section.heading}
              </h2>
              {section.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 40)}
                  className="mt-5 text-lg leading-8 text-foreground/75"
                >
                  {p}
                </p>
              ))}
              {section.pullQuote && (
                <blockquote className="mt-8 border-l-4 border-msot-cyan pl-6 text-xl font-medium leading-9 text-msot-navy">
                  {section.pullQuote}
                </blockquote>
              )}
            </section>
          ))}
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
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-msot-teal/25 bg-msot-teal/[.06] p-6">
              <h2 className="text-lg font-semibold leading-snug text-msot-navy">
                Concerned about a particular student?
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-foreground/70">
                Our screening tool checks the eight foundations that sit beneath
                handwriting and builds a tailored 10-week program around what it
                finds.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex rounded-full bg-msot-teal px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:brightness-95"
              >
                Screen a student →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
