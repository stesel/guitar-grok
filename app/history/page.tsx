import type { Metadata } from "next";
import HistoryPage from "@/src/components/HistoryPage";

export const metadata: Metadata = {
  title: "Practice History - Guitar Grok",
  description: "Review exercise dates, tempos, and practice duration",
};

export default function PracticeHistoryPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Progress</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">Practice history</h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Exercise sessions recorded with the lesson metronome on this browser.
        </p>
      </div>
      <HistoryPage />
    </main>
  );
}
