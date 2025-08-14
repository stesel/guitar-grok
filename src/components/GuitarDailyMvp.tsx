"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Attempt,
  AttemptStatus,
  Exercise,
  Session,
  computeStreak,
  generateSession,
  loadLS,
  saveLS,
  seedExercises,
  LS_KEYS,
} from "@/utils/guitar";
import Metronome from "./Metronome";

export default function GuitarDailyMvp() {
  const [exercises, setExercises] = useState<Exercise[]>(() => loadLS(LS_KEYS.exercises, seedExercises));
  const [attempts, setAttempts] = useState<Attempt[]>(() => loadLS(LS_KEYS.attempts, [] as Attempt[]));
  const [sessions, setSessions] = useState<Session[]>(() => loadLS(LS_KEYS.sessions, [] as Session[]));
  const [length, setLength] = useState(30);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bpm, setBpm] = useState(90);
  const [countIn, setCountIn] = useState(1);

  const streak = useMemo(() => computeStreak(attempts), [attempts]);

  useEffect(() => saveLS(LS_KEYS.exercises, exercises), [exercises]);
  useEffect(() => saveLS(LS_KEYS.attempts, attempts), [attempts]);
  useEffect(() => saveLS(LS_KEYS.sessions, sessions), [sessions]);

  const activeExercise: Exercise | null = useMemo(() => {
    if (!currentSession) return null;
    const item = currentSession.items[activeIndex];
    if (!item) return null;
    return exercises.find((e) => e.id === item.exerciseId) || null;
  }, [currentSession, activeIndex, exercises]);

  function addExercise(partial: Partial<Exercise>) {
    const ex: Exercise = {
      id: partial.id || Math.random().toString(),
      title: partial.title?.trim() || "Untitled Exercise",
      bpmMin: partial.bpmMin ?? 60,
      bpmMax: partial.bpmMax ?? 120,
      key: partial.key || "C",
      estMinutes: partial.estMinutes ?? 3,
      difficulty: (partial.difficulty as any) || "easy",
      notes: partial.notes || "",
      tags: partial.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setExercises((prev) => [ex, ...prev]);
  }

  function startSession() {
    const sess = generateSession(exercises, length);
    setCurrentSession(sess);
    setSessions((prev) => [sess, ...prev]);
    setActiveIndex(0);
    const first = exercises.find((e) => e.id === sess.items[0]?.exerciseId);
    if (first) setBpm(Math.round((first.bpmMin + first.bpmMax) / 2));
  }

  function nextExercise() {
    setActiveIndex((i) => Math.min(i + 1, (currentSession?.items.length || 1) - 1));
  }

  function prevExercise() {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }

  function logAttempt(status: AttemptStatus) {
    if (!activeExercise) return;
    const a: Attempt = {
      id: Math.random().toString(),
      exerciseId: activeExercise.id,
      bpmUsed: bpm,
      status,
      timestamp: new Date().toISOString(),
    };
    setAttempts((prev) => [a, ...prev]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">G</span>
            <div>
              <div className="text-lg font-semibold">Guitar Daily</div>
              <div className="text-xs text-slate-500">Create · Schedule · Practice</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="hidden md:block">Streak: <span className="font-semibold">{streak.current}</span> (best {streak.best})</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-slate-200">
            <div className="p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">Length</label>
                  <select value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="border rounded-lg px-2 py-1">
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                  </select>
                </div>
                <button onClick={startSession} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700">Start Session</button>
                {currentSession && (
                  <div className="text-sm text-slate-600">{currentSession.items.length} items · planned {currentSession.totalPlanned} min</div>
                )}
              </div>

              {currentSession && (
                <div className="mt-4 grid md:grid-cols-3 gap-3">
                  {currentSession.items.map((it, idx) => {
                    const ex = exercises.find((e) => e.id === it.exerciseId);
                    if (!ex) return null;
                    const active = idx === activeIndex;
                    return (
                      <button key={idx} onClick={() => setActiveIndex(idx)} className={`text-left p-3 rounded-xl border hover:bg-slate-50 ${active ? "border-indigo-400 ring-2 ring-indigo-200" : "border-slate-200"}`}>
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{ex.title}</div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{ex.key} · {ex.bpmMin}-{ex.bpmMax} BPM · {it.plannedMinutes} min</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-slate-200">
            <div className="p-4">
              {activeExercise ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">{activeExercise.title}</div>
                      <div className="text-sm text-slate-500">Key {activeExercise.key} · {activeExercise.bpmMin}-{activeExercise.bpmMax} BPM</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={prevExercise} className="px-3 py-2 rounded-lg border hover:bg-slate-50">Prev</button>
                      <Metronome bpm={bpm} countIn={countIn} />
                      <button onClick={nextExercise} className="px-3 py-2 rounded-lg border hover:bg-slate-50">Next</button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 p-4 rounded-xl border bg-white">
                      <div className="text-sm text-slate-600">Tempo: <span className="font-semibold">{bpm} BPM</span></div>
                      <input type="range" min={activeExercise.bpmMin} max={activeExercise.bpmMax} value={bpm} onChange={(e) => setBpm(parseInt(e.target.value))} className="w-full" />
                      <div className="flex items-center gap-3 text-sm mt-2">
                        <label className="text-slate-600">Count-in</label>
                        <select value={countIn} onChange={(e) => setCountIn(parseInt(e.target.value))} className="border rounded px-2 py-1">
                          <option value={0}>None</option>
                          <option value={1}>1 bar</option>
                          <option value={2}>2 bars</option>
                          <option value={4}>4 bars</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button onClick={() => logAttempt("done")} className="w-full px-3 py-2 rounded-lg bg-emerald-600 text-white">Mark Done</button>
                      <button onClick={() => logAttempt("partial")} className="w-full px-3 py-2 rounded-lg bg-amber-500 text-white">Needs Work</button>
                      <button onClick={() => logAttempt("fail")} className="w-full px-3 py-2 rounded-lg bg-rose-600 text-white">Couldn't Play</button>
                    </div>
                  </div>

                  {activeExercise.notes && (
                    <div className="text-sm text-slate-600 bg-white p-3 rounded-xl border">{activeExercise.notes}</div>
                  )}
                </div>
              ) : (
                <div className="text-slate-600">Start a session to begin practicing.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Placeholder for additional cards */}
        </div>
      </main>
    </div>
  );
}
