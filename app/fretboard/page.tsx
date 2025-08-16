import dynamic from "next/dynamic";

const Fretboard = dynamic(() => import("@/src/components/Fretboard"), {
  ssr: false,
});

export default function FretboardPage() {
  return <Fretboard />;
}
