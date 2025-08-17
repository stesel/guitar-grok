import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Loading from "@/src/components/Loading";

export const metadata: Metadata = {
  title: "Guitar Daily - Guitar Grok",
  description: "Daily guitar practice with interactive tools",
};

const GuitarDailyMvp = dynamic(
  () => import("@/src/components/GuitarDailyMvp"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function Page() {
  return <GuitarDailyMvp />;
}
