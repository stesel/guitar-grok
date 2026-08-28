export interface TablatureBlock {
  startLine: number;
  title: string;
  id: string;
}

const HEADING_PATTERN = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const FENCE_PATTERN = /^```(?:text|tab|tablature)?\s*$/i;
const TAB_LINE_PATTERN = /^\s*(?:[A-Ga-g](?:#|b)?|[1-6])?\s*\|[^|]*[-xX0-9hHpPbBrR/\\~()]+/;

export function isTablature(value: string): boolean {
  const tabLines = value.split("\n").filter((line) => TAB_LINE_PATTERN.test(line));
  return tabLines.length >= 2;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "exercise";
}

export function getTablatureBlocks(content: string, lessonSlug: string): TablatureBlock[] {
  const lines = content.split("\n");
  const blocks: Array<{ startLine: number; heading: string }> = [];
  let currentHeading = "Exercise";

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(HEADING_PATTERN);
    if (heading) currentHeading = heading[2].replace(/[*_`]/g, "").trim();

    if (!FENCE_PATTERN.test(lines[index])) continue;

    const closingFence = lines.findIndex((line, candidateIndex) => candidateIndex > index && line.trim() === "```");
    if (closingFence === -1) break;

    const value = lines.slice(index + 1, closingFence).join("\n");
    if (isTablature(value)) blocks.push({ startLine: index + 1, heading: currentHeading });
    index = closingFence;
  }

  const counts = new Map<string, number>();
  const totals = blocks.reduce((result, block) => {
    result.set(block.heading, (result.get(block.heading) ?? 0) + 1);
    return result;
  }, new Map<string, number>());

  return blocks.map((block) => {
    const sequence = (counts.get(block.heading) ?? 0) + 1;
    counts.set(block.heading, sequence);
    const title = totals.get(block.heading) === 1 ? block.heading : `${block.heading} — Part ${sequence}`;

    return {
      startLine: block.startLine,
      title,
      id: `${lessonSlug}:${slugify(block.heading)}:${sequence}`,
    };
  });
}
