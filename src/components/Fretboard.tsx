"use client";

import React, { useMemo, useRef, useState } from "react";

const chromaticScale = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

type ScaleType = "major" | "minor" | "major-pentatonic" | "minor-pentatonic";

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

const FRET_WIDTH = 40;
const FRET_GAP = 1;
const LABEL_WIDTH = 60;
const BOARD_PADDING = 4; // matches tailwind p-1
const BOARD_HEIGHT = FRET_WIDTH * 6 + FRET_GAP * 5;
const singleInlays = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleInlays = [12, 24];

function fretCenter(fret: number): number {
  return (
    BOARD_PADDING +
    LABEL_WIDTH +
    fret * (FRET_WIDTH + FRET_GAP) +
    FRET_WIDTH / 2
  );
}

interface NoteInfo {
  string: number;
  fret: number;
  note: string;
  pitch: number;
}

// Helper: get MIDI number for a note and octave
function getMidiNumber(note: string, octave: number): number {
  const noteIdx = chromaticScale.indexOf(
    note as (typeof chromaticScale)[number]
  );
  return 12 * (octave + 1) + noteIdx;
}

// Helper: get frequency from MIDI number
function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Get note and octave at a given string/fret
function getNoteAndOctaveAtFret(
  openNote: string,
  openOctave: number,
  fret: number
): { note: string; octave: number; midi: number } {
  const openMidi = getMidiNumber(openNote, openOctave);
  const midi = openMidi + fret;
  const noteIdx = midi % 12;
  const note = chromaticScale[noteIdx];
  const octave = Math.floor(midi / 12) - 1;
  return { note, octave, midi };
}

function buildScale(root: string, type: ScaleType): string[] {
  let pattern: number[];
  switch (type) {
    case "major":
      pattern = [2, 2, 1, 2, 2, 2, 1];
      break;
    case "minor":
      pattern = [2, 1, 2, 2, 1, 2, 2];
      break;
    case "major-pentatonic":
      // Major pentatonic: 1, 2, 3, 5, 6 (intervals: 2, 2, 3, 2, 3)
      pattern = [2, 2, 3, 2, 3];
      break;
    case "minor-pentatonic":
      // Minor pentatonic: 1, b3, 4, 5, b7 (intervals: 3, 2, 2, 3, 2)
      pattern = [3, 2, 2, 3, 2];
      break;
    default:
      pattern = [2, 2, 1, 2, 2, 2, 1];
  }
  const scale: string[] = [root];
  let idx = chromaticScale.indexOf(root as (typeof chromaticScale)[number]);
  for (const step of pattern) {
    idx = (idx + step) % chromaticScale.length;
    scale.push(chromaticScale[idx]);
  }
  // For pentatonics, only 5 notes
  if (type === "major-pentatonic" || type === "minor-pentatonic") {
    return scale.slice(0, 5);
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
  const [current, setCurrent] = useState<{
    string: number;
    fret: number;
  } | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const scaleNotes = useMemo(
    () => buildScale(root, scaleType),
    [root, scaleType]
  );

  function initAudio() {
    if (audioRef.current || typeof window === "undefined") return;
    audioRef.current = new window.AudioContext();
  }

  function playSound(note: string, stringIdx: number, fret: number) {
    initAudio();
    const ctx = audioRef.current;
    if (!ctx) return;
    const { midi } = getNoteAndOctaveAtFret(
      tuning[stringIdx].note,
      tuning[stringIdx].octave,
      fret
    );
    const freq = midiToFrequency(midi);
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
        const { note, midi } = getNoteAndOctaveAtFret(s.note, s.octave, fret);
        if (scaleNotes.includes(note)) {
          const pitch = midiToFrequency(midi);
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
    <div className="w-full flex flex-col gap-2">
      {/* Title for Drop B tuning */}
      <h2 className="text-center text-2xl font-bold text-white mb-2">
        Drop B Tuning
      </h2>
      {/* Centered scrollable fretboard */}
      <div className="flex flex-col gap-3 justify-center w-full bg-white/10 backdrop-blur-md shadow-lg border border-white/20 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3 justify-center transition-all duration-300">
          <select
            value={root}
            onChange={(e) => setRoot(e.target.value)}
            className="border-none rounded-lg px-3 py-2 bg-white/20 text-white font-semibold shadow-inner focus:ring-2 focus:ring-green-400 transition"
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
            className="border-none rounded-lg px-3 py-2 bg-white/20 text-white font-semibold shadow-inner focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="major">Major</option>
            <option value="minor">Minor</option>
            <option value="major-pentatonic">Major Pentatonic</option>
            <option value="minor-pentatonic">Minor Pentatonic</option>
          </select>
          <button
            type="button"
            onClick={() => playSequence(true)}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg shadow-md font-bold hover:scale-105 hover:from-green-400 hover:to-green-600 transition-all duration-150"
          >
            Play Ascending
          </button>
          <button
            type="button"
            onClick={() => playSequence(false)}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg shadow-md font-bold hover:scale-105 hover:from-green-400 hover:to-green-600 transition-all duration-150"
          >
            Play Descending
          </button>
          <button
            type="button"
            onClick={stop}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-2 rounded-lg shadow-md font-bold hover:scale-105 hover:from-gray-500 hover:to-gray-700 transition-all duration-150"
          >
            Stop
          </button>
        </div>
        <div className="flex justify-center">
          <div className="overflow-x-auto">
            <div
              className="relative grid gap-px bg-gradient-to-r from-amber-900 to-amber-700 p-1 rounded-lg shadow-xl"
              style={{
                gridTemplateColumns: `60px repeat(25, ${FRET_WIDTH}px)`,
                gridTemplateRows: `repeat(6, ${FRET_WIDTH}px) ${FRET_WIDTH}px`,
                width: "fit-content",
              }}
            >
              {/* Strings and frets */}
              {tuning.map((s, stringIdx) => (
                <React.Fragment key={s.label}>
                  <div className="flex items-center justify-center bg-neutral-600 text-white text-sm font-semibold">
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
                        : "bg-amber-800/80 text-amber-200";
                    const borderClass = isOpen ? "border-r-4 border-white" : "";
                    return (
                      <div
                        key={`${stringIdx}-${fret}`}
                        className={`relative flex items-center justify-center text-xs cursor-pointer select-none transition-colors duration-100 rounded-sm shadow-inner ${colorClass} ${borderClass} hover:ring-amber-100 hover:ring`}
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
              {/* Fret numbers row at the bottom */}
              <div className="flex items-center justify-center bg-neutral-700 text-white text-xs font-bold border-neutral-200 border-t-4">
                Fret #
              </div>
              {Array.from({ length: 25 }).map((_, fret) => (
                <div
                  key={`fret-num-${fret}`}
                  className={`flex items-center justify-center bg-neutral-600 text-white text-xs font-bold border-neutral-200 border-t-4 ${
                    fret === 0 ? "border-r-4" : ""
                  }`}
                >
                  {fret}
                </div>
              ))}

              {singleInlays.map((fret) => (
                <div
                  key={`inlay-${fret}`}
                  className="pointer-events-none absolute w-3 h-3 rounded-full bg-white/30"
                  style={{
                    left: `${fretCenter(fret)}px`,
                    top: `${BOARD_PADDING + BOARD_HEIGHT / 2}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
              {doubleInlays.map((fret) => (
                <React.Fragment key={`inlay-double-${fret}`}>
                  <div
                    className="pointer-events-none absolute w-3 h-3 rounded-full bg-white/30"
                    style={{
                      left: `${fretCenter(fret)}px`,
                      top: `${BOARD_PADDING + BOARD_HEIGHT * 0.35}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute w-3 h-3 rounded-full bg-white/30"
                    style={{
                      left: `${fretCenter(fret)}px`,
                      top: `${BOARD_PADDING + BOARD_HEIGHT * 0.65}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
