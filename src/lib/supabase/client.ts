import { createBrowserClient } from "@supabase/ssr";

/*
  The Supabase "client" for Client Components (code running in the browser).
  Anything that reacts to the user — a login form, a button — uses this to
  talk to Supabase. It reads the safe public keys from .env.local.
*/
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
