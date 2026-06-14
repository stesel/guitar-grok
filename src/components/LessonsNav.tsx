"use client";

import Link from "next/link";
import { useState } from "react";
import type { LessonSummary } from "@/src/lib/lessons";

interface LessonsNavProps {
  lessons: LessonSummary[];
  selectedLessonTitle?: string;
  selectedLessonSlug?: string;
}

export function LessonsNav({ lessons, selectedLessonTitle, selectedLessonSlug }: LessonsNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      aria-label="Lessons"
      className="min-w-0 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur"
    >
      <details
        className="group min-w-0 md:block"
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/90 transition focus:outline-none focus:ring-2 focus:ring-white/70 md:hidden [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-[0.2em] text-white/55">Choose a lesson</span>
            <span className="mt-1 block truncate">{selectedLessonTitle ?? "Lessons"}</span>
          </span>
          <span aria-hidden="true" className="shrink-0 text-white/70 transition group-open:rotate-180">⌄</span>
        </summary>

        <div className="hidden px-3 pb-3 text-sm font-semibold text-white/70 md:block">Choose a lesson</div>
        <div className="mt-3 hidden max-h-[60vh] min-w-0 flex-col gap-2 overflow-y-auto group-open:flex md:mt-0 md:flex md:max-h-none md:overflow-visible md:pb-0">
          {lessons.map((lesson) => {
            const isSelected = lesson.slug === selectedLessonSlug;

            return (
              <Link
                key={lesson.slug}
                href={`/lessons?lesson=${lesson.slug}`}
                aria-current={isSelected ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={`w-full truncate whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white/70 ${
                  isSelected ? "bg-white text-indigo-900" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {lesson.title}
              </Link>
            );
          })}
        </div>
      </details>
    </nav>
  );
}
