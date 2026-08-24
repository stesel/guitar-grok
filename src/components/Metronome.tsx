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
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isCountingIn, setIsCountingIn] = useState(false);
  const synthRef = useRef<Tone.Synth | null>(null);
  const lowRef = useRef<Tone.Synth | null>(null);
  const eventIdRef = useRef<number | null>(null);

  useEffect(() => {
    const high = new Tone.Synth({ oscillator: { type: "square" } }).toDestination();
    const low = new Tone.Synth({ oscillator: { type: "triangle" } }).toDestination();
    synthRef.current = high;
    lowRef.current = low;
    return () => {
      high.dispose();
      low.dispose();
      if (eventIdRef.current !== null) {
        Tone.Transport.clear(eventIdRef.current);
      }
      Tone.Transport.stop();
    };
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const start = async () => {
    if (isRunning || !synthRef.current || !lowRef.current) return;

    await Tone.start();
    const synth = synthRef.current;
    const low = lowRef.current;

    if (eventIdRef.current !== null) {
      Tone.Transport.clear(eventIdRef.current);
    }

    let barIndex = 0;
    let beatInBar = 0;
    let practiceStarted = countIn === 0;

    setIsRunning(true);
    setIsCountingIn(countIn > 0);
    setCurrentBeat(1);

    if (practiceStarted) onStart?.();

    eventIdRef.current = Tone.Transport.scheduleRepeat((time) => {
      const isDownbeat = beatInBar === 0;
      const note = isDownbeat ? "C6" : "G5";
      const s = isDownbeat ? synth : low;
      s.triggerAttackRelease(note, "16n", time);

      const displayedBeat = beatInBar + 1;
      Tone.getDraw().schedule(() => setCurrentBeat(displayedBeat), time);

      beatInBar = (beatInBar + 1) % 4;
      if (beatInBar === 0) barIndex += 1;
      if (!practiceStarted && barIndex >= countIn) {
        practiceStarted = true;
        Tone.getDraw().schedule(() => {
          setIsCountingIn(false);
          onStart?.();
        }, time);
      }
    }, "4n");

    Tone.Transport.start("+0.05");
  };

  const stop = () => {
    Tone.Transport.stop();
    if (eventIdRef.current !== null) {
      Tone.Transport.clear(eventIdRef.current);
      eventIdRef.current = null;
    }
    setIsRunning(false);
    setIsCountingIn(false);
    setCurrentBeat(0);
    onStop?.();
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-center gap-3" aria-label={isRunning ? `Beat ${currentBeat} of 4` : "Metronome stopped"}>
        {[1, 2, 3, 4].map((beat) => (
          <span
            key={beat}
            className={`h-4 w-4 rounded-full transition-colors ${
              currentBeat === beat ? "bg-amber-300" : "bg-white/20"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <p className="text-center text-sm text-white/75" aria-live="polite">
        {!isRunning ? "Ready" : isCountingIn ? `Count-in: ${countIn} bar${countIn === 1 ? "" : "s"}` : "Playing"}
      </p>

      {isRunning ? (
        <button
          type="button"
          onClick={stop}
          className="w-full rounded-xl bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Stop metronome
        </button>
      ) : (
        <button
          type="button"
          onClick={start}
          className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Start metronome
        </button>
      )}
    </div>
  );
}
