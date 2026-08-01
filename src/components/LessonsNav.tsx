"use client";

import classNames from "classnames";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { LessonSummary } from "@/src/lib/lessons";

interface LessonsNavProps {
  lessons: LessonSummary[];
  selectedLessonTitle?: string;
  selectedLessonSlug?: string;
  basePath?: string;
  progressStorageKey?: string;
}

export function LessonsNav({
  lessons,
  selectedLessonTitle,
  selectedLessonSlug,
  basePath = "/lessons",
  progressStorageKey,
}: LessonsNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const focusRing =
    "focus:shadow-[inset_0_0_0_2px_#fbbf24] focus-visible:shadow-[inset_0_0_0_2px_#fbbf24]";

  useEffect(() => {
    if (!progressStorageKey) return;

    try {
      const storedValue = window.localStorage.getItem(progressStorageKey);
      if (!storedValue) return;

      const parsedValue: unknown = JSON.parse(storedValue);
      if (!Array.isArray(parsedValue)) return;

      const validLessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
      const completedSlugs = parsedValue.filter(
        (value): value is string => typeof value === "string" && validLessonSlugs.has(value),
      );

      setCompletedLessons(new Set(completedSlugs));
    } catch {
      setCompletedLessons(new Set());
    }
  }, [lessons, progressStorageKey]);

  useLayoutEffect(() => {
    if (!isOpen || !selectedLessonSlug) return;

    const container = listRef.current;
    const selected = container?.querySelector<HTMLElement>(`[data-slug="${selectedLessonSlug}"]`);
    if (!container || !selected) return;

    container.scrollTop = selected.offsetTop - container.offsetTop;
  }, [isOpen, selectedLessonSlug]);

  function toggleLessonCompletion(slug: string) {
    if (!progressStorageKey) return;

    setCompletedLessons((currentCompletedLessons) => {
      const nextCompletedLessons = new Set(currentCompletedLessons);

      if (nextCompletedLessons.has(slug)) {
        nextCompletedLessons.delete(slug);
      } else {
        nextCompletedLessons.add(slug);
      }

      try {
        window.localStorage.setItem(progressStorageKey, JSON.stringify([...nextCompletedLessons]));
      } catch {
        // Keep the in-memory state working if storage is unavailable.
      }

      return nextCompletedLessons;
    });
  }

  return (
    <nav
      aria-label="Lessons"
      className="min-w-0 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={classNames(
          "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/90 outline-none md:hidden",
          focusRing,
        )}
      >
        <span className="min-w-0">
          <span className="block text-xs uppercase tracking-[0.2em] text-white/55">Choose a lesson</span>
          <span className="mt-1 block truncate">{selectedLessonTitle ?? "Lessons"}</span>
        </span>
        <span
          aria-hidden="true"
          className={classNames("shrink-0 text-white/70 transition", isOpen && "rotate-180")}
        >
          ⌄
        </span>
      </button>

      <div className="hidden px-3 pb-3 text-sm font-semibold text-white/70 md:block">
        <span>Choose a lesson</span>
        {progressStorageKey ? (
          <span className="mt-1 block text-xs font-normal text-white/50" aria-live="polite">
            {completedLessons.size} of {lessons.length} completed
          </span>
        ) : null}
      </div>

      <div
        ref={listRef}
        className={classNames(
          "mt-3 min-w-0 flex-col gap-2 overflow-y-auto p-0.5 [overflow-anchor:none] md:mt-0 md:max-h-none",
          isOpen ? "flex max-md:max-h-[60vh]" : "hidden md:flex",
        )}
      >
        {lessons.map((lesson) => {
          const isSelected = lesson.slug === selectedLessonSlug;
          const isCompleted = completedLessons.has(lesson.slug);

          return (
            <div
              key={lesson.slug}
              data-slug={lesson.slug}
              className={classNames(
                "flex min-w-0 items-stretch overflow-hidden rounded-xl",
                isSelected ? "bg-white text-indigo-900" : "bg-white/10 text-white",
              )}
            >
              <Link
                href={`${basePath}?lesson=${lesson.slug}`}
                aria-current={isSelected ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={classNames(
                  "min-w-0 flex-1 px-4 py-3 text-left text-sm font-medium outline-none",
                  focusRing,
                  !isSelected && "transition-colors duration-150 hover:bg-white/10",
                )}
              >
                <span className={classNames("block truncate whitespace-nowrap", isCompleted && "line-through opacity-70")}>
                  {lesson.title}
                </span>
              </Link>

              {progressStorageKey ? (
                <button
                  type="button"
                  aria-pressed={isCompleted}
                  aria-label={`${isCompleted ? "Mark" : "Mark"} ${lesson.title} ${isCompleted ? "not done" : "done"}`}
                  title={isCompleted ? "Mark as not done" : "Mark as done"}
                  onClick={() => toggleLessonCompletion(lesson.slug)}
                  className={classNames(
                    "flex w-12 shrink-0 cursor-pointer items-center justify-center border-l outline-none transition-colors",
                    focusRing,
                    isSelected
                      ? "border-indigo-900/15 hover:bg-indigo-100"
                      : "border-white/10 hover:bg-white/10",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      "flex h-6 w-6 items-center justify-center rounded-full border text-sm font-bold",
                      isCompleted
                        ? isSelected
                          ? "border-indigo-700 bg-indigo-700 text-white"
                          : "border-emerald-300 bg-emerald-400 text-emerald-950"
                        : isSelected
                          ? "border-indigo-900/35 text-transparent"
                          : "border-white/35 text-transparent",
                    )}
                  >
                    ✓
                  </span>
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
