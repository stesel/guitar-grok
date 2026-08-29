"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PRACTICE_HISTORY_STORAGE_KEY,
  PRACTICE_HISTORY_UPDATED_EVENT,
  clearPracticeHistory,
  deletePracticeRecord,
  formatDuration,
  groupPracticeHistory,
  readPracticeHistory,
  type PracticeRecord,
} from "@/src/lib/practiceHistory";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function HistoryPage() {
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const lessons = useMemo(() => groupPracticeHistory(records), [records]);
  const totalDuration = records.reduce((sum, record) => sum + record.durationSeconds, 0);

  useEffect(() => {
    const refresh = () => {
      setRecords(readPracticeHistory());
      setIsLoaded(true);
    };
    const refreshFromStorage = (event: StorageEvent) => {
      if (event.key === PRACTICE_HISTORY_STORAGE_KEY) refresh();
    };

    refresh();
    window.addEventListener(PRACTICE_HISTORY_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refreshFromStorage);
    return () => {
      window.removeEventListener(PRACTICE_HISTORY_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refreshFromStorage);
    };
  }, []);

  const removeRecord = (id: string) => {
    setRecords(deletePracticeRecord(id));
  };

  const clearAll = () => {
    if (!window.confirm("Delete all practice history from this browser?")) return;
    clearPracticeHistory();
    setRecords([]);
  };

  if (!isLoaded) {
    return <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/10" aria-label="Loading practice history" />;
  }

  if (records.length === 0) {
    return (
      <section className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur sm:p-10">
        <div className="text-4xl" aria-hidden="true">♪</div>
        <h2 className="mt-3 text-xl font-semibold">No practice sessions yet</h2>
        <p className="mx-auto mt-2 max-w-lg text-white/70">
          Open a lesson and start the metronome from a tablature exercise. Sessions lasting at least two seconds appear here after you stop.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
          <p className="text-sm text-white/60">Completed sessions</p>
          <p className="mt-1 text-3xl font-bold">{records.length}</p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
          <p className="text-sm text-white/60">Total practice time</p>
          <p className="mt-1 text-3xl font-bold">{formatDuration(totalDuration)}</p>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={clearAll}
          className="cursor-pointer rounded-lg border border-rose-300/40 px-3 py-2 text-sm font-medium text-rose-100 hover:bg-rose-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Clear history
        </button>
      </div>

      {lessons.map((lesson) => (
        <details
          key={lesson.lessonSlug}
          open
          className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur"
        >
          <summary className="cursor-pointer list-none px-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-amber-300 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{lesson.lessonTitle}</h2>
                <p className="text-sm text-white/60">
                  {lesson.sessionCount} {lesson.sessionCount === 1 ? "session" : "sessions"} · {formatDuration(lesson.totalDurationSeconds)}
                </p>
              </div>
              <span className="text-white/50" aria-hidden="true">⌄</span>
            </div>
          </summary>

          <div className="space-y-4 border-t border-white/15 p-4 sm:p-6">
            {lesson.exercises.map((exercise) => (
              <section key={exercise.exerciseId} className="overflow-hidden rounded-xl border border-white/15 bg-black/20">
                <div className="border-b border-white/10 p-4">
                  <h3 className="font-semibold">{exercise.exerciseTitle}</h3>
                  <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="text-white/50">Sessions</dt>
                      <dd className="font-medium">{exercise.sessionCount}</dd>
                    </div>
                    <div>
                      <dt className="text-white/50">Total time</dt>
                      <dd className="font-medium">{formatDuration(exercise.totalDurationSeconds)}</dd>
                    </div>
                    <div>
                      <dt className="text-white/50">Latest tempo</dt>
                      <dd className="font-medium">{exercise.latestBpm} BPM</dd>
                    </div>
                    <div>
                      <dt className="text-white/50">Highest tempo</dt>
                      <dd className="font-medium">{exercise.highestBpm} BPM</dd>
                    </div>
                  </dl>
                </div>

                <ul className="divide-y divide-white/10">
                  {exercise.sessions.map((session) => (
                    <li key={session.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{dateFormatter.format(new Date(session.startedAt))}</p>
                        <p className="text-sm text-white/60">{session.bpm} BPM · {formatDuration(session.durationSeconds)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRecord(session.id)}
                        className="shrink-0 cursor-pointer rounded-lg px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        aria-label={`Delete session from ${dateFormatter.format(new Date(session.startedAt))}`}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
