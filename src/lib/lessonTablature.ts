export interface TablatureBlock {
  startLine: number;
  title: string;
  id: string;
}

const HEADING_PATTERN = /^#{1,6}\s+(.+?)\s*#*\s*$/;
const FENCE_PATTERN = /^```(?:text|tab|tablature)?\s*$/i;
const TAB_LINE_PATTERN = /^\s*(?:[A-Ga-g](?:#|b)?|[1-6])\s*\|[^|]*[-xX0-9hHpPbBrR/\\~()]+/;

export function isTablature(value: string): boolean {
  return value.split("\n").filter((line) => TAB_LINE_PATTERN.test(line)).length >= 2;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "exercise";
}

export function getTablatureBlocks(
  content: string,
  lessonSlug: string,
  lessonTitle: string,
): TablatureBlock[] {
  const lines = content.split("\n");
  const detectedBlocks: Array<{ startLine: number; heading: string }> = [];
  let currentHeading = lessonTitle;

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(HEADING_PATTERN)?.[1];
    if (heading) currentHeading = heading.replace(/[*_`]/g, "").trim();
    if (!FENCE_PATTERN.test(lines[index])) continue;

    const startLine = index + 1;
    const codeLines: string[] = [];
    index += 1;
    while (index < lines.length && lines[index].trim() !== "```") {
      codeLines.push(lines[index]);
      index += 1;
    }

    if (isTablature(codeLines.join("\n"))) {
      detectedBlocks.push({ startLine, heading: currentHeading });
    }
  }

  const totals = detectedBlocks.reduce((result, block) => {
    result.set(block.heading, (result.get(block.heading) ?? 0) + 1);
    return result;
  }, new Map<string, number>());
  const occurrences = new Map<string, number>();

  return detectedBlocks.map((block) => {
    const occurrence = (occurrences.get(block.heading) ?? 0) + 1;
    occurrences.set(block.heading, occurrence);
    const title = totals.get(block.heading) === 1
      ? block.heading
      : `${block.heading} — Part ${occurrence}`;

    return {
      startLine: block.startLine,
      title,
      id: `${lessonSlug}:${slugify(block.heading)}:${occurrence}`,
    };
  });
}
