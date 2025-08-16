import dynamic from "next/dynamic";
import Link from "next/link";

const Fretboard = dynamic(() => import("@/src/components/Fretboard"), {
  ssr: false,
});

export default function FretboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 p-4 text-white">
      <Link
        href="/"
        className="absolute left-4 top-4 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur transition-colors hover:bg-white/20"
      >
        ← Home
      </Link>
      <h1 className="mb-6 text-center text-3xl font-bold md:text-5xl">
        Fretboard
      </h1>
      <div className="w-auto">
        <Fretboard />
      </div>
    </main>
  );
}
