import type { Metadata } from "next";
import LessonMarkdown from "@/src/components/LessonMarkdown";
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

export default async function LessonsPage({ searchParams }: LessonsPageProps) {
  const allLessons = await getLessons();
  const lessons = allLessons.filter((lesson) => !lesson.slug.startsWith("horror-metal-"));
  const requestedSlug = searchParams?.lesson;
  const selectedSlug = lessons.some((lesson) => lesson.slug === requestedSlug)
    ? requestedSlug
    : lessons[0]?.slug;
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
              <LessonMarkdown
                content={selectedLesson.content}
                lessonSlug={selectedLesson.slug}
                lessonTitle={selectedLesson.title}
              />
            </div>
          ) : (
            <p className="text-white/80">Add Markdown files to content/lessons to create lessons.</p>
          )}
        </article>
      </div>
    </main>
  );
}
