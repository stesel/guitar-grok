import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface LessonSummary {
  slug: string;
  title: string;
}

export interface Lesson extends LessonSummary {
  content: string;
}

const lessonsDirectory = path.join(process.cwd(), "content", "lessons");

function fileNameToSlug(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}

function titleFromMarkdown(content: string, slug: string): string {
  const heading = content
    .split("\n")
    .find((line) => line.trim().startsWith("# "))
    ?.replace(/^#\s+/, "")
    .trim();

  if (heading) {
    return heading;
  }

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getLessons(): Promise<LessonSummary[]> {
  const files = await readdir(lessonsDirectory);
  const markdownFiles = files.filter((file) => file.endsWith(".md")).sort();

  return Promise.all(
    markdownFiles.map(async (fileName) => {
      const slug = fileNameToSlug(fileName);
      const content = await readFile(path.join(lessonsDirectory, fileName), "utf8");

      return {
        slug,
        title: titleFromMarkdown(content, slug),
      };
    }),
  );
}

export async function getLesson(slug: string): Promise<Lesson | null> {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "");

  if (!safeSlug) {
    return null;
  }

  try {
    const content = await readFile(path.join(lessonsDirectory, `${safeSlug}.md`), "utf8");

    return {
      slug: safeSlug,
      title: titleFromMarkdown(content, safeSlug),
      content,
    };
  } catch {
    return null;
  }
}
