"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

interface MetronomeProps {
  bpm: number;
  countIn: number;
  onStart?: () => void;
  onStop?: () => void;
}

export default function Metronome({ bpm, countIn, onStart, onStop }: MetronomeProps) {
  const [isRunning, setIsRunning] = useState(false);
  const synthRef = useRef<Tone.Synth | null>(null);
  const lowRef = useRef<Tone.Synth | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const high = new Tone.Synth({ oscillator: { type: "square" } }).toDestination();
    const low = new Tone.Synth({ oscillator: { type: "triangle" } }).toDestination();
    synthRef.current = high;
    lowRef.current = low;
    return () => {
      high.dispose();
      low.dispose();
      Tone.Transport.cancel(0);
      Tone.Transport.stop();
    };
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const scheduleClick = async () => {
    await Tone.start();
    const synth = synthRef.current!;
    const low = lowRef.current!;
    Tone.Transport.cancel(0);

    let barIndex = 0;
    let beatInBar = 0;

    Tone.Transport.scheduleRepeat((time) => {
      const isDownbeat = beatInBar === 0;
      const note = isDownbeat ? "C6" : "G5";
      const s = isDownbeat ? synth : low;
      s.triggerAttackRelease(note, "16n", time);

      beatInBar = (beatInBar + 1) % 4;
      if (beatInBar === 0) barIndex += 1;
      if (!startedRef.current && countIn > 0 && barIndex >= countIn) {
        startedRef.current = true;
        onStart?.();
      }
    }, "4n");

    Tone.Transport.start();
  };

  const start = async () => {
    if (isRunning) return;
    await scheduleClick();
    setIsRunning(true);
    onStart?.();
  };

  const stop = () => {
    Tone.Transport.stop();
    setIsRunning(false);
    startedRef.current = false;
    onStop?.();
  };

  return (
    <div className="flex items-center gap-2">
      {isRunning ? (
        <button onClick={stop} className="px-4 py-2 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700">Stop</button>
      ) : (
        <button onClick={start} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700">Start</button>
      )}
    </div>
  );
}
