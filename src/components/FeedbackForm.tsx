"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  feedbackQuestions,
  type FeedbackAnswers,
  type FeedbackField,
} from "@/lib/feedback";
import { saveFeedbackDraft, submitFeedback } from "@/app/feedback/actions";

type SaveState = "idle" | "saving" | "saved" | "error";

/*
  The two-minute questionnaire.

  Everything is optional on purpose. This goes to teachers who are doing us a
  favour in the ten minutes they have between classes, so a required field
  that blocks submit would cost us more answers than it gains.

  It saves as they type. See saveFeedbackDraft for why.
*/
export default function FeedbackForm({
  initialAnswers,
  alreadySubmitted,
}: {
  initialAnswers: FeedbackAnswers;
  alreadySubmitted: boolean;
}) {
  const [answers, setAnswers] = useState<FeedbackAnswers>(initialAnswers);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [submitted, setSubmitted] = useState(alreadySubmitted);
  const [error, setError] = useState<string | null>(null);

  // Held in a ref as well as state so the debounced timer always saves the
  // latest answers, not the ones captured when the timer was set.
  const latest = useRef(answers);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    setSaveState("saving");
    try {
      await saveFeedbackDraft(latest.current);
      setSaveState("saved");
    } catch {
      // A failed autosave is not worth interrupting anyone over — the next
      // keystroke retries, and submit reports properly if it matters.
      setSaveState("error");
    }
  }, []);

  function update(field: FeedbackField, value: string) {
    const next = { ...latest.current, [field]: value };
    latest.current = next;
    setAnswers(next);
    setSaveState("saving");

    // Wait for a pause in typing rather than saving on every character.
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 800);
  }

  // A pending save would otherwise be lost when the page goes away.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    setError(null);
    setSaveState("saving");
    try {
      await submitFeedback(latest.current);
      setSubmitted(true);
      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
      setError(err instanceof Error ? err.message : "Could not send that.");
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-2xl border border-msot-teal/30 bg-msot-teal/[.07] p-7">
        <h2 className="text-xl font-bold text-msot-navy">
          Thank you — that&apos;s genuinely useful
        </h2>
        <p className="mt-2 leading-7 text-foreground/70">
          Your answers will directly inform the next version of the Making
          Sense of Handwriting screener.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/students"
            className="rounded-full bg-msot-teal px-6 py-3 font-medium text-white transition-colors hover:brightness-95"
          >
            Back to my students
          </Link>
          <button
            onClick={() => setSubmitted(false)}
            className="rounded-full border border-black/10 px-6 py-3 font-medium text-msot-navy transition-colors hover:bg-black/[.03]"
          >
            Change my answers
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8">
      {/* Context for the answers below. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-msot-navy">
            Year level(s)
          </span>
          <input
            type="text"
            value={answers.year_levels ?? ""}
            onChange={(e) => update("year_levels", e.target.value)}
            placeholder="e.g. Reception and Year 1"
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-foreground outline-none focus:border-msot-blue"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-msot-navy">
            Number of children screened
          </span>
          <input
            type="text"
            value={answers.children_screened ?? ""}
            onChange={(e) => update("children_screened", e.target.value)}
            placeholder="e.g. 6"
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-foreground outline-none focus:border-msot-blue"
          />
        </label>
      </div>

      <ol className="mt-8 space-y-6">
        {feedbackQuestions.map((q) => (
          <li key={q.field} className="rounded-2xl bg-white/70 p-5">
            <p className="font-medium text-msot-navy">
              {q.number}. {q.question}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {q.options.map((option) => {
                const chosen = answers[q.field] === option;
                return (
                  <label
                    key={option}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                      chosen
                        ? "border-msot-blue bg-msot-blue text-white"
                        : "border-black/10 text-foreground/75 hover:bg-black/[.03]"
                    }`}
                  >
                    {/* A real radio, hidden — so the keyboard and screen
                        readers still get a proper group of choices. */}
                    <input
                      type="radio"
                      name={q.field}
                      value={option}
                      checked={chosen}
                      onChange={() => update(q.field, option)}
                      className="sr-only"
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <label className="mt-6 block">
        <span className="font-medium text-msot-navy">
          The most useful part was:
        </span>
        <textarea
          value={answers.most_useful ?? ""}
          onChange={(e) => update("most_useful", e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-foreground outline-none focus:border-msot-blue"
        />
      </label>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-msot-blue px-6 py-3 font-medium text-white transition-colors hover:bg-msot-navy"
        >
          Send my feedback
        </button>
        <span className="text-sm text-foreground/50" aria-live="polite">
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Saved — you can finish this later"}
          {saveState === "error" && "Couldn't save just then; still trying"}
        </span>
      </div>
    </form>
  );
}
