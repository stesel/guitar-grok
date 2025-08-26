import React from "react";

interface Mode {
  name: string;
  formula: string;
  notes: string;
  usage: React.ReactNode;
}

const modes: Mode[] = [
  {
    name: "Ionian (Major)",
    formula: "1 – 2 – 3 – 4 – 5 – 6 – 7",
    notes: "B – C# – D# – E – F# – G# – A#",
    usage: (
      <>
        Rare in metal; sometimes in <strong>power metal</strong> for heroic, bright melodies.
      </>
    ),
  },
  {
    name: "Dorian",
    formula: "1 – 2 – ♭3 – 4 – 5 – 6 – ♭7",
    notes: "B – C# – D – E – F# – G# – A",
    usage: (
      <>Used in <strong>prog</strong> and <strong>fusion metal</strong>; minor with a lifted mood.</>
    ),
  },
  {
    name: "Phrygian",
    formula: "1 – ♭2 – ♭3 – 4 – 5 – ♭6 – ♭7",
    notes: "B – C – D – E – F# – G – A",
    usage: <>One of the darkest; common in <strong>thrash, death, black metal</strong>.</>,
  },
  {
    name: "Lydian",
    formula: "1 – 2 – 3 – ♯4 – 5 – 6 – 7",
    notes: "B – C# – D# – F – F# – G# – A#",
    usage: (
      <>Used in <strong>prog</strong> and <strong>power metal</strong>; “cosmic,” uplifting vibe.</>
    ),
  },
  {
    name: "Mixolydian",
    formula: "1 – 2 – 3 – 4 – 5 – 6 – ♭7",
    notes: "B – C# – D# – E – F# – G# – A",
    usage: (
      <>Found in <strong>groove</strong> and <strong>southern metal</strong>; major with bluesy edge.</>
    ),
  },
  {
    name: "Aeolian (Natural Minor)",
    formula: "1 – 2 – ♭3 – 4 – 5 – ♭6 – ♭7",
    notes: "B – C# – D – E – F# – G – A",
    usage: <>The most common minor; <strong>doom, gothic, metalcore</strong>.</>,
  },
  {
    name: "Locrian",
    formula: "1 – ♭2 – ♭3 – 4 – ♭5 – ♭6 – ♭7",
    notes: "B – C – D – E – F – G – A",
    usage: (
      <>Rare, but used in <strong>avant-garde / black metal</strong> for dissonance.</>
    ),
  },
  {
    name: "Harmonic Minor",
    formula: "1 – 2 – ♭3 – 4 – 5 – ♭6 – 7",
    notes: "B – C# – D – E – F# – G – A#",
    usage: (
      <>Basis of <strong>neoclassical, shred, power metal</strong>; epic, medieval vibe.</>
    ),
  },
  {
    name: "Melodic Minor",
    formula: "1 – 2 – ♭3 – 4 – 5 – 6 – 7",
    notes: "B – C# – D – E – F# – G# – A#",
    usage: (
      <>Found in <strong>prog</strong> and <strong>jazz-metal</strong>; modern, tense sound.</>
    ),
  },
  {
    name: "Phrygian Dominant",
    formula: "1 – ♭2 – 3 – 4 – 5 – ♭6 – ♭7",
    notes: "B – C – D# – E – F# – G – A",
    usage: (
      <>Popular in <strong>death, black, oriental metal</strong>; sinister, “eastern” vibe.</>
    ),
  },
  {
    name: "Dorian ♭2 (a.k.a. Phrygian ♯6)",
    formula: "1 – ♭2 – ♭3 – 4 – 5 – 6 – ♭7",
    notes: "B – C – D – E – F# – G# – A",
    usage: <>Used in <strong>prog / tech death</strong> for exotic flavors.</>,
  },
  {
    name: "Lydian Dominant",
    formula: "1 – 2 – 3 – ♯4 – 5 – 6 – ♭7",
    notes: "B – C# – D# – F – F# – G# – A",
    usage: (
      <>
        <strong>Fusion / prog metal</strong>; aggressive with futuristic color.
      </>
    ),
  },
  {
    name: "Altered / Super Locrian",
    formula: "1 – ♭2 – ♭3 – ♭4 – ♭5 – ♭6 – ♭7",
    notes: "B – C – D – E♭ – F – G – A",
    usage: (
      <> <strong>Prog / avant-garde metal</strong>; maximally dissonant, chaotic solos.</>
    ),
  },
];

export default function MetalModesRootB() {
  return (
    <table className="min-w-full border-collapse text-sm md:text-base">
      <thead>
        <tr>
          <th className="border px-2 py-1 text-left">Mode / Scale</th>
          <th className="border px-2 py-1 text-left">Formula (relative to tonic)</th>
          <th className="border px-2 py-1 text-left">Notes in B</th>
          <th className="border px-2 py-1 text-left">Typical Metal Usage</th>
        </tr>
      </thead>
      <tbody>
        {modes.map((mode) => (
          <tr key={mode.name}>
            <td className="border px-2 py-1 font-medium">{mode.name}</td>
            <td className="border px-2 py-1">{mode.formula}</td>
            <td className="border px-2 py-1">{mode.notes}</td>
            <td className="border px-2 py-1">{mode.usage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

