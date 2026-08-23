import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { AuthError } from "@supabase/supabase-js";

/*
  Middleware runs before every matching request. It does three jobs:
   1. Keeps the login session cookie fresh so users stay logged in.
   2. Clears a session cookie that can no longer be refreshed, so a dead
      login doesn't wedge the browser (see isDeadSession below).
   3. Protects the signed-in area — if a logged-out visitor tries to reach a
      page under /students or /profile, we send them to /login instead, and
      sends anyone already logged in away from /login.
*/

/*
  Supabase refuses to refresh a token it no longer recognises — the session
  expired, was revoked, or the cookie outlived the database row it pointed at.
  None of that is recoverable, and the cookie stays in the browser, so every
  later request retries the same doomed refresh. Spotting it lets us throw the
  cookie away instead and let the visitor log in again.
*/
function isDeadSession(error: AuthError | null) {
  if (!error) return false;
  return (
    error.code === "refresh_token_not_found" ||
    error.code === "refresh_token_already_used" ||
    error.code === "session_not_found" ||
    error.code === "session_expired"
  );
}

// Supabase stores the session in cookies named "sb-<project>-auth-token",
// split across ".0", ".1", … when it's too big for one cookie. Clear the lot.
function clearAuthCookies(request: NextRequest, response: NextResponse) {
  for (const { name } of request.cookies.getAll()) {
    if (name.startsWith("sb-") && name.includes("auth-token")) {
      response.cookies.delete(name);
    }
  }
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() revalidates the session on every request (don't trust cookies alone).
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/students") || pathname.startsWith("/profile");

  // A session we can't refresh: strip the cookie so the next request starts
  // clean, then treat the visitor as logged out.
  if (isDeadSession(error)) {
    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      const redirect = NextResponse.redirect(url);
      clearAuthCookies(request, redirect);
      return redirect;
    }
    clearAuthCookies(request, response);
    return response;
  }

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Already logged in? The login page has nothing to offer — send them to
  // their profile, which is what the header button points at anyway.
  if (pathname === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Run on everything except static files and image assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand).*)"],
};
