/*
  The two-minute teacher questionnaire from the screener beta.

  The wording is Hannah's, taken verbatim from
  Content/TeacherQuestionnaire.docx — don't paraphrase it here. Each `field`
  matches a column on public.teacher_feedback, and each option is stored as
  its own literal text, so a row read straight from the Supabase dashboard is
  legible without decoding anything.
*/

export type FeedbackQuestion = {
  /** Column on teacher_feedback. */
  field: FeedbackField;
  number: number;
  question: string;
  options: string[];
};

export const feedbackQuestions: FeedbackQuestion[] = [
  {
    field: "clear_and_easy",
    number: 1,
    question: "Was the screener clear and easy to complete?",
    options: ["Yes", "Mostly", "No"],
  },
  {
    field: "time_per_child",
    number: 2,
    question: "How long did it take for each child?",
    options: ["Under 5 minutes", "5–10 minutes", "Over 10 minutes"],
  },
  {
    field: "reflected_class",
    number: 3,
    question:
      "Did the questions reflect the handwriting difficulties you see in the classroom?",
    options: ["Yes", "Mostly", "No"],
  },
  {
    field: "ratings_clear",
    number: 4,
    question:
      "Were the results and Green/Amber/Red ratings easy to understand?",
    options: ["Yes", "Mostly", "No"],
  },
  {
    field: "helped_next_steps",
    number: 5,
    question: "Did the results help you understand what the child may need next?",
    options: ["Yes", "Somewhat", "No"],
  },
  {
    field: "would_use_again",
    number: 6,
    question: "Would you use this screener again?",
    options: ["Yes", "Maybe", "No"],
  },
];

/** Every column the form may write. */
export const feedbackFields = [
  "year_levels",
  "children_screened",
  "clear_and_easy",
  "time_per_child",
  "reflected_class",
  "ratings_clear",
  "helped_next_steps",
  "would_use_again",
  "most_useful",
] as const;

export type FeedbackField = (typeof feedbackFields)[number];

/** One teacher's answers, as held in the browser and in the database. */
export type FeedbackAnswers = Partial<Record<FeedbackField, string>>;

/**
 * Keeps only recognised fields, so a tampered payload can't write columns
 * the form doesn't own (submitted_at and staff_id in particular).
 */
export function pickFeedbackFields(input: FeedbackAnswers): FeedbackAnswers {
  const clean: FeedbackAnswers = {};
  for (const field of feedbackFields) {
    const value = input[field];
    if (typeof value === "string") clean[field] = value.slice(0, 2000);
  }
  return clean;
}
