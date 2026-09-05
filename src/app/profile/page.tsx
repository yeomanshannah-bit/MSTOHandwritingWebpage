import { redirect } from "next/navigation";

/*
  "My profile" became the dashboard. Kept as a redirect so old links and
  anyone's bookmark still land somewhere sensible.
*/
export default function ProfilePage() {
  redirect("/dashboard");
}
