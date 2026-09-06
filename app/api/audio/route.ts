import { readdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

const SUPPORTED_AUDIO = /\.(mp3|wav)$/i;

export async function GET() {
  const audioDirectory = path.join(process.cwd(), "public", "audio");

  try {
    const entries = await readdir(audioDirectory, { withFileTypes: true });
    const tracks = entries
      .filter((entry) => entry.isFile() && SUPPORTED_AUDIO.test(entry.name))
      .map((entry) => ({
        name: entry.name.replace(SUPPORTED_AUDIO, ""),
        url: `/audio/${encodeURIComponent(entry.name)}`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));

    return NextResponse.json({ tracks });
  } catch (error) {
    const code = error instanceof Error && "code" in error ? (error as NodeJS.ErrnoException).code : undefined;
    if (code === "ENOENT") return NextResponse.json({ tracks: [] });
    return NextResponse.json({ tracks: [] }, { status: 500 });
  }
}
