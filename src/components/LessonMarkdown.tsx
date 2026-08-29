"use client";

import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTablatureBlocks, type TablatureBlock as TablatureBlockInfo } from "@/src/lib/lessonTablature";
import { PREPARE_EXERCISE_EVENT, type StartExerciseDetail } from "@/src/lib/metronomeEvents";

interface LessonMarkdownProps {
  content: string;
  lessonSlug: string;
  lessonTitle: string;
}

function TablatureBlock({
  children,
  exercise,
  lessonSlug,
  lessonTitle,
}: {
  children: ReactNode;
  exercise: TablatureBlockInfo;
  lessonSlug: string;
  lessonTitle: string;
}) {
  const startExercise = () => {
    const detail: StartExerciseDetail = {
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      lessonSlug,
      lessonTitle,
    };
    window.dispatchEvent(new CustomEvent<StartExerciseDetail>(PREPARE_EXERCISE_EVENT, { detail }));
  };

  return (
    <figure
      title={exercise.title}
      data-exercise-id={exercise.id}
      data-exercise-title={exercise.title}
      data-lesson-slug={lessonSlug}
      data-lesson-title={lessonTitle}
      className="overflow-hidden rounded-xl border border-white/15 bg-black/40"
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/15 px-3 py-2 sm:px-4">
        <span className="min-w-0 truncate text-sm font-medium text-white/80">{exercise.title}</span>
        <button
          type="button"
          onClick={startExercise}
          className="shrink-0 cursor-pointer rounded-lg bg-amber-300 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={`Prepare ${exercise.title} with metronome`}
        >
          ▶ Practice
        </button>
      </figcaption>
      <pre className="max-w-full overflow-x-auto p-4 text-sm leading-6 text-white/90">{children}</pre>
    </figure>
  );
}

export default function LessonMarkdown({ content, lessonSlug, lessonTitle }: LessonMarkdownProps) {
  const codeBlocks = new Map(
    getTablatureBlocks(content, lessonSlug, lessonTitle).map((block) => [block.startLine, block]),
  );

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
            <TablatureBlock
              exercise={exercise}
              lessonSlug={lessonSlug}
              lessonTitle={lessonTitle}
            >
              {children}
            </TablatureBlock>
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
