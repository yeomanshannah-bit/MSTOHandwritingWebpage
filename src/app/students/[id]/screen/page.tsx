import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ScreenForm from "./ScreenForm";

/*
  The screener itself is a long, stateful client component (ScreenForm). This
  server component exists only to look up the year level recorded on the
  student's profile and hand it over, so the matching form is already
  highlighted in the first render rather than appearing a moment later.

  A missing student is not an error here: the screener still works, it just
  makes no suggestion. Access is already handled by the proxy, which sends
  logged-out visitors to /login before they reach this.
*/
export default async function ScreenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: student } = await supabase
    .from("students")
    .select("year_level")
    .eq("id", id)
    .single();

  return <ScreenForm yearLevel={(student?.year_level as string) ?? null} />;
}
