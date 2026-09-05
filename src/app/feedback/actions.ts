"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { pickFeedbackFields, type FeedbackAnswers } from "@/lib/feedback";

/*
  Saves whatever has been filled in so far.

  Called as the teacher types, not only on submit — a half-finished
  questionnaire is still useful feedback, and most people who abandon a form
  never come back to it. `upsert` on staff_id means the first keystroke
  creates the row and every later save writes over the same one, so there is
  exactly one response per teacher however many times they wander off.

  `submitted_at` is deliberately not touched here: that is what tells a draft
  apart from a finished response.
*/
export async function saveFeedbackDraft(answers: FeedbackAnswers) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { error } = await supabase.from("teacher_feedback").upsert(
    {
      staff_id: user.id,
      ...pickFeedbackFields(answers),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "staff_id" },
  );
  if (error) throw new Error(error.message);
}

/** The same save, plus the stamp that marks it finished. */
export async function submitFeedback(answers: FeedbackAnswers) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { error } = await supabase.from("teacher_feedback").upsert(
    {
      staff_id: user.id,
      ...pickFeedbackFields(answers),
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "staff_id" },
  );
  if (error) throw new Error(error.message);

  revalidatePath("/feedback");
  revalidatePath("/profile");
}
