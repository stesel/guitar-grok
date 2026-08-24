"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Metronome = dynamic(() => import("@/src/components/Metronome"), {
  ssr: false,
  loading: () => <div className="h-32 animate-pulse rounded-xl bg-white/10" aria-label="Loading metronome" />,
});

const MIN_BPM = 30;
const MAX_BPM = 240;

export default function MetronomePage() {
  const [bpm, setBpm] = useState(120);
  const [countIn, setCountIn] = useState(1);

  const changeBpm = (amount: number) => {
    setBpm((current) => Math.min(MAX_BPM, Math.max(MIN_BPM, current + amount)));
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Metronome</h1>
        <p className="mt-2 text-white/75">Keep your riffs tight and your practice honest.</p>
      </div>

      <section className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur sm:p-8">
        <div className="mb-8">
          <label htmlFor="tempo" className="block text-center text-sm font-medium text-white/75">
            Tempo
          </label>
          <div className="mt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => changeBpm(-5)}
              className="h-12 w-12 rounded-xl bg-white/10 text-xl hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Decrease tempo by 5 BPM"
            >
              −
            </button>
            <div className="min-w-32 text-center">
              <input
                id="tempo"
                type="number"
                min={MIN_BPM}
                max={MAX_BPM}
                value={bpm}
                onChange={(event) => setBpm(Math.min(MAX_BPM, Math.max(MIN_BPM, Number(event.target.value))))}
                className="w-24 rounded-lg border border-white/20 bg-slate-900/40 px-2 py-1 text-center text-4xl font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              />
              <span className="ml-2 text-sm text-white/70">BPM</span>
            </div>
            <button
              type="button"
              onClick={() => changeBpm(5)}
              className="h-12 w-12 rounded-xl bg-white/10 text-xl hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Increase tempo by 5 BPM"
            >
              +
            </button>
          </div>
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onChange={(event) => setBpm(Number(event.target.value))}
            className="mt-5 w-full accent-amber-300"
            aria-label="Tempo in BPM"
          />
        </div>

        <div className="mb-8">
          <label htmlFor="count-in" className="mb-2 block text-sm font-medium text-white/75">
            Count-in
          </label>
          <select
            id="count-in"
            value={countIn}
            onChange={(event) => setCountIn(Number(event.target.value))}
            className="w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <option value={0}>Off</option>
            <option value={1}>1 bar</option>
            <option value={2}>2 bars</option>
            <option value={4}>4 bars</option>
          </select>
        </div>

        <Metronome bpm={bpm} countIn={countIn} />
      </section>
    </main>
  );
}
