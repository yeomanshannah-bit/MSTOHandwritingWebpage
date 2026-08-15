import type { Metadata } from "next";
import Link from "next/link";
import { ArticleSections, type Section } from "@/components/ArticleBody";

export const metadata: Metadata = {
  title: "The Making Sense of Handwriting Model — Making Sense OT",
  description:
    "A practical and balanced approach for busy classrooms: support the foundations that make writing possible, and explicitly teach and practise handwriting itself.",
};

/*
  The model explained in full, ported from
  Content/The Making Sense of Handwriting Model.docx.

  Words live in `article` as data so the copy can be edited without touching
  layout; the block types and their presentation live in components/ArticleBody,
  shared with the iceberg page.
*/
const article: Section[] = [
  {
    heading: "Built for the reality of a classroom",
    blocks: [
      {
        kind: "p",
        text: "The Making Sense of Handwriting model has been developed with this reality in mind. It is designed to help teachers and school support staff understand why a child may be finding handwriting difficult, identify what matters most and choose brief, purposeful supports that can be incorporated into everyday classroom routines.",
      },
      {
        kind: "quote",
        text: "The goal is not perfect penmanship. It is to help handwriting become a comfortable and efficient tool that allows children to participate, express their ideas and show what they know.",
      },
    ],
  },
  {
    heading: "Why does handwriting still matter?",
    blocks: [
      {
        kind: "p",
        text: "For many years some people predicted that handwriting would become less important as computers, tablets and voice technology became more common. However, recent research and educational trends suggest that handwriting remains an important foundation for literacy, learning and academic participation.",
      },
      {
        kind: "p",
        text: "Several countries, including Sweden, have recently renewed their focus on printed books, handwriting and explicit literacy instruction following concerns about student literacy outcomes. This does not mean technology is unhelpful. Rather, it highlights the importance of finding the right balance between traditional and digital learning methods.",
      },
      {
        kind: "p",
        text: "Children today will probably type more words across their lifetime than they write by hand. It is therefore reasonable to ask why handwriting should continue to receive valuable classroom time. The answer is that handwriting is not simply an old-fashioned way of recording words. Learning to form letters is part of how children develop literacy.",
      },
      {
        kind: "p",
        text: "When a child writes a letter by hand, the brain coordinates vision, movement, touch, attention and memory. The child must remember the letter's shape, decide where to begin, plan the direction of movement and monitor what appears on the page. At the same time, they are learning to connect the letter's shape with its name and sound.",
      },
      {
        kind: "p",
        text: "Pressing a key on a keyboard is a valuable skill, but it is a different learning experience. Every handwritten letter has its own movement pattern. Forming a b and forming a d, for example, require different starting points and different movements. Feeling and producing these differences can help children develop stronger and more detailed knowledge of letters.",
      },
      {
        kind: "p",
        text: "Handwriting, keyboarding and assistive technology all have an important place in modern education. The question is not whether classrooms should use paper or technology. The better question is:",
      },
      {
        kind: "quote",
        text: "Which tool will best support the learning taking place at this moment?",
      },
      {
        kind: "p",
        text: "For a child learning letter shapes, sounds and spelling patterns, pencil and paper may provide an important physical learning experience. For drafting, editing, accessing information or reducing the demands of extended written work, technology may be the most appropriate tool. A balanced classroom protects opportunities for both.",
      },
    ],
  },
  {
    heading: "When handwriting becomes a tool for thinking",
    blocks: [
      {
        kind: "p",
        text: "In the early stages of learning, handwriting requires considerable mental effort. A beginning writer may be thinking:",
      },
      {
        kind: "list",
        items: [
          "Where do I start this letter?",
          "Which direction does it go?",
          "How do I hold and move my pencil?",
          "Does this letter sit on the line?",
          "What sound am I trying to write?",
          "What was I going to say?",
        ],
      },
      {
        kind: "p",
        text: "Attention and working memory are limited. If a child must use most of these resources to form individual letters, there is less capacity available for spelling, vocabulary, sentence construction and organising ideas.",
      },
      {
        kind: "p",
        text: "With explicit teaching and purposeful practice, letter formation can gradually become more automatic. The child no longer needs to consciously plan every movement, and handwriting begins to shift from being the task itself to becoming a tool for learning and communication.",
      },
      {
        kind: "quote",
        text: "When handwriting becomes automatic, children can stop thinking so much about how to write and begin thinking about what they want to say.",
      },
      {
        kind: "p",
        text: "This is one reason children with slow or effortful handwriting may produce less written work than they can explain verbally. They do not necessarily have fewer ideas. Too many of those ideas may be lost while they are trying to manage the physical and mental demands of getting them onto the page.",
      },
    ],
  },
  {
    heading: "Handwriting is the tip of the iceberg",
    blocks: [
      {
        kind: "p",
        text: "When handwriting is difficult to read, unusually slow, tiring or avoided altogether, the work on the page is the part we can see. The reasons for that difficulty may sit beneath the surface.",
      },
      {
        kind: "p",
        text: "The Making Sense of Handwriting Iceberg helps us consider the different foundations involved in writing. These may include postural control, shoulder stability, fine-motor control, hand strength and endurance, bilateral coordination, visual perception, visual-motor integration, motor planning, attention, memory and self-regulation.",
      },
      {
        kind: "p",
        text: "A child may find only one or two of these areas difficult. Another child may have adequate physical and visual skills but simply have gaps in their knowledge of how letters are formed. The iceberg is not a checklist of deficits, and it does not assume that every child with untidy handwriting needs occupational therapy.",
      },
      {
        kind: "p",
        text: "Instead, it encourages curiosity. Rather than concluding that a child is careless, rushing or not trying, we can ask:",
      },
      {
        kind: "quote",
        text: "What might be making this task harder for this child?",
      },
      {
        kind: "p",
        text: "Sometimes a small adjustment makes an immediate difference. A child may benefit from having their feet supported, seeing a clearer letter model, completing less copying, using paper with more suitable lines or taking a brief movement break before writing. Understanding what may lie beneath the surface helps us choose a response that matches the child's needs.",
      },
    ],
  },
  {
    heading: "Strong foundations are only half the story",
    blocks: [
      {
        kind: "p",
        text: "The foundations beneath the iceberg matter — but supporting them alone will not teach a child to write. A child can improve their hand strength, coordination, posture and pencil control and still not know where to begin a letter or how to produce its movements in the correct sequence.",
      },
      {
        kind: "p",
        text: "Research into handwriting intervention has consistently highlighted an important principle: if the goal is to improve handwriting, the intervention needs to include actual handwriting practice. Fine-motor games, movement activities and sensory strategies may help a child become more ready and able to participate, but they do not replace explicit instruction and practice in letter formation.",
      },
      {
        kind: "p",
        text: "It is similar to learning the piano or playing tennis. A good teacher helps the learner develop the underlying abilities needed for the activity, but they also teach the skill itself — clearly, directly and one achievable step at a time. Handwriting is no different.",
      },
    ],
  },
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
          <span>9 min read</span>
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
