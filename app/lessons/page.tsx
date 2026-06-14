import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LessonsNav } from "@/src/components/LessonsNav";
import { getLesson, getLessons } from "@/src/lib/lessons";

export const metadata: Metadata = {
  title: "Lessons - Guitar Grok",
  description: "Browse guitar lesson notes and practice plans",
};

interface LessonsPageProps {
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

export default async function LessonsPage({ searchParams }: LessonsPageProps) {
  const lessons = await getLessons();
  const selectedSlug = searchParams?.lesson ?? lessons[0]?.slug;
  const selectedLesson = selectedSlug ? await getLesson(selectedSlug) : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 overflow-x-hidden px-4 py-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Library</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">Lessons</h1>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-[18rem_minmax(0,1fr)]">
        <LessonsNav
          lessons={lessons}
          selectedLessonSlug={selectedLesson?.slug}
          selectedLessonTitle={selectedLesson?.title}
        />

        <article className="min-w-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur sm:p-6 md:p-8">
          {selectedLesson ? (
            <div className="min-w-0 space-y-5">
              <LessonMarkdown content={selectedLesson.content} />
            </div>
          ) : (
            <p className="text-white/80">Add Markdown files to content/lessons to create lessons.</p>
          )}
        </article>
      </div>
    </main>
  );
}
