"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  screeningDomains,
  ratingOptions,
  allSkillIds,
  scoreScreening,
  type Rating,
  type Responses,
} from "@/lib/screening";

// Every button carries its traffic-light colour at all times. `idleStyle` is
// the soft/tinted look; `chosenStyle` is the bold, filled + ringed look for the
// option the teacher has picked.
const idleStyle: Record<Rating, string> = {
  green: "border-msot-teal/40 bg-msot-teal/10 text-msot-teal hover:bg-msot-teal/20",
  yellow:
    "border-msot-yellow/60 bg-msot-yellow/15 text-msot-navy hover:bg-msot-yellow/25",
  red: "border-msot-red/40 bg-msot-red/10 text-msot-red hover:bg-msot-red/20",
};
const chosenStyle: Record<Rating, string> = {
  green: "border-msot-teal bg-msot-teal text-white ring-2 ring-msot-teal/30",
  yellow:
    "border-msot-yellow bg-msot-yellow text-msot-navy ring-2 ring-msot-yellow/40",
  red: "border-msot-red bg-msot-red text-white ring-2 ring-msot-red/30",
};
const dotStyle: Record<Rating, string> = {
  green: "bg-msot-teal",
  yellow: "bg-msot-yellow",
  red: "bg-msot-red",
};

export default function ScreenPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  // `responses` remembers every choice: { "fine-motor-2": "yellow", ... }
  const [responses, setResponses] = useState<Responses>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answered = Object.keys(responses).length;
  const total = allSkillIds.length;
  const complete = answered === total;

  function choose(skillId: string, rating: Rating) {
    setResponses((prev) => ({ ...prev, [skillId]: rating }));
  }

  async function handleSubmit() {
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Work out the results now, and store both the raw answers and the summary.
    const results = scoreScreening(responses);
    const { data, error } = await supabase
      .from("screenings")
      .insert({ student_id: id, staff_id: user.id, responses, results })
      .select("id")
      .single();

    if (error || !data) {
      setError(error?.message ?? "Could not save the screening.");
      setBusy(false);
      return;
    }

    router.push(`/students/${id}/results/${data.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 pb-28">
      <Link
        href={`/students/${id}`}
        className="text-sm text-foreground/60 hover:text-msot-blue"
      >
        ← Back to student
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-msot-navy">
        Screening
      </h1>
      <p className="mt-2 text-foreground/70">
        Rate each skill using the traffic light. Base it on what you typically
        observe for this student.
      </p>

      {/* Legend so the colours are unambiguous */}
      <div className="mt-6 flex flex-wrap gap-4 rounded-xl bg-black/[.03] px-4 py-3 text-sm">
        {ratingOptions.map((o) => (
          <span key={o.value} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${dotStyle[o.value]}`} />
            <span className="text-foreground/80">{o.label}</span>
          </span>
        ))}
      </div>

      {/* Domains and their skills */}
      <div className="mt-8 space-y-8">
        {screeningDomains.map((domain) => (
          <section key={domain.id}>
            <h2 className="text-lg font-semibold text-msot-navy">
              {domain.title}
            </h2>
            <div className="mt-3 space-y-3">
              {domain.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-xl border border-black/[.06] bg-white/70 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4"
                >
                  <p className="text-foreground/90">{skill.label}</p>
                  <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
                    {ratingOptions.map((o) => {
                      const isChosen = responses[skill.id] === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => choose(skill.id, o.value)}
                          aria-pressed={isChosen}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                            isChosen ? chosenStyle[o.value] : idleStyle[o.value]
                          }`}
                        >
                          {o.short}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-msot-red/10 px-4 py-2.5 text-sm text-msot-red">
          {error}
        </p>
      )}

      {/* Sticky bottom bar: progress + submit */}
      <div className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-3">
          <span className="text-sm text-foreground/70">
            {answered} of {total} rated
          </span>
          <button
            onClick={handleSubmit}
            disabled={!complete || busy}
            className="rounded-full bg-msot-blue px-6 py-2.5 font-medium text-white transition-colors hover:bg-msot-navy disabled:opacity-50"
          >
            {busy
              ? "Saving…"
              : complete
                ? "See results"
                : `Rate all skills to finish`}
          </button>
        </div>
      </div>
    </div>
  );
}
