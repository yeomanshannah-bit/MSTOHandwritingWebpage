"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

/*
  Supabase answers a wrong password and an email that has no account with the
  same "Invalid login credentials" — deliberately, so an attacker can't use
  the login form to discover which addresses are registered. That is the right
  call, but on its own it strands a teacher who simply mistyped their email:
  the message gives them nothing to check. So we keep the message vague about
  WHICH half was wrong, and add the one piece of advice that actually helps.
*/
function friendlySignInError(message: string) {
  if (/invalid login credentials/i.test(message)) {
    return "That email and password don't match an account. Check your email for typos — a mistyped address is treated as a different account, not as an error.";
  }
  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  // Local state: which mode we're in, the field values, and any message.
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Signed up and logged straight in.
        router.push("/dashboard");
        router.refresh();
      } else {
        // Email confirmation is switched on in Supabase.
        setNotice("Check your email to confirm your account, then log in.");
        setMode("signin");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(friendlySignInError(error.message));
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16">
      <Image
        src="/brand/msot-mark.png"
        alt=""
        width={350}
        height={414}
        className="h-20 w-auto"
      />
      <h1 className="mt-6 text-2xl font-bold text-msot-navy">
        {mode === "signin" ? "Log In" : "Create an Account"}
      </h1>
      <p className="mt-2 text-center text-foreground/70">
        {mode === "signin"
          ? "Log in to screen a student and see their results."
          : "Set up an account to start screening students."}
      </p>

      {/*
        The trap this closes: signing up with a typo'd email succeeds, and
        hands you an empty account that looks exactly like your real one with
        all its data missing. Cheaper to warn here than to explain later.
      */}
      {mode === "signup" && (
        <p className="mt-4 w-full rounded-lg bg-msot-pink/[.15] px-4 py-3 text-sm leading-6 text-msot-navy">
          This creates a <strong>brand-new, empty account</strong>. If you have
          screened students before, go back and log in instead — a different
          email address means a different account, and your students will not
          be in it.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-msot-navy">
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-4 py-2.5 outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
            placeholder="you@school.edu"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-msot-navy">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-black/10 px-4 py-2.5 outline-none focus:border-msot-blue focus:ring-2 focus:ring-msot-blue/20"
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-msot-red/10 px-4 py-2.5 text-sm text-msot-red">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-lg bg-msot-teal/10 px-4 py-2.5 text-sm text-msot-navy">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-msot-blue py-3 font-medium text-white transition-colors hover:bg-msot-navy disabled:opacity-60"
        >
          {busy
            ? "Please wait…"
            : mode === "signin"
              ? "Log in"
              : "Create account"}
        </button>
      </form>

      {/*
        Secondary action, styled as the outlined twin of the submit button:
        same width, same pill, same vertical padding. The outline is a
        `ring-inset` rather than a border so it adds no height — a 2px border
        would make this button 4px taller than the filled one above it.

        type="button" matters: it sits outside the form, but keeping it
        explicit stops it ever being treated as a submit.
      */}
      {/*
        The two modes get different secondary actions. Signing in offers the
        outlined twin of the submit button, because creating an account is a
        real destination. Signing up only needs a way back, so it gets a quiet
        text link — anything heavier would compete with "Create account".
      */}
      {mode === "signin" ? (
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
            setNotice(null);
          }}
          className="mt-3 w-full rounded-full bg-white py-3 font-medium text-msot-blue ring-2 ring-inset ring-msot-blue transition-colors hover:bg-msot-blue/[.06]"
        >
          Create an account
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-msot-blue"
        >
          <span aria-hidden>←</span> Go back to log in
        </button>
      )}
    </div>
  );
}
