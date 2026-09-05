import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FeedbackForm from "@/components/FeedbackForm";
import BackLink from "@/components/BackLink";
import { feedbackFields, type FeedbackAnswers } from "@/lib/feedback";

export const metadata: Metadata = {
  title: "Two-minute teacher feedback",
  description:
    "Tell us how the Handwriting Iceberg Screener worked in your classroom.",
};

/*
  The beta questionnaire. One per teacher, so this loads whatever they have
  already filled in — finished or not — and hands it to the form to continue.
*/
export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: row } = await supabase
    .from("teacher_feedback")
    .select("*")
    .eq("staff_id", user.id)
    .maybeSingle();

  // Null columns become absent keys, which is what the form's controlled
  // inputs expect (a null in a value prop makes React shout).
  const initialAnswers: FeedbackAnswers = {};
  for (const field of feedbackFields) {
    const value = row?.[field];
    if (typeof value === "string") initialAnswers[field] = value;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <BackLink href="/dashboard">Dashboard</BackLink>

      <p className="mt-4 text-sm font-semibold text-msot-blue">
        Making Sense of Handwriting
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-msot-navy sm:text-4xl">
        Two-minute teacher feedback
      </h1>
      <p className="mt-4 text-lg leading-8 text-foreground/70">
        Thank you for trialling the Handwriting Iceberg Screener. Your brief
        feedback will help shape the next version.
      </p>
      <p className="mt-3 text-sm text-foreground/55">
        Every question is optional, and your answers save as you go — you can
        stop partway and come back.
      </p>

      <FeedbackForm
        initialAnswers={initialAnswers}
        alreadySubmitted={Boolean(row?.submitted_at)}
      />
    </div>
  );
}
