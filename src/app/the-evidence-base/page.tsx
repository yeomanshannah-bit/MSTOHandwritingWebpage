import type { Metadata } from "next";
import Link from "next/link";
import { ArticleSections, type Section } from "@/components/ArticleBody";

export const metadata: Metadata = {
  title: "The Evidence Base — Making Sense OT",
  description:
    "The research behind the Making Sense of Handwriting model: why handwriting matters for early literacy, what the intervention studies show, and why foundations alone are not enough.",
};

/*
  Ported from
  Content/The Evidence Behind the Making Sense of Handwriting Model[82].docx.

  Citation markers are left in the copy as "[1]" / "[5–7]" and rendered as
  superscript links by components/ArticleBody — see `withCitations` there. The
  numbers correspond to `references` below, whose ids are the link targets.
*/
const article: Section[] = [
  {
    heading: "Why handwriting is an important part of early learning",
    blocks: [
      {
        kind: "p",
        text: "Children form letters during phonics, write words during spelling, label pictures, complete literacy activities and compose sentences. Although this may not always be called a separate handwriting lesson, children are learning and practising handwriting throughout the school day.",
      },
      {
        kind: "p",
        text: "The Making Sense of Handwriting model does not ask teachers to add another lengthy program. Instead, it helps teachers recognise the handwriting teaching already occurring and make it more explicit, purposeful and responsive to each child's needs.",
      },
      {
        kind: "p",
        text: "Handwriting is more than a fine-motor activity or a way of recording information. When children learn to form letters, they bring together movement, vision, touch, language, attention and memory. They learn what letters look like, what they represent and how their movements can reproduce them.",
      },
      {
        kind: "quote",
        text: "Handwriting is both a literacy skill and a complex learning activity involving the whole child.",
      },
    ],
  },
  {
    heading: "Handwriting helps children learn letters",
    blocks: [
      {
        kind: "p",
        text: "When children write a letter, they do more than copy its finished shape. They must recall what the letter looks like, connect it with its name and sound, remember where it begins, plan its movement and monitor what appears on the page. This creates connections between the letter's appearance, sound and movement.",
      },
      {
        kind: "p",
        text: "Brain-imaging research with pre-literate children found that printing letters produced different effects from tracing or typing them. After children printed letters, seeing those letters activated areas of the brain associated with letter recognition and emerging reading. The researchers suggested that actively producing letters may help establish the neural systems supporting letter perception and reading development.[1]",
      },
      {
        kind: "p",
        text: "Handwriting does not replace systematic teaching of phonological awareness and phonics. Rather, it provides another pathway through which children can learn and remember letters. Children see the letter, hear its name and sound, create its shape and learn the movement needed to produce it again. This is why handwriting can sit naturally within phonics, spelling and literacy instruction.",
      },
    ],
  },
  {
    heading: "Handwriting brings many skills together",
    blocks: [
      {
        kind: "p",
        text: "Handwriting is sometimes described primarily as a fine-motor task. Fine-motor control is important, but it is only one part of the process. A child also needs to:",
      },
      {
        kind: "list",
        items: [
          "Maintain a sufficiently stable sitting position.",
          "Use both sides of the body together.",
          "Stabilise the paper with one hand while writing with the other.",
          "Regulate responses to touch, movement, noise and visual information.",
          "Recognise and remember letter shapes and directions.",
          "Coordinate visual information with hand movements.",
          "Attend to demonstrations and instructions.",
          "Hold a short movement sequence in mind.",
          "Connect letters with language and sounds.",
          "Notice errors and adjust their movements.",
        ],
      },
      {
        kind: "p",
        text: "These demands provide the reasoning behind the eight foundations in the Making Sense of Handwriting Iceberg: postural control, bilateral coordination, fine motor control, sensory regulation, visual perception, visual-motor integration, attention and concentration, and language and letter recognition.",
      },
      {
        kind: "p",
        text: "These foundations overlap and influence one another. They are not separate boxes within the child, and difficulty in one area may increase the demands placed on another. For example, a child who must work hard to remain stable in their chair may have fewer physical and mental resources available for controlling the pencil and listening to instructions. A child who cannot readily recall a letter may pause frequently and lose track of the word they are trying to write.",
      },
      {
        kind: "p",
        text: "The iceberg helps teachers ask:",
      },
      {
        kind: "quote",
        text: "Is the child having difficulty learning the letter, physically producing it, remaining ready and attentive — or managing several of these demands at once?",
      },
    ],
  },
  {
    heading: "Handwriting engages attention, memory and self-monitoring",
    blocks: [
      {
        kind: "p",
        text: "Handwriting requires focused attention. The child needs to watch a demonstration, listen to an instruction, remember the next movement and monitor what appears on the page. During a brief, well-supported activity, children have opportunities to direct their attention towards a model, follow a movement sequence, hold information in mind, compare their work with an example and persist with a manageable challenge.",
      },
      {
        kind: "p",
        text: "These are important learning behaviours. However, the evidence must be described carefully. We cannot claim that handwriting practice alone improves a child's general attention or concentration across every activity.",
      },
      {
        kind: "p",
        text: "It is more accurate to say that handwriting actively engages attention, working memory, planning and self-monitoring. Difficulties in these areas can affect handwriting, while a carefully graded handwriting task provides an opportunity to use them within a meaningful activity.",
      },
      {
        kind: "p",
        text: "The task must be achievable. If the page is overcrowded, the activity is too long or the letters have not been clearly taught, a child may experience repeated failure rather than productive practice.",
      },
    ],
  },
  {
    heading: "Automaticity makes room for ideas",
    blocks: [
      {
        kind: "p",
        text: "At first, forming a letter requires considerable conscious thought. A beginning writer may be trying to remember where the letter begins, which direction it travels and where it sits on the line. At the same time, the child may be identifying sounds, spelling a word and remembering what they intended to write.",
      },
      {
        kind: "p",
        text: "Working memory has limited capacity. When forming each letter uses too much of that capacity, there is less available for spelling, vocabulary, sentences and ideas.",
      },
      {
        kind: "p",
        text: "As correct letter movements are taught and practised, they gradually become more automatic. The child no longer needs to consciously plan every stroke. Handwriting changes from being the main task to becoming a tool for learning and communication.",
      },
      {
        kind: "p",
        text: "Research involving children in Years 1 to 3 found that handwriting fluency made a significant independent contribution to the quality of children's written compositions, even after several other factors were considered.[2] This demonstrates an important relationship, but it does not mean handwriting is the only influence on written expression. Language, spelling, motivation, topic knowledge and teaching also matter.",
      },
      {
        kind: "quote",
        text: "When handwriting becomes automatic, children can stop thinking so much about how to write and begin thinking about what they want to say.",
      },
    ],
  },
  {
    heading: "Why children need actual handwriting practice",
    blocks: [
      {
        kind: "p",
        text: "Activities involving playdough, pegs, threading, construction or movement can support skills beneath the Handwriting Iceberg. They may help a child develop strength, coordination, regulation or readiness to participate. However, these activities do not teach letter formation.",
      },
      {
        kind: "p",
        text: "A systematic review found that interventions that did not include handwriting practice were ineffective in improving handwriting. Interventions involving fewer than 20 practice sessions were also ineffective.[3] This highlights the importance of sufficient, repeated practice rather than occasional handwriting activities.",
      },
      {
        kind: "p",
        text: "A further systematic review found that classroom handwriting programs produced small-to-medium improvements in legibility, although evidence for improvements in speed was mixed. No particular commercial program was identified as clearly superior to all others.[4]",
      },
      {
        kind: "p",
        text: "The evidence supports the central message of the Making Sense of Handwriting model:",
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
        text: "Improving postural control will not teach a child where a letter begins. Fine-motor activities will not teach its movement sequence. Sensory and attention strategies may help the child become ready to learn, but the letter still needs to be demonstrated, described and practised.",
      },
      {
        kind: "p",
        text: "It is similar to learning the piano. Finger strength, coordination, posture, attention and rhythm all contribute to playing, but none replaces being shown how to play the notes and practising them repeatedly.",
      },
    ],
  },
  {
    heading: "Why explicit teaching matters",
    blocks: [
      {
        kind: "p",
        text: "Children do not all discover efficient letter formation simply through exposure or repeated opportunities to write. Some children begin letters at inconsistent points, move in inefficient directions or construct letters using several disconnected strokes. If these patterns are repeated during spelling and literacy activities, they can become increasingly automatic and difficult to change.",
      },
      {
        kind: "p",
        text: "Explicit teaching makes the hidden parts of handwriting visible. It teaches children:",
      },
      {
        kind: "list",
        items: [
          "Where the letter begins.",
          "Which direction the movement travels.",
          "How many movements are required.",
          "How the letter sits in relation to the line.",
          "How it differs from visually similar letters.",
          "How its shape connects with its name and sound.",
        ],
      },
      {
        kind: "p",
        text: "Consistent demonstrations, visual models and verbal prompts reduce the amount children must work out independently. Short, repeated practice then strengthens the movement pattern until it can be produced with less conscious effort.",
      },
    ],
  },
  {
    heading: "Motor learning and self-evaluation",
    blocks: [
      {
        kind: "p",
        text: "The Making Sense of Handwriting model is informed by motor learning theory — our understanding of how movements are learned and gradually become more accurate, efficient and automatic. Children learn handwriting movements through:",
      },
      {
        kind: "list",
        items: [
          "A clear demonstration of the skill.",
          "An achievable amount of repeated practice.",
          "Specific feedback about the most important feature.",
          "Opportunities to compare their work with a model.",
          "Gradually reduced adult prompting.",
          "Practice across meaningful writing activities.",
        ],
      },
      {
        kind: "p",
        text: "In the early stages of learning a letter, children benefit from clear instructions about where to begin and how the pencil moves. Feedback may initially be frequent and specific. As the movement becomes more familiar, adult support should gradually decrease so the child learns to recall, produce and monitor the letter independently.[5–7]",
      },
      {
        kind: "p",
        text: "Practice must also be purposeful. Repeating a letter many times is not helpful if the child is repeatedly practising an inefficient movement. The goal is not simply to complete a row of letters — it is to strengthen an effective movement pattern.",
      },
      {
        kind: "p",
        text: "Self-evaluation is therefore a key part of the Making Sense model. After writing, the child is encouraged to pause, look and compare:",
      },
      {
        kind: "list",
        items: [
          "Did I start in the right place?",
          "Did I move in the right direction?",
          "Is my letter sitting correctly on the line?",
          "Which letter shows my best formation?",
          "What will I concentrate on next time?",
        ],
      },
      {
        kind: "p",
        text: "For young children, self-evaluation should be brief, positive and developmentally appropriate. A child might circle the letter they believe shows their best formation and explain why. The teacher can then confirm what was successful and identify one manageable point for the next attempt.",
      },
      {
        kind: "p",
        text: "Self-evaluation does not ask children to judge whether their handwriting is “good” or “bad.” It teaches them to notice the specific features of effective formation. Over time, this helps the child become less dependent on an adult identifying every error.",
      },
      {
        kind: "p",
        text: "Handwriting interventions incorporating motor-learning principles, feedback and self-regulated learning have been associated with improvements in handwriting quality.[5–7] These elements work together, so the evidence does not establish that self-evaluation alone produces improvement.",
      },
      {
        kind: "quote",
        text: "We show the child what to do, provide purposeful practice and feedback, and then help the child recognise successful formation for themselves.",
      },
    ],
  },
  {
    heading: "Handwriting teaching within the existing curriculum",
    blocks: [
      {
        kind: "p",
        text: "Explicit handwriting teaching does not necessarily require a separate, lengthy lesson. During phonics, spelling or literacy activities, a teacher might briefly:",
      },
      {
        kind: "list",
        items: [
          "Name the letter and connect it with its sound.",
          "Demonstrate where the letter begins.",
          "Describe its movement using consistent language.",
          "Ask children to form it with a controlled movement.",
          "Provide immediate and encouraging feedback.",
          "Ask children to circle their best example and explain why.",
          "Return to the letter during later activities.",
          "Ask children to retrieve and write it from memory.",
        ],
      },
      {
        kind: "p",
        text: "Short, frequent and purposeful practice may be more manageable than expecting children to complete an entire page of repetitions. This makes the handwriting teaching already occurring within the curriculum more deliberate and reduces the risk that children will repeatedly practise inefficient formations.",
      },
    ],
  },
  {
    heading: "Beginning at the child's current level",
    blocks: [
      {
        kind: "p",
        text: "The Making Sense of Handwriting screener and interventions currently focus on Reception, Year 1 and Year 2, with plans to extend the model to Years 3, 4, 5 and 6. At these stages, the priorities are to help children:",
      },
      {
        kind: "list",
        items: [
          "Develop the pre-writing shapes needed for letter formation.",
          "Learn efficient starting points and movement patterns.",
          "Connect letters with their names and sounds.",
          "Develop the ability to evaluate their own letter formation.",
          "Gradually improve legibility, ease, fluency and automaticity.",
          "Participate successfully in classroom writing.",
        ],
      },
      {
        kind: "p",
        text: "A child who cannot yet reproduce the pre-writing shapes found within letters may need to begin there. Another child may be ready for direct letter teaching but require clearer models, shorter practice periods or support for one of the foundations beneath the iceberg.",
      },
      {
        kind: "quote",
        text: "Beginning at the child's current developmental level is not lowering expectations. It means identifying the next achievable skill that will help the child progress.",
      },
      {
        kind: "p",
        text: "As the model extends into Years 3, 4, 5 and 6, the expectations placed on handwriting will increase. Children will be required to write more quickly, produce longer pieces of work and use handwriting across an increasingly complex curriculum. The model will therefore place greater emphasis on handwriting fluency, written output and the effect handwriting difficulties may have on classroom participation.",
      },
      {
        kind: "p",
        text: "Keyboarding and assistive technology will also become a more prominent part of the pathway for older students. If a child's handwriting continues to significantly restrict classroom participation after approximately six months of well-targeted handwriting instruction and intervention, the team should consider alternative ways for the child to record and communicate increasingly complex ideas.",
      },
      {
        kind: "p",
        text: "This does not mean giving up on handwriting. Handwriting intervention and alternative methods of written communication can be provided alongside one another.",
      },
    ],
  },
  {
    heading: "Bringing the evidence together",
    blocks: [
      {
        kind: "p",
        text: "The evidence supports handwriting as an important component of early literacy instruction across Reception, Year 1 and Year 2.",
      },
      {
        kind: "p",
        text: "Forming letters helps children connect letter shapes, sounds and movements. Handwriting brings together physical, visual, sensory, attentional and language processes. As letter formation becomes more fluent and automatic, fewer mental resources are required to produce letters, leaving more capacity for spelling, sentences and ideas.",
      },
      {
        kind: "p",
        text: "Supporting the foundations beneath the iceberg can make handwriting more accessible. However, foundational activities alone do not teach children how to write. Children also require explicit instruction, purposeful practice, helpful feedback and opportunities to evaluate their own formation.",
      },
      {
        kind: "p",
        text: "The Making Sense of Handwriting model helps teachers recognise the handwriting teaching already occurring within the school day, identify what may be making it difficult and make each brief opportunity for practice more purposeful.",
      },
    ],
  },
];

/*
  The reference list. `id` is the target of the superscript markers in the
  copy above; `doi` is rendered as the link so the reader can go straight to
  the paper.
*/
const references: { authors: string; year: string; title: string; source: string; doi: string }[] = [
  {
    authors: "James, K. H., & Engelhardt, L.",
    year: "2012",
    title:
      "The effects of handwriting experience on functional brain development in pre-literate children.",
    source: "Trends in Neuroscience and Education, 1(1), 32–42.",
    doi: "https://doi.org/10.1016/j.tine.2012.08.001",
  },
  {
    authors:
      "Skar, G. B., Lei, P.-W., Graham, S., Aasen, A. J., Johansen, M. B., & Kvistad, A. H.",
    year: "2022",
    title:
      "Handwriting fluency and the quality of primary-grade students' writing.",
    source: "Reading and Writing, 35, 509–538.",
    doi: "https://doi.org/10.1007/s11145-021-10185-y",
  },
  {
    authors: "Hoy, M. M. P., Egan, M. Y., & Feder, K. P.",
    year: "2011",
    title: "A systematic review of interventions to improve handwriting.",
    source: "Canadian Journal of Occupational Therapy, 78(1), 13–25.",
    doi: "https://doi.org/10.2182/cjot.2011.78.1.3",
  },
  {
    authors: "Engel, C., Lillie, K., Zurawski, S., & Travers, B. G.",
    year: "2018",
    title:
      "Curriculum-based handwriting programs: A systematic review with effect sizes.",
    source:
      "American Journal of Occupational Therapy, 72(3), 7203205010p1–7203205010p8.",
    doi: "https://doi.org/10.5014/ajot.2018.027110",
  },
  {
    authors: "López-Escribano, C., Martín-Babarro, J., & Pérez-López, R.",
    year: "2022",
    title:
      "Promoting handwriting fluency for preschool and elementary-age students: Meta-analysis and meta-synthesis of research from 2000 to 2020.",
    source: "Frontiers in Psychology, 13, 841573.",
    doi: "https://doi.org/10.3389/fpsyg.2022.841573",
  },
  {
    authors:
      "Van Waelvelde, H., De Roubaix, A., Steppe, L., Troubleyn, E., De Mey, B., Dewitte, G., Debrabant, J., & Van de Velde, D.",
    year: "2017",
    title:
      "Effectiveness of a self-regulated remedial program for handwriting difficulties.",
    source: "Scandinavian Journal of Occupational Therapy, 24(5), 311–319.",
    doi: "https://doi.org/10.1080/11038128.2017.1282041",
  },
  {
    authors: "Case-Smith, J., Holland, T., & White, S.",
    year: "2014",
    title:
      "Effectiveness of a co-taught handwriting program for first-grade students.",
    source: "Physical & Occupational Therapy in Pediatrics, 34(1), 30–43.",
    doi: "https://doi.org/10.3109/01942638.2013.783898",
  },
];

export default function TheEvidenceBasePage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-14">
      {/* --- article header --- */}
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-msot-blue">
          Free education · No account needed
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-msot-navy sm:text-[2.75rem]">
          The Evidence Base
        </h1>
        <p className="mt-4 text-xl font-medium text-msot-teal">
          The research behind the Making Sense of Handwriting model
        </p>

        <div className="mt-5 flex items-center gap-3 text-sm text-foreground/60">
          <span className="font-medium text-msot-navy">Making Sense OT</span>
          <span aria-hidden className="text-foreground/25">
            |
          </span>
          <span>12 min read</span>
          <span aria-hidden className="text-foreground/25">
            |
          </span>
          <a href="#references" className="hover:text-msot-blue">
            {references.length} references
          </a>
        </div>
      </header>

      {/* --- lede --- */}
      <p className="mt-10 max-w-3xl text-xl leading-9 text-foreground/80">
        Handwriting is already woven throughout Reception, Year 1 and Year 2
        classrooms.
      </p>

      <div className="mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
        <div className="max-w-3xl">
          <ArticleSections sections={article} />

          {/* --- references --- */}
          <section id="references" className="mt-16 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-msot-navy">
              References
            </h2>
            <ol className="mt-6 space-y-5">
              {references.map((ref, i) => (
                <li
                  key={ref.doi}
                  id={`ref-${i + 1}`}
                  className="scroll-mt-24 border-l-2 border-black/[.08] pl-5 text-[15px] leading-7 text-foreground/70"
                >
                  <span className="mr-1.5 font-bold text-msot-blue">
                    {i + 1}.
                  </span>
                  {ref.authors} ({ref.year}). {ref.title}{" "}
                  <span className="italic">{ref.source}</span>{" "}
                  <a
                    href={ref.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-msot-blue hover:underline"
                  >
                    {ref.doi}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="mt-16 lg:mt-0">
          {/* top-24 clears the sticky site header (~65px) plus breathing room */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-msot-blue/25 bg-msot-blue/[.06] p-6">
              <h2 className="text-lg font-semibold leading-snug text-msot-navy">
                The model itself
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-foreground/70">
                What this evidence adds up to in practice — support the
                foundations, and explicitly teach the skill.
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
                Screen a student
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-foreground/70">
                Work down the eight foundations and see where a student needs
                support.
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
