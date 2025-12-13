import Link from "next/link";

export default function Header() {
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
      </div>
    </header>
  );
}
