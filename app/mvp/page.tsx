import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Guitar Daily - Guitar Grok",
  description: "Daily guitar practice with interactive tools",
};

const GuitarDailyMvp = dynamic(
  () => import("@/src/components/GuitarDailyMvp"),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading...</div>,
  }
);

export default function Page() {
  return <GuitarDailyMvp />;
}
