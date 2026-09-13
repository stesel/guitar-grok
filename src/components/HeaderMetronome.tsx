"use client";

import { useEffect, useRef, useState } from "react";
import Metronome from "./Metronome";
import { PREPARE_EXERCISE_EVENT, type StartExerciseDetail } from "@/src/lib/metronomeEvents";
import { appendPracticeRecord, type PracticeRecord } from "@/src/lib/practiceHistory";

const STORAGE_KEY = "guitar-grok-metronome";
const DEFAULT_BPM = 120;
const DEFAULT_NUMERATOR = 4;
const DEFAULT_DENOMINATOR = 4;
const DEFAULT_TIMER_MINUTES = 5;
const TIMER_PRESETS = [1, 3, 5, 10] as const;
const MAX_VISIBLE_BEATS = 16;

interface StoredSettings {
  bpm: number;
  numerator: number;
  denominator: number;
  increment: number;
  timerMinutes: number;
}

interface ActivePracticeSession {
  exercise: StartExerciseDetail;
  startedAt: number;
  bpm: number;
}

function positiveInteger(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.round(parsed) : fallback;
}

function signedInteger(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : fallback;
}

function formatTimer(seconds: number) {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
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
  const [timerMinutes, setTimerMinutes] = useState(DEFAULT_TIMER_MINUTES);
  const [timerMinutesInput, setTimerMinutesInput] = useState(String(DEFAULT_TIMER_MINUTES));
  const [timerRemaining, setTimerRemaining] = useState(DEFAULT_TIMER_MINUTES * 60);
  const [timerEndAt, setTimerEndAt] = useState<number | null>(null);
  const [timerState, setTimerState] = useState<"ready" | "running" | "paused" | "complete">("ready");
  const [activeExercise, setActiveExercise] = useState<StartExerciseDetail | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(false);
  const pendingExerciseRef = useRef<StartExerciseDetail | null>(null);
  const practiceSessionRef = useRef<ActivePracticeSession | null>(null);
  const timerAudioContextRef = useRef<AudioContext | null>(null);

  const playCompletionChime = () => {
    const AudioContextConstructor = window.AudioContext;
    const audioContext = timerAudioContextRef.current ?? new AudioContextConstructor();
    timerAudioContextRef.current = audioContext;
    const startAt = audioContext.currentTime;
    [659.25, 783.99, 1046.5].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const noteStart = startAt + index * 0.16;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.28, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.35);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + 0.36);
    });
  };

  useEffect(() => {
    const selectExercise = (event: Event) => {
      if (isRunningRef.current) return;
      const { detail } = event as CustomEvent<StartExerciseDetail>;
      pendingExerciseRef.current = detail;
      setActiveExercise(detail);
      setIsOpen(true);
    };
    window.addEventListener(PREPARE_EXERCISE_EVENT, selectExercise);
    return () => window.removeEventListener(PREPARE_EXERCISE_EVENT, selectExercise);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const settings = JSON.parse(stored) as Partial<StoredSettings>;
        const storedBpm = positiveInteger(String(settings.bpm), DEFAULT_BPM);
        const storedNumerator = positiveInteger(String(settings.numerator), DEFAULT_NUMERATOR);
        const storedDenominator = positiveInteger(String(settings.denominator), DEFAULT_DENOMINATOR);
        const storedIncrement = signedInteger(String(settings.increment), 0);
        const storedTimerMinutes = positiveInteger(String(settings.timerMinutes), DEFAULT_TIMER_MINUTES);
        setBpm(storedBpm);
        setNumerator(storedNumerator);
        setDenominator(storedDenominator);
        setIncrement(storedIncrement);
        setBpmInput(String(storedBpm));
        setNumeratorInput(String(storedNumerator));
        setDenominatorInput(String(storedDenominator));
        setIncrementInput(String(storedIncrement));
        setTimerMinutes(storedTimerMinutes);
        setTimerMinutesInput(String(storedTimerMinutes));
        setTimerRemaining(storedTimerMinutes * 60);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ bpm, numerator, denominator, increment, timerMinutes }));
  }, [bpm, numerator, denominator, increment, timerMinutes, settingsLoaded]);

  useEffect(() => {
    if (timerState !== "running" || timerEndAt === null) return;

    const updateRemaining = () => {
      const nextRemaining = Math.max(0, (timerEndAt - Date.now()) / 1_000);
      setTimerRemaining(nextRemaining);
      if (nextRemaining > 0) return;
      setTimerEndAt(null);
      setTimerState("complete");
      playCompletionChime();
    };

    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 250);
    return () => window.clearInterval(intervalId);
  }, [timerEndAt, timerState]);

  useEffect(() => () => {
    void timerAudioContextRef.current?.close();
  }, []);

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

  const selectTimerDuration = (minutes: number) => {
    if (timerState === "running") return;
    setTimerMinutes(minutes);
    setTimerMinutesInput(String(minutes));
    setTimerRemaining(minutes * 60);
    setTimerState("ready");
  };

  const commitTimerMinutes = () => {
    const next = positiveInteger(timerMinutesInput, timerMinutes);
    selectTimerDuration(next);
  };

  const startTimer = () => {
    if (timerState === "running") return;
    const duration = timerState === "paused" ? timerRemaining : timerMinutes * 60;
    const audioContext = timerAudioContextRef.current ?? new window.AudioContext();
    timerAudioContextRef.current = audioContext;
    if (audioContext.state === "suspended") void audioContext.resume();
    setTimerRemaining(duration);
    setTimerEndAt(Date.now() + duration * 1_000);
    setTimerState("running");
  };

  const pauseTimer = () => {
    if (timerState !== "running" || timerEndAt === null) return;
    setTimerRemaining(Math.max(0, (timerEndAt - Date.now()) / 1_000));
    setTimerEndAt(null);
    setTimerState("paused");
  };

  const resetTimer = () => {
    setTimerEndAt(null);
    setTimerRemaining(timerMinutes * 60);
    setTimerState("ready");
  };

  const stopMetronome = () => {
    const session = practiceSessionRef.current;
    practiceSessionRef.current = null;
    pendingExerciseRef.current = null;
    isRunningRef.current = false;
    setIsRunning(false);
    setCurrentBeat(0);
    if (session) {
      const durationMilliseconds = Date.now() - session.startedAt;
      if (durationMilliseconds >= 2_000) {
        const record: PracticeRecord = {
          id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `practice-${session.startedAt}-${Math.random().toString(36).slice(2)}`,
          exerciseId: session.exercise.exerciseId,
          exerciseTitle: session.exercise.exerciseTitle,
          lessonSlug: session.exercise.lessonSlug,
          lessonTitle: session.exercise.lessonTitle,
          startedAt: new Date(session.startedAt).toISOString(),
          durationSeconds: Math.max(2, Math.round(durationMilliseconds / 1_000)),
          bpm: session.bpm,
        };
        appendPracticeRecord(record);
      }
    }
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

  const startMetronome = () => {
    isRunningRef.current = true;
    setIsRunning(true);
    const exercise = pendingExerciseRef.current;
    pendingExerciseRef.current = null;
    if (!exercise) setActiveExercise(null);
    practiceSessionRef.current = exercise
      ? { exercise, startedAt: Date.now(), bpm }
      : null;
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
        {timerState === "running" && (
          <span className={isRunning ? "text-slate-700" : "text-amber-200"}>{formatTimer(timerRemaining)}</span>
        )}
      </button>

      <section
        id="global-metronome-panel"
        aria-label="Metronome settings"
        aria-hidden={!isOpen}
        className={`fixed left-1/2 top-[4.75rem] w-[min(23rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-white/20 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-xl sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+0.75rem)] sm:translate-x-0 ${
          isOpen ? "block" : "hidden"
        }`}
      >
          <div className="mb-5 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Metronome</h2>
              <span className="shrink-0 whitespace-nowrap text-sm text-white/60" aria-live="polite">
                {isRunning ? `Beat ${currentBeat} of ${numerator}` : "Ready"}
              </span>
            </div>
            {activeExercise && (
              <p className="mt-1 truncate text-sm text-amber-200" title={activeExercise.exerciseTitle}>
                {activeExercise.exerciseTitle}
              </p>
            )}
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
            onStart={startMetronome}
            onStop={stopMetronome}
          />

          <div className="mt-5 border-t border-white/20 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white/75">Training Timer</h3>
              <span className="text-xs text-white/50" aria-live="polite">
                {timerState === "running" ? "Running" : timerState === "paused" ? "Paused" : timerState === "complete" ? "Complete" : "Ready"}
              </span>
            </div>

            <div className="my-4 text-center font-mono text-4xl font-semibold tabular-nums" aria-live="off">
              {formatTimer(timerRemaining)}
            </div>

            <div className="grid grid-cols-4 gap-2" aria-label="Timer presets">
              {TIMER_PRESETS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  disabled={timerState === "running"}
                  onClick={() => selectTimerDuration(minutes)}
                  className={`min-h-10 cursor-pointer rounded-lg border px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                    timerMinutes === minutes ? "border-amber-300 bg-amber-300 text-slate-950" : "border-white/20 bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {minutes}m
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-end gap-3">
              <div className="min-w-0 flex-1">
                <label htmlFor="training-timer-minutes" className="mb-1 block text-xs text-white/60">Custom minutes</label>
                <input
                  id="training-timer-minutes"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  disabled={timerState === "running"}
                  value={timerMinutesInput}
                  onChange={(event) => setTimerMinutesInput(event.target.value)}
                  onBlur={commitTimerMinutes}
                  onKeyDown={(event) => event.key === "Enter" && commitTimerMinutes()}
                  className="min-h-10 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {timerState === "running" ? (
                <button type="button" onClick={pauseTimer} className="min-h-10 cursor-pointer rounded-lg bg-amber-300 px-4 py-2 font-semibold text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  Pause
                </button>
              ) : (
                <button type="button" onClick={startTimer} className="min-h-10 cursor-pointer rounded-lg bg-amber-300 px-4 py-2 font-semibold text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  {timerState === "paused" ? "Resume" : timerState === "complete" ? "Restart" : "Start timer"}
                </button>
              )}
              <button type="button" onClick={resetTimer} disabled={timerState === "ready"} className="min-h-10 cursor-pointer rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-semibold hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50">
                Reset
              </button>
            </div>
          </div>
      </section>
    </div>
  );
}
