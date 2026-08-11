import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/*
  Middleware runs before every matching request. It does two jobs:
   1. Keeps the login session cookie fresh so users stay logged in.
   2. Protects the signed-in area — if a logged-out visitor tries to reach a
      page under /students or /profile, we send them to /login instead, and
      sends anyone already logged in away from /login.
*/
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
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/students") || pathname.startsWith("/profile");
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
