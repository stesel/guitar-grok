"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Attempt,
  AttemptStatus,
  Exercise,
  Session,
  computeStreak,
  generateSession,
  seedExercises,
  uid,
} from "@/src/utils/guitar";
import {
  getExercises,
  getAttempts,
  getSessions,
  upsertExercise,
  insertSession,
  insertAttempt,
} from "@/src/lib/db";
import dynamic from "next/dynamic";

const Metronome = dynamic(() => import("./Metronome"), { ssr: false });

export default function GuitarDailyMvp() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [length, setLength] = useState(30);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bpm, setBpm] = useState(90);
  const [countIn] = useState(1);

  const streak = useMemo(() => computeStreak(attempts), [attempts]);

  useEffect(() => {
    void (async () => {
      const [exs, atts, sess] = await Promise.all([
        getExercises(),
        getAttempts(),
        getSessions(),
      ]);
      if (exs.length === 0) {
        for (const se of seedExercises) {
          // seed default exercises
          // eslint-disable-next-line no-await-in-loop
          await upsertExercise(se);
        }
        setExercises(seedExercises);
      } else {
        setExercises(exs);
      }
      setAttempts(atts);
      setSessions(sess);
    })();
  }, []);

  const activeExercise: Exercise | null = useMemo(() => {
    if (!currentSession) return null;
    const item = currentSession.items[activeIndex];
    if (!item) return null;
    return exercises.find((e) => e.id === item.exerciseId) || null;
  }, [currentSession, activeIndex, exercises]);

  async function startSession() {
    const sess = generateSession(exercises, length);
    setCurrentSession(sess);
    setSessions((prev) => [sess, ...prev]);
    setActiveIndex(0);
    const first = exercises.find((e) => e.id === sess.items[0]?.exerciseId);
    if (first) setBpm(Math.round((first.bpmMin + first.bpmMax) / 2));
    await insertSession(sess);
  }

  function nextExercise() {
    setActiveIndex((i) =>
      Math.min(i + 1, (currentSession?.items.length || 1) - 1),
    );
  }

  function prevExercise() {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }

  async function logAttempt(status: AttemptStatus) {
    if (!activeExercise) return;
    const a: Attempt = {
      id: uid("att"),
      exerciseId: activeExercise.id,
      bpmUsed: bpm,
      status,
      timestamp: new Date().toISOString(),
    };
    setAttempts((prev) => [a, ...prev]);
    await insertAttempt(a);
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-3">
      <div className="space-y-6 md:col-span-2">
        <div className="flex items-center gap-3 text-sm">
          <div>
            Streak: <span className="font-semibold">{streak.current}</span> (best {streak.best})
          </div>
          <div>Sessions: {sessions.length}</div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
          <div className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-white/80">Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-white"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                </select>
              </div>
              <button
                onClick={() => void startSession()}
                className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
              >
                Start Session
              </button>
              {currentSession && (
                <div className="text-sm text-white/80">
                  {currentSession.items.length} items · planned {currentSession.totalPlanned} min
                </div>
              )}
            </div>

            {currentSession && (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {currentSession.items.map((it, idx) => {
                  const ex = exercises.find((e) => e.id === it.exerciseId);
                  if (!ex) return null;
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`text-left rounded-xl border p-3 hover:bg-white/20 ${
                        active ? "border-indigo-400 ring-2 ring-indigo-200" : "border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{ex.title}</div>
                      </div>
                      <div className="mt-1 text-xs text-white/70">
                        {ex.key} · {ex.bpmMin}-{ex.bpmMax} BPM · {it.plannedMinutes} min
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <button
              onClick={prevExercise}
              className="rounded-lg border border-white/20 p-2 hover:bg-white/20"
            >
              Prev
            </button>
            <button
              onClick={nextExercise}
              className="rounded-lg border border-white/20 p-2 hover:bg-white/20"
            >
              Next
            </button>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
          <div className="text-xl font-semibold">
            {activeExercise?.title || "Select an exercise"}
          </div>
          {activeExercise && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-white/80">BPM</label>
                <input
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-20 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-white"
                />
              </div>
              <Metronome
                bpm={bpm}
                countIn={countIn}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => void logAttempt("done")}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium hover:bg-green-700"
                >
                  Success
                </button>
                <button
                  onClick={() => void logAttempt("fail")}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium hover:bg-red-700"
                >
                  Fail
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
          <div className="text-lg font-semibold">Past Sessions</div>
          <ul className="space-y-1 text-sm">
            {sessions.map((s) => (
              <li key={s.id}>{s.date}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
