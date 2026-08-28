"use client";

import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { START_EXERCISE_EVENT, type StartExerciseDetail } from "@/src/lib/metronomeEvents";

interface LessonMarkdownProps {
  content: string;
  lessonSlug: string;
  lessonTitle: string;
}

interface CodeBlockInfo {
  id: string;
  title: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "exercise";
}

function getCodeBlocks(content: string, lessonSlug: string, lessonTitle: string): Map<number, CodeBlockInfo> {
  const lines = content.split("\n");
  const blocks = new Map<number, CodeBlockInfo>();
  let currentHeading = lessonTitle;
  const headingOccurrences = new Map<string, number>();

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(/^#{1,6}\s+(.+)$/)?.[1]?.trim();
    if (heading) currentHeading = heading;
    if (!lines[index].startsWith("```")) continue;

    const startLine = index + 1;
    const codeLines: string[] = [];
    index += 1;
    while (index < lines.length && !lines[index].startsWith("```")) {
      codeLines.push(lines[index]);
      index += 1;
    }

    const stringLines = codeLines.filter((line) => /^\s*[eBGDAE]\|/.test(line));
    const isTablature = stringLines.length >= 2;
    if (isTablature) {
      const headingSlug = slugify(currentHeading);
      const occurrence = (headingOccurrences.get(headingSlug) ?? 0) + 1;
      headingOccurrences.set(headingSlug, occurrence);
      blocks.set(startLine, {
        id: `${lessonSlug}:${headingSlug}:${occurrence}`,
        title: currentHeading,
      });
    }
  }

  return blocks;
}

function TablatureBlock({
  children,
  exercise,
  lessonSlug,
}: {
  children: ReactNode;
  exercise: CodeBlockInfo;
  lessonSlug: string;
}) {
  const startExercise = () => {
    const detail: StartExerciseDetail = {
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      lessonSlug,
    };
    window.dispatchEvent(new CustomEvent<StartExerciseDetail>(START_EXERCISE_EVENT, { detail }));
  };

  return (
    <figure
      title={exercise.title}
      data-exercise-id={exercise.id}
      data-exercise-title={exercise.title}
      className="overflow-hidden rounded-xl border border-white/15 bg-black/40"
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/15 px-3 py-2 sm:px-4">
        <span className="min-w-0 truncate text-sm font-medium text-white/80">{exercise.title}</span>
        <button
          type="button"
          onClick={startExercise}
          className="shrink-0 cursor-pointer rounded-lg bg-amber-300 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={`Start ${exercise.title} with metronome`}
        >
          ▶ Start
        </button>
      </figcaption>
      <pre className="max-w-full overflow-x-auto p-4 text-sm leading-6 text-white/90">{children}</pre>
    </figure>
  );
}

export default function LessonMarkdown({ content, lessonSlug, lessonTitle }: LessonMarkdownProps) {
  const codeBlocks = getCodeBlocks(content, lessonSlug, lessonTitle);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h2 className="break-words text-2xl font-bold leading-tight sm:text-3xl">{children}</h2>,
        h2: ({ children }) => <h3 className="break-words text-xl font-semibold leading-tight sm:text-2xl">{children}</h3>,
        h3: ({ children }) => <h4 className="break-words text-lg font-semibold leading-tight sm:text-xl">{children}</h4>,
        p: ({ children }) => <p className="break-words leading-7 text-white/85">{children}</p>,
        ul: ({ children }) => <ul className="list-disc space-y-2 pl-6 text-white/85">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6 text-white/85">{children}</ol>,
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        hr: () => <hr className="border-white/15" />,
        pre: ({ children, node }) => {
          const exercise = node?.position?.start.line ? codeBlocks.get(node.position.start.line) : undefined;
          return exercise ? (
            <TablatureBlock exercise={exercise} lessonSlug={lessonSlug}>{children}</TablatureBlock>
          ) : (
            <pre className="max-w-full overflow-x-auto rounded-xl bg-black/40 p-4 text-sm leading-6 text-white/90">
              {children}
            </pre>
          );
        },
        code: ({ children }) => <code className="font-mono">{children}</code>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
