"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/db";
import Header from "./Header";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    void supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user && pathname !== "/signin") router.replace("/signin");
      if (user && pathname === "/signin") router.replace("/");
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u && pathname !== "/signin") router.replace("/signin");
      if (u && pathname === "/signin") router.replace("/");
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (!user && pathname !== "/signin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 text-white">
      <Header user={user} />
      {children}
    </div>
  );
}
