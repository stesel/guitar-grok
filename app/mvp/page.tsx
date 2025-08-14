import dynamic from "next/dynamic";

const GuitarDailyMvp = dynamic(() => import("@/components/GuitarDailyMvp"), {
  ssr: false,
  loading: () => <div className="p-4">Loading...</div>,
});

export default function Page() {
  return <GuitarDailyMvp />;
}
