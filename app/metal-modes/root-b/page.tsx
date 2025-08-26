import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Loading from "@/src/components/Loading";

export const metadata: Metadata = {
  title: "Metal Modes (Root B) - Guitar Grok",
  description: "Formulas, notes, and typical usage of metal modes with root B.",
};

const MetalModesRootB = dynamic(
  () => import("@/src/components/MetalModesRootB"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function MetalModesRootBPage() {
  return (
    <main className="w-screen overflow-x-auto flex min-h-screen flex-col items-center justify-start p-4">
      <h1 className="mb-6 text-center text-3xl font-bold md:text-5xl">
        Metal Modes &amp; Scales (Root B)
      </h1>
      <MetalModesRootB />
    </main>
  );
}

