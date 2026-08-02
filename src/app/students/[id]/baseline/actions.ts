"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/*
  The file itself is uploaded straight from the browser to Supabase Storage
  (so a large photo never has to pass through this server). Once that lands,
  the browser calls this to record where it went.
*/
export async function recordBaselinePhoto(
  studentId: string,
  storagePath: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  // The storage policy already restricts writes to the staff member's own
  // folder; re-check here so a mismatched path can't be recorded at all.
  if (!storagePath.startsWith(`${user.id}/`)) {
    throw new Error("That file doesn't belong to you.");
  }

  const { error } = await supabase.from("baseline_photos").insert({
    student_id: studentId,
    staff_id: user.id,
    storage_path: storagePath,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/students/${studentId}/baseline`);
  revalidatePath(`/students/${studentId}`);
}

/** Remove a baseline photo — the file and its record. */
export async function deleteBaselinePhoto(studentId: string, photoId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { data: photo } = await supabase
    .from("baseline_photos")
    .select("storage_path")
    .eq("id", photoId)
    .single();

  if (photo) {
    await supabase.storage.from("baselines").remove([photo.storage_path]);
    await supabase.from("baseline_photos").delete().eq("id", photoId);
  }

  revalidatePath(`/students/${studentId}/baseline`);
}
