import type { ReactNode } from "react";
import Header from "./Header";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 text-white">
      <Header />
      {children}
    </div>
  );
}
