import { computeStreak, generateSession, Exercise, Attempt } from "../src/utils/guitar";
import { describe, it, expect } from "vitest";

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
