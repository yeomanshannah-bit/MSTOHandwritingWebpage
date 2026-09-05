"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  /*
    An outlined pill, matching the header's own outline buttons — same radius,
    same ring-inset (a ring rather than a border so it adds no height and can't
    nudge the row it sits in). Outlined rather than filled on purpose: logging
    out is a real action but never the one we want someone to take, so it
    should read as available, not inviting. It warms to red on hover, which is
    where the warning belongs.
  */
  return (
    <button
      type="button"
      onClick={logout}
      className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-foreground/70 ring-1 ring-inset ring-black/15 transition-colors hover:bg-msot-red/[.06] hover:text-msot-red hover:ring-msot-red/40"
    >
      Log out
    </button>
  );
}
