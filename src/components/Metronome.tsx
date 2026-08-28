"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

interface MetronomeProps {
  bpm: number;
  countIn: number;
  numerator: number;
  denominator: number;
  onBeat?: (beat: number) => void;
  onStart?: () => void;
  onStop?: () => void;
}

export default function Metronome({
  bpm,
  countIn,
  numerator,
  denominator,
  onBeat,
  onStart,
  onStop,
}: MetronomeProps) {
  const [isRunning, setIsRunning] = useState(false);
  const clickRef = useRef<Tone.NoiseSynth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);
  const numeratorRef = useRef(numerator);
  const beatRef = useRef(0);
  const barRef = useRef(0);
  const practiceStartedRef = useRef(false);
  const onBeatRef = useRef(onBeat);
  const onStartRef = useRef(onStart);

  useEffect(() => {
    const clickFilter = new Tone.Filter({
      type: "bandpass",
      frequency: 1900,
      Q: 1.4,
    }).toDestination();
    const click = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.022, sustain: 0, release: 0.005 },
      volume: -8,
    }).connect(clickFilter);
    clickRef.current = click;
    return () => {
      loopRef.current?.dispose();
      click.dispose();
      clickFilter.dispose();
      Tone.Transport.stop();
    };
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    numeratorRef.current = numerator;
    beatRef.current = 0;
    barRef.current = 0;
  }, [numerator]);

  useEffect(() => {
    onBeatRef.current = onBeat;
    onStartRef.current = onStart;
  }, [onBeat, onStart]);

  useEffect(() => {
    if (!loopRef.current) return;
    const ticksPerBeat = Math.max(1, Math.round((Tone.Transport.PPQ * 4) / denominator));
    loopRef.current.interval = `${ticksPerBeat}i`;
    beatRef.current = 0;
    barRef.current = 0;
  }, [denominator]);

  const start = async () => {
    if (isRunning || !clickRef.current) return;

    await Tone.start();
    const click = clickRef.current;
    const ticksPerBeat = Math.max(1, Math.round((Tone.Transport.PPQ * 4) / denominator));

    loopRef.current?.dispose();
    beatRef.current = 0;
    barRef.current = 0;
    practiceStartedRef.current = countIn === 0;
    setIsRunning(true);
    if (practiceStartedRef.current) onStart?.();

    loopRef.current = new Tone.Loop((time) => {
      const displayedBeat = beatRef.current + 1;
      const velocity = displayedBeat === 1 ? 1 : 0.55;
      click.triggerAttackRelease("32n", time, velocity);

      Tone.getDraw().schedule(() => onBeatRef.current?.(displayedBeat), time);
      beatRef.current = (beatRef.current + 1) % numeratorRef.current;
      if (beatRef.current === 0) barRef.current += 1;
      if (!practiceStartedRef.current && barRef.current >= countIn) {
        practiceStartedRef.current = true;
        Tone.getDraw().schedule(() => {
          onStartRef.current?.();
        }, time);
      }
    }, `${ticksPerBeat}i`).start(0);

    Tone.Transport.position = 0;
    Tone.Transport.start("+0.05");
  };

  const stop = () => {
    loopRef.current?.stop();
    loopRef.current?.dispose();
    loopRef.current = null;
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    setIsRunning(false);
    onBeat?.(0);
    onStop?.();
  };

  return (
    <div>
      {isRunning ? (
        <button
          type="button"
          onClick={stop}
          className="w-full rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          ■ Stop
        </button>
      ) : (
        <button
          type="button"
          onClick={start}
          className="w-full rounded-xl bg-amber-300 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          ▶ Start
        </button>
      )}
    </div>
  );
}
