"use client";

import type { ReactNode } from "react";
import { START_EXERCISE_EVENT, type StartExerciseDetail } from "@/src/lib/metronome-events";

interface ExerciseTablatureProps {
  children: ReactNode;
  exerciseId: string;
  exerciseTitle: string;
  lessonId: string;
  lessonTitle: string;
}

export default function ExerciseTablature({
  children,
  exerciseId,
  exerciseTitle,
  lessonId,
  lessonTitle,
}: ExerciseTablatureProps) {
  const startExercise = () => {
    const detail: StartExerciseDetail = { exerciseId, exerciseTitle, lessonId, lessonTitle };
    window.dispatchEvent(new CustomEvent<StartExerciseDetail>(START_EXERCISE_EVENT, { detail }));
  };

  return (
    <figure
      className="relative max-w-full overflow-hidden rounded-xl bg-black/40"
      title={exerciseTitle}
      data-exercise-id={exerciseId}
      data-exercise-title={exerciseTitle}
      data-lesson-id={lessonId}
      data-lesson-title={lessonTitle}
    >
      <figcaption className="flex min-h-12 items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className="truncate text-sm font-medium text-white/70">{exerciseTitle}</span>
        <button
          type="button"
          onClick={startExercise}
          className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-amber-300 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          aria-label={`Start exercise: ${exerciseTitle}`}
          title={`Start ${exerciseTitle}`}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M5.5 3.8a1 1 0 0 1 1.52-.85l9.25 6.2a1 1 0 0 1 0 1.7l-9.25 6.2a1 1 0 0 1-1.52-.85V3.8Z" />
          </svg>
          <span className="hidden sm:inline">Start exercise</span>
        </button>
      </figcaption>
      <pre className="max-w-full overflow-x-auto p-4 text-sm leading-6 text-white/90">{children}</pre>
    </figure>
  );
}
