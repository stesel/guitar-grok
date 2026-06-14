import type { Metadata } from "next";
import Link from "next/link";
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

function renderMarkdown(content: string) {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return blocks.map((block, index) => {
    if (block.startsWith("# ")) {
      return (
        <h2 key={index} className="text-3xl font-bold">
          {block.replace(/^#\s+/, "")}
        </h2>
      );
    }

    if (block.startsWith("## ")) {
      return (
        <h3 key={index} className="text-2xl font-semibold">
          {block.replace(/^##\s+/, "")}
        </h3>
      );
    }

    if (block.startsWith("- ")) {
      return (
        <ul key={index} className="list-disc space-y-2 pl-6 text-white/85">
          {block.split("\n").map((item) => (
            <li key={item}>{item.replace(/^-\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="leading-7 text-white/85">
        {block}
      </p>
    );
  });
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
            <div className="space-y-5">{renderMarkdown(selectedLesson.content)}</div>
          ) : (
            <p className="text-white/80">Add Markdown files to content/lessons to create lessons.</p>
          )}
        </article>
      </div>
    </main>
  );
}
