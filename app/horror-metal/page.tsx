import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LessonsNav } from "@/src/components/LessonsNav";
import { getLesson, getLessons } from "@/src/lib/lessons";

export const metadata: Metadata = {
  title: "Horror Metal Course - Guitar Grok",
  description: "A progressive Guitar Pro course for writing groove-first horror metal riffs",
};

interface HorrorMetalPageProps {
  searchParams?: {
    lesson?: string;
  };
}

function LessonMarkdown({ content }: { content: string }) {
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
        pre: ({ children }) => (
          <pre className="max-w-full overflow-x-auto rounded-xl bg-black/40 p-4 text-sm leading-6 text-white/90">
            {children}
          </pre>
        ),
        code: ({ children }) => <code className="font-mono">{children}</code>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default async function HorrorMetalPage({ searchParams }: HorrorMetalPageProps) {
  const allLessons = await getLessons();
  const lessons = allLessons.filter((lesson) => lesson.slug.startsWith("horror-metal-"));
  const selectedSlug = searchParams?.lesson ?? lessons[0]?.slug;
  const selectedLesson = selectedSlug ? await getLesson(selectedSlug) : null;
  const courseLesson = selectedLesson?.slug.startsWith("horror-metal-") ? selectedLesson : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 overflow-x-hidden px-4 py-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Guitar Pro course</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">Horror Metal Riff Writing</h1>
        <p className="mt-3 max-w-3xl leading-7 text-white/75">
          Build groove, tension and memorable riffs through progressive exercises designed for Guitar Pro 8.
        </p>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-[18rem_minmax(0,1fr)]">
        <LessonsNav
          lessons={lessons}
          selectedLessonSlug={courseLesson?.slug ?? lessons[0]?.slug}
          selectedLessonTitle={courseLesson?.title ?? lessons[0]?.title}
          basePath="/horror-metal"
          progressStorageKey="guitar-grok:horror-metal:completed-lessons"
        />

        <article className="min-w-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur sm:p-6 md:p-8">
          {courseLesson ? (
            <div className="min-w-0 space-y-5">
              <LessonMarkdown content={courseLesson.content} />
            </div>
          ) : (
            <p className="text-white/80">Choose a lesson from the course navigation.</p>
          )}
        </article>
      </div>
    </main>
  );
}
