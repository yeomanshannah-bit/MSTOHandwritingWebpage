import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/*
  The Supabase client for Server Components / Server Actions (code running on
  the server, before the page reaches the browser). It reads the logged-in
  user's session from cookies so the server knows *who* is asking — this is how
  we protect the screening area and load only the current staff member's data.
*/
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component where cookies can't be set.
            // The proxy refreshes the session instead, so this is safe.
          }
        },
      },
    },
  );
}
