import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
        h1: ({ children }) => <h2 className="text-3xl font-bold">{children}</h2>,
        h2: ({ children }) => <h3 className="text-2xl font-semibold">{children}</h3>,
        h3: ({ children }) => <h4 className="text-xl font-semibold">{children}</h4>,
        p: ({ children }) => <p className="leading-7 text-white/85">{children}</p>,
        ul: ({ children }) => <ul className="list-disc space-y-2 pl-6 text-white/85">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6 text-white/85">{children}</ol>,
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        hr: () => <hr className="border-white/15" />,
        pre: ({ children }) => (
          <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 text-sm leading-6 text-white/90">
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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Library</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">Lessons</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-[18rem_1fr]">
        <nav
          aria-label="Lessons"
          className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur"
        >
          <div className="mb-3 px-3 text-sm font-semibold text-white/70">Choose a lesson</div>
          <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {lessons.map((lesson) => {
              const isSelected = lesson.slug === selectedLesson?.slug;

              return (
                <Link
                  key={lesson.slug}
                  href={`/lessons?lesson=${lesson.slug}`}
                  aria-current={isSelected ? "page" : undefined}
                  className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white/70 ${
                    isSelected ? "bg-white text-indigo-900" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {lesson.title}
                </Link>
              );
            })}
          </div>
        </nav>

        <article className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur md:p-8">
          {selectedLesson ? (
            <div className="space-y-5">
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
