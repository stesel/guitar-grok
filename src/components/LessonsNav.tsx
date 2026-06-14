"use client";

import classNames from "classnames";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { LessonSummary } from "@/src/lib/lessons";

interface LessonsNavProps {
  lessons: LessonSummary[];
  selectedLessonTitle?: string;
  selectedLessonSlug?: string;
}

export function LessonsNav({ lessons, selectedLessonTitle, selectedLessonSlug }: LessonsNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const focusRing =
    "focus:shadow-[inset_0_0_0_2px_#fbbf24] focus-visible:shadow-[inset_0_0_0_2px_#fbbf24]";

  useLayoutEffect(() => {
    if (!isOpen || !selectedLessonSlug) return;

    const container = listRef.current;
    const selected = container?.querySelector<HTMLElement>(`[data-slug="${selectedLessonSlug}"]`);
    if (!container || !selected) return;

    container.scrollTop = selected.offsetTop - container.offsetTop;
  }, [isOpen, selectedLessonSlug]);

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

      <div className="hidden px-3 pb-3 text-sm font-semibold text-white/70 md:block">Choose a lesson</div>

      <div
        ref={listRef}
        className={classNames(
          "mt-3 min-w-0 flex-col gap-2 overflow-y-auto p-0.5 [overflow-anchor:none] md:mt-0 md:max-h-none",
          isOpen ? "flex max-md:max-h-[60vh]" : "hidden md:flex",
        )}
      >
        {lessons.map((lesson) => {
          const isSelected = lesson.slug === selectedLessonSlug;

          return (
            <Link
              key={lesson.slug}
              data-slug={lesson.slug}
              href={`/lessons?lesson=${lesson.slug}`}
              aria-current={isSelected ? "page" : undefined}
              onClick={() => setIsOpen(false)}
              className={classNames(
                "w-full rounded-xl px-4 py-3 text-left text-sm font-medium outline-none",
                focusRing,
                isSelected
                  ? "bg-white text-indigo-900"
                  : "bg-white/10 text-white transition-colors duration-150 hover:bg-white/20",
              )}
            >
              <span className="block truncate whitespace-nowrap">{lesson.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
