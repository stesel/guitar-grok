"use client";

import Link from "next/link";
import { supabase } from "@/src/lib/db";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  function signOut() {
    void supabase.auth.signOut();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-white/20 bg-white/10 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
            G
          </span>
          <div>
            <div className="text-lg font-semibold">Guitar Grok</div>
            <div className="text-xs text-white/70">Create · Schedule · Practice</div>
          </div>
        </Link>
        {user && (
          <button
            onClick={signOut}
            className="rounded-lg border border-white/20 px-3 py-1 text-sm hover:bg-white/20"
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  );
}
