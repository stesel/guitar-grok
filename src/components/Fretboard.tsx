"use client";

import React, { useMemo, useRef, useState } from "react";

const chromaticScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

const noteFrequencies: Record<string, number> = {
  C: 261.63,
  "C#": 277.18,
  D: 293.66,
  "D#": 311.13,
  E: 329.63,
  F: 349.23,
  "F#": 369.99,
  G: 392.0,
  "G#": 415.3,
  A: 440.0,
  "A#": 466.16,
  B: 493.88,
};

type ScaleType = "major" | "minor";

interface StringSpec {
  note: string;
  octave: number;
  label: string;
}

const tuning: StringSpec[] = [
  { note: "C#", octave: 4, label: "1: C#4" },
  { note: "G#", octave: 3, label: "2: G#3" },
  { note: "E", octave: 3, label: "3: E3" },
  { note: "B", octave: 2, label: "4: B2" },
  { note: "F#", octave: 2, label: "5: F#2" },
  { note: "B", octave: 1, label: "6: B1" },
];

interface NoteInfo {
  string: number;
  fret: number;
  note: string;
  pitch: number;
}

function getFrequency(note: string, octave: number): number {
  return noteFrequencies[note] * Math.pow(2, octave - 4);
}

function buildScale(root: string, type: ScaleType): string[] {
  const pattern = type === "major" ? [2, 2, 1, 2, 2, 2, 1] : [2, 1, 2, 2, 1, 2, 2];
  const scale: string[] = [root];
  let idx = chromaticScale.indexOf(root as (typeof chromaticScale)[number]);
  for (const step of pattern) {
    idx = (idx + step) % chromaticScale.length;
    scale.push(chromaticScale[idx]);
  }
  return scale.slice(0, 7);
}

function getNoteAtFret(open: string, fret: number): string {
  const idx = chromaticScale.indexOf(open as (typeof chromaticScale)[number]);
  return chromaticScale[(idx + fret) % chromaticScale.length];
}

export default function Fretboard() {
  const [root, setRoot] = useState<string>("E");
  const [scaleType, setScaleType] = useState<ScaleType>("minor");
  const [current, setCurrent] = useState<{ string: number; fret: number } | null>(
    null,
  );
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const scaleNotes = useMemo(() => buildScale(root, scaleType), [root, scaleType]);

  function initAudio() {
    if (audioRef.current || typeof window === "undefined") return;
    audioRef.current = new window.AudioContext();
  }

  function playSound(note: string, stringIdx: number, fret: number) {
    initAudio();
    const ctx = audioRef.current;
    if (!ctx) return;
    const octave = tuning[stringIdx]?.octave + Math.floor(fret / 12);
    const freq = getFrequency(note, octave);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  }

  function generateSequence(ascending: boolean): NoteInfo[] {
    const notes: NoteInfo[] = [];
    tuning.forEach((s, stringIdx) => {
      for (let fret = 0; fret <= 24; fret++) {
        const note = getNoteAtFret(s.note, fret);
        if (scaleNotes.includes(note)) {
          const octave = s.octave + Math.floor(fret / 12);
          const pitch = getFrequency(note, octave);
          notes.push({ string: stringIdx, fret, note, pitch });
        }
      }
    });
    notes.sort((a, b) => (ascending ? a.pitch - b.pitch : b.pitch - a.pitch));
    return notes;
  }

  function stop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrent(null);
  }

  function playSequence(ascending: boolean) {
    stop();
    const seq = generateSequence(ascending);
    let idx = 0;
    intervalRef.current = window.setInterval(() => {
      const n = seq[idx];
      if (!n) {
        stop();
        return;
      }
      playSound(n.note, n.string, n.fret);
      setCurrent({ string: n.string, fret: n.fret });
      idx += 1;
    }, 500);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={root}
          onChange={(e) => setRoot(e.target.value)}
          className="border rounded p-2 text-black"
        >
          {chromaticScale.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          value={scaleType}
          onChange={(e) => setScaleType(e.target.value as ScaleType)}
          className="border rounded p-2 text-black"
        >
          <option value="major">Major</option>
          <option value="minor">Minor</option>
        </select>
        <button
          type="button"
          onClick={() => playSequence(true)}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Play Ascending
        </button>
        <button
          type="button"
          onClick={() => playSequence(false)}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Play Descending
        </button>
        <button
          type="button"
          onClick={stop}
          className="bg-gray-600 text-white px-3 py-2 rounded"
        >
          Stop
        </button>
      </div>
      <div className="overflow-x-auto">
        <div
          className="grid gap-px bg-[#2c1810] p-3 rounded"
          style={{
            gridTemplateColumns: "60px repeat(25, 40px)",
            gridTemplateRows: "repeat(6, 40px)",
          }}
        >
          {tuning.map((s, stringIdx) => (
            <React.Fragment key={s.label}>
              <div className="flex items-center justify-center bg-neutral-800 text-white text-sm font-semibold">
                {s.label}
              </div>
              {Array.from({ length: 25 }).map((_, fret) => {
                const note = getNoteAtFret(s.note, fret);
                const inScale = scaleNotes.includes(note);
                const isCurrent =
                  current?.string === stringIdx && current?.fret === fret;
                const isOpen = fret === 0;
                const colorClass =
                  isCurrent && inScale
                    ? "bg-green-600 text-white font-semibold"
                    : isCurrent
                    ? "bg-orange-500 text-white"
                    : inScale
                    ? "bg-green-500 text-white font-semibold"
                    : isOpen
                    ? "bg-neutral-300 text-black font-semibold"
                    : "bg-amber-600 text-gray-700";
                return (
                  <div
                    key={`${stringIdx}-${fret}`}
                    className={`flex items-center justify-center text-xs cursor-pointer select-none ${colorClass} ${isOpen ? "border-r-4 border-neutral-800" : ""}`}
                    onClick={() => {
                      playSound(note, stringIdx, fret);
                      setCurrent({ string: stringIdx, fret });
                    }}
                  >
                    {note}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

