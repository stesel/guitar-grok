"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const HeaderMetronome = dynamic(() => import("./HeaderMetronome"), {
  ssr: false,
  loading: () => <div className="h-10 w-28 animate-pulse rounded-xl bg-white/10" aria-label="Loading metronome" />,
});

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/20 bg-indigo-950/80 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
            G
          </span>
          <div className="hidden sm:block">
            <div className="text-lg font-semibold">Guitar Grok</div>
            <div className="text-xs text-white/70">Create · Schedule · Practice</div>
          </div>
        </Link>
        <HeaderMetronome />
      </div>
    </header>
  );
}
