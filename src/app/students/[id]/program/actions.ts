"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_VERSION } from "@/lib/programContent";

/*
  Server Actions for a student's program. "use server" means these run on the
  server even when called from a browser component — the database credentials
  and the logged-in user's identity never leave the server.

  Every action re-checks who is asking. Row Level Security in Supabase also
  restricts each staff member to their own rows, so these checks are a second
  lock rather than the only one.
*/

/** Create the program for a student from the domains their screening flagged. */
export async function createProgram(
  studentId: string,
  screeningId: string | null,
  domainIds: string[],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { error } = await supabase.from("programs").insert({
    student_id: studentId,
    staff_id: user.id,
    screening_id: screeningId,
    domain_ids: domainIds,
    content_version: CONTENT_VERSION,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/students/${studentId}/program`);
  revalidatePath(`/students/${studentId}`);
}

/** Tick a week off, which unlocks the next one. */
export async function completeWeek(
  studentId: string,
  programId: string,
  week: number,
  observation: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  // upsert so a double-click can't create two rows for the same week
  const { error } = await supabase.from("program_sessions").upsert(
    {
      program_id: programId,
      staff_id: user.id,
      week,
      observation: observation || null,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "program_id,week" },
  );
  if (error) throw new Error(error.message);

  revalidatePath(`/students/${studentId}/program`);
}

/** Reopen a week — and everything after it, since weeks run in order. */
export async function reopenWeek(
  studentId: string,
  programId: string,
  week: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { error } = await supabase
    .from("program_sessions")
    .delete()
    .eq("program_id", programId)
    .gte("week", week);
  if (error) throw new Error(error.message);

  revalidatePath(`/students/${studentId}/program`);
}
