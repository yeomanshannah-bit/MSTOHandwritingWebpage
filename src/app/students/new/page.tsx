"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { yearLevels, terms, currentTerm } from "@/lib/screening";

export default function NewStudentPage() {
  const router = useRouter();
  const [initials, setInitials] = useState("");
  const [year, setYear] = useState("Year 1");
  const [term, setTerm] = useState(currentTerm);
  const [className, setClassName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();
    // We need the logged-in user's id to mark ownership of this student.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Insert one new row into the `students` table. RLS checks that the
    // staff_id matches us, so we couldn't create a student for anyone else.
    // created_at is filled in by the database default, so the profile always
    // carries the date it was made without us passing anything.
    const { error } = await supabase.from("students").insert({
      staff_id: user.id,
      initials: initials.trim(),
      year_level: year,
      term,
      // Class is optional — store null rather than an empty string so the
      // display code only has one "not set" case to handle.
      class_name: className.trim() || null,
    });

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    router.push("/students");
    router.refresh(); // re-fetch the roster so the new student shows up
  }

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <Link
        href="/students"
        className="text-sm text-foreground/60 hover:text-msot-blue"
      >
        ← Back to students
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-msot-navy">Add a student</h1>
      <p className="mt-2 text-foreground/70">
        We only store initials — no full names — to keep student data private.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-msot-navy">
            Student initials
          </label>
          <input
            type="text"
            required
            maxLength={4}
            value={initials}
            onChange={(e) => setInitials(e.target.value.toUpperCase())}
            className="w-full rounded-lg border border-black/10 px-4 py-2.5 uppercase outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
            placeholder="e.g. J.S."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-msot-navy">
            Year level
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
          >
            {yearLevels.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-msot-navy">
            Term
          </label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
          >
            {terms.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-msot-navy">
            Class{" "}
            <span className="font-normal text-foreground/50">(optional)</span>
          </label>
          <input
            type="text"
            maxLength={30}
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-4 py-2.5 outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
            placeholder="e.g. 3B"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-msot-red/10 px-4 py-2.5 text-sm text-msot-red">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || initials.trim().length === 0}
          className="w-full rounded-full bg-msot-blue py-3 font-medium text-white transition-colors hover:bg-msot-navy disabled:opacity-60"
        >
          {busy ? "Saving…" : "Add student"}
        </button>
      </form>
    </div>
  );
}
