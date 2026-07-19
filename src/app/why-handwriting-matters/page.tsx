import type { Metadata } from "next";
import Link from "next/link";
import ExpandableSection from "@/components/ExpandableSection";

export const metadata: Metadata = {
  title: "Why handwriting matters — Making Sense OT",
  description:
    "The case for handwriting: academic benefits, brain & memory, literacy links, and confidence.",
};

/*
  Page content lives in this array (ported from the app's WhyItMattersView).
  Keeping the words as data — separate from the layout below — makes it easy
  to edit copy or add sections without touching the page structure.
*/
const sections = [
  {
    title: "Academic Benefits",
    summary:
      "Children who develop strong handwriting skills are better able to focus on the content of their writing rather than the mechanics.",
    detail: [
      "Children who develop strong handwriting skills are better able to focus on the content of their writing rather than the mechanics. This frees up cognitive resources for higher order thinking, creativity, and expression.",
      "When handwriting becomes automatic, children can devote their full attention to what they are writing — their ideas, arguments, and creativity — rather than how they are forming each letter.",
      "Studies consistently show that children with fluent handwriting produce longer, higher quality written work than those who struggle with the physical act of writing.",
    ],
  },
  {
    title: "Brain & Memory",
    summary:
      "The physical act of handwriting activates areas of the brain associated with reading and language — far more than typing does.",
    detail: [
      "When children write by hand, they engage regions of the brain linked to reading, memory, and language processing. Typing does not activate these same regions to the same degree.",
      "The unique movements involved in forming each letter by hand create stronger neural pathways that support both reading and writing development.",
      "This is why handwriting practice is not just about penmanship — it is a cognitive activity that builds the brain's literacy networks.",
    ],
  },
  {
    title: "Literacy Links",
    summary:
      "Learning to form letters by hand reinforces letter recognition, phonological awareness, and reading fluency.",
    detail: [
      "The connection between handwriting and literacy is well established in research. Children who receive explicit handwriting instruction show improvements not just in writing, but in reading and spelling too.",
      "Forming letters by hand reinforces the link between the letter shape, its name, and its sound — a critical foundation for phonological awareness.",
      "Children who struggle with handwriting often also experience difficulties with reading and written expression, which is why early intervention matters.",
    ],
  },
  {
    title: "Confidence & Participation",
    summary:
      "When handwriting is effortful or illegible, children can become reluctant to participate in classroom tasks.",
    detail: [
      "Handwriting difficulties can have a significant impact on a child's confidence and willingness to participate in school.",
      "When writing is slow, effortful, or produces illegible results, children often avoid writing tasks, produce less work, or become frustrated and disengaged.",
      "Developing fluent, automatic handwriting removes this barrier and allows children to participate fully and confidently in classroom learning.",
    ],
  },
];

export default function WhyHandwritingMattersPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-sm font-medium text-msot-blue">Free education</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-msot-navy sm:text-4xl">
        Why handwriting matters
      </h1>

      <p className="mt-6 rounded-xl bg-msot-blue/[.06] p-5 leading-8 text-foreground/80">
        In an increasingly digital world, handwriting remains a foundational
        skill that supports children&apos;s academic success, cognitive
        development, and overall literacy.
      </p>

      <div className="mt-6 space-y-3">
        {sections.map((s) => (
          <ExpandableSection
            key={s.title}
            title={s.title}
            summary={s.summary}
            detail={s.detail}
          />
        ))}
      </div>

      {/* Gentle bridge from free education into the screening tool */}
      <div className="mt-12 rounded-2xl border border-msot-teal/25 bg-msot-teal/[.06] p-6">
        <h2 className="text-xl font-semibold text-msot-navy">
          Worried about a particular student?
        </h2>
        <p className="mt-2 leading-7 text-foreground/70">
          Our screening tool checks six skill areas behind handwriting and
          builds a tailored 10-week program.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-flex rounded-full bg-msot-teal px-5 py-2.5 font-medium text-white transition-colors hover:brightness-95"
        >
          Screen a student →
        </Link>
      </div>
    </div>
  );
}
