import React from "react";

interface Chord {
  type: string;
  formula: string;
  notes: string;
  symbol: string;
}

const basicChords: Chord[] = [
  { type: "Power Chord", formula: "1–5", notes: "B–F#", symbol: "B5" },
  { type: "Major", formula: "1–3–5", notes: "B–D#–F#", symbol: "B" },
  { type: "Minor", formula: "1–♭3–5", notes: "B–D–F#", symbol: "Bm" },
  { type: "Diminished", formula: "1–♭3–♭5", notes: "B–D–F", symbol: "Bdim" },
  { type: "Augmented", formula: "1–3–♯5", notes: "B–D#–G", symbol: "Baug" },
  { type: "Sus2", formula: "1–2–5", notes: "B–C#–F#", symbol: "Bsus2" },
  { type: "Sus4", formula: "1–4–5", notes: "B–E–F#", symbol: "Bsus4" },
];

const seventhChords: Chord[] = [
  { type: "Dominant 7", formula: "1–3–5–♭7", notes: "B–D#–F#–A", symbol: "B7" },
  { type: "Major 7", formula: "1–3–5–7", notes: "B–D#–F#–A#", symbol: "Bmaj7" },
  { type: "Minor 7", formula: "1–♭3–5–♭7", notes: "B–D–F#–A", symbol: "Bm7" },
  {
    type: "Half-Diminished (m7♭5)",
    formula: "1–♭3–♭5–♭7",
    notes: "B–D–F–A",
    symbol: "Bm7♭5",
  },
  { type: "Diminished 7", formula: "1–♭3–♭5–𝄫7", notes: "B–D–F–A♭", symbol: "Bdim7" },
];

const extendedChords: Chord[] = [
  { type: "Major 6", formula: "1–3–5–6", notes: "B–D#–F#–G#", symbol: "B6" },
  { type: "Minor 6", formula: "1–♭3–5–6", notes: "B–D–F#–G#", symbol: "Bm6" },
  { type: "9", formula: "1–3–5–♭7–9", notes: "B–D#–F#–A–C#", symbol: "B9" },
  { type: "m9", formula: "1–♭3–5–♭7–9", notes: "B–D–F#–A–C#", symbol: "Bm9" },
  { type: "maj9", formula: "1–3–5–7–9", notes: "B–D#–F#–A#–C#", symbol: "Bmaj9" },
  { type: "11", formula: "1–3–5–♭7–9–11", notes: "B–D#–F#–A–C#–E", symbol: "B11" },
  { type: "13", formula: "1–3–5–♭7–9–13", notes: "B–D#–F#–A–C#–G#", symbol: "B13" },
];

const dissonantChords: Chord[] = [
  { type: "7♭9", formula: "1–3–5–♭7–♭9", notes: "B–D#–F#–A–C", symbol: "B7♭9" },
  { type: "7♯9", formula: "1–3–5–♭7–♯9", notes: "B–D#–F#–A–D", symbol: "B7♯9" },
  { type: "7♭5", formula: "1–3–♭5–♭7", notes: "B–D#–F–A", symbol: "B7♭5" },
  { type: "7♯5", formula: "1–3–♯5–♭7", notes: "B–D#–G–A", symbol: "B7♯5" },
  { type: "9♭5", formula: "1–3–♭5–♭7–9", notes: "B–D#–F–A–C#", symbol: "B9♭5" },
  { type: "9♯5", formula: "1–3–♯5–♭7–9", notes: "B–D#–G–A–C#", symbol: "B9♯5" },
  { type: "m7♭9", formula: "1–♭3–5–♭7–♭9", notes: "B–D–F#–A–C", symbol: "Bm7♭9" },
  {
    type: "dim7(add9)",
    formula: "1–♭3–♭5–𝄫7–9",
    notes: "B–D–F–A♭–C#",
    symbol: "Bdim7(add9)",
  },
];

function renderTable(data: Chord[]) {
  return (
    <table className="mb-6 min-w-full border-collapse text-sm md:text-base">
      <thead>
        <tr>
          <th className="border px-2 py-1 text-left">Chord Type</th>
          <th className="border px-2 py-1 text-left">Formula</th>
          <th className="border px-2 py-1 text-left">Notes in B</th>
          <th className="border px-2 py-1 text-left">Symbol</th>
        </tr>
      </thead>
      <tbody>
        {data.map((chord) => (
          <tr key={chord.type}>
            <td className="border px-2 py-1 font-medium">{chord.type}</td>
            <td className="border px-2 py-1">{chord.formula}</td>
            <td className="border px-2 py-1">{chord.notes}</td>
            <td className="border px-2 py-1">{chord.symbol}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function MetalChordsRootB() {
  return (
    <>
      {renderTable(basicChords)}
      <h2 className="mb-2 text-xl font-semibold">7th Chords</h2>
      {renderTable(seventhChords)}
      <h2 className="mb-2 text-xl font-semibold">6th &amp; Extended</h2>
      {renderTable(extendedChords)}
      <h2 className="mb-2 text-xl font-semibold">Extended / Dissonant (Metal-usable)</h2>
      {renderTable(dissonantChords)}
    </>
  );
}

