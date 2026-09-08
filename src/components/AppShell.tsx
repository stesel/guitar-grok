import type { ReactNode } from "react";
import Header from "./Header";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 text-white">
      <Header />
      <div className="flex-1">{children}</div>
      <footer className="px-4 py-6 text-center text-sm text-white/70">
        © 2026{" "}
        <a
          href="https://stesel.netlify.app/"
          className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-white"
        >
          Stesel
        </a>
        . All rights reserved.
      </footer>
    </div>
  );
}
