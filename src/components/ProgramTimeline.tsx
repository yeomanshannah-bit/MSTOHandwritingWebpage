"use client";

import { useState, useTransition } from "react";
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
}: {
  weeks: TimelineWeek[];
  completedWeeks: number[];
  observations?: Record<number, string | null>;
  onComplete?: (week: number, observation: string) => Promise<void>;
  onReopen?: (week: number) => Promise<void>;
}) {
  const [done, setDone] = useState<number[]>(completedWeeks);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

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
    const observation = note.trim();
    setDone((d) => [...d, week].sort((a, b) => a - b));
    setNote("");
    setOpenWeek(week + 1 <= weeks.length ? week + 1 : null);
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
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={3}
                          placeholder="Independence, performance, participation — what the child said and did."
                          className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-[15px] outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
                        />
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
                      <div className="mt-5 border-t border-black/[.06] pt-4">
                        {observations[w.week] && (
                          <p className="mb-3 rounded-xl bg-msot-teal/[.08] px-3.5 py-2.5 text-[15px] leading-7 text-foreground/75">
                            <span className="font-semibold text-msot-navy">
                              You noticed:{" "}
                            </span>
                            {observations[w.week]}
                          </p>
                        )}
                        <button
                          onClick={() => reopen(w.week)}
                          disabled={pending}
                          className="text-sm font-medium text-foreground/50 hover:text-msot-blue disabled:opacity-60"
                        >
                          Reopen this week
                        </button>
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
