import type { ReactNode } from "react";

/*
  The building blocks the long-form content pages are made of.

  Both the handwriting model and the iceberg are Word documents turned into
  pages, and they need the same handful of shapes: paragraphs, bulleted lists
  of questions, pull quotes, and the two-pillar "AND" statement that is the
  centre of the model. A section is a heading plus an ordered list of typed
  blocks, and the renderer switches on `kind` — which is what lets a quote sit
  in the middle of a section rather than only at the end.

  Copy lives in the page files as data; only the presentation lives here.
*/
export type Block =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "pillars"; items: [string, string] };

export type Section = { heading: string; blocks: Block[] };

/*
  Citation markers are left in the copy exactly as they appear in the source
  documents — "…reading development.[1]", "…independently.[5–7]" — and turned
  into superscript links here. Keeping them in the text means a paragraph can
  carry a citation mid-sentence as well as at the end, which the evidence page
  needs; pages with no brackets are unaffected.

  A range links to the first of its references, which is where the reader
  lands in the list.
*/
const CITATION = /\[(\d+)(?:–(\d+))?\]/g;

function withCitations(text: string) {
  const out: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(CITATION)) {
    const at = match.index;
    out.push(text.slice(cursor, at));
    out.push(
      <sup key={at} className="ml-0.5">
        <a
          href={`#ref-${match[1]}`}
          className="rounded px-0.5 font-semibold text-msot-blue no-underline hover:underline"
        >
          {match[0].slice(1, -1)}
        </a>
      </sup>,
    );
    cursor = at + match[0].length;
  }

  out.push(text.slice(cursor));
  return out;
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "p":
      return (
        <p className="mt-5 text-lg leading-8 text-foreground/75">
          {withCitations(block.text)}
        </p>
      );

    case "list":
      return (
        <ul className="mt-5 space-y-2.5">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-lg leading-8 text-foreground/75"
            >
              <span
                aria-hidden
                className="mt-3 size-1.5 shrink-0 rounded-full bg-msot-cyan"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="mt-8 border-l-4 border-msot-cyan pl-6 text-xl font-medium leading-9 text-msot-navy">
          {block.text}
        </blockquote>
      );

    /*
      The two halves of the model, shown as equal halves. The "AND" between
      them is the whole point — neither pillar works alone — so it is set as a
      chip rather than left as a word inside a sentence.
    */
    case "pillars":
      return (
        <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <Pillar number={1} text={block.items[0]} />
          <div className="flex items-center justify-center">
            <span className="rounded-full bg-msot-navy px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-white">
              And
            </span>
          </div>
          <Pillar number={2} text={block.items[1]} />
        </div>
      );
  }
}

function Pillar({ number, text }: { number: number; text: string }) {
  return (
    <div className="rounded-2xl border border-msot-teal/25 bg-msot-teal/[.06] p-6">
      <span className="text-xs font-semibold uppercase tracking-wide text-msot-teal">
        Element {number}
      </span>
      <p className="mt-2 text-lg font-semibold leading-7 text-msot-navy">
        {text}
      </p>
    </div>
  );
}

/** A run of sections, spaced consistently. */
export function ArticleSections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section, i) => (
        <section key={section.heading} className={i === 0 ? "" : "mt-12"}>
          <h2 className="text-2xl font-bold tracking-tight text-msot-navy">
            {section.heading}
          </h2>
          {section.blocks.map((block, j) => (
            <BlockView key={j} block={block} />
          ))}
        </section>
      ))}
    </>
  );
}
