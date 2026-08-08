"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

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
        router.push("/students");
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
        setError(error.message);
      } else {
        router.push("/students");
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
          ? "Log in to screen a student and build their program."
          : "Set up an account to start screening students."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-msot-navy">
            Email
          </label>
          <input
            type="email"
            required
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
