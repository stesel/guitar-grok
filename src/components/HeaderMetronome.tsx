"use client";

import { useEffect, useRef, useState } from "react";
import Metronome from "./Metronome";

const STORAGE_KEY = "guitar-grok-metronome";
const DEFAULT_BPM = 120;
const DEFAULT_NUMERATOR = 4;
const DEFAULT_DENOMINATOR = 4;
const MAX_VISIBLE_BEATS = 16;

interface StoredSettings {
  bpm: number;
  numerator: number;
  denominator: number;
  increment: number;
}

function positiveInteger(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.round(parsed) : fallback;
}

function signedInteger(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : fallback;
}

export default function HeaderMetronome() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [numerator, setNumerator] = useState(DEFAULT_NUMERATOR);
  const [denominator, setDenominator] = useState(DEFAULT_DENOMINATOR);
  const [increment, setIncrement] = useState(0);
  const [bpmInput, setBpmInput] = useState(String(DEFAULT_BPM));
  const [numeratorInput, setNumeratorInput] = useState(String(DEFAULT_NUMERATOR));
  const [denominatorInput, setDenominatorInput] = useState(String(DEFAULT_DENOMINATOR));
  const [incrementInput, setIncrementInput] = useState("0");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const settings = JSON.parse(stored) as Partial<StoredSettings>;
        const storedBpm = positiveInteger(String(settings.bpm), DEFAULT_BPM);
        const storedNumerator = positiveInteger(String(settings.numerator), DEFAULT_NUMERATOR);
        const storedDenominator = positiveInteger(String(settings.denominator), DEFAULT_DENOMINATOR);
        const storedIncrement = signedInteger(String(settings.increment), 0);
        setBpm(storedBpm);
        setNumerator(storedNumerator);
        setDenominator(storedDenominator);
        setIncrement(storedIncrement);
        setBpmInput(String(storedBpm));
        setNumeratorInput(String(storedNumerator));
        setDenominatorInput(String(storedDenominator));
        setIncrementInput(String(storedIncrement));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ bpm, numerator, denominator, increment }));
  }, [bpm, numerator, denominator, increment, settingsLoaded]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [isOpen]);

  const commitBpm = () => {
    const next = positiveInteger(bpmInput, bpm);
    setBpm(next);
    setBpmInput(String(next));
  };

  const commitNumerator = () => {
    const next = positiveInteger(numeratorInput, numerator);
    setNumerator(next);
    setNumeratorInput(String(next));
  };

  const commitDenominator = () => {
    const next = positiveInteger(denominatorInput, denominator);
    setDenominator(next);
    setDenominatorInput(String(next));
  };

  const commitIncrement = () => {
    const next = signedInteger(incrementInput, increment);
    setIncrement(next);
    setIncrementInput(String(next));
  };

  const stopMetronome = () => {
    setIsRunning(false);
    setCurrentBeat(0);
    const appliedIncrement = signedInteger(incrementInput, increment);
    setIncrement(appliedIncrement);
    setIncrementInput(String(appliedIncrement));
    if (appliedIncrement === 0) return;

    setBpm((current) => {
      const next = Math.max(1, current + appliedIncrement);
      setBpmInput(String(next));
      return next;
    });
  };

  const visibleBeats = Math.min(numerator, MAX_VISIBLE_BEATS);

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
          isRunning ? "border-amber-300/70 bg-amber-300 text-slate-950" : "border-white/20 bg-white/10 hover:bg-white/20"
        }`}
        aria-expanded={isOpen}
        aria-controls="global-metronome-panel"
      >
        <span aria-hidden="true">{isRunning ? "●" : "♪"}</span>
        <span>{bpm} BPM</span>
        <span className={isRunning ? "text-slate-700" : "text-white/60"}>{numerator}/{denominator}</span>
      </button>

      <section
        id="global-metronome-panel"
        aria-label="Metronome settings"
        aria-hidden={!isOpen}
        className={`fixed left-1/2 top-[4.75rem] w-[min(23rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-white/20 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-xl sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+0.75rem)] sm:translate-x-0 ${
          isOpen ? "block" : "hidden"
        }`}
      >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Metronome</h2>
            <span className="text-sm text-white/60" aria-live="polite">
              {isRunning ? `Beat ${currentBeat} of ${numerator}` : "Ready"}
            </span>
          </div>

          <div className="grid grid-cols-2 items-end gap-4">
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-white/75">Time signature</legend>
              <div className="flex items-center gap-2">
                <label className="sr-only" htmlFor="metronome-numerator">Beats per bar</label>
                <input
                  id="metronome-numerator"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={numeratorInput}
                  onChange={(event) => setNumeratorInput(event.target.value)}
                  onBlur={commitNumerator}
                  onKeyDown={(event) => event.key === "Enter" && commitNumerator()}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-center text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
                />
                <span aria-hidden="true" className="text-xl text-white/50">/</span>
                <label className="sr-only" htmlFor="metronome-denominator">Beat note value</label>
                <input
                  id="metronome-denominator"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={denominatorInput}
                  onChange={(event) => setDenominatorInput(event.target.value)}
                  onBlur={commitDenominator}
                  onKeyDown={(event) => event.key === "Enter" && commitDenominator()}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-center text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
                />
              </div>
            </fieldset>

            <div>
              <label htmlFor="metronome-increment" className="mb-2 block text-sm font-medium text-white/75">
                Increment ±
              </label>
              <div className="relative">
                <input
                  id="metronome-increment"
                  type="number"
                  inputMode="numeric"
                  value={incrementInput}
                  onChange={(event) => setIncrementInput(event.target.value)}
                  onBlur={commitIncrement}
                  onKeyDown={(event) => event.key === "Enter" && commitIncrement()}
                  className="w-full rounded-lg border border-white/20 bg-white/10 py-2 pl-3 pr-12 text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50">BPM</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="metronome-tempo" className="mb-2 block text-sm font-medium text-white/75">Tempo</label>
            <div className="relative">
              <input
                id="metronome-tempo"
                type="number"
                inputMode="numeric"
                min="1"
                value={bpmInput}
                onChange={(event) => setBpmInput(event.target.value)}
                onBlur={commitBpm}
                onKeyDown={(event) => event.key === "Enter" && commitBpm()}
                className="w-full rounded-lg border border-white/20 bg-white/10 py-2 pl-3 pr-12 text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50">BPM</span>
            </div>
          </div>

          <div
            className="my-5 flex min-h-8 items-center overflow-hidden rounded-lg border border-white/20 bg-white/5"
            aria-label={numerator > MAX_VISIBLE_BEATS ? `Showing ${MAX_VISIBLE_BEATS} of ${numerator} beats` : `${numerator} beats per bar`}
          >
            {Array.from({ length: visibleBeats }, (_, index) => index + 1).map((beat) => (
              <span
                key={beat}
                aria-hidden="true"
                className={`h-8 min-w-2 flex-1 border-r border-white/20 transition-colors last:border-r-0 ${
                  isRunning && currentBeat === beat
                    ? beat === 1 ? "bg-amber-300" : "bg-indigo-400"
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>

          <Metronome
            bpm={bpm}
            countIn={0}
            numerator={numerator}
            denominator={denominator}
            onBeat={setCurrentBeat}
            onStart={() => setIsRunning(true)}
            onStop={stopMetronome}
          />
      </section>
    </div>
  );
}
