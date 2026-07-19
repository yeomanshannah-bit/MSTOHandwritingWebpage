"use client";

import { useState } from "react";

/*
  "use client" (the line at the very top) marks this as a Client Component:
  it runs in the browser, so it can respond to clicks and remember state.
  Most pages are Server Components (rendered once, no interactivity) — we opt
  a piece into the browser only when it needs to react to the user, like this
  tap-to-expand card. It mirrors the app's ExpandableSection.

  `useState` gives us a small piece of memory — `open` — that flips between
  true/false when the header is clicked, which shows or hides the detail.
*/
export default function ExpandableSection({
  title,
  summary,
  detail,
}: {
  title: string;
  summary: string;
  detail: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-msot-blue/15 bg-msot-blue/[.04]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-msot-navy">{title}</span>
        <span
          className={`text-msot-blue transition-transform ${open ? "rotate-90" : ""}`}
          aria-hidden
        >
          ›
        </span>
      </button>

      {!open && (
        <p className="px-5 pb-4 leading-7 text-foreground/70">{summary}</p>
      )}

      {open && (
        <div className="space-y-3 px-5 pb-5">
          {detail.map((paragraph, i) => (
            <p key={i} className="leading-7 text-foreground/80">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
