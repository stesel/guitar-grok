import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Loading from "@/src/components/Loading";

export const metadata: Metadata = {
  title: "Metal Chords (Root B) - Guitar Grok",
  description: "Chord formulas, notes, and symbols for chords in root B.",
};

const MetalChordsRootB = dynamic(
  () => import("@/src/components/MetalChordsRootB"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function MetalChordsRootBPage() {
  return (
    <main className="w-screen overflow-x-auto flex min-h-screen flex-col items-center justify-start p-4">
      <h1 className="mb-6 text-center text-3xl font-bold md:text-5xl">
        Chords in Root B
      </h1>
      <MetalChordsRootB />
    </main>
  );
}

