"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/db";

export default function SignInPage() {
  const [email, setEmail] = useState<string>("");
  const [linkSent, setLinkSent] = useState(false);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) {
      setLinkSent(true);
    }
  }

  function reset() {
    setEmail("");
    setLinkSent(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-6xl">Guitar Grok</h1>
      {linkSent ? (
        <div
          className="w-64 space-y-3 rounded-xl border border-white/20 bg-white/10 p-6 text-center text-white backdrop-blur"
          role="status"
          aria-live="polite"
        >
          <p>Check your email for a magic link to sign in.</p>
          <button
            onClick={reset}
            className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <form
          onSubmit={signIn}
          className="w-64 space-y-3 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur"
        >
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Send Magic Link
          </button>
        </form>
      )}
    </main>
  );
}
