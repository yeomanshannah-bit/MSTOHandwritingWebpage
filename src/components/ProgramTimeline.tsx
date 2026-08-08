"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import SessionDetail from "./SessionDetail";
import type { Session } from "@/lib/programContent";

/*
  The 10-week program as a timeline.

  Weeks unlock in order: week 1 is open from the start, and each later week
  stays locked until the one before it is marked complete. That's deliberate —
  the sessions within a domain build on each other, and the program is a
  progression, not a menu.

  Two modes:
    - Real program: `onComplete` is a Server Action, so ticking a week writes
      to the database.
    - Example (the public /programs page): no `onComplete`, so completion is
      remembered in the browser only and nothing is saved.

  We keep an optimistic copy of the completed weeks in local state so the
  timeline reacts immediately rather than waiting for the server round-trip.
*/

/** A slimmed-down week — we deliberately don't pass the whole domain (with all
    ten of its sessions) to the browser. */
export type TimelineWeek = {
  week: number;
  domainTitle: string;
  session: Session;
};

export default function ProgramTimeline({
  weeks,
  completedWeeks,
  observations = {},
  onComplete,
  onReopen,
  weekOneIntro,
  draftKey,
}: {
  weeks: TimelineWeek[];
  completedWeeks: number[];
  observations?: Record<number, string | null>;
  onComplete?: (week: number, observation: string) => Promise<void>;
  onReopen?: (week: number) => Promise<void>;
  /** Rendered at the top of week 1 only — used for the letters to start with,
      which are a week-1 teaching decision rather than a standing note. */
  weekOneIntro?: React.ReactNode;
  /** Unique key (the program id) for keeping unsaved notes in the browser.
      Omit on the public example, where nothing should persist. */
  draftKey?: string;
}) {
  const [done, setDone] = useState<number[]>(completedWeeks);
  const [pending, startTransition] = useTransition();

  /*
    One note per week, not a single shared box.

    The old version kept a single `note` string for the whole timeline, which
    caused two problems: text typed against one week followed you to another,
    and reopening a completed week showed an empty box — so saving again
    overwrote a good observation with nothing.

    Notes start from whatever is already saved, then any unsaved typing is
    layered on top from the browser.
  */
  const [notes, setNotes] = useState<Record<number, string>>(() =>
    Object.fromEntries(
      Object.entries(observations).map(([w, text]) => [Number(w), text ?? ""]),
    ),
  );

  const storageKey = draftKey ? `msot:program-notes:${draftKey}` : null;
  const loaded = useRef(false);
  const [draftSaved, setDraftSaved] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!storageKey) {
      loaded.current = true;
      return;
    }
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const drafts = JSON.parse(raw) as Record<string, string>;
        setNotes((prev) => {
          const next = { ...prev };
          for (const [w, text] of Object.entries(drafts)) {
            if (text) next[Number(w)] = text;
          }
          return next;
        });
        setDraftSaved(true);
      }
    } catch {
      // A corrupt draft should never block the program.
    }
    loaded.current = true;
  }, [storageKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Autosave typing to the browser, so a half-written observation survives
  // navigating away before the week is marked complete.
  const saveDrafts = useCallback(() => {
    if (!storageKey || !loaded.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(notes));
      setDraftSaved(true);
    } catch {
      /* private browsing or full quota */
    }
  }, [storageKey, notes]);

  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(saveDrafts, 600);
    return () => clearTimeout(t);
  }, [saveDrafts]);

  function setNote(week: number, text: string) {
    setNotes((prev) => ({ ...prev, [week]: text }));
  }

  // Weeks are completed in order, so the next one to do is simply the first
  // week without a tick.
  const current = weeks.find((w) => !done.includes(w.week))?.week ?? null;
  const [openWeek, setOpenWeek] = useState<number | null>(current);

  function statusOf(week: number): "done" | "current" | "locked" {
    if (done.includes(week)) return "done";
    if (week === current) return "current";
    return "locked";
  }

  function complete(week: number) {
    const observation = (notes[week] ?? "").trim();
    setDone((d) => (d.includes(week) ? d : [...d, week].sort((a, b) => a - b)));
    setOpenWeek(week + 1 <= weeks.length ? week + 1 : null);
    if (onComplete) {
      startTransition(async () => {
        await onComplete(week, observation);
      });
    }
  }

  /*
    Save an observation on a week that is already complete, without changing
    its completed state. completeWeek() upserts on (program_id, week), so
    calling it again simply updates the note.
  */
  function saveNote(week: number) {
    const observation = (notes[week] ?? "").trim();
    if (onComplete) {
      startTransition(async () => {
        await onComplete(week, observation);
      });
    }
  }

  function reopen(week: number) {
    // Reopening a week also reopens everything after it — you can't have
    // week 6 done while week 5 is not.
    setDone((d) => d.filter((n) => n < week));
    setOpenWeek(week);
    if (onReopen) {
      startTransition(async () => {
        await onReopen(week);
      });
    }
  }

  const completedCount = done.length;

  return (
    <div>
      {/* Progress bar */}
      <div className="rounded-2xl border border-black/[.08] bg-white px-5 py-4">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold text-msot-navy">
            Week {Math.min(completedCount + 1, weeks.length)} of {weeks.length}
          </p>
          <p className="text-sm text-foreground/55">
            {completedCount} completed
          </p>
        </div>
        <div className="mt-2 flex h-2 gap-1 overflow-hidden rounded-full">
          {weeks.map((w) => (
            <span
              key={w.week}
              className={`flex-1 rounded-full transition-colors ${
                done.includes(w.week)
                  ? "bg-msot-teal"
                  : w.week === current
                    ? "bg-msot-blue/40"
                    : "bg-black/[.07]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* The timeline itself */}
      <ol className="relative mt-6">
        {/* the vertical spine */}
        <span
          className="absolute left-[22px] top-4 bottom-4 w-px bg-black/[.09]"
          aria-hidden
        />

        {weeks.map((w) => {
          const status = statusOf(w.week);
          const isOpen = openWeek === w.week;
          const locked = status === "locked";

          return (
            <li key={w.week} className="relative pb-3 pl-14">
              {/* node on the spine */}
              <span
                className={`absolute left-0 top-3 grid h-11 w-11 place-items-center rounded-full text-sm font-bold ring-4 ring-background ${
                  status === "done"
                    ? "bg-msot-teal text-white"
                    : status === "current"
                      ? "bg-msot-blue text-white"
                      : "bg-black/[.06] text-foreground/35"
                }`}
                aria-hidden
              >
                {status === "done" ? "✓" : locked ? "🔒" : w.week}
              </span>

              <div
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  status === "current"
                    ? "border-msot-blue/30 bg-white shadow-sm"
                    : status === "done"
                      ? "border-msot-teal/30 bg-msot-teal/[.05]"
                      : "border-black/[.07] bg-black/[.02]"
                }`}
              >
                <button
                  onClick={() => !locked && setOpenWeek(isOpen ? null : w.week)}
                  disabled={locked}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5 ${
                    locked ? "cursor-not-allowed" : ""
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[11px] font-semibold uppercase tracking-wide ${
                        locked ? "text-foreground/35" : "text-msot-blue"
                      }`}
                    >
                      Week {w.week} · {w.domainTitle}
                    </span>
                    <span
                      className={`block font-semibold ${
                        locked ? "text-foreground/40" : "text-msot-navy"
                      }`}
                    >
                      {locked ? "Locked" : w.session.title}
                    </span>
                  </span>

                  {!locked && (
                    <span
                      className={`shrink-0 text-xl text-msot-blue transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                      aria-hidden
                    >
                      ›
                    </span>
                  )}
                </button>

                {locked && (
                  <p className="px-4 pb-3.5 text-sm text-foreground/45 sm:px-5">
                    Complete week {w.week - 1} to unlock this session.
                  </p>
                )}

                {isOpen && !locked && (
                  <div className="border-t border-black/[.06] px-4 py-5 sm:px-5">
                    {w.week === 1 && weekOneIntro}
                    <SessionDetail session={w.session} />

                    {status === "current" ? (
                      <div className="mt-5 border-t border-black/[.06] pt-5">
                        <label
                          htmlFor={`note-${w.week}`}
                          className="text-[11px] font-bold uppercase tracking-wide text-foreground/45"
                        >
                          What did you notice? (optional)
                        </label>
                        <textarea
                          id={`note-${w.week}`}
                          value={notes[w.week] ?? ""}
                          onChange={(e) => setNote(w.week, e.target.value)}
                          rows={3}
                          placeholder="Independence, performance, participation — what the child said and did."
                          className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-[15px] outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
                        />
                        {draftSaved && (notes[w.week] ?? "") !== "" && (
                          <p className="mt-1 text-xs text-foreground/45">
                            Kept on this device — saved for good when you mark
                            the week complete.
                          </p>
                        )}
                        <button
                          onClick={() => complete(w.week)}
                          disabled={pending}
                          className="mt-3 w-full rounded-full bg-msot-teal py-3 font-semibold text-white transition-colors hover:brightness-95 disabled:opacity-60"
                        >
                          {pending
                            ? "Saving…"
                            : w.week === weeks.length
                              ? "Complete the program ✓"
                              : `Mark week ${w.week} complete — unlock week ${w.week + 1}`}
                        </button>
                      </div>
                    ) : (
                      // A completed week keeps an editable note: teachers often
                      // remember something after ticking the box, and the old
                      // read-only panel gave them nowhere to put it.
                      <div className="mt-5 border-t border-black/[.06] pt-5">
                        <label
                          htmlFor={`note-${w.week}`}
                          className="text-[11px] font-bold uppercase tracking-wide text-foreground/45"
                        >
                          What did you notice? (optional)
                        </label>
                        <textarea
                          id={`note-${w.week}`}
                          value={notes[w.week] ?? ""}
                          onChange={(e) => setNote(w.week, e.target.value)}
                          rows={3}
                          placeholder="Independence, performance, participation — what the child said and did."
                          className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-[15px] outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
                        />
                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          <button
                            onClick={() => saveNote(w.week)}
                            disabled={pending}
                            className="rounded-full bg-msot-teal px-5 py-2 text-sm font-semibold text-white transition-colors hover:brightness-95 disabled:opacity-60"
                          >
                            {pending ? "Saving…" : "Save note"}
                          </button>
                          <button
                            onClick={() => reopen(w.week)}
                            disabled={pending}
                            className="text-sm font-medium text-foreground/50 hover:text-msot-blue disabled:opacity-60"
                          >
                            Reopen this week
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {completedCount === weeks.length && weeks.length > 0 && (
        <div className="mt-4 rounded-2xl bg-msot-teal/10 px-6 py-5 text-center">
          <p className="text-lg font-bold text-msot-navy">
            All ten weeks complete 🎉
          </p>
          <p className="mt-1 leading-7 text-foreground/75">
            Time for the end-of-program reflection below.
          </p>
        </div>
      )}
    </div>
  );
}
