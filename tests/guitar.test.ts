import { computeStreak, generateSession, Exercise, Attempt } from "../src/utils/guitar";
import { describe, it, expect } from "vitest";
import { getTablatureBlocks, isTablature } from "../src/lib/lesson-tablature";

describe("computeStreak", () => {
  it("returns zero for no attempts", () => {
    const res = computeStreak([]);
    expect(res).toEqual({ current: 0, best: 0 });
  });

  it("computes current and best streak", () => {
    const attempts: Attempt[] = [
      { id: "1", exerciseId: "a", bpmUsed: 100, status: "done", timestamp: "2024-01-01T00:00:00.000Z" },
      { id: "2", exerciseId: "a", bpmUsed: 100, status: "done", timestamp: "2024-01-02T00:00:00.000Z" },
      { id: "3", exerciseId: "a", bpmUsed: 100, status: "done", timestamp: "2024-01-04T00:00:00.000Z" },
    ];
    const res = computeStreak(attempts);
    expect(res.best).toBe(2);
  });
});

describe("lesson tablature metadata", () => {
  it("detects guitar tabs but ignores ordinary text diagrams", () => {
    expect(isTablature("e|--5-8--\nB|--5-8--")).toBe(true);
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
      "```text",
      "e|--8-5--",
      "B|--8-5--",
      "```",
    ].join("\n");

    expect(getTablatureBlocks(content, "picking")).toEqual([
      { startLine: 3, title: "Exercise 1 — Bursts — Part 1", id: "picking:exercise-1-bursts:1" },
      { startLine: 7, title: "Exercise 1 — Bursts — Part 2", id: "picking:exercise-1-bursts:2" },
    ]);
  });
});

describe("generateSession", () => {
  const exercises: Exercise[] = [
    { id: "e1", title: "Ex1", bpmMin: 60, bpmMax: 80, key: "C", estMinutes: 5, difficulty: "easy", tags: [], createdAt: "", updatedAt: "" },
    { id: "e2", title: "Ex2", bpmMin: 60, bpmMax: 80, key: "C", estMinutes: 5, difficulty: "easy", tags: [], createdAt: "", updatedAt: "" },
  ];

  it("fills requested minutes", () => {
    const sess = generateSession(exercises, 10);
    const total = sess.items.reduce((sum, i) => sum + i.plannedMinutes, 0);
    expect(total).toBe(10);
    expect(sess.items.length).toBeGreaterThan(0);
  });
});
