import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Loading from "@/src/components/Loading";

export const metadata: Metadata = {
  title: "Fretboard - Guitar Grok",
  description: "Explore guitar scales and practice fretboard navigation",
};

const Fretboard = dynamic(() => import("@/src/components/Fretboard"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function FretboardPage() {
  return (
    <main className="w-screen overflow-hidden flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-6 text-center text-3xl font-bold md:text-5xl">
        Fretboard
      </h1>
      <div className="w-screen px-4 pb-4">
        <Fretboard />
      </div>
    </main>
  );
}
