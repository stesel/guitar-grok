"use client";

import Link from "next/link";
import { useState } from "react";
import type { LessonSummary } from "@/src/lib/lessons";

interface LessonsNavProps {
  lessons: LessonSummary[];
  selectedSlug?: string;
}

export default function LessonsNav({ lessons, selectedSlug }: LessonsNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLesson = lessons.find((lesson) => lesson.slug === selectedSlug);

  return (
    <nav
      aria-label="Lessons"
      className="min-w-0 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="lessons-nav-list"
        className="flex w-full items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white/90 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70 md:hidden"
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
      >
        <span className="min-w-0 truncate">{selectedLesson?.title ?? "Choose a lesson"}</span>
        <span aria-hidden="true" className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      <div className="mb-3 hidden px-3 text-sm font-semibold text-white/70 md:block">Choose a lesson</div>
      <div
        id="lessons-nav-list"
        className={`${isOpen ? "mt-3 flex" : "hidden"} min-w-0 gap-2 overflow-x-auto pb-1 md:mt-0 md:flex md:flex-col md:overflow-visible md:pb-0`}
      >
        {lessons.map((lesson) => {
          const isSelected = lesson.slug === selectedSlug;

          return (
            <Link
              key={lesson.slug}
              href={`/lessons?lesson=${lesson.slug}`}
              aria-current={isSelected ? "page" : undefined}
              className={`max-w-[78vw] shrink-0 truncate whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white/70 md:max-w-full ${
                isSelected ? "bg-white text-indigo-900" : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {lesson.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
