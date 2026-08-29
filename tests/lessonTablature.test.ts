import { describe, expect, it } from "vitest";
import { getTablatureBlocks, isTablature } from "../src/lib/lessonTablature";

describe("lesson tablature metadata", () => {
  it("detects labelled guitar tabs but ignores ordinary text diagrams", () => {
    expect(isTablature("e|--5-8--\nB|--5-8--")).toBe(true);
    expect(isTablature("F#|--2-5--\nC#|--2-5--")).toBe(true);
    expect(isTablature("1|--5-8--\n2|--5-8--")).toBe(true);
    expect(isTablature("Guitar → Amp → Cabinet")).toBe(false);
  });

  it("uses the nearest heading and creates stable, unique exercise ids", () => {
    const content = [
      "# Picking lesson",
      "## Exercise 1 — Bursts",
      "```text",
      "e|--5-8--",
      "B|--5-8--",
      "```",
      "```tab",
      "e|--8-5--",
      "B|--8-5--",
      "```",
    ].join("\n");

    expect(getTablatureBlocks(content, "picking", "Picking lesson")).toEqual([
      { startLine: 3, title: "Exercise 1 — Bursts — Part 1", id: "picking:exercise-1-bursts:1" },
      { startLine: 7, title: "Exercise 1 — Bursts — Part 2", id: "picking:exercise-1-bursts:2" },
    ]);
  });

  it("uses the lesson title when a tab appears before any heading", () => {
    const content = "```tablature\ne|--0--\nB|--0--\n```";

    expect(getTablatureBlocks(content, "open-strings", "Open Strings")).toEqual([
      { startLine: 1, title: "Open Strings", id: "open-strings:open-strings:1" },
    ]);
  });
});
