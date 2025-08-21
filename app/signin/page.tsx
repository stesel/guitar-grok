"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/db";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await supabase.auth.signInWithOtp({ email });
    setEmail("");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-6xl">Guitar Grok</h1>
      <form onSubmit={signIn} className="space-y-3 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-64 rounded border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/60"
          placeholder="you@example.com"
        />
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
        >
          Send Magic Link
        </button>
      </form>
    </main>
  );
}
